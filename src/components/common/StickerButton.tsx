import React, {
  MouseEvent as ReactMouseEvent,
  ReactNode,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { getActions } from '../../global';

import type { ApiBotInlineMediaResult, ApiSticker } from '../../api/types';

import { preventMessageInputBlurWithBubbling } from '../middle/helpers/preventMessageInputBlur';
import { IS_TOUCH_ENV } from '../../util/windowEnvironment';
import { getServerTimeOffset } from '../../util/serverTime';

import type { ObserveFn } from '../../hooks/useIntersectionObserver';
import { useIsIntersecting } from '../../hooks/useIntersectionObserver';

import useContextMenuHandlers from '../../hooks/useContextMenuHandlers';
import useContextMenuPosition from '../../hooks/useContextMenuPosition';
import useDynamicColorListener from '../../hooks/useDynamicColorListener';

import StickerView from './StickerView';
import Button from '../ui/Button';
import Menu from '../ui/Menu';
import MenuItem from '../ui/MenuItem';

import './StickerButton.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

type OwnProps<T> = {
  sticker: ApiSticker;
  size: number;
  noAnimate?: boolean;
  title?: string;
  className?: string;
  noContextMenu?: boolean;
  isSavedMessages?: boolean;
  isStatusPicker?: boolean;
  canViewSet?: boolean;
  isCurrentUserPremium?: boolean;
  sharedCanvasRef?: React.RefObject<HTMLCanvasElement>;
  observeIntersection: ObserveFn;
  noShowPremium?: boolean;
  onClick?: (
    arg: OwnProps<T>['clickArg'],
    isSilent?: boolean,
    shouldSchedule?: boolean
  ) => void;
  clickArg: T;
  onFaveClick?: (sticker: ApiSticker) => void;
  onUnfaveClick?: (sticker: ApiSticker) => void;
  onRemoveRecentClick?: (sticker: ApiSticker) => void;
  onContextMenuOpen?: NoneToVoidFunction;
  onContextMenuClose?: NoneToVoidFunction;
  onContextMenuClick?: NoneToVoidFunction;
};

const contentForStatusMenuContext = [
  { title: 'SetTimeoutFor.Hours', value: 1, arg: 3600 },
  { title: 'SetTimeoutFor.Hours', value: 2, arg: 7200 },
  { title: 'SetTimeoutFor.Hours', value: 8, arg: 28800 },
  { title: 'SetTimeoutFor.Days', value: 1, arg: 86400 },
  { title: 'SetTimeoutFor.Days', value: 2, arg: 172800 },
];

const StickerButton = <
  T extends
    | number
    | ApiSticker
    | ApiBotInlineMediaResult
    | undefined = undefined
>({
  sticker,
  size,
  noAnimate,
  title,
  className,
  noContextMenu,
  isSavedMessages,
  isStatusPicker,
  canViewSet,
  observeIntersection,
  isCurrentUserPremium,
  noShowPremium,
  sharedCanvasRef,
  onClick,
  clickArg,
  onFaveClick,
  onUnfaveClick,
  onRemoveRecentClick,
  onContextMenuOpen,
  onContextMenuClose,
  onContextMenuClick,
}: OwnProps<T>) => {
  const { openStickerSet, openPremiumModal, setEmojiStatus } = getActions();
  // eslint-disable-next-line no-null/no-null
  const ref = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line no-null/no-null
  const menuRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const hasCustomColor = sticker.shouldUseTextColor;
  const customColor = useDynamicColorListener(ref, !hasCustomColor);

  const { id, isCustomEmoji, hasEffect: isPremium, stickerSetInfo } = sticker;
  const isLocked = !isCurrentUserPremium && isPremium;

  const isIntersecting = useIsIntersecting(ref, observeIntersection);
  const shouldLoad = isIntersecting;
  const shouldPlay = isIntersecting && !noAnimate;

  const {
    isContextMenuOpen,
    contextMenuPosition,
    handleBeforeContextMenu,
    handleContextMenu,
    handleContextMenuClose,
    handleContextMenuHide,
  } = useContextMenuHandlers(ref);
  const shouldRenderContextMenu = Boolean(
    !noContextMenu && contextMenuPosition
  );

  const getTriggerElement = useCallback(() => ref.current, []);

  const getRootElement = useCallback(
    () => ref.current!.closest('.custom-scroll, .no-scrollbar'),
    []
  );

  const getMenuElement = useCallback(() => {
    return isStatusPicker
      ? menuRef.current
      : ref.current!.querySelector('.sticker-context-menu .bubble');
  }, [isStatusPicker]);

  const getLayout = () => ({ withPortal: isStatusPicker });

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
    getMenuElement,
    getLayout
  );

  useEffect(() => {
    if (isContextMenuOpen) {
      onContextMenuOpen?.();
    } else {
      onContextMenuClose?.();
    }
  }, [isContextMenuOpen, onContextMenuClose, onContextMenuOpen]);

  useEffect(() => {
    if (!isIntersecting) handleContextMenuClose();
  }, [handleContextMenuClose, isIntersecting]);

  const handleClick = () => {
    if (isContextMenuOpen) return;
    if (isLocked) {
      openPremiumModal({ initialSection: 'premium_stickers' });
      return;
    }
    onClick?.(clickArg);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    preventMessageInputBlurWithBubbling(e);
    handleBeforeContextMenu(e);
  };

  const handleRemoveClick = useCallback(
    (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      e.preventDefault();

      onRemoveRecentClick!(sticker);
    },
    [onRemoveRecentClick, sticker]
  );

  const handleContextRemoveRecent = useCallback(() => {
    onRemoveRecentClick!(sticker);
  }, [onRemoveRecentClick, sticker]);

  const handleContextUnfave = useCallback(() => {
    onUnfaveClick!(sticker);
  }, [onUnfaveClick, sticker]);

  const handleContextFave = useCallback(() => {
    onFaveClick!(sticker);
  }, [onFaveClick, sticker]);

  const handleSendQuiet = useCallback(() => {
    onClick?.(clickArg, true);
  }, [clickArg, onClick]);

  const handleSendScheduled = useCallback(() => {
    onClick?.(clickArg, undefined, true);
  }, [clickArg, onClick]);

  const handleOpenSet = useCallback(() => {
    openStickerSet({ stickerSetInfo });
  }, [openStickerSet, stickerSetInfo]);

  const handleEmojiStatusExpiresClick = useCallback(
    (e: React.SyntheticEvent, duration = 0) => {
      e.preventDefault();
      e.stopPropagation();

      handleContextMenuClose();
      onContextMenuClick?.();
      setEmojiStatus({
        emojiStatus: sticker,
        expires: Date.now() / 1000 + duration + getServerTimeOffset(),
      });
    },
    [setEmojiStatus, sticker, handleContextMenuClose, onContextMenuClick]
  );

  const shouldShowCloseButton = !IS_TOUCH_ENV && onRemoveRecentClick;

  const fullClassName = classNames(
    'StickerButton',
    onClick && 'interactive',
    isCustomEmoji && 'custom-emoji',
    `sticker-button-${id}`,
    className
  );

  const contextMenuItems = useMemo(() => {
    if (
      !shouldRenderContextMenu ||
      noContextMenu ||
      (isCustomEmoji && !isStatusPicker)
    )
      return [];

    const items: ReactNode[] = [];

    if (isCustomEmoji) {
      contentForStatusMenuContext.forEach((item) => {
        items.push(
          <MenuItem onClick={handleEmojiStatusExpiresClick} clickArg={item.arg}>
            {t('i', { title: item.title, value: item.value })}
          </MenuItem>
        );
      });

      return items;
    }

    if (onUnfaveClick) {
      items.push(
        <MenuItem icon='favorite' onClick={handleContextUnfave}>
          {t('Stickers.RemoveFromFavorites')}
        </MenuItem>
      );
    }

    if (onFaveClick) {
      items.push(
        <MenuItem icon='favorite' onClick={handleContextFave}>
          {t('Stickers.AddToFavorites')}
        </MenuItem>
      );
    }

    if (!isLocked && onClick) {
      if (!isSavedMessages) {
        items.push(
          <MenuItem onClick={handleSendQuiet} icon='muted'>
            {t('SendWithoutSound')}
          </MenuItem>
        );
      }
      items.push(
        <MenuItem onClick={handleSendScheduled} icon='calendar'>
          {t(isSavedMessages ? 'SetReminder' : 'ScheduleMessage')}
        </MenuItem>
      );
    }

    if (canViewSet) {
      items.push(
        <MenuItem onClick={handleOpenSet} icon='stickers'>
          {t('ViewPackPreview')}
        </MenuItem>
      );
    }
    if (onRemoveRecentClick) {
      items.push(
        <MenuItem icon='delete' onClick={handleContextRemoveRecent}>
          {t('DeleteFromRecent')}
        </MenuItem>
      );
    }
    return items;
  }, [
    shouldRenderContextMenu,
    noContextMenu,
    isCustomEmoji,
    isStatusPicker,
    onUnfaveClick,
    onFaveClick,
    isLocked,
    onClick,
    canViewSet,
    onRemoveRecentClick,
    handleEmojiStatusExpiresClick,
    handleContextUnfave,
    handleContextFave,
    isSavedMessages,
    handleSendScheduled,
    handleSendQuiet,
    handleOpenSet,
    handleContextRemoveRecent,
  ]);

  return (
    <div
      ref={ref}
      className={fullClassName}
      title={title || sticker?.emoji}
      data-sticker-id={id}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <StickerView
        containerRef={ref}
        sticker={sticker}
        isSmall
        size={size}
        shouldLoop
        shouldPreloadPreview
        noLoad={!shouldLoad}
        noPlay={!shouldPlay}
        withSharedAnimation
        sharedCanvasRef={sharedCanvasRef}
        customColor={customColor}
      />
      {!noShowPremium && isLocked && (
        <div className='sticker-locked'>
          <i className='icon-lock-badge' />
        </div>
      )}
      {!noShowPremium && isPremium && !isLocked && (
        <div className='sticker-premium'>
          <i className='icon-premium' />
        </div>
      )}
      {shouldShowCloseButton && (
        <Button
          className='sticker-remove-button'
          color='dark'
          round
          onClick={handleRemoveClick}
        >
          <i className='icon-close' />
        </Button>
      )}
      {Boolean(contextMenuItems.length) && (
        <Menu
          elRef={menuRef}
          isOpen={isContextMenuOpen}
          transformOriginX={transformOriginX}
          transformOriginY={transformOriginY}
          positionX={positionX}
          positionY={positionY}
          style={menuStyle}
          className='sticker-context-menu'
          autoClose
          withPortal={isStatusPicker}
          onClose={handleContextMenuClose}
          onCloseAnimationEnd={handleContextMenuHide}
        >
          {contextMenuItems}
        </Menu>
      )}
    </div>
  );
};

export default memo(StickerButton);
