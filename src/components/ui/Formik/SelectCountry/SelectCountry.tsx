import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { ApiCountryCode } from '../../../../api/types';
import { ANIMATION_END_DELAY } from '../../../../config';
import { useTranslation } from 'react-i18next';
import useSyncEffect from '../../../../hooks/useSyncEffect';
import classNames from 'classnames';
import Spinner from '../../Spinner';
import DropdownMenu from '../../DropdownMenu';
import MenuItem from '../../MenuItem';
import { prepareSearchWordsForNeedle } from '../../../../util/searchWords';
import { withGlobal } from '../../../../global';

import '../../../auth/CountryCodeInput.scss';
import { FieldProps } from 'formik';

type StateProps = {
  phoneCodeList: ApiCountryCode[];
};

type OwnProps = {
  scrollId?: string;
  className?: string;
  label?: string;
  isLoading?: boolean;
  positionY?: 'top' | 'bottom';
  onChange: (value: ApiCountryCode) => void;
};

const MENU_HIDING_DURATION = 200 + ANIMATION_END_DELAY;
const SELECT_TIMEOUT = 50;

const SelectCountry: FC<OwnProps & StateProps & FieldProps> = ({
  scrollId,
  field,
  form: { touched, errors, setFieldValue },
  isLoading,
  phoneCodeList,
  className,
  label,
  positionY,
}) => {
  const { t } = useTranslation();
  const { name, value } = field;
  const inputRef = useRef<HTMLInputElement>(null);
  const [country, setCountry] = useState<ApiCountryCode | undefined>();
  const [filter, setFilter] = useState<string | undefined>();
  const [filteredList, setFilteredList] = useState<ApiCountryCode[]>([]);

  const updateFilter = useCallback(
    (filterValue?: string) => {
      setFilter(filterValue);
      setFilteredList(getFilteredList(phoneCodeList, filterValue));
    },
    [phoneCodeList]
  );
  useSyncEffect(
    ([prevPhoneCodeList]) => {
      if (!prevPhoneCodeList?.length && phoneCodeList.length) {
        setFilteredList(getFilteredList(phoneCodeList, filter));
      }
    },
    [phoneCodeList, filter]
  );

  function getFilteredList(
    currentList: ApiCountryCode[],
    filter = ''
  ): ApiCountryCode[] {
    const countryList = currentList.filter((country) => country.name !== 'AQ');
    if (!filter.length) {
      return countryList;
    }

    const searchWords = prepareSearchWordsForNeedle(filter);

    return countryList.filter(
      (country) =>
        searchWords(country.defaultName) ||
        (country.name && searchWords(country.name))
    );
  }

  useEffect(() => {
    if (value && !country) {
      setCountry(phoneCodeList.find((el) => el.countryCode === value));
    }
  }, [value, country]);

  const handleChange = useCallback(
    (country: ApiCountryCode) => {
      setFieldValue(name, country.countryCode);
      setCountry(country);
      setTimeout(() => updateFilter(undefined), MENU_HIDING_DURATION);
    },
    [updateFilter]
  );

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      updateFilter(e.currentTarget.value);
    },
    [updateFilter]
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.keyCode !== 8) {
        return;
      }

      const target = e.currentTarget;
      if (country && filter === undefined) {
        target.value = '';
      }

      updateFilter(target.value);
    },
    [filter, updateFilter, country]
  );

  const CodeInput: FC<{ onTrigger: () => void; isOpen?: boolean }> =
    useCallback(
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

        const handleCodeInput = (e: React.FormEvent<HTMLInputElement>) => {
          handleInput(e);
          handleTrigger();
        };

        const inputValue =
          filter ?? (country?.defaultName || country?.name || '');

        return (
          <>
            {label && <div className='input-label-name'>{label}</div>}
            <div className={classNames('input', { touched: country })}>
              <div className='input-wrapper'>
                <input
                  ref={inputRef}
                  className={classNames('form-control', { focus: isOpen })}
                  value={inputValue}
                  autoComplete='off'
                  onClick={handleTrigger}
                  onFocus={handleTrigger}
                  onInput={handleCodeInput}
                  onKeyDown={handleInputKeyDown}
                />
                {!value && !filter && (
                  <label>{t('Registration.label_country')}</label>
                )}
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
                <p className='input-notification--error'>
                  {String(errors[name])}
                </p>
              )}
            </div>
          </>
        );
      },
      [filter, handleInput, handleInputKeyDown, isLoading, country, field]
    );

  return (
    <DropdownMenu
      className={classNames(
        'CountryCodeInput select-dropdown no-blur',
        className
      )}
      trigger={CodeInput}
      positionY={positionY}
    >
      {filteredList.map((country: ApiCountryCode) => (
        <MenuItem
          key={`${country.iso2}-${country.countryCode}`}
          onClick={() => handleChange(country)}
        >
          <span className='country-flag'>
            <img src={`${country.iso2}`} alt='' />
          </span>
          <span className='country-name'>
            {country.defaultName || country.name}
          </span>
        </MenuItem>
      ))}
      {!filteredList.length && (
        <MenuItem key='no-results' className='no-results' disabled>
          <span>{t('Registration.country_none')}</span>
        </MenuItem>
      )}
    </DropdownMenu>
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    const {
      countryList: { phoneCodes: phoneCodeList },
    } = global;
    return {
      phoneCodeList,
    };
  })(SelectCountry)
);
