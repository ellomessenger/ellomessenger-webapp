import React, { FC, memo, useMemo, useState } from 'react';

import type { ApiAvailableReaction, ApiReaction } from '../../api/types';
import type { ObserveFn } from '../../hooks/useIntersectionObserver';
import { ApiMediaFormat } from '../../api/types';

import { isSameReaction } from '../../global/helpers';

import useMediaTransition from '../../hooks/useMediaTransition';
import useMedia from '../../hooks/useMedia';

import CustomEmoji from './CustomEmoji';

import blankUrl from '../../assets/blank.png';
import './ReactionStaticEmoji.scss';
import classNames from 'classnames';

type OwnProps = {
  reaction: ApiReaction;
  availableReactions?: ApiAvailableReaction[];
  className?: string;
  size?: number;
  withIconHeart?: boolean;
  observeIntersection?: ObserveFn;
};

const ReactionStaticEmoji: FC<OwnProps> = ({
  reaction,
  availableReactions,
  className,
  size,
  withIconHeart,
  observeIntersection,
}) => {
  const isCustom = 'documentId' in reaction;
  const [error, setError] = useState<boolean>(false);
  const availableReaction = useMemo(
    () =>
      availableReactions?.find((available) =>
        isSameReaction(available.reaction, reaction)
      ),
    [availableReactions, reaction]
  );
  const staticIconId = availableReaction?.staticIcon?.id;
  const mediaData = useMedia(
    `document${staticIconId}`,
    !staticIconId,
    ApiMediaFormat.BlobUrl
  );

  const transitionClassNames = useMediaTransition(mediaData);
  const shouldApplySizeFix =
    'emoticon' in reaction && reaction.emoticon === '🦄';
  const shouldReplaceWithHeartIcon =
    withIconHeart && 'emoticon' in reaction && reaction.emoticon === '❤';

  if (isCustom) {
    return (
      <CustomEmoji
        documentId={reaction.documentId}
        className={classNames('ReactionStaticEmoji', className)}
        size={size}
        observeIntersectionForPlaying={observeIntersection}
      />
    );
  }

  if (shouldReplaceWithHeartIcon) {
    return (
      <i
        className='ReactionStaticEmoji icon icon-heart'
        style={{ fontSize: `${size}px`, width: `${size}px` }}
      />
    );
  }

  return (
    <img
      className={classNames(
        'ReactionStaticEmoji',
        shouldApplySizeFix && 'with-unicorn-fix',
        transitionClassNames,
        className
      )}
      onError={() => setError(true)}
      style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
      src={mediaData || blankUrl}
      alt={availableReaction?.title}
      draggable={false}
    />
  );
};

export default memo(ReactionStaticEmoji);
