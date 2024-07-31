import React, {
  FC,
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getActions, withGlobal } from '../../../global';

import { ManagementProgress, ManagementScreens } from '../../../types';
import type {
  ApiAvailableReaction,
  ApiChat,
  ApiChatBannedRights,
  ApiExportedInvite,
} from '../../../api/types';
import { ApiMediaFormat } from '../../../api/types';

import {
  getChatAvatarHash,
  getHasAdminRight,
  isChatBasicGroup,
  isChatPublic,
} from '../../../global/helpers';
import { debounce } from '../../../util/schedulers';
import { selectChat, selectTabState } from '../../../global/selectors';
import { formatInteger } from '../../../util/textFormat';
import renderText from '../../common/helpers/renderText';
import useMedia from '../../../hooks/useMedia';
import useFlag from '../../../hooks/useFlag';
import useHistoryBack from '../../../hooks/useHistoryBack';

import AvatarEditable from '../../ui/AvatarEditable';
import InputText from '../../ui/InputText';
import ListItem from '../../ui/ListItem';
import Checkbox from '../../ui/Checkbox';
import Spinner from '../../ui/Spinner';
import FloatingActionButton from '../../ui/FloatingActionButton';
import ConfirmDialog from '../../ui/ConfirmDialog';
import TextArea from '../../ui/TextArea';
import Switcher from '../../ui/Switcher';

import './Management.scss';
import { useTranslation } from 'react-i18next';
import IconSvg from '../../ui/IconSvg';
import classNames from 'classnames';
import useLastCallback from '../../../hooks/useLastCallback';

type OwnProps = {
  chatId: string;
  onScreenSelect: (screen: ManagementScreens) => void;
  onClose: NoneToVoidFunction;
  isActive: boolean;
};

type StateProps = {
  chat: ApiChat;
  progress?: ManagementProgress;
  isBasicGroup?: boolean;
  hasLinkedChannel: boolean;
  canChangeInfo?: boolean;
  canBanUsers?: boolean;
  canInvite?: boolean;
  canEditForum?: boolean;
  exportedInvites?: ApiExportedInvite[];
  lastSyncTime?: number;
  isChannelsPremiumLimitReached: boolean;
  availableReactions?: ApiAvailableReaction[];
  isLoading?: boolean;
};

const GROUP_TITLE_EMPTY = "Group title can't be empty";
const GROUP_MAX_DESCRIPTION = 255;

const ALL_PERMISSIONS: Array<keyof ApiChatBannedRights> = [
  'sendMessages',
  'sendMedia',
  'sendStickers',
  'embedLinks',
  'inviteUsers',
  'pinMessages',
  'changeInfo',
];

// Some checkboxes control multiple rights, and some rights are not controlled from Permissions screen,
// so we need to define the amount manually
const TOTAL_PERMISSIONS_COUNT = ALL_PERMISSIONS.length + 1;

const runDebounced = debounce((cb) => cb(), 500, false);

const ManageGroup: FC<OwnProps & StateProps> = ({
  chatId,
  chat,
  progress,
  isBasicGroup,
  hasLinkedChannel,
  canChangeInfo,
  canBanUsers,
  canInvite,
  canEditForum,
  isActive,
  exportedInvites,
  lastSyncTime,
  isChannelsPremiumLimitReached,
  availableReactions,
  isLoading,
  onScreenSelect,
  onClose,
}) => {
  const {
    togglePreHistoryHidden,
    updateChat,
    deleteChat,
    leaveChannel,
    deleteChannel,
    closeManagement,
    openChat,
    loadExportedChatInvites,
    loadChatJoinRequests,
    toggleForum,
  } = getActions();

  const [isDeleteDialogOpen, openDeleteDialog, closeDeleteDialog] = useFlag();
  const currentTitle = chat.title;
  const currentAbout = chat.fullInfo ? chat.fullInfo.about || '' : '';

  const [isProfileFieldsTouched, setIsProfileFieldsTouched] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [about, setAbout] = useState(currentAbout);
  const [photo, setPhoto] = useState<File | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [isForumEnabled, setIsForumEnabled] = useState(chat.isForum);
  const imageHash = getChatAvatarHash(chat);
  const currentAvatarBlobUrl = useMedia(
    imageHash,
    false,
    ApiMediaFormat.BlobUrl
  );
  const isPublicGroup = useMemo(
    () => hasLinkedChannel || isChatPublic(chat),
    [chat, hasLinkedChannel]
  );
  const { t } = useTranslation();
  const isPreHistoryHiddenCheckboxRef = useRef<HTMLDivElement>(null);

  useHistoryBack({
    isActive,
    onBack: onClose,
  });

  useEffect(() => {
    if (lastSyncTime && canInvite) {
      loadExportedChatInvites({ chatId });
      loadExportedChatInvites({ chatId, isRevoked: true });
      loadChatJoinRequests({ chatId });
    }
  }, [
    chatId,
    loadExportedChatInvites,
    lastSyncTime,
    canInvite,
    loadChatJoinRequests,
  ]);

  // Resetting `isForum` switch on flood wait error
  useEffect(() => {
    setIsForumEnabled(Boolean(chat.isForum));
  }, [chat.isForum]);

  useEffect(() => {
    if (progress === ManagementProgress.Complete) {
      setIsProfileFieldsTouched(false);
      setError(undefined);
    }
  }, [progress]);

  const handleClickEditType = useCallback(() => {
    onScreenSelect(ManagementScreens.ChatPrivacyType);
  }, [onScreenSelect]);

  const handleClickDiscussion = useCallback(() => {
    onScreenSelect(ManagementScreens.Discussion);
  }, [onScreenSelect]);

  const handleClickReactions = useCallback(() => {
    onScreenSelect(ManagementScreens.Reactions);
  }, [onScreenSelect]);

  const handleClickPermissions = useCallback(() => {
    onScreenSelect(ManagementScreens.GroupPermissions);
  }, [onScreenSelect]);

  const handleClickAdministrators = useCallback(() => {
    onScreenSelect(ManagementScreens.ChatAdministrators);
  }, [onScreenSelect]);

  const handleClickInvites = useCallback(() => {
    onScreenSelect(ManagementScreens.Invites);
  }, [onScreenSelect]);

  const handleClickRequests = useCallback(() => {
    onScreenSelect(ManagementScreens.JoinRequests);
  }, [onScreenSelect]);

  const handleRemovedUsersClick = useCallback(() => {
    onScreenSelect(ManagementScreens.ChannelRemovedUsers);
  }, [onScreenSelect]);

  const handleSetPhoto = useCallback((file: File) => {
    setPhoto(file);
    setIsProfileFieldsTouched(true);
  }, []);

  const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsProfileFieldsTouched(true);
  }, []);

  const handleAboutChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setAbout(e.target.value);
      setIsProfileFieldsTouched(true);
    },
    []
  );

  const handleUpdateGroup = useLastCallback(() => {
    const trimmedTitle = title.trim();
    const trimmedAbout = about.trim();

    if (!trimmedTitle.length) {
      setError(GROUP_TITLE_EMPTY);
      return;
    }

    updateChat({
      chatId,
      title: trimmedTitle,
      about: trimmedAbout,
      photo,
    });
  });

  const handleClickMembers = useCallback(() => {
    onScreenSelect(ManagementScreens.GroupMembers);
  }, [onScreenSelect]);

  const handleClickPreHistory = useLastCallback(() => {
    onScreenSelect(ManagementScreens.ChatHistory);
  });

  useEffect(() => {
    if (!isChannelsPremiumLimitReached) {
      return;
    }
    // Teact does not have full support of controlled form components, we need to "disable" input value change manually
    // TODO Teact support added, this can now be removed
    const checkbox = isPreHistoryHiddenCheckboxRef.current?.querySelector(
      'input'
    ) as HTMLInputElement;
    checkbox.checked = !chat.fullInfo?.isPreHistoryHidden;
  }, [isChannelsPremiumLimitReached, chat.fullInfo?.isPreHistoryHidden]);

  const chatReactionsDescription = useMemo(() => {
    if (!chat.fullInfo?.enabledReactions) {
      return t('Reactions.Off');
    }

    if (chat.fullInfo.enabledReactions.type === 'all') {
      return t('Reactions.All');
    }

    const enabledLength = chat.fullInfo.enabledReactions.allowed.length;
    const totalLength =
      availableReactions?.filter((reaction) => !reaction.isInactive).length ||
      0;

    return totalLength
      ? `${enabledLength} / ${totalLength}`
      : `${enabledLength}`;
  }, [availableReactions, chat]);

  const enabledPermissionsCount = useMemo(() => {
    if (!chat.defaultBannedRights) {
      return 0;
    }

    let totalCount = ALL_PERMISSIONS.filter((key) => {
      if (key === 'manageTopics' && !isForumEnabled) return false;
      return !chat.defaultBannedRights![key as keyof ApiChatBannedRights];
    }).length;

    const { sendStickers, sendGifs } = chat.defaultBannedRights;

    // These two rights are controlled with a single checkbox
    if (!sendStickers && !sendGifs) {
      totalCount += 1;
    }

    return totalCount;
  }, [chat.defaultBannedRights, isForumEnabled]);

  const adminsCount = useMemo(() => {
    return Object.keys(chat.fullInfo?.adminMembersById || {}).length;
  }, [chat.fullInfo?.adminMembersById]);
  const removedUsersCount = chat?.fullInfo?.kickedMembers?.length || 0;

  const handleDeleteGroup = useCallback(() => {
    if (isBasicGroup) {
      deleteChat({ chatId: chat.id });
    } else if (!chat.isCreator) {
      leaveChannel({ chatId: chat.id });
    } else {
      deleteChannel({ chatId: chat.id });
    }
    closeDeleteDialog();
    closeManagement();
    openChat({ id: undefined });
  }, [
    isBasicGroup,
    chat.isCreator,
    chat.id,
    closeDeleteDialog,
    closeManagement,
    leaveChannel,
    deleteChannel,
    deleteChat,
    openChat,
  ]);

  if (chat.isRestricted || chat.isForbidden) {
    return null;
  }

  return (
    <div className='Management'>
      <div className='custom-scroll'>
        <div className='section'>
          <AvatarEditable
            isForForum={isForumEnabled}
            currentAvatarBlobUrl={currentAvatarBlobUrl}
            onChange={handleSetPhoto}
            disabled={!canChangeInfo}
            title='Settings.ChangePhoto'
          />
          <InputText
            id='group-title'
            label={String(t('Group.Title'))}
            onChange={handleTitleChange}
            value={title}
            as_disabled
            error={error === GROUP_TITLE_EMPTY ? error : undefined}
            disabled={!canChangeInfo}
          />
          <TextArea
            id='group-about'
            as_disabled
            label={String(t('DescriptionOptionalPlaceholder'))}
            maxLength={GROUP_MAX_DESCRIPTION}
            maxLengthIndicator={(
              GROUP_MAX_DESCRIPTION - about.length
            ).toString()}
            onChange={handleAboutChange}
            value={about}
            disabled={!canChangeInfo}
            noReplaceNewlines
          />
          <p className='note'>{t('Group.DescriptionNote')}</p>
        </div>
        {(chat.isCreator || chat.fullInfo) && (
          <div className='section'>
            {chat.isCreator && (
              <ListItem
                className={classNames({
                  underline: !isPublicGroup && chat.fullInfo,
                })}
                multiline
                onClick={handleClickEditType}
              >
                <span className='subtitle'>
                  {isPublicGroup ? t('UserInfo.Public') : t('UserInfo.Private')}
                </span>
                <span className='title'>{t('Group.Type')}</span>
              </ListItem>
            )}
            {!isPublicGroup && chat.fullInfo && (
              <ListItem multiline onClick={handleClickPreHistory}>
                <span className='subtitle'>
                  {!chat.fullInfo.isPreHistoryHidden ? t('Show') : t('Hidden')}
                </span>
                <span className='title'>{t('ChatHistory')}</span>
              </ListItem>
            )}
          </div>
        )}

        <div className='section group-link'>
          {hasLinkedChannel && (
            <ListItem icon='message' multiline onClick={handleClickDiscussion}>
              <span className='title'>{t('LinkedChannel')}</span>
              <span className='subtitle'>{t('DiscussionUnlink')}</span>
            </ListItem>
          )}
          {canInvite && (
            <ListItem
              className='underline'
              leftElement={
                <i className='icon-svg'>
                  <IconSvg name='link' />
                </i>
              }
              onClick={handleClickInvites}
              disabled={!exportedInvites}
            >
              <span className='middle'>{t('Link.Invite')}</span>
              <span className='badge-counter'>
                {exportedInvites
                  ? formatInteger(exportedInvites.length || 1)
                  : t('Loading')}
              </span>
            </ListItem>
          )}
          <ListItem
            className='underline'
            leftElement={
              <i className='icon-svg'>
                <IconSvg name='user' />
              </i>
            }
            onClick={handleClickMembers}
          >
            <span className='middle'>{t('Group.Members')}</span>
            <span className='badge-counter'>
              {formatInteger(chat.membersCount ?? 0)}
            </span>
          </ListItem>
          <ListItem
            leftElement={
              <i className='icon-svg'>
                <IconSvg name='permissions' />
              </i>
            }
            className='underline'
            onClick={handleClickPermissions}
            disabled={!canBanUsers}
          >
            <span className='middle'>{t('Permissions')}</span>
            <span className='badge-counter'>
              {enabledPermissionsCount}/
              {TOTAL_PERMISSIONS_COUNT - (isForumEnabled ? 0 : 1)}
            </span>
          </ListItem>
          <ListItem
            className='underline'
            leftElement={
              <i className='icon-svg'>
                <IconSvg name='admin' />
              </i>
            }
            onClick={handleClickAdministrators}
          >
            <span className='middle'>{t('Administrators')}</span>
            <span className='badge-counter'>{formatInteger(adminsCount)}</span>
          </ListItem>
          <ListItem
            leftElement={
              <i className='icon-svg'>
                <IconSvg name='user-minus' />
              </i>
            }
            onClick={handleRemovedUsersClick}
          >
            <span className='middle'>{t('Channel.RemovedUsers')}</span>
            <span className='badge-counter'>{removedUsersCount}</span>
          </ListItem>
          <ListItem
            className='underline'
            leftElement={
              <i className='icon-svg'>
                <IconSvg name='heart' w='24' h='24' />
              </i>
            }
            onClick={handleClickReactions}
            disabled={!canChangeInfo}
          >
            <span className='middle'>{t('Reactions.Title')}</span>
            <span className='badge-counter'>{chatReactionsDescription}</span>
          </ListItem>

          {/* {Boolean(chat.joinRequests?.length) && (
            <ListItem
              icon='add-user-filled'
              onClick={handleClickRequests}
              multiline
            >
              <span className='title'>{t('MemberRequests')}</span>
              <span className='subtitle'>
                {formatInteger(chat.joinRequests!.length)}
              </span>
            </ListItem>
          )} */}
          {/* {canEditForum && (
            <>
              <ListItem icon='forums' ripple onClick={handleForumToggle}>
                <span>{t('ChannelTopics')}</span>
                <Switcher
                  id='group-notifications'
                  label={t('ChannelTopics')}
                  checked={isForumEnabled}
                  inactive
                />
              </ListItem>
              <div className='section-info section-info_push'>
                {t('ForumToggleDescription')}
              </div>
            </>
          )} */}
        </div>
        <div className='section group-link'>
          <ListItem
            leftElement={
              <i className='icon-svg destructive'>
                <IconSvg name='delete' />
              </i>
            }
            ripple
            onClick={openDeleteDialog}
          >
            {t('Group.Delete')}
          </ListItem>
        </div>
      </div>

      <FloatingActionButton
        isShown={isProfileFieldsTouched}
        onClick={handleUpdateGroup}
        disabled={isLoading}
        ariaLabel={String(t('Save'))}
      >
        {isLoading ? <Spinner color='white' /> : <i className='icon-check' />}
      </FloatingActionButton>
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        textParts={renderText(
          String(
            t(
              chat.isCreator
                ? 'Group.DeleteConfirmation'
                : 'Group.LeaveConfirmation',
              {
                chatTitle: chat.title,
              }
            )
          ),
          ['br', 'simple_markdown']
        )}
        confirmLabel={String(
          t(chat.isCreator ? 'Group.DeleteForAll' : 'DeleteMega')
        )}
        confirmHandler={handleDeleteGroup}
        confirmIsDestructive
      />
    </div>
  );
};

export default withGlobal<OwnProps>((global, { chatId }): StateProps => {
  const chat = selectChat(global, chatId)!;

  const { management, limitReachedModal } = selectTabState(global);
  const { progress } = management;

  const hasLinkedChannel = Boolean(
    chat && chat.fullInfo && chat.fullInfo?.linkedChatId
  );
  const isBasicGroup = isChatBasicGroup(chat);
  const { invites } = management.byChatId[chatId] || {};
  const canEditForum =
    !hasLinkedChannel &&
    (getHasAdminRight(chat, 'changeInfo') || chat.isCreator);
  const isLoading = progress
    ? progress === ManagementProgress.InProgress
    : false;

  return {
    chat,
    progress,
    isBasicGroup,
    hasLinkedChannel,
    canChangeInfo: isBasicGroup
      ? chat.isCreator
      : getHasAdminRight(chat, 'changeInfo'),
    canBanUsers: isBasicGroup
      ? chat.isCreator
      : getHasAdminRight(chat, 'banUsers'),
    canInvite: isBasicGroup
      ? chat.isCreator
      : getHasAdminRight(chat, 'inviteUsers'),
    exportedInvites: invites,
    lastSyncTime: global.lastSyncTime,
    isChannelsPremiumLimitReached: limitReachedModal?.limit === 'channels',
    availableReactions: global.availableReactions,
    canEditForum,
    isLoading,
  };
})(ManageGroup);
