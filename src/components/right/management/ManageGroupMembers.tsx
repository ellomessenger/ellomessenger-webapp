import React, { FC, memo, useCallback, useMemo, useRef, useState } from 'react';
import { getActions, getGlobal, withGlobal } from '../../../global';

import type { ApiChat, ApiChatMember, ApiUserStatus } from '../../../api/types';
import { ManagementScreens } from '../../../types';

import { selectChat, selectTabState } from '../../../global/selectors';
import {
  sortUserIds,
  isChatChannel,
  filterUsersByName,
  getHasAdminRight,
  isChatBasicGroup,
  isChatSubscription,
  isChatCourse,
  sortChatIds,
  isDeletedUser,
  isUserBot,
} from '../../../global/helpers';
import useHistoryBack from '../../../hooks/useHistoryBack';
import useInfiniteScroll from '../../../hooks/useInfiniteScroll';
import useKeyboardListNavigation from '../../../hooks/useKeyboardListNavigation';

import PrivateChatInfo from '../../common/PrivateChatInfo';
import NothingFound from '../../common/NothingFound';
import ListItem from '../../ui/ListItem';
import InputText from '../../ui/InputText';
import InfiniteScroll from '../../ui/InfiniteScroll';
import Loading from '../../ui/Loading';
import DeleteMemberModal from '../DeleteMemberModal';
import Switcher from '../../ui/Switcher';
import { useTranslation } from 'react-i18next';
import IconSvg from '../../ui/IconSvg';
import useLastCallback from '../../../hooks/useLastCallback';
import classNames from 'classnames';
import { unique } from '../../../util/iteratees';

type OwnProps = {
  chatId: string;
  isActive: boolean;
  noAdmins?: boolean;
  onClose: NoneToVoidFunction;
  onScreenSelect?: (screen: ManagementScreens) => void;
  onChatMemberSelect?: (
    memberId: string,
    isPromotedByCurrentUser?: boolean
  ) => void;
};

type StateProps = {
  userStatusesById: Record<string, ApiUserStatus>;
  members?: ApiChatMember[];
  adminMembersById?: Record<string, ApiChatMember>;
  isChannel?: boolean;
  contactIds?: string[];
  searchQuery?: string;
  isSearching?: boolean;
  localUserIds?: string[];
  globalUserIds?: string[];
  currentUserId?: string;
  canDeleteMembers?: boolean;
  areParticipantsHidden?: boolean;
  canHideParticipants?: boolean;
  isSubscription?: boolean;
  isCourse?: boolean;
  chatsById: Record<string, ApiChat>;
};

const ManageGroupMembers: FC<OwnProps & StateProps> = ({
  chatId,
  noAdmins,
  members,
  adminMembersById,
  userStatusesById,
  isChannel,
  isActive,
  isSubscription,
  contactIds,
  isCourse,
  isSearching,
  searchQuery,
  canDeleteMembers,
  areParticipantsHidden,
  canHideParticipants,
  currentUserId,
  globalUserIds,
  localUserIds,
  chatsById,
  onClose,
  onScreenSelect,
  onChatMemberSelect,
}) => {
  const {
    openChat,
    setUserSearchQuery,
    closeManagement,
    toggleParticipantsHidden,
    setNewChatMembersDialogState,
  } = getActions();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [contactsFilter, setContactsFilter] = useState<string>('');

  const [deletingUserId, setDeletingUserId] = useState<string | undefined>();

  const adminIds = useMemo(() => {
    return noAdmins && adminMembersById ? Object.keys(adminMembersById) : [];
  }, [adminMembersById, noAdmins]);

  const memberIds = useMemo(() => {
    const usersById = getGlobal().users.byId;
    if (!members || !usersById) {
      return [];
    }

    const userIds = sortUserIds(
      members
        .filter(({ userId }) => userId !== currentUserId)
        .map(({ userId }) => userId),
      usersById,
      userStatusesById
    );

    return noAdmins
      ? userIds.filter((userId) => !adminIds.includes(userId))
      : userIds;
  }, [members, userStatusesById, noAdmins, adminIds]);

  const displayedIds = useMemo(() => {
    const usersById = getGlobal().users.byId;
    const shouldUseSearchResults = Boolean(searchQuery);
    const listedIds = !shouldUseSearchResults
      ? memberIds
      : filterUsersByName(memberIds, usersById, searchQuery);

    return sortChatIds(
      unique([
        ...listedIds,
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
          memberIds.includes(userId) &&
          userId !== currentUserId &&
          (!user ||
            !isUserBot(user) ||
            (!isChannel && user.canBeInvitedToGroup))
        );
      }),
      chatsById
    );
  }, [memberIds, searchQuery]);

  const [viewportIds, getMore] = useInfiniteScroll(
    undefined,
    displayedIds,
    Boolean(searchQuery)
  );

  const whithContactIds = isChannel
    ? viewportIds
    : viewportIds?.filter((id) => contactIds?.includes(id));
  const otherIds = viewportIds?.filter((id) => !contactIds?.includes(id));

  const handleMemberClick = useCallback(
    (id: string) => {
      if (noAdmins) {
        onChatMemberSelect!(id, true);
        onScreenSelect!(ManagementScreens.ChatNewAdminRights);
      } else {
        closeManagement();
        openChat({ id });
      }
    },
    [closeManagement, noAdmins, onChatMemberSelect, onScreenSelect, openChat]
  );

  const handleAdminPromote = useLastCallback((id: string) => {
    onChatMemberSelect!(id, true);
    onScreenSelect!(ManagementScreens.ChatNewAdminRights);
  });

  const handleNewMemberDialogOpen = useCallback(() => {
    onScreenSelect!(ManagementScreens.AddMembers);
  }, [setNewChatMembersDialogState]);

  const handleClickInvites = useCallback(() => {
    onScreenSelect!(ManagementScreens.Invites);
  }, [onScreenSelect]);

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUserSearchQuery({ query: e.target.value });
      setContactsFilter(e.target.value);
    },
    [setUserSearchQuery]
  );
  const handleKeyDown = useKeyboardListNavigation(
    containerRef,
    isActive,
    (index) => {
      if (viewportIds && viewportIds.length > 0) {
        handleMemberClick(viewportIds[index === -1 ? 0 : index]);
      }
    },
    '.ListItem-button',
    true
  );

  const handleDeleteMembersModalClose = useCallback(() => {
    setDeletingUserId(undefined);
  }, []);

  const handleToggleParticipantsHidden = useCallback(() => {
    toggleParticipantsHidden({ chatId, isEnabled: !areParticipantsHidden });
  }, [areParticipantsHidden, chatId, toggleParticipantsHidden]);

  useHistoryBack({
    isActive,
    onBack: onClose,
  });

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

      {canHideParticipants && (
        <div className='section'>
          <ListItem
            icon='group'
            ripple
            onClick={handleToggleParticipantsHidden}
          >
            <span>{t('ChannelHideMembers')}</span>
            <Switcher
              label={t('ChannelHideMembers')}
              checked={areParticipantsHidden}
            />
          </ListItem>
          <p className='section-info'>
            {t(
              areParticipantsHidden
                ? 'GroupMembers.MembersHiddenOn'
                : 'GroupMembers.MembersHiddenOff'
            )}
          </p>
        </div>
      )}

      {!noAdmins && !isCourse && !isSubscription && (
        <div className='section'>
          <ListItem
            buttonClassName='is_link'
            className='underline'
            leftElement={
              <i className='icon-svg mr-4'>
                <IconSvg name='user-plus' />
              </i>
            }
            onClick={handleNewMemberDialogOpen}
          >
            {t(isChannel ? 'Channel.AddSubscribers' : 'Group.AddMembers')}
          </ListItem>
          <ListItem
            buttonClassName='is_link'
            className='underline'
            leftElement={
              <i className='icon-svg mr-4'>
                <IconSvg name='link' />
              </i>
            }
            onClick={handleClickInvites}
          >
            {t('Link.InviteVia')}
          </ListItem>
        </div>
      )}
      <div className='custom-scroll full-height'>
        {!isSearching && viewportIds && !viewportIds.length && (
          <NothingFound
            teactOrderKey={0}
            key='nothing-found'
            text={isChannel ? 'Try a new search' : 'No members found'}
          />
        )}

        {whithContactIds?.length ? (
          <>
            {!isChannel && (
              <p className='section-info'>
                {t(
                  isChannel ? 'Channel.ContactsInThis' : 'Group.ContactsGroup'
                )}
              </p>
            )}

            <div
              className={classNames('section members-list', {
                'is-group-members': !isChannel,
              })}
            >
              <InfiniteScroll
                className='picker-list'
                items={displayedIds}
                onLoadMore={getMore}
                noScrollRestore={Boolean(searchQuery)}
                elRef={containerRef}
                onKeyDown={handleKeyDown}
              >
                {whithContactIds.map((id) => (
                  <ListItem
                    key={id}
                    ripple
                    secondaryIcon={!noAdmins ? 'filled' : undefined}
                    className='chat-item-clickable scroll-item underline'
                    onClick={() => handleMemberClick(id)}
                    contextActions={
                      !noAdmins
                        ? [
                            {
                              title: t('Chat.PromoteToAdmin'),
                              icon: 'key',
                              handler: () => handleAdminPromote(id),
                            },
                            {
                              title: t(
                                isChannel
                                  ? 'Channel.RemoveFromChannel'
                                  : 'Group.CancelMember'
                              ),
                              icon: 'delete',
                              handler: () => setDeletingUserId(id),
                            },
                          ]
                        : undefined
                    }
                  >
                    <PrivateChatInfo userId={id} forceShowSelf />
                  </ListItem>
                ))}
              </InfiniteScroll>
            </div>
            {noAdmins ? (
              <p className='section-info'>
                {t('Channel.OnlyAdminDescription')}
              </p>
            ) : null}
          </>
        ) : (
          isSearching && <Loading />
        )}

        {!isChannel && otherIds?.length ? (
          <>
            {!isChannel && (
              <p className='section-info'>{t('Group.OtherMembers')}</p>
            )}

            <div
              className={classNames('section members-list', {
                'is-group-members': !isChannel,
              })}
            >
              <InfiniteScroll
                className='picker-list'
                items={displayedIds}
                onLoadMore={getMore}
                noScrollRestore={Boolean(searchQuery)}
                elRef={containerRef}
                onKeyDown={handleKeyDown}
              >
                {otherIds.map((id) => (
                  <ListItem
                    key={id}
                    ripple
                    secondaryIcon={!noAdmins ? 'filled' : undefined}
                    className='chat-item-clickable scroll-item underline'
                    onClick={() => handleMemberClick(id)}
                    contextActions={
                      !noAdmins
                        ? [
                            {
                              title: t('Chat.PromoteToAdmin'),
                              icon: 'key',
                              handler: () => handleAdminPromote(id),
                            },
                            {
                              title: t(
                                isChannel
                                  ? 'Channel.RemoveFromChannel'
                                  : 'Group.CancelMember'
                              ),
                              icon: 'delete',
                              handler: () => setDeletingUserId(id),
                            },
                          ]
                        : undefined
                    }
                  >
                    <PrivateChatInfo userId={id} forceShowSelf />
                  </ListItem>
                ))}
              </InfiniteScroll>
            </div>
            {noAdmins ? (
              <p className='section-info'>
                {t('Channel.OnlyAdminDescription')}
              </p>
            ) : null}
          </>
        ) : (
          isSearching && <Loading />
        )}
      </div>

      {canDeleteMembers && (
        <DeleteMemberModal
          isOpen={Boolean(deletingUserId)}
          userId={deletingUserId}
          onClose={handleDeleteMembersModalClose}
          isChannel={isChannel}
        />
      )}
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId }): StateProps => {
    const chat = selectChat(global, chatId);
    const { statusesById: userStatusesById } = global.users;
    const { byId: chatsById } = global.chats;
    const members = chat?.fullInfo?.members;
    const adminMembersById = chat?.fullInfo?.adminMembersById;
    const isChannel = chat && isChatChannel(chat);
    const { userIds: contactIds } = global.contactList || {};
    const hiddenMembersMinCount = global.appConfig?.hiddenMembersMinCount;

    const canDeleteMembers =
      chat && (chat.isCreator || getHasAdminRight(chat, 'banUsers'));

    const canHideParticipants =
      canDeleteMembers &&
      !isChatBasicGroup(chat) &&
      chat.membersCount !== undefined &&
      hiddenMembersMinCount !== undefined &&
      chat.membersCount >= hiddenMembersMinCount;

    const {
      query: searchQuery,
      fetchingStatus,
      globalUserIds,
      localUserIds,
    } = selectTabState(global).userSearch;

    const isSubscription = chat && isChatSubscription(chat);
    const isCourse = chat && isChatCourse(chat);

    return {
      areParticipantsHidden: Boolean(
        chat && chat.fullInfo?.areParticipantsHidden
      ),
      members,
      adminMembersById,
      userStatusesById,
      isChannel,
      contactIds,
      searchQuery,
      isSearching: fetchingStatus,
      globalUserIds,
      localUserIds,
      canDeleteMembers,
      currentUserId: global.currentUserId,
      canHideParticipants,
      isCourse,
      isSubscription,
      chatsById,
    };
  })(ManageGroupMembers)
);
