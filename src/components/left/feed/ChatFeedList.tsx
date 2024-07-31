import React, {
  FC,
  memo,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  RefObject,
} from 'react';
import { getActions, withGlobal } from '../../../global';

import { CHAT_HEIGHT_PX, CHAT_LIST_SLICE } from '../../../config';
import { IS_MAC_OS, IS_PWA } from '../../../util/windowEnvironment';
import { getOrderKey } from '../../../util/folderManager';

import useInfiniteScroll from '../../../hooks/useInfiniteScroll';
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';
import { useHotkeys } from '../../../hooks/useHotkeys';
import useDebouncedCallback from '../../../hooks/useDebouncedCallback';
import useOrderDiff from '../main/hooks/useOrderDiff';

import InfiniteScroll from '../../ui/InfiniteScroll';
import Loading from '../../ui/Loading';
import Chat from '../main/Chat';
import EmptyFeed from './EmptyFeed';

import { selectFeedExplore, selectTabState } from '../../../global/selectors';
import useLastCallback from '../../../hooks/useLastCallback';
import { ApiMessage } from '../../../api/types';
import Media from '../../common/Media';
import { getMessageKey } from '../../../global/helpers';
import useScrollFeeds from '../../middle/feed/hooks/useScrollFeeds';
import FeedLayout from '../../middle/feed/FeedLayout';
import useAppLayout from '../../../hooks/useAppLayout';
import { FeedLeftList, FeedMiddleList } from '../../main/Main';
import NothingFound from '../../common/NothingFound';
import { useTranslation } from 'react-i18next';
import { unique } from '../../../util/iteratees';

type OwnProps = {
  elRef?: RefObject<HTMLDivElement>;
  isActive: boolean;
  lastSyncTime?: number;
  feedLeftScreen: FeedLeftList;
  setFeedLeftScreen: (screen: FeedLeftList) => void;
  feedMiddleScreen: FeedMiddleList;
  setFeedMiddleScreen: (screen: FeedMiddleList) => void;
  isMobile?: boolean;
  isFilter?: boolean;
  handleLoadMoreRecomended: (direction) => void;
};

type StateProps = {
  feedChatsIds?: string[];
  recomendedIds?: string[];
  feedPinnedCount: number;
  listedExplore?: ApiMessage[];
};

const INTERSECTION_THROTTLE = 200;
const DRAG_ENTER_DEBOUNCE = 500;
const RESERVED_HOTKEYS = new Set(['9', '0']);

const ChatFeedList: FC<OwnProps & StateProps> = ({
  elRef,
  isActive,
  feedChatsIds,
  feedPinnedCount,
  recomendedIds,
  listedExplore,
  feedLeftScreen,
  feedMiddleScreen,
  isFilter,
  setFeedLeftScreen,
  setFeedMiddleScreen,
  handleLoadMoreRecomended,
}) => {
  const { openChat, openNextChat, loadFeedMessages, focusMessage } =
    getActions();
  const { t } = useTranslation();
  // eslint-disable-next-line no-null/no-null
  let containerRef = useRef<HTMLDivElement>(null);
  if (elRef) {
    containerRef = elRef;
  }

  const shouldIgnoreDragRef = useRef(false);

  const { isMobile } = useAppLayout();

  const orderedIds = feedChatsIds;

  const chatsHeight = (orderedIds?.length || 0) * CHAT_HEIGHT_PX;

  const { orderDiffById, getAnimationType } = useOrderDiff(orderedIds);

  // Support <Alt>+<Up/Down> to navigate between chats
  useHotkeys(
    isActive && orderedIds?.length
      ? {
          'Alt+ArrowUp': (e: KeyboardEvent) => {
            e.preventDefault();
            openNextChat({ targetIndexDelta: -1, orderedIds });
          },
          'Alt+ArrowDown': (e: KeyboardEvent) => {
            e.preventDefault();
            openNextChat({ targetIndexDelta: 1, orderedIds });
          },
        }
      : undefined
  );

  // Support <Cmd>+<Digit> to navigate between chats
  useEffect(() => {
    if (!isActive || !orderedIds || !IS_PWA) {
      return undefined;
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (
        ((IS_MAC_OS && e.metaKey) || (!IS_MAC_OS && e.ctrlKey)) &&
        e.code.startsWith('Digit')
      ) {
        const [, digit] = e.code.match(/Digit(\d)/) || [];
        if (!digit || RESERVED_HOTKEYS.has(digit)) return;

        const shift = 0;
        const position = Number(digit) + shift - 1;

        if (position > orderedIds!.length - 1) return;

        openChat({ id: orderedIds![position], shouldReplaceHistory: true });
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, openChat, openNextChat, orderedIds]);

  const { observe } = useIntersectionObserver({
    rootRef: containerRef,
    throttleMs: INTERSECTION_THROTTLE,
  });

  const handleDragEnter = useDebouncedCallback(
    (chatId: string) => {
      if (shouldIgnoreDragRef.current) {
        shouldIgnoreDragRef.current = false;
        return;
      }
      openChat({ id: chatId, shouldReplaceHistory: true });
    },
    [openChat],
    DRAG_ENTER_DEBOUNCE,
    true
  );

  const { forwardsTriggerRef } = useScrollFeeds(containerRef, false, true);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x < rect.width || y < rect.y) return;
    shouldIgnoreDragRef.current = true;
  }, []);

  const handleClickMedia = useCallback(({ chatId, id }: ApiMessage) => {
    focusMessage({
      chatId,
      messageId: id,
      shouldReplaceHistory: true,
      fromFeed: true,
    });
  }, []);

  const renderChats = useLastCallback(() => {
    const viewportOffset = orderedIds!.indexOf(orderedIds![0]);
    const pinnedCount = feedPinnedCount || 0;
    if (!orderedIds) {
      return <Loading key='loading' />;
    }
    if (orderedIds?.length) {
      return orderedIds.map((id, i) => {
        const isPinned = viewportOffset + i < pinnedCount;
        const offsetTop = (viewportOffset + i) * CHAT_HEIGHT_PX;
        return (
          <Chat
            key={id}
            teactOrderKey={isPinned ? i : getOrderKey(id)}
            chatId={id}
            isPinned={isPinned}
            isFeed
            animationType={getAnimationType(id)}
            orderDiff={orderDiffById[id]}
            offsetTop={offsetTop}
            observeIntersection={observe}
            onDragEnter={handleDragEnter}
          />
        );
      });
    } else if (isFilter) {
      return <NothingFound />;
    } else {
      return <EmptyFeed feedLeftScreen={feedLeftScreen} />;
    }
  });

  const renderRecommendedChats = useLastCallback(() => {
    if (!recomendedIds) {
      return <Loading key='loading' />;
    }
    if (recomendedIds?.length) {
      const orderIds = unique(recomendedIds);
      return orderIds.map((id, i) => {
        return (
          <Chat
            key={id}
            teactOrderKey={getOrderKey(id)}
            chatId={id}
            isFeed
            forSubscription
            animationType={getAnimationType(id)}
            orderDiff={orderDiffById[id]}
            offsetTop={-1}
          />
        );
      });
    } else if (isFilter) {
      return <NothingFound text={t('WeDidNotFind')} />;
    } else {
      return <EmptyFeed feedLeftScreen={feedLeftScreen} />;
    }
  });

  const renderExploreMessages = useLastCallback(() => {
    if (!listedExplore) {
      return <Loading key='loading' />;
    }

    if (listedExplore?.length) {
      return (
        <div className='shared-media'>
          <div className='content media-list'>
            {listedExplore.map((message) => (
              <Media
                key={getMessageKey(message)}
                message={message}
                onClick={() => handleClickMedia(message)}
              />
            ))}
          </div>
        </div>
      );
    }
  });

  useEffect(() => {
    if (feedLeftScreen === FeedLeftList.Explore) {
      loadFeedMessages({ page: 0, isExplore: true });
    }
  }, [feedLeftScreen]);

  return (
    <>
      <InfiniteScroll
        className='chat-list feed-list custom-scroll'
        elRef={containerRef}
        items={
          feedLeftScreen === FeedLeftList.ForYou
            ? recomendedIds
            : feedLeftScreen === FeedLeftList.Explore
            ? listedExplore
            : orderedIds
        }
        itemSelector='.ListItem:not(.chat-item-archive)'
        withAbsolutePositioning
        maxHeight={chatsHeight}
        onLoadMore={handleLoadMoreRecomended}
        onDragLeave={handleDragLeave}
      >
        {feedLeftScreen === FeedLeftList.Following ? (
          isMobile ? (
            <FeedLayout
              isMobile={isMobile}
              feedScreen={feedMiddleScreen}
              setFeedScreen={setFeedMiddleScreen}
            />
          ) : (
            renderChats()
          )
        ) : feedLeftScreen === FeedLeftList.Explore ? (
          renderExploreMessages()
        ) : (
          renderRecommendedChats()
        )}
      </InfiniteScroll>
      <div
        ref={forwardsTriggerRef}
        key='forwards-trigger'
        className='forwards-trigger'
      />
    </>
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    const { chats, feedFilter } = global;

    const visiblePinned = feedFilter?.pinned?.filter((id) =>
      chats.listIds.feed?.includes(id)
    );
    const feedChatsIds =
      chats.listIds.feed?.filter((id: string) => id === chats.byId[id]?.id) ||
      [];
    const { globalResults } = selectTabState(global).globalSearch;

    const exploreById = selectFeedExplore(global);

    const listedExplore = exploreById
      ? Object.keys(exploreById!).map((id) => exploreById[id])
      : [];

    const feedPinnedCount = visiblePinned?.length || 0;

    return {
      feedChatsIds,
      feedPinnedCount,
      recomendedIds: globalResults?.chatIds!,
      listedExplore,
    };
  })(ChatFeedList)
);
