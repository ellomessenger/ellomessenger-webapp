import React, { FC, useState, memo, useCallback, useRef } from 'react';
import { getActions, withGlobal } from '../../global';

import type { ApiCountryCode } from '../../api/types';

import { ANIMATION_END_DELAY } from '../../config';
import { prepareSearchWordsForNeedle } from '../../util/searchWords';

import useSyncEffect from '../../hooks/useSyncEffect';

import DropdownMenu from '../ui/DropdownMenu';
import MenuItem from '../ui/MenuItem';
import Spinner from '../ui/Spinner';

import './CountryCodeInput.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import useEffectOnce from '../../hooks/useEffectOnce';

type StateProps = {
  phoneCodeList: ApiCountryCode[];
};

type OwnProps = {
  id: string;
  value?: ApiCountryCode;
  isLoading?: boolean;
  onChange: (value: ApiCountryCode) => void;
  scrollId: string;
};

const MENU_HIDING_DURATION = 200 + ANIMATION_END_DELAY;
const SELECT_TIMEOUT = 50;

const CountryCodeInput: FC<OwnProps & StateProps> = ({
  id,
  value,
  isLoading,
  onChange,
  phoneCodeList,
  scrollId,
}) => {
  const { t } = useTranslation();
  const { loadCountryList } = getActions();
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleChange = useCallback(
    (country: ApiCountryCode) => {
      onChange(country);

      setTimeout(() => updateFilter(undefined), MENU_HIDING_DURATION);
    },
    [onChange, updateFilter]
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
      if (value && filter === undefined) {
        target.value = '';
      }

      updateFilter(target.value);
    },
    [filter, updateFilter, value]
  );

  useEffectOnce(() => {
    loadCountryList({});
  });

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

          const formEl = document.getElementById(scrollId)!;
          formEl.scrollTo({ top: formEl.scrollHeight, behavior: 'smooth' });
        };

        const handleCodeInput = (e: React.FormEvent<HTMLInputElement>) => {
          handleInput(e);
          handleTrigger();
        };

        const inputValue = filter ?? (value?.defaultName || value?.name || '');

        return (
          <div className={classNames('input', { touched: value })}>
            <input
              ref={inputRef}
              className={classNames('form-control', { focus: isOpen })}
              type='text'
              id={id}
              value={inputValue}
              autoComplete='off'
              onClick={handleTrigger}
              onFocus={handleTrigger}
              onInput={handleCodeInput}
              onKeyDown={handleInputKeyDown}
            />
            <label>{t('Registration.label_country')}</label>
            {isLoading ? (
              <Spinner color='black' />
            ) : (
              <i
                onClick={handleTrigger}
                className={classNames('css-icon-down', { open: isOpen })}
              />
            )}
          </div>
        );
      },
      [filter, handleInput, handleInputKeyDown, id, isLoading, value]
    );

  return (
    <DropdownMenu
      className='CountryCodeInput select-dropdown'
      trigger={CodeInput}
      positionY='bottom'
    >
      {filteredList.map((country: ApiCountryCode) => (
        <MenuItem
          key={`${country.iso2}-${country.countryCode}`}
          className={value && country.iso2 === value.iso2 ? 'selected' : ''}
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

function getFilteredList(
  countryList: ApiCountryCode[],
  filter = ''
): ApiCountryCode[] {
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

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    const {
      countryList: { phoneCodes: phoneCodeList },
    } = global;
    return {
      phoneCodeList,
    };
  })(CountryCodeInput)
);
