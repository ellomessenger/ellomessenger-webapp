import React, {
  ChangeEvent,
  FC,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';
import { FieldProps } from 'formik';
import IconSvg from '../../IconSvg';
import { withGlobal } from '../../../../global';
import Input from 'react-phone-number-input/input';

import { ApiCountryCode } from '../../../../api/types';

interface CustomInputProps {
  label?: string;
  labelName?: string;
  className: string;
  withoutCleaning?: boolean;
  size?: 'default' | 'smaller' | 'tiny';
}
type StateProps = {
  phoneCodeList: ApiCountryCode[];
};

const InputPhone: FC<CustomInputProps & FieldProps & StateProps> = ({
  field,
  form: { touched, errors, setFieldValue, values },
  label,
  labelName,
  className,
  withoutCleaning,
  size = 'default',
  phoneCodeList,
  ...props
}) => {
  const { value, name } = field;
  const [country, setCountry] = useState<any>('US');
  const handleClearValue = () => {
    setFieldValue(name, '');
  };

  const handleChange = (val: any) => {
    setFieldValue(name, val);
  };

  useEffect(() => {
    const newCountry = phoneCodeList.find(
      (el) => el.countryCode === values.bank_country
    );

    setCountry(newCountry?.name || 'US');
  }, [values.bank_country]);

  return (
    <div
      className={classNames('input', {
        error: touched[name] && errors[name],
      })}
    >
      <div className='input-label-name'>{labelName}</div>
      <div className='input-wrapper'>
        <Input
          country={country}
          className={classNames('form-control', className, size, {
            'as-disabled': !value,
          })}
          {...field}
          onChange={handleChange}
        />

        {label && !value && <label>{label}</label>}

        {value && !withoutCleaning && (
          <div className='input-icon right'>
            {value && !withoutCleaning && (
              <button type='button' onClick={handleClearValue}>
                <IconSvg name='close-circle' />
              </button>
            )}
          </div>
        )}
      </div>
      {touched[name] && errors[name] && (
        <p className='input-notification--error'>{String(errors[name])}</p>
      )}
    </div>
  );
};
export default memo(
  withGlobal((global): StateProps => {
    const {
      countryList: { phoneCodes: phoneCodeList },
    } = global;
    return {
      phoneCodeList,
    };
  })(InputPhone)
);
