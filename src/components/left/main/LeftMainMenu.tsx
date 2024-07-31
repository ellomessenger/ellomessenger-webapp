import React, { FC, memo, useMemo } from 'react';
import MenuItem from '../../ui/MenuItem';
import { useTranslation } from 'react-i18next';

import './LeftMainMenu.scss';
import IconSvg from '../../ui/IconSvg';
import { LeftColumnContent } from '../../../types';
import classNames from 'classnames';
import { withGlobal } from '../../../global';
import { selectTabState } from '../../../global/selectors';

type StateProps = {
  content: LeftColumnContent;
};

type OwnProps = {
  className?: string;
  onSelectSettings: () => void;
  onSelectChats: () => void;
  onSelectCalls: () => void;
  onSelectFeed: () => void;
  onSelectContacts: () => void;
};

const LeftMainMenu: FC<OwnProps & StateProps> = ({
  content,
  className,
  onSelectContacts,
  onSelectSettings,
  onSelectChats,
  onSelectCalls,
  onSelectFeed,
}) => {
  const { t } = useTranslation();

  const isChats = [
    LeftColumnContent.ChatList,
    LeftColumnContent.NewGroupStep1,
    LeftColumnContent.NewGroupStep2,
    LeftColumnContent.NewChannelSelect,
    LeftColumnContent.NewChannelStep1,
    LeftColumnContent.NewChannelStep2,
    LeftColumnContent.NewChannelTypeInfo,
    LeftColumnContent.NewCoursSelect,
    LeftColumnContent.NewCourseTypeInfo,
    LeftColumnContent.NewCourseStep1,
    LeftColumnContent.NewCourseStep2,
    LeftColumnContent.NewMediaSaleInfo,
    LeftColumnContent.GlobalSearch,
  ];
  const menuItems = useMemo(
    () => (
      <>
        {/* <MenuItem icon='saved-messages' onClick={handleSelectSaved}>
          {t('SavedMessages')}
        </MenuItem> */}
        {/* {archiveSettings.isHidden && (
          <MenuItem icon='archive' onClick={onSelectArchived}>
            <span className='menu-item-name'>{t('ArchivedChats')}</span>
            {archivedUnreadChatsCount > 0 && (
              <div className='right-badge'>{archivedUnreadChatsCount}</div>
            )}
          </MenuItem>
        )} */}
        {/* <MenuItem
          customIcon={<IconSvg name='calls' />}
          onClick={onSelectCalls}
          className={classNames({
            active: content === LeftColumnContent.Calls,
          })}
        >
          {t('Calls')}
        </MenuItem> */}
        <MenuItem
          customIcon={<IconSvg name='user-border' />}
          onClick={onSelectContacts}
          className={classNames({
            active: content === LeftColumnContent.Contacts,
          })}
        >
          {t(`Content.${LeftColumnContent.Contacts}`)}
        </MenuItem>

        <MenuItem
          customIcon={<IconSvg name='fly-outline' />}
          className={classNames({
            active: isChats.includes(content),
          })}
          onClick={onSelectChats}
        >
          {t(`Content.${LeftColumnContent.ChatList}`)}
        </MenuItem>

        <MenuItem
          customIcon={<IconSvg name='grid' />}
          className={classNames({
            active: content === LeftColumnContent.Feed,
          })}
          onClick={onSelectFeed}
        >
          {t('Feed.Title')}
        </MenuItem>
        <MenuItem
          customIcon={<IconSvg name='settings' />}
          onClick={onSelectSettings}
          className={classNames({
            active: content === LeftColumnContent.Settings,
          })}
        >
          {t('Profile')}
        </MenuItem>
        {/* <MenuItem icon='darkmode' onClick={handleDarkModeToggle}>
          <span className='menu-item-name'>{t('lng_menu_night_mode')}</span>
          <Switcher
            id='darkmode'
            label={t(
              theme === 'dark'
                ? 'lng_settings_disable_night_theme'
                : 'lng_settings_enable_night_theme'
            )}
            checked={theme === 'dark'}
            noAnimation
          />
        </MenuItem> */}
        {/* <MenuItem icon='animations' onClick={handleAnimationLevelChange}>
          <span className='menu-item-name capitalize'>
            {t('Appearance.Animations').toLowerCase()}
          </span>
          <Switcher
            id='animations'
            label='Toggle Animations'
            checked={animationLevel > 0}
          />
        </MenuItem> */}
        {/* <MenuItem icon='help' onClick={handleOpenTipsChat}>
          {t('TelegramFeatures')}
        </MenuItem> */}
        {/* <MenuItem icon='bug' onClick={handleBugReportClick}>
          Report Bug
        </MenuItem> */}
        {/* {IS_BETA && (
          <MenuItem icon='permissions' onClick={handleChangelogClick}>
            Beta Changelog
          </MenuItem>
        )} */}
        {/* {withOtherVersions && (
          <MenuItem
            icon='char-K'
            href={WEBK_VERSION_URL}
            onClick={handleSwitchToWebK}
          >
            Switch to K Version
          </MenuItem>
        )} */}
        {/* {canInstall && (
          <MenuItem icon='install' onClick={getPromptInstall()}>
            Install App
          </MenuItem>
        )} */}
      </>
    ),
    [onSelectSettings, content]
  );

  return (
    <div className={classNames('LeftMainMenu', className)}>{menuItems}</div>
  );
};

export default memo(
  withGlobal((global): StateProps => {
    const leftScreen = selectTabState(global).leftScreen;

    return {
      content: leftScreen,
    };
  })(LeftMainMenu)
);
