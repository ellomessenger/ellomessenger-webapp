import type { RefObject } from 'react';
import { getActions } from '../../../global';

import type { MessageListType } from '../../../global/types';
import type { PinnedIntersectionChangedCallback } from './usePinnedMessage';

import { IS_ANDROID } from '../../../util/windowEnvironment';
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';
import useBackgroundMode from '../../../hooks/useBackgroundMode';
import useAppLayout from '../../../hooks/useAppLayout';

const INTERSECTION_THROTTLE_FOR_READING = 150;
const INTERSECTION_THROTTLE_FOR_MEDIA = IS_ANDROID ? 1000 : 350;

export default function useMessageObservers(
  type: MessageListType,
  containerRef: RefObject<HTMLDivElement>,
  memoFirstUnreadIdRef: { current: number | string | undefined },
  onPinnedIntersectionChange: PinnedIntersectionChangedCallback
) {
  const { markMessageListRead, markMentionsRead, animateUnreadReaction } =
    getActions();

  const { isMobile } = useAppLayout();
  const INTERSECTION_MARGIN_FOR_LOADING = isMobile ? 300 : 500;

  const {
    observe: observeIntersectionForReading,
    freeze: freezeForReading,
    unfreeze: unfreezeForReading,
  } = useIntersectionObserver(
    {
      rootRef: containerRef,
      throttleMs: INTERSECTION_THROTTLE_FOR_READING,
    },
    (entries) => {
      if (type !== 'thread') {
        return;
      }

      let maxId = 0;
      const mentionIds: number[] = [];
      const reactionIds: number[] = [];
      const viewportPinnedIdsToAdd: number[] = [];
      const viewportPinnedIdsToRemove: number[] = [];
      let isReversed = false;

      entries.forEach((entry) => {
        const { isIntersecting, target, boundingClientRect, rootBounds } =
          entry;

        const { dataset } = target as HTMLDivElement;
        const messageId = Number(dataset.lastMessageId || dataset.messageId);
        const albumMainId = dataset.albumMainId
          ? Number(dataset.albumMainId)
          : undefined;

        if (!isIntersecting) {
          if (dataset.isPinned) {
            if (rootBounds && boundingClientRect.bottom < rootBounds.top) {
              isReversed = true;
            }
            viewportPinnedIdsToRemove.push(albumMainId || messageId);
          }
          return;
        }

        if (messageId > maxId) {
          maxId = messageId;
        }

        if (dataset.hasUnreadMention) {
          mentionIds.push(messageId);
        }

        if (dataset.hasUnreadReaction) {
          reactionIds.push(messageId);
        }

        if (dataset.isPinned) {
          viewportPinnedIdsToAdd.push(albumMainId || messageId);
        }
      });

      if (
        memoFirstUnreadIdRef.current &&
        typeof memoFirstUnreadIdRef.current === 'number' &&
        maxId >= memoFirstUnreadIdRef.current
      ) {
        markMessageListRead({ maxId });
      }

      if (mentionIds.length) {
        markMentionsRead({ messageIds: mentionIds });
      }

      if (reactionIds.length) {
        animateUnreadReaction({ messageIds: reactionIds });
      }

      if (viewportPinnedIdsToAdd.length || viewportPinnedIdsToRemove.length) {
        onPinnedIntersectionChange({
          viewportPinnedIdsToAdd,
          viewportPinnedIdsToRemove,
          isReversed,
        });
      }
    }
  );

  useBackgroundMode(freezeForReading, unfreezeForReading);

  const { observe: observeIntersectionForLoading } = useIntersectionObserver({
    rootRef: containerRef,
    throttleMs: INTERSECTION_THROTTLE_FOR_MEDIA,
    margin: INTERSECTION_MARGIN_FOR_LOADING,
  });

  const { observe: observeIntersectionForPlaying } = useIntersectionObserver({
    rootRef: containerRef,
    throttleMs: INTERSECTION_THROTTLE_FOR_MEDIA,
  });

  return {
    observeIntersectionForReading,
    observeIntersectionForLoading,
    observeIntersectionForPlaying,
  };
}
