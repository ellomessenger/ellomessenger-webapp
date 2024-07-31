import React, { FC, useEffect } from 'react';

import type { GlobalState } from './global/types';
import './util/i18n';
import { DEBUG, INACTIVE_MARKER, PAGE_TITLE } from './config';
import { getActions, withGlobal } from './global';
import { selectTabState } from './global/selectors';
import {
  IS_INSTALL_PROMPT_SUPPORTED,
  IS_MULTITAB_SUPPORTED,
} from './util/windowEnvironment';
import useFlag from './hooks/useFlag';
import { setupBeforeInstallPrompt } from './util/installPrompt';
import { hasStoredSession } from './util/sessions';
import { parseInitialLocationHash } from './util/routing';
import { updateSizes } from './util/windowSize';
import { addActiveTabChangeListener } from './util/activeTabMonitor';
import Auth from './components/auth/Auth';
import GlobalLayout, {
  UiLoaderPage,
} from './layouts/GlobalLayout/GlobalLayout';
import useAppLayout from './hooks/useAppLayout';
import Main from './components/main/Main.async';
import './assets/styles/styles.scss';
import { LockScreen } from './bundles/main';
import AppInactive from './components/main/AppInactive';
import ComingSoonPage from './components/main/ComingSoonPage';

// import Test from './components/test/TestNoRedundancy';

type StateProps = {
  authState: GlobalState['authState'];
  isScreenLocked?: boolean;
  hasPasscode?: boolean;
  isInactiveAuth?: boolean;
  hasWebAuthTokenFailed?: boolean;
};

enum AppScreens {
  auth,
  lock,
  main,
  inactive,
  comingSoon,
}

const INACTIVE_PAGE_TITLE = `${PAGE_TITLE} ${INACTIVE_MARKER}`;

const App: FC<StateProps> = ({
  authState,
  isScreenLocked,
  hasPasscode,
  hasWebAuthTokenFailed,
  isInactiveAuth,
}) => {
  const { disconnect } = getActions();
  const [isInactive, markInactive, unmarkInactive] = useFlag(false);
  const { isMobile } = useAppLayout();
  useEffect(() => {
    if (IS_INSTALL_PROMPT_SUPPORTED) {
      setupBeforeInstallPrompt();
    }
  }, []);

  // Prevent drop on elements that do not accept it
  useEffect(() => {
    const body = document.body;
    const handleDrag = (e: DragEvent) => {
      e.preventDefault();
      if (!e.dataTransfer) return;
      if (!(e.target as HTMLElement).dataset.dropzone) {
        e.dataTransfer.dropEffect = 'none';
      } else {
        e.dataTransfer.dropEffect = 'copy';
      }
    };
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
    };
    body.addEventListener('drop', handleDrop);
    body.addEventListener('dragover', handleDrag);
    body.addEventListener('dragenter', handleDrag);

    return () => {
      body.removeEventListener('drop', handleDrop);
      body.removeEventListener('dragover', handleDrag);
      body.removeEventListener('dragenter', handleDrag);
    };
  }, []);

  // return <Test />;

  let activeKey = AppScreens.inactive;
  let page: UiLoaderPage | undefined;
  let comingSoon = !DEBUG;

  if (comingSoon) {
    activeKey = AppScreens.comingSoon;
  } else if (isInactive) {
    activeKey = AppScreens.inactive;
  } else if (isScreenLocked) {
    page = 'lock';
    activeKey = AppScreens.lock;
  } else if (authState) {
    switch (authState) {
      case 'authorizationStateWaitPhoneNumber':
        page = 'authPhoneNumber';
        activeKey = AppScreens.auth;
        break;
      case 'authorizationStateWaitCode':
        page = 'authCode';
        activeKey = AppScreens.auth;
        break;
      case 'authorizationStateWaitPassword':
        page = 'authPassword';
        activeKey = AppScreens.auth;
        break;
      case 'authorizationStateWaitRegistration':
        activeKey = AppScreens.auth;
        break;
      case 'authorizationStateWaitQrCode':
        page = 'authQrCode';
        activeKey = AppScreens.auth;
        break;
      case 'authorizationStateWaitConfirmEmail':
        page = 'authConfirm';
        activeKey = AppScreens.auth;
        break;
      case 'authorizationStateWaitResetPassword':
        page = 'authResetPassword';
        activeKey = AppScreens.auth;
        break;
      case 'authorizationStateWhatAccountChoose':
        page = 'infoAccount';
        activeKey = AppScreens.auth;
        break;
      case 'authorizationStateWhatUserBlocked':
        page = 'blockedUser';
        activeKey = AppScreens.auth;
        break;
      case 'authorizationStateClosed':
      case 'authorizationStateClosing':
      case 'authorizationStateLoggingOut':
      case 'authorizationStateReady':
        page = 'main';
        activeKey = AppScreens.main;
        break;
    }
  } else if (hasStoredSession(true)) {
    page = 'main';
    activeKey = AppScreens.main;
  } else if (hasPasscode) {
    activeKey = AppScreens.lock;
  } else {
    page = 'authPassword';
    activeKey = AppScreens.auth;
  }

  if (
    activeKey !== AppScreens.lock &&
    activeKey !== AppScreens.inactive &&
    activeKey !== AppScreens.main &&
    parseInitialLocationHash()?.tgWebAuthToken &&
    !hasWebAuthTokenFailed
  ) {
    page = 'main';
    activeKey = AppScreens.main;
  }

  useEffect(() => {
    updateSizes();

    if (IS_MULTITAB_SUPPORTED) return;

    addActiveTabChangeListener(() => {
      disconnect();
      document.title = INACTIVE_PAGE_TITLE;

      markInactive();
    });
  }, [activeKey, disconnect, markInactive]);

  useEffect(() => {
    if (isInactiveAuth) {
      document.title = INACTIVE_PAGE_TITLE;
      markInactive();
    } else {
      document.title = PAGE_TITLE;
      unmarkInactive();
    }
  }, [isInactiveAuth, markInactive, unmarkInactive]);

  function renderContent() {
    switch (activeKey) {
      case AppScreens.auth:
        return <Auth />;
      case AppScreens.main:
        return <Main isMobile={isMobile} />;
      case AppScreens.lock:
      //return <LockScreen isLocked={isScreenLocked} />;
      case AppScreens.comingSoon:
        return <ComingSoonPage />;
      case AppScreens.inactive:
        document.body.classList.remove('initial');
        return <AppInactive />;
    }
  }

  return <GlobalLayout page={page}>{renderContent()}</GlobalLayout>;
};

export default withGlobal((global): StateProps => {
  return {
    authState: global.authState,
    isScreenLocked: global.passcode?.isScreenLocked,
    hasPasscode: global.passcode?.hasPasscode,
    isInactiveAuth: selectTabState(global).isInactive,
    hasWebAuthTokenFailed:
      global.hasWebAuthTokenFailed || global.hasWebAuthTokenPasswordRequired,
  };
})(App);
