import React, { memo } from 'react';

import type { FC } from 'react';
import type { ApiAvailableReaction, ApiReaction } from '../../../api/types';

import { createClassNameBuilder } from '../../../util/buildClassName';
import useMedia from '../../../hooks/useMedia';
import useFlag from '../../../hooks/useFlag';

import AnimatedSticker from '../../common/AnimatedSticker';

import './ReactionSelectorReaction.scss';

const REACTION_SIZE = 32;

type OwnProps = {
  reaction: ApiAvailableReaction;
  previewIndex: number;
  isReady?: boolean;
  chosen?: boolean;
  onToggleReaction: (reaction: ApiReaction) => void;
};

const cn = createClassNameBuilder('ReactionSelectorReaction');

const ReactionSelectorReaction: FC<OwnProps> = ({
  reaction,
  previewIndex,
  isReady,
  chosen,
  onToggleReaction,
}) => {
  const mediaData = useMedia(
    `document${reaction.selectAnimation?.id}`,
    !isReady
  );

  const [isActivated, activate, deactivate] = useFlag();
  const [isAnimationLoaded, markAnimationLoaded] = useFlag();

  const shouldRenderStatic = !isReady || !isAnimationLoaded;
  const shouldRenderAnimated = Boolean(isReady && mediaData);
  function handleClick() {
    onToggleReaction(reaction.reaction);
  }

  return (
    <div
      className={cn('&', chosen && 'chosen')}
      onClick={handleClick}
      onMouseEnter={isReady ? activate : undefined}
    >
      {shouldRenderStatic && (
        <div
          className={cn('static')}
          style={{ backgroundPositionX: `${previewIndex * -REACTION_SIZE}px` }}
        />
      )}
      {shouldRenderAnimated && (
        <AnimatedSticker
          tgsUrl={mediaData}
          play={isActivated}
          noLoop
          size={REACTION_SIZE}
          onLoad={markAnimationLoaded}
          onEnded={deactivate}
        />
      )}
    </div>
  );
};

export default memo(ReactionSelectorReaction);
