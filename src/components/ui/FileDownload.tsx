import React, { FC, memo, DragEvent, useCallback } from 'react';

import classNames from 'classnames';
import IconSvg from './IconSvg';
import './FileDownload.scss';
import { openSystemFilesDialog } from '../../util/systemFilesDialog';
import { CONTENT_TYPES_ALL, SUPPORTED_IMAGE_CONTENT_TYPES } from '../../config';
import { validateFiles } from '../../util/files';
import getFilesFromDataTransferItems from '../middle/composer/helpers/getFilesFromDataTransferItems';
import useFlag from '../../hooks/useFlag';

interface OwnProps {
  title?: string;
  disabled?: boolean;
  className?: string;
  onlyImages?: boolean;
  noMultiple?: boolean;
  onFileSelect: (files: File[], shouldSuggestCompression?: boolean) => void;
  onFileAppend: (files: File[], isSpoiler?: boolean) => void;
}

const FileDownload: FC<OwnProps> = ({
  title = 'Change your profile picture',
  disabled,
  className,
  onlyImages,
  noMultiple,
  onFileSelect,
  onFileAppend,
}) => {
  const [drag, markDrag, unmarkDrag] = useFlag();
  const labelClassName = classNames(className, { disabled });

  const handleOnDrop = useCallback(
    async (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      unmarkDrag();
      const { dataTransfer } = e;
      const files = await getFilesFromDataTransferItems(dataTransfer.items);
      if (files?.length) {
        onFileAppend(files);
      }
    },
    [onFileAppend, unmarkDrag]
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
    <div
      className={classNames('image-input', { hovered: drag })}
      onDragEnter={markDrag}
      onDragLeave={unmarkDrag}
      onDragOver={markDrag}
      onDrop={handleOnDrop}
      data-attach-description='Add Items'
      data-dropzone
    >
      <button className={labelClassName} onClick={handleSelect}>
        <i className='icon-svg'>
          <IconSvg name='download' w='18' h='18' />
        </i>{' '}
        {title}
      </button>
    </div>
  );
};

export default memo(FileDownload);
