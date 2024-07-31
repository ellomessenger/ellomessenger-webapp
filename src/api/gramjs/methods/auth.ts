import { Api as GramJs } from '../../../lib/gramjs';
import { errors } from '../../../lib/gramjs';
import type {
  ApiUpdateAuthorizationState,
  ApiUpdateAuthorizationStateType,
  OnApiUpdate,
  ApiUser,
  ApiError,
} from '../../types';

import { DEBUG } from '../../../config';
import { invokeRequest } from './client';
import { buildBizRaw } from '../gramjsBuilders';
import { SignUpPayload } from '../../../global/types';
import { ConfirmEmailType } from '../../../types';

const ApiErrors: { [k: string]: string } = {
  PHONE_NUMBER_INVALID: 'Invalid phone number.',
  PHONE_CODE_INVALID: 'Invalid code.',
  PASSWORD_HASH_INVALID: 'Incorrect password.',
  PHONE_PASSWORD_FLOOD: 'Limit exceeded. Please try again later.',
  PHONE_NUMBER_BANNED: 'This phone number is banned.',
};

const authController: {
  resolve?: Function;
  reject?: Function;
} = {};

let onUpdate: OnApiUpdate;

export function init(_onUpdate: OnApiUpdate) {
  onUpdate = _onUpdate;
}

export function onWebAuthTokenFailed() {
  onUpdate({
    '@type': 'updateWebAuthTokenFailed',
  });
}

export function onRequestPhoneNumber() {
  onUpdate(buildAuthStateUpdate('authorizationStateWaitPhoneNumber'));

  return new Promise<string>((resolve, reject) => {
    authController.resolve = resolve;
    authController.reject = reject;
  });
}

export function onRequestCode() {
  return new Promise<[string, string]>((resolve, reject) => {
    authController.resolve = resolve;
    authController.reject = reject;
  });
}

export function onRequestPassword() {
  onUpdate({
    ...buildAuthStateUpdate('authorizationStateWaitPassword'),
  });

  return new Promise<[string, string?]>((resolve, reject) => {
    authController.resolve = resolve;
    authController.reject = reject;
  });
}

export function onRequestUsernameAndPassword() {
  onUpdate({
    ...buildAuthStateUpdate('authorizationStateWaitPassword'),
  });

  return new Promise<[string, string?]>((resolve, reject) => {
    authController.resolve = resolve;
    authController.reject = reject;
  });
}

export function onGoToRegistration() {
  onUpdate({
    ...buildAuthStateUpdate('authorizationStateWaitRegistration'),
  });
  return new Promise<string>((resolve, reject) => {
    authController.resolve = resolve;
    authController.reject = reject;
  });
}

export function onRequestRegistration() {
  return new Promise<[string, string]>((resolve, reject) => {
    authController.resolve = resolve;
    authController.reject = reject;
  });
}

export function onRequestQrCode(qrCode: { token: Buffer; expires: number }) {
  onUpdate({
    ...buildAuthStateUpdate('authorizationStateWaitQrCode'),
    qrCode: {
      token: btoa(String.fromCharCode(...qrCode.token))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, ''),
      expires: qrCode.expires,
    },
  });

  return new Promise<void>((resolve, reject) => {
    authController.reject = reject;
  });
}

export function onAuthError(err: Error) {
  let message: string;

  if (err instanceof errors.FloodWaitError) {
    const hours = Math.ceil(Number(err.seconds) / 60 / 60);
    message = `Too many attempts. Try again in ${
      hours > 1 ? `${hours} hours` : 'an hour'
    }`;
  } else {
    message = err.message;
  }

  if (!message) {
    message = 'Unexpected Error';

    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }
  onUpdate({
    '@type': 'updateAuthorizationError',
    message,
  });
}

export function onAuthReady() {
  onUpdate(buildAuthStateUpdate('authorizationStateReady'));
}

export function onCurrentUserUpdate(currentUser: ApiUser) {
  onUpdate({
    '@type': 'updateCurrentUser',
    currentUser,
  });
}

export function buildAuthStateUpdate(
  authorizationState: ApiUpdateAuthorizationStateType
): ApiUpdateAuthorizationState {
  return {
    '@type': 'updateAuthorizationState',
    authorizationState,
  };
}

export function provideAuthPhoneNumber(phoneNumber: string) {
  if (!authController.resolve) {
    return;
  }

  authController.resolve(phoneNumber);
}

export function provideAuthCode(payload: { code: string; email?: string }) {
  const { code, email } = payload;

  if (!authController.resolve) {
    return;
  }
  authController.resolve([code, email]);
  return true;
}

export function provideRegistrationCode(payload: {
  code: string;
  email: string;
}) {
  const { code, email } = payload;
  if (!authController.resolve) {
    return;
  }

  authController.resolve([code, email]);

  return true;
}

export function provideAuthPassword(password: string) {
  if (!authController.resolve) {
    return;
  }

  authController.resolve(password);
}

export async function provideAuthUsernameAndPassword(login: {
  username: string;
  password: string;
}) {
  const { username, password } = login;

  if (!authController.resolve) {
    return;
  }

  authController.resolve([username, password]);

  let sendData = {
    service: 100200,
    method: 100200,
    data: {
      username,
      password,
    },
  };

  let buffData: Buffer = Buffer.from(JSON.stringify(sendData));

  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );

  if (result) {
    const parsResult = JSON.parse(result.data);
    onUpdate({
      '@type': 'updateConfirmEmailState',
      type: ConfirmEmailType.confirmAuth,
      expire: parsResult.confirmation_expire,
      email: parsResult.email,
      password,
      params: { username },
    });

    onUpdate({
      ...buildAuthStateUpdate('authorizationStateWaitConfirmEmail'),
    });
  } else {
    onUpdate({
      '@type': 'updateConfirmEmailState',
      params: { username },
    });
  }

  // try {
  //   const result = await invokeRequest(
  //     new GramJs.biz.InvokeBizDataRaw({
  //       bizData: buildBizRaw(buffData),
  //     }),

  //   );

  //   if (result) {
  //     const parsResult = JSON.parse(result.data);
  //     onUpdate({
  //       '@type': 'updateConfirmEmailState',
  //       type: ConfirmEmailType.confirmAuth,
  //       expire: parsResult.confirmation_expire,
  //       email: parsResult.email,
  //       password,
  //       params: { username },
  //     });

  //     onUpdate({
  //       ...buildAuthStateUpdate('authorizationStateWaitConfirmEmail'),
  //     });
  //   }
  // } catch (error) {

  //   //@ts-ignore
  //   if (['user is blocked', 'user is deleted'].includes(error.message)) {
  //     const errorMessage = (error as ApiError).message;

  //     onUpdate({
  //       '@type': 'updateConfirmEmailState',
  //       params: { username, errorMessage },
  //     });
  //   }
  // }
}

export async function provideAuthRegistration(payload: SignUpPayload) {
  if (!authController.resolve) {
    return;
  }

  const { username, password } = payload;

  authController.resolve([username, password]);

  let sendData = {
    service: 100200,
    method: 100100,
    data: payload,
  };

  let buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );
  if (!result) {
    return undefined;
  }
  const parsResult = JSON.parse(result.data);
  onUpdate({
    '@type': 'updateConfirmEmailState',
    type: ConfirmEmailType.confirmEmail,
    expire: parsResult.confirmation_expire,
    email: parsResult.email,
    params: payload,
  });
  onUpdate({
    ...buildAuthStateUpdate('authorizationStateWaitConfirmEmail'),
  });
}

export function restartAuth() {
  if (!authController.reject) {
    return;
  }
  authController.reject(new Error('RESTART_AUTH'));
}

export function restartAuthWithQr() {
  if (!authController.reject) {
    return;
  }

  authController.reject(new Error('RESTART_AUTH_WITH_QR'));
}

export async function requestCodeForgotPassword(payload: {
  email: string;
  password: string;
}) {
  const { password, email } = payload;
  let sendData = {
    service: 100200,
    method: 100400,
    data: { email },
  };
  let buffData: Buffer = Buffer.from(JSON.stringify(sendData));

  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );
  if (!result) {
    return undefined;
  }
  const parsResult = JSON.parse(result.data);
  onUpdate({
    '@type': 'updateConfirmEmailState',
    type: ConfirmEmailType.forgotPassword,
    expire: parsResult.confirmation_expire,
    email: parsResult.email,
    password,
  });
  onUpdate({
    ...buildAuthStateUpdate('authorizationStateWaitConfirmEmail'),
  });
}

export async function requestConfirmForgotPassword(payload: {
  email: string;
  code: string;
  new_pass: string;
}) {
  let sendData = {
    service: 100200,
    method: 100500,
    data: payload,
  };
  let buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );
  if (!result) {
    return undefined;
  }

  onUpdate({
    ...buildAuthStateUpdate('authorizationStateWaitPassword'),
  });

  return result;
}

export async function requestConfirmEmail(payload: {
  email: string;
  code: string;
}) {
  const { email: username_or_email, code } = payload;
  let sendData = {
    service: 100200,
    method: 100300,
    data: { code, username_or_email },
  };
  let buffData: Buffer = Buffer.from(JSON.stringify(sendData));
  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );
  if (!result) {
    return undefined;
  }
  return result;
}

export async function requestConfirmationCode(payload: {
  username_or_email: string;
  type: ConfirmEmailType;
}) {
  const { username_or_email, type } = payload;
  let sendData = {
    service: 100200,
    method: 100600,
    data: { username_or_email },
  };

  let buffData: Buffer = Buffer.from(JSON.stringify(sendData));

  const result = await invokeRequest(
    new GramJs.biz.InvokeBizDataRaw({
      bizData: buildBizRaw(buffData),
    })
  );
  if (!result) {
    return undefined;
  }

  const parsResult = JSON.parse(result.data);
  onUpdate({
    '@type': 'updateConfirmEmailState',
    type,
    expire: parsResult.confirmation_expire,
    email: parsResult.email,
    params: username_or_email,
  });
  onUpdate({
    ...buildAuthStateUpdate('authorizationStateWaitConfirmEmail'),
  });
}
