import type { GroupCallParticipant as TypeGroupCallParticipant } from '../../../lib/secret-sauce';
import { getUserStreams, THRESHOLD } from '../../../lib/secret-sauce';
import type { FC } from 'react';
import React, { memo, useCallback } from 'react';
import { withGlobal } from '../../../global';

import type { ApiChat, ApiUser } from '../../../api/types';

import { GROUP_CALL_THUMB_VIDEO_DISABLED } from '../../../config';
import buildClassName from '../../../util/buildClassName';
import { selectChat, selectUser } from '../../../global/selectors';
import useLang from '../../../hooks/useLang';

import Avatar from '../../common/Avatar';

import './GroupCallParticipantVideo.scss';

type OwnProps = {
  participant: TypeGroupCallParticipant;
  type: 'video' | 'presentation';
  onClick?: (id: string, type: 'video' | 'presentation') => void;
  isFullscreen?: boolean;
};

type StateProps = {
  user?: ApiUser;
  chat?: ApiChat;
  currentUserId?: string;
  isActive?: boolean;
};

const GroupCallParticipantVideo: FC<OwnProps & StateProps> = ({
  type,
  onClick,
  user,
  chat,
  isActive,
  isFullscreen,
}) => {
  const lang = useLang();

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(user?.id || chat!.id, type);
    }
  }, [chat, onClick, type, user?.id]);

  if (!user && !chat) return null;

  const streams = getUserStreams(user?.id || chat!.id);

  return (
    <div
      className={buildClassName(
        'GroupCallParticipantVideo',
        isActive && 'active'
      )}
      onClick={handleClick}
    >
      {isFullscreen && (
        <button className='back-button'>
          <i className='icon-arrow-left' />
          {lang('Back')}
        </button>
      )}
      <Avatar peer={user || chat} className='thumbnail-avatar' />
      {!GROUP_CALL_THUMB_VIDEO_DISABLED && (
        <div className='thumbnail-wrapper'>
          <video
            className='thumbnail'
            muted
            autoPlay
            playsInline
            srcObject={streams?.[type]}
          />
        </div>
      )}
      <video
        className='video'
        muted
        autoPlay
        playsInline
        srcObject={streams?.[type]}
      />
      <div className='info'>
        <i className='icon-microphone-alt' />
        <span className='name'>{user?.firstName || chat?.title}</span>
        {type === 'presentation' && (
          <i className='last-icon icon-active-sessions' />
        )}
      </div>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { participant }): StateProps => {
    return {
      currentUserId: global.currentUserId,
      user: participant.isUser ? selectUser(global, participant.id) : undefined,
      chat: !participant.isUser
        ? selectChat(global, participant.id)
        : undefined,
      isActive: (participant.amplitude || 0) > THRESHOLD,
    };
  })(GroupCallParticipantVideo)
);
