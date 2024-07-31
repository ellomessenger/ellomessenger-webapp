import React, { FC, ReactNode, ChangeEvent, memo } from 'react';
import Spinner from './Spinner';
import './Radio.scss';
import classNames from 'classnames';

type OwnProps = {
  id?: string;
  name: string;
  label: ReactNode;
  subLabel?: string;
  value: string;
  checked: boolean;
  disabled?: boolean;
  hidden?: boolean;
  isLoading?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  text?: string;
};

const Radio: FC<OwnProps> = ({
  id,
  label,
  subLabel,
  value,
  name,
  checked,
  disabled,
  hidden,
  isLoading,
  onChange,
  text,
}) => {
  const className = classNames('Radio', {
    disabled,
    'hidden-widget': hidden,
    loading: isLoading,
  });

  return (
    <div className='radio-group-wrap'>
      <label className={className}>
        <input
          type='radio'
          name={name}
          value={value}
          id={id}
          checked={checked}
          onChange={onChange}
          disabled={disabled || hidden}
        />
        <div className='Radio-main'>
          <span className='label'>{label}</span>
          {subLabel && <span className='subLabel'>{subLabel}</span>}
        </div>
        <span className='currency'>{text}</span>
        {isLoading && <Spinner />}
      </label>
    </div>
  );
};

export default memo(Radio);
