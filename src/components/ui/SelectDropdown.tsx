import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import DropdownMenu from './DropdownMenu';
import MenuItem from './MenuItem';
import { FieldProps } from 'formik';
import { ANIMATION_END_DELAY } from '../../config';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import Spinner from './Spinner';
import './Select.scss';

type OwnProps = {
  className?: string;
  scrollId?: string;
  label?: string;
  isLoading?: boolean;
  placeholder?: string;
  dataList: object;
  value?: string;
  positionY?: 'top' | 'bottom';
  handleChange?: (val: any) => void;
};

const MENU_HIDING_DURATION = 200 + ANIMATION_END_DELAY;
const SELECT_TIMEOUT = 50;

const SelectDropdown: FC<OwnProps> = ({
  className,
  scrollId,
  isLoading,
  label,
  dataList,
  value,
  positionY = 'top',
  handleChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const [fieldValue, setFieldValue] = useState('');

  const handleClick = (val: string, name: string) => {
    setFieldValue(name);
    if (handleChange) {
      handleChange(val);
    }
  };

  const Input: FC<{ onTrigger: () => void; isOpen?: boolean }> = useCallback(
    ({ onTrigger, isOpen }) => {
      const handleTrigger = () => {
        if (isOpen) {
          return;
        }

        setTimeout(() => {
          inputRef.current!.select();
        }, SELECT_TIMEOUT);

        onTrigger();
        if (scrollId) {
          const formEl = document.getElementById(scrollId)!;
          formEl.scrollTo({ top: formEl.scrollHeight, behavior: 'smooth' });
        }
      };

      return (
        <div
          className={classNames('input', {
            touched: value,
          })}
        >
          <div className='input-wrapper'>
            <input
              value={String(t(fieldValue))}
              ref={inputRef}
              className={classNames('form-control', className, {
                focus: isOpen,
              })}
              autoComplete='off'
              readOnly
              onClick={handleTrigger}
              onFocus={handleTrigger}
            />
            {label && !fieldValue && <label>{label}</label>}
            {isLoading ? (
              <Spinner color='black' />
            ) : (
              <i
                onClick={handleTrigger}
                className={classNames('css-icon-down', { open: isOpen })}
              />
            )}
          </div>
        </div>
      );
    },
    [isLoading, fieldValue]
  );

  useEffect(() => {
    if (value) {
      setFieldValue(dataList[value as keyof typeof dataList]);
    }
  }, [value]);

  return (
    <DropdownMenu
      className={classNames('select-dropdown no-blur', className)}
      trigger={Input}
      positionY={positionY}
    >
      {Object.entries(dataList).map(([value, name]) => (
        <MenuItem key={value} onClick={() => handleClick(value, name)}>
          {name}
        </MenuItem>
      ))}
    </DropdownMenu>
  );
};

export default SelectDropdown;
