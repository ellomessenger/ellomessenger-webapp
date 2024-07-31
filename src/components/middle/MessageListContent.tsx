import React, { FC, RefObject, memo } from 'react';
import { getActions, withGlobal } from '../../global';

import type { MessageListType } from '../../global/types';
import type { PinnedIntersectionChangedCallback } from './hooks/usePinnedMessage';

import { SCHEDULED_WHEN_ONLINE } from '../../config';
import { MAIN_THREAD_ID } from '../../api/types';

import { compact } from '../../util/iteratees';
import { formatHumanDate } from '../../util/dateFormat';
import {
  getMessageHtmlId,
  getMessageOriginalId,
  isActionMessage,
  isForwardedMessage,
  isOwnMessage,
  isServiceNotificationMessage,
} from '../../global/helpers';
import { useTranslation } from 'react-i18next';
import type { MessageDateGroup } from './helpers/groupMessages';
import { isAlbum } from './helpers/groupMessages';
import { preventMessageInputBlur } from './helpers/preventMessageInputBlur';
import useScrollHooks from './hooks/useScrollHooks';
import useMessageObservers from './hooks/useMessageObservers';

import Message from './message/Message';
import SponsoredMessage from './message/SponsoredMessage';
import ActionMessage from './ActionMessage';

import classNames from 'classnames';
import { ThreadId } from '../../types';

interface OwnProps {
  isCurrentUserPremium?: boolean;
  chatId: string;
  threadId: ThreadId;
  messageIds: number[];
  messageGroups: MessageDateGroup[];
  isViewportNewest: boolean;
  isUnread: boolean;
  withUsers: boolean;
  isChannelChat: boolean | undefined;
  isGroupChat?: boolean;
  isComments?: boolean;
  noAvatars: boolean;
  containerRef: RefObject<HTMLDivElement>;
  anchorIdRef: { current: string | undefined };
  memoUnreadDividerBeforeIdRef: { current: number | undefined };
  memoFirstUnreadIdRef: { current: number | undefined };
  type: MessageListType;
  isReady: boolean;
  isScrollingRef: { current: boolean | undefined };
  isScrollPatchNeededRef: { current: boolean | undefined };
  hasLinkedChat: boolean | undefined;
  isSchedule: boolean;
  noAppearanceAnimation: boolean;
  isEmptyThread?: boolean;
  onFabToggle: AnyToVoidFunction;
  onNotchToggle: AnyToVoidFunction;
  onPinnedIntersectionChange: PinnedIntersectionChangedCallback;
}

type StateProps = {
  currentUserId: string;
};

const UNREAD_DIVIDER_CLASS = 'unread-divider';

const MessageListContent: FC<OwnProps & StateProps> = ({
  isCurrentUserPremium,
  chatId,
  threadId,
  messageIds,
  messageGroups,
  isViewportNewest,
  isUnread,
  isComments,
  withUsers,
  isChannelChat,
  isGroupChat,
  noAvatars,
  containerRef,
  anchorIdRef,
  memoUnreadDividerBeforeIdRef,
  memoFirstUnreadIdRef,
  type,
  isReady,
  isScrollingRef,
  isScrollPatchNeededRef,
  hasLinkedChat,
  isSchedule,
  noAppearanceAnimation,
  currentUserId,
  isEmptyThread,
  onFabToggle,
  onNotchToggle,
  onPinnedIntersectionChange,
}) => {
  const { openHistoryCalendar } = getActions();

  const {
    observeIntersectionForReading,
    observeIntersectionForLoading,
    observeIntersectionForPlaying,
  } = useMessageObservers(
    type,
    containerRef,
    memoFirstUnreadIdRef,
    onPinnedIntersectionChange
  );

  const { backwardsTriggerRef, forwardsTriggerRef, fabTriggerRef } =
    useScrollHooks(
      type,
      containerRef,
      messageIds,
      isViewportNewest,
      isUnread,
      onFabToggle,
      onNotchToggle,
      isReady,
      isScrollingRef,
      isScrollPatchNeededRef
    );

  const { t } = useTranslation();

  const unreadDivider = (
    <div
      className={classNames(UNREAD_DIVIDER_CLASS, 'local-action-message')}
      key='unread-messages'
    >
      <span>{t('UnreadMessages')}</span>
    </div>
  );

  const messageCountToAnimate = noAppearanceAnimation
    ? 0
    : messageGroups.reduce((acc, messageGroup) => {
        return acc + messageGroup.senderGroups.flat().length;
      }, 0);
  let appearanceIndex = 0;

  const dateGroups = messageGroups.map(
    (
      dateGroup: MessageDateGroup,
      dateGroupIndex: number,
      dateGroupsArray: MessageDateGroup[]
    ) => {
      const senderGroups = dateGroup.senderGroups.map(
        (senderGroup, senderGroupIndex, senderGroupsArray) => {
          if (
            senderGroup.length === 1 &&
            !isAlbum(senderGroup[0]) &&
            isActionMessage(senderGroup[0]) &&
            !senderGroup[0].content.action?.phoneCall
          ) {
            const message = senderGroup[0]!;
            const isLastInList =
              senderGroupIndex === senderGroupsArray.length - 1 &&
              dateGroupIndex === dateGroupsArray.length - 1;

            return compact([
              message.id === memoUnreadDividerBeforeIdRef.current &&
                unreadDivider,
              <ActionMessage
                key={message.id}
                message={message}
                threadId={threadId}
                messageListType={type}
                isInsideTopic={Boolean(threadId && threadId !== MAIN_THREAD_ID)}
                observeIntersectionForReading={observeIntersectionForReading}
                observeIntersectionForLoading={observeIntersectionForLoading}
                observeIntersectionForPlaying={observeIntersectionForPlaying}
                memoFirstUnreadIdRef={memoFirstUnreadIdRef}
                appearanceOrder={messageCountToAnimate - ++appearanceIndex}
                isLastInList={isLastInList}
                onPinnedIntersectionChange={onPinnedIntersectionChange}
              />,
            ]);
          }

          let currentDocumentGroupId: string | undefined;

          return senderGroup
            .map((messageOrAlbum, messageIndex) => {
              const message = isAlbum(messageOrAlbum)
                ? messageOrAlbum.mainMessage
                : messageOrAlbum;
              const album = isAlbum(messageOrAlbum)
                ? messageOrAlbum
                : undefined;
              const isOwn =
                !isForwardedMessage(message) && isOwnMessage(message);
              const isMessageAlbum = isAlbum(messageOrAlbum);
              const nextMessage = senderGroup[messageIndex + 1];

              if (
                message.previousLocalId &&
                anchorIdRef.current ===
                  getMessageHtmlId(message.previousLocalId)
              ) {
                anchorIdRef.current = getMessageHtmlId(message.id);
              }

              const documentGroupId =
                !isMessageAlbum && message.groupedId
                  ? message.groupedId
                  : undefined;
              const nextDocumentGroupId =
                nextMessage && !isAlbum(nextMessage)
                  ? nextMessage.groupedId
                  : undefined;

              const position = {
                isFirstInGroup: messageIndex === 0,
                isLastInGroup: messageIndex === senderGroup.length - 1,
                isFirstInDocumentGroup: Boolean(
                  documentGroupId && documentGroupId !== currentDocumentGroupId
                ),
                isLastInDocumentGroup: Boolean(
                  documentGroupId && documentGroupId !== nextDocumentGroupId
                ),
                isLastInList:
                  messageIndex === senderGroup.length - 1 &&
                  senderGroupIndex === senderGroupsArray.length - 1 &&
                  dateGroupIndex === dateGroupsArray.length - 1,
              };

              currentDocumentGroupId = documentGroupId;

              const originalId = getMessageOriginalId(message);
              // Service notifications saved in cache in previous versions may share the same `previousLocalId`
              const key = isServiceNotificationMessage(message)
                ? `${message.date}_${originalId}`
                : originalId;

              const noComments = hasLinkedChat === false || !isChannelChat;

              const isTopicTopMessage = message.id === threadId;
              return compact([
                message.id === memoUnreadDividerBeforeIdRef.current &&
                  unreadDivider,

                <Message
                  key={key}
                  message={message}
                  currentUserId={currentUserId}
                  observeIntersectionForBottom={observeIntersectionForReading}
                  observeIntersectionForLoading={observeIntersectionForLoading}
                  observeIntersectionForPlaying={observeIntersectionForPlaying}
                  album={album}
                  noAvatars={noAvatars}
                  withAvatar={
                    position.isLastInGroup &&
                    !isOwn &&
                    (!isTopicTopMessage || !isComments)
                  }
                  withSenderName={
                    position.isFirstInGroup && withUsers && !isOwn
                  }
                  threadId={threadId}
                  messageListType={type}
                  noComments={noComments}
                  noReplies={!noComments || threadId !== MAIN_THREAD_ID}
                  appearanceOrder={messageCountToAnimate - ++appearanceIndex}
                  isFirstInGroup={position.isFirstInGroup}
                  isLastInGroup={position.isLastInGroup}
                  isFirstInDocumentGroup={position.isFirstInDocumentGroup}
                  isLastInDocumentGroup={position.isLastInDocumentGroup}
                  isLastInList={position.isLastInList}
                  memoFirstUnreadIdRef={memoFirstUnreadIdRef}
                  onPinnedIntersectionChange={onPinnedIntersectionChange}
                  hasGroup={isGroupChat}
                />,
                message.id === threadId && (
                  <div
                    className='local-action-message'
                    key='discussion-started'
                  >
                    <span>
                      {t(
                        isEmptyThread
                          ? isComments
                            ? 'NoComments'
                            : 'NoReplies'
                          : 'DiscussionStarted'
                      )}
                    </span>
                  </div>
                ),
              ]);
            })
            .flat();
        }
      );

      return (
        <div
          className='message-date-group'
          key={dateGroup.datetime}
          onMouseDown={preventMessageInputBlur}
          // teactFastList
        >
          <div
            className={classNames('sticky-date', !isSchedule && 'interactive')}
            key='date-header'
            onMouseDown={preventMessageInputBlur}
            onClick={
              !isSchedule
                ? () => openHistoryCalendar({ selectedAt: dateGroup.datetime })
                : undefined
            }
          >
            <span dir='auto'>
              {isSchedule &&
                dateGroup.originalDate === SCHEDULED_WHEN_ONLINE &&
                t('MessageScheduledUntilOnline')}
              {isSchedule &&
                dateGroup.originalDate !== SCHEDULED_WHEN_ONLINE &&
                t('MessageScheduledOn', {
                  date: formatHumanDate(t, dateGroup.datetime, undefined, true),
                })}
              {!isSchedule && formatHumanDate(t, dateGroup.datetime)}
            </span>
          </div>
          {senderGroups.flat()}
        </div>
      );
    }
  );

  return (
    <div className='messages-container'>
      <div
        ref={backwardsTriggerRef}
        key='backwards-trigger'
        className='backwards-trigger'
      />
      {dateGroups.flat()}
      {!isCurrentUserPremium && isViewportNewest && (
        <SponsoredMessage
          key={chatId}
          chatId={chatId}
          containerRef={containerRef}
        />
      )}
      <div
        ref={forwardsTriggerRef}
        key='forwards-trigger'
        className='forwards-trigger'
      />
      <div ref={fabTriggerRef} key='fab-trigger' className='fab-trigger' />
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    return {
      currentUserId: global.currentUserId!,
    };
  })(MessageListContent)
);
