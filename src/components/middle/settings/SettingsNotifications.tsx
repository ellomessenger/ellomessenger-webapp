import React, { FC, ChangeEvent, memo, useCallback, useEffect } from 'react';
import useRunDebounced from '../../../hooks/useRunDebounced';

import { getActions, withGlobal } from '../../../global';

import useHistoryBack from '../../../hooks/useHistoryBack';
import { playNotifySound } from '../../../util/notifications';

import Checkbox from '../../ui/Checkbox';
import RangeSlider from '../../ui/RangeSlider';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  isActive?: boolean;
  onReset: () => void;
};

type StateProps = {
  hasPrivateChatsNotifications: boolean;
  hasPrivateChatsMessagePreview: boolean;
  hasGroupNotifications: boolean;
  hasGroupMessagePreview: boolean;
  hasBroadcastNotifications: boolean;
  hasBroadcastMessagePreview: boolean;
  hasContactJoinedNotifications: boolean;
  hasWebNotifications: boolean;
  hasPushNotifications: boolean;
  notificationSoundVolume: number;
};

const SettingsNotifications: FC<OwnProps & StateProps> = ({
  isActive,
  onReset,
  hasPrivateChatsNotifications,
  hasPrivateChatsMessagePreview,
  hasGroupNotifications,
  hasGroupMessagePreview,
  hasBroadcastNotifications,
  hasBroadcastMessagePreview,
  hasContactJoinedNotifications,
  hasPushNotifications,
  hasWebNotifications,
  notificationSoundVolume,
}) => {
  const {
    loadNotificationSettings,
    updateContactSignUpNotification,
    updateNotificationSettings,
    updateWebNotificationSettings,
  } = getActions();

  useEffect(() => {
    loadNotificationSettings();
  }, [loadNotificationSettings]);

  const runDebounced = useRunDebounced(500, true);

  const handleSettingsChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement>,
      peerType: 'contact' | 'group' | 'broadcast',
      setting: 'silent' | 'showPreviews'
    ) => {
      const currentIsSilent =
        peerType === 'contact'
          ? !hasPrivateChatsNotifications
          : !(peerType === 'group'
              ? hasGroupNotifications
              : hasBroadcastNotifications);
      const currentShouldShowPreviews =
        peerType === 'contact'
          ? hasPrivateChatsMessagePreview
          : peerType === 'group'
          ? hasGroupMessagePreview
          : hasBroadcastMessagePreview;

      updateNotificationSettings({
        peerType,
        ...(setting === 'silent' && {
          isSilent: !e.target.checked,
          shouldShowPreviews: currentShouldShowPreviews,
        }),
        ...(setting === 'showPreviews' && {
          shouldShowPreviews: e.target.checked,
          isSilent: currentIsSilent,
        }),
      });
    },
    [
      hasBroadcastMessagePreview,
      hasBroadcastNotifications,
      hasGroupMessagePreview,
      hasGroupNotifications,
      hasPrivateChatsMessagePreview,
      hasPrivateChatsNotifications,
      updateNotificationSettings,
    ]
  );

  const handleWebNotificationsChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const isEnabled = e.target.checked;
      updateWebNotificationSettings({
        hasWebNotifications: isEnabled,
        ...(!isEnabled && { hasPushNotifications: false }),
      });
    },
    [updateWebNotificationSettings]
  );

  const handlePushNotificationsChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updateWebNotificationSettings({
        hasPushNotifications: e.target.checked,
      });
    },
    [updateWebNotificationSettings]
  );

  const handlePrivateChatsNotificationsChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleSettingsChange(e, 'contact', 'silent');
    },
    [handleSettingsChange]
  );

  const handlePrivateChatsPreviewChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleSettingsChange(e, 'contact', 'showPreviews');
    },
    [handleSettingsChange]
  );

  const handleGroupsNotificationsChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleSettingsChange(e, 'group', 'silent');
    },
    [handleSettingsChange]
  );

  const handleGroupsPreviewChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleSettingsChange(e, 'group', 'showPreviews');
    },
    [handleSettingsChange]
  );

  const handleChannelsNotificationsChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleSettingsChange(e, 'broadcast', 'silent');
    },
    [handleSettingsChange]
  );

  const handleChannelsPreviewChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleSettingsChange(e, 'broadcast', 'showPreviews');
    },
    [handleSettingsChange]
  );

  const handleContactNotificationChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updateContactSignUpNotification({
        isSilent: !e.target.checked,
      });
    },
    [updateContactSignUpNotification]
  );

  const handleVolumeChange = useCallback(
    (volume: number) => {
      updateWebNotificationSettings({
        notificationSoundVolume: volume,
      });
      runDebounced(() => playNotifySound(undefined, volume));
    },
    [runDebounced, updateWebNotificationSettings]
  );

  const { t } = useTranslation();

  useHistoryBack({
    isActive,
    onBack: onReset,
  });

  return (
    <div className='settings-content custom-scroll'>
      <div className='settings-item'>
        <h4 className='settings-item-header'>Web notifications</h4>
        <Checkbox
          label='Web notifications'
          // eslint-disable-next-line max-len
          subLabel={t(
            hasWebNotifications
              ? 'UserInfo.NotificationsEnabled'
              : 'UserInfo.NotificationsDisabled'
          )}
          checked={hasWebNotifications}
          onChange={handleWebNotificationsChange}
        />
        <Checkbox
          label='Offline notifications'
          disabled={!hasWebNotifications}
          subLabel={t(
            hasPushNotifications
              ? 'UserInfo.NotificationsEnabled'
              : 'UserInfo.NotificationsDisabled'
          )}
          checked={hasPushNotifications}
          onChange={handlePushNotificationsChange}
        />
        <div className='settings-item-slider'>
          <RangeSlider
            label='Sound'
            min={0}
            max={10}
            value={notificationSoundVolume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>
      <div className='settings-item'>
        <h4 className='settings-item-header'>
          {t('AutodownloadPrivateChats')}
        </h4>

        <Checkbox
          label={t('NotificationsForPrivateChats')}
          subLabel={t(
            hasPrivateChatsNotifications
              ? 'UserInfo.NotificationsEnabled'
              : 'UserInfo.NotificationsDisabled'
          )}
          checked={hasPrivateChatsNotifications}
          onChange={handlePrivateChatsNotificationsChange}
        />
        <Checkbox
          label={t('MessagePreview')}
          disabled={!hasPrivateChatsNotifications}
          subLabel={t(
            hasPrivateChatsMessagePreview
              ? 'UserInfo.NotificationsEnabled'
              : 'UserInfo.NotificationsDisabled'
          )}
          checked={hasPrivateChatsMessagePreview}
          onChange={handlePrivateChatsPreviewChange}
        />
      </div>

      <div className='settings-item'>
        <h4 className='settings-item-header'>{t('FilterGroups')}</h4>

        <Checkbox
          label={t('NotificationsForGroups')}
          subLabel={t(
            hasGroupNotifications
              ? 'UserInfo.NotificationsEnabled'
              : 'UserInfo.NotificationsDisabled'
          )}
          checked={hasGroupNotifications}
          onChange={handleGroupsNotificationsChange}
        />
        <Checkbox
          label={t('MessagePreview')}
          disabled={!hasGroupNotifications}
          subLabel={t(
            hasGroupMessagePreview
              ? 'UserInfo.NotificationsEnabled'
              : 'UserInfo.NotificationsDisabled'
          )}
          checked={hasGroupMessagePreview}
          onChange={handleGroupsPreviewChange}
        />
      </div>

      <div className='settings-item'>
        <h4 className='settings-item-header'>{t('FilterChannels')}</h4>

        <Checkbox
          label={t('NotificationsForChannels')}
          subLabel={t(
            hasBroadcastNotifications
              ? 'UserInfo.NotificationsEnabled'
              : 'UserInfo.NotificationsDisabled'
          )}
          checked={hasBroadcastNotifications}
          onChange={handleChannelsNotificationsChange}
        />
        <Checkbox
          label={t('MessagePreview')}
          disabled={!hasBroadcastNotifications}
          subLabel={t(
            hasBroadcastMessagePreview
              ? 'UserInfo.NotificationsEnabled'
              : 'UserInfo.NotificationsDisabled'
          )}
          checked={hasBroadcastMessagePreview}
          onChange={handleChannelsPreviewChange}
        />
      </div>

      <div className='settings-item'>
        <h4 className='settings-item-header'>{t('PhoneOther')}</h4>

        <Checkbox
          label={t('ContactJoined')}
          checked={hasContactJoinedNotifications}
          onChange={handleContactNotificationChange}
        />
      </div>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    return {
      hasPrivateChatsNotifications: Boolean(
        global.settings.byKey.hasPrivateChatsNotifications
      ),
      hasPrivateChatsMessagePreview: Boolean(
        global.settings.byKey.hasPrivateChatsMessagePreview
      ),
      hasGroupNotifications: Boolean(
        global.settings.byKey.hasGroupNotifications
      ),
      hasGroupMessagePreview: Boolean(
        global.settings.byKey.hasGroupMessagePreview
      ),
      hasBroadcastNotifications: Boolean(
        global.settings.byKey.hasBroadcastNotifications
      ),
      hasBroadcastMessagePreview: Boolean(
        global.settings.byKey.hasBroadcastMessagePreview
      ),
      hasContactJoinedNotifications: Boolean(
        global.settings.byKey.hasContactJoinedNotifications
      ),
      hasWebNotifications: global.settings.byKey.hasWebNotifications,
      hasPushNotifications: global.settings.byKey.hasPushNotifications,
      notificationSoundVolume: global.settings.byKey.notificationSoundVolume,
    };
  })(SettingsNotifications)
);
