import React, { FC, memo, useCallback, useRef } from 'react';

import { LoadMoreDirection, SettingsScreens } from '../../../types';

import { useTranslation } from 'react-i18next';

import MenuItem from '../../ui/MenuItem';
import ChatFeedList from './ChatFeedList';
import './FeedChats.scss';
import { ISearchQuery } from '../../../global/types';
import useLastCallback from '../../../hooks/useLastCallback';
import { getActions, withGlobal } from '../../../global';
import classNames from 'classnames';
import { selectTabState } from '../../../global/selectors';
import CountryModal from '../../common/CountryModal';
import useFlag from '../../../hooks/useFlag';
import { ApiCountryCode } from '../../../api/types';
import CategoryModal from '../../common/CategoryModal';
import useEffectOnce from '../../../hooks/useEffectOnce';
import { FeedLeftList, FeedMiddleList } from '../../main/Main';
import { throttle } from '../../../util/schedulers';
import resetScroll from '../../../util/resetScroll';

const runThrottled = throttle((cb) => cb(), 500, true);

export type OwnProps = {
  isActive: boolean;
  feedLeftScreen: FeedLeftList;
  setFeedLeftScreen: (screen: FeedLeftList) => void;
  feedMiddleScreen: FeedMiddleList;
  setFeedMiddleScreen: (screen: FeedMiddleList) => void;
  onSettingsScreenSelect: (screen: SettingsScreens) => void;
};

type StateProps = {
  filter?: ISearchQuery;
  query?: string;
  phoneCodeList: ApiCountryCode[];
  emptyChats?: boolean;
  lastSyncTime?: number;
};

const FeedChats: FC<OwnProps & StateProps> = ({
  isActive,
  onSettingsScreenSelect,
  filter,
  query,
  lastSyncTime,
  phoneCodeList,
  emptyChats,
  feedLeftScreen,
  feedMiddleScreen,
  setFeedLeftScreen,
  setFeedMiddleScreen,
}) => {
  const { searchChannelsGlobal } = getActions();

  const [showCountryModal, openCountryModal, closeCountryModal] = useFlag();
  const [showCategoryModal, openCategoryModal, closeCategoryModal] = useFlag();
  const [showGenreModal, openGenreModal, closeGenreModal] = useFlag();
  const slideRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  let { isNew, isCourse, isPaid, isPublic, category, country, genre, page } =
    filter || {};

  const handleClickRecomended = useLastCallback(() => {
    setFeedLeftScreen(FeedLeftList.ForYou);
    searchChannelsGlobal({
      ...(Boolean(filter)
        ? { filter: { ...filter, page: 1 } }
        : { clean: true }),
    });
  });

  const handleLoadMoreRecomended = useCallback(
    ({
      direction,
      noScroll,
    }: {
      direction: LoadMoreDirection;
      noScroll: boolean;
    }) => {
      if (
        lastSyncTime &&
        direction === LoadMoreDirection.Backwards &&
        feedLeftScreen === FeedLeftList.ForYou &&
        !noScroll
      ) {
        runThrottled(() => {
          page && searchChannelsGlobal({ filter: { page: page + 1 } });
        });
      }
    },
    [feedLeftScreen, lastSyncTime, page]
  );

  const handleClickFollowing = useLastCallback(() => {
    setFeedLeftScreen(FeedLeftList.Following);
  });

  const handleClickExplore = useLastCallback(() => {
    setFeedLeftScreen(FeedLeftList.Explore);
  });

  const scrollContainer = containerRef.current!;

  const handleChangeAll = useLastCallback(() => {
    resetScroll(scrollContainer, 0);
    searchChannelsGlobal({ clean: true, filter: { page: 1 } });
  });

  const handleChangeNew = useLastCallback(() => {
    resetScroll(scrollContainer, 0);
    searchChannelsGlobal({
      filter: { ...(isNew ? { isNew: undefined } : { isNew: true }), page: 1 },
    });
  });

  const handleChangeCourse = useLastCallback(() => {
    resetScroll(scrollContainer, 0);
    searchChannelsGlobal({
      filter: {
        ...(isCourse
          ? { isCourse: undefined }
          : { isCourse: true, isPaid: undefined, isPublic: undefined }),
        page: 1,
      },
    });
  });

  const handleChangePaid = useLastCallback(() => {
    resetScroll(scrollContainer, 0);
    searchChannelsGlobal({
      filter: {
        ...(isPaid
          ? { isPaid: undefined }
          : { isPaid: true, isCourse: undefined, isPublic: undefined }),
        page: 1,
      },
    });
  });

  const handleChangeFree = useLastCallback(() => {
    resetScroll(scrollContainer, 0);
    searchChannelsGlobal({
      filter: {
        ...(isPublic
          ? { isPublic: undefined }
          : { isCourse: undefined, isPaid: undefined, isPublic: true }),
        page: 1,
      },
    });
  });

  const handleChangeCountry = useLastCallback(
    (country: ApiCountryCode | undefined) => {
      resetScroll(scrollContainer, 0);
      searchChannelsGlobal({
        filter: { country: country?.countryCode || undefined, page: 1 },
      });
    }
  );

  const handleChangeCategory = useLastCallback(
    (category: string | undefined) => {
      resetScroll(scrollContainer, 0);
      searchChannelsGlobal({
        filter: { genre: undefined, category: category || undefined, page: 1 },
      });
    }
  );

  const handleChangeGenre = useLastCallback((genre: string | undefined) => {
    resetScroll(scrollContainer, 0);
    searchChannelsGlobal({
      filter: { genre: genre || undefined, page: 1 },
    });
  });

  useEffectOnce(() => {
    if (emptyChats) {
      setFeedLeftScreen(FeedLeftList.Explore);
    }
  });

  const currentCountry = phoneCodeList.find((el) => el.countryCode === country);
  const countryName =
    currentCountry && (currentCountry.defaultName || currentCountry.name);

  const container = slideRef.current!;

  const slideFilter = useCallback(() => {
    let pageX = 0;
    if (!container) return;
    document.onmousemove = (e) => {
      if (pageX !== 0) {
        container.scrollLeft = container.scrollLeft + (pageX - e.pageX);
      }
      pageX = e.pageX;
    };

    container.ondragstart = () => {
      return false;
    };
  }, [container]);

  document.onmouseup = () => {
    document.onmousemove = null;
    if (container) container.onmouseup = null;
  };

  return (
    <>
      <div className='FeedChats'>
        <div className='LeftMainMenu'>
          <MenuItem
            className={
              feedLeftScreen === FeedLeftList.Following ? 'active' : ''
            }
            onClick={handleClickFollowing}
          >
            {t('Feed.Following')}
          </MenuItem>
          <MenuItem
            className={feedLeftScreen === FeedLeftList.Explore ? 'active' : ''}
            onClick={handleClickExplore}
          >
            {t('Feed.Explore')}
          </MenuItem>
          <MenuItem
            className={feedLeftScreen === FeedLeftList.ForYou ? 'active' : ''}
            onClick={handleClickRecomended}
          >
            {t('Feed.ForYou')}
          </MenuItem>
        </div>
        {feedLeftScreen === FeedLeftList.ForYou && (
          <div
            ref={slideRef}
            onMouseDown={slideFilter}
            className='filter-group custom-scroll'
          >
            <button
              type='button'
              onClick={handleChangeAll}
              className={classNames('Button', {
                selected: filter?.q === '' && Object.keys(filter).length === 2,
              })}
            >
              All
            </button>
            <button
              type='button'
              onClick={handleChangeNew}
              className={classNames('Button', {
                selected: isNew,
              })}
            >
              New
            </button>
            <button
              type='button'
              onClick={handleChangeCourse}
              className={classNames('Button', {
                selected: isCourse,
              })}
            >
              Course
            </button>
            <button
              type='button'
              onClick={handleChangePaid}
              className={classNames('Button', {
                selected: isPaid,
              })}
            >
              Paid
            </button>
            <button
              type='button'
              onClick={handleChangeFree}
              className={classNames('Button', {
                selected: isPublic,
              })}
            >
              Free
            </button>
            <button type='button' onClick={openCountryModal} className='Button'>
              {countryName || 'All country'}
              <i className='css-icon-down' />
            </button>
            <button
              type='button'
              onClick={openCategoryModal}
              className='Button'
            >
              {category || 'All Categories'}
              <i className='css-icon-down' />
            </button>
            {category?.toLowerCase() === 'music' && (
              <button type='button' onClick={openGenreModal} className='Button'>
                {genre || 'All Genres'}
                <i className='css-icon-down' />
              </button>
            )}
          </div>
        )}

        <ChatFeedList
          elRef={containerRef}
          isActive={isActive}
          isFilter={Boolean(filter)}
          feedLeftScreen={feedLeftScreen}
          feedMiddleScreen={feedMiddleScreen}
          setFeedLeftScreen={setFeedLeftScreen}
          setFeedMiddleScreen={setFeedMiddleScreen}
          handleLoadMoreRecomended={handleLoadMoreRecomended}
        />
      </div>
      <CountryModal
        isOpen={showCountryModal}
        onClose={closeCountryModal}
        confirmHandler={handleChangeCountry}
        value={country}
      />
      <CategoryModal
        isOpen={showCategoryModal}
        onClose={closeCategoryModal}
        confirmHandler={handleChangeCategory}
        value={country}
        title='Category'
      />

      <CategoryModal
        isOpen={showGenreModal}
        isGanre
        onClose={closeGenreModal}
        confirmHandler={handleChangeGenre}
        value={country}
        title='Genre'
      />
    </>
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    const {
      countryList: { phoneCodes: phoneCodeList },
      chats,
      lastSyncTime,
    } = global;
    const { query, filter } = selectTabState(global).globalSearch;
    return {
      filter,
      query,
      phoneCodeList,
      emptyChats: !chats.listIds.feed,
      lastSyncTime,
    };
  })(FeedChats)
);
