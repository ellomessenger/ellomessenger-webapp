import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { ApiCountryCode } from '../../api/types';
import { getActions, withGlobal } from '../../global';
import Checkbox from '../ui/Checkbox';
import useSyncEffect from '../../hooks/useSyncEffect';
import { prepareSearchWordsForNeedle } from '../../util/searchWords';
import useLastCallback from '../../hooks/useLastCallback';
import Loading from '../ui/Loading';
import SearchInput from '../ui/SearchInput';
import { IGenre } from '../../global/types';
import useEffectOnce from '../../hooks/useEffectOnce';

type OwnProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  confirmHandler: (category: string | undefined) => void;
  value?: string;
  isGanre?: boolean;
};

type StateProps = {
  channelCategories: string[];
};

const CategoryModal: FC<OwnProps & StateProps> = ({
  title,
  isGanre,
  value,
  isOpen,
  onClose,
  confirmHandler,
  channelCategories,
}) => {
  const { getCategoriesForChannel, getGenresForChannel } = getActions();
  const [category, setCategory] = useState<string | undefined>();
  const [filter, setFilter] = useState<string | undefined>();
  const [filteredList, setFilteredList] = useState<string[]>([]);

  const updateFilter = useCallback(
    (filterValue?: string) => {
      setFilter(filterValue);
      setFilteredList(getFilteredList(channelCategories, filterValue));
    },
    [channelCategories]
  );

  const handleChange = useCallback(
    (category: string) => {
      setCategory(category);
    },
    [updateFilter]
  );

  const handleClickConfirm = useLastCallback(() => {
    confirmHandler(category);
    onClose();
  });

  const handleClosed = useLastCallback(() => {
    onClose();
    setCategory(channelCategories.find((el) => el === value));
  });

  useSyncEffect(
    ([prevchannelCategories]) => {
      if (!prevchannelCategories?.length && channelCategories.length) {
        setFilteredList(getFilteredList(channelCategories, filter));
      }
    },
    [channelCategories, filter]
  );

  useEffect(() => {
    setCategory(channelCategories.find((el) => el === value));
  }, []);

  useEffect(() => {
    getCategoriesForChannel();
    getGenresForChannel();
  }, []);

  return (
    <Modal
      className='confirm'
      title={title}
      isOpen={isOpen}
      centered
      onClose={handleClosed}
      hasCloseButton
    >
      <div className='modal-content'>
        <SearchInput
          value={filter}
          inputId='CategorySearch'
          onChange={updateFilter}
        />
        <div className='CountryCodeInput category-modal custom-scroll mt-3'>
          {filteredList.length ? (
            <>
              <Checkbox
                label={isGanre ? 'All Genres' : 'All Categories'}
                checked={!category}
                onChange={() => setCategory(undefined)}
              />
              {filteredList.map((item: string) => (
                <Checkbox
                  key={item}
                  label={
                    <>
                      <span className='country-name'>{item}</span>
                    </>
                  }
                  checked={item === category}
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

function getFilteredList(categoryList: string[], filter = ''): string[] {
  if (!filter.length) {
    return categoryList;
  }

  const searchWords = prepareSearchWordsForNeedle(filter);

  return categoryList.filter((country) => searchWords(country));
}

export default memo(
  withGlobal<OwnProps>((global, { isGanre }): StateProps => {
    const { channelCategories, channelGenres } = global;
    const formatGenre = channelGenres.map((el) => el.genre);
    return {
      channelCategories: isGanre ? formatGenre : channelCategories,
    };
  })(CategoryModal)
);
