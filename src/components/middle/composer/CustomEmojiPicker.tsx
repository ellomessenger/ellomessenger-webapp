import React, {
  FC,
  useState,
  useEffect,
  memo,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { getGlobal, withGlobal } from '../../../global';

import type { ApiStickerSet, ApiSticker } from '../../../api/types';
import type { StickerSetOrRecent } from '../../../types';

import {
  CHAT_STICKER_SET_ID,
  FAVORITE_SYMBOL_SET_ID,
  PREMIUM_STICKER_SET_ID,
  RECENT_SYMBOL_SET_ID,
  SLIDE_TRANSITION_DURATION,
  STICKER_PICKER_MAX_SHARED_COVERS,
  STICKER_SIZE_PICKER_HEADER,
} from '../../../config';
import { IS_TOUCH_ENV } from '../../../util/windowEnvironment';
import { MEMO_EMPTY_ARRAY } from '../../../util/memo';
import fastSmoothScroll from '../../../util/fastSmoothScroll';
import animateHorizontalScroll from '../../../util/animateHorizontalScroll';
import { pickTruthy, unique } from '../../../util/iteratees';
import {
  selectIsAlwaysHighPriorityEmoji,
  selectIsChatWithSelf,
  selectIsCurrentUserPremium,
} from '../../../global/selectors';

import useAsyncRendering from '../../right/hooks/useAsyncRendering';
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';
import useHorizontalScroll from '../../../hooks/useHorizontalScroll';

import Loading from '../../ui/Loading';
import Button from '../../ui/Button';
import StickerButton from '../../common/StickerButton';
import StickerSet from './StickerSet';
import StickerSetCover from './StickerSetCover';

import './StickerPicker.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

type OwnProps = {
  chatId?: string;
  className?: string;
  loadAndPlay: boolean;
  isStatusPicker?: boolean;
  idPrefix?: string;
  withDefaultTopicIcons?: boolean;
  onCustomEmojiSelect: (sticker: ApiSticker) => void;
  onContextMenuOpen?: NoneToVoidFunction;
  onContextMenuClose?: NoneToVoidFunction;
  onContextMenuClick?: NoneToVoidFunction;
};

type StateProps = {
  customEmojisById?: Record<string, ApiSticker>;
  recentCustomEmojiIds?: string[];
  recentStatusEmojis?: ApiSticker[];
  stickerSetsById: Record<string, ApiStickerSet>;
  addedCustomEmojiIds?: string[];
  defaultTopicIconsId?: string;
  defaultStatusIconsId?: string;
  customEmojiFeaturedIds?: string[];
  canAnimate?: boolean;
  isSavedMessages?: boolean;
  isCurrentUserPremium?: boolean;
};

const SMOOTH_SCROLL_DISTANCE = 500;
const HEADER_BUTTON_WIDTH = 52; // px (including margin)
const STICKER_INTERSECTION_THROTTLE = 200;
const DEFAULT_ID_PREFIX = 'custom-emoji-set';

const stickerSetIntersections: boolean[] = [];

const CustomEmojiPicker: FC<OwnProps & StateProps> = ({
  className,
  loadAndPlay,
  addedCustomEmojiIds,
  customEmojisById,
  recentCustomEmojiIds,
  recentStatusEmojis,
  stickerSetsById,
  idPrefix = DEFAULT_ID_PREFIX,
  customEmojiFeaturedIds,
  canAnimate,
  isStatusPicker,
  isSavedMessages,
  isCurrentUserPremium,
  withDefaultTopicIcons,
  defaultTopicIconsId,
  defaultStatusIconsId,
  onCustomEmojiSelect,
  onContextMenuOpen,
  onContextMenuClose,
  onContextMenuClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const headerRef = useRef<HTMLDivElement>(null);

  const sharedCanvasRef = useRef<HTMLCanvasElement>(null);

  const sharedCanvasHqRef = useRef<HTMLCanvasElement>(null);

  const [activeSetIndex, setActiveSetIndex] = useState<number>(0);

  const recentCustomEmojis = useMemo(() => {
    return isStatusPicker
      ? recentStatusEmojis
      : Object.values(pickTruthy(customEmojisById!, recentCustomEmojiIds!));
  }, [
    customEmojisById,
    isStatusPicker,
    recentCustomEmojiIds,
    recentStatusEmojis,
  ]);

  const { observe: observeIntersection } = useIntersectionObserver(
    {
      rootRef: containerRef,
      throttleMs: STICKER_INTERSECTION_THROTTLE,
    },
    (entries) => {
      entries.forEach((entry) => {
        const { id } = entry.target as HTMLDivElement;
        if (!id || !id.startsWith(idPrefix)) {
          return;
        }

        const index = Number(id.replace(`${idPrefix}-`, ''));
        stickerSetIntersections[index] = entry.isIntersecting;
      });

      const intersectingWithIndexes = stickerSetIntersections
        .map((isIntersecting, index) => ({ index, isIntersecting }))
        .filter(({ isIntersecting }) => isIntersecting);

      if (!intersectingWithIndexes.length) {
        return;
      }

      setActiveSetIndex(
        intersectingWithIndexes[Math.floor(intersectingWithIndexes.length / 2)]
          .index
      );
    }
  );
  const { observe: observeIntersectionForCovers } = useIntersectionObserver({
    rootRef: headerRef,
  });

  const { t } = useTranslation();

  const areAddedLoaded = Boolean(addedCustomEmojiIds);

  const allSets = useMemo(() => {
    if (!addedCustomEmojiIds) {
      return MEMO_EMPTY_ARRAY;
    }

    const defaultSets: StickerSetOrRecent[] = [];

    if (isStatusPicker) {
      const defaultStatusIconsPack = stickerSetsById[defaultStatusIconsId!];
      if (defaultStatusIconsPack.stickers?.length) {
        const stickers = (defaultStatusIconsPack.stickers || []).concat(
          recentCustomEmojis || []
        );
        defaultSets.push({
          ...defaultStatusIconsPack,
          stickers,
          count: stickers.length,
          id: RECENT_SYMBOL_SET_ID,
          title: t('RecentStickers'),
        });
      }
    } else if (withDefaultTopicIcons) {
      const defaultTopicIconsPack = stickerSetsById[defaultTopicIconsId!];
      if (defaultTopicIconsPack.stickers?.length) {
        defaultSets.push({
          ...defaultTopicIconsPack,
          id: RECENT_SYMBOL_SET_ID,
          title: t('RecentStickers'),
        });
      }
    } else if (recentCustomEmojis?.length) {
      defaultSets.push({
        id: RECENT_SYMBOL_SET_ID,
        accessHash: '0',
        title: t('RecentStickers'),
        stickers: recentCustomEmojis,
        count: recentCustomEmojis.length,
        isEmoji: true as true,
      });
    }

    const setIdsToDisplay = unique(
      addedCustomEmojiIds.concat(customEmojiFeaturedIds || [])
    );

    const setsToDisplay = Object.values(
      pickTruthy(stickerSetsById, setIdsToDisplay)
    );

    return [...defaultSets, ...setsToDisplay];
  }, [
    addedCustomEmojiIds,
    isStatusPicker,
    withDefaultTopicIcons,
    recentCustomEmojis,
    customEmojiFeaturedIds,
    stickerSetsById,
    defaultStatusIconsId,
    t,
    defaultTopicIconsId,
  ]);

  const noPopulatedSets = useMemo(
    () =>
      areAddedLoaded &&
      allSets.filter((set) => set.stickers?.length).length === 0,
    [allSets, areAddedLoaded]
  );

  const canRenderContents = useAsyncRendering([], SLIDE_TRANSITION_DURATION);
  const shouldRenderContents =
    areAddedLoaded && canRenderContents && !noPopulatedSets;

  useHorizontalScroll(headerRef, !shouldRenderContents);

  // Scroll container and header when active set changes
  useEffect(() => {
    if (!areAddedLoaded) {
      return;
    }

    const header = headerRef.current;
    if (!header) {
      return;
    }

    const newLeft =
      activeSetIndex * HEADER_BUTTON_WIDTH -
      (header.offsetWidth / 2 - HEADER_BUTTON_WIDTH / 2);

    animateHorizontalScroll(header, newLeft);
  }, [areAddedLoaded, activeSetIndex]);

  const selectStickerSet = useCallback(
    (index: number) => {
      setActiveSetIndex(index);
      const stickerSetEl = document.getElementById(`${idPrefix}-${index}`)!;
      fastSmoothScroll(
        containerRef.current!,
        stickerSetEl,
        'start',
        undefined,
        SMOOTH_SCROLL_DISTANCE
      );
    },
    [idPrefix]
  );

  const handleEmojiSelect = useCallback(
    (emoji: ApiSticker) => {
      onCustomEmojiSelect(emoji);
    },
    [onCustomEmojiSelect]
  );

  function renderCover(stickerSet: StickerSetOrRecent, index: number) {
    const firstSticker = stickerSet.stickers?.[0];
    const buttonClassName = classNames(
      'symbol-set-button sticker-set-button',
      index === activeSetIndex && 'activated'
    );

    const withSharedCanvas = index < STICKER_PICKER_MAX_SHARED_COVERS;
    const isHq = selectIsAlwaysHighPriorityEmoji(
      getGlobal(),
      stickerSet as ApiStickerSet
    );

    if (
      stickerSet.id === RECENT_SYMBOL_SET_ID ||
      stickerSet.id === FAVORITE_SYMBOL_SET_ID ||
      stickerSet.id === CHAT_STICKER_SET_ID ||
      stickerSet.id === PREMIUM_STICKER_SET_ID ||
      stickerSet.hasThumbnail ||
      !firstSticker
    ) {
      return (
        <Button
          key={stickerSet.id}
          className={buttonClassName}
          ariaLabel={stickerSet.title}
          round
          faded={
            stickerSet.id === RECENT_SYMBOL_SET_ID ||
            stickerSet.id === FAVORITE_SYMBOL_SET_ID
          }
          color='translucent'
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => selectStickerSet(index)}
        >
          {stickerSet.id === RECENT_SYMBOL_SET_ID ? (
            <i className='icon-recent' />
          ) : (
            <StickerSetCover
              stickerSet={stickerSet as ApiStickerSet}
              noPlay={!canAnimate || !loadAndPlay}
              observeIntersection={observeIntersectionForCovers}
              sharedCanvasRef={
                withSharedCanvas
                  ? isHq
                    ? sharedCanvasHqRef
                    : sharedCanvasRef
                  : undefined
              }
            />
          )}
        </Button>
      );
    } else {
      return (
        <StickerButton
          key={stickerSet.id}
          sticker={firstSticker}
          size={STICKER_SIZE_PICKER_HEADER}
          title={stickerSet.title}
          className={buttonClassName}
          noAnimate={!canAnimate || !loadAndPlay}
          observeIntersection={observeIntersectionForCovers}
          noContextMenu
          isCurrentUserPremium
          sharedCanvasRef={
            withSharedCanvas
              ? isHq
                ? sharedCanvasHqRef
                : sharedCanvasRef
              : undefined
          }
          onClick={selectStickerSet}
          clickArg={index}
        />
      );
    }
  }

  const fullClassName = classNames(
    'StickerPicker CustomEmojiPicker',
    className
  );

  if (!shouldRenderContents) {
    return (
      <div className={fullClassName}>
        {noPopulatedSets ? (
          <div className='picker-disabled'>{t('NoStickers')}</div>
        ) : (
          <Loading />
        )}
      </div>
    );
  }

  return (
    <div className={fullClassName}>
      <div
        ref={headerRef}
        className='StickerPicker-header no-selection no-scrollbar'
      >
        <div className='shared-canvas-container'>
          <canvas ref={sharedCanvasRef} className='shared-canvas' />
          <canvas ref={sharedCanvasHqRef} className='shared-canvas' />
          {allSets.map(renderCover)}
        </div>
      </div>
      <div
        ref={containerRef}
        className={classNames(
          'StickerPicker-main no-selection',
          IS_TOUCH_ENV ? 'no-scrollbar' : 'custom-scroll'
        )}
      >
        {allSets.map((stickerSet, i) => (
          <StickerSet
            key={stickerSet.id}
            stickerSet={stickerSet}
            loadAndPlay={Boolean(canAnimate && loadAndPlay)}
            index={i}
            idPrefix={idPrefix}
            observeIntersection={observeIntersection}
            shouldRender={activeSetIndex >= i - 1 && activeSetIndex <= i + 1}
            isSavedMessages={isSavedMessages}
            isStatusPicker={isStatusPicker}
            shouldHideRecentHeader={withDefaultTopicIcons || isStatusPicker}
            withDefaultTopicIcon={
              withDefaultTopicIcons && stickerSet.id === RECENT_SYMBOL_SET_ID
            }
            withDefaultStatusIcon={
              isStatusPicker && stickerSet.id === RECENT_SYMBOL_SET_ID
            }
            isCurrentUserPremium={isCurrentUserPremium}
            onStickerSelect={handleEmojiSelect}
            onContextMenuOpen={onContextMenuOpen}
            onContextMenuClose={onContextMenuClose}
            onContextMenuClick={onContextMenuClick}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId, isStatusPicker }): StateProps => {
    const {
      stickers: { setsById: stickerSetsById },
      customEmojis: {
        byId: customEmojisById,
        featuredIds: customEmojiFeaturedIds,
        statusRecent: { emojis: recentStatusEmojis },
      },
      recentCustomEmojis: recentCustomEmojiIds,
    } = global;

    const isSavedMessages = Boolean(
      chatId && selectIsChatWithSelf(global, chatId)
    );

    return {
      customEmojisById: !isStatusPicker ? customEmojisById : undefined,
      recentCustomEmojiIds: !isStatusPicker ? recentCustomEmojiIds : undefined,
      recentStatusEmojis: isStatusPicker ? recentStatusEmojis : undefined,
      stickerSetsById,
      addedCustomEmojiIds: global.customEmojis.added.setIds,
      canAnimate: global.settings.byKey.shouldLoopStickers,
      isSavedMessages,
      isCurrentUserPremium: selectIsCurrentUserPremium(global),
      customEmojiFeaturedIds,
      defaultTopicIconsId: global.defaultTopicIconsId,
      defaultStatusIconsId: global.defaultStatusIconsId,
    };
  })(CustomEmojiPicker)
);
