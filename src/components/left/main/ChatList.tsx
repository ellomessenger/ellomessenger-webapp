import React, { FC, memo, useEffect, useRef, useCallback } from 'react';
import { getActions } from '../../../global';

import { LeftColumnContent } from '../../../types';
import type { SettingsScreens } from '../../../types';
import type { GlobalState } from '../../../global/types';

import {
  ALL_FOLDER_ID,
  ARCHIVED_FOLDER_ID,
  ARCHIVE_MINIMIZED_HEIGHT,
  CHAT_HEIGHT_PX,
  CHAT_LIST_SLICE,
} from '../../../config';
import { IS_MAC_OS, IS_PWA } from '../../../util/windowEnvironment';
import { getPinnedChatsCount, getOrderKey } from '../../../util/folderManager';

import type { FolderEditDispatch } from '../../../hooks/reducers/useFoldersReducer';
import useInfiniteScroll from '../../../hooks/useInfiniteScroll';
import { useFolderManagerForOrderedIds } from '../../../hooks/useFolderManager';
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';
import { useHotkeys } from '../../../hooks/useHotkeys';
import useDebouncedCallback from '../../../hooks/useDebouncedCallback';
import useOrderDiff from './hooks/useOrderDiff';

import InfiniteScroll from '../../ui/InfiniteScroll';
import Loading from '../../ui/Loading';
import Chat from './Chat';
import EmptyFolder from './EmptyFolder';
import Archive from './Archive';
import classNames from 'classnames';

type OwnProps = {
  folderType: 'all' | 'archived' | 'folder';
  folderId?: number;
  isActive: boolean;
  isFeed?: boolean;
  canDisplayArchive?: boolean;
  archiveSettings: GlobalState['archiveSettings'];
  isForumPanelOpen?: boolean;
  lastSyncTime?: number;
  foldersDispatch: FolderEditDispatch;
  onSettingsScreenSelect: (screen: SettingsScreens) => void;
};

const INTERSECTION_THROTTLE = 200;
const DRAG_ENTER_DEBOUNCE = 500;
const RESERVED_HOTKEYS = new Set(['9', '0']);

const ChatList: FC<OwnProps> = ({
  folderType,
  folderId,
  isActive,
  isFeed,
  isForumPanelOpen,
  canDisplayArchive,
  archiveSettings,

  foldersDispatch,
  onSettingsScreenSelect,
}) => {
  const { openChat, openNextChat, closeForumPanel, setLeftScreen } =
    getActions();
  // eslint-disable-next-line no-null/no-null
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldIgnoreDragRef = useRef(false);

  const resolvedFolderId =
    folderType === 'all'
      ? ALL_FOLDER_ID
      : folderType === 'archived'
      ? ARCHIVED_FOLDER_ID
      : folderId!;

  const shouldDisplayArchive =
    folderType === 'all' && canDisplayArchive && !isFeed;

  const orderedIds = useFolderManagerForOrderedIds(resolvedFolderId);

  const chatsHeight = (orderedIds?.length || 0) * CHAT_HEIGHT_PX;
  const archiveHeight = shouldDisplayArchive
    ? archiveSettings.isMinimized
      ? ARCHIVE_MINIMIZED_HEIGHT
      : CHAT_HEIGHT_PX
    : 0;

  const { orderDiffById, getAnimationType } = useOrderDiff(orderedIds);

  const [viewportIds, getMore] = useInfiniteScroll(
    undefined,
    orderedIds,
    undefined,
    CHAT_LIST_SLICE
  );

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

        const isArchiveInList =
          shouldDisplayArchive && !archiveSettings.isMinimized;

        const shift = isArchiveInList ? -1 : 0;
        const position = Number(digit) + shift - 1;

        if (isArchiveInList && position === -1) {
          setLeftScreen({ screen: LeftColumnContent.Archived });
          return;
        }

        if (position > orderedIds!.length - 1) return;

        openChat({ id: orderedIds![position], shouldReplaceHistory: true });
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    archiveSettings,
    isActive,
    openChat,
    openNextChat,
    orderedIds,
    shouldDisplayArchive,
  ]);

  const { observe } = useIntersectionObserver({
    rootRef: containerRef,
    throttleMs: INTERSECTION_THROTTLE,
  });

  const handleArchivedClick = useCallback(() => {
    setLeftScreen({ screen: LeftColumnContent.Archived });
    closeForumPanel();
  }, [closeForumPanel]);

  const handleArchivedDragEnter = useCallback(() => {
    if (shouldIgnoreDragRef.current) {
      shouldIgnoreDragRef.current = false;
      return;
    }
    handleArchivedClick();
  }, [handleArchivedClick]);

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

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x < rect.width || y < rect.y) return;
    shouldIgnoreDragRef.current = true;
  }, []);

  function renderChats() {
    const viewportOffset = orderedIds!.indexOf(viewportIds![0]);

    const pinnedCount = getPinnedChatsCount(resolvedFolderId) || 0;

    return viewportIds!.map((id, i) => {
      const isPinned = viewportOffset + i < pinnedCount;
      const offsetTop = archiveHeight + (viewportOffset + i) * CHAT_HEIGHT_PX;
      return (
        <Chat
          key={id}
          teactOrderKey={isPinned ? i : getOrderKey(id)}
          chatId={id}
          isPinned={isPinned}
          isFeed={isFeed}
          folderId={folderId}
          animationType={getAnimationType(id)}
          orderDiff={orderDiffById[id]}
          offsetTop={offsetTop}
          observeIntersection={observe}
          onDragEnter={handleDragEnter}
        />
      );
    });
  }

  return (
    <InfiniteScroll
      className={classNames('chat-list custom-scroll', {
        'forum-panel-open': isForumPanelOpen,
      })}
      elRef={containerRef}
      items={viewportIds}
      itemSelector='.ListItem:not(.chat-item-archive)'
      preloadBackwards={CHAT_LIST_SLICE}
      withAbsolutePositioning
      maxHeight={chatsHeight + archiveHeight}
      onLoadMore={getMore}
      onDragLeave={handleDragLeave}
    >
      {shouldDisplayArchive && (
        <Archive
          key='archive'
          archiveSettings={archiveSettings}
          onClick={handleArchivedClick}
          onDragEnter={handleArchivedDragEnter}
        />
      )}

      {viewportIds?.length ? (
        renderChats()
      ) : viewportIds && !viewportIds.length ? (
        <EmptyFolder
          folderId={folderId}
          folderType={folderType}
          foldersDispatch={foldersDispatch}
          onSettingsScreenSelect={onSettingsScreenSelect}
        />
      ) : (
        <Loading key='loading' />
      )}
    </InfiniteScroll>
  );
};

export default memo(ChatList);
