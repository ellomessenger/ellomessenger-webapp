import React, {
  FC,
  RefObject,
  useRef,
  useEffect,
  memo,
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { CSSTransition } from 'react-transition-group';

import useFlag from '../../hooks/useFlag';
import useInputFocusOnOpen from '../../hooks/useInputFocusOnOpen';

import Loading from './Loading';
import Button from './Button';

import './SearchInput.scss';
import IconSvg from './IconSvg';
import InputText from './InputText';
import useLastCallback from '../../hooks/useLastCallback';

type OwnProps = {
  inputRef?: RefObject<HTMLInputElement>;
  children?: React.ReactNode;
  parentContainerClassName?: string;
  className?: string;
  inputId?: string;
  value?: string;
  focused?: boolean;
  isLoading?: boolean;
  spinnerColor?: 'yellow';
  spinnerBackgroundColor?: 'light';
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  canClose?: boolean;
  autoFocusSearch?: boolean;
  onChange: (value: string) => void;
  onReset?: NoneToVoidFunction;
  onFocus?: NoneToVoidFunction;
  onBlur?: NoneToVoidFunction;
  onSpinnerClick?: NoneToVoidFunction;
};

const SearchInput: FC<OwnProps> = ({
  inputRef,
  children,
  parentContainerClassName,
  value,
  inputId,
  className,
  focused,
  isLoading,
  spinnerColor,
  spinnerBackgroundColor,
  placeholder,
  disabled,
  autoComplete,
  canClose,
  autoFocusSearch,
  onChange,
  onReset,
  onFocus,
  onBlur,
  onSpinnerClick,
}) => {
  let currentRef = useRef<HTMLInputElement>(null);

  if (inputRef) {
    currentRef = inputRef;
  }
  const [isInputFocused, markInputFocused, unmarkInputFocused] =
    useFlag(focused);
  const [lastSelection, setLastSelection] = useState<number | null>(null);

  useEffect(() => {
    const input = currentRef.current;
    if (input) {
      input.setSelectionRange(lastSelection, lastSelection);
    }
  }, [inputRef, lastSelection, value]);

  useInputFocusOnOpen(currentRef, autoFocusSearch, unmarkInputFocused);

  useEffect(() => {
    if (!currentRef.current) {
      return;
    }

    if (focused) {
      currentRef.current.focus();
    } else {
      currentRef.current.blur();
    }
  }, [focused, placeholder]);

  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';

  const handleChange = useLastCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      //const { currentTarget } = event;
      const { value, selectionStart } = event.target;
      setLastSelection(selectionStart);
      onChange(value);
    }
  );

  function handleFocus() {
    markInputFocused();
    if (onFocus) {
      onFocus();
    }
  }

  function handleBlur() {
    unmarkInputFocused();
    if (onBlur) {
      onBlur();
    }
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        const element = document.querySelector(
          `.${parentContainerClassName} .ListItem-button`
        ) as HTMLElement;
        if (element) {
          element.focus();
        }
      }
    },
    [parentContainerClassName]
  );

  return (
    <div
      className={classNames('SearchInput', className, {
        'has-focus': isInputFocused,
      })}
      dir={isRtl ? 'rtl' : undefined}
    >
      {children}

      <input
        ref={currentRef}
        id={inputId}
        placeholder={placeholder || String(t('Search'))}
        className='form-control'
        value={value || ''}
        disabled={disabled}
        autoComplete={autoComplete}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />

      <i className='icon icon-svg'>
        <IconSvg name='search' w='24' h='24' />
      </i>
      <CSSTransition in={isLoading} timeout={200} unmountOnExit>
        <Loading
          color={spinnerColor}
          backgroundColor={spinnerBackgroundColor}
          onClick={onSpinnerClick}
        />
      </CSSTransition>
      {!isLoading && (value || canClose) && onReset && (
        <Button round size='tiny' color='translucent' onClick={onReset}>
          <span className='icon-close' />
        </Button>
      )}
    </div>
  );
};

export default SearchInput;
