import React, { FC, ReactNode, ChangeEvent, useCallback, memo } from 'react';
import './RadioGroup.scss';

import Radio from './Radio';
import classNames from 'classnames';

export type IRadioOption = {
  label: ReactNode;
  subLabel?: string;
  value: string;
  hidden?: boolean;
  text?: string;
};

type OwnProps = {
  id?: string;
  name: string;
  options: IRadioOption[];
  selected?: string;
  disabled?: boolean;
  className?: string;
  size?: 'smaller';
  loadingOption?: string;
  onChange: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
};

const RadioGroup: FC<OwnProps> = ({
  id,
  name,
  options,
  selected,
  disabled,
  loadingOption,
  onChange,
  className,
  size,
}) => {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget;
      onChange(value, event);
    },
    [onChange]
  );

  return (
    <div id={id} className={classNames('radio-group', className, size)}>
      {options.map((option) => (
        <Radio
          key={option.value}
          name={name}
          label={option.label}
          subLabel={option.subLabel}
          value={option.value}
          checked={option.value === selected}
          hidden={option.hidden}
          disabled={disabled}
          isLoading={loadingOption ? loadingOption === option.value : undefined}
          onChange={handleChange}
          text={option.text}
        />
      ))}
    </div>
  );
};

export default memo(RadioGroup);
