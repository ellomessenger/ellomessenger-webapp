import React, { FC, useCallback, memo, useState, useEffect } from 'react';
import { getActions, withGlobal } from '../../../global';
import RangeSlider from '../../ui/RangeSlider';
import 'react-toggle/style.css';
import type { AnimationLevel, ISettings, TimeFormat } from '../../../types';
import { SettingsScreens } from '../../../types';
import Toggle from 'react-toggle';

import {
  IS_ELECTRON,
  IS_IOS,
  IS_MAC_OS,
  IS_TOUCH_ENV,
  IS_WINDOWS,
} from '../../../util/windowEnvironment';
import { pick } from '../../../util/iteratees';
import { setTimeFormat } from '../../../util/langProvider';
import useHistoryBack from '../../../hooks/useHistoryBack';

import type { IRadioOption } from '../../ui/RadioGroup';
import switchTheme from '../../../util/switchTheme';
import { ANIMATION_LEVEL_MAX } from '../../../config';
import { useTranslation } from 'react-i18next';
import './SettingsGeneralBackground.scss';
import IconSvg from '../../ui/IconSvg';
import { getSystemTheme } from '../../../util/environmentSystemTheme';
import Checkbox from '../../ui/Checkbox';

type OwnProps = {
  isActive?: boolean;
  onScreenSelect: (screen: SettingsScreens) => void;
  onReset: () => void;
};

type StateProps = Pick<
  ISettings,
  'messageTextSize' | 'animationLevel' | 'messageSendKeyCombo' | 'timeFormat'
> & {
  theme: ISettings['theme'];
  shouldUseSystemTheme: boolean;
};

const ANIMATION_LEVEL_OPTIONS = [
  'Solid and Steady',
  'Nice and Fast',
  'Lots of Stuff',
];

const TIME_FORMAT_OPTIONS: IRadioOption[] = [
  {
    label: '12-hour',
    value: '12h',
  },
  {
    label: '24-hour',
    value: '24h',
  },
];

const SettingsGeneral: FC<OwnProps & StateProps> = ({
  isActive,
  onScreenSelect,
  onReset,
  messageTextSize,
  animationLevel,
  messageSendKeyCombo,
  timeFormat,
  theme,
  shouldUseSystemTheme,
}) => {
  const { setSettingOption } = getActions();
  const [tofuIsReady, settofuIsReady] = useState<boolean>(false);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';

  const APPEARANCE_THEME_OPTIONS: IRadioOption[] = [
    {
      label: t('EmptyChat.Appearance.Light'),
      value: 'light',
    },
    {
      label: t('EmptyChat.Appearance.Dark'),
      value: 'dark',
    },
    {
      label: t('EmptyChat.Appearance.System'),
      value: 'auto',
    },
  ];

  const KEYBOARD_SEND_OPTIONS = !IS_TOUCH_ENV
    ? [
        {
          value: 'enter',
          label: t('lng_settings_send_enter'),
          subLabel: 'New line by Shift + Enter',
        },
        {
          value: 'ctrl-enter',
          label: t(
            IS_MAC_OS
              ? 'lng_settings_send_cmdenter'
              : 'lng_settings_send_ctrlenter'
          ),
          subLabel: 'New line by Enter',
        },
      ]
    : undefined;

  const handleAnimationLevelChange = useCallback(
    (newLevel: number) => {
      ANIMATION_LEVEL_OPTIONS.forEach((_, i) => {
        document.body.classList.toggle(`animation-level-${i}`, newLevel === i);
      });

      setSettingOption({ animationLevel: newLevel as AnimationLevel });
    },
    [setSettingOption]
  );

  const handleMessageTextSizeChange = useCallback(
    (newSize: number) => {
      document.documentElement.style.setProperty(
        '--composer-text-size',
        `${Math.max(newSize, IS_IOS ? 16 : 15)}px`
      );
      document.documentElement.style.setProperty(
        '--message-meta-height',
        `${Math.floor(newSize * 1.3125)}px`
      );
      document.documentElement.style.setProperty(
        '--message-text-size',
        `${newSize}px`
      );
      document.documentElement.setAttribute(
        'data-message-text-size',
        newSize.toString()
      );

      setSettingOption({ messageTextSize: newSize });
    },
    [setSettingOption]
  );

  const handleAppearanceThemeChange = useCallback(
    (value: string) => {
      const newTheme =
        value === 'auto' ? getSystemTheme() : (value as ISettings['theme']);

      setSettingOption({ theme: newTheme });
      setSettingOption({ shouldUseSystemTheme: value === 'auto' });
      if (newTheme !== theme) {
        switchTheme(newTheme, animationLevel === ANIMATION_LEVEL_MAX);
      }
    },
    [animationLevel, setSettingOption, theme]
  );

  const handleTimeFormatChange = useCallback(
    (newTimeFormat: string) => {
      setSettingOption({ timeFormat: newTimeFormat as TimeFormat });
      setSettingOption({ wasTimeFormatSetManually: true });

      setTimeFormat(newTimeFormat as TimeFormat);
    },
    [setSettingOption]
  );

  const handleMessageSendComboChange = useCallback(
    (newCombo: string) => {
      setSettingOption({
        messageSendKeyCombo: newCombo as ISettings['messageSendKeyCombo'],
      });
    },
    [setSettingOption]
  );

  const [isTrayIconEnabled, setIsTrayIconEnabled] = useState(false);

  useEffect(() => {
    window.electron?.getIsTrayIconEnabled().then(setIsTrayIconEnabled);
  }, []);

  const handleIsTrayIconEnabledChange = useCallback((isChecked: boolean) => {
    window.electron?.setIsTrayIconEnabled(isChecked);
  }, []);

  useHistoryBack({
    isActive,
    onBack: onReset,
    page: 'Setting general',
  });

  const handleTofuChange = () => {
    settofuIsReady(!tofuIsReady);
  };

  return (
    <div className='settings-container'>
      <div className='appearance'>
        <div className='appearance__wrap'>
          <div className='appearance__text-size-wrap'>
            <div className='appearance__line' />
            <RangeSlider
              label='Message text size'
              min={0}
              max={10}
              value={3}
              onChange={() => {}}
            />
            {IS_ELECTRON && IS_WINDOWS && (
              <Checkbox
                label={t('GeneralSettings.StatusBarItem')}
                checked={Boolean(isTrayIconEnabled)}
                onCheck={handleIsTrayIconEnabledChange}
              />
            )}
          </div>
          <div className='appearance__settings-chat'>
            <div
              onClick={() => onScreenSelect(SettingsScreens.GeneralChatTheme)}
              className='appearance__chat'
            >
              <span className='label' dir='auto'>
                Chat Theme
              </span>
              <IconSvg name='arrow-big-right' w='20' h='19' />
            </div>
            <div
              onClick={() =>
                onScreenSelect(SettingsScreens.GeneralChatBackground)
              }
              className='appearance__chat'
            >
              <span className='label' dir='auto'>
                Chat Background
              </span>
              <IconSvg name='arrow-big-right' w='20' h='19' />
            </div>
            <div className='appearance__chat'>
              <span className='label' dir='auto'>
                Dark mode
              </span>
              <label>
                <Toggle
                  height={13}
                  width={30}
                  defaultChecked={tofuIsReady}
                  icons={false}
                  onChange={handleTofuChange}
                />
                {/* <span>No icons</span> */}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    const { theme, shouldUseSystemTheme } = global.settings.byKey;

    return {
      ...pick(global.settings.byKey, [
        'messageTextSize',
        'animationLevel',
        'messageSendKeyCombo',
        'isSensitiveEnabled',
        'canChangeSensitive',
        'timeFormat',
      ]),
      theme,
      shouldUseSystemTheme,
    };
  })(SettingsGeneral)
);
