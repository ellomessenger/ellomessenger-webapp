import type { FC, ChangeEvent, RefObject, ReactNode } from 'react';
import React, { memo } from 'react';
import classNames from 'classnames';
import { FieldProps } from 'formik';

type OwnProps = {
  label?: string;
  hasArrow?: boolean;
  placeholder?: string;
  tabIndex?: number;
  children: ReactNode;
};

const Select: FC<OwnProps & FieldProps> = ({
  field,
  form: { touched, errors, setFieldValue },
  label,
  hasArrow,
  placeholder,
  tabIndex,
  children,
  ...props
}) => {
  const labelText = label;
  const fullClassName = classNames('input-group', {
    touched: field.value,
    error: touched[field.name] && errors[field.name],
    'with-label': labelText,
    'with-arrow': hasArrow,
  });

  return (
    <div className={fullClassName}>
      <select
        {...field}
        {...props}
        className='form-control'
        placeholder={placeholder || label}
        tabIndex={tabIndex}
      >
        {children}
      </select>
      {labelText && <label>{labelText}</label>}
    </div>
  );
};

export default memo(Select);
