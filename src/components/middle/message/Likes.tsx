import React, { FC, memo, useCallback, useMemo } from 'react';

import type {
  ApiAvailableReaction,
  ApiMessage,
  ApiReaction,
  ApiSticker,
  ApiStickerSet,
} from '../../../api/types';

import './Reactions.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Button from '../../ui/Button';
import AnimatedCounter from '../../common/AnimatedCounter';
import { formatIntegerCompact } from '../../../util/textFormat';

import useLastCallback from '../../../hooks/useLastCallback';
import { getActions, withGlobal } from '../../../global';
import { selectAnimatedEmoji } from '../../../global/selectors';
import ReactionAnimatedEmoji from './ReactionAnimatedEmoji';
import { getMessageKey } from '../../../global/helpers';
import { REM } from '../../common/helpers/mediaDimensions';

const REACTION_SIZE = 1.25 * REM;

type OwnProps = {
  message: ApiMessage;
  chatId: string;
  metaChildren?: React.ReactNode;
  defaultReaction: ApiReaction;
};

type StateProps = {
  animatedEmoji?: ApiSticker;
  currentUserId: number;
};

const Likes: FC<OwnProps & StateProps> = ({
  message,
  metaChildren,
  chatId,
  animatedEmoji,
  currentUserId,
}) => {
  const { setLike } = getActions();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';
  const { likes, id, isLiked } = message || {};
  const totalCount = likes;

  const handleLikeClick = useLastCallback(() => {
    setLike({
      user_id: currentUserId,
      msg_id: id,
      isLiked: isLiked!,
      chatId,
      likes: likes!,
    });
  });

  return (
    <div className='Reactions like' dir={isRtl ? 'rtl' : 'ltr'}>
      <div className='reaction-buttons-wrap'>
        <Button
          size='tiny'
          color='translucent'
          className={`${classNames({ liked: isLiked })} size`}
          onClick={handleLikeClick}
        >
          {/* <ReactionAnimatedEmoji
            className='reaction-animated-emoji'
            containerId={getMessageKey(message)}
            reaction={{ emoticon: '❤️' }}
            size={REACTION_SIZE}
          /> */}
          <img
            style={{ width: '24px' }}
            draggable='false'
            className='ReactionStaticEmoji'
            src='./img-apple-64/2764.png'
            alt='❤️'
          />
          <AnimatedCounter
            text={formatIntegerCompact(Number(totalCount ?? 0))}
            className='counter'
          />
        </Button>
      </div>
      {metaChildren}
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    return {
      animatedEmoji: selectAnimatedEmoji(global, '❤️'),
      currentUserId: Number(global.currentUserId),
    };
  })(Likes)
);
