import React, { FC, useCallback, useMemo, memo, useState } from 'react';
import { getActions, withGlobal } from '../../../global';

import type { ApiUser, ApiUserStatus } from '../../../api/types';

import {
  filterUsersByName,
  isDeletedUser,
  sortUserIds,
  sortUserNotDeleted,
} from '../../../global/helpers';
import useInfiniteScroll from '../../../hooks/useInfiniteScroll';
import useAppLayout from '../../../hooks/useAppLayout';

import PrivateChatInfo from '../../common/PrivateChatInfo';
import InfiniteScroll from '../../ui/InfiniteScroll';
import ListItem from '../../ui/ListItem';
import Loading from '../../ui/Loading';

import { useTranslation } from 'react-i18next';

import NothingFound from '../../common/NothingFound';
import { LOCAL_TGS_URLS } from '../../common/helpers/animatedAssets';
import Link from '../../ui/Link';
import { selectTabState } from '../../../global/selectors';

const LESS_LIST_ITEMS_AMOUNT = 5;

export type OwnProps = {
  filter: string;
  isActive: boolean;
  onReset: () => void;
};

type StateProps = {
  usersById: Record<string, ApiUser>;
  userStatusesById: Record<string, ApiUserStatus>;
  contactIds?: string[];
  globalUserIds?: string[];
};

const ContactList: FC<OwnProps & StateProps> = ({
  filter,
  usersById,
  userStatusesById,
  contactIds,
  globalUserIds,
}) => {
  const { openChat, openNewContactDialog } = getActions();

  const { t } = useTranslation();
  const { isMobile } = useAppLayout();
  const [shouldShowMoreGlobal, setShouldShowMoreGlobal] =
    useState<boolean>(false);

  const handleClick = useCallback(
    (id: string) => {
      openChat({ id, shouldReplaceHistory: true });
    },
    [openChat]
  );

  const listIds = useMemo(() => {
    if (!contactIds) {
      return undefined;
    }
    const filteredNoSelfIds = contactIds.filter((id) => {
      const user = usersById[id];
      return user && !isDeletedUser(user) && !user.isSelf;
    });

    const filteredIds = filterUsersByName(filteredNoSelfIds, usersById, filter);

    return sortUserIds(filteredIds, usersById, userStatusesById);
  }, [contactIds, filter, usersById, userStatusesById]);

  const [viewportIds, getMore] = useInfiniteScroll(
    undefined,
    listIds,
    Boolean(filter)
  );

  const handleClickShowMoreGlobal = useCallback(() => {
    setShouldShowMoreGlobal(!shouldShowMoreGlobal);
  }, [shouldShowMoreGlobal]);

  const nothingFound = !viewportIds?.length && !globalUserIds?.length;

  return (
    <div className='LeftSearch'>
      <InfiniteScroll
        items={viewportIds}
        onLoadMore={getMore}
        className='LeftSearch custom-scroll'
      >
        {viewportIds ? (
          nothingFound &&
          (filter.length ? (
            <NothingFound text={t('SearchNoContacts')} />
          ) : (
            <NothingFound
              text={t('ContactListEmpty')}
              heading={t('NoContact')}
              tgsUrl={LOCAL_TGS_URLS.NoContacts}
            />
          ))
        ) : (
          <Loading key='loading' />
        )}

        {!!viewportIds?.length && (
          <div className='search-section'>
            {viewportIds.map((id) => (
              <ListItem
                key={id}
                className='chat-item-clickable'
                onClick={() => handleClick(id)}
                ripple={!isMobile}
              >
                <PrivateChatInfo
                  userId={id}
                  forceShowSelf
                  avatarSize='medium'
                />
              </ListItem>
            ))}
          </div>
        )}

        {!!globalUserIds?.length && (
          <div className='search-section'>
            <h3 className='section-heading' dir='auto'>
              {t('ChatList.SearchSectionGlobal')}
              {globalUserIds.length > LESS_LIST_ITEMS_AMOUNT && (
                <Link className='Link' onClick={handleClickShowMoreGlobal}>
                  {t(
                    shouldShowMoreGlobal
                      ? 'ChatList.Search.ShowLess'
                      : 'ChatList.Search.ShowMore'
                  )}
                </Link>
              )}
            </h3>
            {globalUserIds.map((id, index) => {
              if (!shouldShowMoreGlobal && index >= LESS_LIST_ITEMS_AMOUNT) {
                return undefined;
              }

              return (
                <ListItem
                  key={id}
                  className='chat-item-clickable'
                  onClick={() => handleClick(id)}
                  ripple={!isMobile}
                >
                  <PrivateChatInfo
                    userId={id}
                    forceShowSelf
                    avatarSize='medium'
                  />
                </ListItem>
              );
            })}
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    const { userIds: contactIds } = global.contactList || {};
    const { byId: usersById, statusesById: userStatusesById } = global.users;
    const { globalResults } = selectTabState(global).globalSearch;
    const globalUserNotDeleted = globalResults?.userIds?.filter((id) =>
      sortUserNotDeleted(global, id)
    );
    return {
      usersById,
      userStatusesById,
      contactIds,
      globalUserIds: globalUserNotDeleted,
    };
  })(ContactList)
);
