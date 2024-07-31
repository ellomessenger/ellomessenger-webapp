import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ApiCountryCode } from '../../api/types';
import { withGlobal } from '../../global';
import Checkbox from '../ui/Checkbox';
import useSyncEffect from '../../hooks/useSyncEffect';
import { prepareSearchWordsForNeedle } from '../../util/searchWords';
import useLastCallback from '../../hooks/useLastCallback';
import Loading from '../ui/Loading';
import SearchInput from '../ui/SearchInput';

type OwnProps = {
  isOpen: boolean;
  onClose: () => void;
  confirmHandler: (country: ApiCountryCode | undefined) => void;
  value?: string;
};

type StateProps = {
  phoneCodeList: ApiCountryCode[];
};

const CountryModal: FC<OwnProps & StateProps> = ({
  value,
  isOpen,
  onClose,
  confirmHandler,
  phoneCodeList,
}) => {
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

  const handleChange = useCallback(
    (country: ApiCountryCode) => {
      setCountry(country);
    },
    [updateFilter]
  );

  const handleClickConfirm = useLastCallback(() => {
    confirmHandler(country);
    onClose();
  });

  const handleClosed = useLastCallback(() => {
    onClose();
    setCountry(phoneCodeList.find((el) => el.countryCode === value));
  });

  useSyncEffect(
    ([prevPhoneCodeList]) => {
      if (!prevPhoneCodeList?.length && phoneCodeList.length) {
        setFilteredList(getFilteredList(phoneCodeList, filter));
      }
    },
    [phoneCodeList, filter]
  );

  useEffect(() => {
    setCountry(phoneCodeList.find((el) => el.countryCode === value));
  }, []);

  return (
    <Modal
      className='confirm'
      title='Your country'
      isOpen={isOpen}
      centered
      onClose={handleClosed}
      hasCloseButton
    >
      <div className='modal-content'>
        <SearchInput
          value={filter}
          inputId='CountrySearch'
          onChange={updateFilter}
        />
        <div className='CountryCodeInput country-modal custom-scroll mt-3'>
          {filteredList.length ? (
            <>
              <Checkbox
                label='All country'
                checked={!country}
                onChange={() => setCountry(undefined)}
              />
              {filteredList.map((item: ApiCountryCode) => (
                <Checkbox
                  key={`${item.iso2}-${item.countryCode}`}
                  label={
                    <>
                      <span className='country-flag'>
                        <img src={`${item.iso2}`} alt='' />
                      </span>
                      <span className='country-name'>
                        {item.defaultName || item.name}
                      </span>
                    </>
                  }
                  checked={item === country}
                  onChange={() => handleChange(item)}
                />
              ))}
            </>
          ) : (
            <Loading />
          )}
        </div>

        <div className='dialog-buttons mt-4'>
          <Button onClick={handleClickConfirm}>Ok</Button>
        </div>
      </div>
    </Modal>
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
  })(CountryModal)
);
