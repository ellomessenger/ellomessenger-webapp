import React, { ChangeEvent, FC, useEffect, useRef } from 'react';

import { FieldProps } from 'formik';
import IconSvg from '../../IconSvg';
import { debounce } from '../../../../util/schedulers';
import { getActions } from '../../../../global';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import IconSvgSettings from '../../../middle/settings/icons/IconSvgSettings';

interface CustomInputProps {
  type?: string;
  label?: string;
  labelName?: string;
  iconLeft?: JSX.Element;
  iconRight?: JSX.Element;
  className: string;
  is_required?: boolean;
  withoutCleaning?: boolean;
  regexp?: RegExp;
  prefix?: string;
  autoFocus: boolean;
  size?: 'default' | 'smaller' | 'tiny';
}

const runDebouncedForCheckUsername = debounce((cb) => cb(), 250, false);

const Input: FC<CustomInputProps & FieldProps> = ({
  field,
  form: { touched, errors, setFieldValue },
  type = 'text',
  autoFocus,
  label,
  labelName,
  iconLeft,
  iconRight,
  is_required,
  className,
  withoutCleaning,
  regexp,
  prefix = '',
  size = 'default',
  ...props
}) => {
  const { checkUsernameInRegister, checkEmailInRegister } = getActions();
  const { value, name } = field;
  const handleClearValue = () => {
    setFieldValue(name, '');
  };
  const inputRef = useRef(null);
  const { t } = useTranslation();
  const isCheckName = name === 'username';
  const isCheckEmail = name === 'email';

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const newValue = regexp
      ? val.replace(regexp, '')
      : prefix
      ? val.replace(prefix, '')
      : val;

    setFieldValue(name, newValue);
    if (isCheckName && newValue.length > 4) {
      runDebouncedForCheckUsername(() => {
        if (value !== newValue) {
          checkUsernameInRegister({ username: newValue });
        }
      });
    }
    if (isCheckEmail && newValue.includes('@')) {
      runDebouncedForCheckUsername(() => {
        if (value !== newValue) {
          checkEmailInRegister({ email: newValue });
        }
      });
    }
  };

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      //@ts-ignore
      inputRef.current.focus();
    }
  }, [inputRef, autoFocus]);

  return (
    <div
      className={classNames('input', {
        error: touched[name] && errors[name],
      })}
    >
      <div className='input-label-name'>{labelName}</div>
      <div
        className={classNames('input-wrapper', { amount: name === 'amount' })}
      >
        {iconLeft && <span className='input-icon left'>{iconLeft}</span>}
        {name === 'amount' && <IconSvg name='dollar' w='24' h='24' />}
        <input
          ref={inputRef}
          type={type}
          {...field}
          onChange={handleChange}
          value={`${prefix}${value}`}
          {...props}
          className={classNames('form-control', className, size, {
            'input-item--left-icon': iconLeft,
            'as-disabled': !value,
          })}
          style={
            name === 'amount'
              ? { width: `${(value.length || 1) * 26 + 8}px` }
              : undefined
          }
        />
        {label && !value && (
          <label>
            {is_required && <span>* </span>}
            {label}
          </label>
        )}

        {(value && !withoutCleaning) || iconRight ? (
          <div className='input-icon right'>
            {value && !withoutCleaning && (
              <button type='button' onClick={handleClearValue}>
                <IconSvg name='close-circle' />
              </button>
            )}
            {iconRight}
          </div>
        ) : null}
      </div>
      {touched[name] && errors[name] && (
        <p className='input-notification--error'>{String(errors[name])}</p>
      )}
    </div>
  );
};

export default Input;
