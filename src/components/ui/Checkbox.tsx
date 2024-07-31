import type { FC, ChangeEvent, ReactNode } from 'react';
import React, { memo, useCallback, useRef } from 'react';

import renderText from '../common/helpers/renderText';

import Spinner from './Spinner';

import './Checkbox.scss';
import classNames from 'classnames';

type OwnProps = {
  id?: string;
  name?: string;
  value?: string;
  label: ReactNode;
  subLabel?: string;
  checked: boolean;
  rightIcon?: string;
  disabled?: boolean;
  tabIndex?: number;
  round?: boolean;
  square?: boolean;
  blocking?: boolean;
  isLoading?: boolean;
  withCheckedCallback?: boolean;
  className?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onCheck?: (isChecked: boolean) => void;
  onClickLabel?: (e: React.MouseEvent) => void;
};

const Checkbox: FC<OwnProps> = ({
  id,
  name,
  value,
  label,
  subLabel,
  checked,
  tabIndex,
  disabled,
  round,
  square,
  blocking,
  isLoading,
  className,
  rightIcon,
  onChange,
  onCheck,
  onClickLabel,
}) => {
  const labelRef = useRef<HTMLLabelElement>(null);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(event);
      }

      if (onCheck) {
        onCheck(event.currentTarget.checked);
      }
    },
    [onChange, onCheck]
  );

  function handleClick(event: React.MouseEvent) {
    if (event.target !== labelRef.current) {
      onClickLabel?.(event);
    }
  }

  function handleInputClick(event: React.MouseEvent) {
    event.stopPropagation();
  }

  const labelClassName = classNames('Checkbox', className, {
    disabled,
    round,
    square,
    loading: isLoading,
    blocking,
  });

  return (
    <label
      className={labelClassName}
      onClick={onClickLabel ? handleClick : undefined}
      ref={labelRef}
    >
      <input
        type='checkbox'
        id={id}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        tabIndex={tabIndex}
        onChange={handleChange}
        onClick={onClickLabel ? handleInputClick : undefined}
      />
      <div className='Checkbox-main'>
        <span className='label' dir='auto'>
          {typeof label === 'string' ? renderText(label) : label}
          {rightIcon && <i className={`icon-${rightIcon} right-icon`} />}
        </span>
        {subLabel && (
          <span className='subLabel' dir='auto'>
            {renderText(subLabel)}
          </span>
        )}
      </div>
      {isLoading && <Spinner />}
    </label>
  );
};

export default memo(Checkbox);
