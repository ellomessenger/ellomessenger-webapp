import React, { FC, memo, useCallback, useMemo } from 'react';
import { getActions, withGlobal } from '../../../global';

import type { ApiChat, ApiUser, ApiUserStatus } from '../../../api/types';
import { getUserStatus } from '../../../global/helpers';

import { getMainUsername, isUserId } from '../../../global/helpers';
import useHistoryBack from '../../../hooks/useHistoryBack';
import useFlag from '../../../hooks/useFlag';

import ListItem from '../../ui/ListItem';
import Avatar from '../../common/Avatar';
import Loading from '../../ui/Loading';
import BlockUserModal from './BlockUserModal';
import FullNameTitle from '../../common/FullNameTitle';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import IconSvg from '../../ui/IconSvg';

type OwnProps = {
  isActive?: boolean;
  onReset: () => void;
};

type StateProps = {
  chatsByIds: Record<string, ApiChat>;
  usersByIds: Record<string, ApiUser>;
  blockedIds: string[];
  statusesById: Record<string, ApiUserStatus>;
};

const SettingsPrivacyBlockedUsers: FC<OwnProps & StateProps> = ({
  isActive,
  onReset,
  chatsByIds,
  usersByIds,
  blockedIds,
  statusesById,
}) => {
  const { unblockContact } = getActions();

  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';

  const [isBlockUserModalOpen, openBlockUserModal, closeBlockUserModal] =
    useFlag();
  const handleUnblockClick = useCallback(
    (contactId: string) => {
      unblockContact({ contactId });
    },
    [unblockContact]
  );

  useHistoryBack({
    isActive,
    onBack: onReset,
  });

  const blockedUsernamesById = useMemo(() => {
    return blockedIds.reduce((acc, contactId) => {
      const isPrivate = isUserId(contactId);
      const user = isPrivate ? usersByIds[contactId] : undefined;
      const mainUsername = user && !user.phoneNumber && getMainUsername(user);
      if (mainUsername) {
        acc[contactId] = mainUsername;
      }

      return acc;
    }, {} as Record<string, string>);
  }, [blockedIds, usersByIds]);

  function renderContact(contactId: string, i: number, viewportOffset: number) {
    const isPrivate = isUserId(contactId);
    const user = isPrivate ? usersByIds[contactId] : undefined;
    const chat = !isPrivate ? chatsByIds[contactId] : undefined;
    const userOrChat = user || chat;
    const userStatus = statusesById[contactId];

    const className = classNames(
      'chat-item-clickable blocked-list-item small-icon underline',
      isPrivate ? 'private' : 'group'
    );

    const userMainUsername = blockedUsernamesById[contactId];

    return (
      <ListItem
        key={contactId}
        className={className}
        ripple
        narrow
        secondaryIcon='filled'
        contextActions={[
          {
            title: 'Unblock',
            icon: 'unblock',
            handler: () => {
              handleUnblockClick(contactId);
            },
          },
        ]}
      >
        <Avatar size='medium' peer={user || chat} />
        <div className='contact-info' dir='auto'>
          {userOrChat && <FullNameTitle peer={userOrChat} />}
          {userMainUsername && (
            <span className='contact-username' dir='auto'>
              @{userMainUsername}
            </span>
          )}{' '}
          <span className='user-status' dir='auto'>
            {getUserStatus(t, user, userStatus)}
          </span>
        </div>
      </ListItem>
    );
  }

  return (
    <div className='settings-container'>
      <div className='settings-scroll-wrapper'>
        <ListItem
          buttonClassName='is_link'
          className='underline'
          leftElement={
            <i className='icon-svg mr-4'>
              <IconSvg name='user-plus' />
            </i>
          }
          onClick={openBlockUserModal}
        >
          {t('Settings.BlockUser')}
        </ListItem>
        <p
          className='settings-item-description mt-2 pl-4'
          dir={isRtl ? 'rtl' : undefined}
        >
          {t('Settings.BlockedUsersInfo')}
        </p>
        <div className='chat-list custom-scroll'>
          {blockedIds?.length ? (
            <div className='scroll-container'>
              {blockedIds!.map((contactId, i) =>
                renderContact(contactId, i, 0)
              )}
            </div>
          ) : blockedIds && !blockedIds.length ? (
            <div className='no-results' dir='auto'>
              {t('Settings.NoBlocked')}
            </div>
          ) : (
            <Loading key='loading' />
          )}
        </div>
      </div>

      <BlockUserModal
        isOpen={isBlockUserModalOpen}
        onClose={closeBlockUserModal}
      />
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    const {
      chats: { byId: chatsByIds },
      users: { byId: usersByIds, statusesById },
      blocked: { ids },
    } = global;

    return {
      chatsByIds,
      usersByIds,
      blockedIds: ids,
      statusesById,
    };
  })(SettingsPrivacyBlockedUsers)
);
