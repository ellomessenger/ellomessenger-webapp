import classNames from 'classnames';
import { FieldProps } from 'formik';
import React, {
  FC,
  ChangeEvent,
  FormEvent,
  RefObject,
  memo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  className?: string;
  label?: string;
  error?: string;
  is_required?: boolean;
  maxLength?: number;
  maxLengthIndicator?: string;
  tabIndex?: number;
  inputMode?:
    | 'text'
    | 'none'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search';
  noReplaceNewlines?: boolean;
};

const TextArea: FC<OwnProps & FieldProps> = ({
  field,
  form: { touched, errors, setFieldValue },
  className,
  label,
  error,
  inputMode,
  maxLength,
  maxLengthIndicator,
  tabIndex,
  noReplaceNewlines,
  is_required,
  ...props
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';

  return (
    <div
      className={classNames('input', {
        error: touched[field.name] && errors[field.name],
      })}
      dir={isRtl ? 'rtl' : undefined}
    >
      <div className='input-wrapper'>
        <textarea
          className={classNames('form-control', className, {
            'as-disabled': !field.value,
          })}
          dir='auto'
          {...field}
          {...props}
          tabIndex={tabIndex}
          maxLength={maxLength}
          inputMode={inputMode}
        />
        {label && !field.value && (
          <label>
            {is_required && <span>* </span>}
            {label}
          </label>
        )}
        {maxLengthIndicator && (
          <div className='max-length-indicator'>{maxLengthIndicator}</div>
        )}
      </div>
    </div>
  );
};

export default memo(TextArea);
