import React, { FC, memo, useCallback } from 'react';

import { IS_EMOJI_SUPPORTED } from '../../../util/windowEnvironment';
import { handleEmojiLoad, LOADED_EMOJIS } from '../../../util/emoji';

import './EmojiButton.scss';
import classNames from 'classnames';

type OwnProps = {
  emoji: Emoji;
  focus?: boolean;
  onClick: (emoji: string, name: string) => void;
};

const EmojiButton: FC<OwnProps> = ({ emoji, focus, onClick }) => {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      // Preventing safari from losing focus on Composer MessageInput
      e.preventDefault();

      onClick(emoji.native, emoji.id);
    },
    [emoji, onClick]
  );

  const className = classNames('EmojiButton', { focus });

  const src = `./img-apple-64/${emoji.image}.png`;
  const isLoaded = LOADED_EMOJIS.has(src);

  return (
    <div
      className={className}
      onMouseDown={handleClick}
      title={`:${emoji.names[0]}:`}
    >
      {IS_EMOJI_SUPPORTED ? (
        emoji.native
      ) : (
        <img
          src={src}
          className={!isLoaded ? 'opacity-transition shown' : undefined}
          alt={emoji.native}
          loading='lazy'
          data-path={src}
          onLoad={!isLoaded ? handleEmojiLoad : undefined}
        />
      )}
    </div>
  );
};

export default memo(EmojiButton);
