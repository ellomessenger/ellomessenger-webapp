import React, { FC, memo, useCallback, useMemo, useRef, useState } from 'react';
import { getActions, getGlobal, withGlobal } from '../../../global';

import type { ApiChat, ApiMessage } from '../../../api/types';
import { LoadMoreDirection } from '../../../types';

import { selectTabState } from '../../../global/selectors';
import { unique } from '../../../util/iteratees';
import { sortChatIds, filterUsersByName } from '../../../global/helpers';
import { MEMO_EMPTY_ARRAY } from '../../../util/memo';
import { throttle } from '../../../util/schedulers';
import { renderMessageSummary } from '../../common/helpers/renderMessageText';

import useHorizontalScroll from '../../../hooks/useHorizontalScroll';
import useAppLayout from '../../../hooks/useAppLayout';

import InfiniteScroll from '../../ui/InfiniteScroll';
import LeftSearchResultChat from './LeftSearchResultChat';
import RecentContacts from './RecentContacts';
import ChatMessage from './ChatMessage';
import DateSuggest from './DateSuggest';
import Link from '../../ui/Link';
import NothingFound from '../../common/NothingFound';
import PickerSelectedItem from '../../common/PickerSelectedItem';
import { useTranslation } from 'react-i18next';

export type OwnProps = {
  searchQuery?: string;
  dateSearchQuery?: string;
  searchDate?: number;
  onReset: () => void;
  onSearchDateSelect: (value: Date) => void;
};

type StateProps = {
  currentUserId?: string;
  localContactIds?: string[];
  localChatIds?: string[];
  localUserIds?: string[];
  globalChatIds?: string[];
  globalUserIds?: string[];
  foundIds?: string[];
  globalMessagesByChatId?: Record<string, { byId: Record<number, ApiMessage> }>;
  chatsById: Record<string, ApiChat>;
  fetchingStatus?: { chats?: boolean; messages?: boolean };
  lastSyncTime?: number;
};

const MIN_QUERY_LENGTH_FOR_GLOBAL_SEARCH = 4;
const LESS_LIST_ITEMS_AMOUNT = 5;

const runThrottled = throttle((cb) => cb(), 500, false);

const ChatResults: FC<OwnProps & StateProps> = ({
  searchQuery,
  searchDate,
  dateSearchQuery,
  currentUserId,
  localContactIds,
  localChatIds,
  localUserIds,
  globalChatIds,
  globalUserIds,
  foundIds,
  globalMessagesByChatId,
  chatsById,
  fetchingStatus,
  lastSyncTime,
  onReset,
  onSearchDateSelect,
}) => {
  const {
    openChat,
    addRecentlyFoundChatId,
    searchMessagesGlobal,
    setGlobalSearchChatId,
  } = getActions();

  // eslint-disable-next-line no-null/no-null
  const chatSelectionRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  const { isMobile } = useAppLayout();
  const [shouldShowMoreLocal, setShouldShowMoreLocal] =
    useState<boolean>(false);
  const [shouldShowMoreGlobal, setShouldShowMoreGlobal] =
    useState<boolean>(false);

  const handleLoadMore = useCallback(
    ({ direction }: { direction: LoadMoreDirection }) => {
      if (lastSyncTime && direction === LoadMoreDirection.Backwards) {
        runThrottled(() => {
          searchMessagesGlobal({
            type: 'text',
          });
        });
      }
      // eslint-disable-next-line react-hooks-static-deps/exhaustive-deps -- `searchQuery` is required to prevent infinite message loading
    },
    [lastSyncTime, searchMessagesGlobal, searchQuery]
  );

  const handleChatClick = useCallback(
    (id: string) => {
      openChat({ id, shouldReplaceHistory: true });

      if (id !== currentUserId) {
        addRecentlyFoundChatId({ id });
      }

      if (!isMobile) {
        onReset();
      }
    },
    [openChat, currentUserId, isMobile, addRecentlyFoundChatId, onReset]
  );

  const handlePickerItemClick = useCallback(
    (id: string) => {
      setGlobalSearchChatId({ id });
    },
    [setGlobalSearchChatId]
  );

  const localResults = useMemo(() => {
    if (
      !searchQuery ||
      (searchQuery.startsWith('@') && searchQuery.length < 2)
    ) {
      return MEMO_EMPTY_ARRAY;
    }

    const contactIdsWithMe = [
      ...(currentUserId ? [currentUserId] : []),
      ...(localContactIds || []),
    ];
    // No need for expensive global updates on users, so we avoid them
    const usersById = getGlobal().users.byId;
    const foundContactIds = filterUsersByName(
      contactIdsWithMe,
      usersById,
      searchQuery,
      currentUserId,
      t('SavedMessages')
    );

    return [
      ...sortChatIds(
        unique([
          ...(foundContactIds || []),
          ...(localChatIds || []),
          ...(localUserIds || []),
        ]),
        chatsById,
        undefined,
        currentUserId ? [currentUserId] : undefined
      ),
    ];
  }, [
    searchQuery,
    currentUserId,
    localContactIds,
    localChatIds,
    localUserIds,
    chatsById,
  ]);

  useHorizontalScroll(chatSelectionRef, !localResults.length, true);

  const globalResults = useMemo(() => {
    if (
      !searchQuery ||
      searchQuery.length < MIN_QUERY_LENGTH_FOR_GLOBAL_SEARCH ||
      !globalChatIds ||
      !globalUserIds
    ) {
      return MEMO_EMPTY_ARRAY;
    }

    return sortChatIds(
      unique([...globalChatIds, ...globalUserIds]),
      chatsById,
      true
    );
  }, [chatsById, globalChatIds, globalUserIds, searchQuery]);

  const foundMessages = useMemo(() => {
    if ((!searchQuery && !searchDate) || !foundIds || foundIds.length === 0) {
      return MEMO_EMPTY_ARRAY;
    }

    return foundIds
      .map((id) => {
        const [chatId, messageId] = id.split('_');

        return globalMessagesByChatId?.[chatId]?.byId[Number(messageId)];
      })
      .filter(Boolean)
      .sort((a, b) => b.date - a.date);
  }, [foundIds, globalMessagesByChatId, searchQuery, searchDate]);

  const handleClickShowMoreLocal = useCallback(() => {
    setShouldShowMoreLocal(!shouldShowMoreLocal);
  }, [shouldShowMoreLocal]);

  const handleClickShowMoreGlobal = useCallback(() => {
    setShouldShowMoreGlobal(!shouldShowMoreGlobal);
  }, [shouldShowMoreGlobal]);

  function renderFoundMessage(message: ApiMessage) {
    const text = renderMessageSummary(t, message);
    const chat = chatsById[message.chatId];

    if (!text || !chat) {
      return undefined;
    }

    return (
      <ChatMessage
        chatId={message.chatId}
        message={message}
        searchQuery={searchQuery}
      />
    );
  }

  const nothingFound =
    fetchingStatus &&
    !fetchingStatus.chats &&
    !fetchingStatus.messages &&
    !localResults.length &&
    !globalResults.length &&
    !foundMessages.length;

  if (!searchQuery && !searchDate) {
    return <RecentContacts onReset={onReset} />;
  }

  return (
    <InfiniteScroll
      className='LeftSearch custom-scroll'
      items={foundMessages}
      onLoadMore={handleLoadMore}
      // To prevent scroll jumps caused by delayed local results rendering
      noScrollRestoreOnTop
      noFastList
    >
      {dateSearchQuery && (
        <div className='chat-selection no-selection no-scrollbar'>
          <DateSuggest
            searchDate={dateSearchQuery}
            onSelect={onSearchDateSelect}
          />
        </div>
      )}
      {nothingFound && (
        <NothingFound
          text={t('ChatList.Search.NoResults')}
          description={t('ChatList.Search.NoResultsDescription')}
        />
      )}
      {Boolean(localResults.length) && (
        <div
          className='chat-selection no-selection no-scrollbar'
          dir='auto'
          ref={chatSelectionRef}
        >
          {localResults.map((id) => (
            <PickerSelectedItem
              chatOrUserId={id}
              onClick={handlePickerItemClick}
              clickArg={id}
            />
          ))}
        </div>
      )}
      {Boolean(localResults.length) && (
        <div className='search-section'>
          <h3 className='section-heading' dir='auto'>
            {/* {t('ChatList.SearchSectionDialogs')} */}
            {localResults.length > LESS_LIST_ITEMS_AMOUNT && (
              <Link className='Link' onClick={handleClickShowMoreLocal}>
                {t(
                  shouldShowMoreLocal
                    ? 'ChatList.Search.ShowLess'
                    : 'ChatList.Search.ShowMore'
                )}
              </Link>
            )}
          </h3>
          {localResults.map((id: string, index: number) => {
            if (!shouldShowMoreLocal && index >= LESS_LIST_ITEMS_AMOUNT) {
              return undefined;
            }

            return (
              <LeftSearchResultChat
                key={id}
                chatId={id}
                onClick={handleChatClick}
              />
            );
          })}
        </div>
      )}
      {Boolean(globalResults.length) && (
        <div className='search-section'>
          <h3 className='section-heading' dir='auto'>
            {t('ChatList.SearchSectionGlobal')}
            {globalResults.length > LESS_LIST_ITEMS_AMOUNT && (
              <Link className='Link' onClick={handleClickShowMoreGlobal}>
                {t(
                  shouldShowMoreGlobal
                    ? 'ChatList.Search.ShowLess'
                    : 'ChatList.Search.ShowMore'
                )}
              </Link>
            )}
          </h3>
          {globalResults.map((id, index) => {
            if (!shouldShowMoreGlobal && index >= LESS_LIST_ITEMS_AMOUNT) {
              return undefined;
            }

            return (
              <LeftSearchResultChat
                chatId={id}
                withUsername
                onClick={handleChatClick}
              />
            );
          })}
        </div>
      )}
      {Boolean(foundMessages.length) && (
        <div className='search-section'>
          <h3 className='section-heading' dir='auto'>
            {t('Messages', { messagesCount: undefined })}
          </h3>
          {foundMessages.map(renderFoundMessage)}
        </div>
      )}
    </InfiniteScroll>
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    const { byId: chatsById } = global.chats;

    const { userIds: localContactIds } = global.contactList || {};

    if (!localContactIds) {
      return {
        chatsById,
      };
    }

    const { currentUserId, messages, lastSyncTime } = global;
    const { fetchingStatus, globalResults, localResults, resultsByType } =
      selectTabState(global).globalSearch;
    const { chatIds: globalChatIds, userIds: globalUserIds } =
      globalResults || {};
    const { chatIds: localChatIds, userIds: localUserIds } = localResults || {};
    const { byChatId: globalMessagesByChatId } = messages;
    const foundIds = resultsByType?.text?.foundIds;

    return {
      currentUserId,
      localContactIds,
      localChatIds,
      localUserIds,
      globalChatIds,
      globalUserIds,
      foundIds,
      globalMessagesByChatId,
      chatsById,
      fetchingStatus,
      lastSyncTime,
    };
  })(ChatResults)
);
