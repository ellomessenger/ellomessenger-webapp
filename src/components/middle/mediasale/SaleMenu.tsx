import React, { FC, memo, useCallback, useEffect } from 'react';

import { IS_TOUCH_ENV } from '../../../util/windowEnvironment';

import useMouseInside from '../../../hooks/useMouseInside';
import useFlag from '../../../hooks/useFlag';

import ResponsiveHoverButton from '../../ui/ResponsiveHoverButton';
import Menu from '../../ui/Menu';
import MenuItem from '../../ui/MenuItem';

import '../../middle/composer/AttachMenu.scss';
import { useTranslation } from 'react-i18next';
import IconSvg from '../../ui/IconSvg';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import { MiddleColumnContent } from '../../../types';
import { getActions } from '../../../global';
import MiddleColumn from '../MiddleColumn';

const SaleMenu: FC = () => {
  const { setMiddleScreen } = getActions();
  const [isAttachMenuOpen, openAttachMenu, closeAttachMenu] = useFlag();
  const [handleMouseEnter, handleMouseLeave, markMouseInside] = useMouseInside(
    isAttachMenuOpen,
    closeAttachMenu
  );
  const [isOpenModal, openModal, closeModal] = useFlag();

  const { t } = useTranslation();

  const [
    isAttachmentBotMenuOpen,
    markAttachmentBotMenuOpen,
    unmarkAttachmentBotMenuOpen,
  ] = useFlag();

  const handleSaleAgree = useCallback(() => {
    closeModal();
    setMiddleScreen({ screen: MiddleColumnContent.MediaSale });
  }, [setMiddleScreen]);

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
        id='sale-menu-button'
        className={
          isAttachMenuOpen
            ? 'AttachMenu--button activated'
            : 'AttachMenu--button'
        }
        round
        color='translucent'
        onActivate={handleToggleAttachMenu}
        ariaLabel='Add an media sale'
        ariaControls='attach-menu-controls'
        hasPopup
      >
        <i className='icon-svg'>
          <IconSvg name='money' />
        </i>
      </ResponsiveHoverButton>
      <Menu
        id='sale-menu-controls'
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
        <MenuItem onClick={openModal}>{t('Channel.CreateMediaSale')}</MenuItem>
        <MenuItem onClick={() => true}>{t('Channel.CreateDonations')}</MenuItem>
      </Menu>
      <Modal
        className='confirm'
        isOpen={isOpenModal}
        onClose={closeModal}
        hasCloseButton
        centered
      >
        <div className='modal-content'>
          <h3>{t('SellingMedia')}</h3>
          <p>{t('SellingMediaInfo')}</p>
          <div className='dialog-buttons-column'>
            <Button fullWidth onClick={handleSaleAgree}>
              {t('Agree')}
            </Button>
            <Button fullWidth outline onClick={closeModal}>
              {t('Cancel')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default memo(SaleMenu);
