import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { getGlobal } from '../../../../global';

import type { AnimationLevel } from '../../../../types';
import type { LangFn } from '../../../../hooks/useLang';
import type {
  ApiChat,
  ApiTopic,
  ApiMessage,
  ApiTypingStatus,
  ApiUser,
} from '../../../../api/types';
import type { ObserveFn } from '../../../../hooks/useIntersectionObserver';
import type { Thread } from '../../../../global/types';

import { ANIMATION_END_DELAY, CHAT_HEIGHT_PX } from '../../../../config';
import { renderTextWithEntities } from '../../../common/helpers/renderTextWithEntities';
import {
  getMessageIsSpoiler,
  getMessageMediaHash,
  getMessageMediaThumbDataUri,
  getMessageRoundVideo,
  getMessageSenderName,
  getMessageSticker,
  getMessageVideo,
  isActionMessage,
  isChatChannel,
  isChatGroup,
} from '../../../../global/helpers';
import { renderActionMessageText } from '../../../common/helpers/renderActionMessageText';
import renderText from '../../../common/helpers/renderText';
import useEnsureMessage from '../../../../hooks/useEnsureMessage';
import useMedia from '../../../../hooks/useMedia';
import { ChatAnimationTypes } from './useChatAnimationType';
import { fastRaf } from '../../../../util/schedulers';

import MessageSummary from '../../../common/MessageSummary';
import ChatForumLastMessage from '../../../common/ChatForumLastMessage';
import TypingStatus from '../../../common/TypingStatus';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { getMessageReplyInfo } from '../../../../global/helpers/replies';

const ANIMATION_DURATION = 200;

export default function useChatListEntry({
  chat,
  lastMessage,
  chatId,
  typingStatus,
  draft,
  actionTargetMessage,
  actionTargetUserIds,
  lastMessageTopic,
  lastMessageSender,
  actionTargetChatId,
  observeIntersection,
  animationType,
  orderDiff,
  animationLevel,
  isTopic,
}: {
  chat?: ApiChat;
  lastMessage?: ApiMessage;
  chatId: string;
  typingStatus?: ApiTypingStatus;
  draft?: Thread['draft'];
  actionTargetMessage?: ApiMessage;
  actionTargetUserIds?: string[];
  lastMessageTopic?: ApiTopic;
  lastMessageSender?: ApiUser | ApiChat;
  actionTargetChatId?: string;
  observeIntersection?: ObserveFn;
  isTopic?: boolean;

  animationType: ChatAnimationTypes;
  orderDiff: number;
  animationLevel?: AnimationLevel;
}) {
  const { t, i18n } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  const isAction = lastMessage && isActionMessage(lastMessage);
  const replyToMsgId =
    lastMessage && getMessageReplyInfo(lastMessage)?.replyToMsgId;
  useEnsureMessage(
    chatId,
    isAction ? replyToMsgId : undefined,
    actionTargetMessage
  );

  const mediaThumbnail =
    lastMessage && !getMessageSticker(lastMessage)
      ? getMessageMediaThumbDataUri(lastMessage)
      : undefined;
  const mediaBlobUrl = useMedia(
    lastMessage ? getMessageMediaHash(lastMessage, 'micro') : undefined
  );
  const isRoundVideo = Boolean(
    lastMessage && getMessageRoundVideo(lastMessage)
  );

  const actionTargetUsers = useMemo(() => {
    if (!actionTargetUserIds) {
      return undefined;
    }

    // No need for expensive global updates on users, so we avoid them
    const usersById = getGlobal().users.byId;
    return actionTargetUserIds
      .map((userId) => usersById[userId])
      .filter(Boolean);
  }, [actionTargetUserIds]);

  function renderSubtitle() {
    if (chat?.isForum && !isTopic) {
      return (
        <ChatForumLastMessage
          chat={chat}
          renderLastMessage={renderLastMessageOrTyping}
          observeIntersection={observeIntersection}
        />
      );
    }

    return renderLastMessageOrTyping();
  }

  function renderLastMessageOrTyping() {
    if (
      typingStatus &&
      lastMessage &&
      typingStatus.timestamp > lastMessage.date * 1000
    ) {
      return <TypingStatus typingStatus={typingStatus} />;
    }

    if (draft?.text.length) {
      return (
        <p className='last-message'>
          <span className='draft'>{t('Draft')}</span>
          {renderTextWithEntities({
            text: draft.text,
            entities: draft.entities,
            isSimple: true,
          })}
        </p>
      );
    }

    if (!lastMessage) {
      return <>&nbsp;</>;
    }

    if (isAction) {
      const isChat =
        chat &&
        (isChatChannel(chat) ||
          isChatGroup(chat) ||
          lastMessage.senderId === lastMessage.chatId);

      return (
        <div className='last-message shared-canvas-container'>
          {renderActionMessageText(
            t,
            lastMessage,
            !isChat ? (lastMessageSender as ApiUser) : undefined,
            isChat ? chat : undefined,
            actionTargetUsers,
            actionTargetMessage,
            actionTargetChatId,
            lastMessageTopic,
            { isEmbedded: true }
          )}
        </div>
      );
    }

    const senderName = getMessageSenderName(t, chatId, lastMessageSender);

    return (
      <div className='last-message shared-canvas-container'>
        {senderName && (
          <>
            <span className='sender-name'>{renderText(senderName)}</span>
            <span className='colon'>:</span>
          </>
        )}
        {renderSummary(
          t,
          lastMessage,
          observeIntersection,
          mediaBlobUrl || mediaThumbnail,
          isRoundVideo
        )}
      </div>
    );
  }

  // Sets animation excess values when `orderDiff` changes and then resets excess values to animate
  useLayoutEffect(() => {
    const element = ref.current;
    if (animationLevel === 0 || !element) {
      return;
    }

    // TODO Refactor animation: create `useListAnimation` that owns `orderDiff` and `animationType`
    if (animationType === ChatAnimationTypes.Opacity) {
      element.style.opacity = '0';

      fastRaf(() => {
        element.classList.add('animate-opacity');
        element.style.opacity = '1';
      });
    } else if (animationType === ChatAnimationTypes.Move) {
      element.style.transform = `translate3d(0, ${
        -orderDiff * CHAT_HEIGHT_PX
      }px, 0)`;

      fastRaf(() => {
        element.classList.add('animate-transform');
        element.style.transform = '';
      });
    } else {
      return;
    }

    setTimeout(() => {
      fastRaf(() => {
        element.classList.remove('animate-opacity', 'animate-transform');
        element.style.opacity = '';
        element.style.transform = '';
      });
    }, ANIMATION_DURATION + ANIMATION_END_DELAY);
  }, [animationLevel, orderDiff, animationType]);

  return {
    renderSubtitle,
    ref,
  };
}

function renderSummary(
  lang: LangFn,
  message: ApiMessage,
  observeIntersection?: ObserveFn,
  blobUrl?: string,
  isRoundVideo?: boolean
) {
  const messageSummary = (
    <MessageSummary
      lang={lang}
      message={message}
      noEmoji={Boolean(blobUrl)}
      observeIntersectionForLoading={observeIntersection}
    />
  );

  if (!blobUrl) {
    return messageSummary;
  }

  const isSpoiler = getMessageIsSpoiler(message);

  return (
    <span className='media-preview'>
      <img
        src={blobUrl}
        alt=''
        className={classNames('media-preview--image', {
          round: isRoundVideo,
          'media-preview-spoiler': isSpoiler,
        })}
      />
      {getMessageVideo(message) && <i className='icon-play' />}
      {messageSummary}
    </span>
  );
}
