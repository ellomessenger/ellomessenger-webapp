import React, { FC } from 'react';

import './Spinner.scss';
import classNames from 'classnames';

const Spinner: FC<{
  color?: 'blue' | 'white' | 'black' | 'green' | 'gray' | 'yellow';
  backgroundColor?: 'light' | 'dark';
  className?: string;
}> = ({ color = 'blue', backgroundColor, className }) => {
  return (
    <div
      className={classNames(
        'Spinner',
        className,
        color,
        backgroundColor && 'with-background',
        backgroundColor && `bg-${backgroundColor}`
      )}
    >
      <div />
    </div>
  );
};

export default Spinner;
