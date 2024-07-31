import React, {
  FC,
  useState,
  useEffect,
  memo,
  useCallback,
  useMemo,
} from 'react';

import Button from '../ui/Button';
import Menu from '../ui/Menu';
import MenuItem from '../ui/MenuItem';

import './NewChatButton.scss';
import { useTranslation } from 'react-i18next';
import IconSvg from '../ui/IconSvg';
import classNames from 'classnames';
import { LeftColumnContent } from '../../types';
import { getActions } from '../../global';
import useAppLayout from '../../hooks/useAppLayout';

type OwnProps = {
  isShown: boolean;
  screen: LeftColumnContent;
  isMenuOpen: boolean;
  onNewPrivateChat: () => void;
  onNewChannel: () => void;
  onNewGroup: () => void;
  onNewCourse: () => void;
  onNewMediaSale: () => void;
};

const NewChatButton: FC<OwnProps> = ({
  isShown,
  screen,
  isMenuOpen,
  onNewPrivateChat,
  onNewChannel,
  onNewGroup,
  onNewCourse,
  onNewMediaSale,
}) => {
  const { setMenuShow } = getActions();

  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';

  const toggleIsMenuOpen = useCallback(() => {
    setMenuShow(!isMenuOpen);
  }, [isMenuOpen]);

  const handleClose = useCallback(() => {
    setMenuShow(false);
  }, []);

  useEffect(() => {
    if (!isShown) {
      setMenuShow(false);
    }
  }, [isShown]);

  const menuItems = useMemo(
    () => (
      <>
        <MenuItem
          customIcon={<IconSvg name='users' w='25' h='25' />}
          onClick={onNewGroup}
        >
          {t('ChatList.new_group')}
        </MenuItem>
        <MenuItem
          customIcon={<IconSvg name='keyboard-open' />}
          onClick={onNewChannel}
        >
          {t('ChatList.new_channel')}
        </MenuItem>
        <MenuItem
          customIcon={<IconSvg name='online-course' />}
          onClick={onNewCourse}
        >
          {t('ChatList.new_course')}
        </MenuItem>
        <MenuItem customIcon={<IconSvg name='message' />} onClick={() => true}>
          {t('ChatList.new_messages')}
        </MenuItem>
        {/* <MenuItem
          customIcon={<IconSvg name='money' />}
          onClick={onNewMediaSale}
        >
          {t('ChatList.new_media_sale')}
        </MenuItem> */}
      </>
    ),
    [t, onNewChannel, onNewGroup, onNewCourse, onNewMediaSale, onNewPrivateChat]
  );

  return (
    <div
      className={classNames('NewChatButton', {
        revealed: isShown,
        'menu-is-open': isMenuOpen,
      })}
      dir={isRtl ? 'rtl' : undefined}
    >
      <Button
        round
        color='primary'
        className={isMenuOpen ? 'active' : ''}
        onClick={toggleIsMenuOpen}
        ariaLabel={String(t(isMenuOpen ? 'Close' : 'NewMessageTitle'))}
        tabIndex={-1}
      >
        <i className='icon-svg plus'>
          <IconSvg
            name={screen === LeftColumnContent.Contacts ? 'user-plus' : 'plus'}
          />
        </i>
        <i className='icon-svg close'>
          <IconSvg name='close' />
        </i>
      </Button>
      <Menu
        isOpen={isMenuOpen}
        positionX={isRtl ? 'left' : 'right'}
        positionY='bottom'
        bubbleClassName='zoom-in'
        autoClose
        noCloseOnBackdrop
        onClose={handleClose}
      >
        {menuItems}
      </Menu>
    </div>
  );
};

export default memo(NewChatButton);
