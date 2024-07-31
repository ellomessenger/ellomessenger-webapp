import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getActions, getGlobal, withGlobal } from '../../../global';

import type { ApiChat, ApiChatAdminRights, ApiUser } from '../../../api/types';
import { ManagementScreens } from '../../../types';

import { selectChat, selectUser } from '../../../global/selectors';
import {
  getUserFullName,
  isChatBasicGroup,
  isChatChannel,
} from '../../../global/helpers';
import useFlag from '../../../hooks/useFlag';
import useHistoryBack from '../../../hooks/useHistoryBack';

import PrivateChatInfo from '../../common/PrivateChatInfo';
import ListItem from '../../ui/ListItem';
import Checkbox from '../../ui/Checkbox';
import FloatingActionButton from '../../ui/FloatingActionButton';
import Spinner from '../../ui/Spinner';
import ConfirmDialog from '../../ui/ConfirmDialog';
import InputText from '../../ui/InputText';
import { useTranslation } from 'react-i18next';
import Switcher from '../../ui/Switcher';
import Button from '../../ui/Button';
import useLastCallback from '../../../hooks/useLastCallback';
import classNames from 'classnames';

type OwnProps = {
  chatId: string;
  selectedUserId?: string;
  isPromotedByCurrentUser?: boolean;
  isNewAdmin?: boolean;
  onScreenSelect: (screen: ManagementScreens) => void;
  onClose: NoneToVoidFunction;
  isActive: boolean;
};

type StateProps = {
  chat: ApiChat;
  usersById: Record<string, ApiUser>;
  currentUserId?: string;
  isChannel: boolean;
  isFormFullyDisabled: boolean;
  isForum?: boolean;
  defaultRights?: ApiChatAdminRights;
};

const CUSTOM_TITLE_MAX_LENGTH = 16;

const ManageGroupAdminRights: FC<OwnProps & StateProps> = ({
  isNewAdmin,
  selectedUserId,
  defaultRights,
  onScreenSelect,
  chat,
  usersById,
  currentUserId,
  isChannel,
  isForum,
  isFormFullyDisabled,
  onClose,
  isActive,
}) => {
  const { updateChatAdmin, updateCreator } = getActions();

  const [permissions, setPermissions] = useState<ApiChatAdminRights>({});
  const [isTouched, setIsTouched] = useState(Boolean(isNewAdmin));
  const [isLoading, setIsLoading] = useState(false);
  const [
    isDismissConfirmationDialogOpen,
    openDismissConfirmationDialog,
    closeDismissConfirmationDialog,
  ] = useFlag();
  const [isTransferModalOpen, openTransferDialog, closeTransferDialog] =
    useFlag();
  const [customTitle, setCustomTitle] = useState('');
  const { t } = useTranslation();

  useHistoryBack({
    isActive,
    onBack: onClose,
  });

  const user = getGlobal().users.byId[selectedUserId!];

  const selectedChatMember = useMemo(() => {
    const selectedAdminMember = selectedUserId
      ? chat.fullInfo?.adminMembersById?.[selectedUserId]
      : undefined;

    // If `selectedAdminMember` variable is filled with a value, then we have already saved the administrator,
    // so now we need to return to the list of administrators
    if (isNewAdmin && (selectedAdminMember || !selectedUserId)) {
      return undefined;
    }

    if (isNewAdmin) {
      return user
        ? {
            userId: user.id,
            adminRights: defaultRights,
            customTitle: t('Channel.Admin'),
            isOwner: false,
            promotedByUserId: undefined,
          }
        : undefined;
    }

    return selectedAdminMember;
  }, [
    chat.fullInfo?.adminMembersById,
    defaultRights,
    isNewAdmin,
    selectedUserId,
  ]);

  useEffect(() => {
    if (chat?.fullInfo && selectedUserId && !selectedChatMember) {
      onScreenSelect(ManagementScreens.ChatAdministrators);
    }
  }, [chat, onScreenSelect, selectedChatMember, selectedUserId]);

  useEffect(() => {
    setPermissions(selectedChatMember?.adminRights || {});
    setCustomTitle(
      (selectedChatMember?.customTitle || '').substr(0, CUSTOM_TITLE_MAX_LENGTH)
    );
    setIsTouched(Boolean(isNewAdmin));
    setIsLoading(false);
  }, [defaultRights, isNewAdmin, selectedChatMember]);

  const handlePermissionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name } = e.target;

      function getUpdatedPermissionValue(value: true | undefined) {
        return value ? undefined : true;
      }

      setPermissions((p) => ({
        ...p,
        [name]: getUpdatedPermissionValue(p[name as keyof ApiChatAdminRights]),
      }));
      setIsTouched(true);
    },
    []
  );

  const handleSavePermissions = useCallback(() => {
    if (!selectedUserId) {
      return;
    }

    setIsLoading(true);
    updateChatAdmin({
      chatId: chat.id,
      userId: selectedUserId,
      adminRights: permissions,
      customTitle,
    });
  }, [selectedUserId, updateChatAdmin, chat.id, permissions, customTitle]);

  const handleDismissAdmin = useCallback(() => {
    if (!selectedUserId) {
      return;
    }

    updateChatAdmin({
      chatId: chat.id,
      userId: selectedUserId,
      adminRights: {},
    });
    closeDismissConfirmationDialog();
  }, [
    chat.id,
    closeDismissConfirmationDialog,
    selectedUserId,
    updateChatAdmin,
  ]);

  const handleTransferRight = useLastCallback(() => {
    if (!selectedUserId) {
      return;
    }
    updateCreator({ chatId: chat.id, userId: selectedUserId });
    closeTransferDialog();
    onClose();
  });

  const getControlIsDisabled = useCallback(
    (key: keyof ApiChatAdminRights) => {
      if (currentUserId === selectedUserId) {
        return true;
      }
      if (isChatBasicGroup(chat)) {
        return false;
      }

      if (isFormFullyDisabled || !chat.adminRights) {
        return true;
      }

      if (chat.isCreator) {
        return false;
      }

      return !chat.adminRights![key];
    },
    [chat, isFormFullyDisabled]
  );

  const memberStatus = useMemo(() => {
    if (isNewAdmin || !selectedChatMember) {
      return undefined;
    }

    if (selectedChatMember.isOwner) {
      return t('Channel.Creator');
    }

    const promotedByUser = selectedChatMember.promotedByUserId
      ? usersById[selectedChatMember.promotedByUserId]
      : undefined;

    if (promotedByUser) {
      return t('Chat.EditAdminPromotedBy', {
        promouted: getUserFullName(promotedByUser),
      });
    }

    return t('Channel.Admin');
  }, [isNewAdmin, selectedChatMember, usersById]);

  const handleCustomTitleChange = useCallback(
    (e: { target: { value: any } }) => {
      const { value } = e.target;
      setCustomTitle(value);
      setIsTouched(true);
    },
    []
  );

  if (!selectedChatMember) {
    return null;
  }

  return (
    <div className='Management'>
      <div className='custom-scroll'>
        <div className='section members-list'>
          <ListItem className='chat-item-clickable'>
            <PrivateChatInfo
              userId={selectedChatMember.userId}
              forceShowSelf
              status={memberStatus}
            />
          </ListItem>
        </div>
        <div className='section permission-list'>
          <h4 className='section-heading mt-3' dir='auto'>
            {t(
              isChannel ? 'Channel.AdminPermissions' : 'Group.AdminPermissions'
            )}
          </h4>

          <div className='row row-not-wrap'>
            <span className='label'>
              {t(
                isChannel
                  ? 'Channel.EditAdminChangeChannelInfo'
                  : 'Group.EditAdminChangeGroupInfo'
              )}
            </span>
            <div className='switcher-wrap' role='button'>
              <Switcher
                name='changeInfo'
                label={t(
                  isChannel
                    ? 'Channel.EditAdminChangeChannelInfo'
                    : 'Group.EditAdminChangeGroupInfo'
                )}
                color='reverse'
                has_icon
                checked={!!permissions.changeInfo}
                onChange={handlePermissionChange}
                disabled={getControlIsDisabled('changeInfo')}
              />
            </div>
          </div>

          {isChannel && (
            <>
              <div className='row row-not-wrap'>
                <span className='label'>
                  {t('Channel.EditAdminPostMessages')}
                </span>
                <div className='switcher-wrap' role='button'>
                  <Switcher
                    name='postMessages'
                    label={t('Channel.EditAdminPostMessages')}
                    color='reverse'
                    has_icon
                    checked={!!permissions.postMessages}
                    onChange={handlePermissionChange}
                    disabled={getControlIsDisabled('postMessages')}
                  />
                </div>
              </div>
              <div className='row row-not-wrap'>
                <span className='label'>
                  {t('Channel.EditAdminEditMessages')}
                </span>
                <div className='switcher-wrap' role='button'>
                  <Switcher
                    name='editMessages'
                    label={t('Channel.EditAdminEditMessages')}
                    color='reverse'
                    has_icon
                    checked={!!permissions.editMessages}
                    onChange={handlePermissionChange}
                    disabled={getControlIsDisabled('editMessages')}
                  />
                </div>
              </div>
            </>
          )}

          <div className='row row-not-wrap'>
            <span className='label'>
              {t(
                isChannel
                  ? 'Channel.EditAdminDeleteMessages'
                  : 'Group.EditAdminDeleteMessages'
              )}
            </span>
            <div className='switcher-wrap' role='button'>
              <Switcher
                name='deleteMessages'
                label={t(
                  isChannel
                    ? 'Channel.EditAdminDeleteMessages'
                    : 'Group.EditAdminDeleteMessages'
                )}
                color='reverse'
                has_icon
                checked={!!permissions.deleteMessages}
                onChange={handlePermissionChange}
                disabled={getControlIsDisabled('deleteMessages')}
              />
            </div>
          </div>

          {!isChannel && (
            <div className='row row-not-wrap'>
              <span className='label'>{t('Group.EditAdminBanUsers')}</span>
              <div className='switcher-wrap' role='button'>
                <Switcher
                  name='banUsers'
                  label={t('Group.EditAdminBanUsers')}
                  color='reverse'
                  has_icon
                  checked={!!permissions.banUsers}
                  onChange={handlePermissionChange}
                  disabled={getControlIsDisabled('banUsers')}
                />
              </div>
            </div>
          )}
          <div className='row row-not-wrap'>
            <span className='label'>{t('Group.EditAdminAddUsers')}</span>
            <div className='switcher-wrap' role='button'>
              <Switcher
                name='inviteUsers'
                label={t('Group.EditAdminAddUsers')}
                color='reverse'
                has_icon
                checked={!!permissions.inviteUsers}
                onChange={handlePermissionChange}
                disabled={getControlIsDisabled('inviteUsers')}
              />
            </div>
          </div>

          {!isChannel && (
            <div className='row row-not-wrap'>
              <span className='label'>{t('Group.EditAdminPinMessages')}</span>
              <div className='switcher-wrap' role='button'>
                <Switcher
                  name='pinMessages'
                  label={t('Group.EditAdminPinMessages')}
                  color='reverse'
                  has_icon
                  checked={!!permissions.pinMessages}
                  onChange={handlePermissionChange}
                  disabled={getControlIsDisabled('pinMessages')}
                />
              </div>
            </div>
          )}
          <div className='row row-not-wrap'>
            <span className='label'>
              {t(`${isChannel ? 'Channel' : 'Group'}.EditAddAdmins`)}
            </span>
            <div className='switcher-wrap' role='button'>
              <Switcher
                name='addAdmins'
                label={t(`${isChannel ? 'Channel' : 'Group'}.EditAddAdmins`)}
                color='reverse'
                has_icon
                checked={!!permissions.addAdmins}
                onChange={handlePermissionChange}
                disabled={getControlIsDisabled('addAdmins')}
              />
            </div>
          </div>
          {/* <div className='row row-not-wrap'>
            <span className='label'>
              {t('Channel.StartVoipChatPermission')}
            </span>
            <div className='switcher-wrap' role='button'>
              <Switcher
                name='manageCall'
                label={t('ChannelStartVoipChatPermission')}
                color='reverse'
                has_icon
                checked={!!permissions.manageCall}
                onChange={handlePermissionChange}
                disabled={getControlIsDisabled('manageCall')}
              />
            </div>
          </div> */}

          {isForum && (
            <div className='ListItem no-selection'>
              <Checkbox
                name='manageTopics'
                checked={Boolean(permissions.manageTopics)}
                label={t('ManageTopicsPermission')}
                blocking
                disabled={getControlIsDisabled('manageTopics')}
                onChange={handlePermissionChange}
              />
            </div>
          )}
          {!isChannel && (
            <div className='row row-not-wrap'>
              <span className='label'>
                {t('Group.EditAdminSendAnonymously')}
              </span>
              <div className='switcher-wrap' role='button'>
                <Switcher
                  name='anonymous'
                  label={t('Group.EditAdminSendAnonymously')}
                  color='reverse'
                  has_icon
                  checked={!!permissions.anonymous}
                  onChange={handlePermissionChange}
                  disabled={getControlIsDisabled('anonymous')}
                />
              </div>
            </div>
          )}

          {/* {isFormFullyDisabled && (
            <p className='section-info' dir='auto'>
              {t('Channel.EditAdmin.CannotEdit')}
            </p>
          )} */}

          {/* {currentUserId !== selectedUserId &&
            !isFormFullyDisabled &&
            !isNewAdmin && (
              <ListItem
                icon='delete'
                ripple
                destructive
                onClick={openDismissConfirmationDialog}
              >
                {t('Channel.EditAdminRemoveAdmin')}
              </ListItem>
            )} */}
        </div>
        <p className='section-info' dir='auto'>
          {t(isChannel ? 'Channel.EditAdminInfo' : 'Group.EditAdminInfo')}
        </p>
        {!isChannel && (
          <>
            <div className='section'>
              <h4 className='section-heading mt-3' dir='auto'>
                {t('Group.EditAdminCustomTitle')}
              </h4>
              <InputText
                id='admin-title'
                className='no-border'
                label={String(t('GroupInfo.LabelAdmin'))}
                onChange={handleCustomTitleChange}
                value={customTitle}
                disabled={isFormFullyDisabled}
                maxLength={CUSTOM_TITLE_MAX_LENGTH}
              />
            </div>
            <p className='section-info' dir='auto'>
              {t('Group.EditAdminCustomTitleInfo')}
            </p>
          </>
        )}
        {currentUserId !== selectedUserId && !isFormFullyDisabled && (
          <div className='pl-3 pr-3 mb-3'>
            <Button
              outline
              fullWidth
              className='text-primary'
              onClick={openTransferDialog}
            >
              {t(
                isChannel
                  ? 'Channel.EditAdminTransfer'
                  : 'Group.EditAdminTransfer'
              )}
            </Button>
          </div>
        )}
      </div>

      <FloatingActionButton
        isShown={isTouched}
        onClick={handleSavePermissions}
        ariaLabel={String(t('Save'))}
        disabled={isLoading}
      >
        {isLoading ? <Spinner color='white' /> : <i className='icon-check' />}
      </FloatingActionButton>

      {!isNewAdmin && (
        <ConfirmDialog
          isOpen={isDismissConfirmationDialogOpen}
          onClose={closeDismissConfirmationDialog}
          text='Are you sure you want to dismiss this admin?'
          confirmLabel={String(t('Channel.Admin.Dismiss'))}
          confirmHandler={handleDismissAdmin}
          confirmIsDestructive
        />
      )}
      <ConfirmDialog
        isOpen={isTransferModalOpen}
        onClose={closeTransferDialog}
        title={String(isChannel ? t('Channel.Transfer') : t('Group.Transfer'))}
        text={String(
          isChannel
            ? t('Channel.TransferDialogText', {
                name: chat.title,
                username: user.firstName,
              })
            : t('Group.TransferDialogText')
        )}
        confirmLabel={String(t('ChangeOwner'))}
        confirmHandler={handleTransferRight}
        confirmIsDestructive
      />
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>(
    (global, { chatId, isPromotedByCurrentUser }): StateProps => {
      const chat = selectChat(global, chatId)!;
      const { byId: usersById } = global.users;
      const { currentUserId } = global;
      const isChannel = isChatChannel(chat)!;
      const isFormFullyDisabled = !(chat.isCreator || isPromotedByCurrentUser);
      const isForum = chat.isForum;

      return {
        chat,
        usersById,
        currentUserId,
        isChannel,
        isForum,
        isFormFullyDisabled,
        defaultRights: chat.adminRights,
      };
    }
  )(ManageGroupAdminRights)
);
