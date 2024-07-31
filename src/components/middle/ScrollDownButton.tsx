import React, { FC, memo, useRef } from 'react';

import { formatIntegerCompact } from '../../util/textFormat';
import useContextMenuHandlers from '../../hooks/useContextMenuHandlers';

import Menu from '../ui/Menu';
import Button from '../ui/Button';
import MenuItem from '../ui/MenuItem';
import IconSvg from '../ui/IconSvg';

import styles from './ScrollDownButton.module.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

type OwnProps = {
  icon: string;
  ariaLabelLang: string;
  unreadCount?: number;
  onClick: VoidFunction;
  onReadAll?: VoidFunction;
  className?: string;
};

const ScrollDownButton: FC<OwnProps> = ({
  icon,
  ariaLabelLang,
  unreadCount,
  onClick,
  onReadAll,
  className,
}) => {
  const { t } = useTranslation();

  const ref = useRef<HTMLDivElement>(null);
  const {
    isContextMenuOpen,
    handleContextMenu,
    handleContextMenuClose,
    handleContextMenuHide,
  } = useContextMenuHandlers(ref, !onReadAll);

  return (
    <div className={classNames(styles.root, className)} ref={ref}>
      <Button
        color='secondary'
        round
        className={styles.button}
        onClick={onClick}
        onContextMenu={handleContextMenu}
        ariaLabel={String(t(ariaLabelLang))}
      >
        <i className='icon-svg'>
          <IconSvg name={icon} w='22' h='22' />
        </i>
      </Button>
      {Boolean(unreadCount) && (
        <div className={styles.unreadCount}>
          {formatIntegerCompact(unreadCount)}
        </div>
      )}
      {onReadAll && (
        <Menu
          isOpen={isContextMenuOpen}
          onClose={handleContextMenuClose}
          onCloseAnimationEnd={handleContextMenuHide}
          autoClose
          positionX='right'
          positionY='bottom'
        >
          <MenuItem icon='readchats' onClick={onReadAll}>
            {t('MarkAllAsRead')}
          </MenuItem>
        </Menu>
      )}
    </div>
  );
};

export default memo(ScrollDownButton);
