import React, { FC } from 'react';

import renderText from './helpers/renderText';

import './DotAnimation.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

type OwnProps = {
  content: string;
  className?: string;
};

const DotAnimation: FC<OwnProps> = ({ content, className }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';

  return (
    <span
      className={classNames('DotAnimation', className)}
      dir={isRtl ? 'rtl' : 'auto'}
    >
      {renderText(content)}
      <span className='ellipsis' />
    </span>
  );
};

export default DotAnimation;
