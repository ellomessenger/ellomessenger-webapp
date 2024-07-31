import React, { FC } from 'react';

import './Skeleton.scss';
import classNames from 'classnames';

type OwnProps = {
  variant?: 'rectangular' | 'rounded-rect' | 'round';
  animation?: 'wave' | 'pulse';
  width?: number;
  height?: number;
  forceAspectRatio?: boolean;
  inline?: boolean;
  className?: string;
};

const Skeleton: FC<OwnProps> = ({
  variant = 'rectangular',
  animation = 'wave',
  width,
  height,
  forceAspectRatio,
  inline,
  className,
}) => {
  const aspectRatio =
    width && height ? { aspectRatio: `${width}/${height}` } : undefined;
  const style = forceAspectRatio
    ? aspectRatio
    : {
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      };
  return (
    <div
      className={classNames('Skeleton', variant, animation, className, {
        inline,
      })}
      style={style}
    >
      {inline && '\u00A0'}
    </div>
  );
};

export default Skeleton;
