import type { FC, ChangeEvent, ReactNode } from 'react';
import React, { memo, useCallback, useRef } from 'react';

// import '../../Checkbox.css';
import Spinner from '../../Spinner';
import classNames from 'classnames';
import { FieldProps } from 'formik';

type OwnProps = {
  label?: ReactNode;
  subLabel?: string;
  checked?: boolean;
  rightIcon?: string;
  blocking?: boolean;
  isLoading?: boolean;
  withCheckedCallback?: boolean;
  className?: string;
};

const Checkbox: FC<OwnProps & FieldProps> = ({
  field,
  form: { touched, errors },
  label,
  subLabel,
  checked,
  blocking,
  isLoading,
  className,
  rightIcon,
  ...props
}) => {
  const labelRef = useRef<HTMLLabelElement>(null);

  const labelClassName = classNames('Checkbox', className, {
    loading: isLoading,
    blocking,
  });

  return (
    <label className={labelClassName} ref={labelRef}>
      <input type='checkbox' {...field} {...props} />
      <div className='Checkbox-main'>
        <span className='label' dir='auto'>
          {typeof label === 'string' ? label : label}
          {rightIcon && <i className={`icon-${rightIcon} right-icon`} />}
        </span>
        {subLabel && (
          <span className='subLabel' dir='auto'>
            {subLabel}
          </span>
        )}
      </div>
      {isLoading && <Spinner />}
    </label>
  );
};

export default memo(Checkbox);
