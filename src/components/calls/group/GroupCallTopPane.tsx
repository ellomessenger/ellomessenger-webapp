import React, { FC, memo, useCallback, useEffect, useMemo } from 'react';
import { getActions, withGlobal } from '../../../global';

import type { ApiChat, ApiGroupCall, ApiUser } from '../../../api/types';
import type { AnimationLevel } from '../../../types';

import { selectChatGroupCall } from '../../../global/selectors/calls';
import buildClassName from '../../../util/buildClassName';
import { selectChat, selectTabState } from '../../../global/selectors';
import useLang from '../../../hooks/useLang';

import Button from '../../ui/Button';
import Avatar from '../../common/Avatar';

import './GroupCallTopPane.scss';

type OwnProps = {
  chatId: string;
  hasPinnedOffset: boolean;
  className?: string;
};

type StateProps = {
  groupCall?: ApiGroupCall;
  isActive: boolean;
  usersById: Record<string, ApiUser>;
  chatsById: Record<string, ApiChat>;
  animationLevel: AnimationLevel;
};

const GroupCallTopPane: FC<OwnProps & StateProps> = ({
  chatId,
  isActive,
  className,
  groupCall,
  hasPinnedOffset,
  usersById,
  chatsById,
  animationLevel,
}) => {
  const { requestMasterAndJoinGroupCall, subscribeToGroupCallUpdates } =
    getActions();

  const lang = useLang();

  const handleJoinGroupCall = useCallback(() => {
    requestMasterAndJoinGroupCall({
      chatId,
    });
  }, [requestMasterAndJoinGroupCall, chatId]);

  const participants = groupCall?.participants;

  const fetchedParticipants = useMemo(() => {
    if (participants) {
      return Object.values(participants)
        .filter((_, i) => i < 3)
        .map(({ id, isUser }) => {
          if (isUser) {
            if (!usersById[id]) {
              return undefined;
            }
            return { user: usersById[id] };
          } else {
            if (!chatsById[id]) {
              return undefined;
            }
            return { chat: chatsById[id] };
          }
        })
        .filter(Boolean);
    } else return [];
  }, [chatsById, participants, usersById]);

  useEffect(() => {
    if (!groupCall?.id) return undefined;
    if (!isActive && groupCall.isLoaded) return undefined;

    subscribeToGroupCallUpdates({
      id: groupCall.id,
      subscribed: true,
    });

    return () => {
      subscribeToGroupCallUpdates({
        id: groupCall.id,
        subscribed: false,
      });
    };
  }, [
    groupCall?.id,
    groupCall?.isLoaded,
    isActive,
    subscribeToGroupCallUpdates,
  ]);

  if (!groupCall) return null;

  return (
    <div
      className={buildClassName(
        'GroupCallTopPane',
        hasPinnedOffset && 'has-pinned-offset',
        !isActive && 'is-hidden',
        className
      )}
      onClick={handleJoinGroupCall}
    >
      <div className='info'>
        <span className='title'>{lang('VoipGroupVoiceChat')}</span>
        <span className='participants'>
          {lang('Participants', groupCall.participantsCount || 0, 'i')}
        </span>
      </div>
      <div className='avatars'>
        {fetchedParticipants.map((p) => {
          if (!p) return undefined;
          if (p.user) {
            return <Avatar key={p.user.id} peer={p.user} />;
          } else {
            return <Avatar key={p.chat.id} peer={p.chat} />;
          }
        })}
      </div>
      <Button round className='join'>
        {lang('VoipChatJoin')}
      </Button>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId }) => {
    const chat = selectChat(global, chatId)!;
    const groupCall = selectChatGroupCall(global, chatId);
    const activeGroupCallId = selectTabState(global).isMasterTab
      ? global.groupCalls.activeGroupCallId
      : undefined;
    return {
      groupCall,
      usersById: global.users.byId,
      chatsById: global.chats.byId,
      activeGroupCallId: global.groupCalls.activeGroupCallId,
      isActive:
        (!groupCall
          ? chat && chat.isCallNotEmpty && chat.isCallActive
          : groupCall.participantsCount > 0 && groupCall.isLoaded) &&
        activeGroupCallId !== groupCall?.id,
      animationLevel: global.settings.byKey.animationLevel,
    };
  })(GroupCallTopPane)
);
