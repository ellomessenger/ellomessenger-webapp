import React, { FC, useCallback } from 'react';

import styles from './Link.module.scss';
import classNames from 'classnames';

type OwnProps = {
  children: React.ReactNode;
  className?: string;
  isRtl?: boolean;
  isPrimary?: boolean;
  href?: string;
  target?: '_blank';
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

const Link: FC<OwnProps> = ({
  children,
  isPrimary,
  className,
  isRtl,
  href,
  target,
  onClick,
}) => {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      onClick!(e);
    },
    [onClick]
  );

  return (
    <a
      href={href || '#'}
      target={target}
      className={classNames(
        styles.link,
        className,
        isPrimary && styles.isPrimary
      )}
      dir={isRtl ? 'rtl' : 'auto'}
      onClick={onClick ? handleClick : undefined}
    >
      {children}
    </a>
  );
};

export default Link;
