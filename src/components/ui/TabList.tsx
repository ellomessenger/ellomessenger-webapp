import React, { FC, memo, useRef, useEffect } from 'react';

import { ALL_FOLDER_ID } from '../../config';
import { IS_ANDROID, IS_IOS } from '../../util/windowEnvironment';
import animateHorizontalScroll from '../../util/animateHorizontalScroll';

import usePrevious from '../../hooks/usePrevious';
import useHorizontalScroll from '../../hooks/useHorizontalScroll';

import Tab from './Tab';

import './TabList.scss';
import { useTranslation } from 'react-i18next';

export type TabWithProperties = {
  id?: number;
  title: string;
  badgeCount?: number;
  isBlocked?: boolean;
  isBadgeActive?: boolean;
};

type OwnProps = {
  tabs: readonly TabWithProperties[];
  areFolders?: boolean;
  activeTab: number;
  big?: boolean;
  onSwitchTab: (index: number) => void;
};

const TAB_SCROLL_THRESHOLD_PX = 16;
// Should match duration from `--slide-transition` CSS variable
const SCROLL_DURATION = IS_IOS ? 450 : IS_ANDROID ? 400 : 300;

const TabList: FC<OwnProps> = ({
  tabs,
  areFolders,
  activeTab,
  big,
  onSwitchTab,
}) => {
  // eslint-disable-next-line no-null/no-null
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveTab = usePrevious(activeTab);

  useHorizontalScroll(containerRef, undefined, true);

  // Scroll container to place active tab in the center
  useEffect(() => {
    const container = containerRef.current!;
    const { scrollWidth, offsetWidth, scrollLeft } = container;
    if (scrollWidth <= offsetWidth) {
      return;
    }

    const activeTabElement = container.childNodes[
      activeTab
    ] as HTMLElement | null;
    if (!activeTabElement) {
      return;
    }

    const {
      offsetLeft: activeTabOffsetLeft,
      offsetWidth: activeTabOffsetWidth,
    } = activeTabElement;
    const newLeft =
      activeTabOffsetLeft - offsetWidth / 2 + activeTabOffsetWidth / 2;

    // Prevent scrolling by only a couple of pixels, which doesn't look smooth
    if (Math.abs(newLeft - scrollLeft) < TAB_SCROLL_THRESHOLD_PX) {
      return;
    }

    animateHorizontalScroll(container, newLeft, SCROLL_DURATION);
  }, [activeTab]);

  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';

  return (
    <div
      className={`TabList no-selection no-scrollbar ${big ? 'big' : ''}`}
      ref={containerRef}
      dir={isRtl ? 'rtl' : undefined}
    >
      {tabs.map((tab, i) => (
        <Tab
          key={tab.id ?? tab.title}
          // TODO Remove dependency on usage context
          title={
            !areFolders || tab.id === ALL_FOLDER_ID ? t(tab.title) : tab.title
          }
          isActive={i === activeTab}
          isBlocked={tab.isBlocked}
          badgeCount={tab.badgeCount}
          isBadgeActive={tab.isBadgeActive}
          previousActiveTab={previousActiveTab}
          onClick={onSwitchTab}
          clickArg={i}
        />
      ))}
    </div>
  );
};

export default memo(TabList);
