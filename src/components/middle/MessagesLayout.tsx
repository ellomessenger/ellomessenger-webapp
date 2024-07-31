import React, {
  FC,
  useEffect,
  useState,
  memo,
  useMemo,
  useCallback,
} from 'react';
import { getActions, withGlobal } from '../../global';

import type { ApiChat, ApiChatBannedRights } from '../../api/types';
import { MAIN_THREAD_ID } from '../../api/types';
import type {
  MessageListType,
  ActiveEmojiInteraction,
} from '../../global/types';
import {
  AnimationLevel,
  LeftColumnContent,
  MiddleColumnContent,
  ThemeKey,
  ThreadId,
} from '../../types';

import {
  MIN_SCREEN_WIDTH_FOR_STATIC_LEFT_COLUMN,
  MOBILE_SCREEN_MAX_WIDTH,
  MIN_SCREEN_WIDTH_FOR_STATIC_RIGHT_COLUMN,
  SAFE_SCREEN_WIDTH_FOR_STATIC_RIGHT_COLUMN,
  SAFE_SCREEN_WIDTH_FOR_CHAT_INFO,
  ANIMATION_LEVEL_MAX,
  ANIMATION_END_DELAY,
  DARK_THEME_BG_COLOR,
  LIGHT_THEME_BG_COLOR,
  ANIMATION_LEVEL_MIN,
  SUPPORTED_IMAGE_CONTENT_TYPES,
  GENERAL_TOPIC_ID,
  TMP_CHAT_ID,
  AI_BOT_ID,
  SUPPORT_USER_ID,
  AI_BOT_PHOENIX,
  AI_BOT_CANCER,
  AI_BOT_BUSINESS,
} from '../../config';
import { MASK_IMAGE_DISABLED } from '../../util/windowEnvironment';
import { DropAreaState } from './composer/DropArea';
import {
  selectChat,
  selectChatBot,
  selectCurrentMessageList,
  selectTabState,
  selectCurrentTextSearch,
  selectIsChatBotNotStarted,
  selectIsInSelectMode,
  selectIsRightColumnShown,
  selectIsUserBlocked,
  selectPinnedIds,
  selectReplyingToId,
  selectTheme,
  selectThreadInfo,
  selectChatMessage,
} from '../../global/selectors';
import {
  getCanPostInChat,
  getMessageSendingRestrictionReason,
  getForumComposerPlaceholder,
  isChatChannel,
  isChatGroup,
  isChatSuperGroup,
  isUserId,
} from '../../global/helpers';
import calculateMiddleFooterTransforms from './helpers/calculateMiddleFooterTransforms';
import captureEscKeyListener from '../../util/captureEscKeyListener';
import useCustomBackground from '../../hooks/useCustomBackground';
import useWindowSize from '../../hooks/useWindowSize';
import usePrevDuringAnimation from '../../hooks/usePrevDuringAnimation';
import useHistoryBack from '../../hooks/useHistoryBack';
import usePrevious from '../../hooks/usePrevious';
import useForceUpdate from '../../hooks/useForceUpdate';
import useSyncEffect from '../../hooks/useSyncEffect';
import useAppLayout from '../../hooks/useAppLayout';
import useTimeout from '../../hooks/useTimeout';
import usePinnedMessage from './hooks/usePinnedMessage';

import Transition from '../ui/Transition';
import MiddleHeader from './MiddleHeader';
import MessageList from './MessageList';
import FloatingActionButtons from './FloatingActionButtons';
import Composer from './composer/Composer';
import Button from '../ui/Button';
import MobileSearch from './MobileSearch.async';
import MessageSelectToolbar from './MessageSelectToolbar.async';
import SeenByModal from '../common/SeenByModal.async';
import ReactorListModal from './ReactorListModal.async';
import MessageLanguageModal from './MessageLanguageModal.async';

import './MiddleColumn.scss';
import styles from './MiddleColumn.module.scss';
import { useTranslation } from 'react-i18next';
import IconSvg from '../ui/IconSvg';
import classNames from 'classnames';
import EmojiInteractionAnimation from './EmojiInteractionAnimation';
import { createLocationHash } from '../../util/routing';
import useLastCallback from '../../hooks/useLastCallback';

interface OwnProps {
  isMobile?: boolean;
}

type StateProps = {
  chatId?: string;
  threadId?: ThreadId;
  messageListType?: MessageListType;
  chat?: ApiChat;
  replyingToId?: number;
  isPrivate?: boolean;
  isPinnedMessageList?: boolean;
  isScheduledMessageList?: boolean;
  canPost?: boolean;
  currentUserBannedRights?: ApiChatBannedRights;
  defaultBannedRights?: ApiChatBannedRights;
  hasPinned?: boolean;
  hasAudioPlayer?: boolean;
  pinnedMessagesCount?: number;
  theme: ThemeKey;
  customBackground?: string;
  backgroundColor?: string;
  patternColor?: string;
  isLeftColumnShown?: boolean;
  isRightColumnShown?: boolean;
  isBackgroundBlurred?: boolean;
  hasCurrentTextSearch?: boolean;
  isSelectModeActive?: boolean;
  isSeenByModalOpen: boolean;
  isReactorListModalOpen: boolean;
  isGiftPremiumModalOpen?: boolean;
  isMessageLanguageModalOpen?: boolean;
  animationLevel: AnimationLevel;
  shouldSkipHistoryAnimations?: boolean;
  currentTransitionKey: number;
  isChannel?: boolean;
  areChatSettingsLoaded?: boolean;
  canSubscribe?: boolean;
  canStartBot?: boolean;
  canRestartBot?: boolean;
  shouldLoadFullChat?: boolean;
  activeEmojiInteractions?: ActiveEmojiInteraction[];
  shouldJoinToSend?: boolean;
  shouldSendJoinRequest?: boolean;
  lastSyncTime?: number;
  pinnedIds?: number[];
};

function isImage(item: DataTransferItem) {
  return (
    item.kind === 'file' &&
    item.type &&
    SUPPORTED_IMAGE_CONTENT_TYPES.has(item.type)
  );
}

const LAYER_ANIMATION_DURATION_MS = 450 + ANIMATION_END_DELAY;

const MessagesLayout: FC<OwnProps & StateProps> = ({
  chatId,
  threadId,
  messageListType,
  isMobile,
  chat,
  replyingToId,
  isPrivate,
  isPinnedMessageList,
  canPost,
  currentUserBannedRights,
  defaultBannedRights,
  hasPinned,
  hasAudioPlayer,
  pinnedMessagesCount,
  customBackground,
  theme,
  backgroundColor,
  isLeftColumnShown,
  isRightColumnShown,
  isBackgroundBlurred,
  hasCurrentTextSearch,
  isSelectModeActive,
  isSeenByModalOpen,
  isReactorListModalOpen,
  isGiftPremiumModalOpen,
  isMessageLanguageModalOpen,
  animationLevel,
  shouldSkipHistoryAnimations,
  currentTransitionKey,
  isChannel,
  areChatSettingsLoaded,
  canSubscribe,
  canStartBot,
  canRestartBot,
  activeEmojiInteractions,
  shouldJoinToSend,
  shouldSendJoinRequest,
  shouldLoadFullChat,
  lastSyncTime,
  pinnedIds,
}) => {
  const {
    openChat,
    openPreviousChat,
    unpinAllMessages,
    loadUser,
    loadChatSettings,
    closeLocalTextSearch,
    exitMessageSelectMode,
    joinChannel,
    sendBotCommand,
    restartBot,
    showNotification,
    loadFullChat,
    setLeftScreen,
    setMiddleScreen,
  } = getActions();

  const { width: windowWidth } = useWindowSize();
  const { isTablet } = useAppLayout();

  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';
  const [dropAreaState, setDropAreaState] = useState(DropAreaState.None);
  const [isFabShown, setIsFabShown] = useState<boolean | undefined>();
  const [isNotchShown, setIsNotchShown] = useState<boolean | undefined>();
  const [isUnpinModalOpen, setIsUnpinModalOpen] = useState(false);

  const isMobileSearchActive = isMobile && hasCurrentTextSearch;
  const closeAnimationDuration = isMobile
    ? LAYER_ANIMATION_DURATION_MS
    : undefined;
  const hasTools =
    hasPinned &&
    (windowWidth < MOBILE_SCREEN_MAX_WIDTH ||
      (isRightColumnShown &&
        windowWidth > MIN_SCREEN_WIDTH_FOR_STATIC_RIGHT_COLUMN &&
        windowWidth < SAFE_SCREEN_WIDTH_FOR_STATIC_RIGHT_COLUMN) ||
      (windowWidth >= MIN_SCREEN_WIDTH_FOR_STATIC_LEFT_COLUMN &&
        windowWidth < SAFE_SCREEN_WIDTH_FOR_CHAT_INFO &&
        hasAudioPlayer));

  const renderingChatId = usePrevDuringAnimation(
    chatId,
    closeAnimationDuration
  );

  const renderingThreadId = usePrevDuringAnimation(
    threadId,
    closeAnimationDuration
  );
  const renderingMessageListType = usePrevDuringAnimation(
    messageListType,
    closeAnimationDuration
  );

  const renderingCanSubscribe = usePrevDuringAnimation(
    canSubscribe,
    closeAnimationDuration
  );
  const renderingCanStartBot = usePrevDuringAnimation(
    canStartBot,
    closeAnimationDuration
  );
  const renderingCanRestartBot = usePrevDuringAnimation(
    canRestartBot,
    closeAnimationDuration
  );

  const renderingCanPost =
    usePrevDuringAnimation(canPost, closeAnimationDuration) &&
    !renderingCanRestartBot &&
    !renderingCanStartBot &&
    !renderingCanSubscribe &&
    chatId !== TMP_CHAT_ID;
  const renderingHasTools = usePrevDuringAnimation(
    hasTools,
    closeAnimationDuration
  );
  const renderingIsFabShown =
    usePrevDuringAnimation(isFabShown, closeAnimationDuration) &&
    chatId !== TMP_CHAT_ID;

  const renderingIsChannel = usePrevDuringAnimation(
    isChannel,
    closeAnimationDuration
  );
  const renderingShouldJoinToSend = usePrevDuringAnimation(
    shouldJoinToSend,
    closeAnimationDuration
  );
  const renderingShouldSendJoinRequest = usePrevDuringAnimation(
    shouldSendJoinRequest,
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

  useEffect(() => {
    return chatId
      ? captureEscKeyListener(() => {
          openChat({ id: undefined });
        })
      : undefined;
  }, [chatId, openChat]);

  useSyncEffect(() => {
    setDropAreaState(DropAreaState.None);
    setIsNotchShown(undefined);
  }, [chatId]);

  // Fix for mobile virtual keyboard
  useEffect(() => {
    const { visualViewport } = window;
    if (!visualViewport) {
      return undefined;
    }

    const handleResize = () => {
      if (visualViewport.height !== document.documentElement.clientHeight) {
        document.body.classList.add('keyboard-visible');
      } else {
        document.body.classList.remove('keyboard-visible');
      }
    };

    visualViewport.addEventListener('resize', handleResize);

    return () => {
      visualViewport.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isPrivate) {
      loadUser({ userId: chatId! });
    }
  }, [chatId, isPrivate, loadUser]);

  useEffect(() => {
    if (!areChatSettingsLoaded && lastSyncTime) {
      loadChatSettings({ chatId: chatId! });
    }
  }, [
    chatId,
    isPrivate,
    areChatSettingsLoaded,
    lastSyncTime,
    loadChatSettings,
  ]);

  useEffect(() => {
    if (chatId && shouldLoadFullChat && isReady) {
      loadFullChat({ chatId });
    }
  }, [shouldLoadFullChat, chatId, isReady, loadFullChat]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    const { items } = e.dataTransfer || {};
    const shouldDrawQuick =
      items &&
      items.length > 0 &&
      Array.from(items)
        // Filter unnecessary element for drag and drop images in Firefox (https://github.com/Ajaxy/telegram-tt/issues/49)
        // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types#image
        .filter((item) => item.type !== 'text/uri-list')
        // As of September 2021, native clients suggest "send quick, but compressed" only for images
        .every(isImage);

    setDropAreaState(
      shouldDrawQuick ? DropAreaState.QuickFile : DropAreaState.Document
    );
  }, []);

  const handleHideDropArea = useCallback(() => {
    setDropAreaState(DropAreaState.None);
  }, []);

  const handleOpenUnpinModal = useCallback(() => {
    setIsUnpinModalOpen(true);
  }, []);

  const closeUnpinModal = useCallback(() => {
    setIsUnpinModalOpen(false);
  }, []);

  const handleUnpinAllMessages = useCallback(() => {
    unpinAllMessages({ chatId: chatId!, threadId: threadId! });
    closeUnpinModal();
    openPreviousChat();
  }, [unpinAllMessages, chatId, threadId, closeUnpinModal, openPreviousChat]);

  const handleTabletFocus = useCallback(() => {
    openChat({ id: chatId });
  }, [openChat, chatId]);

  const handleSubscribeClick = useCallback(() => {
    joinChannel({ chatId: chatId! });
    if (renderingShouldSendJoinRequest) {
      showNotification({
        message: isChannel
          ? t('RequestToJoinChannelSentDescription')
          : t('RequestToJoinGroupSentDescription'),
      });
    }
  }, [
    joinChannel,
    chatId,
    renderingShouldSendJoinRequest,
    showNotification,
    isChannel,
  ]);

  const handleStartBot = useCallback(() => {
    sendBotCommand({ command: '/start' });
  }, [sendBotCommand]);

  const handleRestartBot = useCallback(() => {
    restartBot({ chatId: chatId! });
  }, [chatId, restartBot]);

  const customBackgroundValue = useCustomBackground(theme, customBackground);

  const {
    onIntersectionChanged,
    onFocusPinnedMessage,
    getCurrentPinnedIndexes,
    getLoadingPinnedId,
    getForceNextPinnedInHeader,
  } = usePinnedMessage(chatId, threadId, pinnedIds);

  const className = classNames(
    'MiddleMessages',
    MASK_IMAGE_DISABLED ? 'mask-image-disabled' : 'mask-image-enabled',
    { 'has-header-tools': renderingHasTools }
  );

  const bgClassName = classNames(
    styles.background,
    styles.withTransition,
    customBackground && styles.customBgImage,
    backgroundColor && styles.customBgColor,
    customBackground && isBackgroundBlurred && styles.blurred,
    isRightColumnShown && styles.withRightColumn,
    chatId === AI_BOT_PHOENIX && styles.withPhoenix,
    chatId === AI_BOT_CANCER && styles.withCancer,
    chatId === AI_BOT_BUSINESS && styles.withBusiness
  );

  const messagingDisabledClassName = classNames('messaging-disabled', {
    shown: !isSelectModeActive,
  });

  const messageSendingRestrictionReason = getMessageSendingRestrictionReason(
    t,
    currentUserBannedRights,
    defaultBannedRights
  );
  const forumComposerPlaceholder = getForumComposerPlaceholder(
    t,
    chat,
    threadId,
    Boolean(replyingToId)
  );

  const composerRestrictionMessage =
    messageSendingRestrictionReason || forumComposerPlaceholder;

  // CSS Variables calculation doesn't work properly with transforms, so we calculate transform values in JS
  const {
    composerHiddenScale,
    toolbarHiddenScale,
    composerTranslateX,
    toolbarTranslateX,
    unpinHiddenScale,
    toolbarForUnpinHiddenScale,
  } = useMemo(
    () => calculateMiddleFooterTransforms(windowWidth, renderingCanPost),
    [renderingCanPost, windowWidth]
  );

  const footerClassName = classNames('middle-column-footer', {
    'no-composer': !renderingCanPost,
    'with-notch': renderingCanPost && isNotchShown && !isSelectModeActive,
  });

  // useHistoryBack({
  //   isActive: isSelectModeActive,
  //   withoutPush: true,
  //   onBack: exitMessageSelectMode,
  //   page: 'message layout, isSelectModeActive',
  // });

  // useHistoryBack({
  //   isActive: isMobileSearchActive,
  //   withoutPush: true,
  //   onBack: closeLocalTextSearch,
  //   page: 'message layout, isMobileSearchActive',
  // });

  const historyState = window.history.state;

  const returnFeedScreen = useLastCallback(() => {
    if (historyState.middleScreen === MiddleColumnContent.Feed) {
      setLeftScreen({ screen: LeftColumnContent.Feed });
      setMiddleScreen({ screen: MiddleColumnContent.Feed });
    }
  });

  // useHistoryBack({
  //   isActive: historyState.middleScreen === MiddleColumnContent.Feed,
  //   withoutPush: true,
  //   onBack: returnFeedScreen,
  // });

  const isMessagingDisabled = Boolean(
    !isPinnedMessageList &&
      !renderingCanPost &&
      !renderingCanRestartBot &&
      !renderingCanStartBot &&
      !renderingCanSubscribe &&
      composerRestrictionMessage
  );
  const withMessageListBottomShift = Boolean(
    renderingCanRestartBot ||
      renderingCanSubscribe ||
      renderingShouldSendJoinRequest ||
      renderingCanStartBot ||
      isPinnedMessageList
  );
  const withExtraShift = Boolean(
    isMessagingDisabled || isSelectModeActive || isPinnedMessageList
  );

  return (
    <div
      id='MiddleMessages'
      className={className}
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
        '--theme-background-color': backgroundColor || undefined,
      }}
      onClick={isTablet && isLeftColumnShown ? handleTabletFocus : undefined}
    >
      <div
        className={bgClassName}
        style={{
          //@ts-ignore
          '--custom-background': customBackgroundValue
            ? customBackgroundValue
            : undefined,
        }}
      />
      <div id='middle-column-portals' />

      {Boolean(renderingChatId && renderingThreadId) && (
        <>
          <div
            className={classNames('messages-layout', {
              'ai-bot': chatId === AI_BOT_ID,
              'ai-support': chatId === SUPPORT_USER_ID,
              'phoenix-bot': chatId === AI_BOT_PHOENIX,
            })}
            onDragEnter={renderingCanPost ? handleDragEnter : undefined}
          >
            <MiddleHeader
              chatId={renderingChatId}
              threadId={renderingThreadId}
              messageListType={renderingMessageListType}
              isReady={isReady}
              isMobile={isMobile}
              getCurrentPinnedIndexes={getCurrentPinnedIndexes}
              getLoadingPinnedId={getLoadingPinnedId}
              onFocusPinnedMessage={onFocusPinnedMessage}
            />
            <Transition
              name={
                shouldSkipHistoryAnimations
                  ? 'none'
                  : animationLevel === ANIMATION_LEVEL_MAX
                  ? 'slide'
                  : 'fade'
              }
              activeKey={currentTransitionKey}
              shouldCleanup
              cleanupExceptionKey={cleanupExceptionKey}
              onStop={handleSlideStop}
            >
              <MessageList
                key={`${renderingChatId}-${renderingThreadId}-${renderingMessageListType}`}
                chatId={renderingChatId}
                threadId={renderingThreadId}
                type={renderingMessageListType}
                canPost={renderingCanPost}
                hasTools={renderingHasTools}
                onFabToggle={setIsFabShown}
                onNotchToggle={setIsNotchShown}
                isReady={isReady}
                withBottomShift={withMessageListBottomShift}
                withDefaultBg={Boolean(!customBackground && !backgroundColor)}
                onPinnedIntersectionChange={onIntersectionChanged}
                getForceNextPinnedInHeader={getForceNextPinnedInHeader}
              />
              <div className={footerClassName}>
                {renderingCanPost && (
                  <Composer
                    chatId={renderingChatId!}
                    threadId={renderingThreadId!}
                    messageListType={renderingMessageListType!}
                    dropAreaState={dropAreaState}
                    onDropHide={handleHideDropArea}
                    isReady={isReady}
                    isMobile={isMobile}
                  />
                )}
                {isPinnedMessageList && (
                  <div
                    className='middle-column-footer-button-container'
                    dir={isRtl ? 'rtl' : undefined}
                  >
                    <Button
                      size='tiny'
                      fluid
                      className='unpin-all-button'
                      onClick={handleOpenUnpinModal}
                    >
                      <i className='icon-svg'>
                        <IconSvg name='unpin' />
                      </i>
                      <span>
                        {t('Chat.Pinned.UnpinAll', { pinnedMessagesCount })}
                      </span>
                    </Button>
                  </div>
                )}
                {isMessagingDisabled && (
                  <div className={messagingDisabledClassName}>
                    <div className='messaging-disabled-inner'>
                      <span>{composerRestrictionMessage}</span>
                    </div>
                  </div>
                )}
                {/* {isMobile &&
                  (renderingCanSubscribe ||
                    (renderingShouldJoinToSend &&
                      !renderingShouldSendJoinRequest)) && (
                    <div
                      className='middle-column-footer-button-container'
                      dir={isRtl ? 'rtl' : undefined}
                    >
                      <Button
                        size='tiny'
                        fluid
                        ripple
                        className='join-subscribe-button'
                        onClick={handleSubscribeClick}
                      >
                        {t(
                          renderingIsChannel
                            ? 'ProfileJoinChannel'
                            : 'ProfileJoinGroup'
                        )}
                      </Button>
                    </div>
                  )} */}
                {isMobile && renderingShouldSendJoinRequest && (
                  <div
                    className='middle-column-footer-button-container'
                    dir={isRtl ? 'rtl' : undefined}
                  >
                    <Button
                      size='tiny'
                      fluid
                      ripple
                      className='join-subscribe-button'
                      onClick={handleSubscribeClick}
                    >
                      {t('ChannelJoinRequest')}
                    </Button>
                  </div>
                )}
                {isMobile && renderingCanStartBot && (
                  <div
                    className='middle-column-footer-button-container'
                    dir={isRtl ? 'rtl' : undefined}
                  >
                    <Button
                      size='tiny'
                      fluid
                      ripple
                      className='join-subscribe-button'
                      onClick={handleStartBot}
                    >
                      {t('BotStart')}
                    </Button>
                  </div>
                )}
                {isMobile && renderingCanRestartBot && (
                  <div
                    className='middle-column-footer-button-container'
                    dir={isRtl ? 'rtl' : undefined}
                  >
                    <Button
                      size='tiny'
                      fluid
                      ripple
                      className='join-subscribe-button'
                      onClick={handleRestartBot}
                    >
                      {t('BotRestart')}
                    </Button>
                  </div>
                )}
                <MessageSelectToolbar
                  messageListType={renderingMessageListType}
                  isActive={isSelectModeActive}
                  canPost={renderingCanPost}
                />
                <SeenByModal isOpen={isSeenByModalOpen} />
                <ReactorListModal isOpen={isReactorListModalOpen} />
                <MessageLanguageModal isOpen={isMessageLanguageModalOpen} />
              </div>
            </Transition>

            <FloatingActionButtons
              isShown={renderingIsFabShown}
              canPost={renderingCanPost}
              withExtraShift={withExtraShift}
            />
          </div>
          {isMobile && (
            <MobileSearch isActive={Boolean(isMobileSearchActive)} />
          )}
        </>
      )}

      {/* {chatId && (
        <UnpinAllMessagesModal
          isOpen={isUnpinModalOpen}
          chatId={chatId}
          pinnedMessagesCount={pinnedMessagesCount}
          onClose={closeUnpinModal}
          onUnpin={handleUnpinAllMessages}
        />
      )} */}
      <div teactFastList>
        {activeEmojiInteractions?.map((activeEmojiInteraction, i) => (
          <EmojiInteractionAnimation
            teactOrderKey={i}
            key={activeEmojiInteraction.id}
            activeEmojiInteraction={activeEmojiInteraction}
          />
        ))}
      </div>
      {/* <GiftPremiumModal isOpen={isGiftPremiumModalOpen} /> */}
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { isMobile }): StateProps => {
    const theme = selectTheme(global);
    const {
      isBlurred: isBackgroundBlurred,
      background: customBackground,
      backgroundColor,
      patternColor,
    } = global.settings.themes[theme] || {};

    const {
      messageLists,
      isLeftColumnShown,
      activeEmojiInteractions,
      seenByModal,
      giftPremiumModal,
      reactorModal,
      audioPlayer,
      shouldSkipHistoryAnimations,
      messageLanguageModal,
    } = selectTabState(global);
    const currentMessageList = selectCurrentMessageList(global);

    const {
      chats: { listIds },
      lastSyncTime,
    } = global;

    const state: StateProps = {
      theme,
      customBackground,
      backgroundColor,
      patternColor,
      isLeftColumnShown,
      isRightColumnShown: selectIsRightColumnShown(global, isMobile),
      isBackgroundBlurred,
      hasCurrentTextSearch: Boolean(selectCurrentTextSearch(global)),
      isSelectModeActive: selectIsInSelectMode(global),
      isSeenByModalOpen: Boolean(seenByModal),
      isReactorListModalOpen: Boolean(reactorModal),
      isGiftPremiumModalOpen: giftPremiumModal?.isOpen,
      isMessageLanguageModalOpen: Boolean(messageLanguageModal),
      animationLevel: global.settings.byKey.animationLevel,
      currentTransitionKey: Math.max(0, messageLists.length - 1),
      activeEmojiInteractions,
      lastSyncTime,
    };

    if (!currentMessageList || !listIds.active) {
      return state;
    }

    const { chatId, threadId, type: messageListType } = currentMessageList;

    const isPrivate = isUserId(chatId);
    const chat = selectChat(global, chatId);
    const bot = selectChatBot(global, chatId);
    const pinnedIds = selectPinnedIds(global, chatId, threadId);
    const { chatId: audioChatId, messageId: audioMessageId } = audioPlayer;

    const threadInfo = selectThreadInfo(global, chatId, threadId);

    const isComments = Boolean(threadInfo?.originChannelId);

    const canPost = chat && getCanPostInChat(chat, threadId, isComments);
    const isBotNotStarted = selectIsChatBotNotStarted(global, chatId);
    const isPinnedMessageList = messageListType === 'pinned';
    const isScheduledMessageList = messageListType === 'scheduled';
    const isMainThread =
      messageListType === 'thread' && threadId === MAIN_THREAD_ID;
    const isChannel = Boolean(chat && isChatChannel(chat));
    const canSubscribe = Boolean(
      chat &&
        isMainThread &&
        (isChannel || isChatSuperGroup(chat)) &&
        chat.isNotJoined &&
        !chat.joinRequests
    );
    const shouldJoinToSend = Boolean(chat?.isNotJoined && chat.isJoinToSend);
    const shouldSendJoinRequest = Boolean(
      chat?.isNotJoined && chat.isJoinRequest
    );
    const canRestartBot = Boolean(bot && selectIsUserBlocked(global, bot.id));
    const canStartBot = !canRestartBot && isBotNotStarted;

    const shouldLoadFullChat = Boolean(
      chat &&
        (isChatChannel(chat) || isChatGroup(chat)) &&
        !chat.fullInfo &&
        lastSyncTime &&
        !(canSubscribe || shouldJoinToSend)
    );

    const replyingToId = selectReplyingToId(global, chatId, threadId);
    const shouldBlockSendInForum = chat?.isForum
      ? threadId === MAIN_THREAD_ID &&
        !replyingToId &&
        chat.topics?.[GENERAL_TOPIC_ID]?.isClosed
      : false;
    const audioMessage =
      audioChatId && audioMessageId
        ? selectChatMessage(global, audioChatId, audioMessageId)
        : undefined;

    return {
      ...state,
      chatId,
      threadId,
      messageListType,
      chat,
      replyingToId,
      isPrivate,
      areChatSettingsLoaded: Boolean(chat?.settings),
      canPost:
        !isPinnedMessageList &&
        (!chat || canPost) &&
        !isBotNotStarted &&
        !(shouldJoinToSend && chat?.isNotJoined) &&
        !shouldBlockSendInForum,
      isPinnedMessageList,
      isScheduledMessageList,
      currentUserBannedRights: chat?.currentUserBannedRights,
      defaultBannedRights: chat?.defaultBannedRights,
      hasPinned:
        (threadId !== MAIN_THREAD_ID && !chat?.isForum) ||
        Boolean(!isPinnedMessageList && pinnedIds?.length),
      hasAudioPlayer: Boolean(audioMessage),
      pinnedMessagesCount: pinnedIds ? pinnedIds.length : 0,
      shouldSkipHistoryAnimations,
      isChannel,
      canSubscribe,
      canStartBot,
      canRestartBot,
      shouldJoinToSend,
      shouldSendJoinRequest,
      shouldLoadFullChat,
      pinnedIds,
    };
  })(MessagesLayout)
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
