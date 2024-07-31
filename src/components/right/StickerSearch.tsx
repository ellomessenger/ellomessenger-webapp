import React, { FC, memo, useEffect, useRef } from 'react';
import { getActions, withGlobal } from '../../global';

import { throttle } from '../../util/schedulers';
import {
  selectCurrentStickerSearch,
  selectTabState,
} from '../../global/selectors';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import useHistoryBack from '../../hooks/useHistoryBack';

import Loading from '../ui/Loading';
import StickerSetResult from './StickerSetResult';

import './StickerSearch.scss';
import { useTranslation } from 'react-i18next';

export type OwnProps = {
  onClose: (shouldScrollUp?: boolean) => void;
  isActive: boolean;
};

type StateProps = {
  query?: string;
  featuredIds?: string[];
  resultIds?: string[];
  isModalOpen: boolean;
};

const INTERSECTION_THROTTLE = 200;

const runThrottled = throttle((cb) => cb(), 60000, true);

const StickerSearch: FC<OwnProps & StateProps> = ({
  isActive,
  query,
  featuredIds,
  resultIds,
  isModalOpen,
  onClose,
}) => {
  const { loadFeaturedStickers } = getActions();

  const containerRef = useRef<HTMLDivElement>(null);

  const { i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';

  const { observe: observeIntersection } = useIntersectionObserver({
    rootRef: containerRef,
    throttleMs: INTERSECTION_THROTTLE,
  });

  // Due to the parent Transition, this component never gets unmounted,
  // that's why we use throttled API call on every update.
  useEffect(() => {
    runThrottled(() => {
      loadFeaturedStickers();
    });
  });

  useHistoryBack({
    isActive,
    onBack: onClose,
  });

  function renderContent() {
    if (query === undefined) {
      return undefined;
    }

    if (!query && featuredIds) {
      return featuredIds.map((id) => (
        <StickerSetResult
          key={id}
          stickerSetId={id}
          observeIntersection={observeIntersection}
          isModalOpen={isModalOpen}
        />
      ));
    }

    if (resultIds) {
      if (!resultIds.length) {
        return (
          <p className='helper-text' dir='auto'>
            Nothing found.
          </p>
        );
      }

      return resultIds.map((id) => (
        <StickerSetResult
          key={id}
          stickerSetId={id}
          observeIntersection={observeIntersection}
          isModalOpen={isModalOpen}
        />
      ));
    }

    return <Loading />;
  }

  return (
    <div
      ref={containerRef}
      className='StickerSearch custom-scroll'
      dir={isRtl ? 'rtl' : undefined}
    >
      {renderContent()}
    </div>
  );
};

export default memo(
  withGlobal((global): StateProps => {
    const currentSearch = selectCurrentStickerSearch(global);
    const { query, resultIds } = currentSearch || {};
    const { featured } = global.stickers;

    return {
      query,
      featuredIds: featured.setIds,
      resultIds,
      isModalOpen: Boolean(selectTabState(global).openedStickerSetShortName),
    };
  })(StickerSearch)
);
