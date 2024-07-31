import React, { FC, useState } from 'react';
import { FieldProps } from 'formik';
import classNames from 'classnames';
import IconSvg from '../../IconSvg';
import { useTranslation } from 'react-i18next';

interface CustomInputProps {
  label: string;
  is_required?: boolean;
  iconRight?: JSX.Element;
}

const PasswordField: FC<FieldProps & CustomInputProps> = ({
  field,
  form: { touched, errors, setFieldValue },
  label,
  is_required,
  iconRight,
  ...props
}) => {
  const { t } = useTranslation();
  const [isShowPass, setIsShowPass] = useState(false);
  const handleShowPass = () => setIsShowPass(!isShowPass);
  const handleClearValue = () => {
    setFieldValue(field.name, '');
  };
  return (
    <div
      className={classNames('input', {
        error: touched[field.name] && errors[field.name],
      })}
    >
      <div className='input-wrapper'>
        <input
          {...field}
          {...props}
          autoComplete='off'
          //type={isShowPass ? 'text' : 'password'}
          type='text'
          className={classNames('form-control', {
            'as-disabled': !field.value,
            'password-mask': !isShowPass,
          })}
        />
        {label && !field.value && (
          <label>
            {is_required && <span>* </span>}
            {label}
          </label>
        )}
        <div className='input-icon right'>
          {field.value && (
            <button type='button' onClick={handleClearValue}>
              <IconSvg name='close-circle' />
            </button>
          )}
          {iconRight || (
            <button type='button' onClick={handleShowPass}>
              {isShowPass ? (
                <IconSvg name='eye' />
              ) : (
                <IconSvg name='eye-hide' />
              )}
            </button>
          )}
        </div>
      </div>
      {touched[field.name] && errors[field.name] && (
        <p className='input-notification--error'>
          {t(String(errors[field.name]))}
        </p>
      )}
    </div>
  );
};

export default PasswordField;
