import React, { FC, memo, useMemo, useCallback, useEffect } from 'react';

import type { GlobalState } from '../../../global/types';
import type { ApiAttachMenuPeerType } from '../../../api/types';
import type { ISettings, ThreadId } from '../../../types';

import {
  CONTENT_TYPES_WITH_PREVIEW,
  SUPPORTED_AUDIO_CONTENT_TYPES,
  SUPPORTED_IMAGE_CONTENT_TYPES,
  SUPPORTED_VIDEO_CONTENT_TYPES,
} from '../../../config';
import { IS_TOUCH_ENV } from '../../../util/windowEnvironment';
import { openSystemFilesDialog } from '../../../util/systemFilesDialog';
import { validateFiles } from '../../../util/files';

import useMouseInside from '../../../hooks/useMouseInside';
import useFlag from '../../../hooks/useFlag';

import ResponsiveHoverButton from '../../ui/ResponsiveHoverButton';
import Menu from '../../ui/Menu';
import MenuItem from '../../ui/MenuItem';
import AttachBotItem from './AttachBotItem';

import './AttachMenu.scss';
import { useTranslation } from 'react-i18next';
import IconSvg from '../../ui/IconSvg';
import useAppLayout from '../../../hooks/useAppLayout';
import useLastCallback from '../../../hooks/useLastCallback';
import classNames from 'classnames';

export type OwnProps = {
  chatId: string;
  threadId?: ThreadId;
  isButtonVisible: boolean;
  canAttachMedia: boolean;
  canAttachPolls: boolean;
  canSendPhotos: boolean;
  canSendVideos: boolean;
  canSendDocuments: boolean;
  canSendAudios: boolean;
  isScheduled?: boolean;
  attachBots: GlobalState['attachMenu']['bots'];
  peerType?: ApiAttachMenuPeerType;
  onFileSelect: (files: File[], shouldSuggestCompression?: boolean) => void;
  onPollCreate: () => void;
  theme: ISettings['theme'];
};

const AttachMenu: FC<OwnProps> = ({
  chatId,
  threadId,
  isButtonVisible,
  canAttachMedia,
  canAttachPolls,
  canSendPhotos,
  canSendVideos,
  canSendDocuments,
  canSendAudios,
  attachBots,
  peerType,
  isScheduled,
  onFileSelect,
  onPollCreate,
  theme,
}) => {
  const { isMobile } = useAppLayout();
  const [isAttachMenuOpen, openAttachMenu, closeAttachMenu] = useFlag();
  const [handleMouseEnter, handleMouseLeave, markMouseInside] = useMouseInside(
    isAttachMenuOpen,
    closeAttachMenu
  );

  const canSendVideoAndPhoto = canSendPhotos && canSendVideos;
  const canSendVideoOrPhoto = canSendPhotos || canSendVideos;
  const [
    isAttachmentBotMenuOpen,
    markAttachmentBotMenuOpen,
    unmarkAttachmentBotMenuOpen,
  ] = useFlag();
  useEffect(() => {
    if (isAttachMenuOpen) {
      markMouseInside();
    }
  }, [isAttachMenuOpen, markMouseInside]);

  const handleToggleAttachMenu = useLastCallback(() => {
    if (isAttachMenuOpen) {
      closeAttachMenu();
    } else {
      openAttachMenu();
    }
  });

  const handleFileSelect = useCallback(
    (e: Event, shouldSuggestCompression?: boolean) => {
      const { files } = e.target as HTMLInputElement;
      const validatedFiles = validateFiles(files);

      if (validatedFiles?.length) {
        onFileSelect(validatedFiles, shouldSuggestCompression);
      }
    },
    [onFileSelect]
  );

  const handleQuickSelect = useCallback(() => {
    openSystemFilesDialog(
      Array.from(
        canSendVideoAndPhoto
          ? CONTENT_TYPES_WITH_PREVIEW
          : canSendPhotos
          ? SUPPORTED_IMAGE_CONTENT_TYPES
          : SUPPORTED_VIDEO_CONTENT_TYPES
      ).join(','),
      (e) => handleFileSelect(e, true)
    );
  }, [canSendPhotos, canSendVideoAndPhoto, handleFileSelect]);

  const handleDocumentSelect = useCallback(() => {
    openSystemFilesDialog(
      !canSendDocuments && canSendAudios
        ? Array.from(SUPPORTED_AUDIO_CONTENT_TYPES).join(',')
        : '*',
      (e) => handleFileSelect(e, false)
    );
  }, [canSendAudios, canSendDocuments, handleFileSelect]);

  const bots = useMemo(() => {
    return Object.values(attachBots).filter((bot) => {
      if (!peerType) return false;
      if (
        peerType === 'bots' &&
        bot.id === chatId &&
        bot.peerTypes.includes('self')
      ) {
        return true;
      }
      return bot.peerTypes.includes(peerType);
    });
  }, [attachBots, chatId, peerType]);

  const { t } = useTranslation();

  if (!isButtonVisible) {
    return null;
  }

  return (
    <div className='AttachMenu'>
      <ResponsiveHoverButton
        id='attach-menu-button'
        className={classNames('AttachMenu--button', {
          activated: isAttachMenuOpen,
        })}
        round
        color='translucent'
        onActivate={handleToggleAttachMenu}
        ariaLabel='Add an attachment'
        ariaControls='attach-menu-controls'
        hasPopup
      >
        <i className='icon-svg'>
          <IconSvg name='paperclip' />
        </i>
      </ResponsiveHoverButton>
      <Menu
        id='attach-menu-controls'
        isOpen={isAttachMenuOpen || isAttachmentBotMenuOpen}
        autoClose
        positionX='right'
        positionY='bottom'
        onClose={closeAttachMenu}
        className='AttachMenu--menu fluid'
        onCloseAnimationEnd={closeAttachMenu}
        onMouseEnter={!IS_TOUCH_ENV ? handleMouseEnter : undefined}
        onMouseLeave={!IS_TOUCH_ENV ? handleMouseLeave : undefined}
        noCloseOnBackdrop={!IS_TOUCH_ENV}
        ariaLabelledBy='attach-menu-button'
      >
        {/*
         ** Using ternary operator here causes some attributes from first clause
         ** transferring to the fragment content in the second clause
         */}
        {!canAttachMedia && (
          <MenuItem className='media-disabled' disabled>
            Posting media content is not allowed in this group.
          </MenuItem>
        )}
        {canAttachMedia && (
          <>
            {canSendVideoOrPhoto && (
              <MenuItem
                customIcon={<IconSvg name='media' />}
                onClick={handleQuickSelect}
              >
                {t(
                  canSendVideoAndPhoto
                    ? 'Attach.PhotoOrVideo'
                    : canSendPhotos
                    ? 'InputAttach.Popover.Photo'
                    : 'InputAttach.Popover.Video'
                )}
              </MenuItem>
            )}
            {(canSendDocuments || canSendAudios) && (
              <MenuItem
                customIcon={<IconSvg name='document' />}
                onClick={handleDocumentSelect}
              >
                {t(
                  !canSendDocuments && canSendAudios
                    ? 'InputAttach.Popover.Music'
                    : 'Attach.File'
                )}
              </MenuItem>
            )}
          </>
        )}
        {/* {canAttachPolls && (
          <MenuItem icon='poll' onClick={onPollCreate}>
            {t('Poll')}
          </MenuItem>
        )}
        <MenuItem customIcon={<IconSvg name='wallet' />} onClick={onPollCreate}>
          {t('Attach.SendFunds')}
        </MenuItem> */}
        {canAttachMedia &&
          !isScheduled &&
          bots.map((bot) => (
            <AttachBotItem
              bot={bot}
              chatId={chatId}
              threadId={threadId}
              theme={theme}
              onMenuOpened={markAttachmentBotMenuOpen}
              onMenuClosed={unmarkAttachmentBotMenuOpen}
            />
          ))}
      </Menu>
    </div>
  );
};

export default memo(AttachMenu);
