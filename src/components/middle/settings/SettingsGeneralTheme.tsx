import type { FC } from 'react';
import React, { memo, useEffect, useCallback, useRef, useState } from 'react';
import { getActions, withGlobal } from '../../../global';

import type { ThemeKey } from '../../../types';
import { SettingsScreens, UPLOADING_WALLPAPER_SLUG } from '../../../types';
import type { ApiWallpaper } from '../../../api/types';

import {
  DARK_THEME_PATTERN_COLOR,
  DEFAULT_PATTERN_COLOR,
} from '../../../config';
import { throttle } from '../../../util/schedulers';
import { validateFiles } from '../../../util/files';
import { openSystemFilesDialog } from '../../../util/systemFilesDialog';
import {
  getAverageColor,
  getPatternColor,
  rgb2hex,
} from '../../../util/colors';
import { selectTheme } from '../../../global/selectors';
import useLang from '../../../hooks/useLang';
import useHistoryBack from '../../../hooks/useHistoryBack';

import ListItem from '../../ui/ListItem';
import Checkbox from '../../ui/Checkbox';
import Loading from '../../ui/Loading';
import WallpaperTile from './WallpaperTile';

import './SettingsGeneralBackground.scss';
import TabList from '../../ui/TabList';
import { useTranslation } from 'react-i18next';
import IconSvg from '../../ui/IconSvg';
import ThemeList from './ThemeList';
import { themList } from '../../../util/theme';

type OwnProps = {
  isActive?: boolean;
  onScreenSelect: (screen: SettingsScreens) => void;
  onReset: () => void;
};

type StateProps = {
  background?: string;
  isBlurred?: boolean;
  loadedWallpapers?: ApiWallpaper[];
  theme: ThemeKey;
};

const SUPPORTED_TYPES = 'image/jpeg';

const runThrottled = throttle((cb) => cb(), 60000, true);

const SettingsGeneralTheme: FC<OwnProps & StateProps> = ({
  isActive,
  onScreenSelect,
  onReset,
  background,
  isBlurred,
  loadedWallpapers,
  theme,
}) => {
  const { loadWallpapers, uploadWallpaper, setThemeSettings } = getActions();
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useTranslation();

  const handleWallPaperSelect = useCallback(
    (slug: string) => {}, [loadedWallpapers, setThemeSettings]
  );

  useHistoryBack({
    isActive,
    onBack: onReset,
  });
  
  const TABS = [
    { title: t('Attach.All') },
    { title: t('Attach.paid') },
    { title: t('Attach.free') },
    { title: t('Attach.Purchased') },
  ];

  const handleSwitchTab = useCallback((index: number) => {
    setActiveTab(index);
  }, []);

  return (
    <div className='SettingsGeneralBackground container-background settings-content custom-scroll'>
      <div className="background-wrap">
        <TabList
          tabs={TABS}
          activeTab={activeTab}
          onSwitchTab={handleSwitchTab}
          areFolders
        />
      </div>
      <div className="select-background-inner">
        <div className="select-background">Select a theme</div>
        <div className='select-background-inner pointer'>
          <div className="select-background-text">All</div>
          <IconSvg name='arrow-down-blue' />
        </div>
      </div>

      {themList ? (
        <div className='chat-theme-wrap'>
          {themList.map((theme, index) => (
            <ThemeList
              key={index}
              theme={theme}
              onClick={() => {}}
              isSelected
            />
          ))}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    const theme = selectTheme(global);
    const { background, isBlurred } = global.settings.themes[theme] || {};
    const { loadedWallpapers } = global.settings;

    return {
      background,
      isBlurred,
      loadedWallpapers,
      theme,
    };
  })(SettingsGeneralTheme)
);
