import { useMemo, useRef } from 'react';

import type {
  ApiChat,
  ApiChatMember,
  ApiMessage,
  ApiUser,
  ApiUserStatus,
} from '../../../api/types';
import type { ProfileTabType, SharedMediaType, ThreadId } from '../../../types';

import {
  MEMBERS_SLICE,
  MESSAGE_SEARCH_SLICE,
  SHARED_MEDIA_SLICE,
} from '../../../config';
import {
  getMessageContentIds,
  sortChatIds,
  sortUserIds,
} from '../../../global/helpers';
import useSyncEffect from '../../../hooks/useSyncEffect';
import useInfiniteScroll from '../../../hooks/useInfiniteScroll';

export default function useProfileViewportIds(
  loadMoreMembers: AnyToVoidFunction,
  loadCommonChats: AnyToVoidFunction,
  searchMessages: AnyToVoidFunction,
  tabType: ProfileTabType,
  mediaSearchType?: SharedMediaType,
  groupChatMembers?: ApiChatMember[],
  commonChatIds?: string[],
  usersById?: Record<string, ApiUser>,
  userStatusesById?: Record<string, ApiUserStatus>,
  chatsById?: Record<string, ApiChat>,
  chatMessages?: Record<number, ApiMessage>,
  foundIds?: number[],
  lastSyncTime?: number,
  threadId?: ThreadId
) {
  const resultType =
    tabType === 'members' || !mediaSearchType ? tabType : mediaSearchType;

  const memberIds = useMemo(() => {
    if (!groupChatMembers || !usersById || !userStatusesById) {
      return undefined;
    }

    return sortUserIds(
      groupChatMembers.map(({ userId }) => userId),
      usersById,
      userStatusesById
    );
  }, [groupChatMembers, usersById, userStatusesById]);

  const chatIds = useMemo(() => {
    if (!commonChatIds || !chatsById) {
      return undefined;
    }

    return sortChatIds(commonChatIds, chatsById, true);
  }, [chatsById, commonChatIds]);

  const [memberViewportIds, getMoreMembers, noProfileInfoForMembers] =
    useInfiniteScrollForLoadableItems(
      resultType,
      loadMoreMembers,
      lastSyncTime,
      memberIds
    );

  const [mediaViewportIds, getMoreMedia, noProfileInfoForMedia] =
    useInfiniteScrollForSharedMedia(
      'media',
      resultType,
      searchMessages,
      chatMessages,
      foundIds,
      threadId
    );

  const [documentViewportIds, getMoreDocuments, noProfileInfoForDocuments] =
    useInfiniteScrollForSharedMedia(
      'documents',
      resultType,
      searchMessages,
      chatMessages,
      foundIds,
      threadId
    );

  const [linkViewportIds, getMoreLinks, noProfileInfoForLinks] =
    useInfiniteScrollForSharedMedia(
      'links',
      resultType,
      searchMessages,
      chatMessages,
      foundIds,
      threadId
    );

  const [audioViewportIds, getMoreAudio, noProfileInfoForAudio] =
    useInfiniteScrollForSharedMedia(
      'audio',
      resultType,
      searchMessages,
      chatMessages,
      foundIds,
      threadId
    );

  const [voiceViewportIds, getMoreVoices, noProfileInfoForVoices] =
    useInfiniteScrollForSharedMedia(
      'voice',
      resultType,
      searchMessages,
      chatMessages,
      foundIds,
      threadId
    );

  const [
    commonChatViewportIds,
    getMoreCommonChats,
    noProfileInfoForCommonChats,
  ] = useInfiniteScrollForLoadableItems(
    resultType,
    loadCommonChats,
    lastSyncTime,
    chatIds
  );

  let viewportIds: number[] | string[] | undefined;
  let getMore: AnyToVoidFunction | undefined;
  let noProfileInfo = false;

  switch (resultType) {
    case 'members':
      viewportIds = memberViewportIds;
      getMore = getMoreMembers;
      noProfileInfo = noProfileInfoForMembers;
      break;
    case 'commonChats':
      viewportIds = commonChatViewportIds;
      getMore = getMoreCommonChats;
      noProfileInfo = noProfileInfoForCommonChats;
      break;
    case 'media':
      viewportIds = mediaViewportIds;
      getMore = getMoreMedia;
      noProfileInfo = noProfileInfoForMedia;
      break;
    case 'documents':
      viewportIds = documentViewportIds;
      getMore = getMoreDocuments;
      noProfileInfo = noProfileInfoForDocuments;
      break;
    case 'links':
      viewportIds = linkViewportIds;
      getMore = getMoreLinks;
      noProfileInfo = noProfileInfoForLinks;
      break;
    case 'audio':
      viewportIds = audioViewportIds;
      getMore = getMoreAudio;
      noProfileInfo = noProfileInfoForAudio;
      break;
    case 'voice':
      viewportIds = voiceViewportIds;
      getMore = getMoreVoices;
      noProfileInfo = noProfileInfoForVoices;
      break;
  }

  return [resultType, viewportIds, getMore, noProfileInfo] as const;
}

function useInfiniteScrollForLoadableItems(
  currentResultType?: ProfileTabType,
  handleLoadMore?: AnyToVoidFunction,
  lastSyncTime?: number,
  itemIds?: string[]
) {
  const [viewportIds, getMore] = useInfiniteScroll(
    lastSyncTime ? handleLoadMore : undefined,
    itemIds,
    undefined,
    MEMBERS_SLICE
  );

  const isOnTop = !viewportIds || !itemIds || viewportIds[0] === itemIds[0];

  return [viewportIds, getMore, !isOnTop] as const;
}

function useInfiniteScrollForSharedMedia(
  forSharedMediaType: SharedMediaType,
  currentResultType?: ProfileTabType,
  handleLoadMore?: AnyToVoidFunction,
  chatMessages?: Record<number, ApiMessage>,
  foundIds?: number[],
  threadId?: ThreadId
) {
  const messageIdsRef = useRef<number[]>();

  useSyncEffect(() => {
    messageIdsRef.current = undefined;
  }, [threadId]);

  useSyncEffect(() => {
    if (currentResultType === forSharedMediaType && chatMessages && foundIds) {
      messageIdsRef.current = getMessageContentIds(
        chatMessages,
        foundIds,
        forSharedMediaType
      );
    }
  }, [chatMessages, foundIds, currentResultType, forSharedMediaType]);

  const [viewportIds, getMore] = useInfiniteScroll(
    handleLoadMore,
    messageIdsRef.current,
    undefined,
    forSharedMediaType === 'media' ? SHARED_MEDIA_SLICE : MESSAGE_SEARCH_SLICE
  );

  const isOnTop =
    !viewportIds ||
    !messageIdsRef.current ||
    viewportIds[0] === messageIdsRef.current[0];

  return [viewportIds, getMore, !isOnTop] as const;
}
