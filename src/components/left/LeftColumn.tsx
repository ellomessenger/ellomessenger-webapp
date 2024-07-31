import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getActions, withGlobal } from '../../global';

import type { GlobalState, ISearchQuery } from '../../global/types';
import {
  LeftColumnContent,
  MiddleColumnContent,
  SettingsScreens,
} from '../../types';

import {
  IS_ELECTRON,
  LAYERS_ANIMATION_NAME,
} from '../../util/windowEnvironment';
import captureEscKeyListener from '../../util/captureEscKeyListener';
import {
  selectTabState,
  selectCurrentChat,
  selectIsForumPanelOpen,
} from '../../global/selectors';
import useFoldersReducer from '../../hooks/reducers/useFoldersReducer';
import { useResize } from '../../hooks/useResize';
import useSyncEffect from '../../hooks/useSyncEffect';

import Transition from '../ui/Transition';
import NewChat from './newChat/NewChat.async';
import ArchivedChats from './ArchivedChats.async';

import './LeftColumn.scss';
import LeftMainMenu from './main/LeftMainMenu';
import SettingsMain from './SettingsMain';
import CallsSidebarMain from './Calls/CallsSidebarMain';
import useLastCallback from '../../hooks/useLastCallback';
import Button from '../ui/Button';
import useShowTransition from '../../hooks/useShowTransition';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { historyPushState } from '../../util/routing';
import useEffectOnce from '../../hooks/useEffectOnce';
import { INACTIVE_MARKER, PRODUCTION_URL } from '../../config';
import updateIcon from '../../util/updateIcon';
import useAppLayout from '../../hooks/useAppLayout';
import { FeedLeftList, FeedMiddleList } from '../main/Main';
import LeftMain from './main/LeftMain';

type StateProps = {
  searchQuery?: string;
  searchDate?: number;
  isFirstChatFolderActive: boolean;
  shouldSkipHistoryAnimations?: boolean;
  leftColumnWidth?: number;
  currentUserId?: string;
  hasPasscode?: boolean;
  nextSettingsScreen?: SettingsScreens;
  isChatOpen: boolean;
  isUpdateAvailable?: boolean;
  isForumPanelOpen?: boolean;
  forumPanelChatId?: string;
  middleScreen: MiddleColumnContent;
  leftScreen: LeftColumnContent;
  isClosingSearch?: boolean;
  archiveSettings: GlobalState['archiveSettings'];
  isElectronUpdateAvailable?: boolean;
};

type OwnProps = {
  setSettingsScreen: (val: SettingsScreens) => void;
  settingsScreen: SettingsScreens;
  handleCalls: (value: string) => void;
  openCall: string;
  isLeftShown: boolean;
  setsupport: (val: SettingsScreens | null) => void;
  feedLeftScreen: FeedLeftList;
  setFeedLeftScreen: (screen: FeedLeftList) => void;
  feedMiddleScreen: FeedMiddleList;
  setFeedMiddleScreen: (screen: FeedMiddleList) => void;
};

enum ContentType {
  Main,
  Settings,
  Calls,
  Archived,
  NewGroup,
  NewChannel,
  NewCourse,
  NewMediaSale,
  Feed,
  AgeRestrict,
}

const RENDER_COUNT = Object.keys(ContentType).length / 2;
const RESET_TRANSITION_DELAY_MS = 250;

const LeftColumn: FC<StateProps & OwnProps> = ({
  searchQuery,
  searchDate,
  isFirstChatFolderActive,
  shouldSkipHistoryAnimations,
  leftColumnWidth,
  currentUserId,
  hasPasscode,
  nextSettingsScreen,
  isChatOpen,
  isUpdateAvailable,
  isForumPanelOpen,
  forumPanelChatId,
  isClosingSearch,
  archiveSettings,
  setSettingsScreen,
  settingsScreen,
  leftScreen,
  handleCalls,
  openCall,
  setsupport,
  isLeftShown,
  feedLeftScreen,
  feedMiddleScreen,
  setFeedLeftScreen,
  setFeedMiddleScreen,
  isElectronUpdateAvailable,
}) => {
  const {
    setGlobalSearchQuery,
    setGlobalSearchClosing,
    setGlobalSearchChatId,
    resetChatCreation,
    setGlobalSearchDate,
    loadPasswordInfo,
    clearTwoFaError,
    setLeftColumnWidth,
    resetLeftColumnWidth,
    openChat,
    requestNextSettingsScreen,
    setMiddleScreen,
    setLeftScreen,
    updatePageTitle,
    searchChannelsGlobal,
  } = getActions();

  const { t } = useTranslation();
  const { isDesktop } = useAppLayout();
  const resizeRef = useRef<HTMLDivElement>(null);
  const [contactsFilter, setContactsFilter] = useState<string>('');
  const [channelQuery, setchannelQuery] = useState<string>('');
  const [foldersState, foldersDispatch] = useFoldersReducer();
  const [isElectronAutoUpdateEnabled, setIsElectronAutoUpdateEnabled] =
    useState(false);

  useEffect(() => {
    window.electron
      ?.getIsAutoUpdateEnabled()
      .then(setIsElectronAutoUpdateEnabled);
  }, []);

  // Used to reset child components in background.
  const [lastResetTime, setLastResetTime] = useState<number>(0);

  let contentType: ContentType = ContentType.Main;
  switch (leftScreen) {
    case LeftColumnContent.Archived:
      contentType = ContentType.Archived;
      break;
    case LeftColumnContent.Settings:
      contentType = ContentType.Settings;
      break;
    case LeftColumnContent.Calls:
      contentType = ContentType.Calls;
      break;
    case LeftColumnContent.AgeRestriction:
    case LeftColumnContent.NewChannelTypeInfo:
    case LeftColumnContent.NewChannelSelect:
    case LeftColumnContent.NewChannelStep1:
    case LeftColumnContent.NewChannelStep2:
      contentType = ContentType.NewChannel;
      break;
    case LeftColumnContent.NewGroupStep1:
    case LeftColumnContent.NewGroupStep2:
      contentType = ContentType.NewGroup;
      break;
    case LeftColumnContent.NewCoursSelect:
    case LeftColumnContent.NewCourseTypeInfo:
    case LeftColumnContent.NewCourseStep1:
    case LeftColumnContent.NewCourseStep2:
    case LeftColumnContent.AgeRestrictionForCourse:
      contentType = ContentType.NewCourse;
      break;
    case LeftColumnContent.NewMediaSaleInfo:
      contentType = ContentType.NewMediaSale;
      break;
    // case LeftColumnContent.Feed:
    //   contentType = ContentType.Feed;
  }

  const handleReset = useCallback(
    (forceReturnToChatList?: true | Event, goContent?: LeftColumnContent) => {
      function fullReset() {
        if (leftScreen !== LeftColumnContent.Feed) {
          setLeftScreen({ screen: LeftColumnContent.ChatList });
        }
        setContactsFilter('');
        setchannelQuery('');
        setGlobalSearchClosing({ isClosing: true });
        resetChatCreation();
        setTimeout(() => {
          setGlobalSearchQuery({ query: '' });
          setGlobalSearchDate({ date: undefined });
          setGlobalSearchChatId({ id: undefined });
          setGlobalSearchClosing({ isClosing: false });
          setLastResetTime(Date.now());
          searchChannelsGlobal({ filter: { q: '' } });
        }, RESET_TRANSITION_DELAY_MS);
      }

      if (forceReturnToChatList === true) {
        fullReset();
        return;
      }

      if (goContent) {
        setLeftScreen({ screen: goContent });
        return;
      }

      if (leftScreen === LeftColumnContent.NewGroupStep2) {
        setLeftScreen({ screen: LeftColumnContent.NewGroupStep1 });
        return;
      }

      if (leftScreen === LeftColumnContent.NewChannelStep2) {
        setLeftScreen({ screen: LeftColumnContent.NewChannelStep1 });
        return;
      }

      if (leftScreen === LeftColumnContent.AgeRestriction) {
        setLeftScreen({ screen: LeftColumnContent.NewChannelStep2 });
        return;
      }

      if (leftScreen === LeftColumnContent.NewGroupStep1) {
        const pickerSearchInput = document.getElementById(
          'new-group-picker-search'
        );
        if (pickerSearchInput) {
          pickerSearchInput.blur();
        }
      }

      if (
        [
          LeftColumnContent.NewChannelTypeInfo,
          LeftColumnContent.NewChannelStep1,
        ].includes(leftScreen)
      ) {
        setLeftScreen({ screen: LeftColumnContent.NewChannelSelect });
        return;
      }

      if (leftScreen === LeftColumnContent.NewCourseTypeInfo) {
        setLeftScreen({ screen: LeftColumnContent.NewCoursSelect });
        return;
      }

      if (leftScreen === LeftColumnContent.NewCourseStep1) {
        setLeftScreen({ screen: LeftColumnContent.NewCoursSelect });
        return;
      }

      if (leftScreen === LeftColumnContent.NewCourseStep2) {
        setLeftScreen({ screen: LeftColumnContent.NewCourseStep1 });
        return;
      }

      fullReset();
    },
    [
      leftScreen,
      isFirstChatFolderActive,
      setGlobalSearchClosing,
      resetChatCreation,
      setGlobalSearchQuery,
      setGlobalSearchDate,
      setGlobalSearchChatId,
      settingsScreen,
      hasPasscode,
    ]
  );

  const handleSearchQuery = useLastCallback((query: string) => {
    if (leftScreen === LeftColumnContent.Feed) {
      setchannelQuery(query);
      if (query !== channelQuery) {
        searchChannelsGlobal({ filter: { q: query } });
      }
      return;
    }

    if (!query) {
      setContactsFilter(query);
      setchannelQuery(query);
      searchChannelsGlobal({ filter: { q: query } });
      setGlobalSearchQuery({ query });
      return;
    }
    if (leftScreen === LeftColumnContent.Contacts) {
      setContactsFilter(query);
      if (query !== searchQuery) {
        setGlobalSearchQuery({ query });
      }
      return;
    }

    setLeftScreen({ screen: LeftColumnContent.GlobalSearch });

    if (query !== searchQuery) {
      setGlobalSearchQuery({ query });
    }
  });

  const handleTopicSearch = useCallback(() => {
    setLeftScreen({ screen: LeftColumnContent.GlobalSearch });
    setGlobalSearchQuery({ query: '' });
    setGlobalSearchChatId({ id: forumPanelChatId });
  }, [forumPanelChatId, setGlobalSearchChatId, setGlobalSearchQuery]);

  useEffect(
    () =>
      leftScreen !== LeftColumnContent.ChatList ||
      (isFirstChatFolderActive && !isChatOpen && !isForumPanelOpen)
        ? captureEscKeyListener(() => handleReset())
        : undefined,
    [
      isFirstChatFolderActive,
      leftScreen,
      handleReset,
      isChatOpen,
      isForumPanelOpen,
    ]
  );

  // const handleHotkeySearch = useCallback(
  //   (e: KeyboardEvent) => {
  //     if (leftScreen === LeftColumnContent.GlobalSearch) {
  //       return;
  //     }

  //     e.preventDefault();
  //     setLeftScreen({ screen: LeftColumnContent.GlobalSearch });
  //   },
  //   [leftScreen]
  // );

  const handleHotkeySavedMessages = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      openChat({ id: currentUserId, shouldReplaceHistory: true });
    },
    [currentUserId, openChat]
  );

  const handleArchivedChats = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    setLeftScreen({ screen: LeftColumnContent.Archived });
  }, []);

  const handleHotkeySettings = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    setLeftScreen({ screen: LeftColumnContent.Settings });
  }, []);

  const {
    shouldRender: shouldRenderUpdateButton,
    transitionClassNames: updateButtonClassNames,
  } = useShowTransition(isUpdateAvailable);

  const handleUpdateClick = useLastCallback(() => {
    if (IS_ELECTRON && !isElectronAutoUpdateEnabled) {
      window.open(`${PRODUCTION_URL}/get`, '_blank', 'noopener');
    } else if (isElectronUpdateAvailable) {
      window.electron?.installUpdate();
    } else {
      window.location.reload();
    }
  });

  function selectBottomMenu({
    leftScreen,
    middleScreen,
    settingScreen,
    hash,
  }: {
    leftScreen: LeftColumnContent;
    middleScreen?: MiddleColumnContent;
    settingScreen?: SettingsScreens;
    hash?: string | undefined;
  }) {
    setLeftScreen({ screen: leftScreen });
    setMiddleScreen({ screen: middleScreen });
    settingScreen && setSettingsScreen(settingScreen);
    historyPushState({
      data: {
        leftScreen,
        middleScreen,
        ...(hash && { hash: `#${hash}` }),
      },
      hash: ' ',
    });
    setGlobalSearchQuery({ query: '' });
    setContactsFilter('');
    searchChannelsGlobal({ filter: { q: '' } });
    setchannelQuery('');
    if (!document.title.includes(INACTIVE_MARKER)) {
      updatePageTitle();
    }
    updateIcon(false);
  }
  const handleSelectSettings = useCallback(() => {
    selectBottomMenu({
      leftScreen: LeftColumnContent.Settings,
      middleScreen: MiddleColumnContent.Settings,
      hash: 'profile',
    });
  }, [selectBottomMenu]);

  const handleSelectCalls = useCallback(() => {
    selectBottomMenu({ leftScreen: LeftColumnContent.Calls, hash: 'calls' });
  }, [selectBottomMenu]);

  const handleSelectChats = useLastCallback(() => {
    selectBottomMenu({
      leftScreen: LeftColumnContent.ChatList,
      middleScreen: MiddleColumnContent.Messages,
      settingScreen: SettingsScreens.Main,
      hash: 'chats',
    });
  });

  // const handleSelectChats = useLastCallback(() => {
  //   setLeftScreen({ screen: LeftColumnContent.ChatList });
  //   setMiddleScreen({ screen: MiddleColumnContent.Messages });
  //   setSettingsScreen(SettingsScreens.Main);
  //   setGlobalSearchQuery({ query: '' });
  //   setContactsFilter('');
  //   historyPushState({
  //     data: {
  //       leftScreen: LeftColumnContent.ChatList,
  //       middleScreen: MiddleColumnContent.Messages,
  //     },
  //     hash: `#chats`,
  //   });
  //   updatePageTitle();
  // });

  const handleSelectFeed = useCallback(() => {
    selectBottomMenu({
      leftScreen: LeftColumnContent.Feed,
      middleScreen: MiddleColumnContent.Feed,
      hash: 'feed',
    });
  }, [selectBottomMenu]);

  const handleSelectContacts = useCallback(() => {
    selectBottomMenu({
      leftScreen: LeftColumnContent.Contacts,
      hash: 'contacts',
    });
  }, [selectBottomMenu]);

  useEffectOnce(() => {
    const historyState = window.history.state;

    if (historyState) {
      switch (historyState.leftScreen) {
        case LeftColumnContent.Feed:
          setLeftScreen({ screen: LeftColumnContent.Feed });
          setMiddleScreen({ screen: MiddleColumnContent.Feed });
          break;
        case LeftColumnContent.Settings:
          setLeftScreen({ screen: LeftColumnContent.Settings });
          setMiddleScreen({ screen: MiddleColumnContent.Settings });
          break;
      }
    }
  });

  // useHotkeys({
  //   'Mod+Shift+F': handleHotkeySearch,
  //   'Mod+Shift+S': handleHotkeySavedMessages,
  //   ...(IS_PWA && {
  //     'Mod+0': handleHotkeySavedMessages,
  //     'Mod+9': handleArchivedChats,
  //   }),
  //   ...(IS_MAC_OS && IS_PWA && { 'Mod+,': handleHotkeySettings }),
  // });

  useEffect(() => {
    clearTwoFaError();

    if (settingsScreen === SettingsScreens.Privacy) {
      loadPasswordInfo();
    }
  }, [clearTwoFaError, loadPasswordInfo, settingsScreen]);

  useSyncEffect(() => {
    if (nextSettingsScreen !== undefined) {
      setLeftScreen({ screen: LeftColumnContent.Settings });
      setSettingsScreen(nextSettingsScreen);
      requestNextSettingsScreen({ screen: undefined });
    }
  }, [nextSettingsScreen, requestNextSettingsScreen]);

  const { initResize, resetResize, handleMouseUp } = useResize(
    resizeRef,
    (n) =>
      setLeftColumnWidth({
        leftColumnWidth: n,
      }),
    resetLeftColumnWidth,
    leftColumnWidth,
    '--left-column-width'
  );

  const handleSettingsScreenSelect = useCallback((screen: SettingsScreens) => {
    setLeftScreen({ screen: LeftColumnContent.Settings });
    setSettingsScreen(screen);
  }, []);

  return (
    <div
      id='LeftColumn'
      className={classNames('LeftColumn', { hide: !isLeftShown && !isDesktop })}
      ref={resizeRef}
    >
      <Transition
        name={shouldSkipHistoryAnimations ? 'none' : LAYERS_ANIMATION_NAME}
        renderCount={RENDER_COUNT}
        activeKey={contentType}
        shouldCleanup
        cleanupExceptionKey={ContentType.Main}
      >
        {(isActive) => {
          switch (contentType) {
            case ContentType.Archived:
              return (
                <ArchivedChats
                  isActive={isActive}
                  onReset={handleReset}
                  onTopicSearch={handleTopicSearch}
                  foldersDispatch={foldersDispatch}
                  onSettingsScreenSelect={handleSettingsScreenSelect}
                  isForumPanelOpen={isForumPanelOpen}
                  archiveSettings={archiveSettings}
                />
              );
            case ContentType.Settings:
              return (
                <SettingsMain
                  onScreenSelect={handleSettingsScreenSelect}
                  isActive={isActive}
                  onReset={handleReset}
                  settingsScreen={settingsScreen}
                  setSupport={setsupport}
                />
              );
            case ContentType.Calls:
              return (
                <CallsSidebarMain
                  handleCalls={handleCalls}
                  openCall={openCall}
                />
              );

            case ContentType.NewCourse:
              return (
                <NewChat
                  key={lastResetTime}
                  isActive={isActive}
                  isChannel
                  isCourse
                  onReset={handleReset}
                />
              );
            case ContentType.NewChannel:
              return (
                <NewChat
                  key={lastResetTime}
                  isActive={isActive}
                  isChannel
                  onReset={handleReset}
                />
              );

            case ContentType.NewMediaSale:
              return (
                <NewChat
                  key={lastResetTime}
                  isActive={isActive}
                  isChannel
                  isMediaSale
                  onReset={handleReset}
                />
              );
            case ContentType.NewGroup:
              return (
                <NewChat
                  key={lastResetTime}
                  isActive={isActive}
                  onReset={handleReset}
                />
              );

            // case ContentType.AgeRestrict:
            //   return (
            //     <NewChat
            //       key={lastResetTime}
            //       isActive={isActive}
            //       isCourse
            //       onReset={handleReset}
            //     />
            //   );

            default:
              return (
                <LeftMain
                  isClosingSearch={isClosingSearch}
                  searchQuery={searchQuery}
                  searchDate={searchDate}
                  contactsFilter={contactsFilter}
                  channelQuery={channelQuery}
                  foldersDispatch={foldersDispatch}
                  onSearchQuery={handleSearchQuery}
                  onSettingsScreenSelect={handleSettingsScreenSelect}
                  onReset={handleReset}
                  shouldSkipTransition={shouldSkipHistoryAnimations}
                  isForumPanelOpen={isForumPanelOpen}
                  onTopicSearch={handleTopicSearch}
                  feedLeftScreen={feedLeftScreen}
                  feedMiddleScreen={feedMiddleScreen}
                  setFeedLeftScreen={setFeedLeftScreen}
                  setFeedMiddleScreen={setFeedMiddleScreen}
                />
              );
          }
        }}
      </Transition>
      <LeftMainMenu
        onSelectSettings={handleSelectSettings}
        onSelectChats={handleSelectChats}
        onSelectCalls={handleSelectCalls}
        onSelectFeed={handleSelectFeed}
        onSelectContacts={handleSelectContacts}
      />
      <div
        className='resize-handle'
        onMouseDown={initResize}
        onMouseUp={handleMouseUp}
        onDoubleClick={resetResize}
      />
      {shouldRenderUpdateButton && (
        <Button
          fluid
          pill
          className={classNames('btn-update', updateButtonClassNames)}
          onClick={handleUpdateClick}
        >
          {t('UpdateEllo')}
        </Button>
      )}
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    const tabState = selectTabState(global);
    const {
      globalSearch: { query, date },
      shouldSkipHistoryAnimations,
      activeChatFolder,
      nextSettingsScreen,
      middleScreen,
      leftScreen,
    } = tabState;
    const {
      leftColumnWidth,
      currentUserId,
      passcode: { hasPasscode },
      isUpdateAvailable,
      isElectronUpdateAvailable,
      archiveSettings,
    } = global;

    const currentChat = selectCurrentChat(global);
    const isChatOpen = Boolean(currentChat?.id);
    const isForumPanelOpen = selectIsForumPanelOpen(global);
    const forumPanelChatId = tabState.forumPanelChatId;

    return {
      searchQuery: query,
      searchDate: date,
      isFirstChatFolderActive: activeChatFolder === 0,
      shouldSkipHistoryAnimations,
      leftColumnWidth,
      currentUserId,
      hasPasscode,
      nextSettingsScreen,
      isChatOpen,
      isUpdateAvailable,
      isElectronUpdateAvailable,
      isForumPanelOpen,
      forumPanelChatId,
      isClosingSearch: tabState.globalSearch.isClosing,
      archiveSettings,
      middleScreen,
      leftScreen,
    };
  })(LeftColumn)
);
