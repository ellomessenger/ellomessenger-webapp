import React, { FC, useCallback } from 'react';

import { IS_TEST } from '../../config';

import './MenuItem.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { SettingsScreens } from '../../types';

export type MenuItemProps = {
  icon?: string;
  customIcon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  onClick?: (
    e: React.SyntheticEvent<HTMLDivElement | HTMLAnchorElement>,
    arg?: number
  ) => void;
  clickArg?: number;
  onContextMenu?: (e: React.UIEvent) => void;
  href?: string;
  download?: string;
  disabled?: boolean;
  destructive?: boolean;
  ariaLabel?: string;
  withWrap?: boolean;
  onScreenSelect?: (screen: SettingsScreens) => void;
  page?: SettingsScreens;
};

const MenuItem: FC<MenuItemProps> = (props) => {
  const {
    icon,
    customIcon,
    className,
    children,
    onClick,
    href,
    download,
    disabled,
    destructive,
    ariaLabel,
    withWrap,
    onContextMenu,
    clickArg,
    onScreenSelect,
    page,
  } = props;

  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      page && onScreenSelect?.(page);

      if (disabled || !onClick) {
        e.stopPropagation();
        e.preventDefault();

        return;
      }

      onClick(e, clickArg);
    },
    [clickArg, disabled, onClick]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.keyCode !== 13 && e.keyCode !== 32) {
        return;
      }

      if (disabled || !onClick) {
        e.stopPropagation();
        e.preventDefault();
        return;
      }

      onClick(e, clickArg);
    },
    [clickArg, disabled, onClick]
  );

  const fullClassName = classNames('MenuItem', className, {
    disabled,
    destructive,
    // compact: IS_COMPACT_MENU,
    wrap: withWrap,
  });

  const content = (
    <>
      {!customIcon && icon && (
        <i
          className={`icon-${icon}`}
          data-char={
            icon.startsWith('char-') ? icon.replace('char-', '') : undefined
          }
        />
      )}
      {!icon && customIcon && <i className='svg-icon'>{customIcon}</i>}
      {children}
    </>
  );

  if (href) {
    return (
      <a
        tabIndex={0}
        className={fullClassName}
        href={href}
        download={download}
        aria-label={ariaLabel}
        title={ariaLabel}
        target={
          href.startsWith(window.location.origin) || IS_TEST
            ? '_self'
            : '_blank'
        }
        rel='noopener noreferrer'
        dir={isRtl ? 'rtl' : undefined}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      role='menuitem'
      tabIndex={0}
      className={fullClassName}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onContextMenu={onContextMenu}
      aria-label={ariaLabel}
      title={ariaLabel}
      dir={isRtl ? 'rtl' : undefined}
    >
      {content}
    </div>
  );
};

export default MenuItem;
