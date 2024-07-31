import React, {
  FC,
  memo,
  ChangeEvent,
  FormEvent,
  RefObject,
  ReactElement,
} from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import IconSvg from './IconSvg';

type OwnProps = {
  elRef?: RefObject<HTMLInputElement>;
  id?: string;
  className?: string;
  classLabel?: string;
  value?: string;
  name?: string;
  label?: string;
  error?: string;
  success?: string;
  disabled?: boolean;
  as_disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
  tabIndex?: number;
  teactExperimentControlled?: boolean;
  as_text?: boolean;
  is_required?: boolean;
  prefix?: string | ReactElement;
  inputMode?:
    | 'text'
    | 'none'
    | 'tel'
    | 'url'
    | 'email'
    | 'numeric'
    | 'decimal'
    | 'search';
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onInput?: (e: FormEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  clearValue?: () => void;
};

const InputText: FC<OwnProps> = ({
  elRef,
  id,
  className,
  classLabel,
  value,
  label,
  name,
  error,
  success,
  disabled,
  as_disabled,
  readOnly,
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
  tabIndex,
  as_text,
  is_required,
  prefix,
  teactExperimentControlled,
  onChange,
  onInput,
  onKeyPress,
  onKeyDown,
  onBlur,
  onPaste,
  clearValue,
}) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';
  const labelText = error || success || label;
  const fullClassName = classNames(
    'input',
    className,
    error ? 'error' : success && 'success',
    {
      touched: value,
      disabled: disabled || readOnly,
      'with-label': labelText,
      'as-text': as_text,
      'has-prefix': prefix,
    }
  );

  return (
    <div className={fullClassName} dir={isRtl ? 'rtl' : undefined}>
      <div className='input-wrapper'>
        {prefix && <span className='prefix'>{prefix}</span>}
        <input
          ref={elRef}
          className={classNames('form-control', {
            'as-disabled': as_disabled,
          })}
          type='text'
          id={id}
          dir='auto'
          name={name}
          value={value || ''}
          tabIndex={tabIndex}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete={autoComplete}
          inputMode={inputMode}
          disabled={disabled}
          readOnly={readOnly}
          onChange={onChange}
          onInput={onInput}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          onPaste={onPaste}
          aria-label={labelText}
          // teactExperimentControlled={teactExperimentControlled}
        />
        {labelText && (
          <label className={classLabel} htmlFor={id}>
            {is_required && <span>* </span>}
            {labelText}
          </label>
        )}
        {value && clearValue && (
          <div className={`input-icon right`}>
            <button type='button' onClick={clearValue}>
              <IconSvg name='close-circle' />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(InputText);
