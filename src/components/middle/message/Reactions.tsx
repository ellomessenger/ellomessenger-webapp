import React, { FC, memo, useMemo } from 'react';

import type {
  ApiAvailableReaction,
  ApiMessage,
  ApiReaction,
  ApiStickerSet,
  ApiAudio,
  ApiVoice,
  ApiDocument,
  ApiVideo,
  ApiPhoto,
  ApiWebPage,
  ApiFormattedText,
} from '../../../api/types';
import type { ActiveReaction } from '../../../global/types';
import type { ObserveFn } from '../../../hooks/useIntersectionObserver';

import { getReactionUniqueKey } from '../../../global/helpers';

import ReactionButton from './ReactionButton';

import './Reactions.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

type OwnProps = {
  message: ApiMessage;
  isOutside?: boolean;
  maxWidth?: number;
  activeReactions?: ActiveReaction[];
  availableReactions?: ApiAvailableReaction[];
  metaChildren?: React.ReactNode;
  genericEffects?: ApiStickerSet;
  observeIntersection?: ObserveFn;
  noRecentReactors?: boolean;
  effectReactin?: ApiReaction | undefined;
  contentClassName?: string;
  setEffectReactin?: (value: ApiReaction | undefined) => void;
  hasGroup?: boolean;
  isMedia?:
    | ApiPhoto
    | ApiFormattedText
    | ApiWebPage
    | ApiVideo
    | ApiAudio
    | ApiVoice
    | ApiDocument
    | boolean
    | undefined;
  forwardInfo?: any;
  isOwn?: boolean;
};

const MAX_RECENT_AVATARS = 3;

const Reactions: FC<OwnProps> = ({
  message,
  isOutside,
  maxWidth,
  activeReactions,
  availableReactions,
  metaChildren,
  genericEffects,
  observeIntersection,
  noRecentReactors,
  effectReactin,
  setEffectReactin,
  contentClassName,
  hasGroup,
  isMedia,
  forwardInfo,
  isOwn,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';

  const totalCount = useMemo(
    () =>
      (message &&
        message?.reactions &&
        message?.reactions?.results.reduce(
          (acc, reaction) => acc + reaction.count,
          0
        )) ||
      0,
    [message]
  );

  return (
    <div
      className={classNames('Reactions', {
        // 'reverse': !hasGroup || isMedia,
        'is-outside': isOutside,
        'emoji-back': contentClassName?.includes('emoji-only'),
      })}
      style={maxWidth ? { maxWidth: `${maxWidth}px` } : undefined}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className='reaction-buttons-wrap'>
        {message?.reactions?.results.map((reaction) => (
          <ReactionButton
            key={getReactionUniqueKey(reaction.reaction)}
            reaction={reaction}
            message={message}
            activeReactions={activeReactions}
            availableReactions={availableReactions}
            withRecentReactors={
              totalCount <= MAX_RECENT_AVATARS && !noRecentReactors
            }
            genericEffects={genericEffects}
            observeIntersection={observeIntersection}
            effectReactin={effectReactin}
            setEffectReactin={setEffectReactin}
            forwardInfo={forwardInfo}
            hasGroup={hasGroup}
            isOwn={isOwn}
          />
        ))}
      </div>
      {metaChildren}
    </div>
  );
};

export default memo(Reactions);
