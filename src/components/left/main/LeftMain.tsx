import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getActions, withGlobal } from '../../../global';

import type { SettingsScreens } from '../../../types';
import { LeftColumnContent } from '../../../types';
import type { FolderEditDispatch } from '../../../hooks/reducers/useFoldersReducer';

import { IS_TOUCH_ENV } from '../../../util/windowEnvironment';
import useForumPanelRender from '../../../hooks/useForumPanelRender';

import LeftMainHeader from './LeftMainHeader';
import ChatFolders from './ChatFolders';
import NewChatButton from '../NewChatButton';
import ForumPanel from './ForumPanel';
import Transition from '../../ui/Transition';
import LeftSearch from '../search/LeftSearch';
import ContactList from './ContactList';
import { CREATE_NEW_PUBLIC_CHANNEL_ID } from '../../../config';
import useLastCallback from '../../../hooks/useLastCallback';
import { selectTabState } from '../../../global/selectors';

import FeedChats from '../feed/FeedChats';
import { GlobalState } from '../../../global/types';
import './LeftMain.scss';
import classNames from 'classnames';
import { FeedLeftList, FeedMiddleList } from '../../main/Main';

type OwnProps = {
  searchQuery?: string;
  searchDate?: number;
  channelQuery?: string;
  contactsFilter: string;
  shouldSkipTransition?: boolean;
  foldersDispatch: FolderEditDispatch;
  isForumPanelOpen?: boolean;
  isClosingSearch?: boolean;
  onSearchQuery: (query: string) => void;
  onSettingsScreenSelect: (screen: SettingsScreens) => void;
  onTopicSearch: NoneToVoidFunction;
  onReset: () => void;
  feedLeftScreen: FeedLeftList;
  setFeedLeftScreen: (screen: FeedLeftList) => void;
  feedMiddleScreen: FeedMiddleList;
  setFeedMiddleScreen: (screen: FeedMiddleList) => void;
};

type StateProps = {
  leftScreen: LeftColumnContent;
  isMenuShown: boolean;
  archiveSettings: GlobalState['archiveSettings'];
};

const TRANSITION_RENDER_COUNT = Object.keys(LeftColumnContent).length / 2;
const BUTTON_CLOSE_DELAY_MS = 250;

let closeTimeout: number | undefined;

const LeftMain: FC<OwnProps & StateProps> = ({
  searchQuery,
  channelQuery,
  searchDate,
  isClosingSearch,
  contactsFilter,
  shouldSkipTransition,
  foldersDispatch,
  isForumPanelOpen,
  leftScreen,
  isMenuShown,
  archiveSettings,
  onSearchQuery,
  onSettingsScreenSelect,
  onReset,
  onTopicSearch,
  feedLeftScreen,
  feedMiddleScreen,
  setFeedLeftScreen,
  setFeedMiddleScreen,
}) => {
  const { closeForumPanel, toggleManagement, toggleChatInfo, setLeftScreen } =
    getActions();

  const [isNewChatButtonShown, setIsNewChatButtonShown] =
    useState(IS_TOUCH_ENV);

  const {
    shouldRenderForumPanel,
    handleForumPanelAnimationEnd,
    handleForumPanelAnimationStart,
    isAnimationStarted,
  } = useForumPanelRender(isForumPanelOpen);
  const isForumPanelRendered =
    isForumPanelOpen && leftScreen === LeftColumnContent.ChatList;
  const isForumPanelVisible = isForumPanelRendered && isAnimationStarted;

  const isMouseInside = useRef(false);

  const handleMouseEnter = useCallback(() => {
    if (
      ![LeftColumnContent.ChatList, LeftColumnContent.Contacts].includes(
        leftScreen
      )
    ) {
      return;
    }
    isMouseInside.current = true;
    setIsNewChatButtonShown(true);
  }, [leftScreen]);

  const handleMouseLeave = useCallback(() => {
    isMouseInside.current = false;
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = undefined;
    }

    closeTimeout = window.setTimeout(() => {
      if (!isMouseInside.current) {
        setIsNewChatButtonShown(false);
      }
    }, BUTTON_CLOSE_DELAY_MS);
  }, []);

  const handleSelectContacts = useCallback(() => {
    setLeftScreen({ screen: LeftColumnContent.Contacts });
  }, []);

  const handleSelectArchived = useCallback(() => {
    setLeftScreen({ screen: LeftColumnContent.Archived });
    closeForumPanel();
  }, [closeForumPanel]);

  const handleSelectNewChannel = useLastCallback(() => {
    setLeftScreen({ screen: LeftColumnContent.NewChannelSelect });
    toggleChatInfo({ force: false }, { forceSyncOnIOs: true });
    toggleManagement({ localChatId: CREATE_NEW_PUBLIC_CHANNEL_ID });
  });

  const handleSelectNewCourse = useLastCallback(() => {
    setLeftScreen({ screen: LeftColumnContent.NewCoursSelect });
    toggleChatInfo({ force: false }, { forceSyncOnIOs: true });
    toggleManagement({ localChatId: CREATE_NEW_PUBLIC_CHANNEL_ID });
  });

  const handleSelectNewMediaSale = useCallback(() => {
    setLeftScreen({ screen: LeftColumnContent.NewMediaSaleInfo });
  }, []);

  const handleSelectNewGroup = useCallback(() => {
    setLeftScreen({ screen: LeftColumnContent.NewGroupStep1 });
  }, []);

  useEffect(() => {
    let autoCloseTimeout: number | undefined;
    if (
      ![LeftColumnContent.ChatList, LeftColumnContent.Contacts].includes(
        leftScreen
      )
    ) {
      autoCloseTimeout = window.setTimeout(() => {
        setIsNewChatButtonShown(false);
      }, BUTTON_CLOSE_DELAY_MS);
    } else if (isMouseInside.current || IS_TOUCH_ENV || isMenuShown) {
      setIsNewChatButtonShown(true);
    }

    return () => {
      if (autoCloseTimeout) {
        clearTimeout(autoCloseTimeout);
        autoCloseTimeout = undefined;
      }
    };
  }, [leftScreen, isMenuShown]);

  return (
    <div
      id='LeftColumn-main'
      onMouseEnter={!IS_TOUCH_ENV ? handleMouseEnter : undefined}
      onMouseLeave={!IS_TOUCH_ENV ? handleMouseLeave : undefined}
      className={classNames({ 'revealed-button': isNewChatButtonShown })}
    >
      <LeftMainHeader
        shouldHideSearch={isForumPanelVisible}
        contactsFilter={contactsFilter}
        channelQuery={channelQuery}
        onSearchQuery={onSearchQuery}
        onSelectArchived={handleSelectArchived}
        onReset={onReset}
        shouldSkipTransition={shouldSkipTransition}
        isClosingSearch={isClosingSearch}
        onSettingsScreenSelect={onSettingsScreenSelect}
        feedMiddleScreen={feedMiddleScreen}
        feedLeftScreen={feedLeftScreen}
        setFeedMiddleScreen={setFeedMiddleScreen}
      />
      <Transition
        name={shouldSkipTransition ? 'none' : 'zoom-fade'}
        renderCount={TRANSITION_RENDER_COUNT}
        activeKey={leftScreen}
        shouldCleanup
        cleanupExceptionKey={LeftColumnContent.ChatList}
      >
        {(isActive) => {
          switch (leftScreen) {
            case LeftColumnContent.ChatList:
              return (
                <ChatFolders
                  shouldHideFolderTabs={isForumPanelVisible}
                  onSettingsScreenSelect={onSettingsScreenSelect}
                  foldersDispatch={foldersDispatch}
                  isForumPanelOpen={isForumPanelVisible}
                />
              );
            case LeftColumnContent.GlobalSearch:
              return (
                <LeftSearch
                  searchQuery={searchQuery}
                  searchDate={searchDate}
                  isActive={isActive}
                  onReset={onReset}
                />
              );

            case LeftColumnContent.Contacts:
              return (
                <ContactList
                  filter={contactsFilter}
                  isActive={isActive}
                  onReset={onReset}
                />
              );
            case LeftColumnContent.Feed:
              return (
                <FeedChats
                  isActive={isActive}
                  onSettingsScreenSelect={onSettingsScreenSelect}
                  feedLeftScreen={feedLeftScreen}
                  feedMiddleScreen={feedMiddleScreen}
                  setFeedLeftScreen={setFeedLeftScreen}
                  setFeedMiddleScreen={setFeedMiddleScreen}
                />
              );
            default:
              return undefined;
          }
        }}
      </Transition>

      {shouldRenderForumPanel && (
        <ForumPanel
          isOpen={isForumPanelOpen}
          isHidden={!isForumPanelRendered}
          onTopicSearch={onTopicSearch}
          onOpenAnimationStart={handleForumPanelAnimationStart}
          onCloseAnimationEnd={handleForumPanelAnimationEnd}
        />
      )}
      <NewChatButton
        isShown={isNewChatButtonShown!}
        screen={leftScreen}
        isMenuOpen={isMenuShown}
        onNewPrivateChat={handleSelectContacts}
        onNewChannel={handleSelectNewChannel}
        onNewGroup={handleSelectNewGroup}
        onNewCourse={handleSelectNewCourse}
        onNewMediaSale={handleSelectNewMediaSale}
      />
    </div>
  );
};

export default memo(
  withGlobal((global): StateProps => {
    const { leftScreen, isMenuShown } = selectTabState(global);
    const { archiveSettings } = global;
    return {
      leftScreen,
      archiveSettings,
      isMenuShown,
    };
  })(LeftMain)
);
