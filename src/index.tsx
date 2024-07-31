import React from 'react';
import './util/handleError';
import './util/setupServiceWorker';
import { createRoot } from 'react-dom/client';

import { getActions, getGlobal } from './global';
import updateWebmanifest from './util/updateWebmanifest';
import { IS_MULTITAB_SUPPORTED } from './util/windowEnvironment';
import './global/init';

import { DEBUG, MULTITAB_LOCALSTORAGE_KEY } from './config';
import {
  establishMultitabRole,
  subscribeToMasterChange,
} from './util/establishMultitabRole';
import {
  requestGlobal,
  subscribeToMultitabBroadcastChannel,
} from './util/multitab';
import { onBeforeUnload } from './util/schedulers';
import { selectTabState } from './global/selectors';

import App from './App';

import './styles/index.scss';
import { requestMutation } from './lib/fasterdom/fasterdom';

init();
async function init() {
  const { switchMultitabRole } = getActions();
  if (DEBUG) {
    console.log('>>> INIT');
  }

  await window.electron?.restoreLocalStorage();

  if (IS_MULTITAB_SUPPORTED) {
    subscribeToMultitabBroadcastChannel();

    await requestGlobal(APP_VERSION);
    localStorage.setItem(MULTITAB_LOCALSTORAGE_KEY, '1');

    onBeforeUnload(() => {
      const global = getGlobal();
      if (Object.keys(global.byTabId).length === 1) {
        localStorage.removeItem(MULTITAB_LOCALSTORAGE_KEY);
      }
    });
  }

  getActions().initShared();
  getActions().init();

  if (IS_MULTITAB_SUPPORTED) {
    establishMultitabRole();
    subscribeToMasterChange((isMasterTab) => {
      switchMultitabRole({ isMasterTab }, { forceSyncOnIOs: true });
    });
  }

  if (DEBUG) {
    console.log('>>> START INITIAL RENDER');
  }

  requestMutation(() => {
    updateWebmanifest();

    const container = document.getElementById('root')!;
    const root = createRoot(container);

    root.render(<App />);
  });

  if (DEBUG) {
    console.log('>>> FINISH INITIAL RENDER');
  }

  if (DEBUG) {
    document.addEventListener('dblclick', () => {
      console.warn('TAB STATE', selectTabState(getGlobal()));
      console.warn('GLOBAL STATE', getGlobal());
    });
  }
}
