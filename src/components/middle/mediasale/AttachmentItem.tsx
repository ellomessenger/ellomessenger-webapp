import React, { FC, memo } from 'react';

import type { ApiAttachment } from '../../../api/types';

import {
  getColorFromExtension,
  getFileExtension,
} from '../../common/helpers/documentInfo';

import Button from '../../ui/Button';
import IconSvg from '../../ui/IconSvg';
import renderText from '../../common/helpers/renderText';
import classNames from 'classnames';

type OwnProps = {
  attachment: ApiAttachment;
  index: number;
  onDelete?: (index: number) => void;
};

const AttachmentItem: FC<OwnProps> = ({ attachment, index, onDelete }) => {
  const extension =
    getFileExtension(attachment.filename, attachment.mimeType) || '';

  const color = getColorFromExtension(extension);

  return (
    <div className='File file-preview-item media-inner'>
      {attachment.previewBlobUrl ? (
        <span className='file-preview-img'>
          <img src={attachment.previewBlobUrl} className='full-media' alt='' />
        </span>
      ) : attachment.audio ? (
        <div className='file-preview-audio'>
          <IconSvg name='audio' />
        </div>
      ) : (
        <div className={classNames('file-icon', color)}>
          {extension.length <= 4 && (
            <span className='file-ext' dir='auto'>
              {extension}
            </span>
          )}
        </div>
      )}
      <span className='file-preview-name'>
        {renderText(attachment.filename)}
      </span>
      {onDelete && (
        <Button
          round
          color='translucent'
          ariaLabel='Delete file'
          onClick={() => onDelete(index)}
        >
          <IconSvg name='delete' />
        </Button>
      )}
    </div>
  );
};

export default memo(AttachmentItem);
