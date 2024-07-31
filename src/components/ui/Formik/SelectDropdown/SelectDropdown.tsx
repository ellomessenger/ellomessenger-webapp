import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import DropdownMenu from '../../DropdownMenu';
import MenuItem from '../../MenuItem';
import { FieldProps } from 'formik';
import { ANIMATION_END_DELAY } from '../../../../config';
import classNames from 'classnames';
import Spinner from '../../Spinner';
import '../../Select.scss';

type OwnProps = {
  className?: string;
  scrollId?: string;
  label?: string;
  isLoading?: boolean;
  placeholder?: string;
  dataList: object | [string];
};

const MENU_HIDING_DURATION = 200 + ANIMATION_END_DELAY;
const SELECT_TIMEOUT = 50;

const SelectDropdown: FC<FieldProps & OwnProps> = ({
  className,
  scrollId,
  field,
  form: { touched, errors, setFieldValue },
  isLoading,
  label,
  dataList,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { name, value } = field;
  const [defaultValue, setDefaultValue] = useState<string | undefined>();

  const handleChange = (val: string) => {
    setFieldValue(name, val);
    setDefaultValue(
      Array.isArray(dataList) ? val : dataList[val as keyof typeof dataList]
    );
  };

  useEffect(() => {
    if (value && !defaultValue) {
      handleChange(value);
    }
  }, [value, defaultValue]);

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
            touched: field.value,
          })}
        >
          <div className='input-wrapper'>
            <input
              //{...field}
              readOnly
              defaultValue={defaultValue}
              //{...props}
              ref={inputRef}
              className={classNames('form-control', { focus: isOpen })}
              autoComplete='off'
              onClick={handleTrigger}
              onFocus={handleTrigger}
            />
            {label && !value && <label>{label}</label>}
            {isLoading ? (
              <Spinner color='black' />
            ) : (
              <i
                onClick={handleTrigger}
                className={classNames('css-icon-down', { open: isOpen })}
              />
            )}
          </div>
          {touched[name] && errors[name] && (
            <p className='input-notification--error'>{String(errors[name])}</p>
          )}
        </div>
      );
    },
    [isLoading, field]
  );

  return (
    <DropdownMenu
      className={classNames('select-dropdown no-blur', className)}
      trigger={Input}
    >
      {Array.isArray(dataList)
        ? dataList.map((value) => (
            <MenuItem key={value} onClick={() => handleChange(value)}>
              {value}
            </MenuItem>
          ))
        : Object.entries(dataList).map(([value, name]) => (
            <MenuItem key={value} onClick={() => handleChange(value)}>
              {name}
            </MenuItem>
          ))}
    </DropdownMenu>
  );
};

export default SelectDropdown;
