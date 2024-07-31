import React, { FC, memo, useMemo } from 'react';

import type {
  ApiAvailableReaction,
  ApiMessage,
  ApiStickerSet,
  ApiThreadInfo,
} from '../../../api/types';
import type { ActiveReaction } from '../../../global/types';
import type { ObserveFn } from '../../../hooks/useIntersectionObserver';

import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import Button from '../../ui/Button';
import IconSvg from '../../ui/IconSvg';
import AnimatedCounter from '../../common/AnimatedCounter';
import { formatIntegerCompact } from '../../../util/textFormat';

type OwnProps = {
  message: ApiMessage;
  activeReactions?: ActiveReaction[];
  availableReactions?: ApiAvailableReaction[];
  genericEffects?: ApiStickerSet;
  observeIntersection?: ObserveFn;
  noRecentReactors?: boolean;
};

const MAX_RECENT_AVATARS = 3;

const FeeReactions: FC<OwnProps> = ({
  message,
  activeReactions,
  availableReactions,
  genericEffects,
  observeIntersection,
  noRecentReactors,
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';

  const commentsCount = message.repliesThreadInfo?.messagesCount ? (
    <AnimatedCounter
      text={formatIntegerCompact(message.repliesThreadInfo?.messagesCount)}
    />
  ) : (
    '0'
  );

  return (
    <div className={classNames('Reactions')} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className='reaction-buttons-wrap'>
        <Button color='translucent'>
          <i className='icon-svg'>
            <IconSvg name='eye' w='24' h='24' />
          </i>
          7.2M
        </Button>

        <Button color='translucent'>
          <i className='icon-svg'>
            <IconSvg name='comment' />
          </i>
          {commentsCount}
        </Button>
        <Button color='translucent'>
          <i className='icon-svg'>
            <IconSvg name='share-2' />
          </i>
        </Button>
      </div>
    </div>
  );
};

export default memo(FeeReactions);
