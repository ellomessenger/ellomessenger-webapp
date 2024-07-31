import Api from '../tl/api';
import type TelegramClient from './TelegramClient';
import utils from '../Utils';
import { sleep } from '../Helpers';
import { computeCheck as computePasswordSrpCheck } from '../Password';

export interface UserAuthParams {
  phoneNumber: string | (() => Promise<string>);
  webAuthTokenFailed: () => void;
  phoneCode: () => Promise<[string, string]>;
  password: () => Promise<[string, string?]>;
  registrationCode: () => Promise<[string, string]>;
  qrCode: (qrCode: { token: Buffer; expires: number }) => Promise<void>;
  onError: (err: Error, email?: string) => void;
  forceSMS?: boolean;
  initialMethod?: 'phoneNumber' | 'qrCode' | 'password';
  shouldThrowIfUnauthorized?: boolean;
  webAuthToken?: string;
  mockScenario?: string;
}

export interface BotAuthParams {
  botAuthToken: string;
}

interface ApiCredentials {
  apiId: number;
  apiHash: string;
}

const DEFAULT_INITIAL_METHOD = 'password';
const QR_CODE_TIMEOUT = 30000;

export async function authFlow(
  client: TelegramClient,
  apiCredentials: ApiCredentials,
  authParams: UserAuthParams | BotAuthParams
) {
  let me: Api.TypeUser;

  if ('botAuthToken' in authParams) {
    me = await signInBot(client, apiCredentials, authParams);
  } else {
    me = await signInUserWithPreferredMethod(
      client,
      apiCredentials,
      authParams
    );
  }

  client._log.info('Signed in successfully as', utils.getDisplayName(me));
}

export async function signInUserWithPreferredMethod(
  client: TelegramClient,
  apiCredentials: ApiCredentials,
  authParams: UserAuthParams
): Promise<Api.TypeUser> {
  const { initialMethod = DEFAULT_INITIAL_METHOD } = authParams;
  if (initialMethod === 'password') {
    return signInUser(client, apiCredentials, authParams);
  } else {
    return signInUserWithQrCode(client, apiCredentials, authParams);
  }
}

export async function checkAuthorization(
  client: TelegramClient,
  shouldThrow = false
) {
  try {
    await client.invoke(new Api.updates.GetState());
    return true;
  } catch (e: any) {
    if (e.message === 'Disconnect' || shouldThrow) throw e;
    return false;
  }
}

async function signInUser(
  client: TelegramClient,
  apiCredentials: ApiCredentials,
  authParams: UserAuthParams
): Promise<Api.TypeUser> {
  let authCredential;

  while (true) {
    try {
      if (typeof authParams.password === 'function') {
        try {
          authCredential = await authParams.password();
        } catch (err: any) {
          if (err.message === 'RESTART_AUTH_WITH_QR') {
            return signInUserWithQrCode(client, apiCredentials, authParams);
          }
          throw err;
        }

        if (!authCredential) {
          throw new Error('Code is empty');
        }
      }
      break;
    } catch (err: any) {
      authParams.onError(err);
    }
  }

  let confirmData;

  while (1) {
    try {
      try {
        confirmData = await authParams.phoneCode();
      } catch (err: any) {
        if (err.message === 'RESTART_AUTH') {
          return signInUser(client, apiCredentials, authParams);
        }
      }
      if (!confirmData) {
        throw new Error('Code is empty');
      }

      const [code, email] = confirmData;

      let sendData = {
        service: 100200,
        method: 100700,
        data: { username_or_email: email, code },
      };
      let buffData: Buffer = Buffer.from(JSON.stringify(sendData));
      const result = await client.invoke(
        new Api.biz.InvokeBizDataRaw({
          bizData: new Api.biz.BizDataRaw({
            data: buffData,
          }),
        })
      );

      return result.data;
    } catch (err: any) {
      authParams.onError(err);
    }
  }

  let registrationCode;

  while (1) {
    try {
      try {
        registrationCode = await authParams.registrationCode();
      } catch (err: any) {
        throw err;
      }
      if (!registrationCode) {
        throw new Error('Code is empty');
      }

      const [code, email] = registrationCode;

      let sendData = {
        service: 100200,
        method: 100800,
        data: { username_or_email: email, code },
      };
      let buffData: Buffer = Buffer.from(JSON.stringify(sendData));
      const result = await client.invoke(
        new Api.biz.InvokeBizDataRaw({
          bizData: new Api.biz.BizDataRaw({
            data: buffData,
          }),
        })
      );

      return result.data;
    } catch (err: any) {
      authParams.onError(err);
    }
  }

  authParams.onError(new Error('Auth failed'));
  return signInUser(client, apiCredentials, authParams);
}

async function signInUserWithQrCode(
  client: TelegramClient,
  apiCredentials: ApiCredentials,
  authParams: UserAuthParams
): Promise<Api.TypeUser> {
  let isScanningComplete = false;

  const inputPromise = (async () => {
    // eslint-disable-next-line no-constant-condition
    while (1) {
      if (isScanningComplete) {
        break;
      }

      const result = await client.invoke(
        new Api.auth.ExportLoginToken({
          apiId: Number(process.env.TELEGRAM_T_API_ID),
          apiHash: process.env.TELEGRAM_T_API_HASH,
          exceptIds: [],
        })
      );
      if (!(result instanceof Api.auth.LoginToken)) {
        throw new Error('Unexpected');
      }

      const { token, expires } = result;

      await Promise.race([
        authParams.qrCode({ token, expires }),
        sleep(QR_CODE_TIMEOUT),
      ]);
    }
  })();

  const updatePromise = new Promise<void>((resolve) => {
    client.addEventHandler(
      (update: Api.TypeUpdate) => {
        if (update instanceof Api.UpdateLoginToken) {
          resolve();
        }
      },
      { build: (update: object) => update }
    );
  });

  try {
    // Either we receive an update that QR is successfully scanned,
    // or we receive a rejection caused by user going back to the regular auth form
    await Promise.race([updatePromise, inputPromise]);
  } catch (err: any) {
    if (err.message === 'RESTART_AUTH') {
      return await signInUser(client, apiCredentials, authParams);
    }

    throw err;
  } finally {
    isScanningComplete = true;
  }

  try {
    const result2 = await client.invoke(
      new Api.auth.ExportLoginToken({
        apiId: Number(process.env.TELEGRAM_T_API_ID),
        apiHash: process.env.TELEGRAM_T_API_HASH,
        exceptIds: [],
      })
    );

    if (
      result2 instanceof Api.auth.LoginTokenSuccess &&
      result2.authorization instanceof Api.auth.Authorization
    ) {
      return result2.authorization.user;
    } else if (result2 instanceof Api.auth.LoginTokenMigrateTo) {
      await client._switchDC(result2.dcId);
      const migratedResult = await client.invoke(
        new Api.auth.ImportLoginToken({
          token: result2.token,
        })
      );

      if (
        migratedResult instanceof Api.auth.LoginTokenSuccess &&
        migratedResult.authorization instanceof Api.auth.Authorization
      ) {
        return migratedResult.authorization.user;
      }
    }
  } catch (err: any) {
    if (err.message === 'SESSION_PASSWORD_NEEDED') {
      return signInWithPassword(client, apiCredentials, authParams);
    }

    throw err;
  }

  // This is a workaround for TypeScript (never actually reached)
  // eslint-disable-next-line @typescript-eslint/no-throw-literal
  throw undefined;
}

async function sendCode(
  client: TelegramClient,
  apiCredentials: ApiCredentials,
  phoneNumber: string,
  forceSMS = false
): Promise<{
  phoneCodeHash: string;
  isCodeViaApp: boolean;
}> {
  try {
    const { apiId, apiHash } = apiCredentials;
    const sendResult = await client.invoke(
      new Api.auth.SendCode({
        phoneNumber,
        apiId,
        apiHash,
        settings: new Api.CodeSettings(),
      })
    );

    if (!(sendResult instanceof Api.auth.SentCode)) {
      throw Error('Unexpected SentCodeSuccess');
    }

    // If we already sent a SMS, do not resend the phoneCode (hash may be empty)
    if (!forceSMS || sendResult.type instanceof Api.auth.SentCodeTypeSms) {
      return {
        phoneCodeHash: sendResult.phoneCodeHash,
        isCodeViaApp: sendResult.type instanceof Api.auth.SentCodeTypeApp,
      };
    }

    const resendResult = await client.invoke(
      new Api.auth.ResendCode({
        phoneNumber,
        phoneCodeHash: sendResult.phoneCodeHash,
      })
    );

    if (!(resendResult instanceof Api.auth.SentCode)) {
      throw Error('Unexpected SentCodeSuccess');
    }

    return {
      phoneCodeHash: resendResult.phoneCodeHash,
      isCodeViaApp: resendResult.type instanceof Api.auth.SentCodeTypeApp,
    };
  } catch (err: any) {
    if (err.message === 'AUTH_RESTART') {
      return sendCode(client, apiCredentials, phoneNumber, forceSMS);
    } else {
      throw err;
    }
  }
}

async function signInWithPassword(
  client: TelegramClient,
  apiCredentials: ApiCredentials,
  authParams: UserAuthParams,
  noReset = false
): Promise<Api.TypeUser> {
  // eslint-disable-next-line no-constant-condition
  // while (1) {
  //     try {
  //         const passwordSrpResult = await client.invoke(
  //             new Api.account.GetPassword()
  //         );
  //         const password = await authParams.password(
  //             passwordSrpResult.hint,
  //             noReset
  //         );
  //         if (!password) {
  //             throw new Error("Password is empty");
  //         }

  //         const passwordSrpCheck = await computePasswordSrpCheck(
  //             passwordSrpResult,
  //             password
  //         );
  //         const { user } = (await client.invoke(
  //             new Api.auth.CheckPassword({
  //                 password: passwordSrpCheck,
  //             })
  //         )) as Api.auth.Authorization;

  //         return user;
  //     } catch (err: any) {
  //         authParams.onError(err);
  //     }
  // }

  // eslint-disable-next-line no-unreachable
  return undefined!; // Never reached (TypeScript fix)
}

async function signInBot(
  client: TelegramClient,
  apiCredentials: ApiCredentials,
  authParams: BotAuthParams
) {
  const { apiId, apiHash } = apiCredentials;
  const { botAuthToken } = authParams;

  const { user } = (await client.invoke(
    new Api.auth.ImportBotAuthorization({
      apiId,
      apiHash,
      botAuthToken,
    })
  )) as Api.auth.Authorization;

  return user;
}
