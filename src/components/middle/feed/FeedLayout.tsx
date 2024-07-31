import React, { FC, memo, useCallback, useMemo, useRef, useState } from 'react';

import usePrevDuringAnimation from '../../../hooks/usePrevDuringAnimation';
import {
  AnimationLevel,
  LeftColumnContent,
  MiddleColumnContent,
  SettingsScreens,
  ThemeKey,
} from '../../../types';
import { getActions, withGlobal } from '../../../global';
import {
  ANIMATION_END_DELAY,
  ANIMATION_LEVEL_MAX,
  ANIMATION_LEVEL_MIN,
  FEED_BG_COLOR,
  INACTIVE_MARKER,
} from '../../../config';
import {
  getUnreadChats,
  selectIsRightColumnShown,
  selectTabState,
  selectTheme,
} from '../../../global/selectors';
import { MessageListType } from '../../../global/types';
import useForceUpdate from '../../../hooks/useForceUpdate';
import useSyncEffect from '../../../hooks/useSyncEffect';
import useTimeout from '../../../hooks/useTimeout';
import FeedHeader from './FeedHeader';
import usePrevious from '../../../hooks/usePrevious';
import Transition from '../../ui/Transition';
import MessageFeedList from './MessageFeedList';

import usePinnedMessage from '../hooks/usePinnedMessage';
import FeedSettings from './FeedSettings';
import calculateMiddleFooterTransforms from '../helpers/calculateMiddleFooterTransforms';
import useWindowSize from '../../../hooks/useWindowSize';

import classNames from 'classnames';
import { ApiChat, MAIN_THREAD_ID } from '../../../api/types';

import './FeedLayout.scss';
import styles from './FeedLayout.module.scss';
import Button from '../../ui/Button';
import IconSvg from '../../ui/IconSvg';
import Avatar from '../../common/Avatar';
import useAppLayout from '../../../hooks/useAppLayout';
import { FeedMiddleList } from '../../main/Main';

interface OwnProps {
  isMobile?: boolean;
  feedScreen: FeedMiddleList;
  setFeedScreen: (screen: FeedMiddleList) => void;
}

type StateProps = {
  chatId?: string;
  threadId?: number;
  messageListType?: MessageListType;
  shouldSkipHistoryAnimations?: boolean;
  animationLevel: AnimationLevel;
  currentTransitionKey: number;
  pinnedIds?: number[];
  isRightColumnShown?: boolean;
  customBackground?: { default: string };
  theme: ThemeKey;
  unreadChats?: ApiChat[];
};

const LAYER_ANIMATION_DURATION_MS = 450 + ANIMATION_END_DELAY;

const FeedLayout: FC<StateProps & OwnProps> = ({
  isMobile,
  chatId,
  threadId,
  isRightColumnShown,
  shouldSkipHistoryAnimations,
  animationLevel,
  currentTransitionKey,
  pinnedIds,
  customBackground,
  unreadChats,
  feedScreen,
  setFeedScreen,
}) => {
  const { width: windowWidth } = useWindowSize();
  const [scrollTop, setScrollTop] = useState(false);
  const { isDesktop } = useAppLayout();

  const closeAnimationDuration = isMobile
    ? LAYER_ANIMATION_DURATION_MS
    : undefined;

  const renderingThreadId = usePrevDuringAnimation(
    threadId,
    closeAnimationDuration
  );

  const prevTransitionKey = usePrevious(currentTransitionKey);

  const cleanupExceptionKey =
    prevTransitionKey !== undefined && prevTransitionKey < currentTransitionKey
      ? prevTransitionKey
      : undefined;

  const { isReady, handleOpenEnd, handleSlideStop } = useIsReady(
    !shouldSkipHistoryAnimations && animationLevel !== ANIMATION_LEVEL_MIN,
    currentTransitionKey,
    prevTransitionKey,
    chatId,
    isMobile
  );

  const { onIntersectionChanged } = usePinnedMessage(
    chatId,
    threadId,
    pinnedIds
  );

  const renderContent = useCallback(() => {
    switch (feedScreen) {
      case FeedMiddleList.Settings:
        return <FeedSettings />;
      default:
        return (
          <MessageFeedList
            isReady={isReady}
            threadId={renderingThreadId}
            onPinnedIntersectionChange={onIntersectionChanged}
            scrollTop={scrollTop}
            onScrolled={setScrollTop}
          />
        );
    }
  }, [feedScreen, renderingThreadId, scrollTop]);

  const handleClickScrollTop = useCallback(() => {
    setScrollTop(true);
  }, [scrollTop]);

  const {
    composerHiddenScale,
    toolbarHiddenScale,
    composerTranslateX,
    toolbarTranslateX,
    unpinHiddenScale,
    toolbarForUnpinHiddenScale,
  } = useMemo(
    () => calculateMiddleFooterTransforms(windowWidth),
    [windowWidth]
  );

  const bgClassName = classNames(
    styles.background,
    styles.withTransition,
    customBackground?.default,
    customBackground?.default &&
      customBackground?.default !== FEED_BG_COLOR[FEED_BG_COLOR.length - 1] &&
      styles.defaultBgColor,
    //backgroundColor && styles.customBgColor,
    customBackground?.default && styles.defaultBgImage,
    isRightColumnShown && styles.withRightColumn
  );

  function renderUnreadChats() {
    return (
      unreadChats &&
      unreadChats.length > 0 && (
        <div className='floating-button'>
          <Button
            color='light-blue'
            className='add-post'
            onClick={handleClickScrollTop}
          >
            <IconSvg name='arrow-up-feed' />
            <div className='recent-repliers'>
              {unreadChats.map((chat) => (
                <Avatar key={chat.id} size='mini' peer={chat as ApiChat} />
              ))}
            </div>
            New post
          </Button>
        </div>
      )
    );
  }

  return (
    <div
      id='MiddleFeed'
      className='MiddleMessages middle-messages-feed'
      onTransitionEnd={handleOpenEnd}
      style={{
        //@ts-ignore
        '--composer-hidden-scale': composerHiddenScale,
        '--toolbar-hidden-scale': toolbarHiddenScale,
        '--unpin-hidden-scale': unpinHiddenScale,
        '--toolbar-unpin-hidden-scale': toolbarForUnpinHiddenScale,
        '--composer-translate-x': `${composerTranslateX}px`,
        '--toolbar-translate-x': `${toolbarTranslateX}px`,
        '--pattern-color': '#B2C6CC',
      }}
    >
      <div
        className={bgClassName}
        // style={{
        //   //@ts-ignore
        //   '--custom-background': customBackgroundValue
        //     ? customBackgroundValue
        //     : undefined,
        // }}
      />
      <div id='middle-column-portals' />
      <div className='messages-layout'>
        <FeedHeader
          isDesctop={isDesktop}
          currentScreen={feedScreen}
          selectScreen={setFeedScreen}
        />

        {renderUnreadChats()}

        <Transition
          name={
            shouldSkipHistoryAnimations
              ? 'none'
              : animationLevel === ANIMATION_LEVEL_MAX
              ? 'slide'
              : 'fade'
          }
          activeKey={feedScreen}
          shouldCleanup
          cleanupExceptionKey={cleanupExceptionKey}
          onStop={handleSlideStop}
        >
          {renderContent()}
        </Transition>
      </div>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { isMobile }): StateProps => {
    const { messageLists, shouldSkipHistoryAnimations } =
      selectTabState(global);
    const theme = selectTheme(global);
    const {
      messages: { unreadFeedMessage },
    } = global;
    const { customBg } = global.feedFilter || {};

    const unreadChats = getUnreadChats(global, unreadFeedMessage);

    return {
      animationLevel: global.settings.byKey.animationLevel,
      currentTransitionKey: Math.max(0, messageLists.length - 1),
      customBackground: customBg,
      unreadChats,
      theme,
      threadId: MAIN_THREAD_ID,
      shouldSkipHistoryAnimations,
      isRightColumnShown: selectIsRightColumnShown(global, isMobile),
    };
  })(FeedLayout)
);

function useIsReady(
  withAnimations?: boolean,
  currentTransitionKey?: number,
  prevTransitionKey?: number,
  chatId?: string,
  isMobile?: boolean
) {
  const [isReady, setIsReady] = useState(!isMobile);
  const forceUpdate = useForceUpdate();

  const willSwitchMessageList =
    prevTransitionKey !== undefined &&
    prevTransitionKey !== currentTransitionKey;
  if (willSwitchMessageList) {
    if (withAnimations) {
      setIsReady(false);
    } else {
      forceUpdate();
    }
  }

  useSyncEffect(() => {
    if (!withAnimations) {
      setIsReady(true);
    }
  }, [withAnimations]);

  useTimeout(() => {
    if (!isReady) {
      setIsReady(true);
    }
  }, LAYER_ANIMATION_DURATION_MS);

  function handleOpenEnd(e: React.TransitionEvent<HTMLDivElement>) {
    if (e.propertyName === 'transform' && e.target === e.currentTarget) {
      setIsReady(Boolean(chatId));
    }
  }

  function handleSlideStop() {
    setIsReady(true);
  }

  return {
    isReady: isReady && !willSwitchMessageList,
    handleOpenEnd: withAnimations ? handleOpenEnd : undefined,
    handleSlideStop: withAnimations ? handleSlideStop : undefined,
  };
}
