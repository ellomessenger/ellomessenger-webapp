import React, { FC, memo, useCallback, useMemo, useRef, useState } from 'react';
import ListItem from '../../ui/ListItem';
import PrivateChatInfo from '../../common/PrivateChatInfo';
import { getActions, getGlobal, withGlobal } from '../../../global';
import { ApiChatMember, ApiUserStatus } from '../../../api/types';
import {
  filterUsersByName,
  sortChatIds,
  sortUserIds,
} from '../../../global/helpers';
import { selectChat } from '../../../global/selectors';

import useInfiniteScroll from '../../../hooks/useInfiniteScroll';
import InputText from '../../ui/InputText';
import { useTranslation } from 'react-i18next';
import useLastCallback from '../../../hooks/useLastCallback';

type OwnProps = {
  chatId: string;
};

type StateProps = {
  members?: ApiChatMember[];
  userStatusesById: Record<string, ApiUserStatus>;
};

const ManageSearchMembers: FC<StateProps & OwnProps> = ({
  chatId,
  members,
  userStatusesById,
}) => {
  const { closeManagement, openChat, setUserSearchQuery } = getActions();

  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';

  const memberIds = useMemo(() => {
    const usersById = getGlobal().users.byId;
    if (!members || !usersById) {
      return [];
    }

    const userIds = sortUserIds(
      members.map(({ userId }) => userId),
      usersById,
      userStatusesById
    );

    return userIds;
  }, [members, userStatusesById]);

  const displayedIds = useMemo(() => {
    const usersById = getGlobal().users.byId;
    const chatsById = getGlobal().chats.byId;
    const shouldUseSearchResults = Boolean(searchQuery);
    const listedIds = !shouldUseSearchResults
      ? memberIds
      : filterUsersByName(memberIds, usersById, searchQuery);

    return sortChatIds(listedIds, chatsById, true);
  }, [memberIds, searchQuery]);

  const handleMemberClick = useCallback(
    (id: string) => {
      closeManagement();
      openChat({ id });
    },
    [closeManagement, openChat]
  );

  const [viewportIds, getMore] = useInfiniteScroll(
    undefined,
    displayedIds,
    Boolean(searchQuery)
  );

  const handleFilterChange = useLastCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserSearchQuery({ query: e.target.value });
      setSearchQuery(e.target.value);
    }
  );

  function renderSearchField() {
    return (
      <div className='Management__filter' dir={isRtl ? 'rtl' : undefined}>
        <InputText
          elRef={inputRef}
          value={searchQuery}
          onChange={handleFilterChange}
          placeholder={String(t('SearchPeople'))}
        />
      </div>
    );
  }

  return (
    <div className='Management'>
      {renderSearchField()}
      <div className='custom-scroll'>
        <div className='section'>
          {(viewportIds as string[])!.map((id, i) => (
            <ListItem
              key={id}
              teactOrderKey={i}
              className='chat-item-clickable scroll-item small-icon underline'
              ripple
              onClick={() => handleMemberClick(id)}
            >
              <PrivateChatInfo userId={id} forceShowSelf />
            </ListItem>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId }): StateProps => {
    const chat = selectChat(global, chatId);
    const { statusesById: userStatusesById } = global.users;
    const members = chat?.fullInfo?.members;
    return {
      members,
      userStatusesById,
    };
  })(ManageSearchMembers)
);
