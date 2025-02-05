import type { ChangeEvent, RefObject } from 'react';
import type { FC } from 'react';
import React, { memo } from 'react';

import buildClassName from '../../util/buildClassName';

type OwnProps = {
  id?: string;
  value?: string;
  label?: string;
  error?: string;
  ref?: RefObject<HTMLSelectElement>;
  hasArrow?: boolean;
  placeholder?: string;
  tabIndex?: number;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
};

const Select: FC<OwnProps> = (props) => {
  const {
    id,
    value,
    label,
    hasArrow,
    error,
    ref,
    placeholder,
    tabIndex,
    onChange,
    children,
  } = props;
  const labelText = error || label;
  const fullClassName = buildClassName(
    'input-group',
    value && 'touched',
    error && 'error',
    labelText && 'with-label',
    hasArrow && 'with-arrow',
    'input-group'
  );

  return (
    <div className={fullClassName}>
      <select
        className='form-control'
        id={id}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder || label}
        tabIndex={tabIndex}
        ref={ref}
      >
        {children}
      </select>
      {labelText && id && <label htmlFor={id}>{labelText}</label>}
    </div>
  );
};

export default memo(Select);
