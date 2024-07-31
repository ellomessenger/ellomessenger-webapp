import React, { FC, memo } from 'react';
import classNames from 'classnames';

import './Loading.scss';
import renderText from '../common/helpers/renderText';
import DotAnimation from '../common/DotAnimation';
import AnimatedIcon from '../common/AnimatedIcon';
import { LOCAL_TGS_URLS } from '../common/helpers/animatedAssets';

type OwnProps = {
  color?: 'blue' | 'white' | 'black' | 'yellow';
  backgroundColor?: 'light' | 'dark';
  title?: string;
  text?: string;
  loadText?: string;
  image?: any;
  onClick?: NoneToVoidFunction;
};

const Loading: FC<OwnProps> = ({
  color = 'blue',
  backgroundColor,
  title,
  text,
  image,
  loadText,
  onClick,
}) => {
  return (
    <div
      className={classNames('Loading', { interactive: !!onClick })}
      onClick={onClick}
    >
      {image ? (
        <>
          <img src={image} alt={title!} />
          {loadText && (
            <h3>
              <DotAnimation content={loadText} />
            </h3>
          )}
        </>
      ) : (
        <AnimatedIcon tgsUrl={LOCAL_TGS_URLS.Preloader} />
      )}
      {title && <h3 className='mt-3'>{title}</h3>}
      {text && <p>{renderText(text, ['br'])}</p>}
    </div>
  );
};

export default memo(Loading);
