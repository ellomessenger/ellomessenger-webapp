import { sessions, Api as GramJs, connection } from '../../../lib/gramjs';
import TelegramClient from '../../../lib/gramjs/client/TelegramClient';

import { Logger as GramJsLogger } from '../../../lib/gramjs/extensions/index';
import type { TwoFaParams } from '../../../lib/gramjs/client/2fa';

import type {
  ApiInitialArgs,
  ApiMediaFormat,
  ApiOnProgress,
  ApiSessionData,
  OnApiUpdate,
} from '../../types';

import {
  DEBUG,
  DEBUG_GRAMJS,
  UPLOAD_WORKERS,
  IS_TEST,
  SUPPORTED_VIDEO_CONTENT_TYPES,
  VIDEO_MOV_TYPE,
} from '../../../config';
import {
  onRequestPhoneNumber,
  onRequestCode,
  onRequestRegistration,
  onAuthError,
  onAuthReady,
  onCurrentUserUpdate,
  onRequestQrCode,
  onWebAuthTokenFailed,
  onRequestUsernameAndPassword,
} from './auth';
import { updater } from '../updater';
import { setMessageBuilderCurrentUserId } from '../apiBuilders/messages';
import downloadMediaWithClient, { parseMediaUrl } from './media';
import { buildApiUserFromFull } from '../apiBuilders/users';
import localDb, { clearLocalDb } from '../localDb';
import { buildApiPeerId } from '../apiBuilders/peers';
import { addMessageToLocalDb, isResponseUpdate, log } from '../helpers';
import { ChatAbortController } from '../ChatAbortController';
import { ThreadId } from '../../../types';
import { processUpdate, init as initUpdatesManager } from '../updateManager';

const DEFAULT_USER_AGENT = 'Unknown UserAgent';
const DEFAULT_PLATFORM = 'Unknown platform';
const APP_CODE_NAME = 'S';
const CHAT_ABORT_CONTROLLERS = new Map<string, ChatAbortController>();
const ABORT_CONTROLLERS = new Map<string, AbortController>();

GramJsLogger.setLevel(DEBUG_GRAMJS ? 'debug' : 'warn');

const gramJsUpdateEventBuilder = { build: (update: object) => update };

let onUpdate: OnApiUpdate;
let client: TelegramClient;
let isConnected = false;
let currentUserId: string | undefined;

export async function init(
  _onUpdate: OnApiUpdate,
  initialArgs: ApiInitialArgs
) {
  if (DEBUG) {
    console.log('>>> START INIT API');
  }

  onUpdate = _onUpdate;

  const {
    userAgent,
    platform,
    sessionData,
    isTest,
    isMovSupported,
    isWebmSupported,
    maxBufferSize,
    webAuthToken,
    dcId,
    mockScenario,
  } = initialArgs;

  const session = new sessions.CallbackSession(sessionData, onSessionUpdate);
  (self as any).isMovSupported = isMovSupported;
  if (isMovSupported) SUPPORTED_VIDEO_CONTENT_TYPES.add(VIDEO_MOV_TYPE);
  (self as any).isWebmSupported = isWebmSupported;
  (self as any).maxBufferSize = maxBufferSize;

  client = new TelegramClient(
    session,
    '29289143',
    '1db895b6c2148adf1c1ae579f8025e82',
    {
      deviceModel: navigator.userAgent || userAgent || DEFAULT_USER_AGENT,
      systemVersion: platform || DEFAULT_PLATFORM,
      appVersion: `${APP_VERSION} ${APP_CODE_NAME}`,
      useWSS: true,
      additionalDcsDisabled: IS_TEST,
      testServers: isTest,
      dcId,
    } as any
  );

  client.addEventHandler(handleGramJsUpdate, gramJsUpdateEventBuilder);
  client.addEventHandler(updater, gramJsUpdateEventBuilder);

  try {
    if (DEBUG) {
      log('CONNECTING');

      (self as any).invoke = invokeRequest;
      (self as any).GramJs = GramJs;
    }

    try {
      await client.start({
        phoneNumber: onRequestPhoneNumber,
        phoneCode: onRequestCode,
        password: onRequestUsernameAndPassword,
        registrationCode: onRequestRegistration,
        qrCode: onRequestQrCode,
        onError: onAuthError,
        initialMethod: 'password',
        shouldThrowIfUnauthorized: Boolean(sessionData),
        webAuthToken,
        webAuthTokenFailed: onWebAuthTokenFailed,
        mockScenario,
      });
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);

      if (
        err.message !== 'Disconnect' &&
        err.message !== 'Cannot send requests while disconnected'
      ) {
        onUpdate({
          '@type': 'updateConnectionState',
          connectionState: 'connectionStateBroken',
        });

        return;
      }
    }

    if (DEBUG) {
      console.log('>>> FINISH INIT API');
      log('CONNECTED');
    }

    onAuthReady();
    onSessionUpdate(session.getSessionData());

    onUpdate({ '@type': 'updateApiReady' });

    initUpdatesManager(invokeRequest);

    void fetchCurrentUser();
  } catch (err) {
    if (DEBUG) {
      log('CONNECTING ERROR', err);
    }

    throw err;
  }
}

export function setIsPremium({ isPremium }: { isPremium: boolean }) {
  client.setIsPremium(isPremium);
}

export async function destroy(noLogOut = false, noClearLocalDb = false) {
  if (!noLogOut) {
    await invokeRequest(new GramJs.auth.LogOut());
  }

  if (!noClearLocalDb) clearLocalDb();

  await client.destroy();
}

export async function disconnect() {
  await client.disconnect();
}

export function getClient() {
  return client;
}

function onSessionUpdate(sessionData: ApiSessionData) {
  onUpdate({
    '@type': 'updateSession',
    sessionData,
  });
}

type UpdateConfig = GramJs.UpdateConfig & {
  _entities?: (GramJs.TypeUser | GramJs.TypeChat)[];
};
let timeout;
export function handleGramJsUpdate(update: any) {
  //processUpdate(update);

  if (update instanceof connection.UpdateConnectionState) {
    isConnected = update.state === connection.UpdateConnectionState.connected;

    //if (update.state === connection.UpdateConnectionState.disconnected) {
    //console.log('disconnect');
    // timeout = setTimeout(() => {
    //   onUpdate({
    //     '@type': 'error',
    //     error: {
    //       message: 'disconnect',
    //     },
    //   });
    // }, 60000);
    //clearTimeout(timeout);
    //}

    //if (isConnected) {
    //console.log('connect');
    //   clearTimeout(timeout);
    //   onUpdate({
    //     '@type': 'error',
    //     error: {
    //       message: 'connect',
    //     },
    //   });
    //}
  }

  if (update instanceof GramJs.UpdatesTooLong) {
    void handleTerminatedSession();
  } else {
    const updates = 'updates' in update ? update.updates : [update];
    updates.forEach((nestedUpdate: any) => {
      if (!(nestedUpdate instanceof GramJs.UpdateConfig)) return;
      // eslint-disable-next-line no-underscore-dangle
      const currentUser = (nestedUpdate as UpdateConfig)._entities?.find(
        (entity) =>
          entity instanceof GramJs.User &&
          buildApiPeerId(entity.id, 'user') === currentUserId
      );
      if (!(currentUser instanceof GramJs.User)) return;

      setIsPremium({ isPremium: Boolean(currentUser.premium) });
    });
  }
}

type InvokeRequestParams = {
  shouldThrow?: boolean;
  shouldIgnoreUpdates?: boolean;
  dcId?: number;
  shouldIgnoreErrors?: boolean;
  abortControllerChatId?: string;
  abortControllerThreadId?: ThreadId;
  abortControllerGroup?: 'call';
  shouldRetryOnTimeout?: boolean;
};

export async function invokeRequest<T extends GramJs.AnyRequest>(
  request: T,
  params?: InvokeRequestParams & { shouldReturnTrue?: false }
): Promise<T['__response'] | undefined>;

export async function invokeRequest<T extends GramJs.AnyRequest>(
  request: T,
  params?: InvokeRequestParams & { shouldReturnTrue: true }
): Promise<true | undefined>;

export async function invokeRequest<T extends GramJs.AnyRequest>(
  request: T,
  params: InvokeRequestParams & { shouldReturnTrue?: boolean } = {}
) {
  const {
    shouldThrow,
    shouldIgnoreUpdates,
    dcId,
    shouldIgnoreErrors,
    abortControllerChatId,
    abortControllerThreadId,
    shouldRetryOnTimeout,
    abortControllerGroup,
  } = params;
  const shouldReturnTrue = Boolean(params.shouldReturnTrue);

  let abortSignal: AbortSignal | undefined;
  if (abortControllerChatId) {
    let controller = CHAT_ABORT_CONTROLLERS.get(abortControllerChatId);
    if (!controller) {
      controller = new ChatAbortController();
      CHAT_ABORT_CONTROLLERS.set(abortControllerChatId, controller);
    }

    abortSignal = abortControllerThreadId
      ? controller.getThreadSignal(abortControllerThreadId)
      : controller.signal;
  }

  if (abortControllerGroup) {
    let controller = ABORT_CONTROLLERS.get(abortControllerGroup);
    if (!controller) {
      controller = new AbortController();
      ABORT_CONTROLLERS.set(abortControllerGroup, controller);
    }
    abortSignal = controller.signal;
  }

  try {
    if (DEBUG) {
      log('INVOKE', request.className);
    }

    const result = await client.invoke(
      request,
      dcId,
      abortSignal,
      shouldRetryOnTimeout
    );

    if (DEBUG) {
      log('RESPONSE', request.className, result);
    }

    // if (!shouldIgnoreUpdates && isResponseUpdate(result)) {
    //   processUpdate(result);
    // }

    return shouldReturnTrue ? result && true : result;
  } catch (err: any) {
    if (shouldIgnoreErrors) return undefined;
    if (DEBUG) {
      log('INVOKE ERROR', request.className);
      // eslint-disable-next-line no-console
      console.debug('invokeRequest failed with payload', request);
      // eslint-disable-next-line no-console
      console.error(err);
    }

    if (shouldThrow) {
      throw err;
    }

    dispatchErrorUpdate(err, request);

    return undefined;
  }
}

export function handleUpdates(result: any) {
  let manyUpdates;
  let singleUpdate;
  if (
    result instanceof GramJs.UpdatesCombined ||
    result instanceof GramJs.Updates
  ) {
    manyUpdates = result;
  } else if (
    typeof result === 'object' &&
    'updates' in result &&
    (result.updates instanceof GramJs.Updates ||
      result.updates instanceof GramJs.UpdatesCombined)
  ) {
    manyUpdates = result.updates;
  } else if (
    result instanceof GramJs.UpdateShortMessage ||
    result instanceof GramJs.UpdateShortChatMessage ||
    result instanceof GramJs.UpdateShort ||
    result instanceof GramJs.UpdateShortSentMessage
  ) {
    singleUpdate = result;
  }

  if (manyUpdates) {
    injectUpdateEntities(manyUpdates);

    manyUpdates.updates.forEach((update) => {
      updater(update);
    });
    return;
  } else if (singleUpdate) {
    updater(singleUpdate);
    return;
  }

  updater(result);
}

export function abortChatRequests(params: {
  chatId: string;
  threadId?: number;
}) {
  const { chatId, threadId } = params;
  const controller = CHAT_ABORT_CONTROLLERS.get(chatId);
  if (!threadId) {
    controller?.abort('Chat change');
    CHAT_ABORT_CONTROLLERS.delete(chatId);
    return;
  }

  controller?.abortThread(threadId, 'Thread change');
}

export async function downloadMedia(
  args: {
    url: string;
    mediaFormat: ApiMediaFormat;
    start?: number;
    end?: number;
    isHtmlAllowed?: boolean;
  },
  onProgress?: ApiOnProgress
) {
  try {
    return await downloadMediaWithClient(args, client, isConnected, onProgress);
  } catch (err: any) {
    if (err.message.startsWith('FILE_REFERENCE')) {
      const isFileReferenceRepaired = await repairFileReference({
        url: args.url,
      });
      if (isFileReferenceRepaired) {
        return downloadMediaWithClient(args, client, isConnected, onProgress);
      }

      if (DEBUG) {
        // eslint-disable-next-line no-console
        console.error('Failed to repair file reference', args.url);
      }
    }

    throw err;
  }
}

export function uploadFile(file: File, onProgress?: ApiOnProgress) {
  return client.uploadFile({ file, onProgress, workers: UPLOAD_WORKERS });
}

export function updateTwoFaSettings(params: TwoFaParams) {
  return client.updateTwoFaSettings(params);
}

export function getTmpPassword(currentPassword: string, ttl?: number) {
  return client.getTmpPassword(currentPassword, ttl);
}

export async function fetchCurrentUser() {
  const userFull = await invokeRequest(
    new GramJs.users.GetFullUser({
      id: new GramJs.InputUserSelf(),
    })
  );

  if (!userFull || !(userFull.users[0] instanceof GramJs.User)) {
    return;
  }

  const user = userFull.users[0];

  if (user.photo instanceof GramJs.Photo) {
    localDb.photos[user.photo.id.toString()] = user.photo;
  }
  localDb.users[buildApiPeerId(user.id, 'user')] = user;
  const currentUser = buildApiUserFromFull(userFull);

  setMessageBuilderCurrentUserId(currentUser.id);
  onCurrentUserUpdate(currentUser);

  currentUserId = currentUser.id;
  setIsPremium({ isPremium: Boolean(currentUser.isPremium) });
}

export function dispatchErrorUpdate<T extends GramJs.AnyRequest>(
  err: Error,
  request: T
) {
  const isSlowMode =
    err.message.startsWith('A wait of') &&
    (request instanceof GramJs.messages.SendMessage ||
      request instanceof GramJs.messages.SendMedia ||
      request instanceof GramJs.messages.SendMultiMedia);

  const { message } = err;
  onUpdate({
    '@type': 'error',
    error: {
      message,
      isSlowMode,
      hasErrorKey: true,
    },
  });
}

function injectUpdateEntities(result: GramJs.Updates | GramJs.UpdatesCombined) {
  const entities = [...result.users, ...result.chats];

  result.updates.forEach((update) => {
    if (entities) {
      // eslint-disable-next-line no-underscore-dangle
      (update as any)._entities = entities;
    }
  });
}

async function handleTerminatedSession() {
  try {
    await invokeRequest(
      new GramJs.users.GetFullUser({
        id: new GramJs.InputUserSelf(),
      }),
      {
        shouldThrow: true,
      }
    );
  } catch (err: any) {
    if (
      [
        'AUTH_KEY_UNREGISTERED',
        'AUTH_KEY_INVALID',
        'SESSION_REVOKED',
        'USER_DEACTIVATED',
      ].includes(err.message)
    ) {
      onUpdate({
        '@type': 'updateConnectionState',
        connectionState: 'connectionStateBroken',
      });
    }
  }
}

export async function repairFileReference({ url }: { url: string }) {
  const parsed = parseMediaUrl(url);

  if (!parsed) return undefined;

  const { entityType, entityId, mediaMatchType } = parsed;

  if (mediaMatchType === 'file') {
    return false;
  }

  if (entityType === 'msg') {
    const entity = localDb.messages[entityId]!;
    const messageId = entity.id;

    const peer =
      'channelId' in entity.peerId
        ? new GramJs.InputChannel({
            channelId: entity.peerId.channelId,
            accessHash: (
              localDb.chats[
                buildApiPeerId(entity.peerId.channelId, 'channel')
              ] as GramJs.Channel
            ).accessHash!,
          })
        : undefined;
    const result = await invokeRequest(
      peer
        ? new GramJs.channels.GetMessages({
            channel: peer,
            id: [new GramJs.InputMessageID({ id: messageId })],
          })
        : new GramJs.messages.GetMessages({
            id: [new GramJs.InputMessageID({ id: messageId })],
          })
    );

    if (!result || result instanceof GramJs.messages.MessagesNotModified)
      return false;

    const message = result.messages[0];
    if (message instanceof GramJs.MessageEmpty) return false;
    addMessageToLocalDb(message);
    return true;
  }

  return false;
}
