import React, { FC, memo, useCallback, useEffect } from 'react';

import { IS_TOUCH_ENV } from '../../../util/windowEnvironment';

import useMouseInside from '../../../hooks/useMouseInside';
import useFlag from '../../../hooks/useFlag';

import ResponsiveHoverButton from '../../ui/ResponsiveHoverButton';
import Menu from '../../ui/Menu';
import MenuItem from '../../ui/MenuItem';

import './AttachMenu.scss';
import { useTranslation } from 'react-i18next';
import IconSvg from '../../ui/IconSvg';

export type OwnProps = {};

const SettingsMenu: FC<OwnProps> = ({}) => {
  const [isAttachMenuOpen, openAttachMenu, closeAttachMenu] = useFlag();
  const [handleMouseEnter, handleMouseLeave, markMouseInside] = useMouseInside(
    isAttachMenuOpen,
    closeAttachMenu
  );

  const { t } = useTranslation();

  const [
    isAttachmentBotMenuOpen,
    markAttachmentBotMenuOpen,
    unmarkAttachmentBotMenuOpen,
  ] = useFlag();
  useEffect(() => {
    if (isAttachMenuOpen) {
      markMouseInside();
    }
  }, [isAttachMenuOpen, markMouseInside]);

  const handleToggleAttachMenu = useCallback(() => {
    if (isAttachMenuOpen) {
      closeAttachMenu();
    } else {
      openAttachMenu();
    }
  }, [isAttachMenuOpen, openAttachMenu, closeAttachMenu]);

  return (
    <div className='AttachMenu'>
      <ResponsiveHoverButton
        id='attach-menu-button'
        className={
          isAttachMenuOpen
            ? 'AttachMenu--button activated'
            : 'AttachMenu--button'
        }
        round
        color='translucent'
        onActivate={handleToggleAttachMenu}
        ariaLabel='Add an attachment'
        ariaControls='attach-menu-controls'
        hasPopup
      >
        <i className='icon-svg'>
          <IconSvg name='settings' />
        </i>
      </ResponsiveHoverButton>
      <Menu
        id='attach-menu-controls'
        isOpen={isAttachMenuOpen || isAttachmentBotMenuOpen}
        autoClose
        positionX='right'
        positionY='bottom'
        onClose={closeAttachMenu}
        className='AttachMenu--menu fluid'
        onCloseAnimationEnd={closeAttachMenu}
        onMouseEnter={!IS_TOUCH_ENV ? handleMouseEnter : undefined}
        onMouseLeave={!IS_TOUCH_ENV ? handleMouseLeave : undefined}
        noCloseOnBackdrop={!IS_TOUCH_ENV}
        ariaLabelledBy='attach-menu-button'
      >
        <MenuItem customIcon={<IconSvg name='wallet' />} onClick={() => true}>
          {t('Attach.SendFunds')}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default memo(SettingsMenu);
