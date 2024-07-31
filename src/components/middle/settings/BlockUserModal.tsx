import React, {
  FC,
  useMemo,
  useState,
  memo,
  useCallback,
  useEffect,
} from 'react';
import { getActions, withGlobal } from '../../../global';

import type { ApiUser } from '../../../api/types';

import { selectTabState } from '../../../global/selectors';
import { filterUsersByName, getUserFullName } from '../../../global/helpers';
import { unique } from '../../../util/iteratees';

import ChatOrUserPicker from '../../common/ChatOrUserPicker';
import { useTranslation } from 'react-i18next';

export type OwnProps = {
  isOpen: boolean;
  onClose: NoneToVoidFunction;
};

type StateProps = {
  usersById: Record<string, ApiUser>;
  blockedIds: string[];
  contactIds?: string[];
  localContactIds?: string[];
  globalContactIds?: string[];
  currentUserId?: string;
};

const BlockUserModal: FC<OwnProps & StateProps> = ({
  usersById,
  blockedIds,
  contactIds,
  localContactIds,
  globalContactIds,
  currentUserId,
  isOpen,
  onClose,
}) => {
  const { setUserSearchQuery, blockContact } = getActions();

  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  useEffect(() => {
    setUserSearchQuery({ query: search });
  }, [search, setUserSearchQuery]);

  const filteredContactIds = useMemo(() => {
    const availableContactIds = unique(
      [
        ...(contactIds || []),
        ...(localContactIds || []),
        ...(globalContactIds || []),
      ].filter((contactId) => {
        return contactId !== currentUserId && !blockedIds.includes(contactId);
      })
    );

    return filterUsersByName(availableContactIds, usersById, search).sort(
      (firstId, secondId) => {
        const firstName = getUserFullName(usersById[firstId]) || '';
        const secondName = getUserFullName(usersById[secondId]) || '';

        return firstName.localeCompare(secondName);
      }
    );
  }, [
    blockedIds,
    contactIds,
    currentUserId,
    search,
    localContactIds,
    globalContactIds,
    usersById,
  ]);

  const handleRemoveUser = useCallback(
    (userId: string) => {
      const { id: contactId, accessHash } = usersById[userId] || {};
      if (!contactId || !accessHash) {
        return;
      }
      blockContact({ contactId, accessHash });
      onClose();
    },
    [blockContact, onClose, usersById]
  );

  return (
    <ChatOrUserPicker
      isOpen={isOpen}
      chatOrUserIds={filteredContactIds}
      searchPlaceholder={t('Settings.BlockUser')}
      search={search}
      onSearchChange={setSearch}
      onSelectChatOrUser={handleRemoveUser}
      onClose={onClose}
    />
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    const {
      users: { byId: usersById },
      blocked: { ids: blockedIds },
      contactList,
      currentUserId,
    } = global;
    const { localUserIds, globalUserIds } = selectTabState(global).userSearch;
    return {
      usersById,
      blockedIds,
      contactIds: contactList?.userIds,
      localContactIds: localUserIds,
      globalContactIds: globalUserIds,
      currentUserId,
    };
  })(BlockUserModal)
);
