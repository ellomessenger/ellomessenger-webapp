import React, {
  useRef,
  useCallback,
  useState,
  FC,
  MouseEvent as ReactMouseEvent,
  RefObject,
  CSSProperties,
} from 'react';

import Spinner from './Spinner';
import RippleEffect from './RippleEffect';

import './Button.scss';
import classNames from 'classnames';
import { IS_TOUCH_ENV, MouseButton } from '../../util/windowEnvironment';

export type OwnProps = {
  elRef?: RefObject<HTMLButtonElement | HTMLAnchorElement>;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  size?: 'default' | 'smaller' | 'tiny';
  color?:
    | 'primary'
    | 'secondary'
    | 'green'
    | 'gray'
    | 'danger'
    | 'translucent'
    | 'translucent-white'
    | 'translucent-black'
    | 'border-btn'
    | 'dark'
    | 'blue'
    | 'light-blue';
  fullWidth?: boolean;
  backgroundImage?: string;
  id?: string;
  className?: string;
  round?: boolean;
  pill?: boolean;
  fluid?: boolean;
  isText?: boolean;
  isLink?: boolean;
  isLoading?: boolean;
  ariaLabel?: string;
  ariaControls?: string;
  hasPopup?: boolean;
  href?: string;
  noFastClick?: boolean;
  download?: string;
  disabled?: boolean;
  allowDisabledClick?: boolean;
  ripple?: boolean;
  faded?: boolean;
  tabIndex?: number;
  isRtl?: boolean;
  isShiny?: boolean;
  outline?: boolean;
  withPremiumGradient?: boolean;
  noPreventDefault?: boolean;
  shouldStopPropagation?: boolean;
  style?: CSSProperties;
  onClick?: (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onContextMenu?: (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onMouseDown?: (e: ReactMouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (e: ReactMouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: NoneToVoidFunction;
  onFocus?: NoneToVoidFunction;
  onTransitionEnd?: NoneToVoidFunction;
};

// Longest animation duration;
const CLICKED_TIMEOUT = 400;

const Button: FC<OwnProps> = ({
  elRef,
  type = 'button',
  id,
  onClick,
  onContextMenu,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  children,
  size = 'default',
  color = 'primary',
  fullWidth,
  backgroundImage,
  className,
  round,
  pill,
  fluid,
  noFastClick = color === 'danger',
  isText,
  isLink,
  isLoading,
  isShiny,
  withPremiumGradient,
  onTransitionEnd,
  ariaLabel,
  ariaControls,
  hasPopup,
  href,
  download,
  disabled,
  outline,
  allowDisabledClick,
  ripple,
  faded,
  tabIndex,
  isRtl,
  noPreventDefault,
  shouldStopPropagation,
  style,
}) => {
  let elementRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  if (elRef) {
    elementRef = elRef;
  }

  const [isClicked, setIsClicked] = useState(false);
  const fullClassName = classNames('Button', className, size, color, {
    round,
    pill,
    fluid,
    disabled,
    'click-allowed': allowDisabledClick,
    text: isText,
    link: isLink,
    loading: isLoading,
    'has-ripple': ripple,
    faded,
    outline,
    clicked: isClicked,
    'with-image': backgroundImage,
    shiny: isShiny,
    premium: withPremiumGradient,
    'full-width': fullWidth,
  });

  const handleClick = useCallback(
    (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      if ((allowDisabledClick || !disabled) && onClick) {
        onClick(e);
      }

      if (shouldStopPropagation) {
        e.stopPropagation();
      }

      setIsClicked(true);
      setTimeout(() => {
        setIsClicked(false);
      }, CLICKED_TIMEOUT);
    },
    [allowDisabledClick, disabled, onClick, shouldStopPropagation]
  );

  const handleMouseDown = useCallback(
    (e: ReactMouseEvent<HTMLButtonElement>) => {
      if (!noPreventDefault) e.preventDefault();

      if ((allowDisabledClick || !disabled) && onMouseDown) {
        onMouseDown(e);
      }

      if (!IS_TOUCH_ENV && e.button === MouseButton.Main && !noFastClick) {
        handleClick(e);
      }
    },
    [allowDisabledClick, disabled, noPreventDefault, onMouseDown]
  );

  if (href) {
    return (
      <a
        ref={elementRef as RefObject<HTMLAnchorElement>}
        id={id}
        className={fullClassName}
        href={href}
        title={ariaLabel}
        download={download}
        tabIndex={tabIndex}
        dir={isRtl ? 'rtl' : undefined}
        aria-label={ariaLabel}
        aria-controls={ariaControls}
        target='_blank'
        onTransitionEnd={onTransitionEnd}
      >
        {children}
        {!disabled && ripple && <RippleEffect />}
      </a>
    );
  }

  return (
    <button
      ref={elementRef as RefObject<HTMLButtonElement>}
      id={id}
      type={type}
      className={fullClassName}
      onClick={handleClick}
      onContextMenu={onContextMenu}
      //onMouseDown={handleMouseDown}
      onMouseEnter={onMouseEnter && !disabled ? onMouseEnter : undefined}
      onMouseLeave={onMouseLeave && !disabled ? onMouseLeave : undefined}
      onTransitionEnd={onTransitionEnd}
      onFocus={onFocus && !disabled ? onFocus : undefined}
      aria-label={ariaLabel}
      aria-controls={ariaControls}
      aria-haspopup={hasPopup}
      title={ariaLabel}
      tabIndex={tabIndex}
      dir={isRtl ? 'rtl' : undefined}
      style={{
        ...style,
        backgroundImage: backgroundImage
          ? `url(${backgroundImage})`
          : undefined,
      }}
    >
      {isLoading ? (
        <div>
          <span dir={isRtl ? 'auto' : undefined}>Please wait...</span>
          <Spinner color={isText ? 'blue' : 'white'} />
        </div>
      ) : (
        <>{children}</>
      )}
      {!disabled && ripple && <RippleEffect />}
    </button>
  );
};

export default Button;
