import React, {
  RefObject,
  ChangeEvent,
  FC,
  useEffect,
  useRef,
  memo,
  useState,
  useCallback,
  useLayoutEffect,
  UIEvent,
} from 'react';

import { getActions, withGlobal } from '../../../global';

import type { IAnchorPosition, ISettings, ThreadId } from '../../../types';
import type { Signal } from '../../../util/signals';

import { EDITABLE_INPUT_ID } from '../../../config';
import {
  IS_ANDROID,
  IS_EMOJI_SUPPORTED,
  IS_IOS,
  IS_TOUCH_ENV,
} from '../../../util/windowEnvironment';
import {
  selectCanPlayAnimatedEmojis,
  selectIsInSelectMode,
  selectReplyingToId,
} from '../../../global/selectors';
import { debounce } from '../../../util/schedulers';
import focusEditableElement from '../../../util/focusEditableElement';
import captureKeyboardListeners from '../../../util/captureKeyboardListeners';
import { getIsDirectTextInputDisabled } from '../../../util/directInputManager';
import parseEmojiOnlyString from '../../../util/parseEmojiOnlyString';
import { isSelectionInsideInput } from './helpers/selection';
import renderText from '../../common/helpers/renderText';

import useFlag from '../../../hooks/useFlag';
import { isHeavyAnimating } from '../../../hooks/useHeavyAnimationCheck';
import useInputCustomEmojis from './hooks/useInputCustomEmojis';
import useAppLayout from '../../../hooks/useAppLayout';
import useDerivedState from '../../../hooks/useDerivedState';

import TextFormatter from './TextFormatter';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

const CONTEXT_MENU_CLOSE_DELAY_MS = 100;
// Focus slows down animation, also it breaks transition layout in Chrome
const FOCUS_DELAY_MS = 350;
const TRANSITION_DURATION_FACTOR = 50;

const SCROLLER_CLASS = 'input-scroller';
const INPUT_WRAPPER_CLASS = 'message-input-wrapper';

type OwnProps = {
  elRef?: RefObject<HTMLDivElement>;
  id: string;
  chatId: string;
  isReady: boolean;
  threadId: ThreadId;
  isAttachmentModalInput?: boolean;
  editableInputId?: string;
  isActive: boolean;
  getHtml: Signal<string>;
  getHtmlStr: string;
  placeholder: string;
  forcedPlaceholder?: string;
  noFocusInterception?: boolean;
  canAutoFocus: boolean;
  shouldSuppressFocus?: boolean;
  shouldSuppressTextFormatter?: boolean;
  canSendPlainText?: boolean;
  onUpdate: (html: string) => void;
  onSuppressedFocus?: () => void;
  onSend: () => void;
  onScroll?: (event: UIEvent<HTMLElement>) => void;
  captionLimit?: number;
};

type StateProps = {
  replyingToId?: number;
  isSelectModeActive?: boolean;
  messageSendKeyCombo?: ISettings['messageSendKeyCombo'];
  canPlayAnimatedEmojis: boolean;
};

const MAX_ATTACHMENT_MODAL_INPUT_HEIGHT = 160;
const TAB_INDEX_PRIORITY_TIMEOUT = 2000;
// Heuristics allowing the user to make a triple click
const SELECTION_RECALCULATE_DELAY_MS = 260;
const TEXT_FORMATTER_SAFE_AREA_PX = 140;
// For some reason Safari inserts `<br>` after user removes text from input
const SAFARI_BR = '<br>';
const IGNORE_KEYS = [
  'Esc',
  'Escape',
  'Enter',
  'PageUp',
  'PageDown',
  'Meta',
  'Alt',
  'Ctrl',
  'ArrowDown',
  'ArrowUp',
  'Control',
  'Shift',
];

function clearSelection() {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  if (selection.removeAllRanges) {
    selection.removeAllRanges();
  } else if (selection.empty) {
    selection.empty();
  }
}

const MessageInput: FC<OwnProps & StateProps> = ({
  elRef,
  id,
  chatId,
  captionLimit,
  isReady,
  isAttachmentModalInput,
  editableInputId,
  isActive,
  getHtml,
  getHtmlStr,
  placeholder,
  forcedPlaceholder,
  canSendPlainText,
  canAutoFocus,
  noFocusInterception,
  shouldSuppressFocus,
  shouldSuppressTextFormatter,
  replyingToId,
  isSelectModeActive,
  messageSendKeyCombo,
  canPlayAnimatedEmojis,
  onUpdate,
  onSuppressedFocus,
  onSend,
  onScroll,
}) => {
  const {
    editLastMessage,
    replyToNextMessage,
    showAllowedMessageTypesNotification,
  } = getActions();

  // eslint-disable-next-line no-null/no-null
  let inputRef = useRef<HTMLDivElement>(null);
  if (elRef) {
    inputRef = elRef;
  }

  const selectionTimeoutRef = useRef<number>(null);

  const cloneRef = useRef<HTMLDivElement>(null);

  const scrollerCloneRef = useRef<HTMLDivElement>(null);

  const sharedCanvasRef = useRef<HTMLCanvasElement>(null);

  const sharedCanvasHqRef = useRef<HTMLCanvasElement>(null);

  const absoluteContainerRef = useRef<HTMLDivElement>(null);

  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';
  const isContextMenuOpenRef = useRef(false);
  const [isTextFormatterOpen, openTextFormatter, closeTextFormatter] =
    useFlag();
  const [textFormatterAnchorPosition, setTextFormatterAnchorPosition] =
    useState<IAnchorPosition>();
  const [selectedRange, setSelectedRange] = useState<Range>();
  const [isTextFormatterDisabled, setIsTextFormatterDisabled] =
    useState<boolean>(false);
  const { isMobile } = useAppLayout();

  useInputCustomEmojis(
    getHtml,
    inputRef,
    sharedCanvasRef,
    sharedCanvasHqRef,
    absoluteContainerRef,
    isAttachmentModalInput ? 'attachment' : 'composer',
    canPlayAnimatedEmojis,
    isReady,
    isActive
  );

  const maxInputHeight = isMobile ? 256 : 416;
  const updateInputHeight = useCallback(
    (willSend = false) => {
      const scroller = inputRef.current!.closest<HTMLDivElement>(
        `.${SCROLLER_CLASS}`
      )!;
      const clone = scrollerCloneRef.current!;
      const currentHeight = Number(scroller.style.height.replace('px', ''));
      const maxHeight = isAttachmentModalInput
        ? MAX_ATTACHMENT_MODAL_INPUT_HEIGHT
        : maxInputHeight;
      const newHeight = Math.min(clone.scrollHeight, maxHeight);
      if (newHeight === currentHeight) {
        return;
      }

      const transitionDuration = Math.round(
        TRANSITION_DURATION_FACTOR *
          Math.log(Math.abs(newHeight - currentHeight))
      );

      const exec = () => {
        scroller.style.minHeight = `${newHeight}px`;
        scroller.style.transitionDuration = `${transitionDuration}ms`;
        scroller.classList.toggle('overflown', clone.scrollHeight > maxHeight);
      };

      if (willSend) {
        // Sync with sending animation
        requestAnimationFrame(exec);
      } else {
        exec();
      }
    },
    [isAttachmentModalInput, maxInputHeight]
  );

  useLayoutEffect(() => {
    if (!isAttachmentModalInput) return;
    updateInputHeight(false);
  }, [isAttachmentModalInput, updateInputHeight]);

  const htmlRef = useRef(getHtml());

  useLayoutEffect(() => {
    const html = isActive ? getHtmlStr : '';

    if (html !== inputRef.current!.innerHTML) {
      inputRef.current!.innerHTML = html;
    }

    if (html !== cloneRef.current!.innerHTML) {
      cloneRef.current!.innerHTML = html;
    }

    if (html !== htmlRef.current) {
      htmlRef.current = html;

      updateInputHeight(!html);
    }
  }, [getHtmlStr, getHtml(), isActive, updateInputHeight]);

  const chatIdRef = useRef(chatId);
  chatIdRef.current = chatId;
  const focusInput = useCallback(() => {
    if (!inputRef.current) {
      return;
    }

    if (isHeavyAnimating()) {
      setTimeout(focusInput, FOCUS_DELAY_MS);
      return;
    }

    focusEditableElement(inputRef.current!);
  }, []);

  const handleCloseTextFormatter = useCallback(() => {
    closeTextFormatter();
    clearSelection();
  }, [closeTextFormatter]);

  function checkSelection() {
    // Disable the formatter on iOS devices for now.
    if (IS_IOS) {
      return false;
    }

    const selection = window.getSelection();
    if (!selection || !selection.rangeCount || isContextMenuOpenRef.current) {
      closeTextFormatter();
      if (IS_ANDROID) {
        setIsTextFormatterDisabled(false);
      }
      return false;
    }

    const selectionRange = selection.getRangeAt(0);
    const selectedText = selectionRange.toString().trim();
    if (
      shouldSuppressTextFormatter ||
      !isSelectionInsideInput(
        selectionRange,
        editableInputId || EDITABLE_INPUT_ID
      ) ||
      !selectedText ||
      parseEmojiOnlyString(selectedText) ||
      !selectionRange.START_TO_END
    ) {
      closeTextFormatter();
      return false;
    }

    return true;
  }

  function processSelection() {
    if (!checkSelection()) {
      return;
    }

    if (isTextFormatterDisabled) {
      return;
    }

    const selectionRange = window.getSelection()!.getRangeAt(0);
    const selectionRect = selectionRange.getBoundingClientRect();
    const scrollerRect = inputRef
      .current!.closest<HTMLDivElement>(`.${SCROLLER_CLASS}`)!
      .getBoundingClientRect();

    let x = selectionRect.left + selectionRect.width / 2 - scrollerRect.left;

    if (x < TEXT_FORMATTER_SAFE_AREA_PX) {
      x = TEXT_FORMATTER_SAFE_AREA_PX;
    } else if (x > scrollerRect.width - TEXT_FORMATTER_SAFE_AREA_PX) {
      x = scrollerRect.width - TEXT_FORMATTER_SAFE_AREA_PX;
    }

    setTextFormatterAnchorPosition({
      x,
      y: selectionRect.top - scrollerRect.top,
    });

    setSelectedRange(selectionRange);
    openTextFormatter();
  }

  function processSelectionWithTimeout() {
    if (selectionTimeoutRef.current) {
      window.clearTimeout(selectionTimeoutRef.current);
    }
    // Small delay to allow browser properly recalculate selection
    let selectionTimeout = selectionTimeoutRef.current;
    selectionTimeout = window.setTimeout(
      processSelection,
      SELECTION_RECALCULATE_DELAY_MS
    );
  }

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (e.button !== 2) {
      const listenerEl =
        e.currentTarget.closest(`.${INPUT_WRAPPER_CLASS}`) || e.target;

      listenerEl.addEventListener('mouseup', processSelectionWithTimeout, {
        once: true,
      });
      return;
    }

    if (isContextMenuOpenRef.current) {
      return;
    }

    isContextMenuOpenRef.current = true;

    function handleCloseContextMenu(e2: KeyboardEvent | MouseEvent) {
      if (
        e2 instanceof KeyboardEvent &&
        e2.key !== 'Esc' &&
        e2.key !== 'Escape'
      ) {
        return;
      }

      setTimeout(() => {
        isContextMenuOpenRef.current = false;
      }, CONTEXT_MENU_CLOSE_DELAY_MS);

      window.removeEventListener('keydown', handleCloseContextMenu);
      window.removeEventListener('mousedown', handleCloseContextMenu);
    }

    document.addEventListener('mousedown', handleCloseContextMenu);
    document.addEventListener('keydown', handleCloseContextMenu);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    // https://levelup.gitconnected.com/javascript-events-handlers-keyboard-and-load-events-1b3e46a6b0c3#1960
    const { isComposing } = e;

    const html = getHtml();

    if (!isComposing && !html && (e.metaKey || e.ctrlKey)) {
      const targetIndexDelta =
        e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : undefined;
      if (targetIndexDelta) {
        e.preventDefault();

        replyToNextMessage({ targetIndexDelta });
        return;
      }
    }

    if (!isComposing && e.key === 'Enter' && !e.shiftKey) {
      if (
        !(IS_IOS || IS_ANDROID) &&
        ((messageSendKeyCombo === 'enter' && !e.shiftKey) ||
          (messageSendKeyCombo === 'ctrl-enter' && (e.ctrlKey || e.metaKey)))
      ) {
        e.preventDefault();

        closeTextFormatter();
        onSend();
      }
    } else if (
      !isComposing &&
      e.key === 'ArrowUp' &&
      !html &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.altKey
    ) {
      e.preventDefault();
      editLastMessage();
    } else {
      e.target.addEventListener('keyup', processSelectionWithTimeout, {
        once: true,
      });
    }
  }

  function handleChange(e: ChangeEvent<HTMLDivElement>) {
    const { innerHTML, textContent } = e.currentTarget;

    onUpdate(innerHTML === SAFARI_BR ? '' : innerHTML);

    // Reset focus on the input to remove any active styling when input is cleared
    if (
      !IS_TOUCH_ENV &&
      (!textContent || !textContent.length) &&
      // When emojis are not supported, innerHTML contains an emoji img tag that doesn't exist in the textContext
      !(!IS_EMOJI_SUPPORTED && innerHTML.includes('emoji-small')) &&
      !innerHTML.includes('custom-emoji')
    ) {
      const selection = window.getSelection()!;
      if (selection) {
        inputRef.current!.blur();
        selection.removeAllRanges();
        focusEditableElement(inputRef.current!, true);
      }
    }
  }

  function handleAndroidContextMenu(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    if (!checkSelection()) {
      return;
    }

    setIsTextFormatterDisabled(!isTextFormatterDisabled);

    if (!isTextFormatterDisabled) {
      e.preventDefault();
      e.stopPropagation();

      processSelection();
    } else {
      closeTextFormatter();
    }
  }

  function handleClick() {
    if (isAttachmentModalInput || canSendPlainText) return;
    showAllowedMessageTypesNotification({ chatId });
  }

  useEffect(() => {
    if (IS_TOUCH_ENV) {
      return;
    }

    if (canAutoFocus) {
      focusInput();
    }
  }, [chatId, focusInput, replyingToId, canAutoFocus]);

  useEffect(() => {
    if (
      !chatId ||
      editableInputId !== EDITABLE_INPUT_ID ||
      noFocusInterception ||
      (IS_TOUCH_ENV && isMobile) ||
      isSelectModeActive
    ) {
      return undefined;
    }

    const handleDocumentKeyDown = (e: KeyboardEvent) => {
      if (getIsDirectTextInputDisabled()) {
        return;
      }

      const { key } = e;
      const target = e.target as HTMLElement | undefined;

      if (!target || IGNORE_KEYS.includes(key)) {
        return;
      }

      const input = inputRef.current!;
      const isSelectionCollapsed = document.getSelection()?.isCollapsed;

      if (
        (((key && key.startsWith('Arrow')) ||
          (e.shiftKey && key === 'Shift')) &&
          !isSelectionCollapsed) ||
        (e.code === 'KeyC' &&
          (e.ctrlKey || e.metaKey) &&
          target.tagName !== 'INPUT')
      ) {
        return;
      }

      if (
        input &&
        target !== input &&
        target.tagName !== 'INPUT' &&
        target.tagName !== 'TEXTAREA' &&
        !target.isContentEditable
      ) {
        focusEditableElement(input, true, true);

        const newEvent = new KeyboardEvent(e.type, e as any);
        input.dispatchEvent(newEvent);
      }
    };

    document.addEventListener('keydown', handleDocumentKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown, true);
    };
  }, [
    chatId,
    editableInputId,
    isMobile,
    isSelectModeActive,
    noFocusInterception,
  ]);

  useEffect(() => {
    const captureFirstTab = debounce(
      (e: KeyboardEvent) => {
        if (e.key === 'Tab' && !getIsDirectTextInputDisabled()) {
          e.preventDefault();
          requestAnimationFrame(focusInput);
        }
      },
      TAB_INDEX_PRIORITY_TIMEOUT,
      true,
      false
    );

    return captureKeyboardListeners({ onTab: captureFirstTab });
  }, [focusInput]);

  useEffect(() => {
    const input = inputRef.current!;

    function suppressFocus() {
      input.blur();
    }

    if (shouldSuppressFocus) {
      input.addEventListener('focus', suppressFocus);
    }

    return () => {
      input.removeEventListener('focus', suppressFocus);
    };
  }, [shouldSuppressFocus]);

  const isTouched = useDerivedState(
    () => Boolean(isActive && getHtml()),
    [isActive, getHtml]
  );

  const className = classNames('form-control', {
    touched: isTouched,
    'focus-disabled': shouldSuppressFocus,
  });

  return (
    <div
      id={id}
      onClick={shouldSuppressFocus ? onSuppressedFocus : undefined}
      dir={isRtl ? 'rtl' : undefined}
    >
      <div
        className={classNames('custom-scroll', SCROLLER_CLASS)}
        onScroll={onScroll}
        onClick={
          !isAttachmentModalInput && !canSendPlainText ? handleClick : undefined
        }
      >
        <div className='input-scroller-content'>
          <div
            ref={inputRef}
            id={editableInputId || EDITABLE_INPUT_ID}
            className={className}
            contentEditable={isAttachmentModalInput || canSendPlainText}
            role='textbox'
            dir='auto'
            tabIndex={0}
            onInput={handleChange}
            onClick={focusInput}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onMouseDown={handleMouseDown}
            onContextMenu={IS_ANDROID ? handleAndroidContextMenu : undefined}
            onTouchCancel={IS_ANDROID ? processSelectionWithTimeout : undefined}
            aria-label={placeholder}
          />

          {!forcedPlaceholder && (
            <span
              className={classNames(
                'placeholder-text',
                !isAttachmentModalInput && !canSendPlainText && 'with-icon'
              )}
              dir='auto'
            >
              {!isAttachmentModalInput && !canSendPlainText && (
                <i className='icon-lock-badge placeholder-icon' />
              )}
              {placeholder}
            </span>
          )}
          <canvas ref={sharedCanvasRef} className='shared-canvas' />
          <canvas ref={sharedCanvasHqRef} className='shared-canvas' />
          <div
            ref={absoluteContainerRef}
            className='absolute-video-container'
          />
        </div>
      </div>
      <div
        ref={scrollerCloneRef}
        className={classNames('custom-scroll', SCROLLER_CLASS, 'clone')}
      >
        <div className='input-scroller-content'>
          <div
            ref={cloneRef}
            className={classNames(className, 'clone')}
            dir='auto'
          />
        </div>
      </div>
      {captionLimit !== undefined && (
        <div className='max-length-indicator' dir='auto'>
          {captionLimit}
        </div>
      )}
      <TextFormatter
        isOpen={isTextFormatterOpen}
        anchorPosition={textFormatterAnchorPosition}
        selectedRange={selectedRange}
        setSelectedRange={setSelectedRange}
        onClose={handleCloseTextFormatter}
      />
      {forcedPlaceholder && (
        <span className='forced-placeholder'>
          {renderText(forcedPlaceholder!)}
        </span>
      )}
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId, threadId }: OwnProps): StateProps => {
    const { messageSendKeyCombo } = global.settings.byKey;

    return {
      messageSendKeyCombo,
      replyingToId:
        chatId && threadId
          ? selectReplyingToId(global, chatId, threadId)
          : undefined,
      isSelectModeActive: selectIsInSelectMode(global),
      canPlayAnimatedEmojis: selectCanPlayAnimatedEmojis(global),
    };
  })(MessageInput)
);
