import React, { FC, memo, useCallback, useMemo, useRef } from 'react';
import useFlag from '../../hooks/useFlag';
import useLastCallback from '../../hooks/useLastCallback';
import getFilesFromDataTransferItems from '../middle/composer/helpers/getFilesFromDataTransferItems';
import { useTranslation } from 'react-i18next';
import './AttachArea.scss';
import classNames from 'classnames';
import {
  CONTENT_TYPES_ALL,
  SUPPORTED_IMAGE_CONTENT_TYPES,
  SUPPORTED_VIDEO_CONTENT_TYPES,
} from '../../config';
import { ApiAttachment } from '../../api/types';
import { formatMediaDuration } from '../../util/dateFormat';
import { getFileExtension } from '../common/helpers/documentInfo';
import File from '../common/File';
import IconSvg from './IconSvg';
import Button from './Button';
import { openSystemFilesDialog } from '../../util/systemFilesDialog';
import { validateFiles } from '../../util/files';

const DROP_LEAVE_TIMEOUT_MS = 150;

interface OwnProps {
  title?: string;
  subtitle?: string;
  attachment: ApiAttachment;
  className?: string;
  onlyImages?: boolean;
  noMultiple?: boolean;
  onFileSelect: (files: File[], shouldSuggestCompression?: boolean) => void;
  onFileAppend: (files: File[], isSpoiler?: boolean) => void;
  onDelete?: (index: number) => void;
}

const AttachArea: FC<OwnProps> = ({
  subtitle,
  className,
  onlyImages,
  attachment,
  noMultiple,
  onFileSelect,
  onFileAppend,
  onDelete,
}) => {
  const [isHovered, markHovered, unmarkHovered] = useFlag();
  const { t } = useTranslation();
  const hideTimeoutRef = useRef<number>();

  const displayType = useCallback(() => {
    if (attachment) {
      if (SUPPORTED_IMAGE_CONTENT_TYPES.has(attachment.mimeType)) {
        return 'image';
      }
      if (SUPPORTED_VIDEO_CONTENT_TYPES.has(attachment.mimeType)) {
        return 'video';
      }

      return 'file';
    }
  }, [attachment]);

  const handleFilesDrop = useLastCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      unmarkHovered();
      const { dataTransfer } = e;
      const files = await getFilesFromDataTransferItems(dataTransfer.items);
      if (files?.length) {
        onFileAppend(files);
      }
    }
  );

  function handleDragOver(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = undefined;
    }
  }

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    const { relatedTarget: toTarget, target: fromTarget } = e;

    // Esc button pressed during drag event
    if ((fromTarget as HTMLDivElement).matches('.drop-target')) {
      hideTimeoutRef.current = window.setTimeout(
        unmarkHovered,
        DROP_LEAVE_TIMEOUT_MS
      );
    }

    // Prevent DragLeave event from firing when the pointer moves inside the AttachmentModal drop target
    if (fromTarget && (fromTarget as HTMLElement).closest('.hovered')) {
      return;
    }

    if (toTarget) {
      e.stopPropagation();
    }

    unmarkHovered();
  };

  const content = useCallback(
    (index: number) => {
      const type = displayType();
      if (type) {
        switch (type) {
          case 'image':
            return (
              <div className='root'>
                <img
                  className='preview'
                  src={attachment.blobUrl}
                  alt=''
                  draggable={false}
                />
              </div>
            );
          case 'video':
            return (
              <div className='root'>
                {Boolean(attachment.quick?.duration) && (
                  <div className='duration'>
                    {formatMediaDuration(attachment.quick!.duration)}
                  </div>
                )}
                <video
                  className='preview'
                  src={attachment.blobUrl}
                  autoPlay
                  muted
                  loop
                  disablePictureInPicture
                />
              </div>
            );
          default:
            return (
              <div className='root'>
                <File
                  className='file'
                  name={attachment.filename}
                  extension={getFileExtension(
                    attachment.filename,
                    attachment.mimeType
                  )}
                  previewData={attachment.previewBlobUrl}
                  size={attachment.size}
                  smaller
                />
                {onDelete && (
                  <i
                    className={classNames('icon-svg actionItem deleteFile')}
                    onClick={() => onDelete(index)}
                  >
                    <IconSvg name='delete' />
                  </i>
                )}
              </div>
            );
        }
      } else {
        return (
          <div className='root' role='button' onClick={handleSelect}>
            <IconSvg name='download' w='32' h='32' />
            <div className='title'>{t('Upload')}</div>
            <div className='subtitle'>{subtitle}</div>
          </div>
        );
      }
    },
    [attachment, displayType, onDelete]
  );

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

  const handleSelect = useCallback(() => {
    openSystemFilesDialog(
      Array.from(
        onlyImages ? SUPPORTED_IMAGE_CONTENT_TYPES : CONTENT_TYPES_ALL
      ).join(','),
      (e) => handleFileSelect(e, true),
      noMultiple
    );
  }, [handleFileSelect, onlyImages]);

  return (
    <div className={classNames('AttachArea', { hovered: isHovered })}>
      <div
        className='drop-target'
        onDragEnter={markHovered}
        onDrop={handleFilesDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={unmarkHovered}
        data-attach-description={t('Preview.Dragging.AddItems', {
          count: noMultiple ? 1 : 10,
        })}
        data-dropzone
      >
        <div className={classNames(noMultiple ? 'attachment' : 'attachments')}>
          {content(0)}
          <div className='overlay'>
            {onDelete && attachment && (
              <Button
                className='action-item'
                color='translucent-white'
                onClick={() => onDelete(0)}
              >
                <i className='icon-svg'>
                  <IconSvg name='delete' w='24' h='24' />
                </i>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(AttachArea);
