import React, { memo, useCallback, useMemo } from 'react';
import { getActions, getGlobal } from '../../../global';

import type { FC } from 'react';
import type { ObserveFn } from '../../../hooks/useIntersectionObserver';
import type {
  ApiAvailableReaction,
  ApiMessage,
  ApiReaction,
  ApiReactionCount,
  ApiStickerSet,
  ApiUser,
} from '../../../api/types';
import type { ActiveReaction } from '../../../global/types';

import buildClassName from '../../../util/buildClassName';
import { formatIntegerCompact } from '../../../util/textFormat';
import {
  isSameReaction,
  isReactionChosen,
  getMessageKey,
} from '../../../global/helpers';

import Button from '../../ui/Button';
import Avatar from '../../common/Avatar';
import ReactionAnimatedEmoji from './ReactionAnimatedEmoji';
import AnimatedCounter from '../../common/AnimatedCounter';

import './Reactions.scss';

const ReactionButton: FC<{
  reaction: ApiReactionCount;
  message: ApiMessage;
  activeReactions?: ActiveReaction[];
  availableReactions?: ApiAvailableReaction[];
  withRecentReactors?: boolean;
  genericEffects?: ApiStickerSet;
  observeIntersection?: ObserveFn;
  effectReactin?: ApiReaction | undefined;
  setEffectReactin?: (value: ApiReaction | undefined) => void;
  forwardInfo?: any;
  hasGroup?: boolean | undefined;
  isOwn?: boolean;
}> = ({
  reaction,
  message,
  genericEffects,
  withRecentReactors,
  observeIntersection,
  effectReactin,
  setEffectReactin,
  forwardInfo,
  hasGroup,
  isOwn,
}) => {
  const { toggleReaction } = getActions();
  const { recentReactions } = message.reactions!;

  const recentReactors = useMemo(() => {
    if (!withRecentReactors || !recentReactions) {
      return undefined;
    }

    // No need for expensive global updates on users, so we avoid them
    const usersById = getGlobal().users.byId;

    return recentReactions
      .filter((recentReaction) =>
        isSameReaction(recentReaction.reaction, reaction.reaction)
      )
      .map((recentReaction) => usersById[recentReaction.peerId])
      .filter(Boolean) as ApiUser[];
  }, [reaction.reaction, recentReactions, withRecentReactors]);

  const handleClick = useCallback(() => {
    !reaction.chosenOrder && setEffectReactin?.(reaction.reaction);
    toggleReaction({
      reaction: reaction.reaction,
      chatId: message.chatId,
      messageId: message.id,
    });
  }, [message, reaction, toggleReaction]);

  return (
    <Button
      className={buildClassName(
        isReactionChosen(reaction) &&
          (isOwn && hasGroup ? 'background-blue' : 'chosen')
      )}
      size='tiny'
      onClick={handleClick}
    >
      <ReactionAnimatedEmoji
        containerId={getMessageKey(message)}
        reaction={reaction.reaction}
        observeIntersection={observeIntersection}
        effectReactin={effectReactin}
        setEffectReactin={setEffectReactin}
      />
      {recentReactors?.length ? (
        <div className='avatars'>
          {recentReactors.map((user, i) => (
            <Avatar key={i} peer={user} size='micro' />
          ))}
        </div>
      ) : (
        <AnimatedCounter
          text={formatIntegerCompact(reaction.count)}
          className='counter'
        />
      )}
    </Button>
  );
};

export default memo(ReactionButton);
