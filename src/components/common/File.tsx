import React, { FC, RefObject, memo, useRef, useState } from 'react';

import { IS_CANVAS_FILTER_SUPPORTED } from '../../util/windowEnvironment';
import {
  formatMediaDateTime,
  formatPastTimeShort,
} from '../../util/dateFormat';
import {
  getColorFromExtension,
  getFileSizeString,
} from './helpers/documentInfo';
import { getDocumentThumbnailDimensions } from './helpers/mediaDimensions';
import renderText from './helpers/renderText';
import useShowTransition from '../../hooks/useShowTransition';
import useMediaTransition from '../../hooks/useMediaTransition';
import useCanvasBlur from '../../hooks/useCanvasBlur';
import useAppLayout from '../../hooks/useAppLayout';

import ProgressSpinner from '../ui/ProgressSpinner';
import Link from '../ui/Link';

import './File.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import IconSvg from '../ui/IconSvg';

type OwnProps = {
  elRef?: RefObject<HTMLDivElement>;
  name: string;
  extension?: string;
  size: number;
  timestamp?: number;
  sender?: string;
  thumbnailDataUri?: string;
  previewData?: string;
  className?: string;
  smaller?: boolean;
  isTransferring?: boolean;
  isUploading?: boolean;
  isSelectable?: boolean;
  isSelected?: boolean;
  transferProgress?: number;
  actionIcon?: string;
  onClick?: () => void;
  onDateClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

const File: FC<OwnProps> = ({
  elRef,
  name,
  size,
  extension = '',
  timestamp,
  sender,
  thumbnailDataUri,
  previewData,
  className,
  smaller,
  isTransferring,
  isUploading,
  isSelectable,
  isSelected,
  transferProgress,
  actionIcon,
  onClick,
  onDateClick,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';
  let elementRef = useRef<HTMLDivElement>(null);
  if (elRef) {
    elementRef = elRef;
  }

  const { isMobile } = useAppLayout();
  const [withThumb] = useState(!previewData);
  const noThumb = Boolean(previewData);
  const thumbRef = useCanvasBlur(
    thumbnailDataUri,
    noThumb,
    isMobile && !IS_CANVAS_FILTER_SUPPORTED
  );
  const thumbClassNames = useMediaTransition(!noThumb);

  const {
    shouldRender: shouldSpinnerRender,
    transitionClassNames: spinnerClassNames,
  } = useShowTransition(isTransferring, undefined, true);

  const color = getColorFromExtension(extension);
  const sizeString = getFileSizeString(size);

  const { width, height } = getDocumentThumbnailDimensions(smaller);

  const fullClassName = classNames('File', className, {
    smaller,
    interactive: !!onClick && !isUploading,
    'file-is-selected': isSelected,
  });

  return (
    <div
      ref={elementRef}
      className={fullClassName}
      dir={isRtl ? 'rtl' : undefined}
    >
      {isSelectable && (
        <div className='message-select-control'>
          {isSelected && (
            <i className='icon-svg'>
              <IconSvg name='check' w='15' h='17' />
            </i>
          )}
        </div>
      )}
      <div
        className='file-icon-container'
        onClick={isUploading ? undefined : onClick}
      >
        {thumbnailDataUri || previewData ? (
          <div className='file-preview media-inner'>
            <img
              src={previewData}
              className='full-media'
              width={width}
              height={height}
              alt=''
            />
            {withThumb && (
              <canvas
                ref={thumbRef}
                className={classNames('thumbnail', thumbClassNames)}
              />
            )}
          </div>
        ) : (
          <div className={`file-icon ${color}`}>
            {extension.length <= 4 && (
              <span className='file-ext' dir='auto'>
                {extension}
              </span>
            )}
          </div>
        )}
        {shouldSpinnerRender && (
          <div
            className={classNames('file-progress', color, spinnerClassNames)}
          >
            <ProgressSpinner
              progress={transferProgress}
              size={smaller ? 's' : 'm'}
              onClick={isUploading ? onClick : undefined}
            />
          </div>
        )}

        {onClick && (
          <i
            className={classNames('action-icon', actionIcon || 'icon-svg', {
              hidden: shouldSpinnerRender,
            })}
          >
            <IconSvg name='dowload' />
          </i>
        )}
      </div>
      <div className='file-info'>
        <div className='file-title' dir='auto' title={name}>
          {renderText(name)}
        </div>
        <div className='file-subtitle' dir='auto'>
          <span>
            {isTransferring && transferProgress
              ? `${Math.round(transferProgress * 100)}%`
              : sizeString}
          </span>
          {sender && <span className='file-sender'>{renderText(sender)}</span>}
          {!sender && Boolean(timestamp) && (
            <>
              <span className='bullet' />
              <Link onClick={onDateClick}>
                {formatMediaDateTime(t, timestamp * 1000, true)}
              </Link>
            </>
          )}
        </div>
      </div>
      {sender && Boolean(timestamp) && (
        <Link onClick={onDateClick}>
          {formatPastTimeShort(t, timestamp * 1000)}
        </Link>
      )}
    </div>
  );
};

export default memo(File);
