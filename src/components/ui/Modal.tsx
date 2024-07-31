import React, {
  FC,
  RefObject,
  ReactNode,
  useEffect,
  useRef,
  CSSProperties,
} from 'react';

import type { TextPart } from '../../types';

import captureKeyboardListeners from '../../util/captureKeyboardListeners';
import trapFocus from '../../util/trapFocus';
import {
  enableDirectTextInput,
  disableDirectTextInput,
} from '../../util/directInputManager';
import { dispatchHeavyAnimationEvent } from '../../hooks/useHeavyAnimationCheck';
import useEffectWithPrevDeps from '../../hooks/useEffectWithPrevDeps';
import useHistoryBack from '../../hooks/useHistoryBack';

import Button from './Button';
import Portal from './Portal';

import './Modal.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import useShowTransition from '../../hooks/useShowTransition';
import IconSvg from './IconSvg';

const ANIMATION_DURATION = 200;

type OwnProps = {
  title?: string | TextPart[];
  className?: string;
  classWrapper?: string;
  centered?: boolean;
  isOpen?: boolean;
  header?: ReactNode;
  isSlim?: boolean;
  hasCloseButton?: boolean;
  noBackdrop?: boolean;
  noBackdropClose?: boolean;
  children: ReactNode;
  style?: CSSProperties;
  notScroll?: boolean;
  onClose: () => void;
  onCloseAnimationEnd?: () => void;
  onEnter?: () => void;
  dialogRef?: RefObject<HTMLDivElement>;
};

type StateProps = {
  shouldSkipHistoryAnimations?: boolean;
};

const Modal: FC<OwnProps & StateProps> = ({
  dialogRef,
  title,
  className,
  classWrapper,
  isOpen,
  isSlim,
  header,
  hasCloseButton,
  noBackdrop,
  noBackdropClose,
  children,
  notScroll,
  style,
  centered,
  onClose,
  onCloseAnimationEnd,
  onEnter,
  shouldSkipHistoryAnimations,
}) => {
  const { shouldRender, transitionClassNames } = useShowTransition(
    isOpen,
    onCloseAnimationEnd,
    shouldSkipHistoryAnimations,
    undefined,
    shouldSkipHistoryAnimations
  );
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    disableDirectTextInput();

    return enableDirectTextInput;
  }, [isOpen]);

  useEffect(
    () =>
      isOpen
        ? captureKeyboardListeners({ onEsc: onClose, onEnter })
        : undefined,
    [isOpen, onClose, onEnter]
  );
  useEffect(
    () =>
      isOpen && modalRef.current ? trapFocus(modalRef.current) : undefined,
    [isOpen]
  );

  useHistoryBack({
    isActive: isOpen,
    onBack: onClose,
  });

  useEffectWithPrevDeps(
    ([prevIsOpen]) => {
      document.body.classList.toggle('has-open-dialog', Boolean(isOpen));

      if (isOpen || (!isOpen && prevIsOpen !== undefined)) {
        dispatchHeavyAnimationEvent(ANIMATION_DURATION);
      }

      return () => {
        document.body.classList.remove('has-open-dialog');
      };
    },
    [isOpen]
  );

  const { t } = useTranslation();

  if (!shouldRender) {
    return null;
  }

  function renderHeader() {
    if (hasCloseButton || header || title) {
      return (
        <div className='modal-header'>
          {hasCloseButton && (
            <Button
              round
              color='translucent'
              size='smaller'
              ariaLabel={String(t('Close'))}
              onClick={onClose}
            >
              <i className='icon-svg'>
                <IconSvg name='close' />
              </i>
            </Button>
          )}
          {header}
          {title && <div className='modal-title'>{title}</div>}
        </div>
      );
    }
  }

  const fullClassName = classNames(
    'Modal custom-scroll',
    className,
    transitionClassNames,
    {
      'transparent-backdrop': noBackdrop,
      slim: isSlim,
      notScroll,
    }
  );

  return (
    <Portal>
      <div ref={modalRef} className={fullClassName} tabIndex={-1} role='dialog'>
        <div className={classNames('modal-container', { centered })}>
          <div
            className='modal-backdrop'
            onClick={!noBackdropClose ? onClose : undefined}
          />
          <div
            className={classNames('modal-dialog', {
              'custom-scroll': !notScroll,
            })}
            ref={dialogRef}
          >
            {renderHeader()}
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
