import type { ActionReturnType, GlobalState } from '../../types';
import type { RequiredGlobalActions } from '../../index';
import { addActionHandler, getGlobal, setGlobal } from '../../index';

import type {
  ApiUpdateAuthorizationState,
  ApiUpdateAuthorizationError,
  ApiUpdateConnectionState,
  ApiUpdateSession,
  ApiUpdateCurrentUser,
  ApiUpdateServerTimeOffset,
  ApiUpdateConfirmEmailState,
} from '../../../api/types';
import { SESSION_USER_KEY } from '../../../config';
import { updateUser } from '../../reducers';
import { setLanguage } from '../../../util/langProvider';
import { selectTabState } from '../../selectors';
import { forceWebsync } from '../../../util/websync';
import {
  getShippingError,
  shouldClosePaymentModal,
} from '../../../util/getReadableErrorText';
import { clearWebTokenAuth } from '../../../util/routing';
import { getCurrentTabId } from '../../../util/establishMultitabRole';
import { updateTabState } from '../../reducers/tabs';
import { setServerTimeOffset } from '../../../util/serverTime';
import { t } from 'i18next';
import { ConfirmEmailType } from '../../../types';

addActionHandler('apiUpdate', (global, actions, update): ActionReturnType => {
  switch (update['@type']) {
    case 'updateApiReady':
      onUpdateApiReady(global);
      break;

    case 'updateAuthorizationState':
      onUpdateAuthorizationState(global, update);
      break;

    case 'updateAuthorizationError':
      onUpdateAuthorizationError(global, actions, update);
      break;

    case 'updateWebAuthTokenFailed':
      onUpdateWebAuthTokenFailed(global);
      break;

    case 'updateConnectionState':
      onUpdateConnectionState(global, actions, update);
      break;

    case 'updateSession':
      onUpdateSession(global, actions, update);
      break;

    case 'updateServerTimeOffset':
      onUpdateServerTimeOffset(update);
      break;

    case 'updateCurrentUser':
      onUpdateCurrentUser(global, update);
      break;

    case 'updateConfirmEmailState':
      onUpdateConfirmEmailState(global, update);
      break;

    case 'requestInitApi':
      actions.initApi();
      break;

    case 'error': {
      if (
        update.error.message === 'SESSION_REVOKED' ||
        update.error.message === 'USER_DEACTIVATED' ||
        update.error.message === 'AUTH_KEY_INVALID'
      ) {
        actions.signOut({ forceInitApi: true });
        return;
      }

      if (
        ['user is blocked', 'user is deleted'].includes(update.error.message)
      ) {
        const errorMessage = update.error.message;

        onUpdateConfirmEmailState(global, {
          '@type': 'updateConfirmEmailState',
          params: { errorMessage },
        });
      }

      Object.values(global.byTabId).forEach(({ id: tabId }) => {
        const paymentShippingError = getShippingError(update.error);
        if (paymentShippingError) {
          actions.addPaymentError({ error: paymentShippingError, tabId });
        } else if (shouldClosePaymentModal(update.error)) {
          actions.closePaymentModal({ tabId });
        }
        // else if (actions.showDialog) {
        //   actions.showDialog({ data: update.error, tabId });
        // }
      });

      global = getGlobal();
      //auth notification
      const tabId = getCurrentTabId();
      let errorMessage = '';
      switch (update.error.message) {
        case 'user does not exist':
          errorMessage = 'Errors.user_does_not_exist';
          break;
        case 'incorrect code':
          errorMessage = 'Errors.incorrect_code';
          break;
        case 'this email was been registered':
          errorMessage = 'Errors.email_was_been_registered';
          break;
        case 'this username was been registered':
          errorMessage = 'Errors.username_was_been_registered';
          break;
        case 'payment system api error':
          errorMessage = 'Errors.payment_system_api_error';
          break;
        case 'Password is incorrect':
        case 'No such user':
          errorMessage = 'Errors.Credentials';
          break;
        case 'can not unmarshal':
          errorMessage = 'Errors.can_not_unmarshal';
          break;
        case 'subscription already exist':
          errorMessage = 'Errors.SubscriptionAlreadyExist';
          break;
        case 'wallets not initialized':
          errorMessage = 'Errors.walletsNotInitialized';
          break;
        case 'password is not matched':
          errorMessage = 'Errors.incorrect_current_password';
          global = {
            ...global,
            authError: 'You entered an invalid code. Please try again.',
            confirmData: undefined,
          };
          break;
        case 'incorrect email':
          errorMessage = 'Errors.incorrect_email';
          break;
        case 'USER_IS_PRIVATE':
        case 'user is private':
          // actions.showDialog({
          //   data: { message: t('Errors.userIsPrivate') },
          //   tabId,
          // });

          break;
        case 'invalid amount mus be greater than minimal limit':
          errorMessage = 'Errors.invalid_amount';
          global = {
            ...global,
            confirmData: undefined,
          };
          break;
        case 'code not found':
          errorMessage = 'Errors.code_not_found';
          break;
      }

      if (['incorrect code', 'code mismatch'].includes(update.error.message)) {
        global = {
          ...global,
          authError: 'You entered an invalid code. Please try again.',
          confirmData: {
            ...global.confirmData,
            error: 'You entered an invalid code. Please try again.',
          },
        };
      }

      if (
        ['2fa code not verified, try again later'].includes(
          update.error.message
        )
      ) {
        global = {
          ...global,
          confirmData: {
            ...global.confirmData,
            error: 'You entered an invalid code. Please try again.',
          },
        };
      }
      if (update.error.message.includes('email not confirmed for user')) {
        errorMessage = 'Errors.email_not_confirmed';
        const messageArr = update.error.message.split(' ');
        const username = messageArr[messageArr.length - 1];
        actions.resendConfirmationCode({
          username_or_email: username,
          type: ConfirmEmailType.confirmUnauthorized,
        });
      }

      if (update.error.message.includes('is not permitted.')) {
        errorMessage = 'Errors.UsernameReserved';
      }

      if (
        [
          'not enough money on rew for pay transaction',
          'wallets not found for user, please create new one',
          'not enough money for pay transaction',
        ].includes(update.error.message)
      ) {
        actions.showDialog({ data: { success: 'not money' }, tabId });
      }

      if (
        update.error.message === 'user is blocked' ||
        update.error.message === 'user is deleted'
      ) {
        global = {
          ...global,
          authState: 'authorizationStateWhatUserBlocked',
          authIsLoading: false,
        };
      }

      if (Boolean(errorMessage)) {
        actions.showNotification({
          type: 'error',
          message: t(errorMessage),
          tabId,
        });
      }
      setGlobal(global);
      break;
    }
  }
});

function onUpdateApiReady<T extends GlobalState>(global: T) {
  void setLanguage(global.settings.byKey.language);
}

function onUpdateConfirmEmailState<T extends GlobalState>(
  global: T,
  update: ApiUpdateConfirmEmailState
) {
  global = getGlobal();

  global = {
    ...global,
    confirmData: update,
  };
  setGlobal(global);
}

function onUpdateAuthorizationState<T extends GlobalState>(
  global: T,
  update: ApiUpdateAuthorizationState
) {
  global = getGlobal();
  const wasAuthReady = global.authState === 'authorizationStateReady';
  const authState = update.authorizationState;

  global = {
    ...global,
    authState,
    authIsLoading: false,
  };
  setGlobal(global);

  global = getGlobal();

  switch (authState) {
    case 'authorizationStateLoggingOut':
      //void forceWebsync(false);

      global = {
        ...global,
        isLoggingOut: true,
      };
      setGlobal(global);
      break;
    case 'authorizationStateWaitCode':
      global = {
        ...global,
        authIsCodeViaApp: update.isCodeViaApp,
      };
      setGlobal(global);
      break;
    case 'authorizationStateWaitPassword':
      global = {
        ...global,
        authHint: update.hint,
      };

      if (update.noReset) {
        global = {
          ...global,
          hasWebAuthTokenPasswordRequired: true,
        };
      }

      setGlobal(global);
      break;
    case 'authorizationStateWaitQrCode':
      global = {
        ...global,
        authIsLoadingQrCode: false,
        authQrCode: update.qrCode,
      };
      setGlobal(global);
      break;
    case 'authorizationStateReady': {
      if (wasAuthReady) {
        break;
      }

      //void forceWebsync(true);

      global = {
        ...global,
        isLoggingOut: false,
        confirmData: undefined,
      };
      Object.values(global.byTabId).forEach(({ id: tabId }) => {
        global = updateTabState(
          global,
          {
            isInactive: false,
          },
          tabId
        );
      });
      setGlobal(global);

      break;
    }
    default:
      global = {
        ...global,
      };
      setGlobal(global);
      break;
  }
}

function onUpdateAuthorizationError<T extends GlobalState>(
  global: T,
  actions: RequiredGlobalActions,
  update: ApiUpdateAuthorizationError
) {
  const tabId = getCurrentTabId();
  let errorMessage = '';
  switch (update.message) {
    case 'Password is incorrect':
    case 'No such user':
      errorMessage = 'Errors.Credentials';
      break;
    case 'incorrect code':
      errorMessage = 'Errors.incorrect_code';
  }
  // if (update.message.includes('no such user')) {
  //   errorMessage = 'Errors.Credentials';
  // }
  if (update.message.includes('email not confirmed for user')) {
    errorMessage = 'Errors.email_not_confirmed';
  }
  if (!!errorMessage) {
    actions.showNotification({
      type: 'error',
      message: t(errorMessage),
      tabId,
    });
  }

  global = getGlobal();
  global = {
    ...global,
    authError: update.message,
  };
  setGlobal(global);
}

function onUpdateWebAuthTokenFailed<T extends GlobalState>(global: T) {
  clearWebTokenAuth();
  global = getGlobal();

  global = {
    ...global,
    hasWebAuthTokenFailed: true,
  };
  setGlobal(global);
}

function onUpdateConnectionState<T extends GlobalState>(
  global: T,
  actions: RequiredGlobalActions,
  update: ApiUpdateConnectionState
) {
  const { connectionState } = update;

  global = getGlobal();
  const tabState = selectTabState(global, getCurrentTabId());
  if (
    connectionState === 'connectionStateReady' &&
    tabState.isMasterTab &&
    tabState.multitabNextAction
  ) {
    // @ts-ignore
    actions[tabState.multitabNextAction.action](
      // @ts-ignore
      tabState.multitabNextAction.payload
    );
    actions.clearMultitabNextAction({ tabId: tabState.id });
  }

  if (connectionState === global.connectionState) {
    return;
  }

  global = {
    ...global,
    connectionState,
  };
  setGlobal(global);

  if (connectionState === 'connectionStateBroken') {
    actions.signOut({ forceInitApi: true });
  }
}

function onUpdateSession<T extends GlobalState>(
  global: T,
  actions: RequiredGlobalActions,
  update: ApiUpdateSession
) {
  const { sessionData } = update;
  global = getGlobal();
  const { authRememberMe, authState } = global;
  const isEmpty = !sessionData || !sessionData.mainDcId;

  if (!authRememberMe || authState !== 'authorizationStateReady' || isEmpty) {
    return;
  }

  actions.saveSession({ sessionData });
}

function onUpdateServerTimeOffset(update: ApiUpdateServerTimeOffset) {
  setServerTimeOffset(update.serverTimeOffset);
}

function onUpdateCurrentUser<T extends GlobalState>(
  global: T,
  update: ApiUpdateCurrentUser
) {
  const { currentUser } = update;

  global = {
    ...updateUser(global, currentUser.id, currentUser),
    currentUserId: currentUser.id,
  };
  setGlobal(global);

  updateSessionUserId(currentUser.id);
}

function updateSessionUserId(currentUserId: string) {
  const sessionUserAuth = localStorage.getItem(SESSION_USER_KEY);
  if (!sessionUserAuth) return;

  const userAuth = JSON.parse(sessionUserAuth);
  userAuth.id = currentUserId;

  localStorage.setItem(SESSION_USER_KEY, JSON.stringify(userAuth));
}
