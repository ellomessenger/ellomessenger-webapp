import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import {
  LeftColumnContent,
  MiddleColumnContent,
  SettingsScreens,
} from '../../types';
import { ApiChat, ApiUser } from '../../api/types';
import { getActions, withGlobal } from '../../global';
import { useTranslation } from 'react-i18next';
import useAppLayout from '../../hooks/useAppLayout';
import Button from '../ui/Button';
import IconSvg from '../ui/IconSvg';
import ProfileInfo from '../common/ProfileInfo';
import ChatExtra from '../common/ChatExtra';
import ListItem from '../ui/ListItem';
import IconSvgSettings from '../middle/settings/icons/IconSvgSettings';
import PremiumIcon from '../common/PremiumIcon';
import {
  selectChat,
  selectIsPremiumPurchaseBlocked,
  selectTabState,
  selectUser,
} from '../../global/selectors';

import '../middle/settings/Settings.scss';
import classNames from 'classnames';
import ConfirmDialog from '../ui/ConfirmDialog';
import useLastCallback from '../../hooks/useLastCallback';
import { SUPPORT_USER_ID } from '../../config';

const WALLET_SCREENS = [
  SettingsScreens.Transfer,
  SettingsScreens.PayPal,
  SettingsScreens.Wallet,
  SettingsScreens.BankCard,
  SettingsScreens.BankRequisits,
  SettingsScreens.BanksRequisitsList,
  SettingsScreens.BankRequest,
  SettingsScreens.MyBalance,
  SettingsScreens.EarnStatistic,
];

type OwnProps = {
  isActive?: boolean;
  onScreenSelect: (screen: SettingsScreens) => void;
  onReset: () => void;
  shouldSkipTransition?: boolean;
  settingsScreen: SettingsScreens;
  setSupport: (val: SettingsScreens) => void;
};

type StateProps = {
  sessionCount?: number;
  currentUser?: ApiUser;
  lastSyncTime?: number;
  canBuyPremium?: boolean;
  subscriptionCount?: number;
  inviteCount?: number;
};

const SettingsMain: FC<OwnProps & StateProps> = ({
  isActive,
  onScreenSelect,
  onReset,
  currentUser,
  lastSyncTime,
  settingsScreen,
  subscriptionCount,
  inviteCount,
  setSupport,
}) => {
  const {
    signOut,
    loadProfilePhotos,
    loadAuthorizations,
    loadExportedChatInvites,
    getPaidSubscriptions,
    setMiddleScreen,
    openChat,
    openChatBot,
    toggleLeftColumn,
  } = getActions();

  const { t } = useTranslation();
  const profileId = currentUser?.id;

  const { isMobile } = useAppLayout();

  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);

  const openSignOutConfirmation = useCallback(() => {
    setIsSignOutDialogOpen(true);
  }, []);

  const closeSignOutConfirmation = useCallback(() => {
    setIsSignOutDialogOpen(false);
  }, []);

  const handleSignOutMessage = useCallback(() => {
    closeSignOutConfirmation();
    signOut({ forceInitApi: true });
  }, [closeSignOutConfirmation, signOut]);

  const handleClickItem = useCallback(
    (screen: SettingsScreens) => {
      onScreenSelect(screen);
      if (settingsScreen === SettingsScreens.Main) {
        setMiddleScreen({ screen: MiddleColumnContent.Settings });
      }
      //toggleLeftColumn();
    },
    [settingsScreen, setMiddleScreen]
  );

  const handleClickCloud = useLastCallback(() => {
    openChat({ id: currentUser?.id, shouldReplaceHistory: true });
  });

  const handleClickAi = useLastCallback(() => {
    handleClickItem(SettingsScreens.aiSpace);
  });

  const handleClickSupport = useLastCallback(() => {
    openChatBot({ id: SUPPORT_USER_ID });
  });

  useEffect(() => {
    if (profileId && lastSyncTime) {
      loadProfilePhotos({ profileId });
    }
  }, [lastSyncTime, profileId, loadProfilePhotos]);

  useEffect(() => {
    if (lastSyncTime && currentUser) {
      loadAuthorizations();
      getPaidSubscriptions();
      loadExportedChatInvites({ chatId: currentUser.id });
    }
  }, [lastSyncTime, currentUser, loadAuthorizations, getPaidSubscriptions]);

  return (
    <div className='settings-wrap'>
      <div className='left-header'>
        <div className='settings-main-header'>
          <h4>{t('Settings.Title')}</h4>
          <Button
            round
            ripple={!isMobile}
            color='translucent'
            onClick={() => handleClickItem(SettingsScreens.EditProfile)}
            ariaLabel={String(t('Settings.EditProfile'))}
          >
            <i className='icon-svg'>
              <IconSvg name='edit' />
            </i>
          </Button>
        </div>
      </div>
      <div className='settings-content custom-scroll'>
        <div className='settings-main-menu'>
          {currentUser && (
            <ProfileInfo
              userId={currentUser.id}
              canPlayVideo={Boolean(isActive)}
              forceShowSelf
            />
          )}
          {currentUser && (
            <ChatExtra
              chatOrUserId={currentUser.id}
              forceShowSelf
              onScreenSelect={handleClickItem}
            />
          )}
          {/* <div className='settings-item'>
            <ListItem
              leftElement={
                <div className='title-icon color-bg-1'>
                  <IconSvgSettings name='appearance' />
                </div>
              }
              onClick={() => handleClickItem(SettingsScreens.General)}
            >
              {t('Settings.GeneralSettings')}
            </ListItem>
          </div> */}
          {!currentUser?.isPublic && (
            <div className='settings-item'>
              <ListItem
                className={classNames({
                  active: [
                    SettingsScreens.InvitationLink,
                    SettingsScreens.CreateLink,
                  ].includes(settingsScreen),
                })}
                leftElement={
                  <div className='title-icon color-bg-9'>
                    <IconSvg name='user-plus' />
                  </div>
                }
                rightElement={
                  <span className='badge-counter'>{inviteCount}</span>
                }
                onClick={() => handleClickItem(SettingsScreens.InvitationLink)}
              >
                <div className='middle'>{t('Settings.InviteFriends')}</div>
              </ListItem>
            </div>
          )}
          <div className='settings-item'>
            <ListItem
              leftElement={
                <div className='title-icon color-bg-green'>
                  <IconSvgSettings name='three-users' />
                </div>
              }
              className={classNames({
                active: [SettingsScreens.LoyaltyProgram].includes(
                  settingsScreen
                ),
              })}
              onClick={() => handleClickItem(SettingsScreens.LoyaltyProgram)}
            >
              {t('Settings.ReferralProgram')}
            </ListItem>
          </div>
          <div className='settings-item'>
            <ListItem
              leftElement={
                <div className='title-icon'>
                  <IconSvgSettings name='ai-bot' />
                </div>
              }
              className={classNames({
                active: settingsScreen === SettingsScreens.aiSpace,
              })}
              onClick={handleClickAi}
            >
              {t('Settings.AiBot')}
            </ListItem>
            <ListItem
              leftElement={
                <div className='title-icon color-bg-3'>
                  <IconSvgSettings name='cloud' />
                </div>
              }
              className='color-bg-3'
              onClick={handleClickCloud}
            >
              {t('Settings.DataSettings')}
            </ListItem>
          </div>
          <div className='settings-item'>
            <ListItem
              className={classNames({
                active: WALLET_SCREENS.includes(settingsScreen),
              })}
              leftElement={
                <div className='title-icon color-bg-4'>
                  <IconSvgSettings name='wallet' />
                </div>
              }
              onClick={() => handleClickItem(SettingsScreens.Wallet)}
            >
              {t('Settings.ElloPay')}
            </ListItem>
            {/* <ListItem
              className={classNames({
                active: settingsScreen === SettingsScreens.Purchases,
              })}
              leftElement={
                <div className='title-icon color-bg-5'>
                  <IconSvgSettings name='shopping-cart' />
                </div>
              }
              onClick={() => handleClickItem(SettingsScreens.Purchases)}
            >
              {t('Settings.Purchases')}
            </ListItem> */}
            <ListItem
              className={classNames({
                active: settingsScreen === SettingsScreens.Subscriptions,
              })}
              leftElement={
                <div className='title-icon color-bg-1'>
                  <IconSvg name='users' />
                </div>
              }
              rightElement={
                <span className='badge-counter'>{subscriptionCount}</span>
              }
              onClick={() => handleClickItem(SettingsScreens.Subscriptions)}
            >
              <div className='middle'>{t('Settings.Subscriptions')}</div>
            </ListItem>
          </div>
          <div className='settings-item'>
            {currentUser?.isPublic && (
              <ListItem
                className={classNames({
                  active: [
                    SettingsScreens.InvitationLink,
                    SettingsScreens.CreateLink,
                  ].includes(settingsScreen),
                })}
                leftElement={
                  <div className='title-icon color-bg-9'>
                    <IconSvg name='user-plus' />
                  </div>
                }
                rightElement={
                  <span className='badge-counter'>{inviteCount}</span>
                }
                onClick={() => handleClickItem(SettingsScreens.InvitationLink)}
              >
                <div className='middle'>{t('Settings.Invite')}</div>
              </ListItem>
            )}

            <ListItem
              className={classNames({
                active: [
                  SettingsScreens.Privacy,
                  SettingsScreens.PrivacyBlockedUsers,
                  SettingsScreens.DeleteUserInfo,
                  SettingsScreens.BeforeDeletingUser,
                  SettingsScreens.ActiveSessions,
                ].includes(settingsScreen),
              })}
              leftElement={
                <div className='title-icon color-bg-6'>
                  <IconSvgSettings name='setting' />
                </div>
              }
              onClick={() => handleClickItem(SettingsScreens.Privacy)}
            >
              {t('Settings.Administration')}
            </ListItem>
            {/* <ListItem
              className={classNames({
                active: [
                  SettingsScreens.Privacy,
                  SettingsScreens.PrivacyBlockedUsers,
                  SettingsScreens.DeleteUserInfo,
                  SettingsScreens.BeforeDeletingUser,
                  SettingsScreens.ActiveSessions,
                ].includes(settingsScreen),
              })}
              leftElement={
                <div className='title-icon color-bg-6'>
                  <IconSvgSettings name='setting' />
                </div>
              }
              onClick={() => handleClickItem(SettingsScreens.Notifications)}
            >
              {t('Settings.Settings')}
            </ListItem> */}
          </div>

          <div className='settings-item'>
            <ListItem
              className={classNames({
                active: settingsScreen === SettingsScreens.Information,
              })}
              leftElement={
                <div className='title-icon color-bg-11'>
                  <IconSvg name='info-circle' />
                </div>
              }
              onClick={() => handleClickItem(SettingsScreens.Information)}
            >
              {t('Information.Title')}
            </ListItem>
            <ListItem
              leftElement={
                <div className='title-icon color-bg-10'>
                  <IconSvgSettings name='support' />
                </div>
              }
              onClick={handleClickSupport}
            >
              {t('Settings.Support')}
            </ListItem>
          </div>
          <Button
            fullWidth
            className='smaller'
            outline
            onClick={openSignOutConfirmation}
          >
            {t('Settings.Logout')}
          </Button>

          <ConfirmDialog
            isOpen={isSignOutDialogOpen}
            onClose={closeSignOutConfirmation}
            title={String(t('Settings.Logout'))}
            text={String(t('Settings.SureLogout'))}
            confirmLabel={String(t('Settings.Logout'))}
            confirmHandler={handleSignOutMessage}
            confirmIsDestructive
          />

          {/* <ListItem
            icon='folder'
            onClick={() => handleClickItem(SettingsScreens.Folders)}
          >
            {t('Filters')}
          </ListItem>
          <ListItem
            icon='active-sessions'
            onClick={() => handleClickItem(SettingsScreens.ActiveSessions)}
          >
            {t('SessionsTitle')}
            {sessionCount > 0 && (
              <span className='settings-item__current-value'>
                {sessionCount}
              </span>
            )}
          </ListItem>
          <ListItem
            icon='language'
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => handleClickItem(SettingsScreens.Language)}
          >
            {t('Language')}
            <span className='settings-item__current-value'>
              {i18n.language}
            </span>
          </ListItem>
          <ListItem
            icon='stickers'
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => handleClickItem(SettingsScreens.Stickers)}
          >
            {t('StickersName')}
          </ListItem>
          {canBuyPremium && (
            <ListItem
              leftElement={<PremiumIcon withGradient big />}
              className='settings-main-menu-premium'
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => openPremiumModal()}
            >
              {t('TelegramPremium')}
            </ListItem>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    const { currentUserId, lastSyncTime, subscriptionsList } = global;
    const { invites } =
      selectTabState(global).management.byChatId[currentUserId!] || {};

    return {
      sessionCount: global.activeSessions.orderedHashes.length,
      currentUser: currentUserId
        ? selectUser(global, currentUserId)
        : undefined,
      lastSyncTime,
      canBuyPremium: !selectIsPremiumPurchaseBlocked(global),
      subscriptionCount:
        subscriptionsList.filter((el) => el.is_active).length ?? 0,
      inviteCount: invites?.length,
    };
  })(SettingsMain)
);
