import React, { FC, memo, useCallback, useRef, useState } from 'react';
import { getActions } from '../../../global';

import type { IAnchorPosition, ThreadId } from '../../../types';
import type { ApiVideo, ApiSticker } from '../../../api/types';

import {
  EDITABLE_INPUT_CSS_SELECTOR,
  EDITABLE_INPUT_MODAL_CSS_SELECTOR,
} from '../../../config';
import useFlag from '../../../hooks/useFlag';
import useContextMenuPosition from '../../../hooks/useContextMenuPosition';

import Button from '../../ui/Button';
import Spinner from '../../ui/Spinner';
import ResponsiveHoverButton from '../../ui/ResponsiveHoverButton';
import SymbolMenu from './SymbolMenu.async';
import classNames from 'classnames';
import IconSvg from '../../ui/IconSvg';
import useLastCallback from '../../../hooks/useLastCallback';

const MOBILE_KEYBOARD_HIDE_DELAY_MS = 100;

type OwnProps = {
  chatId: string;
  threadId?: ThreadId;
  isMobile?: boolean;
  isReady?: boolean;
  isSymbolMenuOpen?: boolean;
  canSendGifs?: boolean;
  canSendStickers?: boolean;
  openSymbolMenu: VoidFunction;
  closeSymbolMenu: VoidFunction;
  onCustomEmojiSelect: (emoji: ApiSticker) => void;
  onStickerSelect?: (
    sticker: ApiSticker,
    isSilent?: boolean,
    shouldSchedule?: boolean,
    shouldPreserveInput?: boolean,
    shouldUpdateStickerSetsOrder?: boolean
  ) => void;
  onGifSelect?: (
    gif: ApiVideo,
    isSilent?: boolean,
    shouldSchedule?: boolean
  ) => void;
  onRemoveSymbol: VoidFunction;
  onEmojiSelect: (emoji: string) => void;
  closeBotCommandMenu?: VoidFunction;
  closeSendAsMenu?: VoidFunction;
  isSymbolMenuForced?: boolean;
  isAttachmentModal?: boolean;
  canSendPlainText?: boolean;
  className?: string;
};

const SymbolMenuButton: FC<OwnProps> = ({
  chatId,
  threadId,
  isMobile,
  canSendGifs,
  canSendStickers,
  isReady,
  isSymbolMenuOpen,
  openSymbolMenu,
  closeSymbolMenu,
  onCustomEmojiSelect,
  onStickerSelect,
  onGifSelect,
  isAttachmentModal,
  canSendPlainText,
  onRemoveSymbol,
  onEmojiSelect,
  closeBotCommandMenu,
  closeSendAsMenu,
  isSymbolMenuForced,
  className,
}) => {
  const {
    setStickerSearchQuery,
    setGifSearchQuery,
    addRecentEmoji,
    addRecentCustomEmoji,
  } = getActions();

  // eslint-disable-next-line no-null/no-null
  const triggerRef = useRef<HTMLDivElement>(null);

  const [isSymbolMenuLoaded, onSymbolMenuLoadingComplete] = useFlag();
  const [contextMenuPosition, setContextMenuPosition] = useState<
    IAnchorPosition | undefined
  >(undefined);

  const symbolMenuButtonClassName = classNames(
    'mobile-symbol-menu-button',
    isSymbolMenuLoaded
      ? isSymbolMenuOpen && 'menu-opened'
      : isSymbolMenuOpen && 'is-loading',
    { 'not-ready': !isReady }
  );

  const handleActivateSymbolMenu = useLastCallback(() => {
    closeBotCommandMenu?.();
    closeSendAsMenu?.();
    openSymbolMenu();
  });

  const handleSearchOpen = useCallback(
    (type: 'stickers' | 'gifs') => {
      if (type === 'stickers') {
        setStickerSearchQuery({ query: '' });
        setGifSearchQuery({ query: undefined });
      } else {
        setGifSearchQuery({ query: '' });
        setStickerSearchQuery({ query: undefined });
      }
    },
    [setStickerSearchQuery, setGifSearchQuery]
  );

  const handleSymbolMenuOpen = useCallback(() => {
    const messageInput = document.querySelector<HTMLDivElement>(
      isAttachmentModal
        ? EDITABLE_INPUT_MODAL_CSS_SELECTOR
        : EDITABLE_INPUT_CSS_SELECTOR
    );

    if (!isMobile || messageInput !== document.activeElement) {
      openSymbolMenu();
      return;
    }

    messageInput?.blur();
    setTimeout(() => {
      closeBotCommandMenu?.();
      openSymbolMenu();
    }, MOBILE_KEYBOARD_HIDE_DELAY_MS);
  }, [isAttachmentModal, isMobile, openSymbolMenu, closeBotCommandMenu]);

  const getTriggerElement = useCallback(() => triggerRef.current, []);

  const getRootElement = useCallback(
    () => triggerRef.current?.closest('.custom-scroll, .no-scrollbar'),
    []
  );

  const getMenuElement = useCallback(
    () => document.querySelector('#portals .SymbolMenu .bubble'),
    []
  );

  const getLayout = useCallback(
    () => ({
      withPortal: true,
    }),
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
    getMenuElement,
    getLayout
  );

  return (
    <>
      {isMobile ? (
        <Button
          className={symbolMenuButtonClassName}
          round
          color='translucent'
          onClick={isSymbolMenuOpen ? closeSymbolMenu : handleSymbolMenuOpen}
          ariaLabel='Choose emoji, sticker or GIF'
        >
          <i className='icon-svg smile'>
            <IconSvg name='smile' />
          </i>
          <i className='icon-svg keyboard'>
            <IconSvg name='keyboard' />
          </i>

          {isSymbolMenuOpen && !isSymbolMenuLoaded && <Spinner color='gray' />}
        </Button>
      ) : (
        <ResponsiveHoverButton
          id='simbol-menu-button'
          className={classNames('symbol-menu-button', {
            activated: isSymbolMenuOpen,
          })}
          round
          color='translucent'
          onActivate={handleActivateSymbolMenu}
          ariaLabel='Choose emoji, sticker or GIF'
          ariaControls='symbol-menu-controls'
        >
          <i className='icon-svg smile'>
            <IconSvg name='smile' />
          </i>
        </ResponsiveHoverButton>
      )}

      <SymbolMenu
        chatId={chatId}
        threadId={threadId}
        isOpen={isSymbolMenuOpen || Boolean(isSymbolMenuForced)}
        canSendGifs={canSendGifs}
        canSendStickers={canSendStickers}
        onLoad={onSymbolMenuLoadingComplete}
        onClose={closeSymbolMenu}
        onEmojiSelect={onEmojiSelect}
        onStickerSelect={onStickerSelect}
        onCustomEmojiSelect={onCustomEmojiSelect}
        onGifSelect={onGifSelect}
        onRemoveSymbol={onRemoveSymbol}
        onSearchOpen={handleSearchOpen}
        addRecentEmoji={addRecentEmoji}
        addRecentCustomEmoji={addRecentCustomEmoji}
        isAttachmentModal={isAttachmentModal}
        canSendPlainText={canSendPlainText}
        className={className}
        positionX={isAttachmentModal ? positionX : undefined}
        positionY={isAttachmentModal ? positionY : undefined}
        transformOriginX={isAttachmentModal ? transformOriginX : undefined}
        transformOriginY={isAttachmentModal ? transformOriginY : undefined}
        style={isAttachmentModal ? menuStyle : undefined}
      />
    </>
  );
};

export default memo(SymbolMenuButton);
