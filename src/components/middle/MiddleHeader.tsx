import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getActions, withGlobal } from '../../global';

import type {
  GlobalState,
  IAiPurchases,
  MessageListType,
} from '../../global/types';
import type { Signal } from '../../util/signals';
import type {
  ApiChat,
  ApiMessage,
  ApiTypingStatus,
  ApiUser,
} from '../../api/types';
import { MAIN_THREAD_ID } from '../../api/types';

import {
  EDITABLE_INPUT_CSS_SELECTOR,
  MAX_SCREEN_WIDTH_FOR_EXPAND_PINNED_MESSAGES,
  MIN_SCREEN_WIDTH_FOR_STATIC_LEFT_COLUMN,
  MIN_SCREEN_WIDTH_FOR_STATIC_RIGHT_COLUMN,
  MOBILE_SCREEN_MAX_WIDTH,
  SAFE_SCREEN_WIDTH_FOR_CHAT_INFO,
  SAFE_SCREEN_WIDTH_FOR_STATIC_RIGHT_COLUMN,
} from '../../config';
import {
  getChatDescription,
  getChatTitle,
  getHasAdminRight,
  getMessageKey,
  getSenderTitle,
  isChatAdmin,
  isChatAdult,
  isChatChannel,
  isChatCourse,
  isChatGroup,
  isChatSubscription,
  isChatSuperGroup,
  isUserId,
  isUserRightBanned,
  selectIsChatMuted,
} from '../../global/helpers';
import {
  selectAllowedMessageActions,
  selectChat,
  selectChatMessage,
  selectChatMessages,
  selectTabState,
  selectForwardedSender,
  selectIsChatBotNotStarted,
  selectIsChatWithBot,
  selectIsChatWithSelf,
  selectIsInSelectMode,
  selectIsRightColumnShown,
  selectIsUserBlocked,
  selectPinnedIds,
  selectScheduledIds,
  selectThreadInfo,
  selectThreadParam,
  selectNotifySettings,
  selectNotifyExceptions,
} from '../../global/selectors';
import useEnsureMessage from '../../hooks/useEnsureMessage';
import useWindowSize from '../../hooks/useWindowSize';
import useShowTransition from '../../hooks/useShowTransition';
import useCurrentOrPrev from '../../hooks/useCurrentOrPrev';
import useConnectionStatus from '../../hooks/useConnectionStatus';
import usePrevious from '../../hooks/usePrevious';
import useAppLayout from '../../hooks/useAppLayout';
import useDerivedState from '../../hooks/useDerivedState';

import PrivateChatInfo from '../common/PrivateChatInfo';
import GroupChatInfo from '../common/GroupChatInfo';
import UnreadCounter from '../common/UnreadCounter';
import Transition from '../ui/Transition';
import Button from '../ui/Button';
import HeaderActions from './HeaderActions';
import HeaderPinnedMessage from './HeaderPinnedMessage';
import AudioPlayer from './AudioPlayer';
import GroupCallTopPane from '../calls/group/GroupCallTopPane';
import ChatReportPanel from './ChatReportPanel';
import { useTranslation } from 'react-i18next';

import useLastCallback from '../../hooks/useLastCallback';
import ConfirmDialog from '../ui/ConfirmDialog';
import useFlag from '../../hooks/useFlag';
import { getMoneyFormat } from '../../util/convertMoney';
import { formatDateToString } from '../../util/dateFormat';
import {
  LeftColumnContent,
  MiddleColumnContent,
  NewChatMembersProgress,
  ThreadId,
} from '../../types';

import AnimatedCounter from '../common/AnimatedCounter';
import renderText from '../common/helpers/renderText';
import classNames from 'classnames';
import IconSvg from '../ui/IconSvg';
import './MiddleHeader.scss';
import useHistoryBack from '../../hooks/useHistoryBack';
import IconSvgPayment from '../payment/IconSvgPayment';

const ANIMATION_DURATION = 350;
const BACK_BUTTON_INACTIVE_TIME = 450;
const EMOJI_STATUS_SIZE = 22;

type OwnProps = {
  chatId: string;
  threadId: ThreadId;
  withForumActions?: boolean;
  messageListType: MessageListType;
  isReady?: boolean;
  isMobile?: boolean;
  getCurrentPinnedIndexes: Signal<Record<string, number>>;
  getLoadingPinnedId: Signal<number | undefined>;
  onFocusPinnedMessage: (messageId: number) => boolean;
};

type StateProps = {
  chat?: ApiChat;
  isChannel?: boolean;
  pinnedMessageIds?: number[] | number;
  messagesById?: Record<number, ApiMessage>;
  canUnpin?: boolean;
  canMute?: boolean;
  isMuted?: boolean;
  topMessageSender?: ApiChat | ApiUser;
  typingStatus?: ApiTypingStatus;
  isSelectModeActive?: boolean;
  isLeftColumnShown?: boolean;
  isRightColumnShown?: boolean;
  audioMessage?: ApiMessage;
  messagesCount?: number;
  isComments?: boolean;
  isChatWithSelf?: boolean;
  lastSyncTime?: number;
  hasButtonInHeader?: boolean;
  shouldSkipHistoryAnimations?: boolean;
  currentTransitionKey: number;
  connectionState?: GlobalState['connectionState'];
  isSyncing?: GlobalState['isSyncing'];
  canSubscribe?: boolean;
  shouldJoinToSend?: boolean;
  isAdult?: boolean;
  isPaidChannel?: boolean;
  isCourse?: boolean;
  startDate?: string;
  endDate?: string;
  subscriptionCost?: string;
  description?: string;
  aiPurchases?: IAiPurchases;
  canAddMembers?: boolean;
  isCreator?: boolean;
  leftScreen?: LeftColumnContent;
  botsList?: string[];
};

const MiddleHeader: FC<OwnProps & StateProps> = ({
  chatId,
  threadId,
  messageListType,
  isReady,
  isMobile,
  isMuted,
  pinnedMessageIds,
  messagesById,
  canUnpin,
  canMute,
  topMessageSender,
  typingStatus,
  isSelectModeActive,
  isLeftColumnShown,
  isRightColumnShown,
  audioMessage,
  chat,
  messagesCount,
  isComments,
  isChannel,
  isChatWithSelf,
  lastSyncTime,
  hasButtonInHeader,
  shouldSkipHistoryAnimations,
  currentTransitionKey,
  connectionState,
  isSyncing,
  getCurrentPinnedIndexes,
  getLoadingPinnedId,
  canSubscribe,
  shouldJoinToSend,
  isAdult,
  isCourse,
  isPaidChannel,
  startDate,
  endDate,
  subscriptionCost,
  description,
  aiPurchases,
  canAddMembers,
  isCreator,
  leftScreen,
  botsList,
  onFocusPinnedMessage,
}) => {
  const {
    openChatWithInfo,
    pinMessage,
    focusMessage,
    openChat,
    openPreviousChat,
    loadPinnedMessages,
    toggleLeftColumn,
    exitMessageSelectMode,
    joinChannel,
    updateChatMutedState,
    setMiddleScreen,
    setLeftScreen,
    setNewChatMembersDialogState,
  } = getActions();

  const { t } = useTranslation();
  const isBackButtonActive = useRef(true);
  const { isTablet, isDesktop } = useAppLayout();
  const { img_total, text_total } = aiPurchases || {};
  const [isOpenSubscribeModal, openSubscribeModal, closeSubscribeModal] =
    useFlag();
  const historyState = window.history.state;

  const [prevLeftScreen, setPrevLeftScreen] = useState(undefined);

  const currentPinnedIndexes = useDerivedState(getCurrentPinnedIndexes);
  const currentPinnedIndex = currentPinnedIndexes[`${chatId}_${threadId}`] || 0;
  const waitingForPinnedId = useDerivedState(getLoadingPinnedId);
  const pinnedMessageId = Array.isArray(pinnedMessageIds)
    ? pinnedMessageIds[currentPinnedIndex]
    : pinnedMessageIds;
  const pinnedMessage =
    messagesById && pinnedMessageId ? messagesById[pinnedMessageId] : undefined;
  const pinnedMessagesCount = Array.isArray(pinnedMessageIds)
    ? pinnedMessageIds.length
    : pinnedMessageIds
    ? 1
    : undefined;
  const chatTitleLength = chat && getChatTitle(t, chat).length;
  const topMessageTitle = topMessageSender
    ? getSenderTitle(t, topMessageSender)
    : undefined;
  const { settings } = chat || {};
  const isForum = chat?.isForum;

  useEffect(() => {
    if (lastSyncTime && isReady && (threadId === MAIN_THREAD_ID || isForum)) {
      loadPinnedMessages({ chatId, threadId });
    }
  }, [chatId, loadPinnedMessages, lastSyncTime, threadId, isReady, isForum]);

  useEnsureMessage(chatId, pinnedMessageId, pinnedMessage);

  const { width: windowWidth } = useWindowSize();

  const isLeftColumnHideable =
    windowWidth <= MIN_SCREEN_WIDTH_FOR_STATIC_LEFT_COLUMN;
  const shouldShowCloseButton = isTablet && isLeftColumnShown;

  const componentRef = useRef<HTMLDivElement>(null);
  const shouldAnimateTools = useRef<boolean>(true);

  const handleHeaderClick = useCallback(() => {
    openChatWithInfo({ id: chatId, threadId });
  }, [openChatWithInfo, chatId, threadId]);

  const handleUnpinMessage = useCallback(
    (messageId: number) => {
      pinMessage({ messageId, isUnpin: true });
    },
    [pinMessage]
  );

  const handlePinnedMessageClick = useCallback((): void => {
    if (!pinnedMessage) return;

    if (onFocusPinnedMessage(pinnedMessage.id)) {
      focusMessage({
        chatId: pinnedMessage.chatId,
        threadId,
        messageId: pinnedMessage.id,
        noForumTopicPanel: true,
      });
    }
  }, [pinnedMessage, threadId, onFocusPinnedMessage]);

  const handleAllPinnedClick = useCallback(() => {
    openChat({ id: chatId, threadId, type: 'pinned' });
  }, [openChat, chatId, threadId]);

  const setBackButtonActive = useCallback(() => {
    setTimeout(() => {
      isBackButtonActive.current = true;
    }, BACK_BUTTON_INACTIVE_TIME);
  }, []);

  const handleBackClick = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (!isBackButtonActive.current) return;

      // Workaround for missing UI when quickly clicking the Back button
      isBackButtonActive.current = false;
      if (isMobile) {
        const messageInput = document.querySelector<HTMLDivElement>(
          EDITABLE_INPUT_CSS_SELECTOR
        );
        messageInput?.blur();
      }

      if (isSelectModeActive) {
        exitMessageSelectMode();
        setBackButtonActive();
        return;
      }

      if (messageListType === 'thread' && currentTransitionKey === 0) {
        if (historyState.middleScreen === MiddleColumnContent.Feed) {
          setLeftScreen({ screen: LeftColumnContent.Feed });
          setMiddleScreen({ screen: MiddleColumnContent.Feed });
        } else if (!isTablet) {
          e.stopPropagation(); // Stop propagation to prevent chat re-opening on tablets
          openChat({ id: undefined }, { forceOnHeavyAnimation: true });
        } else {
          toggleLeftColumn();
        }

        setBackButtonActive();

        return;
      }

      openPreviousChat();
      setBackButtonActive();
    },
    [
      isMobile,
      isSelectModeActive,
      messageListType,
      currentTransitionKey,
      setBackButtonActive,
      isTablet,
      shouldShowCloseButton,
    ]
  );

  const handleSubscribeClick = useLastCallback(() => {
    joinChannel({ chatId });
    closeSubscribeModal();
    setPrevLeftScreen(undefined);
  });

  const handleCloseSubscribeModal = useLastCallback(() => {
    closeSubscribeModal();
    if (prevLeftScreen === LeftColumnContent.Feed) {
      setLeftScreen({ screen: LeftColumnContent.Feed });
      setMiddleScreen({ screen: MiddleColumnContent.Feed });
    } else {
      openPreviousChat();
    }

    setPrevLeftScreen(undefined);
  });

  const handleToggleMuteClick = useLastCallback(() => {
    updateChatMutedState({ chatId, isMuted: !isMuted });
  });

  const handlePaymentAi = useLastCallback(() => {
    setMiddleScreen({ screen: MiddleColumnContent.PaymentAi });
  });

  const canToolsCollideWithChatInfo =
    (windowWidth >= MIN_SCREEN_WIDTH_FOR_STATIC_LEFT_COLUMN &&
      windowWidth < SAFE_SCREEN_WIDTH_FOR_CHAT_INFO) ||
    (windowWidth > MOBILE_SCREEN_MAX_WIDTH &&
      windowWidth < MIN_SCREEN_WIDTH_FOR_STATIC_LEFT_COLUMN &&
      (!chatTitleLength || chatTitleLength > 30));
  const shouldUseStackedToolsClass =
    canToolsCollideWithChatInfo ||
    (windowWidth > MIN_SCREEN_WIDTH_FOR_STATIC_RIGHT_COLUMN &&
      windowWidth < SAFE_SCREEN_WIDTH_FOR_STATIC_RIGHT_COLUMN);

  const hasChatSettings = Boolean(
    settings?.canAddContact ||
      settings?.canBlockContact ||
      settings?.canReportSpam
  );
  const {
    shouldRender: shouldShowChatReportPanel,
    transitionClassNames: chatReportPanelClassNames,
  } = useShowTransition(hasChatSettings);
  const renderingChatSettings = useCurrentOrPrev(
    hasChatSettings ? settings : undefined,
    true
  );

  const {
    shouldRender: shouldRenderAudioPlayer,
    transitionClassNames: audioPlayerClassNames,
  } = useShowTransition(Boolean(audioMessage));

  const renderingAudioMessage = useCurrentOrPrev(audioMessage, true);

  const {
    shouldRender: shouldRenderPinnedMessage,
    transitionClassNames: pinnedMessageClassNames,
  } = useShowTransition(Boolean(pinnedMessage));

  const renderingPinnedMessage = useCurrentOrPrev(pinnedMessage, true);
  const renderingPinnedMessagesCount = useCurrentOrPrev(
    pinnedMessagesCount,
    true
  );
  const renderingCanUnpin = useCurrentOrPrev(canUnpin, true);
  const renderingPinnedMessageTitle = useCurrentOrPrev(topMessageTitle);

  const prevTransitionKey = usePrevious(currentTransitionKey);
  const cleanupExceptionKey =
    prevTransitionKey !== undefined && prevTransitionKey < currentTransitionKey
      ? prevTransitionKey
      : undefined;

  const canRevealTools =
    (shouldRenderPinnedMessage && renderingPinnedMessage) ||
    (shouldRenderAudioPlayer && renderingAudioMessage);

  const handleNewMemberDialogOpen = useLastCallback(() => {
    openChatWithInfo({ id: chatId });
    setNewChatMembersDialogState({
      newChatMembersProgress: NewChatMembersProgress.InProgress,
    });
  });

  // Logic for transition to and from custom display of AudioPlayer/PinnedMessage on smaller screens
  useEffect(() => {
    const componentEl = componentRef.current;
    if (!componentEl) {
      return;
    }

    if (!shouldUseStackedToolsClass || !canRevealTools) {
      componentEl.classList.remove('tools-stacked', 'animated');
      shouldAnimateTools.current = true;
      return;
    }

    if (isRightColumnShown || canToolsCollideWithChatInfo) {
      if (shouldAnimateTools.current) {
        componentEl.classList.add('tools-stacked', 'animated');
        shouldAnimateTools.current = false;
      }

      // Remove animation class to prevent it messing up the show transitions
      setTimeout(() => {
        componentEl.classList.remove('animated');
      }, ANIMATION_DURATION);
    } else {
      componentEl.classList.remove('tools-stacked');
      shouldAnimateTools.current = true;
    }
  }, [
    shouldUseStackedToolsClass,
    canRevealTools,
    canToolsCollideWithChatInfo,
    isRightColumnShown,
  ]);

  useEffect(() => {
    if ((isPaidChannel || isAdult) && (canSubscribe || shouldJoinToSend)) {
      openSubscribeModal();
    }
  }, [canSubscribe, shouldJoinToSend, isPaidChannel, isAdult]);

  const { connectionStatusText } = useConnectionStatus(
    t,
    connectionState,
    isSyncing,
    true
  );

  useEffect(() => {
    if (historyState && historyState.leftScreen) {
      setPrevLeftScreen(historyState.leftScreen);
    }
  }, [historyState]);

  function renderInfo() {
    if (messageListType === 'thread') {
      if (threadId === MAIN_THREAD_ID || chat?.isForum) {
        return renderChatInfo();
      }
    }

    return (
      <>
        {renderBackButton()}
        <h4>
          {messagesCount !== undefined
            ? messageListType === 'thread'
              ? t(isComments ? 'CommentsCount' : 'Replies', { messagesCount })
              : messageListType === 'pinned'
              ? t('PinnedMessages', { messagesCount })
              : messageListType === 'scheduled'
              ? isChatWithSelf
                ? t('Reminders')
                : t('Messages', { messagesCount })
              : undefined
            : t('Loading')}
        </h4>
      </>
    );
  }

  function renderChatInfo() {
    return (
      <>
        {(isLeftColumnHideable ||
          currentTransitionKey > 0 ||
          historyState?.middleScreen === MiddleColumnContent.Feed) &&
          renderBackButton(shouldShowCloseButton, true)}
        <div className='chat-info-wrapper' onClick={handleHeaderClick}>
          {isUserId(chatId) ? (
            <PrivateChatInfo
              key={chatId}
              userId={chatId}
              typingStatus={typingStatus}
              status={connectionStatusText}
              withDots={Boolean(connectionStatusText)}
              withFullInfo
              withMediaViewer
              withUpdatingStatus
              withVideoAvatar={isReady}
              emojiStatusSize={EMOJI_STATUS_SIZE}
              noRtl
            />
          ) : (
            <GroupChatInfo
              key={chatId}
              chatId={chatId}
              threadId={threadId}
              typingStatus={typingStatus}
              status={connectionStatusText}
              withDots={Boolean(connectionStatusText)}
              withMediaViewer={threadId === MAIN_THREAD_ID}
              withFullInfo={threadId === MAIN_THREAD_ID}
              withUpdatingStatus
              withVideoAvatar={isReady}
              noRtl
            />
          )}
        </div>
      </>
    );
  }

  function renderBackButton(asClose = false, withUnreadCounter = false) {
    return (
      <div className='back-button'>
        <Button
          round
          size='smaller'
          color='translucent'
          onClick={handleBackClick}
          ariaLabel={String(t(asClose ? 'Close' : 'Back'))}
        >
          <IconSvg name='arrow-left' />
        </Button>
        {withUnreadCounter && isDesktop && <UnreadCounter />}
      </div>
    );
  }

  const isAudioPlayerRendered = Boolean(
    shouldRenderAudioPlayer && renderingAudioMessage
  );
  const isPinnedMessagesFullWidth =
    isAudioPlayerRendered ||
    (!isMobile &&
      hasButtonInHeader &&
      windowWidth < MAX_SCREEN_WIDTH_FOR_EXPAND_PINNED_MESSAGES);

  return (
    <div
      className={classNames('MiddleHeader', {
        'has-button':
          !isComments && (canSubscribe || shouldJoinToSend || canMute),
      })}
      ref={componentRef}
    >
      <Transition
        name={shouldSkipHistoryAnimations ? 'none' : 'slide-fade'}
        activeKey={currentTransitionKey}
        shouldCleanup
        cleanupExceptionKey={cleanupExceptionKey}
      >
        {renderInfo()}
      </Transition>

      {threadId === MAIN_THREAD_ID && !chat?.isForum && (
        <GroupCallTopPane
          hasPinnedOffset={
            (shouldRenderPinnedMessage && Boolean(renderingPinnedMessage)) ||
            (shouldRenderAudioPlayer && Boolean(renderingAudioMessage))
          }
          chatId={chatId}
        />
      )}

      {shouldRenderPinnedMessage && renderingPinnedMessage && (
        <HeaderPinnedMessage
          key={chatId}
          message={renderingPinnedMessage}
          count={renderingPinnedMessagesCount || 0}
          index={currentPinnedIndex}
          customTitle={renderingPinnedMessageTitle}
          className={pinnedMessageClassNames}
          onUnpinMessage={renderingCanUnpin ? handleUnpinMessage : undefined}
          onClick={handlePinnedMessageClick}
          onAllPinnedClick={handleAllPinnedClick}
          isLoading={waitingForPinnedId !== undefined}
          isFullWidth={isPinnedMessagesFullWidth}
        />
      )}

      {shouldShowChatReportPanel && (
        <ChatReportPanel
          key={chatId}
          chatId={chatId}
          settings={renderingChatSettings}
          className={chatReportPanelClassNames}
        />
      )}

      <div className='header-tools'>
        {isAudioPlayerRendered && (
          <AudioPlayer
            key={getMessageKey(renderingAudioMessage!)}
            message={renderingAudioMessage!}
            className={audioPlayerClassNames}
          />
        )}
        <HeaderActions
          chatId={chatId}
          threadId={threadId}
          messageListType={messageListType}
          isMobile={isMobile}
          canExpandActions={!isAudioPlayerRendered}
        />
      </div>

      {botsList?.includes(chatId) && (
        <div
          className='massages-info-line'
          role='button'
          onClick={handlePaymentAi}
        >
          <AnimatedCounter text={String(text_total ?? 0)} />
          <span className='prompt-wrap'>
            <IconSvgPayment name='text' w='14' h='14' />
          </span>
          <span className='separator' />
          <span className='prompt-wrap'>
            <IconSvgPayment name='image' w='14' h='14' />
          </span>

          <AnimatedCounter text={String(img_total ?? 0)} />
        </div>
      )}
      {!isComments && (
        <>
          {!isChannel && canAddMembers && isCreator && (
            <div className='tab-bar-wrapper'>
              <div
                role='button'
                className='tab-bar'
                onClick={handleNewMemberDialogOpen}
              >
                <i className='icon-svg'>
                  <IconSvg name='user-plus' />
                </i>
                {t('Group.AddMembers')}
              </div>
            </div>
          )}
          {canMute && (
            <div className='tab-bar-wrapper'>
              <div
                role='button'
                className='tab-bar'
                onClick={handleToggleMuteClick}
              >
                <i className='icon-svg'>
                  <IconSvg name={isMuted ? 'unmute' : 'mute'} />
                </i>
                {t(isMuted ? 'Unmute' : 'Mute')}
              </div>
            </div>
          )}
          {(canSubscribe || shouldJoinToSend) && (
            <div className='tab-bar-wrapper'>
              <div
                role='button'
                className='tab-bar'
                onClick={
                  isPaidChannel || isCourse
                    ? openSubscribeModal
                    : handleSubscribeClick
                }
              >
                <i className='icon-svg'>
                  <IconSvg name='fly-outline-empty' />
                </i>
                {t(isChannel ? 'Channel.Subscribe' : 'Group.Join')}
              </div>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={isOpenSubscribeModal}
        onClose={handleCloseSubscribeModal}
        confirmHandler={handleSubscribeClick}
        confirmLabel={t('Channel.Subscribe')}
      >
        {isPaidChannel && (
          <>
            {!isCourse && (
              <>
                <p>{t('Subscription')}</p>
                <h3 className='amount'>
                  <IconSvg name='dollar' w='18' h='18' />
                  {getMoneyFormat(subscriptionCost, 2, 2) ?? 0}
                  {t('Channel.CostMonth')}
                </h3>
              </>
            )}

            {isCourse && (
              <div className='description-primary mb-2'>
                <p>{t('Channel.Course')}</p>
                <h3>
                  <IconSvg name='dollar' w='18' h='18' />
                  {`${getMoneyFormat(subscriptionCost, 2, 2) ?? 0}${t(
                    'Channel.OneTimePayment'
                  )}`}
                </h3>
                <div className='row row-not-wrap'>
                  <span>{t('Channel.StartDateCourse')}:</span>
                  <span>{formatDateToString(Number(startDate))}</span>
                </div>
                <div className='row row-not-wrap'>
                  <span>{t('Channel.EndCourse')}:</span>
                  <span>{formatDateToString(Number(endDate))}</span>
                </div>
              </div>
            )}
            {description && (
              <p className='mb-3'>
                {renderText(description, ['br', 'links', 'emoji'])}
              </p>
            )}
            {isAdult && (
              <div className='description-adult mb-3'>
                <div className='banner-adult'>
                  <i className='icon-svg'>
                    <IconSvg name='adult-white' />
                  </i>
                </div>
                <div>{t('Channel.AdultNotice')}</div>
              </div>
            )}
            <div className='benefits mb-4'>
              <h4>{t('Channel.BenefitsTitle')}</h4>
              <ul>
                <li>{t('Channel.Benefits_1')}</li>
                <li>{t('Channel.Benefits_2')}</li>
                <li>{t('Channel.Benefits_3')}</li>
                <li>{t('Channel.Benefits_4')}</li>
              </ul>
            </div>
          </>
        )}
        {isAdult && !isPaidChannel && (
          <div className='description-adult mb-4'>
            <div className='banner-adult'>
              <i className='icon-svg'>
                <IconSvg name='adult-white' />
              </i>
            </div>
            <div>{t('Channel.AdultNotice')}</div>
          </div>
        )}
      </ConfirmDialog>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>(
    (global, { chatId, threadId, messageListType, isMobile }): StateProps => {
      const {
        isLeftColumnShown,
        shouldSkipHistoryAnimations,
        audioPlayer,
        messageLists,
        leftScreen,
      } = selectTabState(global);
      const {
        lastSyncTime,
        aiPurchases,
        chats: { listIds },
      } = global;
      const chat = selectChat(global, chatId);
      const isChannel = Boolean(chat && isChatChannel(chat));

      const { chatId: audioChatId, messageId: audioMessageId } = audioPlayer;
      const audioMessage =
        audioChatId && audioMessageId
          ? selectChatMessage(global, audioChatId, audioMessageId)
          : undefined;

      let messagesCount: number | undefined;
      if (messageListType === 'pinned') {
        const pinnedIds = selectPinnedIds(global, chatId, threadId);
        messagesCount = pinnedIds?.length;
      } else if (messageListType === 'scheduled') {
        const scheduledIds = selectScheduledIds(global, chatId, threadId);
        messagesCount = scheduledIds?.length;
      } else if (messageListType === 'thread' && threadId !== MAIN_THREAD_ID) {
        const threadInfo = selectThreadInfo(global, chatId, threadId);

        messagesCount = threadInfo?.messagesCount || 0;
      }

      const isMainThread =
        messageListType === 'thread' && threadId === MAIN_THREAD_ID;
      const isChatWithBot = chat && selectIsChatWithBot(global, chat);
      const canRestartBot = Boolean(
        isChatWithBot && selectIsUserBlocked(global, chatId)
      );
      const canStartBot =
        isChatWithBot &&
        !canRestartBot &&
        Boolean(selectIsChatBotNotStarted(global, chatId));
      const canSubscribe = Boolean(
        chat &&
          (isMainThread || chat.isForum) &&
          (isChatChannel(chat) || isChatSuperGroup(chat)) &&
          chat.isNotJoined
      );
      const typingStatus = selectThreadParam(
        global,
        chatId,
        threadId,
        'typingStatus'
      );

      const isChatWithSelf = selectIsChatWithSelf(global, chatId);
      const isCreator = chat?.isCreator;
      const isAdmin = chat && isChatAdmin(chat);
      const isAdult = chat && isChatAdult(chat);
      const isCourse = chat && isChatCourse(chat);
      const isGroup = chat && isChatGroup(chat);
      const isPaidChannel = chat && (isCourse || isChatSubscription(chat));
      const description = chat && getChatDescription(chat);

      const shouldJoinToSend = Boolean(chat?.isNotJoined || chat?.isJoinToSend);
      const canMute =
        isMainThread &&
        !isChatWithSelf &&
        !canSubscribe &&
        !isUserId(chatId) &&
        isChatChannel(chat!) &&
        !isCreator &&
        !isAdmin;
      const hasMembersTab = isGroup || (isChannel && isChatAdmin(chat!));
      const canAddMembers =
        hasMembersTab &&
        chat &&
        (getHasAdminRight(chat, 'inviteUsers') ||
          !isUserRightBanned(chat, 'inviteUsers') ||
          chat.isCreator);

      const state: StateProps = {
        typingStatus,
        isLeftColumnShown,
        isRightColumnShown: selectIsRightColumnShown(global, isMobile),
        isSelectModeActive: selectIsInSelectMode(global),
        audioMessage,
        chat,
        isChannel,
        isAdult,
        isCourse,
        isCreator,
        isPaidChannel,
        messagesCount,
        isChatWithSelf,
        lastSyncTime,
        shouldSkipHistoryAnimations,
        currentTransitionKey: Math.max(0, messageLists.length - 1),
        connectionState: global.connectionState,
        isSyncing: global.isSyncing,
        canSubscribe,
        canMute,
        shouldJoinToSend,
        hasButtonInHeader: canStartBot || canRestartBot || canSubscribe,
        isMuted: selectIsChatMuted(
          chat!,
          selectNotifySettings(global),
          selectNotifyExceptions(global)
        ),
        subscriptionCost: chat?.cost,
        startDate: chat?.startDate,
        endDate: chat?.endDate,
        description,
        aiPurchases,
        canAddMembers,
        leftScreen,
        botsList: listIds.bots,
      };

      const messagesById = selectChatMessages(global, chatId);
      if (messageListType !== 'thread' || !messagesById) {
        return state;
      }

      Object.assign(state, { messagesById });

      if (threadId !== MAIN_THREAD_ID && !chat?.isForum) {
        const pinnedMessageId = Number(threadId);
        const message = pinnedMessageId
          ? selectChatMessage(global, chatId, pinnedMessageId)
          : undefined;
        const topMessageSender = message
          ? selectForwardedSender(global, message)
          : undefined;
        const threadInfo = selectThreadInfo(global, chatId, threadId);

        return {
          ...state,
          pinnedMessageIds: pinnedMessageId,
          messagesById,
          canUnpin: false,
          topMessageSender,
          isComments: Boolean(threadInfo?.originChannelId),
        };
      }

      const pinnedMessageIds = selectPinnedIds(global, chatId, threadId);
      if (pinnedMessageIds?.length) {
        const firstPinnedMessage = messagesById[pinnedMessageIds[0]];
        const { canUnpin } =
          (firstPinnedMessage &&
            selectAllowedMessageActions(
              global,
              firstPinnedMessage,
              threadId
            )) ||
          {};

        return {
          ...state,
          pinnedMessageIds,
          canUnpin,
        };
      }

      return state;
    }
  )(MiddleHeader)
);
