import React, { FC, memo } from 'react';

import type {
  ApiAvailableReaction,
  ApiMessage,
  ApiReaction,
  ApiSticker,
} from '../../../api/types';

import './Reactions.scss';
import './LikesList.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Button from '../../ui/Button';
// import AnimatedCounter from '../../common/AnimatedCounter';
import { formatIntegerCompact } from '../../../util/textFormat';

import useLastCallback from '../../../hooks/useLastCallback';
import { getActions, withGlobal } from '../../../global';
import { selectAnimatedEmoji } from '../../../global/selectors';
// import ReactionAnimatedEmoji from './ReactionAnimatedEmoji';
// import { getMessageKey } from '../../../global/helpers';
import { REM } from '../../common/helpers/mediaDimensions';

const REACTION_SIZE = 1.25 * REM;

type OwnProps = {
  message: ApiMessage;
  chatId: string;
  metaChildren?: React.ReactNode;
  defaultReaction: ApiReaction;
  isGroup: boolean;
};

type StateProps = {
  animatedEmoji?: ApiSticker;
  currentUserId: number;
  availableReactions?: ApiAvailableReaction[];
  chat: any;
};

const LikesList: FC<OwnProps & StateProps> = ({
  message,
  metaChildren,
  chatId,
  chat,
  isGroup,
}) => {
  const { toggleReaction } = getActions();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';
  const { likes, id, isLiked, reactions } = message || {};
  const { fullInfo } = chat.byId[chatId] || {};
  const totalCount = likes;

  const handleLikeClick = useLastCallback((emoticon: string) => {
    toggleReaction({
      chatId: chatId,
      messageId: id,
      reaction: {
        emoticon,
      },
      shouldAddToRecent: true,
    });
  });

  return fullInfo?.enabledReactions?.allowed?.length ? (
    <div
      className={`Reactions Reactions-list like ${
        isGroup ? 'Reactions-list-group' : ''
      }`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className='reaction-buttons-wrap'>
        {fullInfo?.enabledReactions?.allowed.map((emoticon, index) => (
          <Button
            key={index}
            size='tiny'
            color='translucent'
            className={classNames({ liked: isLiked })}
            onClick={() => handleLikeClick(emoticon.emoticon)}
          >
            {/* <ReactionAnimatedEmoji
              className='reaction-animated-emoji'
              containerId={getMessageKey(message)}
              reaction={{ emoticon: reaction.reaction?.emoticon || '❤️' }}
              size={REACTION_SIZE}
            /> */}
            {emoticon.emoticon}
          </Button>
        ))}
      </div>
      {metaChildren}
    </div>
  ) : null;
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    return {
      animatedEmoji: selectAnimatedEmoji(global, '❤️'),
      currentUserId: Number(global.currentUserId),
      availableReactions: global.availableReactions,
      chat: global.chats,
    };
  })(LikesList)
);
