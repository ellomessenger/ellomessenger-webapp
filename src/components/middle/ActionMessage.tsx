import React, { FC, memo, useEffect, useMemo, useRef } from 'react';
import { getActions, withGlobal } from '../../global';

import type {
  ApiUser,
  ApiMessage,
  ApiChat,
  ApiSticker,
  ApiTopic,
  ApiReaction,
} from '../../api/types';
import type { FocusDirection, ThreadId } from '../../types';
import type { PinnedIntersectionChangedCallback } from './hooks/usePinnedMessage';
import type { MessageListType } from '../../global/types';

import {
  selectUser,
  selectChatMessage,
  selectIsMessageFocused,
  selectChat,
  selectTopicFromMessage,
  selectTabState,
  selectCurrentMessageIds,
} from '../../global/selectors';
import { getMessageHtmlId, isChatChannel } from '../../global/helpers';

import { renderActionMessageText } from '../common/helpers/renderActionMessageText';
import { preventMessageInputBlur } from './helpers/preventMessageInputBlur';
import useEnsureMessage from '../../hooks/useEnsureMessage';
import useContextMenuHandlers from '../../hooks/useContextMenuHandlers';
import type { ObserveFn } from '../../hooks/useIntersectionObserver';
import {
  useIsIntersecting,
  useOnIntersect,
} from '../../hooks/useIntersectionObserver';
import useFocusMessage from './message/hooks/useFocusMessage';

import useFlag from '../../hooks/useFlag';
import useShowTransition from '../../hooks/useShowTransition';

import ContextMenuContainer from './message/ContextMenuContainer.async';
import AnimatedIconFromSticker from '../common/AnimatedIconFromSticker';
import ActionMessageSuggestedAvatar from './ActionMessageSuggestedAvatar';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

type OwnProps = {
  message: ApiMessage;
  threadId?: ThreadId;
  messageListType?: MessageListType;
  observeIntersectionForReading?: ObserveFn;
  observeIntersectionForLoading?: ObserveFn;
  observeIntersectionForPlaying?: ObserveFn;
  isEmbedded?: boolean;
  appearanceOrder?: number;
  isLastInList?: boolean;
  isInsideTopic?: boolean;
  memoFirstUnreadIdRef?: { current: number | undefined };
  onPinnedIntersectionChange?: PinnedIntersectionChangedCallback;
};

type StateProps = {
  usersById: Record<string, ApiUser>;
  senderUser?: ApiUser;
  senderChat?: ApiChat;
  targetUserIds?: string[];
  targetMessage?: ApiMessage;
  targetChatId?: string;
  isFocused: boolean;
  topic?: ApiTopic;
  focusDirection?: FocusDirection;
  noFocusHighlight?: boolean;
  viewportIds?: number[];
  premiumGiftSticker?: ApiSticker;
};

const APPEARANCE_DELAY = 10;

const ActionMessage: FC<OwnProps & StateProps> = ({
  message,
  isEmbedded,
  appearanceOrder = 0,
  isLastInList,
  usersById,
  senderUser,
  senderChat,
  targetUserIds,
  targetMessage,
  targetChatId,
  isFocused,
  focusDirection,
  noFocusHighlight,
  viewportIds,
  premiumGiftSticker,
  isInsideTopic,
  topic,
  memoFirstUnreadIdRef,
  observeIntersectionForReading,
  observeIntersectionForLoading,
  observeIntersectionForPlaying,
  onPinnedIntersectionChange,
}) => {
  const { openPremiumModal, requestConfetti } = getActions();

  const { t } = useTranslation();

  // eslint-disable-next-line no-null/no-null
  const ref = useRef<HTMLDivElement>(null);

  useOnIntersect(ref, observeIntersectionForReading);
  useEnsureMessage(message.chatId, message.replyToMsgId, targetMessage);
  useFocusMessage(
    ref,
    message.id,
    message.chatId,
    isFocused,
    focusDirection,
    noFocusHighlight,
    viewportIds
  );

  useEffect(() => {
    if (!message.isPinned) return undefined;

    return () => {
      onPinnedIntersectionChange?.({
        viewportPinnedIdsToRemove: [message.id],
        isUnmount: true,
      });
    };
  }, [onPinnedIntersectionChange, message.isPinned, message.id]);

  const noAppearanceAnimation = appearanceOrder <= 0;
  const [isShown, markShown] = useFlag(noAppearanceAnimation);
  //TODO
  const isGift = Boolean(message.content.action?.text.startsWith('ActionGift'));
  const isSuggestedAvatar =
    message.content.action?.type === 'suggestProfilePhoto' &&
    message.content.action!.photo;

  useEffect(() => {
    if (noAppearanceAnimation) {
      return;
    }

    setTimeout(markShown, appearanceOrder * APPEARANCE_DELAY);
  }, [appearanceOrder, markShown, noAppearanceAnimation]);

  const isVisible = useIsIntersecting(ref, observeIntersectionForPlaying);

  const shouldShowConfettiRef = useRef(
    (() => {
      const isUnread =
        memoFirstUnreadIdRef?.current &&
        message.id >= memoFirstUnreadIdRef.current;
      return isGift && !message.isOutgoing && isUnread;
    })()
  );

  useEffect(() => {
    if (isVisible && shouldShowConfettiRef.current) {
      shouldShowConfettiRef.current = false;
      requestConfetti();
    }
  }, [isVisible, requestConfetti]);

  const { transitionClassNames } = useShowTransition(
    isShown,
    undefined,
    noAppearanceAnimation,
    false
  );

  const targetUsers = useMemo(() => {
    return targetUserIds
      ? targetUserIds.map((userId) => usersById?.[userId]).filter(Boolean)
      : undefined;
  }, [targetUserIds, usersById]);

  const content = renderActionMessageText(
    t,
    message,
    senderUser,
    senderChat,
    targetUsers,
    targetMessage,
    targetChatId,
    topic,
    { isEmbedded },
    observeIntersectionForLoading,
    observeIntersectionForPlaying
  );
  const {
    isContextMenuOpen,
    contextMenuPosition,
    handleBeforeContextMenu,
    handleContextMenu,
    handleContextMenuClose,
    handleContextMenuHide,
  } = useContextMenuHandlers(ref);
  const isContextMenuShown = contextMenuPosition !== undefined;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    preventMessageInputBlur(e);
    handleBeforeContextMenu(e);
  };

  const handlePremiumGiftClick = () => {
    openPremiumModal({
      isGift: true,
      fromUserId: senderUser?.id,
      toUserId: targetUserIds?.[0],
      monthsAmount: message.content.action?.months || 0,
    });
  };

  // TODO Refactoring for action rendering
  const shouldSkipRender =
    isInsideTopic && message.content.action?.text === 'TopicWasCreatedAction';
  if (shouldSkipRender) {
    return <span ref={ref} />;
  }

  if (isEmbedded) {
    return (
      <span ref={ref} className='embedded-action-message'>
        {content}
      </span>
    );
  }

  function renderGift() {
    return (
      <span
        className='action-message-gift'
        tabIndex={0}
        role='button'
        onClick={handlePremiumGiftClick}
      >
        <AnimatedIconFromSticker
          key={message.id}
          sticker={premiumGiftSticker}
          play
          noLoop
          nonInteractive
        />
        <strong>{t('ActionGiftPremiumTitle')}</strong>
        <span>
          {t(
            'ActionGiftPremiumSubtitle',
            t('Months', { month: message.content.action?.months })
          )}
        </span>

        <span className='action-message-button'>
          {t('ActionGiftPremiumView')}
        </span>
      </span>
    );
  }

  const className = classNames(
    'ActionMessage message-list-item',
    transitionClassNames,
    {
      focused: isFocused && !noFocusHighlight,
      'centered-action': isGift || isSuggestedAvatar,
      'has-menu-open': isContextMenuShown,
      'last-in-list': isLastInList,
      'in-one-row': !isGift && !isSuggestedAvatar,
    }
  );

  return (
    <div
      ref={ref}
      id={getMessageHtmlId(message.id)}
      className={className}
      data-message-id={message.id}
      data-is-pinned={message.isPinned || undefined}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
    >
      {!isSuggestedAvatar && (
        <span className='action-message-content'>{content}</span>
      )}
      {isGift && renderGift()}
      {isSuggestedAvatar && (
        <ActionMessageSuggestedAvatar message={message} content={content} />
      )}
      {contextMenuPosition && (
        <ContextMenuContainer
          isOpen={isContextMenuOpen}
          anchor={contextMenuPosition}
          message={message}
          messageListType='thread'
          onClose={handleContextMenuClose}
          onCloseAnimationEnd={handleContextMenuHide}
        />
      )}
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>(
    (global, { message, threadId, messageListType }): StateProps => {
      const { chatId, senderId, replyToMsgId, content } = message;

      const { byId: usersById } = global.users;
      const userId = senderId;
      const { targetUserIds, targetChatId } = content.action || {};
      const targetMessageId = replyToMsgId;
      const targetMessage = targetMessageId
        ? selectChatMessage(global, chatId, targetMessageId)
        : undefined;

      const isFocused = threadId
        ? selectIsMessageFocused(global, message, threadId)
        : false;
      const { direction: focusDirection, noHighlight: noFocusHighlight } =
        (isFocused && selectTabState(global).focusedMessage) || {};

      const chat = selectChat(global, chatId);
      const isChat = chat && (isChatChannel(chat) || userId === chatId);
      const senderUser =
        !isChat && userId ? selectUser(global, userId) : undefined;
      const senderChat = chat;
      const premiumGiftSticker = global.premiumGifts?.stickers?.[0];
      const topic = selectTopicFromMessage(global, message);

      return {
        usersById,
        senderUser,
        senderChat,
        targetChatId,
        targetUserIds,
        targetMessage,
        isFocused,
        premiumGiftSticker,
        topic,
        ...(isFocused && {
          focusDirection,
          noFocusHighlight,
          viewportIds:
            threadId && messageListType
              ? selectCurrentMessageIds(
                  global,
                  chatId,
                  threadId,
                  messageListType
                )
              : undefined,
        }),
      };
    }
  )(ActionMessage)
);
