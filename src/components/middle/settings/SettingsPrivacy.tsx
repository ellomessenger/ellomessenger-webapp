import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { getActions, withGlobal } from '../../../global';

import {
  ApiPrivacyKey,
  ApiPrivacySettings,
  EVisibility,
  EVisibilityGroup,
} from '../../../types';
import { SettingsScreens } from '../../../types';

import {
  selectIsCurrentUserPremium,
  selectUser,
} from '../../../global/selectors';

import useHistoryBack from '../../../hooks/useHistoryBack';

import ListItem from '../../ui/ListItem';
import { useTranslation } from 'react-i18next';
import IconSvgSettings from './icons/IconSvgSettings';
import RadioGroup from '../../ui/RadioGroup';
import { LANGUAGES } from '../../../config';
import SelectDropdown from '../../ui/SelectDropdown';
import Button from '../../ui/Button';
import ChangeEmailModal from './ChangeEmailModal';
import ChangePasswordModal from './ChangePasswordModal';
import ConfirmDialog from '../../ui/ConfirmDialog';
import { ApiUserFullInfo } from '../../../api/types';
import useFlag from '../../../hooks/useFlag';
import useLastCallback from '../../../hooks/useLastCallback';

const options = LANGUAGES;

type OwnProps = {
  isActive?: boolean;
  onScreenSelect: (screen: SettingsScreens) => void;
  onReset: () => void;
};

type StateProps = {
  isCurrentUserPremium?: boolean;
  fullInfo?: ApiUserFullInfo;
  hasPassword?: boolean;
  hasPasscode?: boolean;
  isAuthRememberMe?: boolean;
  blockedCount: number;
  webAuthCount: number;
  isSensitiveEnabled?: boolean;
  canChangeSensitive?: boolean;
  canDisplayAutoarchiveSetting: boolean;
  shouldArchiveAndMuteNewNonContact?: boolean;
  canDisplayChatInTitle?: boolean;
  privacyPhoneNumber?: ApiPrivacySettings;
  privacyLastSeen?: ApiPrivacySettings;
  privacyProfilePhoto?: ApiPrivacySettings;
  privacyForwarding?: ApiPrivacySettings;
  privacyVoiceMessages?: ApiPrivacySettings;
  privacyGroupChats?: ApiPrivacySettings;
  privacyPhoneCall?: ApiPrivacySettings;
  privacyPhoneP2P?: ApiPrivacySettings;
};

const SettingsPrivacy: FC<OwnProps & StateProps> = ({
  isActive,
  blockedCount,
  privacyLastSeen,
  privacyProfilePhoto,
  privacyForwarding,
  privacyGroupChats,
  privacyPhoneCall,
  fullInfo,
  onScreenSelect,
  onReset,
}) => {
  const {
    loadPrivacySettings,
    loadBlockedContacts,
    loadAuthorizations,
    loadContentSettings,
    loadGlobalPrivacySettings,
    loadWebAuthorizations,
    setPrivacyVisibility,
  } = getActions();

  useEffect(() => {
    loadBlockedContacts();
    loadAuthorizations();
    loadPrivacySettings();
    loadContentSettings();
    loadWebAuthorizations();
  }, [
    loadBlockedContacts,
    loadAuthorizations,
    loadPrivacySettings,
    loadContentSettings,
    loadWebAuthorizations,
  ]);

  useEffect(() => {
    if (isActive) {
      loadGlobalPrivacySettings();
    }
  }, [isActive, loadGlobalPrivacySettings]);

  const { t, i18n, ready } = useTranslation('translation', {
    useSuspense: false,
  });
  const isRtl = i18n.dir(i18n.language) === 'rtl';
  const [isOpenChangeEmail, setIsOpenChangeEmail] = useState(false);
  const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);
  const [
    isOpenConfirmDeleteAccount,
    openConfirmDeleteAccount,
    closeConfirmDeleteAccount,
  ] = useFlag();
  // const [isOpenDeleteAccount, openDeleteAccount, closeOpenDeleteAccount] = useFlag();

  const handleConfirmDeleteAccount = useLastCallback(() => {
    closeConfirmDeleteAccount();
    onScreenSelect(SettingsScreens.DeleteUserInfo);
  });

  // const closeDeleteAccount = useCallback(() => {
  //   setIsOpenDeleteAccount(false);
  // }, []);

  const closeChangeEmailModal = useCallback(() => {
    setIsOpenChangeEmail(false);
  }, []);

  const openChangeEmailModal = useCallback(() => {
    setIsOpenChangeEmail(true);
  }, []);

  const closeChangePasswordModal = useCallback(() => {
    setIsOpenChangePassword(false);
  }, []);

  const openChangePasswordModal = useCallback(() => {
    setIsOpenChangePassword(true);
  }, []);

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  useHistoryBack({
    isActive,
    onBack: onReset,
  });

  const handleVisibilityChange = useCallback(
    (value: any, key: ApiPrivacyKey) => {
      setPrivacyVisibility({
        privacyKey: key!,
        visibility: value,
      });
    },
    [setPrivacyVisibility]
  );

  const handleChangeVisibilityLastSeen = useCallback((value: any) => {
    handleVisibilityChange(value, 'lastSeen');
  }, []);

  const handleChangeVisibilityChatInvite = useCallback((value: any) => {
    handleVisibilityChange(value, 'chatInvite');
  }, []);

  const handleChangeVisibilityPhoneCall = useCallback((value: any) => {
    handleVisibilityChange(value, 'phoneCall');
  }, []);

  const handleChangeVisibilityProfilePhoto = useCallback((value: any) => {
    handleVisibilityChange(value, 'profilePhoto');
  }, []);

  const handleChangeVisibilityForwards = useCallback((value: any) => {
    handleVisibilityChange(value, 'forwards');
  }, []);

  return (
    <div className='settings-container'>
      <div className='settings-privacy'>
        {/* <h3 className='settings-item-header' dir={isRtl ? 'rtl' : undefined}>
          {t('Settings.ChooseLanguages')}
        </h3>
        <div className='settings-item-middle'>
          {ready && (
            <RadioGroup
              name='language-settings'
              className='smaller'
              options={options}
              selected={i18n.language}
              onChange={changeLanguage}
            />
          )}
          <p
            className='settings-item-description'
            dir={isRtl ? 'rtl' : undefined}
          >
            {t('Settings.ChooseLanguagesDescription')}
          </p>
        </div> */}
        <h3 className='settings-item-header' dir={isRtl ? 'rtl' : undefined}>
          {t('Settings.BlockedUsers')}
        </h3>
        <div className='settings-item-middle'>
          <ListItem
            leftElement={
              <i className='icon-svg mr-4'>
                <IconSvgSettings name='circle-line' />
              </i>
            }
            onClick={() => onScreenSelect(SettingsScreens.PrivacyBlockedUsers)}
          >
            {t('Settings.BlockedUsers')}
            <span className='settings-item__current-value'>
              {blockedCount ? `${blockedCount} users` : 'None'}
              <i className='css-icon-right'></i>
            </span>
          </ListItem>
        </div>
        <h3 className='settings-item-header' dir={isRtl ? 'rtl' : undefined}>
          {t('Settings.Devices')}
        </h3>
        <div className='settings-item-middle'>
          <ListItem
            leftElement={
              <i className='icon-svg mr-4'>
                <IconSvgSettings name='device' />
              </i>
            }
            onClick={() => onScreenSelect(SettingsScreens.ActiveSessions)}
          >
            {t('Settings.Devices')}
          </ListItem>
        </div>
        <h3 className='settings-item-header' dir={isRtl ? 'rtl' : undefined}>
          {t('Settings.ChangePasswordEmail')}
        </h3>
        <div className='settings-item-middle'>
          <ListItem
            leftElement={
              <i className='icon-svg mr-4'>
                <IconSvgSettings name='sms' />
              </i>
            }
            onClick={openChangeEmailModal}
          >
            {t('Settings.ChangeEmail')}
          </ListItem>
          <ListItem
            leftElement={
              <i className='icon-svg mr-4'>
                <IconSvgSettings name='password-check' />
              </i>
            }
            onClick={openChangePasswordModal}
          >
            {t('Settings.ChangePassword')}
          </ListItem>
        </div>
        <h3 className='settings-item-header' dir={isRtl ? 'rtl' : undefined}>
          {t('Settings.PrivacyTitle')}
        </h3>
        <div className='settings-item-middle'>
          <div className='input-group'>
            <div className='col'>
              <h5>Who can see my last seen</h5>
              <SelectDropdown
                scrollId='settings_content'
                dataList={EVisibility}
                value={privacyLastSeen?.visibility}
                className='as-disabled'
                handleChange={handleChangeVisibilityLastSeen}
              />
              <p
                className='settings-item-description'
                dir={isRtl ? 'rtl' : undefined}
              >
                {t('Settings.VisibilitySeeDescription')}
              </p>
            </div>
            <div className='col'>
              <h5>Who can add me to group chats</h5>
              <SelectDropdown
                scrollId='settings_content'
                dataList={EVisibilityGroup}
                className='as-disabled'
                value={privacyGroupChats?.visibility}
                handleChange={handleChangeVisibilityChatInvite}
              />
              <p
                className='settings-item-description'
                dir={isRtl ? 'rtl' : undefined}
              >
                {t('Settings.VisibilityGroupDescription')}
              </p>
            </div>
          </div>
          <div className='input-group'>
            <div className='col'>
              <h5>Who can call me</h5>
              <SelectDropdown
                scrollId='settings_content'
                dataList={EVisibility}
                className='as-disabled'
                value={privacyPhoneCall?.visibility}
                handleChange={handleChangeVisibilityPhoneCall}
              />
              <p
                className='settings-item-description'
                dir={isRtl ? 'rtl' : undefined}
              >
                {t('Settings.VisibilityCallDescription')}
              </p>
            </div>
            <div className='col'>
              <h5>Who can see my profile photo</h5>
              <SelectDropdown
                scrollId='settings_content'
                dataList={EVisibilityGroup}
                className='as-disabled'
                value={privacyProfilePhoto?.visibility}
                handleChange={handleChangeVisibilityProfilePhoto}
              />
              <p
                className='settings-item-description'
                dir={isRtl ? 'rtl' : undefined}
              >
                {t('Settings.VisibilityProfilePhotoDescription')}
              </p>
            </div>
          </div>
          <div className='input-group'>
            <div className='col'>
              <h5>
                Who can add a link to my account when forwarding my messages
              </h5>
              <SelectDropdown
                scrollId='settings_content'
                dataList={EVisibility}
                className='as-disabled'
                value={privacyForwarding?.visibility}
                handleChange={handleChangeVisibilityForwards}
              />
              <p
                className='settings-item-description'
                dir={isRtl ? 'rtl' : undefined}
              >
                {t('Settings.VisibilityForwardsDescription')}
              </p>
            </div>
          </div>
        </div>
        <div className='form-submit'>
          <Button color='danger' onClick={openConfirmDeleteAccount}>
            {t('Settings.DeleteAccount')}
          </Button>
        </div>
        <ChangeEmailModal
          isOpen={isOpenChangeEmail}
          onClose={closeChangeEmailModal}
        />
        <ChangePasswordModal
          isOpen={isOpenChangePassword}
          email={fullInfo?.email!}
          onClose={closeChangePasswordModal}
        />
        <ConfirmDialog
          isOpen={isOpenConfirmDeleteAccount}
          onClose={closeConfirmDeleteAccount}
          title={String(t('Settings.DeleteAccount'))}
          text={String(t('Settings.DeleteAccountConfirmDescription'))}
          confirmLabel={String(t('Delete'))}
          confirmHandler={handleConfirmDeleteAccount}
          confirmIsDestructive
        />
      </div>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    const {
      settings: {
        byKey: {
          isSensitiveEnabled,
          canChangeSensitive,
          shouldArchiveAndMuteNewNonContact,
          canDisplayChatInTitle,
        },
        privacy,
      },
      blocked,
      appConfig,
      currentUserId,
    } = global;

    const currentUser = selectUser(global, currentUserId!);

    return {
      isCurrentUserPremium: selectIsCurrentUserPremium(global),
      fullInfo: currentUser?.fullInfo,
      blockedCount: blocked.totalCount,
      webAuthCount: global.activeWebSessions.orderedHashes.length,
      isSensitiveEnabled,
      canDisplayAutoarchiveSetting: Boolean(
        appConfig?.canDisplayAutoarchiveSetting
      ),
      shouldArchiveAndMuteNewNonContact,
      canChangeSensitive,
      privacyPhoneNumber: privacy.phoneNumber,
      privacyLastSeen: privacy.lastSeen,
      privacyProfilePhoto: privacy.profilePhoto,
      privacyForwarding: privacy.forwards,
      privacyVoiceMessages: privacy.voiceMessages,
      privacyGroupChats: privacy.chatInvite,
      privacyPhoneCall: privacy.phoneCall,
      privacyPhoneP2P: privacy.phoneP2P,
      canDisplayChatInTitle,
      isAuthRememberMe: global.authRememberMe,
    };
  })(SettingsPrivacy)
);
