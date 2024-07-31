import type { FC } from 'react';
import React, { memo, useMemo } from 'react';

import type { ISettings } from '../../../types';
import type { ApiDocument } from '../../../api/types';
import { ApiMediaFormat } from '../../../api/types';

import useMedia from '../../../hooks/useMedia';
import { getDocumentMediaHash } from '../../../global/helpers';
import buildClassName from '../../../util/buildClassName';

import styles from './AttachBotIcon.module.scss';

type OwnProps = {
  icon: ApiDocument;
  theme: ISettings['theme'];
};

const ADDITIONAL_STROKE_WIDTH = '0.5px';
const DARK_THEME_COLOR = 'rgb(170, 170, 170)';
const LIGHT_THEME_COLOR = 'rgb(112, 117, 121)';
const COLOR_REPLACE_PATTERN = /#fff/gi;

const AttachBotIcon: FC<OwnProps> = ({ icon, theme }) => {
  const mediaData = useMedia(
    getDocumentMediaHash(icon),
    false,
    ApiMediaFormat.Text
  );

  const iconSvg = useMemo(() => {
    if (!mediaData) return '';
    const color = theme === 'dark' ? DARK_THEME_COLOR : LIGHT_THEME_COLOR;

    const mediaDataWithReplacedColors = mediaData.replace(
      COLOR_REPLACE_PATTERN,
      color
    );
    const doc = new DOMParser().parseFromString(
      mediaDataWithReplacedColors,
      'image/svg+xml'
    );
    doc.querySelectorAll('path').forEach((path) => {
      path.style.stroke = color;
      path.style.strokeWidth = ADDITIONAL_STROKE_WIDTH;
    });

    return `data:image/svg+xml;utf8,${doc.documentElement.outerHTML}`;
  }, [mediaData, theme]);

  return (
    <i className={buildClassName(styles.root)}>
      <img src={iconSvg} alt='' className={buildClassName(styles.image)} />
    </i>
  );
};

export default memo(AttachBotIcon);
