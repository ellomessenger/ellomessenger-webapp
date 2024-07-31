import React, { FC, memo } from 'react';

import useShowTransition from '../../hooks/useShowTransition';
import renderText from './helpers/renderText';

import './NothingFound.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { STICKER_SIZE_INVITES } from '../../config';
import { LOCAL_TGS_URLS } from '../common/helpers/animatedAssets';

import AnimatedIcon from './AnimatedIcon';

interface OwnProps {
  text?: string;
  description?: string;
  heading?: string;
  tgsUrl?: string;
}

const DEFAULT_TEXT = 'Nothing found.';

const NothingFound: FC<OwnProps> = ({
  text = DEFAULT_TEXT,
  description,
  heading,
  tgsUrl,
}) => {
  const { t } = useTranslation();
  const { transitionClassNames } = useShowTransition(true);

  return (
    <div
      className={classNames('NothingFound', transitionClassNames, {
        'with-description': description,
      })}
    >
      <div className='AvatarEditable'>
        <AnimatedIcon
          tgsUrl={tgsUrl || LOCAL_TGS_URLS.ChatListNoResults}
          size={STICKER_SIZE_INVITES}
        />
      </div>
      <h3>{heading || t('NoResults')}</h3>
      {text && <p>{renderText(text, ['br', 'simple_markdown'])}</p>}
      {description && (
        <p className='description'>
          {renderText(String(t(description)), ['br'])}
        </p>
      )}
    </div>
  );
};

export default memo(NothingFound);
