import React, {
  memo,
  useEffect,
  useRef,
  FC,
  RefObject,
  CSSProperties,
} from 'react';

import useKeyboardListNavigation from '../../hooks/useKeyboardListNavigation';
import useVirtualBackdrop from '../../hooks/useVirtualBackdrop';
import useEffectWithPrevDeps from '../../hooks/useEffectWithPrevDeps';
import captureEscKeyListener from '../../util/captureEscKeyListener';
import useHistoryBack from '../../hooks/useHistoryBack';
import { preventMessageInputBlurWithBubbling } from '../middle/helpers/preventMessageInputBlur';
import { IS_BACKDROP_BLUR_SUPPORTED } from '../../util/windowEnvironment';

import Portal from './Portal';

import './Menu.scss';
import { dispatchHeavyAnimationEvent } from '../../hooks/useHeavyAnimationCheck';
import classNames from 'classnames';
import useShowTransition from '../../hooks/useShowTransition';
import useAppLayout from '../../hooks/useAppLayout';

type OwnProps = {
  elRef?: RefObject<HTMLDivElement>;
  containerRef?: RefObject<HTMLElement>;
  isOpen: boolean;
  id?: string;
  className?: string;
  bubbleClassName?: string;
  shouldCloseFast?: boolean;
  backdropExcludedSelector?: string;
  style?: CSSProperties;
  bubbleStyle?: CSSProperties;
  ariaLabelledBy?: string;
  transformOriginX?: number;
  transformOriginY?: number;
  positionX?: 'left' | 'right';
  positionY?: 'top' | 'bottom';
  autoClose?: boolean;
  shouldSkipTransition?: boolean;
  footer?: string;
  noCloseOnBackdrop?: boolean;
  noCompact?: boolean;
  notice?: string;
  onKeyDown?: (e: React.KeyboardEvent<any>) => void;
  onCloseAnimationEnd?: () => void;
  onClose: () => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseEnterBackdrop?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  withPortal?: boolean;
  children: React.ReactNode;
};

const ANIMATION_DURATION = 200;

const Menu: FC<OwnProps> = ({
  elRef,
  containerRef,
  isOpen,
  id,
  className,
  bubbleClassName = 'zoom-in',
  style,
  bubbleStyle,
  shouldCloseFast,
  backdropExcludedSelector,
  ariaLabelledBy,
  children,
  transformOriginX,
  transformOriginY,
  positionX = 'left',
  positionY = 'top',
  autoClose = false,
  footer,
  noCloseOnBackdrop = false,
  noCompact,
  notice,
  onCloseAnimationEnd,
  onClose,
  onMouseEnter,
  onMouseLeave,
  shouldSkipTransition,
  withPortal,
  onMouseEnterBackdrop,
}) => {
  let menuRef = useRef<HTMLDivElement>(null);
  if (elRef) {
    menuRef = elRef;
  }
  const { isTouchScreen } = useAppLayout();
  const backdropContainerRef = containerRef || menuRef;
  const { transitionClassNames } = useShowTransition(
    isOpen,
    onCloseAnimationEnd,
    shouldSkipTransition,
    undefined,
    shouldSkipTransition
  );

  useEffect(
    () => (isOpen ? captureEscKeyListener(onClose) : undefined),
    [isOpen, onClose]
  );

  useHistoryBack({
    isActive: isOpen,
    onBack: onClose,
    shouldBeReplaced: true,
  });

  useEffectWithPrevDeps(
    ([prevIsOpen]) => {
      if (isOpen || (!isOpen && prevIsOpen === true)) {
        dispatchHeavyAnimationEvent(ANIMATION_DURATION);
      }
    },
    [isOpen]
  );

  const handleKeyDown = useKeyboardListNavigation(
    menuRef,
    isOpen,
    autoClose ? onClose : undefined,
    undefined,
    true
  );

  useVirtualBackdrop(
    isOpen,
    backdropContainerRef,
    noCloseOnBackdrop ? undefined : onClose,
    undefined,
    backdropExcludedSelector
  );

  const bubbleFullClassName = classNames(
    'bubble menu-container custom-scroll fast',
    positionY,
    positionX,
    bubbleClassName,
    transitionClassNames,
    { 'with-notice': notice, 'close-fast': shouldCloseFast }
  );

  const transformOriginYStyle =
    transformOriginY !== undefined ? `${transformOriginY}px` : undefined;
  const transformOriginXStyle =
    transformOriginX !== undefined ? `${transformOriginX}px` : undefined;

  const menu = (
    <div
      id={id}
      className={classNames('Menu no-selection', className, {
        compact: !noCompact,
        'no-blur': !IS_BACKDROP_BLUR_SUPPORTED,
      })}
      style={style}
      aria-labelledby={ariaLabelledBy}
      role={ariaLabelledBy ? 'menu' : undefined}
      onKeyDown={isOpen ? handleKeyDown : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={isOpen ? onMouseLeave : undefined}
    >
      {isOpen && !noCloseOnBackdrop && (
        // This only prevents click events triggering on underlying elements
        <div
          className='backdrop'
          onMouseDown={preventMessageInputBlurWithBubbling}
          onMouseEnter={onMouseEnterBackdrop}
        />
      )}

      <div
        role='presentation'
        ref={menuRef}
        className={bubbleFullClassName}
        onClick={autoClose ? onClose : undefined}
        style={{
          transformOrigin: `${transformOriginXStyle || positionX} ${
            transformOriginYStyle || positionY
          }`,
        }}
      >
        {children}
        {notice && <div className='notice'>{notice}</div>}
        {footer && <div className='footer'>{footer}</div>}
      </div>
    </div>
  );

  if (withPortal) {
    return <Portal>{menu}</Portal>;
  }

  return menu;
};

export default memo(Menu);
