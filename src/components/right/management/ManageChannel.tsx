import React, {
  FC,
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getActions, withGlobal } from '../../../global';

import { ManagementScreens, ManagementProgress } from '../../../types';
import type {
  ApiAttachment,
  ApiAvailableReaction,
  ApiChat,
  ApiExportedInvite,
} from '../../../api/types';
import { ApiMediaFormat } from '../../../api/types';

import {
  getChatAvatarHash,
  getHasAdminRight,
  isChatChannel,
  isChatCourse,
  isChatPublic,
  isChatSubscription,
} from '../../../global/helpers';
import useMedia from '../../../hooks/useMedia';
import { selectChat, selectTabState } from '../../../global/selectors';
import useFlag from '../../../hooks/useFlag';
import useHistoryBack from '../../../hooks/useHistoryBack';
import { formatInteger } from '../../../util/textFormat';

import AvatarEditable from '../../ui/AvatarEditable';
import InputText from '../../ui/InputText';
import ListItem from '../../ui/ListItem';
import Spinner from '../../ui/Spinner';
import FloatingActionButton from '../../ui/FloatingActionButton';
import ConfirmDialog from '../../ui/ConfirmDialog';
import TextArea from '../../ui/TextArea';

import IconSvg from '../../ui/IconSvg';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Switcher from '../../ui/Switcher';
import useAttachmentModal from '../../middle/composer/hooks/useAttachmentModal';
import { selectCurrentLimit } from '../../../global/selectors/limits';
import { MAX_UPLOAD_FILEPART_SIZE } from '../../../config';
import AttachArea from '../../ui/AttachArea';

import './Management.scss';
import useSignal from '../../../hooks/useSignal';

type OwnProps = {
  chatId: string;
  onScreenSelect: (screen: ManagementScreens) => void;
  onClose: NoneToVoidFunction;
  isActive: boolean;
};

type StateProps = {
  chat: ApiChat;
  progress?: ManagementProgress;
  isSignaturesShown: boolean;
  canChangeInfo?: boolean;
  canInvite?: boolean;
  exportedInvites?: ApiExportedInvite[];
  lastSyncTime?: number;
  availableReactions?: ApiAvailableReaction[];
  linkedChat?: ApiChat;
  fileSizeLimit: number;
  isCourse?: boolean;
  isSubscription?: boolean;
};

const CHANNEL_TITLE_EMPTY = "Channel title can't be empty";
const CHANNEL_MAX_DESCRIPTION = 255;

const ManageChannel: FC<OwnProps & StateProps> = ({
  chatId,
  chat,
  linkedChat,
  progress,
  isSignaturesShown,
  canChangeInfo,
  canInvite,
  exportedInvites,
  lastSyncTime,
  isActive,
  availableReactions,
  fileSizeLimit,
  isCourse,
  isSubscription,
  onScreenSelect,
  onClose,
}) => {
  const {
    updateChat,
    toggleSignatures,
    closeManagement,
    leaveChannel,
    deleteChannel,
    openChat,
    loadExportedChatInvites,
    loadChatJoinRequests,
  } = getActions();

  const currentTitle = chat?.title || '';
  const currentAbout = chat?.fullInfo ? chat.fullInfo.about || '' : '';

  const [isDeleteDialogOpen, openDeleteDialog, closeDeleteDialog] = useFlag();
  const [isProfileFieldsTouched, setIsProfileFieldsTouched] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [about, setAbout] = useState(currentAbout);
  const [photo, setPhoto] = useState<File | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [attachments, setAttachments] = useState<ApiAttachment[]>([]);
  const imageHash = chat && getChatAvatarHash(chat);
  const currentAvatarBlobUrl = useMedia(
    imageHash,
    false,
    ApiMediaFormat.BlobUrl
  );
  const { t } = useTranslation();

  useHistoryBack({
    isActive,
    onBack: onClose,
  });

  useEffect(() => {
    if (lastSyncTime) {
      loadExportedChatInvites({ chatId });
      loadExportedChatInvites({ chatId, isRevoked: true });
      loadChatJoinRequests({ chatId });
    }
  }, [chatId, loadExportedChatInvites, lastSyncTime, loadChatJoinRequests]);

  useEffect(() => {
    if (progress === ManagementProgress.Complete) {
      setIsProfileFieldsTouched(false);
      setError(undefined);
    }
  }, [progress]);

  const adminsCount = Object.keys(chat.fullInfo?.adminMembersById || {}).length;
  const removedUsersCount = chat?.fullInfo?.kickedMembers?.length || 0;

  const handleClickEditType = useCallback(() => {
    onScreenSelect(ManagementScreens.ChatPrivacyType);
  }, [onScreenSelect]);

  const handleClickDiscussion = useCallback(() => {
    onScreenSelect(ManagementScreens.Discussion);
  }, [onScreenSelect]);

  const handleClickReactions = useCallback(() => {
    onScreenSelect(ManagementScreens.Reactions);
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

  const handleUpdateChannel = useCallback(() => {
    const trimmedTitle = title.trim();
    const trimmedAbout = about.trim();

    if (!trimmedTitle.length) {
      setError(CHANNEL_TITLE_EMPTY);
      return;
    }

    updateChat({
      chatId,
      title: trimmedTitle,
      about: trimmedAbout,
      photo,
    });
  }, [about, chatId, photo, title, updateChat]);

  const handleToggleSignatures = useCallback(() => {
    toggleSignatures({ chatId, isEnabled: !isSignaturesShown });
  }, [chatId, isSignaturesShown, toggleSignatures]);

  const handleClickSubscribers = useCallback(() => {
    onScreenSelect(ManagementScreens.ChannelSubscribers);
  }, [onScreenSelect]);

  const handleRemovedUsersClick = useCallback(() => {
    onScreenSelect(ManagementScreens.ChannelRemovedUsers);
  }, [onScreenSelect]);

  const [setHtml] = useSignal('');

  const { handleAppendFiles, handleSetAttachments } = useAttachmentModal({
    attachments,
    setAttachments,
    fileSizeLimit,
    setHtml,
  });

  const handleDelete = useCallback(
    (index: number) => {
      handleSetAttachments(attachments.filter((a, i) => i !== index));
    },
    [attachments, handleSetAttachments]
  );

  const handleDeleteChannel = useCallback(() => {
    if (chat.isCreator) {
      deleteChannel({ chatId: chat.id });
    } else {
      leaveChannel({ chatId: chat.id });
    }

    closeDeleteDialog();
    closeManagement();
    openChat({ id: undefined });
  }, [
    chat.isCreator,
    chat.id,
    closeDeleteDialog,
    closeManagement,
    leaveChannel,
    deleteChannel,
    openChat,
  ]);

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

    const text = totalLength
      ? `${enabledLength} / ${totalLength}`
      : `${enabledLength}`;
    return text;
  }, [availableReactions, chat]);

  const getType = useMemo(() => {
    switch (chat.type) {
      case 'chatTypeChannel':
        return isChatPublic(chat) ? 'UserInfo.Public' : 'UserInfo.Private';
      case 'chatTypeChannelSubscription':
        return 'Channel.SubscriptionShort';
      case 'chatTypeChannelCourse':
        return 'Channel.OnlineCourse';
      default:
        return '';
    }
  }, [chat]);

  if (chat.isRestricted || chat.isForbidden) {
    return null;
  }

  const isLoading = progress === ManagementProgress.InProgress;

  return (
    <div className='Management'>
      <div className='custom-scroll'>
        <div className='section'>
          <AvatarEditable
            currentAvatarBlobUrl={currentAvatarBlobUrl}
            onChange={handleSetPhoto}
            disabled={!canChangeInfo}
          />
          <InputText
            id='channel-title'
            label={String(t('Channel.Title'))}
            onChange={handleTitleChange}
            value={title}
            as_disabled
            error={error === CHANNEL_TITLE_EMPTY ? error : undefined}
            disabled={!canChangeInfo}
          />
          <TextArea
            id='channel-about'
            as_disabled
            label={String(t('DescriptionOptionalPlaceholder'))}
            onChange={handleAboutChange}
            value={about}
            maxLength={CHANNEL_MAX_DESCRIPTION}
            maxLengthIndicator={(
              CHANNEL_MAX_DESCRIPTION - about.length
            ).toString()}
            disabled={!canChangeInfo}
            noReplaceNewlines
          />
          <p className='note'>{t('Channel.DescriptionNote')}</p>
        </div>
        {/* <div className='section p-0'>
          <AttachArea
            subtitle={t('Channel.UploadDescription')}
            attachment={attachments[0]}
            onFileAppend={handleAppendFiles}
            onFileSelect={handleAppendFiles}
            onDelete={handleDelete}
            noMultiple
          />
        </div> */}
        <div className='section'>
          {chat.isCreator && (
            <ListItem
              multiline
              className={classNames({
                underline: chat.fullInfo,
              })}
              onClick={handleClickEditType}
            >
              <span className='subtitle'>{t(getType)}</span>
              <span className='title'>
                {t(isChatChannel(chat) ? 'Channel.Type' : 'Group.Type')}
              </span>
            </ListItem>
          )}
          <ListItem
            multiline
            onClick={handleClickDiscussion}
            disabled={!canChangeInfo}
            className='underline'
          >
            <span className='subtitle'>
              {linkedChat ? t('Channel.Discussion') : t('Channel.AddComment')}
            </span>
            <span className='title'>
              {linkedChat?.title || t('Channel.Discussion')}
            </span>
          </ListItem>
          {/* <div className='ListItem'>
            <div
              className='ListItem-button'
              role='button'
              onClick={handleToggleSignatures}
            >
              <div className='multiline-item'>
                <span className='title'>{t('Channel.SignMessages')}</span>
                <span className='subtitle'>
                  {t('Channel.SignMessagesNote')}
                </span>
              </div>
              <Switcher
                id='sing_message'
                label={t('Channel.SignMessages')}
                checked={isSignaturesShown}
                color='reverse'
              />
            </div>
          </div> */}
        </div>

        <div className='section group-link'>
          {Boolean(chat.joinRequests?.length) && (
            <ListItem
              icon='add-user-filled'
              onClick={handleClickRequests}
              multiline
            >
              <span className='title'>{t('SubscribeRequests')}</span>
              <span className='subtitle'>
                {formatInteger(chat.joinRequests!.length)}
              </span>
            </ListItem>
          )}

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
            <span className='badge-counter'>{adminsCount}</span>
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
          <ListItem
            className='underline'
            leftElement={
              <i className='icon-svg'>
                <IconSvg name='users' w='25' h='25' />
              </i>
            }
            onClick={handleClickSubscribers}
          >
            <span className='middle'>{t('Subscribers')}</span>
            <span className='badge-counter'>{chat.membersCount ?? 0}</span>
          </ListItem>
          {canInvite && !isSubscription && !isCourse && (
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
            leftElement={
              <i className='icon-svg'>
                <IconSvg name='minus-outline' />
              </i>
            }
            onClick={handleRemovedUsersClick}
          >
            <span className='middle'>{t('Channel.RemovedUsers')}</span>
            <span className='badge-counter'>{removedUsersCount}</span>
          </ListItem>
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
            {chat.isCreator ? t('Channel.Delete') : t('Channel.Leave')}
          </ListItem>
        </div>
      </div>
      <FloatingActionButton
        isShown={isProfileFieldsTouched}
        onClick={handleUpdateChannel}
        disabled={isLoading}
        ariaLabel={String(t('Save'))}
      >
        {isLoading ? (
          <Spinner color='white' />
        ) : (
          <i className='icon-svg'>
            <IconSvg name='check-thin' />
          </i>
        )}
      </FloatingActionButton>
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        text={String(
          chat.isCreator
            ? t('Channel.DeleteConfirmation')
            : t('Channel.UnsubscribeConfirmation')
        )}
        confirmLabel={String(
          chat.isCreator ? t('Channel.Delete') : t('Channel.Leave')
        )}
        confirmHandler={handleDeleteChannel}
        confirmIsDestructive
      />
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId }): StateProps => {
    const chat = selectChat(global, chatId)!;
    const linkedChat = chat?.fullInfo?.linkedChatId
      ? selectChat(global, chat.fullInfo.linkedChatId)
      : undefined;
    const { management } = selectTabState(global);
    const { progress } = management;
    const isSignaturesShown = Boolean(chat?.isSignaturesShown);
    const { invites } = management.byChatId[chatId] || {};
    const isSubscription = isChatSubscription(chat);
    const isCourse = isChatCourse(chat);

    return {
      chat,
      progress,
      linkedChat,
      isSignaturesShown,
      canChangeInfo: getHasAdminRight(chat, 'changeInfo'),
      canInvite: getHasAdminRight(chat, 'inviteUsers'),
      lastSyncTime: global.lastSyncTime,
      exportedInvites: invites,
      availableReactions: global.availableReactions,
      isCourse,
      isSubscription,
      fileSizeLimit:
        selectCurrentLimit(global, 'uploadMaxFileparts') *
        MAX_UPLOAD_FILEPART_SIZE,
    };
  })(ManageChannel)
);
