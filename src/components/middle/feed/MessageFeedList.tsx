import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useStickyDates from '../hooks/useStickyDates';
import { debounce, fastRaf } from '../../../util/schedulers';
import { getActions, getGlobal, withGlobal } from '../../../global';
import {
  selectFeedMessages,
  selectIsViewportFeedNewest,
  selectPerformanceSettingsValue,
  selectScrollFeedOffset,
} from '../../../global/selectors';
import { preventMessageInputBlur } from '../helpers/preventMessageInputBlur';
import { ApiMessage } from '../../../api/types';
import { orderBy } from '../../../util/iteratees';

import useMessageObservers from '../hooks/useMessageObservers';
import useSyncEffect from '../../../hooks/useSyncEffect';
import { PinnedIntersectionChangedCallback } from '../hooks/usePinnedMessage';
import classNames from 'classnames';
import { groupMessagesForFeed, isAlbum } from '../helpers/groupMessages';
import { getMessageHtmlId, getMessageKey } from '../../../global/helpers';
import MessageFeed from './MessageFeed';
import Loading from '../../ui/Loading';

import useContainerHeight from '../hooks/useContainerHeight';
import { MESSAGE_LIST_SLICE } from '../../../config';
import useLayoutEffectWithPrevDeps from '../../../hooks/useLayoutEffectWithPrevDeps';
import {
  requestForcedReflow,
  requestMeasure,
} from '../../../lib/fasterdom/fasterdom';
import { addExtraClass, removeExtraClass } from '../../../lib/teact/teact-dom';

import animateScroll, {
  restartCurrentScrollAnimation,
} from '../../../util/animateScroll';
import { isAnimatingScroll } from '../../../util/fastSmoothScroll';
import resetScroll from '../../../util/resetScroll';
import useLastCallback from '../../../hooks/useLastCallback';
import { ThreadId } from '../../../types';
import useScrollFeeds from './hooks/useScrollFeeds';

type OwnProps = {
  isReady: boolean;
  hasTools?: boolean;
  threadId: ThreadId;
  onPinnedIntersectionChange: PinnedIntersectionChangedCallback;
  scrollTop: boolean;
  onScrolled: (isScroll: boolean) => void;
};

type StateProps = {
  listedMessages?: ApiMessage[];
  firstUnreadId?: string;
  isViewportNewest?: boolean;
  noMessageSendingAnimation?: boolean;
  isFullyLoaded?: boolean;
};

const SCROLL_DEBOUNCE = 200;
const MESSAGE_ANIMATION_DURATION = 500;
const BOTTOM_FOCUS_MARGIN = 16;

const runDebouncedForScroll = debounce((cb) => cb(), SCROLL_DEBOUNCE, false);

const MessageFeedList: FC<OwnProps & StateProps> = ({
  hasTools,
  threadId,
  listedMessages,
  firstUnreadId,
  isViewportNewest,
  scrollTop,
  onScrolled,
  noMessageSendingAnimation,
  onPinnedIntersectionChange,
}) => {
  const { setFeedScrollOffset, clearUnreadFeed, loadFeedMessages } =
    getActions();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollOffsetRef = useRef<number>(
    selectScrollFeedOffset(getGlobal()) || 0
  );

  const isScrollTopJustUpdatedRef = useRef(false);
  const isScrollingRef = useRef<boolean>();
  const listItemElementsRef = useRef<HTMLDivElement[]>();
  const memoFirstUnreadRef = useRef<HTMLDivElement>();
  const memoFirstUnreadIdRef = useRef<string>();
  const memoFocusingIdRef = useRef<number>();

  const anchorIdRef = useRef<string>();

  const areMessagesLoaded = Boolean(listedMessages);

  useSyncEffect(() => {
    memoFirstUnreadIdRef.current = firstUnreadId;
  }, [firstUnreadId]);

  const {
    observeIntersectionForReading,
    observeIntersectionForLoading,
    observeIntersectionForPlaying,
  } = useMessageObservers(
    'thread',
    containerRef,
    memoFirstUnreadIdRef,
    onPinnedIntersectionChange
  );

  const handleScroll = useCallback(() => {
    if (isScrollTopJustUpdatedRef.current) {
      isScrollTopJustUpdatedRef.current = false;
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    isScrollingRef.current = true;

    if (!memoFocusingIdRef.current) {
      updateStickyDates(container, hasTools);
    }

    runDebouncedForScroll(() => {
      isScrollingRef.current = false;
      fastRaf(() => {
        if (!container.parentElement && !areMessagesLoaded) {
          return;
        }
        scrollOffsetRef.current = container.scrollTop;
        setFeedScrollOffset({ scrollOffset: scrollOffsetRef.current });
      });
    });
  }, [hasTools]);

  // Container resize observer (caused by Composer reply/webpage panels)
  const [getContainerHeight, prevContainerHeightRef] = useContainerHeight(
    containerRef,
    false
  );

  useLayoutEffectWithPrevDeps(
    ([prevListedMessages, prevIsViewportNewest]) => {
      const containerHeight = getContainerHeight();
      const prevContainerHeight = prevContainerHeightRef.current;
      prevContainerHeightRef.current = containerHeight;
      // Skip initial resize observer callback
      if (
        listedMessages === prevListedMessages &&
        isViewportNewest === prevIsViewportNewest &&
        containerHeight !== prevContainerHeight &&
        prevContainerHeight === undefined
      ) {
        return;
      }

      const container = containerRef.current!;
      listItemElementsRef.current = Array.from(
        container.querySelectorAll<HTMLDivElement>('.message-list-item')
      );
      const lastItemElement = listItemElementsRef.current[0];

      const hasLastMessageChanged =
        listedMessages &&
        prevListedMessages &&
        listedMessages[0] !== prevListedMessages[0];

      const hasViewportShifted =
        listedMessages &&
        prevListedMessages &&
        listedMessages[0] !== prevListedMessages[0] &&
        listedMessages?.length === MESSAGE_LIST_SLICE / 2 + 1;

      const wasMessageAdded = false; //hasLastMessageChanged && !hasViewportShifted;

      // Add extra height when few messages to allow scroll animation
      if (
        isViewportNewest &&
        wasMessageAdded &&
        listedMessages &&
        listedMessages.length < MESSAGE_LIST_SLICE / 2 &&
        !container.parentElement!.classList.contains('force-messages-scroll') &&
        (container.firstElementChild as HTMLDivElement)!.clientHeight <=
          container.offsetHeight * 2
      ) {
        addExtraClass(container.parentElement!, 'force-messages-scroll');
        container.parentElement!.classList.add('force-messages-scroll');

        setTimeout(() => {
          if (container.parentElement) {
            removeExtraClass(container.parentElement!, 'force-messages-scroll');
          }
        }, MESSAGE_ANIMATION_DURATION);
      }
      //remove button
      const scrollOffset = scrollOffsetRef.current;
      const firstUnreadElement = memoFirstUnreadIdRef.current
        ? container.querySelector<HTMLDivElement>(
            `#message${memoFirstUnreadIdRef.current}`
          )
        : undefined;

      if (firstUnreadElement && scrollOffset <= firstUnreadElement?.offsetTop) {
        clearUnreadFeed();
      }

      requestForcedReflow(() => {
        const { scrollHeight, offsetHeight } = container;

        let topOffset = 0;
        if (wasMessageAdded) {
          const lastItemHeight = lastItemElement
            ? lastItemElement.offsetHeight + BOTTOM_FOCUS_MARGIN
            : 0;

          topOffset += lastItemHeight;
        }

        const isResized =
          prevContainerHeight !== undefined &&
          prevContainerHeight !== containerHeight;
        if (isResized && isAnimatingScroll()) {
          return undefined;
        }

        let newScrollTop!: number;
        if (isResized) {
          newScrollTop = scrollHeight - offsetHeight;
        } else {
          newScrollTop = scrollOffset + topOffset;
        }

        return () => {
          resetScroll(container, Math.ceil(newScrollTop));
          restartCurrentScrollAnimation();
          scrollOffsetRef.current = Math.ceil(newScrollTop);
          if (!memoFocusingIdRef.current) {
            isScrollTopJustUpdatedRef.current = true;

            requestMeasure(() => {
              isScrollTopJustUpdatedRef.current = false;
            });
          }
        };
      });
    },
    [
      listedMessages,
      isViewportNewest,
      hasTools,
      getContainerHeight,
      prevContainerHeightRef,
      noMessageSendingAnimation,
    ]
  );

  const handleClick = useLastCallback(() => {
    const container = containerRef.current!;
    const firstUnreadElement = memoFirstUnreadIdRef.current
      ? container.querySelector<HTMLDivElement>(
          `#message${memoFirstUnreadIdRef.current}`
        )
      : undefined;
    requestMeasure(() => {
      animateScroll(
        container,
        firstUnreadElement!,
        'start',
        BOTTOM_FOCUS_MARGIN,
        undefined,
        undefined,
        noMessageSendingAnimation ? 0 : undefined
      );
    });
    onScrolled(false);
    setTimeout(() => {
      clearUnreadFeed();
    }, 700);
  });

  const { forwardsTriggerRef } = useScrollFeeds(containerRef, true);

  useEffect(() => {
    if (scrollTop) {
      handleClick();
    }
  }, [scrollTop]);

  const { isScrolled, updateStickyDates } = useStickyDates();
  const className = classNames('MessageList MessageFeedList custom-scroll', {
    scrolled: isScrolled,
  });

  const messageGroups = useMemo(() => {
    if (!areMessagesLoaded || !listedMessages) {
      return undefined;
    }
    return groupMessagesForFeed(orderBy(listedMessages, ['date'], 'desc'));
  }, [listedMessages]);

  const noAppearanceAnimation = !messageGroups;
  const messageCountToAnimate = noAppearanceAnimation
    ? 0
    : messageGroups.flat().length;

  let appearanceIndex = 0;

  const renderMessage = messageGroups?.map((senderGroup) => {
    let currentDocumentGroupId: string | undefined;

    return senderGroup
      .map((messageOrAlbum, messageIndex) => {
        const message = isAlbum(messageOrAlbum)
          ? messageOrAlbum.mainMessage
          : messageOrAlbum;
        const album = isAlbum(messageOrAlbum) ? messageOrAlbum : undefined;
        const isMessageAlbum = isAlbum(messageOrAlbum);
        const nextMessage = senderGroup[messageIndex + 1];

        if (
          message.previousLocalId &&
          anchorIdRef.current === getMessageHtmlId(message.previousLocalId)
        ) {
          anchorIdRef.current = getMessageHtmlId(message.id);
        }

        const documentGroupId =
          !isMessageAlbum && message.groupedId ? message.groupedId : undefined;
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
          isLastInList: messageIndex === senderGroup.length - 1,
        };

        currentDocumentGroupId = documentGroupId;

        const messageKey = getMessageKey(message);

        return (
          <MessageFeed
            key={messageKey}
            message={message}
            threadId={threadId}
            appearanceOrder={messageCountToAnimate - ++appearanceIndex}
            observeIntersectionForBottom={observeIntersectionForReading}
            observeIntersectionForLoading={observeIntersectionForLoading}
            observeIntersectionForPlaying={observeIntersectionForPlaying}
            album={album}
            isFirstInGroup={position.isFirstInGroup}
            isLastInGroup={position.isLastInGroup}
            isFirstInDocumentGroup={position.isFirstInDocumentGroup}
            isLastInDocumentGroup={position.isLastInDocumentGroup}
            isLastInList={position.isLastInList}
          />
        );
      })
      .flat();
  });

  useEffect(() => {
    loadFeedMessages({ page: 0 });
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      onScroll={handleScroll}
      onMouseDown={preventMessageInputBlur}
    >
      <div className='messages-container'>
        {messageGroups && renderMessage?.flat()}

        {!areMessagesLoaded && <Loading color='white' backgroundColor='dark' />}
        <div
          ref={forwardsTriggerRef}
          key='forwards-trigger'
          className='forwards-trigger'
        />
      </div>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    const messagesById = selectFeedMessages(global);

    const listedMessages = messagesById
      ? Object.keys(messagesById!).map((id) => messagesById[id])
      : [];
    const firstUnreadId =
      (global.messages.unreadFeedMessage.length &&
        `${global.messages.unreadFeedMessage[0].id}${global.messages.unreadFeedMessage[0].chatId}`) ||
      undefined;
    return {
      listedMessages,
      firstUnreadId,
      isViewportNewest: selectIsViewportFeedNewest(global),
      noMessageSendingAnimation: !selectPerformanceSettingsValue(
        global,
        'messageSendingAnimations'
      ),
    };
  })(MessageFeedList)
);
