import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { getActions, withGlobal } from '../../global';

import type { ApiChat, ApiExportedInvite } from '../../api/types';
import {
  CreateSaleScreen,
  ManagementScreens,
  ProfileState,
  ThreadId,
} from '../../types';
import { MAIN_THREAD_ID } from '../../api/types';

import { ANIMATION_END_DELAY } from '../../config';
import { debounce } from '../../util/schedulers';

import {
  selectChat,
  selectCurrentGifSearch,
  selectCurrentStickerSearch,
  selectTabState,
  selectCurrentTextSearch,
  selectIsChatWithSelf,
  selectUser,
} from '../../global/selectors';
import {
  getCanAddContact,
  getCanManageTopic,
  isChatAdmin,
  isChatChannel,
  isChatGroup,
  isUserBot,
  isUserId,
} from '../../global/helpers';
import { getDayStartAt } from '../../util/dateFormat';
import useCurrentOrPrev from '../../hooks/useCurrentOrPrev';
import useFlag from '../../hooks/useFlag';
import useAppLayout from '../../hooks/useAppLayout';

import SearchInput from '../ui/SearchInput';
import Button from '../ui/Button';
import Transition from '../ui/Transition';
import ConfirmDialog from '../ui/ConfirmDialog';

import './RightHeader.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import IconSvg from '../ui/IconSvg';
import DropdownMenu from '../ui/DropdownMenu';
import MenuItem from '../ui/MenuItem';
import DeleteChatModal from '../common/DeleteChatModal';
import useLastCallback from '../../hooks/useLastCallback';
import ReportModal from '../common/ReportModal';

type OwnProps = {
  chatId?: string;
  threadId?: ThreadId;
  isColumnOpen?: boolean;
  isProfile?: boolean;
  isSearch?: boolean;
  isManagement?: boolean;
  isStatistics?: boolean;
  isMessageStatistics?: boolean;
  isStickerSearch?: boolean;
  isGifSearch?: boolean;
  isPollResults?: boolean;
  isCreatingTopic?: boolean;
  isEditingTopic?: boolean;
  isCertificate?: boolean;
  isCreateSale?: boolean;
  isAddingChatMembers?: boolean;
  profileState?: ProfileState;
  managementScreen?: ManagementScreens;
  saleScreen?: CreateSaleScreen;
  onClose: () => void;
  onScreenSelect: (screen: ManagementScreens) => void;
};

type StateProps = {
  chat?: ApiChat;
  canAddContact?: boolean;
  canManage?: boolean;
  canViewStatistics?: boolean;
  canReportChat?: boolean;
  isChannel?: boolean;
  userId?: string;
  messageSearchQuery?: string;
  stickerSearchQuery?: string;
  gifSearchQuery?: string;
  isEditingInvite?: boolean;
  currentInviteInfo?: ApiExportedInvite;
  shouldSkipHistoryAnimations?: boolean;
  isBot?: boolean;
  isInsideTopic?: boolean;
  canEditTopic?: boolean;
  currentUserId?: string;
  inviteLink?: string;
};

const COLUMN_ANIMATION_DURATION = 450 + ANIMATION_END_DELAY;
const runDebouncedForSearch = debounce((cb) => cb(), 200, false);

enum HeaderContent {
  Profile,
  MemberList,
  SharedMedia,
  Search,
  Statistics,
  MessageStatistics,
  Management,
  ManageInitial,
  ManageChannelSubscribers,
  ManageChatAdministrators,
  ManageChatPrivacyType,
  ManageDiscussion,
  ManageGroupPermissions,
  ManageGroupRemovedUsers,
  ManageChannelRemovedUsers,
  ManageGroupUserPermissionsCreate,
  ManageGroupUserPermissions,
  ManageGroupRecentActions,
  ManageGroupAdminRights,
  ManageGroupNewAdminRights,
  ManageGroupMembers,
  ManageGroupAddAdmins,
  StickerSearch,
  GifSearch,
  PollResults,
  AddingMembers,
  ManageInvites,
  ManageEditInvite,
  ManageReactions,
  ManageInviteInfo,
  ManageJoinRequests,
  CreateTopic,
  EditTopic,
  Certificate,
  CreateSale,
  ScheduleSale,
  NewGroup,
  ChatHistory,
  MembersSearch,
}

const RightHeader: FC<OwnProps & StateProps> = ({
  chatId,
  chat,
  threadId,
  isColumnOpen,
  isProfile,
  isSearch,
  isManagement,
  isStatistics,
  isMessageStatistics,
  isStickerSearch,
  isGifSearch,
  isPollResults,
  isCreatingTopic,
  isEditingTopic,
  isAddingChatMembers,
  profileState,
  managementScreen,
  saleScreen,
  canAddContact,
  canReportChat,
  userId,
  canManage,
  isChannel,
  isCertificate,
  isCreateSale,
  onClose,
  onScreenSelect,
  messageSearchQuery,
  stickerSearchQuery,
  gifSearchQuery,
  isEditingInvite,
  canViewStatistics,
  currentInviteInfo,
  shouldSkipHistoryAnimations,
  isBot,
  isInsideTopic,
  canEditTopic,
  currentUserId,
  inviteLink,
}) => {
  const {
    setLocalTextSearchQuery,
    setStickerSearchQuery,
    setGifSearchQuery,
    searchTextMessagesLocal,
    toggleManagement,
    openHistoryCalendar,
    openAddContactDialog,
    toggleStatistics,
    setEditingExportedInvite,
    deleteExportedChatInvite,
    openEditTopicPanel,
    openForwardMenu,
  } = getActions();

  const [isDeleteDialogOpen, openDeleteDialog, closeDeleteDialog] = useFlag();
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useFlag();
  const { isMobile } = useAppLayout();
  const [isReportModalOpen, openReportModal, closeReportModal] = useFlag();

  const handleEditInviteClick = useCallback(() => {
    setEditingExportedInvite({ chatId: chatId!, invite: currentInviteInfo! });
    onScreenSelect(ManagementScreens.EditInvite);
  }, [chatId, currentInviteInfo, onScreenSelect, setEditingExportedInvite]);

  const handleDeleteInviteClick = useCallback(() => {
    deleteExportedChatInvite({
      chatId: chatId!,
      link: currentInviteInfo!.link,
    });
    onScreenSelect(ManagementScreens.Invites);
    closeDeleteDialog();
  }, [
    chatId,
    closeDeleteDialog,
    currentInviteInfo,
    deleteExportedChatInvite,
    onScreenSelect,
  ]);

  const handleMessageSearchQueryChange = useLastCallback((query: string) => {
    setLocalTextSearchQuery({ query });

    if (query.length) {
      runDebouncedForSearch(searchTextMessagesLocal);
    }
  });

  const handleStickerSearchQueryChange = useCallback(
    (query: string) => {
      setStickerSearchQuery({ query });
    },
    [setStickerSearchQuery]
  );

  const handleGifSearchQueryChange = useCallback(
    (query: string) => {
      setGifSearchQuery({ query });
    },
    [setGifSearchQuery]
  );

  const handleAddContact = useCallback(() => {
    openAddContactDialog({ userId });
  }, [openAddContactDialog, userId]);

  const toggleEditTopic = useCallback(() => {
    if (!chatId || !threadId) return;
    openEditTopicPanel({ chatId, topicId: Number(threadId) });
  }, [chatId, openEditTopicPanel, threadId]);

  const handleToggleManagement = useCallback(() => {
    toggleManagement();
  }, [toggleManagement]);

  const handleToggleStatistics = useCallback(() => {
    toggleStatistics();
  }, [toggleStatistics]);

  const handleClickSearchMembers = useLastCallback(() => {
    toggleManagement();
    onScreenSelect(ManagementScreens.MembersSearch);
  });

  const handleShareLink = useLastCallback(() => {
    openForwardMenu({
      fromChatId: currentUserId!,
      link: chat?.fullInfo?.inviteLink,
    });
  });

  const [shouldSkipTransition, setShouldSkipTransition] = useState(
    !isColumnOpen
  );

  useEffect(() => {
    setTimeout(() => {
      setShouldSkipTransition(!isColumnOpen);
    }, COLUMN_ANIMATION_DURATION);
  }, [isColumnOpen]);

  const { t } = useTranslation();
  const contentKey = isProfile
    ? profileState === ProfileState.Profile
      ? HeaderContent.Profile
      : profileState === ProfileState.SharedMedia
      ? HeaderContent.SharedMedia
      : profileState === ProfileState.MemberList
      ? HeaderContent.MemberList
      : -1 // Never reached
    : isSearch
    ? HeaderContent.Search
    : isPollResults
    ? HeaderContent.PollResults
    : isStickerSearch
    ? HeaderContent.StickerSearch
    : isGifSearch
    ? HeaderContent.GifSearch
    : isAddingChatMembers || managementScreen === ManagementScreens.AddMembers
    ? HeaderContent.AddingMembers
    : isManagement
    ? managementScreen === ManagementScreens.Initial
      ? HeaderContent.ManageInitial
      : managementScreen === ManagementScreens.ChatPrivacyType
      ? HeaderContent.ManageChatPrivacyType
      : managementScreen === ManagementScreens.Discussion
      ? HeaderContent.ManageDiscussion
      : managementScreen === ManagementScreens.ChannelSubscribers
      ? HeaderContent.ManageChannelSubscribers
      : managementScreen === ManagementScreens.GroupPermissions
      ? HeaderContent.ManageGroupPermissions
      : managementScreen === ManagementScreens.ChatAdministrators
      ? HeaderContent.ManageChatAdministrators
      : managementScreen === ManagementScreens.GroupRemovedUsers
      ? HeaderContent.ManageGroupRemovedUsers
      : managementScreen === ManagementScreens.ChannelRemovedUsers
      ? HeaderContent.ManageChannelRemovedUsers
      : managementScreen === ManagementScreens.GroupUserPermissionsCreate
      ? HeaderContent.ManageGroupUserPermissionsCreate
      : managementScreen === ManagementScreens.GroupUserPermissions
      ? HeaderContent.ManageGroupUserPermissions
      : managementScreen === ManagementScreens.GroupRecentActions
      ? HeaderContent.ManageGroupRecentActions
      : managementScreen === ManagementScreens.ChatAdminRights
      ? HeaderContent.ManageGroupAdminRights
      : managementScreen === ManagementScreens.ChatNewAdminRights
      ? HeaderContent.ManageGroupNewAdminRights
      : managementScreen === ManagementScreens.GroupMembers
      ? HeaderContent.ManageGroupMembers
      : managementScreen === ManagementScreens.Invites
      ? HeaderContent.ManageInvites
      : managementScreen === ManagementScreens.EditInvite
      ? HeaderContent.ManageEditInvite
      : managementScreen === ManagementScreens.GroupAddAdmins
      ? HeaderContent.ManageGroupAddAdmins
      : managementScreen === ManagementScreens.Reactions
      ? HeaderContent.ManageReactions
      : managementScreen === ManagementScreens.InviteInfo
      ? HeaderContent.ManageInviteInfo
      : managementScreen === ManagementScreens.JoinRequests
      ? HeaderContent.ManageJoinRequests
      : managementScreen === ManagementScreens.NewGroup
      ? HeaderContent.NewGroup
      : managementScreen === ManagementScreens.ChatHistory
      ? HeaderContent.ChatHistory
      : managementScreen === ManagementScreens.MembersSearch
      ? HeaderContent.MembersSearch
      : undefined // Never reached
    : isStatistics
    ? HeaderContent.Statistics
    : isMessageStatistics
    ? HeaderContent.MessageStatistics
    : isCreatingTopic
    ? HeaderContent.CreateTopic
    : isEditingTopic
    ? HeaderContent.EditTopic
    : isCertificate
    ? HeaderContent.Certificate
    : isCreateSale
    ? saleScreen === CreateSaleScreen.Initial
      ? HeaderContent.CreateSale
      : HeaderContent.ScheduleSale
    : undefined; // When column is closed

  const renderingContentKey = useCurrentOrPrev(contentKey, true) ?? -1;

  function getHeaderTitle() {
    if (isInsideTopic) {
      return t('AccDescrTopic');
    }

    if (isChannel) {
      return t('Channel.TitleInfo');
    }

    if (userId) {
      return t(isBot ? 'UserInfo.BotInfo' : 'UserInfo.Title');
    }

    return t('GroupInfo.Title');
  }

  function renderHeaderContent() {
    if (renderingContentKey === -1) {
      return undefined;
    }

    switch (renderingContentKey) {
      case HeaderContent.PollResults:
        return <h3>{t('PollResults')}</h3>;
      case HeaderContent.Search:
        return (
          <>
            <SearchInput
              parentContainerClassName='RightSearch'
              value={messageSearchQuery}
              onChange={handleMessageSearchQueryChange}
            />
            <Button
              round
              size='smaller'
              color='translucent'
              onClick={() =>
                openHistoryCalendar({ selectedAt: getDayStartAt(Date.now()) })
              }
              ariaLabel='Search messages by date'
            >
              <i className='icon-svg'>
                <IconSvg name='calendar' />
              </i>
            </Button>
          </>
        );
      case HeaderContent.AddingMembers:
        return (
          <h4>
            {t(isChannel ? 'Channel.AddSubscribers' : 'Group.AddMembers')}
          </h4>
        );
      case HeaderContent.ManageInitial:
        return <h4>{t('Edit')}</h4>;
      case HeaderContent.ManageChatPrivacyType:
        return <h4>{t(isChannel ? 'Channel.Type' : 'Group.Type')}</h4>;
      case HeaderContent.ManageDiscussion:
        return <h4>{t('Channel.Discussion')}</h4>;
      case HeaderContent.ManageChatAdministrators:
        return <h4>{t('Administrators')}</h4>;
      case HeaderContent.ManageGroupRecentActions:
        return <h3>{t('Group.Info.AdminLog')}</h3>;
      case HeaderContent.ManageGroupAdminRights:
        return <h4>{t('Group.EditAdminRights')}</h4>;
      case HeaderContent.ManageGroupNewAdminRights:
        return <h4>{t('Group.AdminRights')}</h4>;
      case HeaderContent.ManageGroupPermissions:
        return <h4>{t('Permissions')}</h4>;
      case HeaderContent.ManageGroupRemovedUsers:
        return <h3>{t('BlockedUsers')}</h3>;
      case HeaderContent.ManageChannelRemovedUsers:
        return <h4>{t('Channel.RemovedUsers')}</h4>;
      case HeaderContent.ManageGroupUserPermissionsCreate:
        return <h3>{t('ChannelAddException')}</h3>;
      case HeaderContent.ManageGroupUserPermissions:
        return <h3>{t('UserRestrictions')}</h3>;
      case HeaderContent.ManageInvites:
        return <h4>{t('Link.Invite')}</h4>;
      case HeaderContent.ManageEditInvite:
        return <h4>{isEditingInvite ? t('Link.Edit') : t('Link.New')}</h4>;
      case HeaderContent.ManageInviteInfo:
        return (
          <>
            <h3>{t('InviteLink')}</h3>
            <section className='tools'>
              {currentInviteInfo && !currentInviteInfo.isRevoked && (
                <Button
                  round
                  color='translucent'
                  size='smaller'
                  ariaLabel={String(t('Edit'))}
                  onClick={handleEditInviteClick}
                >
                  <i className='icon-edit' />
                </Button>
              )}
              {currentInviteInfo && currentInviteInfo.isRevoked && (
                <>
                  <Button
                    round
                    color='danger'
                    size='smaller'
                    ariaLabel={String(t('Delete'))}
                    onClick={openDeleteDialog}
                  >
                    <i className='icon-delete' />
                  </Button>
                  <ConfirmDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={closeDeleteDialog}
                    title={String(t('DeleteLink'))}
                    text={String(t('DeleteLinkHelp'))}
                    confirmIsDestructive
                    confirmLabel={String(t('Delete'))}
                    confirmHandler={handleDeleteInviteClick}
                  />
                </>
              )}
            </section>
          </>
        );
      case HeaderContent.ManageJoinRequests:
        return (
          <h3>{isChannel ? t('SubscribeRequests') : t('MemberRequests')}</h3>
        );
      case HeaderContent.ManageGroupAddAdmins:
        return <h4>{t('Group.AddAdmin')}</h4>;
      case HeaderContent.StickerSearch:
        return (
          <SearchInput
            value={stickerSearchQuery}
            placeholder={String(t('SearchStickersHint'))}
            autoFocusSearch
            onChange={handleStickerSearchQueryChange}
          />
        );
      case HeaderContent.GifSearch:
        return (
          <SearchInput
            value={gifSearchQuery}
            placeholder={String(t('SearchGifsTitle'))}
            autoFocusSearch
            onChange={handleGifSearchQueryChange}
          />
        );
      case HeaderContent.Statistics:
        return (
          <h3>{t(isChannel ? 'ChannelStats.Title' : 'GroupStats.Title')}</h3>
        );
      case HeaderContent.MessageStatistics:
        return <h3>{t('Stats.MessageTitle')}</h3>;
      case HeaderContent.SharedMedia:
        return <h4>{t('Shared.Media')}</h4>;
      case HeaderContent.ManageChannelSubscribers:
        return <h4>{t('Subscribers')}</h4>;
      case HeaderContent.MemberList:
      case HeaderContent.ManageGroupMembers:
        return <h4>{t('Group.Members')}</h4>;
      case HeaderContent.ManageReactions:
        return <h4>{t('Reactions.Title')}</h4>;
      case HeaderContent.CreateTopic:
        return <h3>{t('NewTopic')}</h3>;
      case HeaderContent.EditTopic:
        return <h3>{t('EditTopic')}</h3>;
      case HeaderContent.Certificate:
        return <h4>{t('CertificateAuthenticity')}</h4>;
      case HeaderContent.CreateSale:
        return <h4>{t('CreateSale')}</h4>;
      case HeaderContent.ScheduleSale:
        return <h4>{t('Sale.Schedule')}</h4>;
      case HeaderContent.NewGroup:
        return <h4>{t('Group.New')}</h4>;
      case HeaderContent.ChatHistory:
        return <h4>{t('Chat.History')}</h4>;
      case HeaderContent.MembersSearch:
        return <h4>{t('SearchMembers')}</h4>;
      default:
        return (
          <>
            <h4>{getHeaderTitle()}</h4>
            <section className='tools'>
              {canAddContact && (
                <Button
                  round
                  color='translucent'
                  size='smaller'
                  ariaLabel={String(t('AddContact'))}
                  onClick={handleAddContact}
                >
                  <i className='icon-svg'>
                    <IconSvg name='user-plus' />
                  </i>
                </Button>
              )}
              {canManage && !isInsideTopic && !isBot && (
                <Button
                  round
                  color='translucent'
                  size='smaller'
                  ariaLabel={String(t('Edit'))}
                  onClick={handleToggleManagement}
                >
                  <i className='icon-svg'>
                    <IconSvg name='edit' />
                  </i>
                </Button>
              )}
              {canEditTopic && (
                <Button
                  round
                  color='translucent'
                  size='smaller'
                  ariaLabel={String(t('EditTopic'))}
                  onClick={toggleEditTopic}
                >
                  <i className='icon-edit' />
                </Button>
              )}
              {/* {canViewStatistics && (
                <Button
                  round
                  color='translucent'
                  size='smaller'
                  ariaLabel={String(t('Statistics'))}
                  onClick={handleToggleStatistics}
                >
                  <i className='icon-stats' />
                </Button>
              )} */}
              {!canManage && !canAddContact && (
                <DropdownMenu
                  className='archived-chats-more-menu'
                  positionX='right'
                >
                  {isChannel ? (
                    <>
                      {inviteLink && (
                        <MenuItem
                          customIcon={<IconSvg name='share' />}
                          onClick={handleShareLink}
                        >
                          {t('Share')}
                        </MenuItem>
                      )}
                      <MenuItem
                        customIcon={<IconSvg name='error' />}
                        onClick={openReportModal}
                      >
                        {t('ReportPeer.Report')}
                      </MenuItem>
                    </>
                  ) : (
                    <MenuItem
                      customIcon={<IconSvg name='search' />}
                      onClick={handleClickSearchMembers}
                    >
                      {t('SearchMembers')}
                    </MenuItem>
                  )}

                  <MenuItem
                    customIcon={<IconSvg name='logout' />}
                    onClick={openDeleteModal}
                  >
                    {t(isChannel ? 'Channel.Leave' : 'GroupInfo.DeleteAndExit')}
                  </MenuItem>
                </DropdownMenu>
              )}
            </section>
          </>
        );
    }
  }

  const isBackButton =
    isMobile ||
    contentKey === HeaderContent.SharedMedia ||
    contentKey === HeaderContent.MemberList ||
    contentKey === HeaderContent.AddingMembers ||
    contentKey === HeaderContent.MessageStatistics ||
    contentKey === HeaderContent.ScheduleSale ||
    isManagement;

  const buttonClassName = classNames('animated-close-icon', {
    'state-back': isBackButton,
    'no-transition': shouldSkipTransition || shouldSkipHistoryAnimations,
  });

  return (
    <div className='RightHeader'>
      <Button
        className='close-button'
        round
        color='translucent'
        size='smaller'
        onClick={onClose}
        ariaLabel={String(isBackButton ? t('Back') : t('Close'))}
      >
        <div className='icon-svg'>
          <IconSvg name={isBackButton ? 'arrow-left' : 'close'} />
        </div>
      </Button>
      <Transition
        name={
          shouldSkipTransition || shouldSkipHistoryAnimations
            ? 'none'
            : 'slide-fade'
        }
        activeKey={renderingContentKey}
      >
        {renderHeaderContent()}
      </Transition>
      {chat && (
        <DeleteChatModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          chat={chat}
        />
      )}
      {canReportChat && chat?.id && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={closeReportModal}
          subject='peer'
          chatId={chat.id}
        />
      )}
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>(
    (global, { chatId, isProfile, isManagement, threadId }): StateProps => {
      const tabState = selectTabState(global);
      const { query: messageSearchQuery } =
        selectCurrentTextSearch(global) || {};
      const { query: stickerSearchQuery } =
        selectCurrentStickerSearch(global) || {};
      const { query: gifSearchQuery } = selectCurrentGifSearch(global) || {};
      const chat = chatId ? selectChat(global, chatId) : undefined;
      const user =
        isProfile && chatId && isUserId(chatId)
          ? selectUser(global, chatId)
          : undefined;
      const isChannel = chat && isChatChannel(chat);
      const isInsideTopic =
        chat?.isForum && Boolean(threadId && threadId !== MAIN_THREAD_ID);
      const topic = isInsideTopic ? chat.topics?.[threadId!] : undefined;
      const canEditTopic =
        isInsideTopic && topic && getCanManageTopic(chat, topic);
      const isBot = user && isUserBot(user);
      const isMainThread = threadId === MAIN_THREAD_ID;
      const canReportChat =
        isMainThread &&
        chat &&
        (isChatChannel(chat) || isChatGroup(chat) || (user && !user.isSelf));

      const canAddContact = user && getCanAddContact(user);
      const canManage = Boolean(
        !isManagement &&
          isProfile &&
          !canAddContact &&
          chat &&
          !selectIsChatWithSelf(global, chat.id) &&
          // chat.isCreator is for Basic Groups
          (isUserId(chat.id) ||
            ((isChatAdmin(chat) || chat.isCreator) && !chat.isNotJoined))
      );
      const isEditingInvite = Boolean(
        chatId && tabState.management.byChatId[chatId]?.editingInvite
      );
      const canViewStatistics =
        !isInsideTopic && chat?.fullInfo?.canViewStatistics;
      const currentInviteInfo = chatId
        ? tabState.management.byChatId[chatId]?.inviteInfo?.invite
        : undefined;

      return {
        canManage,
        chat,
        canAddContact,
        canViewStatistics,
        isChannel,
        canReportChat,
        isBot,
        isInsideTopic,
        canEditTopic,
        userId: user?.id,
        messageSearchQuery,
        stickerSearchQuery,
        gifSearchQuery,
        isEditingInvite,
        currentInviteInfo,
        currentUserId: global.currentUserId,
        shouldSkipHistoryAnimations: tabState.shouldSkipHistoryAnimations,
        inviteLink: chat?.fullInfo?.inviteLink,
      };
    }
  )(RightHeader)
);
