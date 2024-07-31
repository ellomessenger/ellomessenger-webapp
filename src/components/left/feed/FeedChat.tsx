import React, { FC, memo, useCallback } from 'react';
import ListItem from '../../ui/ListItem';
import useChatListEntry from '../main/hooks/useChatListEntry';
import { ObserveFn } from '../../../hooks/useIntersectionObserver';
import {
  ApiChat,
  ApiMessageOutgoingStatus,
  ApiUser,
  MAIN_THREAD_ID,
} from '../../../api/types';
import { getActions, withGlobal } from '../../../global';
import {
  selectChat,
  selectCurrentMessageList,
  selectOutgoingStatus,
} from '../../../global/selectors';
import useAppLayout from '../../../hooks/useAppLayout';
import Avatar from '../../common/Avatar';
import { AnimationLevel } from '../../../types';
import FullNameTitle from '../../common/FullNameTitle';
import IconSvg from '../../ui/IconSvg';
import LastMessageMeta from '../../common/LastMessageMeta';
import { ChatAnimationTypes } from '../main/hooks';
import Badge from '../main/Badge';

type OwnProps = {
  chatId: string;
  folderId?: number;
  isPinned?: boolean;
  offsetTop?: number;
  observeIntersection?: ObserveFn;
  onDragEnter?: (chatId: string) => void;
  animationType: ChatAnimationTypes;
  orderDiff: number;
};

type StateProps = {
  chat?: ApiChat;
  isSelected?: boolean;
  canScrollDown?: boolean;
  animationLevel?: AnimationLevel;
  isMuted?: boolean;
  lastMessageOutgoingStatus?: ApiMessageOutgoingStatus;
};

const FeedChat: FC<OwnProps & StateProps> = ({
  offsetTop,
  chat,
  chatId,
  isSelected,
  canScrollDown,
  animationLevel,
  observeIntersection,
  lastMessageOutgoingStatus,
  isMuted,
  isPinned,
  animationType,
  orderDiff,
}) => {
  const { openForumPanel, openChat, focusLastMessage } = getActions();
  const { isMobile } = useAppLayout();

  const { lastMessage } = chat || {};

  const { renderSubtitle, ref } = useChatListEntry({
    chat,
    chatId,
    lastMessage,
    observeIntersection,
    animationType,
    animationLevel,
    orderDiff,
  });

  const handleClick = useCallback(() => {
    openChat({ id: chatId, fromFeed: true }, { forceOnHeavyAnimation: true });

    if (isSelected && canScrollDown) {
      focusLastMessage();
    }
  }, [
    openChat,
    chatId,
    isSelected,
    canScrollDown,
    openForumPanel,
    focusLastMessage,
  ]);

  if (!chat) {
    return null;
  }

  return (
    <ListItem
      style={offsetTop ? { top: `${offsetTop}px` } : {}}
      ripple={!isMobile}
      onClick={handleClick}
      withPortalForMenu
    >
      <div className='status'>
        <Avatar peer={chat} />
      </div>
      <div className='info'>
        <div className='info-row'>
          <FullNameTitle
            peer={chat}
            withEmojiStatus
            observeIntersection={observeIntersection}
          />
          {isMuted && (
            <i className='icon-svg'>
              <IconSvg name='muted' />
            </i>
          )}
          <div className='separator' />
          {chat?.lastMessage && (
            <LastMessageMeta
              message={chat.lastMessage}
              outgoingStatus={lastMessageOutgoingStatus}
            />
          )}
        </div>
        <div className='subtitle'>
          {renderSubtitle()}
          <Badge chat={chat} isPinned={isPinned} isMuted={isMuted} />
        </div>
      </div>
    </ListItem>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId }): StateProps => {
    const chat = selectChat(global, chatId);
    if (!chat) {
      return {};
    }
    const { isOutgoing } = chat.lastMessage || {};
    const { chatId: currentChatId, threadId: currentThreadId } =
      selectCurrentMessageList(global) || {};
    const isSelected =
      chatId === currentChatId && currentThreadId === MAIN_THREAD_ID;

    return {
      chat,
      isSelected,
      canScrollDown: isSelected,
      animationLevel: global.settings.byKey.animationLevel,
      ...(isOutgoing &&
        chat.lastMessage && {
          lastMessageOutgoingStatus: selectOutgoingStatus(
            global,
            chat.lastMessage
          ),
        }),
    };
  })(FeedChat)
);
