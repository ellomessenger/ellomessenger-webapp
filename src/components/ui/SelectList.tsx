import type { ChangeEvent, RefObject } from 'react';
import type { FC } from 'react';
import React, { memo } from 'react';

import buildClassName from '../../util/buildClassName';
import { FieldProps } from 'formik';

type OwnProps = {
  id?: string;
  value?: string;
  name?: string;
  label?: string;
  error?: string;
  ref?: RefObject<HTMLSelectElement>;
  hasArrow?: boolean;
  placeholder?: string;
  tabIndex?: number;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  option: Array<string>
};

const SelectList: FC<OwnProps & FieldProps> = (props) => {
  const {
    id,
    label,
    hasArrow,
    error,
    ref,
    placeholder,
    tabIndex,
    field,
    option,
    form: { setFieldValue }
  } = props;
  const { value, name } = field;

  const labelText = error || label;
  const fullClassName = buildClassName(
    'input-group',
    value && 'touched',
    error && 'error',
    labelText && 'with-label',
    hasArrow && 'with-arrow',
    'input-group'
  );

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;

    setFieldValue(name, value);
  };

  return (
    <div className={fullClassName}>
      <select
        className='form-control'
        id={id}
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder || label}
        tabIndex={tabIndex}
        ref={ref}
        name={name}
      >
        {option.map((item) => (
          <option value={item} key={item}>{item}</option>
        ))}
      </select>
      {labelText && id && <label htmlFor={id}>{labelText}</label>}
    </div>
  );
};

export default memo(SelectList);
