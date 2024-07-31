import React, { FC, memo, useCallback, useMemo, useState } from 'react';
import { getActions, getGlobal, withGlobal } from '../../../global';

import { ManagementScreens } from '../../../types';
import type { ApiChat, ApiChatMember } from '../../../api/types';

import { getUserFullName, isChatChannel } from '../../../global/helpers';
import { selectChat } from '../../../global/selectors';
import useHistoryBack from '../../../hooks/useHistoryBack';

import ListItem from '../../ui/ListItem';
import PrivateChatInfo from '../../common/PrivateChatInfo';
import { useTranslation } from 'react-i18next';
import IconSvg from '../../ui/IconSvg';
import useFlag from '../../../hooks/useFlag';
import ConfirmDialog from '../../ui/ConfirmDialog';
import useLastCallback from '../../../hooks/useLastCallback';

type OwnProps = {
  chatId: string;
  onScreenSelect: (screen: ManagementScreens) => void;
  onChatMemberSelect: (
    memberId: string,
    isPromotedByCurrentUser?: boolean
  ) => void;
  onClose: NoneToVoidFunction;
  isActive: boolean;
};

type StateProps = {
  chat: ApiChat;
  currentUserId?: string;
  isChannel: boolean;
};

const ManageChatAdministrators: FC<OwnProps & StateProps> = ({
  chat,
  isChannel,
  currentUserId,
  onScreenSelect,
  onChatMemberSelect,
  onClose,
  isActive,
}) => {
  const { updateChatAdmin } = getActions();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';
  const [
    isDismissConfirmationDialogOpen,
    openDismissConfirmationDialog,
    closeDismissConfirmationDialog,
  ] = useFlag();
  const [deletingAdminId, setDeletingAdminId] = useState<string | undefined>();

  useHistoryBack({
    isActive,
    onBack: onClose,
  });

  const handleRecentActionsClick = useCallback(() => {
    onScreenSelect(ManagementScreens.GroupRecentActions);
  }, [onScreenSelect]);

  const handleDemote = useCallback((memberId: string) => {
    setDeletingAdminId(memberId);
    openDismissConfirmationDialog();
  }, []);

  const canAddNewAdmins = Boolean(
    chat.isCreator || chat.adminRights?.addAdmins
  );

  const adminMembers = useMemo(() => {
    if (!chat.fullInfo?.adminMembersById) {
      return [];
    }

    return Object.values(chat.fullInfo.adminMembersById).sort((a, b) => {
      if (a.isOwner) {
        return -1;
      } else if (b.isOwner) {
        return 1;
      }
      return 0;
    });
  }, [chat]);

  const handleAdminMemberClick = useCallback(
    (member: ApiChatMember) => {
      onChatMemberSelect(
        member.userId,
        member.promotedByUserId === currentUserId
      );
      onScreenSelect(ManagementScreens.ChatAdminRights);
    },
    [currentUserId, onChatMemberSelect, onScreenSelect]
  );

  const handleAddAdminClick = useCallback(() => {
    onScreenSelect(ManagementScreens.GroupAddAdmins);
  }, [onScreenSelect]);

  const getMemberStatus = useCallback((member: ApiChatMember) => {
    if (member.isOwner) {
      return t('Channel.Creator');
    }

    // No need for expensive global updates on users, so we avoid them
    const usersById = getGlobal().users.byId;
    const promotedByUser = member.promotedByUserId
      ? usersById[member.promotedByUserId]
      : undefined;

    if (promotedByUser) {
      return t('Chat.EditAdminPromotedBy', {
        promouted: getUserFullName(promotedByUser),
      });
    }

    return t('Channel.Admin');
  }, []);

  const handleDismissAdmin = useLastCallback(() => {
    if (!deletingAdminId) {
      return;
    }

    updateChatAdmin({
      chatId: chat.id,
      userId: deletingAdminId,
      adminRights: {},
    });
    closeDismissConfirmationDialog();
    setDeletingAdminId(undefined);
  });

  const handleCloseDismiss = useLastCallback(() => {
    closeDismissConfirmationDialog();
    setDeletingAdminId(undefined);
  });

  const prepareContextActions = (member: ApiChatMember) => {
    const actions: Array<{ title: string; icon: string; handler: () => void }> =
      [];

    actions.push({
      title: t('Group.EditAdminRights'),
      icon: 'admin',
      handler: () => handleAdminMemberClick(member),
    });

    actions.push({
      title: t('Demote'),
      icon: 'minus-outline',
      handler: () => handleDemote(member.userId),
    });

    return actions;
  };

  return (
    <div className='Management'>
      <div className='custom-scroll'>
        <div className='section members-list'>
          {canAddNewAdmins && (
            <ListItem
              buttonClassName='is_link'
              className='underline'
              leftElement={
                <i className='icon-svg mr-4'>
                  <IconSvg name='admin' />
                </i>
              }
              onClick={handleAddAdminClick}
            >
              {t('Group.AddAdmin')}
            </ListItem>
          )}

          {adminMembers.map((member) => (
            <ListItem
              secondaryIcon={!member.isOwner ? 'filled' : undefined}
              key={member.userId}
              className='chat-item-clickable underline'
              contextActions={
                !member.isOwner ? prepareContextActions(member) : undefined
              }
            >
              <div role='button' className='info'>
                <PrivateChatInfo
                  userId={member.userId}
                  status={getMemberStatus(member)}
                  forceShowSelf
                />
              </div>
            </ListItem>
          ))}

          {/* <ListItem icon='recent' multiline onClick={handleRecentActionsClick}>
            <span className='title'>{t('EventLog')}</span>
            <span className='subtitle'>
              {t(
                isChannel ? 'EventLogInfoDetailChannel' : 'EventLogInfoDetail'
              )}
            </span>
          </ListItem> */}
        </div>

        <p className='section-info' dir='auto'>
          {t(isChannel ? 'Channel.AddAdminHelp' : 'Group.AddAdminHelp')}
        </p>
        {deletingAdminId && (
          <ConfirmDialog
            isOpen={isDismissConfirmationDialogOpen}
            onClose={handleCloseDismiss}
            text='Are you sure you want to dismiss this admin?'
            confirmLabel={String(t('Group.AdminDismiss'))}
            confirmHandler={handleDismissAdmin}
            confirmIsDestructive
          />
        )}
      </div>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId }): StateProps => {
    const chat = selectChat(global, chatId)!;

    return {
      chat,
      currentUserId: global.currentUserId,
      isChannel: isChatChannel(chat)!,
    };
  })(ManageChatAdministrators)
);
