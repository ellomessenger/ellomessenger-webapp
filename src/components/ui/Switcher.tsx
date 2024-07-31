import React, { FC, memo, useCallback, ChangeEvent } from 'react';

import './Switcher.scss';
import classNames from 'classnames';

type OwnProps = {
  id?: string;
  name?: string;
  value?: string;
  label: string;
  checked?: boolean;
  disabled?: boolean;
  inactive?: boolean;
  noAnimation?: boolean;
  has_icon?: boolean;
  color?: 'primary' | 'reverse';
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onCheck?: (isChecked: boolean) => void;
};

const Switcher: FC<OwnProps> = ({
  id,
  name,
  value,
  label,
  checked = false,
  disabled,
  inactive,
  noAnimation,
  color,
  has_icon,
  onChange,
  onCheck,
}) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e);
      }

      if (onCheck) {
        onCheck(e.currentTarget.checked);
      }
    },
    [onChange, onCheck]
  );

  const className = classNames('Switcher', color, {
    disabled,
    inactive,
    'no-animation': noAnimation,
    'has-icon': has_icon,
  });

  return (
    <label className={className} title={label}>
      <input
        type='checkbox'
        id={id}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
      />
      <span className='widget' />
    </label>
  );
};

export default memo(Switcher);
