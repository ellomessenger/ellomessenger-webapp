import { addActionHandler, getGlobal, setGlobal } from '../../index';

import { initApi, callApi, callApiLocal } from '../../../api/gramjs';
import { ActionReturnType } from './../../types';
import {
  LANG_CACHE_NAME,
  CUSTOM_BG_CACHE_NAME,
  MEDIA_CACHE_NAME,
  MEDIA_CACHE_NAME_AVATARS,
  MEDIA_PROGRESSIVE_CACHE_NAME,
  IS_TEST,
  LOCK_SCREEN_ANIMATION_DURATION_MS,
} from '../../../config';
import {
  IS_MOV_SUPPORTED,
  IS_WEBM_SUPPORTED,
  MAX_BUFFER_SIZE,
  PLATFORM_ENV,
} from '../../../util/windowEnvironment';
import { unsubscribe } from '../../../util/notifications';
import * as cacheApi from '../../../util/cacheApi';
import { updateAppBadge } from '../../../util/appBadge';
import {
  storeSession,
  loadStoredSession,
  clearStoredSession,
  importLegacySession,
  clearLegacySessions,
} from '../../../util/sessions';

import {
  addUsers,
  clearGlobalForLockScreen,
  updatePasscodeSettings,
  updateUser,
  updateUserFullInfo,
} from '../../reducers';
import {
  clearEncryptedSession,
  encryptSession,
  forgetPasscode,
} from '../../../util/passcode';
import { serializeGlobal } from '../../cache';
import {
  parseInitialLocationHash,
  resetInitialLocationHash,
} from '../../../util/routing';
import { getCurrentTabId } from '../../../util/establishMultitabRole';
import { buildCollectionByKey } from '../../../util/iteratees';
import { buildAuthStateUpdate } from '../../../api/gramjs/methods/auth';
import generateIdFor from '../../../util/generateIdFor';
import {
  selectChat,
  selectTabState,
  selectUser,
  selectUserFullInfo,
} from '../../selectors';
import { ApiNotification } from '../../../api/types';
import { updateTabState } from '../../reducers/tabs';
import { t } from 'i18next';
import { forceWebsync } from '../../../util/websync';

addActionHandler('initApi', async (global, actions): Promise<void> => {
  if (!IS_TEST) {
    await importLegacySession();
    void clearLegacySessions();
  }

  const initialLocationHash = parseInitialLocationHash();

  void initApi(actions.apiUpdate, {
    userAgent: navigator.userAgent,
    platform: PLATFORM_ENV,
    sessionData: loadStoredSession(),
    isTest:
      window.location.search.includes('test') ||
      initialLocationHash?.tgWebAuthTest === '1',
    isMovSupported: IS_MOV_SUPPORTED,
    isWebmSupported: IS_WEBM_SUPPORTED,
    maxBufferSize: MAX_BUFFER_SIZE,
    webAuthToken: initialLocationHash?.tgWebAuthToken,
    dcId: initialLocationHash?.tgWebAuthDcId
      ? Number(initialLocationHash?.tgWebAuthDcId)
      : undefined,
    mockScenario: initialLocationHash?.mockScenario,
  });
});

addActionHandler(
  'setAuthPhoneNumber',
  (global, actions, payload): ActionReturnType => {
    const { phoneNumber } = payload!;

    void callApi('provideAuthPhoneNumber', phoneNumber.replace(/[^\d]/g, ''));

    return {
      ...global,
      authIsLoading: true,
      authError: undefined,
    };
  }
);

addActionHandler(
  'setAuthCode',
  async (global, actions, payload): Promise<void> => {
    const { code, email } = payload || {};
    void callApi('provideAuthCode', { code, email });
  }
);

addActionHandler(
  'setRegistrationCode',
  (global, actions, payload): ActionReturnType => {
    const { code, email } = payload!;

    void callApi('provideRegistrationCode', { code, email });

    return {
      ...global,
      authIsLoading: true,
      authError: undefined,
      confirmData: undefined,
    };
  }
);

addActionHandler(
  'confirmEmail',
  async (global, actions, payload): Promise<void> => {
    const result = await callApi('requestConfirmEmail', payload!);
    if (!result) return;
    actions.returnToAuthPassword();
    global = getGlobal();
    global = {
      ...global,
      authError: undefined,
      confirmData: undefined,
    };
    setGlobal(global);
  }
);

addActionHandler(
  'setAuthPassword',
  (global, actions, payload): ActionReturnType => {
    const { password } = payload!;

    void callApi('provideAuthPassword', password);

    return {
      ...global,
      authIsLoading: true,
      authError: undefined,
    };
  }
);

addActionHandler(
  'setAuthUsernameAndPassword',
  (global, actions, payload): ActionReturnType => {
    const { username, password } = payload!;
    void callApi('provideAuthUsernameAndPassword', { username, password });

    return {
      ...global,
      authIsLoading: true,
      authError: undefined,
    };
  }
);

addActionHandler('signUp', (global, actions, payload): ActionReturnType => {
  void callApi('provideAuthRegistration', payload!);
  return {
    ...global,
    authIsLoading: true,
    authError: undefined,
  };
});

addActionHandler(
  'resendConfirmationCode',
  (global, action, payload): ActionReturnType => {
    void callApi('requestConfirmationCode', payload!);
    return {
      ...global,
      authError: undefined,
    };
  }
);

addActionHandler(
  'showNotification',
  (global, actions, payload): ActionReturnType => {
    const { tabId = getCurrentTabId(), ...notification } = payload;
    notification.localId = generateIdFor({});

    const newNotifications = [...selectTabState(global, tabId).notifications];
    const existingNotificationIndex = newNotifications.findIndex(
      (n) => n.message === notification.message
    );
    if (existingNotificationIndex !== -1) {
      newNotifications.splice(existingNotificationIndex, 1);
    }

    newNotifications.push(notification as ApiNotification);

    return updateTabState(
      global,
      {
        notifications: newNotifications,
      },
      tabId
    );
  }
);

addActionHandler(
  'dismissNotification',
  (global, actions, payload): ActionReturnType => {
    const { tabId = getCurrentTabId() } = payload;
    const newNotifications = selectTabState(global, tabId).notifications.filter(
      ({ localId }) => localId !== payload.localId
    );

    return updateTabState(
      global,
      {
        notifications: newNotifications,
      },
      tabId
    );
  }
);

addActionHandler(
  'confirmForgotPassword',
  async (global, actions, payload): Promise<void> => {
    const result = await callApi('requestConfirmForgotPassword', payload!);
    if (!result) return;
    actions.showNotification({
      message: t('ForgotPassword.Changed'),
      tabId: getCurrentTabId(),
    });

    global = getGlobal();
    global = {
      ...global,
      authError: undefined,
      confirmData: undefined,
    };
    setGlobal(global);
  }
);

addActionHandler(
  'requestForgotPassword',
  (global, actions, payload): ActionReturnType => {
    void callApi('requestCodeForgotPassword', payload!);

    return {
      ...global,
      authError: undefined,
    };
  }
);

addActionHandler(
  'uploadProfilePhoto',
  async (global, actions, payload): Promise<void> => {
    const { file, isFallback, isVideo, videoTs } = payload!;

    const result = await callApi(
      'uploadProfilePhoto',
      file,
      isFallback,
      isVideo,
      videoTs
    );
    if (!result) return;
    global = getGlobal();
    global = addUsers(global, buildCollectionByKey(result.users, 'id'));
    setGlobal(global);

    actions.loadFullUser({ userId: global.currentUserId! });
    actions.loadProfilePhotos({ profileId: global.currentUserId! });
  }
);

addActionHandler(
  'deleteProfilePhoto',
  async (global, actions, payload): Promise<void> => {
    const { photo } = payload;
    const { currentUserId } = global;
    if (!currentUserId || !photo) return;
    const currentUser = selectUser(global, currentUserId);
    if (!currentUser) return;

    const fullInfo = selectUserFullInfo(global, currentUserId);

    if (
      currentUser.avatarHash === photo.id ||
      fullInfo?.profilePhoto?.id === photo.id
    ) {
      global = updateUser(global, currentUserId, { avatarHash: undefined });
      global = updateUserFullInfo(global, currentUserId, {
        profilePhoto: undefined,
      });
    }

    if (fullInfo?.fallbackPhoto?.id === photo.id) {
      global = updateUserFullInfo(global, currentUserId, {
        fallbackPhoto: undefined,
      });
    }

    if (fullInfo?.personalPhoto?.id === photo.id) {
      global = updateUserFullInfo(global, currentUserId, {
        personalPhoto: undefined,
      });
    }

    const { photos = [] } = currentUser;

    const newPhotos = photos.filter((p) => p.id !== photo.id);
    global = updateUser(global, currentUserId, { photos: newPhotos });

    setGlobal(global);

    await callApi('deleteProfilePhotos', [photo]);

    actions.loadFullUser({ userId: currentUserId, withPhotos: true });
  }
);

addActionHandler('returnToAuthPhoneNumber', (global): ActionReturnType => {
  void callApi('restartAuth');

  return {
    ...global,
    authError: undefined,
  };
});

addActionHandler('returnToAuthPassword', (global): ActionReturnType => {
  //actions.apiUpdate(buildAuthStateUpdate('authorizationStateWaitPassword'));
  void callApi('restartAuth');
  return {
    ...global,
    authError: undefined,
  };
});

addActionHandler('goToAuthQrCode', (global): ActionReturnType => {
  void callApi('restartAuthWithQr');

  return {
    ...global,
    authIsLoadingQrCode: true,
    authError: undefined,
  };
});

addActionHandler(
  'goToRegistration',
  (global, actions, payload): ActionReturnType => {
    actions.apiUpdate(
      buildAuthStateUpdate('authorizationStateWaitRegistration')
    );

    return {
      ...global,
      authError: undefined,
    };
  }
);

addActionHandler(
  'addReferralCode',
  (global, actions, payload): ActionReturnType => {
    return {
      ...global,
      authRefCode: payload?.code,
    };
  }
);

addActionHandler('goToResetPassword', (global, actions): ActionReturnType => {
  actions.apiUpdate(
    buildAuthStateUpdate('authorizationStateWaitResetPassword')
  );
  return {
    ...global,
    authError: undefined,
  };
});

addActionHandler(
  'saveSession',
  (global, actions, payload): ActionReturnType => {
    if (global.passcode.isScreenLocked) {
      return;
    }

    const { sessionData } = payload;
    if (sessionData) {
      storeSession(sessionData, global.currentUserId);
    } else {
      clearStoredSession();
    }
  }
);

addActionHandler('signOut', async (global, actions, payload): Promise<void> => {
  if ('hangUp' in actions) actions.hangUp({ tabId: getCurrentTabId() });
  if ('leaveGroupCall' in actions)
    actions.leaveGroupCall({ tabId: getCurrentTabId() });
  try {
    resetInitialLocationHash();
    await unsubscribe();
    await callApi('destroy');
    //await forceWebsync(false);
  } catch (err) {
    // Do nothing
  }

  actions.reset();

  if (payload?.forceInitApi) {
    actions.initApi();
  }
});

addActionHandler('reset', (global, actions): ActionReturnType => {
  clearStoredSession();
  clearEncryptedSession();

  void cacheApi.clear(MEDIA_CACHE_NAME);
  void cacheApi.clear(MEDIA_CACHE_NAME_AVATARS);
  void cacheApi.clear(MEDIA_PROGRESSIVE_CACHE_NAME);
  void cacheApi.clear(CUSTOM_BG_CACHE_NAME);

  const langCachePrefix = LANG_CACHE_NAME.replace(/\d+$/, '');
  const langCacheVersion = Number((LANG_CACHE_NAME.match(/\d+$/) || ['0'])[0]);
  for (let i = 0; i < langCacheVersion; i++) {
    void cacheApi.clear(`${langCachePrefix}${i === 0 ? '' : i}`);
  }

  void clearLegacySessions();

  updateAppBadge(0);

  actions.initShared({ force: true });
  Object.values(global.byTabId).forEach(({ id: otherTabId, isMasterTab }) => {
    actions.init({ tabId: otherTabId, isMasterTab });
  });
});

addActionHandler('disconnect', (): ActionReturnType => {
  void callApiLocal('disconnect');
});

addActionHandler('destroyConnection', (): ActionReturnType => {
  void callApiLocal('destroy', true, true);
});

addActionHandler('loadNearestCountry', async (global): Promise<void> => {
  if (global.connectionState !== 'connectionStateReady') {
    return;
  }

  const authNearestCountry = await callApi('fetchNearestCountry');

  global = getGlobal();
  global = {
    ...global,
    authNearestCountry,
  };
  setGlobal(global);
});

addActionHandler(
  'setDeviceToken',
  (global, actions, deviceToken): ActionReturnType => {
    return {
      ...global,
      push: {
        deviceToken,
        subscribedAt: Date.now(),
      },
    };
  }
);

addActionHandler('deleteDeviceToken', (global): ActionReturnType => {
  return {
    ...global,
    push: undefined,
  };
});

addActionHandler('lockScreen', async (global): Promise<void> => {
  const sessionJson = JSON.stringify({
    ...loadStoredSession(),
    userId: global.currentUserId,
  });
  const globalJson = await serializeGlobal(global);

  await encryptSession(sessionJson, globalJson);
  forgetPasscode();
  clearStoredSession();
  updateAppBadge(0);

  global = getGlobal();
  global = updatePasscodeSettings(global, {
    isScreenLocked: true,
    invalidAttemptsCount: 0,
    timeoutUntil: undefined,
  });
  setGlobal(global);

  setTimeout(() => {
    global = getGlobal();
    global = clearGlobalForLockScreen(global);
    setGlobal(global);
  }, LOCK_SCREEN_ANIMATION_DURATION_MS);

  try {
    await unsubscribe();
    await callApi('destroy', true);
  } catch (err) {
    // Do nothing
  }
});
