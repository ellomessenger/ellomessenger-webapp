import type { FC } from 'react';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { getActions, withGlobal } from '../../../global';

import type { ApiChat, ApiChatBannedRights } from '../../../api/types';
import { ManagementScreens } from '../../../types';

import { selectChat } from '../../../global/selectors';
import stopEvent from '../../../util/stopEvent';
import buildClassName from '../../../util/buildClassName';
import useManagePermissions from '../hooks/useManagePermissions';
import useLang from '../../../hooks/useLang';
import useFlag from '../../../hooks/useFlag';
import useHistoryBack from '../../../hooks/useHistoryBack';

import PrivateChatInfo from '../../common/PrivateChatInfo';
import ListItem from '../../ui/ListItem';
import Checkbox from '../../ui/Checkbox';
import FloatingActionButton from '../../ui/FloatingActionButton';
import Spinner from '../../ui/Spinner';
import ConfirmDialog from '../../ui/ConfirmDialog';

type OwnProps = {
  chatId: string;
  selectedChatMemberId?: string;
  isPromotedByCurrentUser?: boolean;
  onScreenSelect: (screen: ManagementScreens) => void;
  onClose: NoneToVoidFunction;
  isActive: boolean;
};

type StateProps = {
  chat?: ApiChat;
  isFormFullyDisabled?: boolean;
};

const ITEM_HEIGHT = 24 + 32;
const SHIFT_HEIGHT_MINUS = 1;
const BEFORE_ITEMS_COUNT = 2;
const BEFORE_USER_INFO_HEIGHT = 96;
const ITEMS_COUNT = 9;

const ManageGroupUserPermissions: FC<OwnProps & StateProps> = ({
  chat,
  selectedChatMemberId,
  onScreenSelect,
  isFormFullyDisabled,
  onClose,
  isActive,
}) => {
  const { updateChatMemberBannedRights } = getActions();

  const selectedChatMember = useMemo(() => {
    if (!chat || !chat.fullInfo || !chat.fullInfo.members) {
      return undefined;
    }

    return chat.fullInfo.members.find(
      ({ userId }) => userId === selectedChatMemberId
    );
  }, [chat, selectedChatMemberId]);

  const {
    permissions,
    havePermissionChanged,
    isLoading,
    handlePermissionChange,
    setIsLoading,
  } = useManagePermissions(
    selectedChatMember?.bannedRights || chat?.defaultBannedRights
  );
  const [
    isBanConfirmationDialogOpen,
    openBanConfirmationDialog,
    closeBanConfirmationDialog,
  ] = useFlag();
  const lang = useLang();

  const { isForum } = chat || {};

  useHistoryBack({
    isActive,
    onBack: onClose,
  });

  useEffect(() => {
    if (chat?.fullInfo && selectedChatMemberId && !selectedChatMember) {
      onScreenSelect(ManagementScreens.GroupPermissions);
    }
  }, [chat, onScreenSelect, selectedChatMember, selectedChatMemberId]);

  const handleSavePermissions = useCallback(() => {
    if (!chat || !selectedChatMemberId) {
      return;
    }

    setIsLoading(true);
    updateChatMemberBannedRights({
      chatId: chat.id,
      userId: selectedChatMemberId,
      bannedRights: permissions,
    });
  }, [
    chat,
    selectedChatMemberId,
    setIsLoading,
    updateChatMemberBannedRights,
    permissions,
  ]);

  const handleBanFromGroup = useCallback(() => {
    if (!chat || !selectedChatMemberId) {
      return;
    }

    updateChatMemberBannedRights({
      chatId: chat.id,
      userId: selectedChatMemberId,
      bannedRights: {
        viewMessages: true,
      },
    });
  }, [chat, selectedChatMemberId, updateChatMemberBannedRights]);

  const getControlIsDisabled = useCallback(
    (key: Exclude<keyof ApiChatBannedRights, 'untilDate'>) => {
      if (isFormFullyDisabled) {
        return true;
      }

      if (!chat || !chat.defaultBannedRights) {
        return false;
      }

      return chat.defaultBannedRights[key];
    },
    [chat, isFormFullyDisabled]
  );

  const [isMediaDropdownOpen, setIsMediaDropdownOpen] = useState(false);
  const handleOpenMediaDropdown = useCallback(
    (e: React.MouseEvent) => {
      stopEvent(e);
      setIsMediaDropdownOpen(!isMediaDropdownOpen);
    },
    [isMediaDropdownOpen]
  );

  if (!selectedChatMember) {
    return undefined;
  }

  return (
    <div
      className='Management with-shifted-dropdown'
      style={{
        '--shift-height': `${ITEMS_COUNT * ITEM_HEIGHT - SHIFT_HEIGHT_MINUS}px`,
        '--before-shift-height': `${
          BEFORE_ITEMS_COUNT * ITEM_HEIGHT + BEFORE_USER_INFO_HEIGHT
        }px`,
      }}
    >
      <div className='custom-scroll'>
        <div className='section without-bottom-shadow'>
          <ListItem inactive className='chat-item-clickable'>
            <PrivateChatInfo userId={selectedChatMember.userId} forceShowSelf />
          </ListItem>

          <h3 className='section-heading mt-4' dir='auto'>
            {lang('UserRestrictionsCanDo')}
          </h3>

          <div className='ListItem no-selection'>
            <Checkbox
              name='sendPlain'
              checked={!permissions.sendPlain}
              label={lang('UserRestrictionsSend')}
              blocking
              disabled={getControlIsDisabled('sendPlain')}
              onChange={handlePermissionChange}
            />
          </div>

          <div className='ListItem no-selection'>
            <Checkbox
              name='sendMedia'
              checked={!permissions.sendMedia}
              label={lang('UserRestrictionsSendMedia')}
              blocking
              rightIcon={isMediaDropdownOpen ? 'up' : 'down'}
              disabled={getControlIsDisabled('sendMedia')}
              onChange={handlePermissionChange}
              onClickLabel={handleOpenMediaDropdown}
            />
          </div>

          <div className='DropdownListTrap'>
            <div
              className={buildClassName(
                'DropdownList',
                isMediaDropdownOpen && 'DropdownList--open'
              )}
            >
              <div className='ListItem no-selection'>
                <Checkbox
                  name='sendPhotos'
                  checked={!permissions.sendPhotos}
                  label={lang('UserRestrictionsSendPhotos')}
                  blocking
                  disabled={getControlIsDisabled('sendPhotos')}
                  onChange={handlePermissionChange}
                />
              </div>

              <div className='ListItem no-selection'>
                <Checkbox
                  name='sendVideos'
                  checked={!permissions.sendVideos}
                  label={lang('UserRestrictionsSendVideos')}
                  blocking
                  disabled={getControlIsDisabled('sendVideos')}
                  onChange={handlePermissionChange}
                />
              </div>

              <div className='ListItem no-selection'>
                <Checkbox
                  name='sendStickers'
                  checked={!permissions.sendStickers && !permissions.sendGifs}
                  label={lang('UserRestrictionsSendStickers')}
                  blocking
                  disabled={getControlIsDisabled('sendStickers')}
                  onChange={handlePermissionChange}
                />
              </div>

              <div className='ListItem no-selection'>
                <Checkbox
                  name='sendAudios'
                  checked={!permissions.sendAudios}
                  label={lang('UserRestrictionsSendMusic')}
                  blocking
                  disabled={getControlIsDisabled('sendAudios')}
                  onChange={handlePermissionChange}
                />
              </div>

              <div className='ListItem no-selection'>
                <Checkbox
                  name='sendDocs'
                  checked={!permissions.sendDocs}
                  label={lang('UserRestrictionsSendFiles')}
                  blocking
                  disabled={getControlIsDisabled('sendDocs')}
                  onChange={handlePermissionChange}
                />
              </div>

              <div className='ListItem no-selection'>
                <Checkbox
                  name='sendVoices'
                  checked={!permissions.sendVoices}
                  label={lang('UserRestrictionsSendVoices')}
                  blocking
                  disabled={getControlIsDisabled('sendVoices')}
                  onChange={handlePermissionChange}
                />
              </div>

              <div className='ListItem no-selection'>
                <Checkbox
                  name='sendRoundvideos'
                  checked={!permissions.sendRoundvideos}
                  label={lang('UserRestrictionsSendRound')}
                  blocking
                  disabled={getControlIsDisabled('sendRoundvideos')}
                  onChange={handlePermissionChange}
                />
              </div>

              <div className='ListItem no-selection'>
                <Checkbox
                  name='embedLinks'
                  checked={!permissions.embedLinks}
                  label={lang('UserRestrictionsEmbedLinks')}
                  blocking
                  disabled={getControlIsDisabled('embedLinks')}
                  onChange={handlePermissionChange}
                />
              </div>

              <div className='ListItem no-selection'>
                <Checkbox
                  name='sendPolls'
                  checked={!permissions.sendPolls}
                  label={lang('UserRestrictionsSendPolls')}
                  blocking
                  disabled={getControlIsDisabled('sendPolls')}
                  onChange={handlePermissionChange}
                />
              </div>
            </div>
          </div>

          <div
            className={buildClassName('part', isMediaDropdownOpen && 'shifted')}
          >
            <div className='ListItem no-selection'>
              <Checkbox
                name='inviteUsers'
                checked={!permissions.inviteUsers}
                label={lang('UserRestrictionsInviteUsers')}
                blocking
                disabled={getControlIsDisabled('inviteUsers')}
                onChange={handlePermissionChange}
              />
            </div>
            <div className='ListItem no-selection'>
              <Checkbox
                name='pinMessages'
                checked={!permissions.pinMessages}
                label={lang('UserRestrictionsPinMessages')}
                blocking
                disabled={getControlIsDisabled('pinMessages')}
                onChange={handlePermissionChange}
              />
            </div>
            <div className='ListItem no-selection'>
              <Checkbox
                name='changeInfo'
                checked={!permissions.changeInfo}
                label={lang('UserRestrictionsChangeInfo')}
                blocking
                disabled={getControlIsDisabled('changeInfo')}
                onChange={handlePermissionChange}
              />
            </div>
            {isForum && (
              <div className='ListItem no-selection'>
                <Checkbox
                  name='manageTopics'
                  checked={!permissions.manageTopics}
                  label={lang('CreateTopicsPermission')}
                  blocking
                  disabled={getControlIsDisabled('manageTopics')}
                  onChange={handlePermissionChange}
                />
              </div>
            )}
          </div>
        </div>

        {!isFormFullyDisabled && (
          <div
            className={buildClassName(
              'section',
              isMediaDropdownOpen && 'shifted'
            )}
          >
            <ListItem
              icon='delete-user'
              ripple
              destructive
              onClick={openBanConfirmationDialog}
            >
              {lang('UserRestrictionsBlock')}
            </ListItem>
          </div>
        )}
      </div>

      <FloatingActionButton
        isShown={havePermissionChanged}
        onClick={handleSavePermissions}
        ariaLabel={lang('Save')}
        disabled={isLoading}
      >
        {isLoading ? <Spinner color='white' /> : <i className='icon-check' />}
      </FloatingActionButton>

      <ConfirmDialog
        isOpen={isBanConfirmationDialogOpen}
        onClose={closeBanConfirmationDialog}
        text='Are you sure you want to ban and remove this user from the group?'
        confirmLabel='Remove'
        confirmHandler={handleBanFromGroup}
        confirmIsDestructive
      />
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>(
    (global, { chatId, isPromotedByCurrentUser }): StateProps => {
      const chat = selectChat(global, chatId)!;
      const isFormFullyDisabled = !(chat.isCreator || isPromotedByCurrentUser);

      return { chat, isFormFullyDisabled };
    }
  )(ManageGroupUserPermissions)
);
