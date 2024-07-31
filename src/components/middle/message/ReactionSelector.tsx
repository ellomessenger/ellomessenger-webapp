import React, { FC, memo, useMemo, useRef } from 'react';

import type {
  ApiAvailableReaction,
  ApiChatReactions,
  ApiReaction,
  ApiReactionCount,
} from '../../../api/types';

import { getTouchY } from '../../../util/scrollLock';
import { createClassNameBuilder } from '../../../util/buildClassName';

import {
  isSameReaction,
  canSendReaction,
  getReactionUniqueKey,
  sortReactions,
} from '../../../global/helpers';

import useHorizontalScroll from '../../../hooks/useHorizontalScroll';

import ReactionSelectorReaction from './ReactionSelectorReaction';

import './ReactionSelector.scss';
import classNames from 'classnames';

type OwnProps = {
  availableReactions?: ApiAvailableReaction[];
  allAvailableReactions?: ApiAvailableReaction[];
  enabledReactions?: ApiChatReactions;
  topReactions?: ApiReaction[];
  onToggleReaction: (reaction: ApiReaction) => void;
  isPrivate?: boolean;
  currentReactions?: ApiReactionCount[];
  maxUniqueReactions?: number;
  isReady?: boolean;
  canBuyPremium?: boolean;
  isCurrentUserPremium?: boolean;
  className?: string;
};

const cn = createClassNameBuilder('ReactionSelector');
const REACTIONS_AMOUNT = 6;

const ReactionSelector: FC<OwnProps> = ({
  topReactions,
  enabledReactions,
  currentReactions,
  maxUniqueReactions,
  allAvailableReactions,
  isPrivate,
  isReady,
  onToggleReaction,
  className,
}) => {
  // eslint-disable-next-line no-null/no-null
  const itemsScrollRef = useRef<HTMLDivElement>(null);
  useHorizontalScroll(itemsScrollRef);

  const handleWheel = (e: React.WheelEvent | React.TouchEvent) => {
    const deltaY = 'deltaY' in e ? e.deltaY : getTouchY(e);

    if (deltaY && e.cancelable) {
      e.preventDefault();
    }
  };

  const availableReactions = useMemo(() => {
    const reactions =
      allAvailableReactions
        ?.map((availableReaction) => {
          if (availableReaction.isInactive) return undefined;
          if (
            !isPrivate &&
            (!enabledReactions ||
              !canSendReaction(availableReaction.reaction, enabledReactions))
          ) {
            return undefined;
          }
          if (
            maxUniqueReactions &&
            currentReactions &&
            currentReactions.length >= maxUniqueReactions &&
            !currentReactions.some(({ reaction }) =>
              isSameReaction(reaction, availableReaction.reaction)
            )
          ) {
            return undefined;
          }
          return availableReaction;
        })
        .filter(Boolean) || [];

    return sortReactions(reactions, topReactions);
  }, [
    allAvailableReactions,
    currentReactions,
    enabledReactions,
    isPrivate,
    maxUniqueReactions,
    topReactions,
  ]);

  const reactionsToRender = useMemo(() => {
    return availableReactions.length === REACTIONS_AMOUNT + 1
      ? availableReactions
      : availableReactions.slice(0, REACTIONS_AMOUNT);
  }, [availableReactions]);

  const userReactionIndexes = useMemo(() => {
    const chosenReactions =
      currentReactions?.filter(
        ({ chosenOrder }) => chosenOrder !== undefined
      ) || [];
    return new Set(
      chosenReactions.map(({ reaction }) =>
        reactionsToRender.findIndex(
          (r) => r && isSameReaction(r.reaction, reaction)
        )
      )
    );
  }, [currentReactions, reactionsToRender]);

  if (!reactionsToRender.length) return null;

  return (
    <div
      className={classNames(cn('&'), className)}
      onWheelCapture={handleWheel}
      onTouchMove={handleWheel}
    >
      {/* <div className={cn('bubble-small')} /> */}
      <div className={cn('items-wrapper')}>
        <div className={cn('items', ['no-scrollbar'])} ref={itemsScrollRef}>
          {reactionsToRender.map((reaction, i) => {
            if (!reaction) return undefined;
            return (
              <ReactionSelectorReaction
                key={getReactionUniqueKey(reaction.reaction)}
                previewIndex={i}
                isReady={isReady}
                onToggleReaction={onToggleReaction}
                reaction={reaction}
                chosen={userReactionIndexes.has(i)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(ReactionSelector);
