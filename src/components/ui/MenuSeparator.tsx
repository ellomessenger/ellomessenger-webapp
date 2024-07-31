import React, { FC } from 'react';

import styles from './MenuSeparator.module.scss';
import classNames from 'classnames';

type OwnProps = {
  className?: string;
};

const MenuSeparator: FC<OwnProps> = ({ className }) => {
  return <div className={classNames(styles.root, className)} />;
};

export default MenuSeparator;
