import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import type { ApiVideo } from '../../api/types';
import { ApiMediaFormat } from '../../api/types';

import { IS_TOUCH_ENV } from '../../util/windowEnvironment';
import type { ObserveFn } from '../../hooks/useIntersectionObserver';
import { useIsIntersecting } from '../../hooks/useIntersectionObserver';
import { preventMessageInputBlurWithBubbling } from '../middle/helpers/preventMessageInputBlur';

import useMedia from '../../hooks/useMedia';
import useBuffering from '../../hooks/useBuffering';
import useCanvasBlur from '../../hooks/useCanvasBlur';
import useContextMenuPosition from '../../hooks/useContextMenuPosition';
import useContextMenuHandlers from '../../hooks/useContextMenuHandlers';

import Spinner from '../ui/Spinner';
import Button from '../ui/Button';
import Menu from '../ui/Menu';
import MenuItem from '../ui/MenuItem';
import OptimizedVideo from '../ui/OptimizedVideo';

import './GifButton.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

type OwnProps = {
  gif: ApiVideo;
  observeIntersection: ObserveFn;
  isDisabled?: boolean;
  className?: string;
  onClick?: (
    gif: ApiVideo,
    isSilent?: boolean,
    shouldSchedule?: boolean
  ) => void;
  onUnsaveClick?: (gif: ApiVideo) => void;
  isSavedMessages?: boolean;
};

const GifButton: FC<OwnProps> = ({
  gif,
  isDisabled,
  className,
  observeIntersection,
  onClick,
  onUnsaveClick,
  isSavedMessages,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  const localMediaHash = `gif${gif.id}`;
  const isIntersecting = useIsIntersecting(ref, observeIntersection);
  const loadAndPlay = isIntersecting && !isDisabled;
  const previewBlobUrl = useMedia(
    `${localMediaHash}?size=m`,
    !loadAndPlay,
    ApiMediaFormat.BlobUrl
  );
  const [withThumb] = useState(gif.thumbnail?.dataUri && !previewBlobUrl);
  const thumbRef = useCanvasBlur(gif.thumbnail?.dataUri, !withThumb);
  const videoData = useMedia(
    localMediaHash,
    !loadAndPlay,
    ApiMediaFormat.BlobUrl
  );
  const shouldRenderVideo = Boolean(loadAndPlay && videoData);
  const { isBuffered, bufferingHandlers } = useBuffering(true);
  const shouldRenderSpinner = loadAndPlay && !isBuffered;
  const isVideoReady = loadAndPlay && isBuffered;

  const {
    isContextMenuOpen,
    contextMenuPosition,
    handleBeforeContextMenu,
    handleContextMenu,
    handleContextMenuClose,
    handleContextMenuHide,
  } = useContextMenuHandlers(ref);

  const getTriggerElement = useCallback(() => ref.current, []);

  const getRootElement = useCallback(
    () => ref.current!.closest('.custom-scroll, .no-scrollbar'),
    []
  );

  const getMenuElement = useCallback(
    () => ref.current!.querySelector('.gif-context-menu .bubble'),
    []
  );

  const {
    positionX,
    positionY,
    transformOriginX,
    transformOriginY,
    style: menuStyle,
  } = useContextMenuPosition(
    contextMenuPosition,
    getTriggerElement,
    getRootElement,
    getMenuElement
  );

  const handleClick = useCallback(() => {
    if (isContextMenuOpen || !onClick) return;
    onClick({
      ...gif,
      blobUrl: videoData,
    });
  }, [isContextMenuOpen, onClick, gif, videoData]);

  const handleUnsaveClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      onUnsaveClick!(gif);
    },
    [onUnsaveClick, gif]
  );

  const handleContextDelete = useCallback(() => {
    onUnsaveClick?.(gif);
  }, [gif, onUnsaveClick]);

  const handleSendQuiet = useCallback(() => {
    onClick!(
      {
        ...gif,
        blobUrl: videoData,
      },
      true
    );
  }, [gif, onClick, videoData]);

  const handleSendScheduled = useCallback(() => {
    onClick!(
      {
        ...gif,
        blobUrl: videoData,
      },
      undefined,
      true
    );
  }, [gif, onClick, videoData]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      preventMessageInputBlurWithBubbling(e);
      handleBeforeContextMenu(e);
    },
    [handleBeforeContextMenu]
  );

  useEffect(() => {
    if (isDisabled) handleContextMenuClose();
  }, [handleContextMenuClose, isDisabled]);

  const fullClassName = classNames(
    'GifButton',
    gif.width && gif.height && gif.width < gif.height
      ? 'vertical'
      : 'horizontal',
    localMediaHash,
    className,
    { interactive: !!onClick }
  );

  return (
    <div
      ref={ref}
      className={fullClassName}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {!IS_TOUCH_ENV && onUnsaveClick && (
        <Button
          className='gif-unsave-button'
          color='dark'
          pill
          onClick={handleUnsaveClick}
        >
          <i className='icon-close gif-unsave-button-icon' />
        </Button>
      )}
      {withThumb && (
        <canvas
          ref={thumbRef}
          className='thumbnail'
          // We need to always render to avoid blur re-calculation
          style={isVideoReady ? { display: 'none' } : undefined}
        />
      )}
      {previewBlobUrl && !isVideoReady && (
        <img src={previewBlobUrl} alt='' className='preview' />
      )}
      {shouldRenderVideo && (
        <OptimizedVideo
          canPlay
          src={videoData}
          autoPlay
          loop
          muted
          disablePictureInPicture
          playsInline
          preload='none'
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...bufferingHandlers}
        />
      )}
      {shouldRenderSpinner && (
        <Spinner color={previewBlobUrl || withThumb ? 'white' : 'black'} />
      )}
      {onClick && contextMenuPosition !== undefined && (
        <Menu
          isOpen={isContextMenuOpen}
          transformOriginX={transformOriginX}
          transformOriginY={transformOriginY}
          positionX={positionX}
          positionY={positionY}
          style={menuStyle}
          className='gif-context-menu'
          autoClose
          onClose={handleContextMenuClose}
          onCloseAnimationEnd={handleContextMenuHide}
        >
          {!isSavedMessages && (
            <MenuItem onClick={handleSendQuiet} icon='mute'>
              {t('SendWithoutSound')}
            </MenuItem>
          )}
          <MenuItem onClick={handleSendScheduled} icon='calendar'>
            {t(isSavedMessages ? 'SetReminder' : 'ScheduleMessage')}
          </MenuItem>
          {onUnsaveClick && (
            <MenuItem destructive icon='delete' onClick={handleContextDelete}>
              {t('Delete')}
            </MenuItem>
          )}
        </Menu>
      )}
    </div>
  );
};

export default memo(GifButton);
