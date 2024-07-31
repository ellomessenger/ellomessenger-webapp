import React, { FC, memo, useCallback, useEffect, useMemo } from 'react';
import { getActions, withGlobal } from '../../../global';

import type {
  ApiChat,
  ApiUser,
  ApiMessage,
  ApiMessageOutgoingStatus,
  ApiFormattedText,
  ApiUserStatus,
  ApiTopic,
  ApiTypingStatus,
} from '../../../api/types';
import type { AnimationLevel } from '../../../types';
import type { ChatAnimationTypes } from './hooks';

import { MAIN_THREAD_ID } from '../../../api/types';
import { IS_OPEN_IN_NEW_TAB_SUPPORTED } from '../../../util/windowEnvironment';
import {
  isUserId,
  getPrivateChatUserId,
  getMessageAction,
  selectIsChatMuted,
} from '../../../global/helpers';
import {
  selectChat,
  selectUser,
  selectChatMessage,
  selectOutgoingStatus,
  selectDraft,
  selectCurrentMessageList,
  selectNotifySettings,
  selectNotifyExceptions,
  selectUserStatus,
  selectTopicFromMessage,
  selectThreadParam,
  selectTabState,
} from '../../../global/selectors';

import { createLocationHash } from '../../../util/routing';
import classNames from 'classnames';
import useChatContextActions from '../../../hooks/useChatContextActions';
import useFlag from '../../../hooks/useFlag';
import useChatListEntry from './hooks/useChatListEntry';
import {
  useIsIntersecting,
  ObserveFn,
} from '../../../hooks/useIntersectionObserver';
import useAppLayout from '../../../hooks/useAppLayout';

import ListItem from '../../ui/ListItem';
import Avatar from '../../common/Avatar';
import LastMessageMeta from '../../common/LastMessageMeta';
import DeleteChatModal from '../../common/DeleteChatModal';
import ReportModal from '../../common/ReportModal';
import FullNameTitle from '../../common/FullNameTitle';
import ChatFolderModal from '../ChatFolderModal.async';
import ChatCallStatus from './ChatCallStatus';
import Badge from './Badge';

import './Chat.scss';
import IconSvg from '../../ui/IconSvg';
import { useTranslation } from 'react-i18next';
import useLastCallback from '../../../hooks/useLastCallback';
import ConfirmDialog from '../../ui/ConfirmDialog';
import ClearChatHistoryModal from '../../common/ClearChatHistoryModal';
import Button from '../../ui/Button';
import { SERVICE_NOTIFICATIONS_USER_ID } from '../../../config';

type OwnProps = {
  chatId: string;
  folderId?: number;
  orderDiff: number;
  animationType: ChatAnimationTypes;
  isPinned?: boolean;
  isFeed?: boolean;
  offsetTop: number;
  forSubscription?: boolean;
  observeIntersection?: ObserveFn;
  onDragEnter?: (chatId: string) => void;
};

type StateProps = {
  chat?: ApiChat;
  isMuted?: boolean;
  user?: ApiUser;
  userStatus?: ApiUserStatus;
  actionTargetUserIds?: string[];
  actionTargetMessage?: ApiMessage;
  actionTargetChatId?: string;
  lastMessageSender?: ApiUser | ApiChat;
  lastMessageOutgoingStatus?: ApiMessageOutgoingStatus;
  draft?: ApiFormattedText;
  animationLevel?: AnimationLevel;
  isSelected?: boolean;
  isSelectedForum?: boolean;
  canScrollDown?: boolean;
  canChangeFolder?: boolean;
  lastSyncTime?: number;
  lastMessageTopic?: ApiTopic;
  typingStatus?: ApiTypingStatus;
};

const Chat: FC<OwnProps & StateProps> = ({
  chatId,
  folderId,
  orderDiff,
  animationType,
  isPinned,
  observeIntersection,
  chat,
  isMuted,
  user,
  userStatus,
  actionTargetUserIds,
  lastMessageSender,
  lastMessageOutgoingStatus,
  actionTargetMessage,
  actionTargetChatId,
  offsetTop,
  draft,
  animationLevel,
  isSelected,
  isSelectedForum,
  canScrollDown,
  canChangeFolder,
  lastSyncTime,
  lastMessageTopic,
  typingStatus,
  isFeed,
  forSubscription,
  onDragEnter,
}) => {
  const {
    openChat,
    focusLastMessage,
    loadTopics,
    openForumPanel,
    deleteHistory,
  } = getActions();

  const { t } = useTranslation();
  const { isMobile } = useAppLayout();
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useFlag();
  const [isChatFolderModalOpen, openChatFolderModal, closeChatFolderModal] =
    useFlag();
  const [isReportModalOpen, openReportModal, closeReportModal] = useFlag();
  const [
    shouldRenderDeleteModal,
    markRenderDeleteModal,
    unmarkRenderDeleteModal,
  ] = useFlag();
  const [isOpenClearHistory, openClearHistoryModal, closeClearHistoryModal] =
    useFlag();
  const [shouldRenderClearModal, markRenderClearModal, unmarkRendeCleartModal] =
    useFlag();
  const [
    shouldRenderChatFolderModal,
    markRenderChatFolderModal,
    unmarkRenderChatFolderModal,
  ] = useFlag();
  const [
    shouldRenderReportModal,
    markRenderReportModal,
    unmarkRenderReportModal,
  ] = useFlag();

  const { lastMessage, isForum } = chat || {};

  const { renderSubtitle, ref } = useChatListEntry({
    chat,
    chatId,
    lastMessage,
    typingStatus,
    draft,
    actionTargetMessage,
    actionTargetUserIds,
    actionTargetChatId,
    lastMessageTopic,
    lastMessageSender,
    observeIntersection,
    animationType,
    animationLevel,
    orderDiff,
  });

  const handleClick = useCallback(() => {
    if (isForum) {
      openForumPanel({ chatId }, { forceOnHeavyAnimation: true });
      return;
    }

    openChat(
      {
        id: chatId,
        shouldReplaceHistory: true,
        fromFeed: isFeed ? true : false,
      },
      { forceOnHeavyAnimation: true }
    );

    if (isSelected && canScrollDown && !isFeed) {
      focusLastMessage();
    }
  }, [
    isForum,
    openChat,
    isFeed,
    chatId,
    isSelected,
    canScrollDown,
    openForumPanel,
    focusLastMessage,
  ]);

  const handleDragEnter = useCallback(
    (e: { preventDefault: () => void }) => {
      e.preventDefault();
      onDragEnter?.(chatId);
    },
    [chatId, onDragEnter]
  );

  const handleDelete = useCallback(() => {
    markRenderDeleteModal();
    openDeleteModal();
  }, [markRenderDeleteModal, openDeleteModal]);

  const handleClearHistory = useLastCallback(() => {
    markRenderClearModal();
    openClearHistoryModal();
  });

  const handleChatFolderChange = useCallback(() => {
    markRenderChatFolderModal();
    openChatFolderModal();
  }, [markRenderChatFolderModal, openChatFolderModal]);

  const handleReport = useCallback(() => {
    markRenderReportModal();
    openReportModal();
  }, [markRenderReportModal, openReportModal]);

  const handleConfirmClearHistory = useLastCallback(() => {
    deleteHistory({ chatId, shouldDeleteForAll: false, isClear: true });
  });

  const contextActions = useChatContextActions({
    chat,
    user,
    handleDelete,
    handleChatFolderChange,
    handleReport,
    folderId,
    isPinned,
    isMuted,
    isFeed,
    canChangeFolder,
    handleClearHistory,
  });

  const isIntersecting = useIsIntersecting(ref, observeIntersection);

  // Load the forum topics to display unread count badge
  useEffect(() => {
    if (
      isIntersecting &&
      lastSyncTime &&
      isForum &&
      chat &&
      chat.listedTopicIds === undefined
    ) {
      loadTopics({ chatId });
    }
  }, [chat, chatId, isForum, lastSyncTime, loadTopics, isIntersecting]);

  if (!chat) {
    return null;
  }

  const className = classNames('Chat chat-item-clickable', {
    static: offsetTop < 0,
    forum: isForum,
    selected: isSelected && !isFeed,
    'selected-forum': isSelectedForum,
    chat,
    'chat-bot': chat.usernames && chat.usernames[0].username === 'aibot',
    'chat-system': chat.id === SERVICE_NOTIFICATIONS_USER_ID,
  });

  return (
    <>
      <ListItem
        elRef={ref}
        className={className}
        href={
          IS_OPEN_IN_NEW_TAB_SUPPORTED
            ? `#${createLocationHash(chatId, 'thread', MAIN_THREAD_ID)}`
            : undefined
        }
        style={{ top: `${offsetTop}px` }}
        ripple={!isForum && !isMobile}
        contextActions={!forSubscription ? contextActions : undefined}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        withPortalForMenu
      >
        <div className='status'>
          <Avatar
            peer={user || chat}
            userStatus={userStatus}
            isSavedMessages={user?.isSelf}
            lastSyncTime={lastSyncTime}
            withVideo
            observeIntersection={observeIntersection}
          />
          {/* <AvatarBadge chatId={chatId} /> */}
          {chat.isCallActive && chat.isCallNotEmpty && (
            <ChatCallStatus
              isMobile={isMobile}
              isSelected={isSelected}
              isActive={animationLevel !== 0}
            />
          )}
        </div>
        <div className='info'>
          <div className='info-row'>
            <FullNameTitle
              peer={user || chat}
              withEmojiStatus
              isSavedMessages={chatId === user?.id && user?.isSelf}
              observeIntersection={observeIntersection}
            />
            {isMuted && (
              <i className='icon-svg'>
                <IconSvg name='muted' />
              </i>
            )}
            <div className='separator' />
            {chat.lastMessage && !isFeed && (
              <LastMessageMeta
                message={chat.lastMessage}
                outgoingStatus={lastMessageOutgoingStatus}
              />
            )}
          </div>
          <div className='subtitle'>
            {isFeed ? (
              <div className='last-message'>
                {t('Channel.Subscribers', { count: chat.membersCount || 0 })}
              </div>
            ) : (
              renderSubtitle()
            )}
            {/* {forSubscription && <Button isLink>Subscribe</Button>} */}
            <Badge
              chat={chat}
              isPinned={isPinned}
              isMuted={isMuted}
              isFeed={isFeed}
            />
          </div>
        </div>
      </ListItem>
      {shouldRenderDeleteModal && (
        <DeleteChatModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onCloseAnimationEnd={unmarkRenderDeleteModal}
          chat={chat}
        />
      )}
      {shouldRenderChatFolderModal && (
        <ChatFolderModal
          isOpen={isChatFolderModalOpen}
          onClose={closeChatFolderModal}
          onCloseAnimationEnd={unmarkRenderChatFolderModal}
          chatId={chatId}
        />
      )}
      {shouldRenderReportModal && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={closeReportModal}
          onCloseAnimationEnd={unmarkRenderReportModal}
          chatId={chatId}
          subject='peer'
        />
      )}
      {shouldRenderClearModal && (
        <ClearChatHistoryModal
          isOpen={isOpenClearHistory}
          onClose={closeClearHistoryModal}
          onCloseAnimationEnd={unmarkRendeCleartModal}
          chat={chat!}
        />
      )}
    </>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId }): StateProps => {
    const chat = selectChat(global, chatId);
    if (!chat) {
      return {};
    }

    const { senderId, replyToMsgId, isOutgoing } = chat.lastMessage || {};
    const lastMessageSender = senderId
      ? selectUser(global, senderId) || selectChat(global, senderId)
      : undefined;
    const lastMessageAction = chat.lastMessage
      ? getMessageAction(chat.lastMessage)
      : undefined;
    const actionTargetMessage =
      lastMessageAction && replyToMsgId
        ? selectChatMessage(global, chat.id, replyToMsgId)
        : undefined;
    const {
      targetUserIds: actionTargetUserIds,
      targetChatId: actionTargetChatId,
    } = lastMessageAction || {};
    const privateChatUserId = getPrivateChatUserId(chat);
    const {
      chatId: currentChatId,
      threadId: currentThreadId,
      type: messageListType,
    } = selectCurrentMessageList(global) || {};
    const isSelected =
      chatId === currentChatId && currentThreadId === MAIN_THREAD_ID;
    const isSelectedForum = chatId === selectTabState(global).forumPanelChatId;

    const user = privateChatUserId
      ? selectUser(global, privateChatUserId)
      : undefined;
    const userStatus = privateChatUserId
      ? selectUserStatus(global, privateChatUserId)
      : undefined;
    const lastMessageTopic =
      chat.lastMessage && selectTopicFromMessage(global, chat.lastMessage);

    const typingStatus = selectThreadParam(
      global,
      chatId,
      MAIN_THREAD_ID,
      'typingStatus'
    );

    return {
      chat,
      isMuted: selectIsChatMuted(
        chat,
        selectNotifySettings(global),
        selectNotifyExceptions(global)
      ),
      lastMessageSender,
      actionTargetUserIds,
      actionTargetChatId,
      actionTargetMessage,
      draft: selectDraft(global, chatId, MAIN_THREAD_ID),
      animationLevel: global.settings.byKey.animationLevel,
      isSelected,
      isSelectedForum,
      canScrollDown: isSelected && messageListType === 'thread',
      canChangeFolder: (global.chatFolders.orderedIds?.length || 0) > 1,
      lastSyncTime: global.lastSyncTime,
      ...(isOutgoing &&
        chat.lastMessage && {
          lastMessageOutgoingStatus: selectOutgoingStatus(
            global,
            chat.lastMessage
          ),
        }),
      user,
      userStatus,
      lastMessageTopic,
      typingStatus,
    };
  })(Chat)
);
