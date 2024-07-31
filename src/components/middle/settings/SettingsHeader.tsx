import React, { FC, memo, useCallback, useMemo, useRef, useState } from 'react';
import { getActions } from '../../../global';
import { SettingsScreens } from '../../../types';
import useAppLayout from '../../../hooks/useAppLayout';
import DropdownMenu from '../../ui/DropdownMenu';
import MenuItem from '../../ui/MenuItem';
import Button from '../../ui/Button';
import { useTranslation } from 'react-i18next';
import IconSvg from '../../ui/IconSvg';
import IconSvgSettings from './icons/IconSvgSettings';
import useFlag from '../../../hooks/useFlag';
import SearchInput from '../../ui/SearchInput';
import classNames from 'classnames';
import { EPeerType, IWallet } from '../../../global/types';
import InfoPopUp from '../../ui/InfoPopUp';
import useLastCallback from '../../../hooks/useLastCallback';
import { MAIL_INFO } from '../../../config';

const WITH_ARROW = [
  SettingsScreens.Transfer,
  SettingsScreens.PayPal,
  SettingsScreens.BankCard,
  SettingsScreens.BankRequisits,
  SettingsScreens.BanksRequisitsList,
  SettingsScreens.CreateLink,
  SettingsScreens.PrivacyBlockedUsers,
  SettingsScreens.ActiveSessions,
  SettingsScreens.DeleteUserInfo,
  SettingsScreens.BeforeDeletingUser,
  SettingsScreens.BankRequest,
  SettingsScreens.MyBalance,
  SettingsScreens.FinancialActivity,
  SettingsScreens.EarnStatistic,
  SettingsScreens.WalletSettings,
  SettingsScreens.WalletCard,
];

type OwnProps = {
  currentScreen: SettingsScreens;
  editedFolderId?: number;
  onSaveFilter: () => void;
  onScreenSelect: (screen: SettingsScreens) => void;
  onReset: () => void;
  wallet: IWallet;
  transactionType: 'deposit' | 'withdrawal';
  peerType: EPeerType | undefined;
};

const SettingsHeader: FC<OwnProps> = ({
  currentScreen,
  editedFolderId,
  onSaveFilter,
  onScreenSelect,
  onReset,
  wallet,
  transactionType,
  peerType,
}) => {
  const { openDeleteChatFolderModal, toggleLeftColumn } = getActions();
  const componentRef = useRef<HTMLDivElement>(null);
  const { isMobile, isDesktop } = useAppLayout();
  const [isOpenInfoWallet, openInfoWallet, closeInfoWallet] = useFlag();

  const [searchValue, setSearhValue] = useState('');
  const [isSearchOpen, openSearch, closeSearch] = useFlag();

  // useHistoryBack({
  //   isActive: true,
  //   onBack: onReset,
  // });

  const toggleShowSearch = () => {
    if (isSearchOpen) {
      closeSearch();
    } else {
      openSearch();
      setTimeout(() => {
        const searchInput =
          document.querySelector<HTMLInputElement>('#PurchasesSearch');
        searchInput?.focus();
      }, 200);
    }
  };

  const openDeleteFolderConfirmation = useCallback(() => {
    if (!editedFolderId) return;

    openDeleteChatFolderModal({ folderId: editedFolderId });
  }, [editedFolderId, openDeleteChatFolderModal]);

  const SettingsMenuButton: FC<{ onTrigger: () => void; isOpen?: boolean }> =
    useMemo(() => {
      return ({ onTrigger, isOpen }) => (
        <Button
          round
          ripple={!isMobile}
          size='smaller'
          color='translucent'
          className={isOpen ? 'active' : ''}
          onClick={onTrigger}
          ariaLabel='More actions'
        >
          <i className='icon-more' />
        </Button>
      );
    }, [isMobile]);

  const SettingsWalletButton: FC<{ onTrigger: () => void; isOpen?: boolean }> =
    useMemo(() => {
      return ({ onTrigger, isOpen }) => (
        <Button
          round
          ripple={!isMobile}
          size='smaller'
          color='translucent'
          className={isOpen ? 'active' : ''}
          onClick={onTrigger}
          ariaLabel='More settings'
        >
          <i className='icon-svg'>
            <IconSvg name='settings' />
          </i>
        </Button>
      );
    }, [isMobile]);

  const { t } = useTranslation();

  const handleClickContact = useLastCallback(() => {
    window.open(`mailto:${MAIL_INFO}`, '_blank');
  });

  function renderHeaderContent() {
    switch (currentScreen) {
      case SettingsScreens.EditProfile:
        return <h4>{t('Settings.EditProfile')}</h4>;
      case SettingsScreens.General:
        return <h3>{t('General')}</h3>;
      case SettingsScreens.QuickReaction:
        return <h3>{t('DoubleTapSetting')}</h3>;
      case SettingsScreens.CustomEmoji:
        return <h3>{t('Emoji')}</h3>;
      case SettingsScreens.Notifications:
        return <h3>{t('Notifications')}</h3>;
      case SettingsScreens.DataStorage:
        return <h3>{t('DataSettings')}</h3>;
      case SettingsScreens.Privacy:
        return <h4>{t('Settings.Administration')}</h4>;
      case SettingsScreens.DoNotTranslate:
        return <h3>{t('DoNotTranslate')}</h3>;
      case SettingsScreens.Stickers:
        return <h3>{t('StickersName')}</h3>;
      case SettingsScreens.Experimental:
        return <h3>{t('lng_settings_experimental')}</h3>;

      case SettingsScreens.GeneralChatBackground:
        return <h3>{t('ChatBackground')}</h3>;
      case SettingsScreens.GeneralChatBackgroundColor:
        return <h3>{t('SetColor')}</h3>;
      case SettingsScreens.ActiveSessions:
        return <h4>{t('Settings.Devices')}</h4>;
      case SettingsScreens.ActiveWebsites:
        return <h3>{t('OtherWebSessions')}</h3>;
      case SettingsScreens.PrivacyBlockedUsers:
        return <h4>{t('Settings.BlockedUsers')}</h4>;

      case SettingsScreens.TwoFaDisabled:
      case SettingsScreens.TwoFaEnabled:
        return <h3>{t('TwoStepVerification')}</h3>;
      case SettingsScreens.TwoFaChangePasswordNew:
      case SettingsScreens.TwoFaChangePasswordConfirm:
        return <h3>{t('PleaseEnterCurrentPassword')}</h3>;
      case SettingsScreens.TwoFaNewPasswordConfirm:
        return <h3>{t('PleaseReEnterPassword')}</h3>;
      case SettingsScreens.TwoFaNewPasswordHint:
      case SettingsScreens.TwoFaChangePasswordHint:
        return <h3>{t('PasswordHint')}</h3>;
      case SettingsScreens.TwoFaNewPasswordEmail:
      case SettingsScreens.TwoFaRecoveryEmail:
        return <h3>{t('RecoveryEmailTitle')}</h3>;
      case SettingsScreens.TwoFaNewPasswordEmailCode:
      case SettingsScreens.TwoFaRecoveryEmailCode:
        return <h3>Recovery Email Code</h3>;
      case SettingsScreens.TwoFaCongratulations:
        return <h3>{t('TwoStepVerificationPasswordSet')}</h3>;
      case SettingsScreens.TwoFaChangePasswordCurrent:
      case SettingsScreens.TwoFaTurnOff:
      case SettingsScreens.TwoFaRecoveryEmailCurrentPassword:
        return <h3>{t('PleaseEnterCurrentPassword')}</h3>;
      case SettingsScreens.Folders:
        return <h3>{t('Filters')}</h3>;
      case SettingsScreens.FoldersCreateFolder:
        return <h3>{t('FilterNew')}</h3>;
      case SettingsScreens.FoldersEditFolder:
      case SettingsScreens.FoldersEditFolderFromChatList:
        return (
          <div className='settings-main-header'>
            <h3>{t('FilterEdit')}</h3>
            {Boolean(editedFolderId) && (
              <DropdownMenu
                className='settings-more-menu'
                trigger={SettingsMenuButton}
                positionX='right'
              >
                <MenuItem icon='delete' onClick={openDeleteFolderConfirmation}>
                  {t('Delete')}
                </MenuItem>
              </DropdownMenu>
            )}
          </div>
        );
      case SettingsScreens.FoldersIncludedChats:
      case SettingsScreens.FoldersIncludedChatsFromChatList:
      case SettingsScreens.FoldersExcludedChats:
      case SettingsScreens.FoldersExcludedChatsFromChatList:
        return (
          <div className='settings-main-header'>
            {currentScreen === SettingsScreens.FoldersIncludedChats ||
            currentScreen ===
              SettingsScreens.FoldersIncludedChatsFromChatList ? (
              <h3>{t('FilterInclude')}</h3>
            ) : (
              <h3>{t('FilterExclude')}</h3>
            )}

            <Button
              round
              size='smaller'
              color='translucent'
              className='color-primary'
              onClick={onSaveFilter}
              ariaLabel={String(t('AutoDeleteConfirm'))}
            >
              <i className='icon-check' />
            </Button>
          </div>
        );
      case SettingsScreens.Purchases:
        return (
          <>
            <div className='title-icon color-bg-5'>
              <IconSvgSettings name='shopping-cart' />
            </div>
            <h4>{t('Settings.Purchases')}</h4>
          </>
        );
      case SettingsScreens.Wallet:
        return (
          <>
            <div className='title-icon color-bg-4'>
              <IconSvgSettings name='wallet' />
            </div>
            <h4>{t('Settings.ElloPay')}</h4>
          </>
        );
      case SettingsScreens.Transfer:
        return (
          <h4>
            {t(
              `Wallet.${
                transactionType === 'deposit'
                  ? 'DepositMethods'
                  : 'WithdrawalMethods'
              }`
            )}
          </h4>
        );
      case SettingsScreens.PayPal:
      case SettingsScreens.BankCard:
      case SettingsScreens.BankRequisits:
      case SettingsScreens.BanksRequisitsList:
      case SettingsScreens.BankRequest:
      case SettingsScreens.MyBalance:
        return (
          <h4>
            {t(
              `Wallet.${
                transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'
              }`
            )}
          </h4>
        );
      case SettingsScreens.FinancialActivity:
        return <h4>{t('Wallet.FinancialActivity')}</h4>;
      case SettingsScreens.InfoCard:
        return (
          <>
            <div className='title-icon color-bg-4'>
              <IconSvgSettings name='wallet' />
            </div>
            <h4>{t('Settings.AboutWallet')}</h4>
          </>
        );
      case SettingsScreens.EarnStatistic:
        return (
          <h4>
            {t(
              peerType === EPeerType.ChannelsSubscription
                ? 'Wallet.PaidChannels'
                : peerType === EPeerType.CourseChannel
                ? 'Channel.OnlineCourse'
                : 'Channel.MediaSale'
            )}
          </h4>
        );
      case SettingsScreens.DetailsChannel:
        return (
          <>
            <div className='title-icon color-bg-4'>
              <IconSvgSettings name='wallet' />
            </div>
            <h4>{t('Settings.3DdigitalSculptings')}</h4>
          </>
        );
      case SettingsScreens.WalletSettings:
        return (
          <>
            <div className='title-icon color-bg-4'>
              <IconSvgSettings name='wallet' />
            </div>
            <h4>{t('Settings.WalletSettings')}</h4>
          </>
        );
      case SettingsScreens.WalletCard:
        return (
          <>
            <div className='title-icon color-bg-4'>
              <IconSvgSettings name='wallet' />
            </div>
            <h4>{t('Settings.Wallet')}</h4>
          </>
        );
      case SettingsScreens.Subscriptions:
        return (
          <>
            <div className='title-icon color-bg-1'>
              <IconSvg name='users' />
            </div>
            <h4>{t('Settings.CurrentSubscriptions')}</h4>
          </>
        );
      case SettingsScreens.InvitationLink:
        return <h4>{t('Link.Invitation')}</h4>;
      case SettingsScreens.CreateLink:
        return <h4>{t('Link.Create')}</h4>;
      case SettingsScreens.DeleteUserInfo:
        return <h4>{t('Settings.AccountDeletionInformationTitle')}</h4>;
      case SettingsScreens.BeforeDeletingUser:
        return <h4>{t('Settings.AccountInformation')}</h4>;
      case SettingsScreens.Information:
        return (
          <>
            <div className='title-icon color-bg-11'>
              <IconSvg name='info-circle' />
            </div>
            <h4>{t('Information.Title')}</h4>
          </>
        );
      case SettingsScreens.LoyaltyProgram:
        return <h4>{t('Settings.ReferralProgram')}</h4>;
      case SettingsScreens.aiSpace:
        return <h4>{t('Settings.AISpace')}</h4>;
      default:
        return (
          <>
            <h4>{t('Settings.Title')}</h4>
          </>
        );
    }
  }

  function renderRightHeaderContent() {
    switch (currentScreen) {
      case SettingsScreens.Purchases:
        return (
          <div className='right-header'>
            <Button
              className='close-button'
              round
              color='translucent'
              onClick={toggleShowSearch}
              ariaLabel={String(t('Close'))}
            >
              <div className='icon-svg'>
                <IconSvg name={isSearchOpen ? 'close' : 'search'} />
              </div>
            </Button>
            <div
              className={classNames('opacity-transition width-in shown', {
                open: isSearchOpen,
              })}
            >
              <SearchInput
                value={searchValue}
                inputId='PurchasesSearch'
                onChange={setSearhValue}
              />
            </div>
          </div>
        );

      case SettingsScreens.Wallet:
      case SettingsScreens.FinancialActivity:
        return (
          wallet && (
            <div className='right-header'>
              <Button
                round
                size='smaller'
                color='translucent'
                onClick={openInfoWallet}
                ariaLabel={String(t('Info wallet'))}
                className={classNames({ activated: isOpenInfoWallet })}
              >
                <IconSvg name='mark' />
              </Button>
              {/* <DropdownMenu trigger={SettingsWalletButton} positionX='right'>
                <MenuItem
                  customIcon={<IconSvg name='currency' />}
                  onClick={() => true}
                  page={SettingsScreens.WalletSettings}
                  onScreenSelect={onScreenSelect}
                >
                  Currency
                </MenuItem>
                <MenuItem
                  customIcon={<IconSvg name='saved-payment-options' />}
                  onClick={() => true}
                  page={SettingsScreens.WalletCard}
                  onScreenSelect={onScreenSelect}
                >
                  Saved payment options
                </MenuItem>
              </DropdownMenu> */}
              <InfoPopUp
                isOpen={isOpenInfoWallet}
                header={t(`Wallet.Title_${wallet.type}`)}
                text={t(`Wallet.Info_${wallet.type}`)}
                onClose={closeInfoWallet}
              />
            </div>
          )
        );
    }
  }

  function renderBackButton() {
    if (WITH_ARROW.includes(currentScreen)) {
      return (
        <Button
          round
          size='smaller'
          color='translucent'
          onClick={onReset}
          ariaLabel={String(t('GoBack'))}
        >
          <i className='icon-svg'>
            <IconSvg name='arrow-left' />
          </i>
        </Button>
      );
    } else if (!isDesktop) {
      return (
        <div className='back-button'>
          <Button
            round
            size='smaller'
            color='translucent'
            onClick={() => toggleLeftColumn()}
            ariaLabel={String(t('Back'))}
          >
            <IconSvg name={'arrow-left'} />
          </Button>
        </div>
      );
    }
  }

  function renderTabBar() {
    if (currentScreen === SettingsScreens.aiSpace) {
      return (
        <div className='tab-bar-wrapper'>
          <div role='button' className='tab-bar' onClick={handleClickContact}>
            Сontact us
          </div>
        </div>
      );
    }
  }

  return (
    <div className='MiddleHeader' ref={componentRef}>
      <div className='setting-info'>
        {renderBackButton()}

        {renderHeaderContent()}
      </div>
      {renderRightHeaderContent()}
    </div>
  );
};

export default memo(SettingsHeader);
