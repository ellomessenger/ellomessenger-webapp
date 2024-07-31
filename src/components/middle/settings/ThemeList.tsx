import type { FC } from 'react';
import React, { memo, useCallback, useEffect, useState, useRef } from 'react';
import type { ApiWallpaper } from '../../../api/types';
import type { ThemeKey } from '../../../types';
import buildClassName from '../../../util/buildClassName';

import './WallpaperTile.scss';
import './ThemeList.scss';
import IconSvg from '../../ui/IconSvg';

type OwnProps = {
  theme: string;
  isSelected: boolean;
  onClick: () => void;
};

const ThemeList: FC<OwnProps> = ({
  theme,
  onClick,
  isSelected
}) => {
 
  const className = buildClassName('WallpaperTile', isSelected && 'selected');

  return (
    <div className='chat-theme'>
      <div className="chat-theme__box">
        <div className="chat-theme__theme-first">
          <IconSvg name='theme' color={theme} />
        </div>
        <div className="chat-theme__theme-second">
          <IconSvg name='theme-white' />
        </div>
      </div>
    </div>
  );
};

export default memo(ThemeList);
