import React, { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useFlag from '../../../../hooks/useFlag';
import CalendarModal from '../../../common/CalendarModal';
import { FieldProps } from 'formik';
import classNames from 'classnames';
import IconSvg from '../../IconSvg';
import useLastCallback from '../../../../hooks/useLastCallback';

interface OwnProps {
  label?: string;
  is_required?: boolean;
  onlyTime?: boolean;
  maxAt?: number;
  minAt?: number;
  isPastMode?: boolean;
  isFutureMode?: boolean;
  size?: 'default' | 'smaller' | 'tiny';
}

const SelectDate: FC<OwnProps & FieldProps> = ({
  field,
  form: { touched, errors, setFieldValue },
  label,
  is_required,
  onlyTime,
  maxAt,
  minAt,
  isFutureMode,
  size = 'default',
  ...props
}) => {
  const { t } = useTranslation();
  const { name, value } = field;
  const DEFAULT_EXPIRE_DATE = {
    hour: 3600000,
    day: 86400000,
    week: 604800000,
  };
  const DEFAULT_CUSTOM_EXPIRE_DATE = DEFAULT_EXPIRE_DATE.hour;
  const [isCalendarOpened, openCalendar, closeCalendar] = useFlag();
  const [customExpireDate, setCustomExpireDate] = useState<number>(
    maxAt || minAt || Date.now() + DEFAULT_CUSTOM_EXPIRE_DATE
  );

  const handleExpireDateChange = useCallback(
    (date: Date) => {
      setCustomExpireDate(date.getTime());
      setFieldValue(name, date);
      closeCalendar();
    },
    [closeCalendar]
  );

  const handleOpenCalendar = () => {
    openCalendar();
  };

  const handleClearValue = () => {
    setFieldValue(name, '');
  };

  const renderDate = useCallback(
    (date: Date) => {
      if (date) {
        if (onlyTime) {
          return `${date.getHours()}:${date.getMinutes()}`;
        }
        return `${t(`Calendar.lng_month${date.getMonth() + 1}`).slice(
          0,
          3
        )} ${date.getDate()}, ${date.getFullYear()}`;
      }
    },
    [value, onlyTime]
  );

  useEffect(() => {
    if (value) {
      setCustomExpireDate(value.getTime());
    }
  }, [value]);

  return (
    <>
      <div
        className={classNames('input', {
          error: touched[name] && errors[name],
        })}
      >
        <div className='input-wrapper'>
          <input
            readOnly
            onClick={handleOpenCalendar}
            value={value && renderDate(value)}
            //{...field}
            {...props}
            className={classNames('form-control', size, {
              'as-disabled': !value,
            })}
          />
          {label && !value && (
            <label>
              {is_required && <span>* </span>}
              {label}
            </label>
          )}
          <div className='input-icon right'>
            {value && (
              <button type='button' onClick={handleClearValue}>
                <IconSvg name='close-circle' />
              </button>
            )}
            <button type='button' onClick={handleOpenCalendar}>
              {onlyTime ? (
                <IconSvg name='clock-outline' />
              ) : (
                <IconSvg name='calendar' />
              )}
            </button>
          </div>
        </div>
        {touched[name] && errors[name] && (
          <p className='input-notification--error'>{t(String(errors[name]))}</p>
        )}
      </div>
      <CalendarModal
        isOpen={isCalendarOpened}
        onClose={closeCalendar}
        onSubmit={handleExpireDateChange}
        onlyTime={onlyTime}
        selectedAt={customExpireDate}
        submitButtonLabel={String(t('Ok'))}
        maxAt={maxAt}
        minAt={minAt}
        isFutureMode={isFutureMode}
      />
    </>
  );
};

export default SelectDate;
