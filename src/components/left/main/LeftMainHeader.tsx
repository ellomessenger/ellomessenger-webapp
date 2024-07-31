import React, { FC, memo, useCallback, useEffect } from 'react';
import { getActions, withGlobal } from '../../../global';

import type { AnimationLevel, ISettings } from '../../../types';
import {
  LeftColumnContent,
  MiddleColumnContent,
  SettingsScreens,
} from '../../../types';
import type { ApiChat } from '../../../api/types';
import type { TabState, GlobalState } from '../../../global/types';

import { IS_PWA } from '../../../util/windowEnvironment';
import {
  selectCurrentMessageList,
  selectIsCurrentUserPremium,
  selectTabState,
  selectTheme,
} from '../../../global/selectors';
import useConnectionStatus from '../../../hooks/useConnectionStatus';
import { useHotkeys } from '../../../hooks/useHotkeys';
import useAppLayout from '../../../hooks/useAppLayout';

import Button from '../../ui/Button';
import ShowTransition from '../../ui/ShowTransition';
import ConnectionStatusOverlay from '../ConnectionStatusOverlay';
import StatusButton from './StatusButton';

import './LeftMainHeader.scss';
import { useTranslation } from 'react-i18next';
import IconSvg from '../../ui/IconSvg';
import classNames from 'classnames';
import SearchInput from '../../ui/SearchInput';
import useFlag from '../../../hooks/useFlag';
import useLastCallback from '../../../hooks/useLastCallback';
import { FeedLeftList, FeedMiddleList } from '../../main/Main';

type OwnProps = {
  shouldHideSearch?: boolean;
  contactsFilter: string;
  channelQuery?: string;
  isClosingSearch?: boolean;
  shouldSkipTransition?: boolean;
  onSearchQuery: (query: string) => void;
  onSelectArchived: () => void;
  onReset: () => void;
  onSettingsScreenSelect: (screen: SettingsScreens) => void;
  feedMiddleScreen: FeedMiddleList;
  feedLeftScreen: FeedLeftList;
  setFeedMiddleScreen: (screen: FeedMiddleList) => void;
};

type StateProps = {
  searchQuery?: string;
  isLoading: boolean;
  currentUserId?: string;
  globalSearchChatId?: string;
  searchDate?: number;
  theme: ISettings['theme'];
  animationLevel: AnimationLevel;
  chatsById?: Record<string, ApiChat>;
  isMessageListOpen: boolean;
  isCurrentUserPremium?: boolean;
  isConnectionStatusMinimized: ISettings['isConnectionStatusMinimized'];
  areChatsLoaded?: boolean;
  hasPasscode?: boolean;
  isAuthRememberMe?: boolean;
} & Pick<GlobalState, 'connectionState' | 'isSyncing' | 'archiveSettings'> &
  Pick<TabState, 'canInstall' | 'leftScreen'>;

const LeftMainHeader: FC<OwnProps & StateProps> = ({
  shouldHideSearch,
  onReset,
  searchQuery,
  channelQuery,
  isCurrentUserPremium,
  globalSearchChatId,
  connectionState,
  isSyncing,
  isMessageListOpen,
  isConnectionStatusMinimized,
  areChatsLoaded,
  hasPasscode,
  isAuthRememberMe,
  contactsFilter,
  leftScreen,
  isClosingSearch,
  onSettingsScreenSelect,
  onSearchQuery,
  feedMiddleScreen,
  feedLeftScreen,
  setFeedMiddleScreen,
}) => {
  const {
    setSettingOption,
    lockScreen,
    requestNextSettingsScreen,
    setLeftScreen,
    setMiddleScreen,
    toggleLeftColumn,
  } = getActions();

  const { t } = useTranslation();

  const { isMobile } = useAppLayout();

  const [isSearchOpen, openSearch, closeSearch] = useFlag();

  const { connectionStatus, connectionStatusText, connectionStatusPosition } =
    useConnectionStatus(
      t,
      connectionState,
      isSyncing,
      isMessageListOpen,
      isConnectionStatusMinimized,
      !areChatsLoaded
    );

  const handleLockScreenHotkey = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (hasPasscode) {
        lockScreen();
      } else {
        requestNextSettingsScreen({ screen: SettingsScreens.PasscodeDisabled });
      }
    },
    [hasPasscode]
  );

  useHotkeys(
    isAuthRememberMe
      ? {
          'Ctrl+Shift+L': handleLockScreenHotkey,
          'Alt+Shift+L': handleLockScreenHotkey,
          'Meta+Shift+L': handleLockScreenHotkey,
          ...(IS_PWA && { 'Mod+L': handleLockScreenHotkey }),
        }
      : undefined
  );

  const handleClickAi = useLastCallback(() => {
    setLeftScreen({ screen: LeftColumnContent.Settings });
    setMiddleScreen({ screen: MiddleColumnContent.Settings });
    onSettingsScreenSelect(SettingsScreens.aiSpace);
    toggleLeftColumn();
  });

  const handleClickQuestion = useLastCallback(() => {
    setMiddleScreen({ screen: MiddleColumnContent.QuickLinks });
    toggleLeftColumn();
  });

  const toggleConnectionStatus = useCallback(() => {
    setSettingOption({
      isConnectionStatusMinimized: !isConnectionStatusMinimized,
    });
  }, [isConnectionStatusMinimized, setSettingOption]);

  const handleLockScreen = useCallback(() => {
    lockScreen();
  }, [lockScreen]);

  const handleSearchFocus = useCallback(() => {
    if (!searchQuery) {
      onSearchQuery('');
    }
  }, [searchQuery, onSearchQuery]);

  const toggleShowSearch = useCallback(() => {
    if (isSearchOpen) {
      closeSearch();
      onReset();
    } else {
      handleSearchFocus();
      openSearch();
      setTimeout(() => {
        const searchInput =
          document.querySelector<HTMLInputElement>('#LeftMainSearch');
        searchInput?.focus();
      }, 200);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (
      searchQuery &&
      ![
        LeftColumnContent.GlobalSearch,
        LeftColumnContent.Contacts,
        LeftColumnContent.Feed,
      ].includes(leftScreen)
    ) {
      closeSearch();
    }
  }, [leftScreen, searchQuery]);

  return (
    <div id='LeftMainHeader' className='left-header'>
      {isMobile &&
        leftScreen === LeftColumnContent.Feed &&
        feedMiddleScreen === FeedMiddleList.Settings && (
          <Button
            round
            color='translucent'
            onClick={() => setFeedMiddleScreen(FeedMiddleList.Main)}
            ariaLabel='Back'
          >
            <div className='icon-svg'>
              <IconSvg name='arrow-left' />
            </div>
          </Button>
        )}
      <h4 className={isSearchOpen ? 'd-none' : ''}>
        {leftScreen !== LeftColumnContent.GlobalSearch &&
          t(`Content.${leftScreen}`)}
      </h4>

      {/*
        {selectedSearchDate && (
          <PickerSelectedItem
            icon='calendar'
            title={selectedSearchDate}
            canClose
            isMinimized={Boolean(globalSearchChatId)}
            className='search-date'
            onClick={setGlobalSearchDate}
            clickArg={clearedDateSearchParam}
          />
        )}
        {globalSearchChatId && (
          <PickerSelectedItem
            chatOrUserId={globalSearchChatId}
            onClick={setGlobalSearchChatId}
            canClose
            clickArg={clearedChatSearchParam}
          />
        )}
      */}
      <div className='btn-block'>
        {![FeedLeftList.Explore, FeedLeftList.Following].includes(
          leftScreen === LeftColumnContent.Feed ? feedLeftScreen : 0
        ) && (
          <>
            <Button
              round
              color='translucent'
              onClick={toggleShowSearch}
              ariaLabel={String(t(isSearchOpen ? 'Close' : 'Search'))}
            >
              <div className='icon-svg'>
                <IconSvg name={isSearchOpen ? 'arrow-left' : 'search'} />
              </div>
            </Button>
            <div
              className={classNames('opacity-transition width-in shown', {
                open: isSearchOpen,
              })}
            >
              <SearchInput
                value={
                  isClosingSearch
                    ? undefined
                    : searchQuery || contactsFilter || channelQuery
                }
                inputId='LeftMainSearch'
                onChange={onSearchQuery}
              />
            </div>
          </>
        )}

        {leftScreen === LeftColumnContent.ChatList && (
          <Button
            round
            color='translucent'
            className='activated'
            size='tiny'
            onClick={handleClickQuestion}
          >
            <i className='icon icon-svg'>
              <IconSvg name='mark' />
            </i>
          </Button>
        )}

        {(leftScreen === LeftColumnContent.ChatList ||
          leftScreen === LeftColumnContent.GlobalSearch) && (
          <Button round size='tiny' color='translucent' onClick={handleClickAi}>
            <i className='icon icon-svg'>
              <IconSvg name='ai-bot-ql' />
            </i>
          </Button>
        )}
        {isMobile &&
          leftScreen === LeftColumnContent.Feed &&
          feedMiddleScreen !== FeedMiddleList.Settings && (
            <Button
              round
              color='translucent'
              ariaLabel='Settimgs'
              size='tiny'
              onClick={() => setFeedMiddleScreen(FeedMiddleList.Settings)}
            >
              <i className='icon-svg'>
                <IconSvg name='settings' />
              </i>
            </Button>
          )}
      </div>

      {isCurrentUserPremium && <StatusButton />}
      {hasPasscode && (
        <Button
          round
          ripple={!isMobile}
          size='smaller'
          color='translucent'
          ariaLabel={`${t(
            'ShortcutsController.Others.LockByPasscode'
          )} (Ctrl+Shift+L)`}
          onClick={handleLockScreen}
          className={classNames({ 'extra-spacing': !isCurrentUserPremium })}
        >
          <i className='icon-lock' />
        </Button>
      )}
      <ShowTransition
        isOpen={connectionStatusPosition === 'overlay'}
        isCustom
        className='connection-state-wrapper'
      >
        <ConnectionStatusOverlay
          connectionStatus={connectionStatus}
          connectionStatusText={connectionStatusText!}
          onClick={toggleConnectionStatus}
        />
      </ShowTransition>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    const tabState = selectTabState(global);
    const {
      query: searchQuery,
      fetchingStatus,
      chatId,
      date,
      filter,
    } = tabState.globalSearch;
    const { currentUserId, connectionState, isSyncing, archiveSettings } =
      global;
    const { byId: chatsById } = global.chats;
    const { isConnectionStatusMinimized, animationLevel } =
      global.settings.byKey;

    return {
      searchQuery,
      isLoading: fetchingStatus
        ? Boolean(fetchingStatus.chats || fetchingStatus.messages)
        : false,
      currentUserId,
      chatsById,
      globalSearchChatId: chatId,
      searchDate: date,
      theme: selectTheme(global),
      animationLevel,
      connectionState,
      isSyncing,
      isMessageListOpen: Boolean(selectCurrentMessageList(global)),
      isConnectionStatusMinimized,
      isCurrentUserPremium: selectIsCurrentUserPremium(global),
      areChatsLoaded: Boolean(global.chats.listIds.active),
      hasPasscode: Boolean(global.passcode.hasPasscode),
      canInstall: Boolean(tabState.canInstall),
      archiveSettings,
      leftScreen: tabState.leftScreen,
      isAuthRememberMe: global.authRememberMe,
    };
  })(LeftMainHeader)
);
