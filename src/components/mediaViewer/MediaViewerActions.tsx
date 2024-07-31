import React, { FC, memo, useCallback, useMemo } from 'react';
import { getActions, withGlobal } from '../../global';

import type { ApiMessage, ApiPhoto, ApiChat, ApiUser } from '../../api/types';
import type { MessageListType } from '../../global/types';
import type { MenuItemProps } from '../ui/MenuItem';

import {
  selectIsDownloading,
  selectIsMessageProtected,
  selectAllowedMessageActions,
  selectCurrentMessageList,
  selectIsChatProtected,
} from '../../global/selectors';
import {
  getMessageMediaFormat,
  getMessageMediaHash,
  isUserId,
} from '../../global/helpers';

import useMediaWithLoadProgress from '../../hooks/useMediaWithLoadProgress';
import useFlag from '../../hooks/useFlag';
import useAppLayout from '../../hooks/useAppLayout';

import Button from '../ui/Button';
import DropdownMenu from '../ui/DropdownMenu';
import MenuItem from '../ui/MenuItem';
import ProgressSpinner from '../ui/ProgressSpinner';
import DeleteMessageModal from '../common/DeleteMessageModal';
import DeleteProfilePhotoModal from '../common/DeleteProfilePhotoModal';

import './MediaViewerActions.scss';
import { useTranslation } from 'react-i18next';
import IconSvg from '../ui/IconSvg';

type StateProps = {
  isDownloading: boolean;
  isProtected?: boolean;
  isChatProtected?: boolean;
  canDelete?: boolean;
  canUpdate?: boolean;
  messageListType?: MessageListType;
  avatarOwnerId?: string;
};

type OwnProps = {
  mediaData?: string;
  isVideo: boolean;
  zoomLevelChange: number;
  message?: ApiMessage;
  canUpdateMedia?: boolean;
  isSingleMedia?: boolean;
  avatarPhoto?: ApiPhoto;
  avatarOwner?: ApiChat | ApiUser;
  fileName?: string;
  canReport?: boolean;
  selectMedia: (mediaId?: number) => void;
  onReport: NoneToVoidFunction;
  onBeforeDelete: NoneToVoidFunction;
  onCloseMediaViewer: NoneToVoidFunction;
  onForward: NoneToVoidFunction;
  setZoomLevelChange: (change: number) => void;
};

const MediaViewerActions: FC<OwnProps & StateProps> = ({
  mediaData,
  isVideo,
  message,
  avatarPhoto,
  avatarOwnerId,
  fileName,
  isChatProtected,
  isDownloading,
  isProtected,
  canReport,
  zoomLevelChange,
  canDelete,
  canUpdate,
  messageListType,
  selectMedia,
  onReport,
  onCloseMediaViewer,
  onBeforeDelete,
  onForward,
  setZoomLevelChange,
}) => {
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useFlag(false);
  const { isMobile } = useAppLayout();

  const {
    downloadMessageMedia,
    cancelMessageMediaDownload,
    updateProfilePhoto,
    updateChatPhoto,
  } = getActions();

  const { loadProgress: downloadProgress } = useMediaWithLoadProgress(
    message && getMessageMediaHash(message, 'download'),
    !isDownloading,
    message && getMessageMediaFormat(message, 'download')
  );

  const handleDownloadClick = useCallback(() => {
    if (isDownloading) {
      cancelMessageMediaDownload({ message: message! });
    } else {
      downloadMessageMedia({ message: message! });
    }
  }, [
    cancelMessageMediaDownload,
    downloadMessageMedia,
    isDownloading,
    message,
  ]);

  const handleZoomOut = useCallback(() => {
    const change = zoomLevelChange < 0 ? zoomLevelChange : 0;
    setZoomLevelChange(change - 1);
  }, [setZoomLevelChange, zoomLevelChange]);

  const handleZoomIn = useCallback(() => {
    const change = zoomLevelChange > 0 ? zoomLevelChange : 0;
    setZoomLevelChange(change + 1);
  }, [setZoomLevelChange, zoomLevelChange]);

  const handleUpdate = useCallback(() => {
    if (!avatarPhoto || !avatarOwnerId) return;
    if (isUserId(avatarOwnerId)) {
      updateProfilePhoto({ photo: avatarPhoto });
    } else {
      updateChatPhoto({ chatId: avatarOwnerId, photo: avatarPhoto });
    }
    selectMedia(0);
  }, [
    avatarPhoto,
    avatarOwnerId,
    selectMedia,
    updateProfilePhoto,
    updateChatPhoto,
  ]);

  const { t } = useTranslation();

  const MenuButton: FC<{ onTrigger: () => void; isOpen?: boolean }> =
    useMemo(() => {
      return ({ onTrigger, isOpen }) => (
        <Button
          round
          size='smaller'
          color='translucent'
          className={isOpen ? 'active' : undefined}
          onClick={onTrigger}
          ariaLabel='More actions'
        >
          <i className='icon-svg'>
            <IconSvg name='filled' w='24' h='24' />
          </i>
        </Button>
      );
    }, []);

  function renderDeleteModals() {
    return message ? (
      <DeleteMessageModal
        isOpen={isDeleteModalOpen}
        isSchedule={messageListType === 'scheduled'}
        onClose={closeDeleteModal}
        onConfirm={onBeforeDelete}
        message={message}
      />
    ) : avatarOwnerId && avatarPhoto ? (
      <DeleteProfilePhotoModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={onBeforeDelete}
        profileId={avatarOwnerId}
        photo={avatarPhoto}
      />
    ) : undefined;
  }

  if (isMobile) {
    const menuItems: MenuItemProps[] = [];
    if (!message?.isForwardingAllowed && !isChatProtected) {
      menuItems.push({
        icon: 'forward',
        onClick: onForward,
        children: t('Forward'),
      });
    }
    if (!isProtected) {
      if (isVideo) {
        menuItems.push({
          icon: isDownloading ? 'cancel' : 'download',
          onClick: handleDownloadClick,
          children: isDownloading
            ? `${Math.round(downloadProgress * 100)}% Downloading...`
            : 'Download',
        });
      } else {
        menuItems.push({
          icon: 'download',
          href: mediaData,
          download: fileName,
          children: t('Download'),
        });
      }
    }

    if (canReport) {
      menuItems.push({
        icon: 'report',
        onClick: onReport,
        children: t('ReportPeer.Report'),
      });
    }

    if (canUpdate) {
      menuItems.push({
        icon: 'copy-media',
        onClick: handleUpdate,
        children: t('Settings.SetMainPhoto'),
      });
    }

    if (canDelete) {
      menuItems.push({
        icon: 'delete',
        onClick: openDeleteModal,
        children: t('Delete'),
      });
    }

    if (menuItems.length === 0) {
      return null;
    }

    return (
      <div className='MediaViewerActions-mobile'>
        <DropdownMenu trigger={MenuButton} positionX='right'>
          {menuItems.map(({ icon, onClick, href, download, children }) => (
            <MenuItem
              key={icon}
              customIcon={<IconSvg name={icon!} />}
              href={href}
              download={download}
              onClick={onClick}
            >
              {children}
            </MenuItem>
          ))}
        </DropdownMenu>
        {isDownloading && (
          <ProgressSpinner progress={downloadProgress} size='s' noCross />
        )}
        {canDelete && renderDeleteModals()}
      </div>
    );
  }

  const menuItems: MenuItemProps[] = [];

  if (!isProtected) {
    if (isVideo) {
      menuItems.push({
        icon: isDownloading ? 'cancel' : 'download',
        onClick: handleDownloadClick,
        children: isDownloading
          ? `${Math.round(downloadProgress * 100)}% Downloading...`
          : 'Download',
      });
    } else {
      menuItems.push({
        icon: 'download',
        href: mediaData,
        download: fileName,
        children: t('Download'),
      });
    }
  }

  if (canReport) {
    menuItems.push({
      icon: 'flag',
      onClick: onReport,
      children: t('ReportPeer.Report'),
    });
  }

  if (canUpdate) {
    menuItems.push({
      icon: 'copy-media',
      onClick: handleUpdate,
      children: t('Settings.SetMainPhoto'),
    });
  }

  if (canDelete) {
    menuItems.push({
      icon: 'delete',
      onClick: openDeleteModal,
      children: t('Delete'),
    });
  }

  return (
    <div className='MediaViewerActions'>
      {message?.isForwardingAllowed && !isChatProtected && (
        <Button
          round
          size='smaller'
          color='translucent-white'
          ariaLabel={String(t('Forward'))}
          onClick={onForward}
        >
          <i className='icon-svg'>
            <IconSvg name='forward' w='24' h='24' />
          </i>
        </Button>
      )}
      <DropdownMenu trigger={MenuButton} positionX='right'>
        {menuItems.map(({ icon, onClick, href, download, children }) => (
          <MenuItem
            key={icon}
            customIcon={<IconSvg name={icon!} />}
            href={href}
            download={download}
            onClick={onClick}
          >
            {children}
          </MenuItem>
        ))}
      </DropdownMenu>
      {isDownloading && (
        <ProgressSpinner progress={downloadProgress} size='s' noCross />
      )}

      {/* <Button
        round
        size='smaller'
        color='translucent-white'
        ariaLabel={String(t('Zoom Out'))}
        onClick={handleZoomOut}
      >
        <i className='icon-zoom-out' />
      </Button>
      <Button
        round
        size='smaller'
        color='translucent-white'
        ariaLabel={String(t('Zoom In'))}
        onClick={handleZoomIn}
      >
        <i className='icon-zoom-in' />
      </Button> */}

      <Button
        round
        size='smaller'
        color='translucent-white'
        ariaLabel={t('Close')}
        onClick={onCloseMediaViewer}
      >
        <i className='icon-svg'>
          <IconSvg name='close' />
        </i>
      </Button>
      {canDelete && renderDeleteModals()}
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>(
    (
      global,
      { message, canUpdateMedia, avatarPhoto, avatarOwner }
    ): StateProps => {
      const currentMessageList = selectCurrentMessageList(global);
      const { threadId } = selectCurrentMessageList(global) || {};
      const isDownloading = message
        ? selectIsDownloading(global, message)
        : false;
      const isProtected = selectIsMessageProtected(global, message);
      const isChatProtected =
        message && selectIsChatProtected(global, message?.chatId);
      const { canDelete: canDeleteMessage } =
        (threadId &&
          message &&
          selectAllowedMessageActions(global, message, threadId)) ||
        {};
      const isCurrentAvatar =
        avatarPhoto && avatarPhoto.id === avatarOwner?.avatarHash;
      const canDeleteAvatar = canUpdateMedia && !!avatarPhoto;
      const canDelete = canDeleteMessage || canDeleteAvatar;
      const canUpdate = canUpdateMedia && !!avatarPhoto && !isCurrentAvatar;
      const messageListType = currentMessageList?.type;

      return {
        isDownloading,
        isProtected,
        isChatProtected,
        canDelete,
        canUpdate,
        messageListType,
        avatarOwnerId: avatarOwner?.id,
      };
    }
  )(MediaViewerActions)
);
