import React, { FC, useEffect } from 'react';

import type { ThemeKey } from '../../types';
import { getActions, getGlobal, withGlobal } from '../../global';
import { getChatAvatarHash } from '../../global/helpers';
import * as mediaLoader from '../../util/mediaLoader';
import { Bundles, loadModule } from '../../util/moduleLoader';
import preloadFonts from '../../util/fonts';
import { preloadImage } from '../../util/files';
import { pause } from '../../util/schedulers';
import { ApiMediaFormat } from '../../api/types';

import useFlag from '../../hooks/useFlag';
import telegramLogoPath from '../../assets/telegram-logo.svg';
import reactionThumbsPath from '../../assets/reaction-thumbs.png';
import lockPreviewPath from '../../assets/lock.png';
import monkeyPath from '../../assets/monkey.svg';
import spoilerMaskPath from '../../assets/spoilers/mask.svg';

import {
  selectIsRightColumnShown,
  selectTabState,
  selectTheme,
} from '../../global/selectors';
import { TabState } from '../../global/types';
import classNames from 'classnames';
import { Notifications } from '../../bundles/extra';

import styles from './GlobalLayout.module.scss';

export type UiLoaderPage =
  | 'main'
  | 'lock'
  | 'inactive'
  | 'authCode'
  | 'authPassword'
  | 'authPhoneNumber'
  | 'authQrCode'
  | 'authResetPassword'
  | 'authRegister'
  | 'authConfirm'
  | 'infoAccount'
  | 'blockedUser';

type OwnProps = {
  page?: UiLoaderPage;
  children: React.ReactNode;
  isMobile?: boolean;
};

type StateProps = Pick<
  TabState,
  'uiReadyState' | 'shouldSkipHistoryAnimations'
> & {
  isRightColumnShown?: boolean;
  leftColumnWidth?: number;
  theme: ThemeKey;
  hasNotifications: boolean;
  authReady: boolean;
};

const MAX_PRELOAD_DELAY = 700;
const SECOND_STATE_DELAY = 1000;
const AVATARS_TO_PRELOAD = 10;

function preloadAvatars() {
  const { listIds, byId } = getGlobal().chats;
  if (!listIds.active) {
    return undefined;
  }

  return Promise.all(
    listIds.active.slice(0, AVATARS_TO_PRELOAD).map((chatId) => {
      const chat = byId[chatId];
      if (!chat) {
        return undefined;
      }

      const avatarHash = getChatAvatarHash(chat);
      if (!avatarHash) {
        return undefined;
      }

      return mediaLoader.fetch(avatarHash, ApiMediaFormat.BlobUrl);
    })
  );
}

const preloadTasks = {
  main: () =>
    Promise.all([
      loadModule(Bundles.Main).then(preloadFonts),
      preloadAvatars(),
      preloadImage(reactionThumbsPath),
      preloadImage(spoilerMaskPath),
    ]),
  authPhoneNumber: () =>
    Promise.all([preloadFonts(), preloadImage(telegramLogoPath)]),
  authCode: () => preloadImage(monkeyPath),
  authPassword: () => preloadImage(monkeyPath),
  authQrCode: preloadFonts,
  lock: () => Promise.all([preloadFonts(), preloadImage(lockPreviewPath)]),
  inactive: () => {},
  authResetPassword: () => {},
  authRegister: () => {},
  authConfirm: () => {},
  infoAccount: () => {},
  blockedUser: () => {},
};

const GlobalLayout: FC<OwnProps & StateProps> = ({
  children,
  page,
  isRightColumnShown,
  shouldSkipHistoryAnimations,
  leftColumnWidth,

  hasNotifications,
}) => {
  const { setIsUiReady } = getActions();

  const [isReady, markReady] = useFlag();

  useEffect(() => {
    let timeout: number | undefined;

    const safePreload = async () => {
      try {
        await preloadTasks[page!]();
      } catch (err) {
        // Do nothing
      }
    };

    Promise.race([
      pause(MAX_PRELOAD_DELAY),
      page ? safePreload() : Promise.resolve(),
    ]).then(() => {
      markReady();
      setIsUiReady({ uiReadyState: 1 });

      timeout = window.setTimeout(() => {
        setIsUiReady({ uiReadyState: 2 });
      }, SECOND_STATE_DELAY);
    });

    return () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
      }

      setIsUiReady({ uiReadyState: 0 });
    };
  }, [page]);

  return (
    <>
      <div id='portals'></div>
      <div id='UiLoader' className={styles.bg}>
        <div className={classNames(page, styles.main)}>
          {children}
          {!isReady && !shouldSkipHistoryAnimations && Boolean(page) && (
            <div className={styles.mask}>
              {page === 'main' ? (
                <div className={styles.main}>
                  <div
                    className={styles.left}
                    style={{
                      width: leftColumnWidth
                        ? `${leftColumnWidth}px`
                        : undefined,
                    }}
                  />
                  <div className={classNames(styles.middle, styles.bg)} />
                  {isRightColumnShown && <div className={styles.right} />}
                </div>
              ) : page === 'inactive' || page === 'lock' ? (
                <div className={classNames(styles.blank, styles.bg)} />
              ) : (
                <div className={styles.blank} />
              )}
            </div>
          )}
        </div>
      </div>
      <Notifications isOpen={hasNotifications} />
    </>
  );
};

export default withGlobal<OwnProps>((global, { isMobile }): StateProps => {
  const theme = selectTheme(global);
  const { shouldSkipHistoryAnimations, uiReadyState, notifications } =
    selectTabState(global);

  return {
    shouldSkipHistoryAnimations: shouldSkipHistoryAnimations,
    uiReadyState: uiReadyState,
    isRightColumnShown: selectIsRightColumnShown(global, isMobile),
    leftColumnWidth: global.leftColumnWidth,
    hasNotifications: Boolean(notifications.length),
    theme,
    authReady: Boolean(global.authState),
  };
})(GlobalLayout);
