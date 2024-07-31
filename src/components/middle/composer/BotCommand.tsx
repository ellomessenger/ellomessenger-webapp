import React, { FC, memo } from 'react';

import type { ApiBotCommand, ApiUser } from '../../../api/types';

import renderText from '../../common/helpers/renderText';

import ListItem from '../../ui/ListItem';
import Avatar from '../../common/Avatar';

import './BotCommand.scss';
import classNames from 'classnames';

type OwnProps = {
  botCommand: ApiBotCommand;
  bot?: ApiUser;
  withAvatar?: boolean;
  focus?: boolean;
  onClick: (botCommand: ApiBotCommand) => void;
};

const BotCommand: FC<OwnProps> = ({
  withAvatar,
  focus,
  botCommand,
  bot,
  onClick,
}) => {
  return (
    <ListItem
      key={botCommand.command}
      className={classNames('BotCommand chat-item-clickable scroll-item', {
        'with-avatar': withAvatar,
      })}
      multiline
      onClick={() => onClick(botCommand)}
      focus={focus}
    >
      {withAvatar && <Avatar size='small' peer={bot} />}
      <div className='content-inner'>
        <span className='title'>{renderText(botCommand.description)}</span>
        <span className='subtitle'>/{botCommand.command}</span>
      </div>
    </ListItem>
  );
};

export default memo(BotCommand);
