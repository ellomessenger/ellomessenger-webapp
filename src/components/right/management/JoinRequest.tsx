import type { FC } from 'react';
import React, { memo, useCallback } from 'react';
import { getActions, withGlobal } from '../../../global';

import type { AnimationLevel } from '../../../types';
import type { ApiUser } from '../../../api/types';

import useLang from '../../../hooks/useLang';
import { getUserFullName } from '../../../global/helpers';
import { selectUser } from '../../../global/selectors';
import { formatHumanDate, formatTime, isToday } from '../../../util/dateFormat';
import { getServerTime } from '../../../util/serverTime';
import { createClassNameBuilder } from '../../../util/buildClassName';

import Avatar from '../../common/Avatar';
import Button from '../../ui/Button';

import './JoinRequest.scss';

type OwnProps = {
  userId: string;
  about?: string;
  isChannel?: boolean;
  date: number;
  chatId: string;
};

type StateProps = {
  user?: ApiUser;
  isSavedMessages?: boolean;
  animationLevel: AnimationLevel;
};

const JoinRequest: FC<OwnProps & StateProps> = ({
  userId,
  chatId,
  about,
  date,
  isChannel,
  user,
  animationLevel,
}) => {
  const { openChat, hideChatJoinRequest } = getActions();

  const buildClassName = createClassNameBuilder('JoinRequest');
  const lang = useLang();

  const fullName = getUserFullName(user);
  const fixedDate = (date - getServerTime()) * 1000 + Date.now();

  const dateString = isToday(new Date(fixedDate))
    ? formatTime(lang, fixedDate)
    : formatHumanDate(lang, fixedDate, true, false, true);

  const handleUserClick = () => {
    openChat({ id: userId });
  };

  const handleAcceptRequest = useCallback(() => {
    hideChatJoinRequest({ chatId, userId, isApproved: true });
  }, [chatId, hideChatJoinRequest, userId]);

  const handleRejectRequest = useCallback(() => {
    hideChatJoinRequest({ chatId, userId, isApproved: false });
  }, [chatId, hideChatJoinRequest, userId]);

  return (
    <div className={buildClassName('&')}>
      <div className={buildClassName('top')}>
        <div className={buildClassName('user')} onClick={handleUserClick}>
          <Avatar key={userId} size='medium' peer={user} withVideo />
          <div className={buildClassName('user-info')}>
            <div className={buildClassName('user-name')}>{fullName}</div>
            <div className={buildClassName('user-subtitle')}>{about}</div>
          </div>
        </div>
        <div className={buildClassName('date')}>{dateString}</div>
      </div>
      <div className={buildClassName('buttons')}>
        <Button
          className={buildClassName('button')}
          onClick={handleAcceptRequest}
        >
          {isChannel ? lang('ChannelAddToChannel') : lang('ChannelAddToGroup')}
        </Button>
        <Button
          className={buildClassName('button')}
          isText
          onClick={handleRejectRequest}
        >
          {lang('DismissRequest')}
        </Button>
      </div>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { userId }): StateProps => {
    const user = selectUser(global, userId);

    return {
      user,
      animationLevel: global.settings.byKey.animationLevel,
    };
  })(JoinRequest)
);
