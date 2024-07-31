import React, { FC, useCallback, useMemo, memo, useState } from 'react';
import { getActions, getGlobal, withGlobal } from '../../global';

import type { ApiChat, ApiChatMember } from '../../api/types';
import { ManagementScreens, NewChatMembersProgress } from '../../types';

import { unique } from '../../util/iteratees';
import { selectChat, selectTabState } from '../../global/selectors';
import {
  filterUsersByName,
  getUserFullName,
  isChatChannel,
  isChatCourse,
  isChatSubscription,
  isDeletedUser,
  isUserBot,
  isUserId,
  sortChatIds,
  sortUserNotDeleted,
} from '../../global/helpers';
import usePrevious from '../../hooks/usePrevious';
import useHistoryBack from '../../hooks/useHistoryBack';

import Picker from '../common/Picker';
import FloatingActionButton from '../ui/FloatingActionButton';
import Spinner from '../ui/Spinner';

import './AddChatMembers.scss';
import { useTranslation } from 'react-i18next';
import IconSvg from '../ui/IconSvg';
import ConfirmDialog from '../ui/ConfirmDialog';
import useFlag from '../../hooks/useFlag';
import useLastCallback from '../../hooks/useLastCallback';

export type OwnProps = {
  chatId: string;
  isActive: boolean;
  //onNextStep: (memberIds: string[]) => void;
  onClose: NoneToVoidFunction;
  onScreenSelect: (screen: ManagementScreens) => void;
};

type StateProps = {
  isChannel?: boolean;
  members?: ApiChatMember[];
  currentUserId?: string;
  chatsById: Record<string, ApiChat>;
  localContactIds?: string[];
  searchQuery?: string;
  isLoading: boolean;
  isSearching?: boolean;
  localUserIds?: string[];
  globalUserIds?: string[];
  isSubscription?: boolean;
  isCourse?: boolean;
};

const AddChatMembers: FC<OwnProps & StateProps> = ({
  isChannel,
  chatId,
  members,
  currentUserId,
  chatsById,
  localContactIds,
  isLoading,
  searchQuery,
  isSearching,
  localUserIds,
  globalUserIds,
  isSubscription,
  isCourse,
  onClose,
  isActive,
  onScreenSelect,
}) => {
  const { setUserSearchQuery, addChatMembers, toggleManagement } = getActions();

  const { t } = useTranslation();
  const [isAddMembersModalOpen, openAddMembersModal, closeAddMembersModal] =
    useFlag();
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const prevSelectedMemberIds = usePrevious(selectedMemberIds);
  const noPickerScrollRestore = prevSelectedMemberIds === selectedMemberIds;

  useHistoryBack({
    isActive,
    onBack: onClose,
  });

  const memberIds = useMemo(() => {
    return members ? members.map((member) => member.userId) : [];
  }, [members]);

  const handleFilterChange = useCallback(
    (query: string) => {
      setUserSearchQuery({ query });
    },
    [setUserSearchQuery]
  );

  const displayedIds = useMemo(() => {
    const usersById = getGlobal().users.byId;
    const filteredContactIds = localContactIds
      ? filterUsersByName(localContactIds, usersById, searchQuery)
      : [];

    return sortChatIds(
      unique([
        ...filteredContactIds,
        ...(localUserIds || []),
        ...(globalUserIds || []),
      ]).filter((userId) => {
        const user = usersById[userId];

        // The user can be added to the chat if the following conditions are met:
        // the user has not yet been added to the current chat
        // AND it is not the current user,
        // AND (it is not found (user from global search) OR it is not a bot OR it is a bot,
        // but the current chat is not a channel AND the appropriate permission is set).
        return (
          !isDeletedUser(user) &&
          !memberIds.includes(userId) &&
          userId !== currentUserId &&
          (!user ||
            !isUserBot(user) ||
            (!isChannel && user.canBeInvitedToGroup))
        );
      }),
      chatsById
    );
  }, [
    localContactIds,
    chatsById,
    searchQuery,
    localUserIds,
    globalUserIds,
    currentUserId,
    memberIds,
    isChannel,
  ]);

  const getNameUsers = useCallback(() => {
    const usersById = getGlobal().users.byId;
    const nameStr: string[] = [];
    selectedMemberIds.map((id) =>
      nameStr.push(getUserFullName(usersById[id])!)
    );
    return nameStr.join(', ');
  }, [selectedMemberIds]);

  const handleNextStep = useLastCallback(() => {
    if (selectedMemberIds.length) {
      setUserSearchQuery({ query: '' });
      addChatMembers({ chatId, memberIds: selectedMemberIds });
    }
    closeAddMembersModal();
    onClose();
  });

  const handleClickInvites = useLastCallback(() => {
    toggleManagement();
    onScreenSelect(ManagementScreens.Invites);
  });

  return (
    <div className='AddChatMembers'>
      <div className='AddChatMembers-inner'>
        <Picker
          itemIds={displayedIds}
          selectedIds={selectedMemberIds}
          filterValue={searchQuery}
          filterPlaceholder={String(t('SearchContactsAndUsernames'))}
          searchInputId='new-members-picker-search'
          isLoading={isSearching}
          onSelectedIdsChange={setSelectedMemberIds}
          onFilterChange={handleFilterChange}
          noScrollRestore={noPickerScrollRestore}
          notFoundText={t('TrySearch')}
          setScreen={handleClickInvites}
          isChannel={isChannel}
          isPaidChannel={isCourse || isSubscription}
        />

        <FloatingActionButton
          isShown={Boolean(selectedMemberIds.length)}
          disabled={isLoading}
          ariaLabel={String(t('AddUsers'))}
          onClick={isChannel ? openAddMembersModal : handleNextStep}
        >
          {isLoading ? (
            <Spinner color='white' />
          ) : (
            <i className='icon-svg'>
              <IconSvg name='check' w='28' h='28' />
            </i>
          )}
        </FloatingActionButton>
        <ConfirmDialog
          isOpen={isAddMembersModalOpen}
          onClose={closeAddMembersModal}
          header={t('Group.AddMembers')}
          text={`${t('AreYouSureAdd')} **${getNameUsers()}** ?`}
          confirmLabel={String(t('Add'))}
          confirmHandler={handleNextStep}
        />
      </div>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId }): StateProps => {
    const chat = selectChat(global, chatId);
    const { userIds: localContactIds } = global.contactList || {};
    const { byId: chatsById } = global.chats;
    const { newChatMembersProgress } = selectTabState(global);
    const { currentUserId } = global;
    const isChannel = chat && isChatChannel(chat);

    const {
      query: searchQuery,
      fetchingStatus,
      globalUserIds,
      localUserIds,
    } = selectTabState(global).userSearch;

    const isSubscription = chat && isChatSubscription(chat);
    const isCourse = chat && isChatCourse(chat);

    return {
      isChannel,
      members: chat?.fullInfo?.members,
      currentUserId,
      chatsById,
      localContactIds,
      searchQuery,
      isSearching: fetchingStatus,
      isLoading: newChatMembersProgress === NewChatMembersProgress.Loading,
      globalUserIds,
      localUserIds,
      isCourse,
      isSubscription,
    };
  })(AddChatMembers)
);
