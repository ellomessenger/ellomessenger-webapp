import React, { FC, memo, useCallback, useMemo } from 'react';
import { getActions, withGlobal } from '../../../global';

import type { ApiChat, ApiChatMember, ApiUser } from '../../../api/types';

import { selectChat } from '../../../global/selectors';
import {
  getHasAdminRight,
  getUserFullName,
  isChatChannel,
} from '../../../global/helpers';
import useHistoryBack from '../../../hooks/useHistoryBack';
import useFlag from '../../../hooks/useFlag';

import PrivateChatInfo from '../../common/PrivateChatInfo';
import ListItem from '../../ui/ListItem';
import FloatingActionButton from '../../ui/FloatingActionButton';
import RemoveGroupUserModal from './RemoveGroupUserModal';
import { useTranslation } from 'react-i18next';
import IconSvg from '../../ui/IconSvg';
import NothingFound from '../../common/NothingFound';

type OwnProps = {
  chatId: string;
  onClose: NoneToVoidFunction;
  isActive: boolean;
};

type StateProps = {
  chat?: ApiChat;
  usersById: Record<string, ApiUser>;
  canDeleteMembers?: boolean;
  isChannel?: boolean;
};

const ManageChatRemovedUsers: FC<OwnProps & StateProps> = ({
  chat,
  usersById,
  canDeleteMembers,
  isChannel,
  onClose,
  isActive,
}) => {
  const { updateChatMemberBannedRights } = getActions();

  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';

  const [isRemoveUserModalOpen, openRemoveUserModal, closeRemoveUserModal] =
    useFlag();

  useHistoryBack({
    isActive,
    onBack: onClose,
  });

  const removedMembers = useMemo(() => {
    if (!chat || !chat.fullInfo || !chat.fullInfo.kickedMembers) {
      return [];
    }

    return chat.fullInfo.kickedMembers;
  }, [chat]);

  const getRemovedBy = useCallback(
    (member: ApiChatMember) => {
      if (!member.kickedByUserId) {
        return undefined;
      }

      const kickedByUser = usersById[member.kickedByUserId];
      if (!kickedByUser) {
        return undefined;
      }

      return t('UserRemovedBy', { name: getUserFullName(kickedByUser) });
    },
    [t, usersById]
  );

  const getContextActions = useCallback(
    (member: ApiChatMember) => {
      if (!chat) {
        return undefined;
      }

      return [
        {
          title: t(isChannel ? 'AddToChannel' : 'AddToGroup'),
          icon: 'user-plus',
          handler: () =>
            updateChatMemberBannedRights({
              chatId: chat.id,
              userId: member.userId,
              bannedRights: {},
            }),
        },
      ];
    },
    [t, chat, updateChatMemberBannedRights]
  );

  return (
    <div className='Management'>
      <div className='section'>
        {canDeleteMembers && (
          <ListItem
            buttonClassName='is_link'
            leftElement={
              <i className='icon-svg mr-4'>
                <IconSvg name='user-minus' />
              </i>
            }
            onClick={openRemoveUserModal}
          >
            {t('Channel.RemovedUsers')}
          </ListItem>
        )}
      </div>
      <p className='section-info'>
        {t(
          isChannel
            ? 'Channel.BlockedUsersDescription'
            : 'GroupInfo.BlockedUsersDescription'
        )}
      </p>
      {removedMembers.length ? (
        <div className='section custom-scroll'>
          {removedMembers.map((member) => (
            <ListItem
              key={member.userId}
              className='chat-item-clickable'
              ripple
              contextActions={getContextActions(member)}
            >
              <PrivateChatInfo
                userId={member.userId}
                status={getRemovedBy(member)}
                forceShowSelf
              />
            </ListItem>
          ))}
        </div>
      ) : (
        <NothingFound
          heading={t('NoRemovedUsersYet')}
          text={t('ClickOnRemoveUser')}
        />
      )}

      {chat && canDeleteMembers && (
        <RemoveGroupUserModal
          chat={chat}
          isOpen={isRemoveUserModalOpen}
          onClose={closeRemoveUserModal}
        />
      )}
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId }): StateProps => {
    const chat = selectChat(global, chatId);
    const { byId: usersById } = global.users;
    const canDeleteMembers =
      chat && (getHasAdminRight(chat, 'banUsers') || chat.isCreator);

    return {
      chat,
      usersById,
      canDeleteMembers,
      isChannel: chat && isChatChannel(chat),
    };
  })(ManageChatRemovedUsers)
);
