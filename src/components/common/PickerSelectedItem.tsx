import React, { FC, ReactNode, memo } from 'react';
import { withGlobal } from '../../global';

import type { ApiChat, ApiUser } from '../../api/types';

import { selectChat, selectUser } from '../../global/selectors';
import {
  getChatTitle,
  getUserFirstOrLastName,
  isDeletedUser,
  isUserId,
} from '../../global/helpers';
import renderText from './helpers/renderText';

import Avatar from './Avatar';

import './PickerSelectedItem.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

type OwnProps = {
  chatOrUserId?: string;
  icon?: string;
  title?: string;
  isMinimized?: boolean;
  canClose?: boolean;
  onClick: (arg: any) => void;
  clickArg: any;
  className?: string;
};

type StateProps = {
  chat?: ApiChat;
  user?: ApiUser;
  currentUserId?: string;
};

const PickerSelectedItem: FC<OwnProps & StateProps> = ({
  icon,
  title,
  isMinimized,
  canClose,
  clickArg,
  chat,
  user,
  className,
  currentUserId,
  onClick,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';

  let iconElement: ReactNode | undefined;
  let titleText: any;

  if (icon && title) {
    iconElement = (
      <div className='item-icon'>
        <i className={`icon-${icon}`} />
      </div>
    );

    titleText = title;
  } else if (chat || user) {
    iconElement = (
      <Avatar peer={chat || user} size='tiny' isSavedMessages={user?.isSelf} />
    );

    const name =
      !chat || (user && !user.isSelf)
        ? getUserFirstOrLastName(user)
        : getChatTitle(t, chat, chat.id === currentUserId);

    titleText = name ? renderText(name) : undefined;
  }

  const fullClassName = classNames('PickerSelectedItem', className, {
    'forum-avatar': chat?.isForum,
    minimized: isMinimized,
    closeable: canClose,
  });

  return (
    <div
      className={fullClassName}
      onClick={() => onClick(clickArg)}
      title={isMinimized ? titleText : undefined}
      dir={isRtl ? 'rtl' : undefined}
    >
      {iconElement}
      {!isMinimized && (
        <div className='item-name' dir='auto'>
          {titleText}
        </div>
      )}
      {canClose && (
        <div className='item-remove'>
          <i className='icon-close' />
        </div>
      )}
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatOrUserId }): StateProps => {
    if (!chatOrUserId) {
      return {};
    }

    const chat = chatOrUserId ? selectChat(global, chatOrUserId) : undefined;
    const user = isUserId(chatOrUserId)
      ? selectUser(global, chatOrUserId)
      : undefined;

    return {
      chat,
      user,
      currentUserId: global.currentUserId,
    };
  })(PickerSelectedItem)
);
