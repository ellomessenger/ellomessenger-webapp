import React, { FC, memo, useCallback, useMemo, useState } from 'react';
import { getActions, withGlobal } from '../../../global';

import { ManagementScreens } from '../../../types';
import type {
  ApiChat,
  ApiChatBannedRights,
  ApiChatMember,
} from '../../../api/types';

import stopEvent from '../../../util/stopEvent';
import { isChatPublic } from '../../../global/helpers';
import { selectChat } from '../../../global/selectors';
import useHistoryBack from '../../../hooks/useHistoryBack';
import useManagePermissions from '../hooks/useManagePermissions';

import ListItem from '../../ui/ListItem';
import Checkbox from '../../ui/Checkbox';
import FloatingActionButton from '../../ui/FloatingActionButton';
import Spinner from '../../ui/Spinner';
import PrivateChatInfo from '../../common/PrivateChatInfo';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Switcher from '../../ui/Switcher';
import IconSvg from '../../ui/IconSvg';

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
  chat?: ApiChat;
  currentUserId?: string;
  hasLinkedChat?: boolean;
};

const ITEM_HEIGHT = 24 + 32;
const BEFORE_ITEMS_COUNT = 2;
const ITEMS_COUNT = 9;

function getLangKeyForBannedRightKey(key: keyof ApiChatBannedRights) {
  switch (key) {
    case 'sendMessages':
      return 'UserRestrictionsNoSend';
    case 'sendMedia':
      return 'UserRestrictionsNoSendMedia';
    case 'sendStickers':
      return 'UserRestrictionsNoSendStickers';
    case 'embedLinks':
      return 'UserRestrictionsNoEmbedLinks';
    case 'sendPolls':
      return 'UserRestrictionsNoSendPolls';
    case 'changeInfo':
      return 'UserRestrictionsNoChangeInfo';
    case 'inviteUsers':
      return 'UserRestrictionsInviteUsers';
    case 'pinMessages':
      return 'UserRestrictionsPinMessages';
    case 'manageTopics':
      return 'GroupPermission.NoManageTopics';
    case 'sendPlain':
      return 'UserRestrictionsNoSendText';
    case 'sendDocs':
      return 'UserRestrictionsNoSendDocs';
    case 'sendRoundvideos':
      return 'UserRestrictionsNoSendRound';
    case 'sendVoices':
      return 'UserRestrictionsNoSendVoice';
    case 'sendAudios':
      return 'UserRestrictionsNoSendMusic';
    case 'sendVideos':
      return 'UserRestrictionsNoSendVideos';
    case 'sendPhotos':
      return 'UserRestrictionsNoSendPhotos';
    default:
      return undefined;
  }
}

const ManageGroupPermissions: FC<OwnProps & StateProps> = ({
  onScreenSelect,
  onChatMemberSelect,
  chat,
  currentUserId,
  hasLinkedChat,
  onClose,
  isActive,
}) => {
  const { updateChatDefaultBannedRights, showNotification } = getActions();

  const {
    permissions,
    havePermissionChanged,
    isLoading,
    handlePermissionChange,
    setIsLoading,
  } = useManagePermissions(chat?.defaultBannedRights);
  const { t } = useTranslation();
  const { isForum } = chat || {};
  const isPublic = useMemo(() => chat && isChatPublic(chat), [chat]);
  const shouldDisablePermissionForPublicGroup = hasLinkedChat || isPublic;

  useHistoryBack({
    isActive,
    onBack: onClose,
  });

  const handleRemovedUsersClick = useCallback(() => {
    onScreenSelect(ManagementScreens.GroupRemovedUsers);
  }, [onScreenSelect]);

  const handleAddExceptionClick = useCallback(() => {
    onScreenSelect(ManagementScreens.GroupUserPermissionsCreate);
  }, [onScreenSelect]);

  const handleExceptionMemberClick = useCallback(
    (member: ApiChatMember) => {
      onChatMemberSelect(
        member.userId,
        member.promotedByUserId === currentUserId
      );
      onScreenSelect(ManagementScreens.GroupUserPermissions);
    },
    [currentUserId, onChatMemberSelect, onScreenSelect]
  );

  const [isMediaDropdownOpen, setIsMediaDropdownOpen] = useState(false);
  const handleOpenMediaDropdown = useCallback(
    (e: React.MouseEvent) => {
      stopEvent(e);
      setIsMediaDropdownOpen(!isMediaDropdownOpen);
    },
    [isMediaDropdownOpen]
  );

  const handleDisabledClick = useCallback(() => {
    showNotification({
      message: t('Notification.RightsPermissionUnavailable'),
    });
  }, [showNotification]);

  const handleSavePermissions = useCallback(() => {
    if (!chat) {
      return;
    }

    setIsLoading(true);
    updateChatDefaultBannedRights({
      chatId: chat.id,
      bannedRights: permissions,
    });
  }, [chat, permissions, setIsLoading, updateChatDefaultBannedRights]);

  const removedUsersCount = useMemo(() => {
    if (!chat || !chat.fullInfo || !chat.fullInfo.kickedMembers) {
      return 0;
    }

    return chat.fullInfo.kickedMembers.length;
  }, [chat]);

  const exceptionMembers = useMemo(() => {
    if (!chat || !chat.fullInfo || !chat.fullInfo.members) {
      return [];
    }

    return chat.fullInfo.members.filter(({ bannedRights }) =>
      Boolean(bannedRights)
    );
  }, [chat]);

  const getMemberExceptions = useCallback(
    (member: ApiChatMember) => {
      const { bannedRights } = member;
      if (!bannedRights || !chat) {
        return undefined;
      }

      const { defaultBannedRights } = chat;

      return Object.keys(bannedRights).reduce((result, k) => {
        const key = k as keyof ApiChatBannedRights;
        if (
          !bannedRights[key] ||
          defaultBannedRights?.[key] ||
          key === 'sendInline' ||
          key === 'viewMessages' ||
          key === 'sendGames'
        ) {
          return result;
        }

        const langKey = getLangKeyForBannedRightKey(key);

        if (!langKey) {
          return result;
        }

        const translatedString = t(langKey);

        return `${result}${
          !result.length ? translatedString : `, ${translatedString}`
        }`;
      }, '');
    },
    [chat]
  );

  return (
    <div className='Management'>
      <div className='custom-scroll'>
        <div className='section permission-list'>
          <h4 className='section-heading' dir='auto'>
            {t('PermissionsHeader')}
          </h4>
          <div className='row row-not-wrap'>
            <span className='label'>{t('Restrictions.Send')}</span>
            <div className='switcher-wrap' role='button'>
              <Switcher
                name='sendPlain'
                label={t('Restrictions.Send')}
                color='reverse'
                checked={permissions && !permissions.sendMessages}
                onChange={handlePermissionChange}
              />
            </div>
          </div>
          <div className='row row-not-wrap'>
            <span className='label'>{t('Restrictions.SendMedia')}</span>
            <div className='switcher-wrap' role='button'>
              <Switcher
                name='sendMedia'
                label={t('Restrictions.SendMedia')}
                color='reverse'
                checked={!permissions.sendMedia}
                onChange={handlePermissionChange}
              />
            </div>
          </div>
          <div className='row row-not-wrap'>
            <span className='label'>{t('Restrictions.SendStickers')}</span>
            <div className='switcher-wrap' role='button'>
              <Switcher
                name='sendStickers'
                label={t('Restrictions.SendStickers')}
                color='reverse'
                checked={!permissions.sendStickers && !permissions.sendGifs}
                onChange={handlePermissionChange}
              />
            </div>
          </div>
          <div className='row row-not-wrap'>
            <span className='label'>{t('Restrictions.EmbedLinks')}</span>
            <div className='switcher-wrap' role='button'>
              <Switcher
                name='embedLinks'
                label={t('Restrictions.EmbedLinks')}
                color='reverse'
                checked={!permissions.embedLinks}
                onChange={handlePermissionChange}
              />
            </div>
          </div>
          <div className='row row-not-wrap'>
            <span className='label'>{t('Restrictions.InviteUsers')}</span>
            <div className='switcher-wrap' role='button'>
              <Switcher
                name='inviteUsers'
                label={t('Restrictions.InviteUsers')}
                color='reverse'
                checked={!permissions.inviteUsers}
                onChange={handlePermissionChange}
              />
            </div>
          </div>
          <div className='row row-not-wrap'>
            <span className='label'>{t('Restrictions.PinMessages')}</span>
            <div
              className='switcher-wrap'
              role='button'
              onClick={
                shouldDisablePermissionForPublicGroup
                  ? handleDisabledClick
                  : undefined
              }
            >
              <Switcher
                name='pinMessages'
                label={t('Restrictions.PinMessages')}
                color='reverse'
                disabled={shouldDisablePermissionForPublicGroup}
                checked={!permissions.pinMessages}
                onChange={handlePermissionChange}
              />
            </div>
          </div>
          <div className='row row-not-wrap'>
            <span className='label'>{t('Restrictions.ChangeInfo')}</span>
            <div
              className='switcher-wrap'
              role='button'
              onClick={
                shouldDisablePermissionForPublicGroup
                  ? handleDisabledClick
                  : undefined
              }
            >
              <Switcher
                name='changeInfo'
                label={t('Restrictions.ChangeInfo')}
                color='reverse'
                disabled={shouldDisablePermissionForPublicGroup}
                checked={!permissions.changeInfo}
                onChange={handlePermissionChange}
              />
            </div>
          </div>
          {isForum && (
            <div className='ListItem no-selection with-checkbox'>
              <Checkbox
                name='manageTopics'
                checked={!permissions.manageTopics}
                label={t('CreateTopicsPermission')}
                blocking
                onChange={handlePermissionChange}
              />
            </div>
          )}

          {/* <div className='DropdownListTrap'>
            <div
              className={classNames('DropdownList', {
                'DropdownList--open': isMediaDropdownOpen,
              })}
            >
              <div className='ListItem no-selection with-checkbox'>
                <Checkbox
                  name='sendPhotos'
                  checked={!permissions.sendPhotos}
                  label={t('UserRestrictionsSendPhotos')}
                  blocking
                  onChange={handlePermissionChange}
                />
              </div>

              <div className='ListItem no-selection with-checkbox'>
                <Checkbox
                  name='sendVideos'
                  checked={!permissions.sendVideos}
                  label={t('UserRestrictionsSendVideos')}
                  blocking
                  onChange={handlePermissionChange}
                />
              </div>

              <div className='ListItem no-selection with-checkbox'>
                <Checkbox
                  name='sendStickers'
                  checked={!permissions.sendStickers && !permissions.sendGifs}
                  label={t('UserRestrictionsSendStickers')}
                  blocking
                  onChange={handlePermissionChange}
                />
              </div>

              <div className='ListItem no-selection with-checkbox'>
                <Checkbox
                  name='sendAudios'
                  checked={!permissions.sendAudios}
                  label={t('UserRestrictionsSendMusic')}
                  blocking
                  onChange={handlePermissionChange}
                />
              </div>

              <div className='ListItem no-selection with-checkbox'>
                <Checkbox
                  name='sendDocs'
                  checked={!permissions.sendDocs}
                  label={t('UserRestrictionsSendFiles')}
                  blocking
                  onChange={handlePermissionChange}
                />
              </div>

              <div className='ListItem no-selection with-checkbox'>
                <Checkbox
                  name='sendVoices'
                  checked={!permissions.sendVoices}
                  label={t('UserRestrictionsSendVoices')}
                  blocking
                  onChange={handlePermissionChange}
                />
              </div>

              <div className='ListItem no-selection with-checkbox'>
                <Checkbox
                  name='sendRoundvideos'
                  checked={!permissions.sendRoundvideos}
                  label={t('UserRestrictionsSendRound')}
                  blocking
                  onChange={handlePermissionChange}
                />
              </div>

              <div className='ListItem no-selection with-checkbox'>
                <Checkbox
                  name='embedLinks'
                  checked={!permissions.embedLinks}
                  label={t('UserRestrictionsEmbedLinks')}
                  blocking
                  onChange={handlePermissionChange}
                />
              </div>

              <div className='ListItem no-selection with-checkbox'>
                <Checkbox
                  name='sendPolls'
                  checked={!permissions.sendPolls}
                  label={t('UserRestrictionsSendPolls')}
                  blocking
                  onChange={handlePermissionChange}
                />
              </div>
            </div>
          </div> */}
        </div>

        {/* <div
          className={classNames('section', { shifted: isMediaDropdownOpen })}
        >
          <ListItem
            icon='delete-user'
            multiline
            narrow
            onClick={handleRemovedUsersClick}
          >
            <span className='title'>{t('ChannelBlockedUsers')}</span>
            <span className='subtitle'>{removedUsersCount}</span>
          </ListItem>
        </div> */}

        {/* <div
          className={classNames('section', { shifted: isMediaDropdownOpen })}
        >
          <h3 className='section-heading' dir='auto'>
            {t('PrivacyExceptions')}
          </h3>

          <ListItem icon='add-user' onClick={handleAddExceptionClick}>
            {t('ChannelAddException')}
          </ListItem>

          {exceptionMembers.map((member) => (
            <ListItem
              key={member.userId}
              className='chat-item-clickable exceptions-member'
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => handleExceptionMemberClick(member)}
            >
              <PrivateChatInfo
                userId={member.userId}
                status={getMemberExceptions(member)}
                forceShowSelf
              />
            </ListItem>
          ))}
        </div> */}
      </div>

      <FloatingActionButton
        isShown={havePermissionChanged}
        onClick={handleSavePermissions}
        ariaLabel={String(t('Save'))}
        disabled={isLoading}
      >
        {isLoading ? (
          <Spinner color='white' />
        ) : (
          <i className='icon-svg'>
            <IconSvg name='check-thin' />
          </i>
        )}
      </FloatingActionButton>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId }): StateProps => {
    const chat = selectChat(global, chatId);
    const hasLinkedChat = Boolean(chat?.fullInfo?.linkedChatId);

    return { chat, currentUserId: global.currentUserId, hasLinkedChat };
  })(ManageGroupPermissions)
);
