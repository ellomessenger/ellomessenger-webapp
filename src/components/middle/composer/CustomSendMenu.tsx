import type { FC } from 'react';
import React, { memo, useState } from 'react';

import { IS_TOUCH_ENV } from '../../../util/windowEnvironment';
import useMouseInside from '../../../hooks/useMouseInside';

import Menu from '../../ui/Menu';
import MenuItem from '../../ui/MenuItem';

import './CustomSendMenu.scss';
import { useTranslation } from 'react-i18next';
import useEffectWithPrevDeps from '../../../hooks/useEffectWithPrevDeps';

export type OwnProps = {
  isOpen: boolean;
  isOpenToBottom?: boolean;
  isSavedMessages?: boolean;
  canScheduleUntilOnline?: boolean;
  onSendSilent?: NoneToVoidFunction;
  onSendSchedule?: NoneToVoidFunction;
  onSendWhenOnline?: NoneToVoidFunction;
  onClose: NoneToVoidFunction;
  onCloseAnimationEnd?: NoneToVoidFunction;
};

const CustomSendMenu: FC<OwnProps> = ({
  isOpen,
  isOpenToBottom = false,
  isSavedMessages,
  canScheduleUntilOnline,
  onSendSilent,
  onSendSchedule,
  onSendWhenOnline,
  onClose,
  onCloseAnimationEnd,
}) => {
  const [handleMouseEnter, handleMouseLeave] = useMouseInside(isOpen, onClose);
  const [displayScheduleUntilOnline, setDisplayScheduleUntilOnline] =
    useState(false);

  const { t } = useTranslation();

  useEffectWithPrevDeps(
    ([prevIsOpen]) => {
      // Avoid context menu item shuffling when opened
      if (isOpen && !prevIsOpen) {
        setDisplayScheduleUntilOnline(Boolean(canScheduleUntilOnline));
      }
    },
    [isOpen, canScheduleUntilOnline]
  );

  return (
    <Menu
      isOpen={isOpen}
      autoClose
      positionX='right'
      positionY={isOpenToBottom ? 'top' : 'bottom'}
      className='CustomSendMenu with-menu-transitions'
      onClose={onClose}
      onCloseAnimationEnd={onCloseAnimationEnd}
      onMouseEnter={!IS_TOUCH_ENV ? handleMouseEnter : undefined}
      onMouseLeave={!IS_TOUCH_ENV ? handleMouseLeave : undefined}
      noCloseOnBackdrop={!IS_TOUCH_ENV}
    >
      {/* {onSendSilent && (
        <MenuItem icon='mute' onClick={onSendSilent}>
          {t('SendWithoutSound')}
        </MenuItem>
      )} */}
      {onSendSchedule && displayScheduleUntilOnline && (
        <MenuItem icon='schedule' onClick={onSendSchedule}>
          {t(isSavedMessages ? 'SetReminder' : 'ScheduleMessage')}
        </MenuItem>
      )}
    </Menu>
  );
};

export default memo(CustomSendMenu);
