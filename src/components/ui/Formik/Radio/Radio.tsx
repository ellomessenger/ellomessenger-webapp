import type { FC, ReactNode } from 'react';
import React, { memo } from 'react';

import { FieldProps } from 'formik';
import classNames from 'classnames';
import Spinner from '../../Spinner';
import '../../Radio.scss';

type OwnProps = {
  label: ReactNode;
  subLabel?: string;
  hidden?: boolean;
  isLoading?: boolean;
  className?: string;
};

const Radio: FC<OwnProps & FieldProps> = ({
  field,
  form: { touched, errors },
  label,
  subLabel,
  hidden,
  isLoading,
  className,
  ...props
}) => {
  return (
    <label
      className={classNames('Radio', className, {
        'hidden-widget': hidden,
        loading: isLoading,
      })}
    >
      <input {...field} {...props} />
      <div className='Radio-main'>
        <span className='label'>{label}</span>
        {subLabel && <span className='subLabel'>{subLabel}</span>}
      </div>
      {isLoading && <Spinner />}
    </label>
  );
};

export default memo(Radio);
