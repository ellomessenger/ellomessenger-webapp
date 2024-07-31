import React, { FC, memo } from 'react';

import ListItem from '../../ui/ListItem';

import { getActions, withGlobal } from '../../../global';
import useLastCallback from '../../../hooks/useLastCallback';

import './Chat.scss';
import Avatar from '../../common/Avatar';
import { ApiChat, ApiUser } from '../../../api/types';
import { selectChat } from '../../../global/selectors';
import { AI_BOT } from '../../../global/actions/api/bots';
import Skeleton from '../../ui/Skeleton';

type OwnProps = {
  chatId: string;
};

type StateProps = {
  chat?: ApiChat;
};

const ChatBot: FC<OwnProps & StateProps> = ({ chatId, chat }) => {
  const { openChat } = getActions();
  const handleClick = useLastCallback(() => {
    openChat(
      { id: chatId, shouldReplaceHistory: true },
      { forceOnHeavyAnimation: true }
    );
  });

  return (
    <ListItem
      className='chat-item-clickable subscriptions-item underline'
      onClick={handleClick}
      ripple
    >
      {chat ? (
        <>
          <div className='status'>
            <Avatar peer={chat} />
          </div>
          <div className='info'>
            <div className='info-row'>
              <div className='title FullNameTitle-module__root'>
                <h3 dir='auto' className='fullName'>
                  {chat?.title === 'AI Cancer prevention' ? 'Cancer prevention' : chat?.title}
                </h3>
              </div>
            </div>
            <div className='subtitle'>
              <span className='amount'>
                <span className='text-secondary '>
                  {chat.fullInfo?.about || AI_BOT[chatId]?.descr}
                </span>
              </span>
            </div>
          </div>
        </>
      ) : (
        <Skeleton height={73} />
      )}
    </ListItem>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId }): StateProps => {
    const chat = selectChat(global, chatId);
    if (!chat) {
      return {};
    }
    return {
      chat,
    };
  })(ChatBot)
);
