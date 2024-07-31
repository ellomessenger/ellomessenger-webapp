import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { SettingsScreens } from '../../../types';
import type {
  FolderEditDispatch,
  FoldersState,
} from '../../../hooks/reducers/useFoldersReducer';
import useTwoFaReducer from '../../../hooks/reducers/useTwoFaReducer';
import Transition from '../../ui/Transition';
import SettingsHeader from './SettingsHeader';
import SettingsEditProfile from './SettingsEditProfile';
import SettingsDataStorage from './SettingsDataStorage';
import SettingsFolders from './folders/SettingsFolders';
import SettingsGeneral from './SettingsGeneral';
import SettingsGeneralBackground from './SettingsGeneralBackground';
import SettingsGeneralBackgroundColor from './SettingsGeneralBackgroundColor';
import SettingsNotifications from './SettingsNotifications';
import SettingsPrivacy from './SettingsPrivacy';
import SettingsActiveSessions from './SettingsActiveSessions';
import SettingsActiveWebsites from './SettingsActiveWebsites';
import SettingsPrivacyBlockedUsers from './SettingsPrivacyBlockedUsers';
import SettingsTwoFa from './twoFa/SettingsTwoFa';
import SettingsQuickReaction from './SettingsQuickReaction';
import SettingsStickers from './SettingsStickers';
import SettingsCustomEmoji from './SettingsCustomEmoji';
import SettingsDoNotTranslate from './SettingsDoNotTranslate';
import SettingsExperimental from './SettingsExperimental';
import SettingsPurchases from './SettingsPurchases';
import WalletMainPage from './wallet/WalletMainPage';
import SettingsSubscriptions from './SettingsSubscriptions';
import SettingsInvitationLink from './SettingsInvitationLink';
import WalletCard from './wallet/WalletCard/WalletCard';
import WalletSettings from './wallet/WalletSettings/WalletSettings';
import DetailsChannel from './wallet/DetailsChannel/DetailsChannel';
import PayPalForm from './wallet/PayPalForm/PayPalForm';
import SettingsGeneralTheme from './SettingsGeneralTheme';
import { EPeerType, IPayment, IWallet } from '../../../global/types';
import SettingsDeleteUserInfo from './SettingsDeleteUserInfo';
import SettingsBeforeDeletingAccount from './SettingsBeforeDeletingAccount';
import MainInformation from './information/MainInformation';
import BankForm from './wallet/BankForm/BankForm';
import usePrevious from '../../../hooks/usePrevious';
import BankRequisits from './wallet/BankForm/BankRequisits';
import BankRequestFor from './wallet/BankForm/BankRequestFor';
import BankTransferList from './wallet/BankForm/BankTransferList';
import MyBalanceWithdrawal from './wallet/MyBalance/MyBalanceWithdrawal';
import Transfer from './wallet/Transfer/Transfer';
import FinancialActivity from './wallet/FinancialActivity';
import EarningStatistic from './wallet/Earning/EarningStatistic';
import LoyaltyProgram from './loyalty/LoyaltyProgram';

import './Settings.scss';
import { getActions } from '../../../global';
import AiSpaceMain from './aiSpace/AiSpaceMain';
import classNames from 'classnames';

const TRANSITION_RENDER_COUNT = Object.keys(SettingsScreens).length / 2;
const TRANSITION_DURATION = 200;

const TWO_FA_SCREENS = [
  SettingsScreens.TwoFaNewPasswordConfirm,
  SettingsScreens.TwoFaNewPasswordHint,
  SettingsScreens.TwoFaNewPasswordEmail,
  SettingsScreens.TwoFaNewPasswordEmailCode,
  SettingsScreens.TwoFaCongratulations,
  SettingsScreens.TwoFaChangePasswordCurrent,
  SettingsScreens.TwoFaChangePasswordNew,
  SettingsScreens.TwoFaChangePasswordConfirm,
  SettingsScreens.TwoFaChangePasswordHint,
  SettingsScreens.TwoFaTurnOff,
  SettingsScreens.TwoFaRecoveryEmailCurrentPassword,
  SettingsScreens.TwoFaRecoveryEmail,
  SettingsScreens.TwoFaRecoveryEmailCode,
];

const FOLDERS_SCREENS = [
  SettingsScreens.Folders,
  SettingsScreens.FoldersCreateFolder,
  SettingsScreens.FoldersEditFolder,
  SettingsScreens.FoldersEditFolderFromChatList,
  SettingsScreens.FoldersIncludedChats,
  SettingsScreens.FoldersIncludedChatsFromChatList,
  SettingsScreens.FoldersExcludedChats,
  SettingsScreens.FoldersExcludedChatsFromChatList,
];

const PRIVACY_SCREENS = [
  SettingsScreens.PrivacyBlockedUsers,
  SettingsScreens.ActiveWebsites,
];

export type OwnProps = {
  isActive: boolean;
  currentScreen: SettingsScreens;
  foldersState: FoldersState;
  payment: IPayment | undefined;
  foldersDispatch: FolderEditDispatch;
  onScreenSelect: (screen: SettingsScreens) => void;
  shouldSkipTransition?: boolean;
  onSelectChatMenu: () => void;
};

const Settings: FC<OwnProps> = ({
  isActive,
  currentScreen,
  foldersState,
  payment,
  foldersDispatch,
  onScreenSelect,
  shouldSkipTransition,
  onSelectChatMenu,
}) => {
  const { getWallets, setLeftScreen, setMiddleScreen } = getActions();
  const containerRef = useRef<HTMLDivElement>(null);
  const [twoFaState, twoFaDispatch] = useTwoFaReducer();
  const [wallet, setWallet] = useState<IWallet | undefined>();
  const [transactionType, setTransactionType] = useState<
    'deposit' | 'withdrawal'
  >('deposit');
  const [peerType, setPeerType] = useState<EPeerType>();

  const prevScreen = usePrevious(currentScreen);

  const { leftScreen, middleScreen } = window.history.state || {};

  const handleReset = useCallback(() => {
    if (
      currentScreen === SettingsScreens.FoldersCreateFolder ||
      currentScreen === SettingsScreens.FoldersEditFolder ||
      currentScreen === SettingsScreens.FoldersEditFolderFromChatList
    ) {
      setTimeout(() => {
        foldersDispatch({ type: 'reset' });
      }, TRANSITION_DURATION);
    }

    if (
      currentScreen === SettingsScreens.FoldersIncludedChats ||
      currentScreen === SettingsScreens.FoldersExcludedChats
    ) {
      if (foldersState.mode === 'create') {
        onScreenSelect(SettingsScreens.FoldersCreateFolder);
      } else {
        onScreenSelect(SettingsScreens.FoldersEditFolder);
      }
      return;
    }

    switch (currentScreen) {
      case SettingsScreens.PrivacyBlockedUsers:
      case SettingsScreens.ActiveSessions:
        onScreenSelect(SettingsScreens.Privacy);
        return;
      case SettingsScreens.CreateLink:
        onScreenSelect(SettingsScreens.InvitationLink);
        return;
      case SettingsScreens.Transfer:
      case SettingsScreens.FinancialActivity:
      case SettingsScreens.EarnStatistic:
      case SettingsScreens.WalletSettings:
      case SettingsScreens.WalletCard:
        onScreenSelect(SettingsScreens.Wallet);
        return;
      case SettingsScreens.PayPal:
      case SettingsScreens.BankCard:
      case SettingsScreens.MyBalance:
        onScreenSelect(SettingsScreens.Transfer);
        return;
      case SettingsScreens.DeleteUserInfo:
        onScreenSelect(SettingsScreens.Privacy);
        break;
      case SettingsScreens.BeforeDeletingUser:
        onScreenSelect(SettingsScreens.DeleteUserInfo);
        break;
      case SettingsScreens.BanksRequisitsList:
        onScreenSelect(SettingsScreens.BankCard);
        break;
      case SettingsScreens.BankRequisits:
        onScreenSelect(SettingsScreens.BanksRequisitsList);
        break;
      case SettingsScreens.BankRequest:
        if (prevScreen === SettingsScreens.BankRequisits) {
          onScreenSelect(SettingsScreens.BankRequisits);
        } else if (prevScreen === SettingsScreens.BanksRequisitsList) {
          onScreenSelect(SettingsScreens.BanksRequisitsList);
        }
        break;
      case SettingsScreens.LoyaltyProgram:
      case SettingsScreens.Wallet:
      case SettingsScreens.aiSpace:
        setLeftScreen({ screen: leftScreen });
        setMiddleScreen({ screen: middleScreen });
        break;

      default:
        break;
    }

    //onReset();
  }, [
    foldersState.mode,
    foldersDispatch,
    currentScreen,
    //onReset,
    onScreenSelect,
  ]);

  const handleSaveFilter = useCallback(() => {
    foldersDispatch({ type: 'saveFilters' });
    handleReset();
  }, [foldersDispatch, handleReset]);

  function renderCurrentSectionContent(
    isScreenActive: boolean,
    currentKey: SettingsScreens
  ) {
    const isTwoFaScreen = TWO_FA_SCREENS.includes(currentKey);
    const isFoldersScreen = FOLDERS_SCREENS.includes(currentKey);
    const isPrivacyScreen =
      PRIVACY_SCREENS.includes(currentKey) || isTwoFaScreen;

    switch (currentScreen) {
      case SettingsScreens.Main:
        return null;
      case SettingsScreens.EditProfile:
        return (
          <SettingsEditProfile
            isActive={isActive && isScreenActive}
            onReset={handleReset}
          />
        );
      case SettingsScreens.General:
        return (
          <SettingsGeneral
            onScreenSelect={onScreenSelect}
            isActive={
              isScreenActive ||
              currentKey === SettingsScreens.GeneralChatBackgroundColor ||
              currentKey === SettingsScreens.GeneralChatBackground ||
              currentKey === SettingsScreens.QuickReaction ||
              currentKey === SettingsScreens.CustomEmoji ||
              isFoldersScreen
            }
            onReset={handleReset}
          />
        );
      case SettingsScreens.QuickReaction:
        return (
          <SettingsQuickReaction
            isActive={isScreenActive}
            onReset={handleReset}
          />
        );
      case SettingsScreens.CustomEmoji:
        return (
          <SettingsCustomEmoji
            isActive={isScreenActive}
            onReset={handleReset}
          />
        );
      case SettingsScreens.Notifications:
        return (
          <SettingsNotifications
            isActive={isScreenActive}
            onReset={handleReset}
          />
        );
      case SettingsScreens.DataStorage:
        return (
          <SettingsDataStorage
            isActive={isScreenActive}
            onReset={handleReset}
          />
        );
      case SettingsScreens.Privacy:
        return (
          <SettingsPrivacy
            onScreenSelect={onScreenSelect}
            isActive={isScreenActive || isPrivacyScreen}
            onReset={handleReset}
          />
        );

      case SettingsScreens.DoNotTranslate:
        return (
          <SettingsDoNotTranslate
            isActive={isScreenActive}
            onReset={handleReset}
          />
        );
      case SettingsScreens.Stickers:
        return (
          <SettingsStickers
            isActive={isScreenActive}
            onReset={handleReset}
            onScreenSelect={onScreenSelect}
          />
        );
      case SettingsScreens.Experimental:
        return (
          <SettingsExperimental
            isActive={isScreenActive}
            onReset={handleReset}
          />
        );
      case SettingsScreens.GeneralChatBackground:
        return (
          <SettingsGeneralBackground
            onScreenSelect={onScreenSelect}
            isActive={
              isScreenActive ||
              currentKey === SettingsScreens.GeneralChatBackgroundColor
            }
            onReset={handleReset}
          />
        );
      case SettingsScreens.GeneralChatTheme:
        return (
          <SettingsGeneralTheme
            onScreenSelect={onScreenSelect}
            isActive={
              isScreenActive ||
              currentKey === SettingsScreens.GeneralChatBackgroundColor
            }
            onReset={handleReset}
          />
        );
      case SettingsScreens.GeneralChatBackgroundColor:
        return (
          <SettingsGeneralBackgroundColor
            isActive={isScreenActive}
            onReset={handleReset}
          />
        );
      case SettingsScreens.ActiveSessions:
        return (
          <SettingsActiveSessions
            isActive={isScreenActive}
            onReset={handleReset}
          />
        );
      case SettingsScreens.ActiveWebsites:
        return (
          <SettingsActiveWebsites
            isActive={isScreenActive}
            onReset={handleReset}
          />
        );
      case SettingsScreens.PrivacyBlockedUsers:
        return (
          <SettingsPrivacyBlockedUsers
            isActive={isScreenActive}
            onReset={handleReset}
          />
        );
      case SettingsScreens.Folders:
      case SettingsScreens.FoldersCreateFolder:
      case SettingsScreens.FoldersEditFolder:
      case SettingsScreens.FoldersEditFolderFromChatList:
      case SettingsScreens.FoldersIncludedChats:
      case SettingsScreens.FoldersIncludedChatsFromChatList:
      case SettingsScreens.FoldersExcludedChats:
      case SettingsScreens.FoldersExcludedChatsFromChatList:
        return (
          <SettingsFolders
            currentScreen={currentScreen}
            shownScreen={currentKey}
            state={foldersState}
            dispatch={foldersDispatch}
            isActive={isScreenActive}
            onScreenSelect={onScreenSelect}
            onReset={handleReset}
          />
        );

      case SettingsScreens.TwoFaNewPasswordConfirm:
      case SettingsScreens.TwoFaNewPasswordHint:
      case SettingsScreens.TwoFaNewPasswordEmail:
      case SettingsScreens.TwoFaNewPasswordEmailCode:
      case SettingsScreens.TwoFaCongratulations:
      case SettingsScreens.TwoFaChangePasswordCurrent:
      case SettingsScreens.TwoFaChangePasswordNew:
      case SettingsScreens.TwoFaChangePasswordConfirm:
      case SettingsScreens.TwoFaChangePasswordHint:
      case SettingsScreens.TwoFaTurnOff:
      case SettingsScreens.TwoFaRecoveryEmailCurrentPassword:
      case SettingsScreens.TwoFaRecoveryEmail:
      case SettingsScreens.TwoFaRecoveryEmailCode:
        return (
          <SettingsTwoFa
            currentScreen={currentScreen}
            state={twoFaState}
            dispatch={twoFaDispatch}
            shownScreen={currentKey}
            isActive={isScreenActive}
            onScreenSelect={onScreenSelect}
            onReset={handleReset}
          />
        );

      case SettingsScreens.Purchases:
        return <SettingsPurchases />;
      case SettingsScreens.Wallet:
        return (
          <WalletMainPage
            onScreenSelect={onScreenSelect}
            onChangeCard={setWallet}
            transactionType={transactionType}
            onTransactionType={setTransactionType}
            wallet={wallet}
            setPeerType={setPeerType}
            isActive={isScreenActive}
            onReset={handleReset}
          />
        );

      case SettingsScreens.BanksRequisitsList:
        return <BankTransferList hide={true} onScreenSelect={onScreenSelect} />;
      case SettingsScreens.BankRequisits:
        return <BankRequisits onScreenSelect={onScreenSelect} />;
      case SettingsScreens.BankRequest:
        return (
          <BankRequestFor wallet={wallet} onScreenSelect={onScreenSelect} />
        );
      case SettingsScreens.MyBalance:
        return (
          <MyBalanceWithdrawal
            wallet={wallet!}
            onScreenSelect={onScreenSelect}
          />
        );
      case SettingsScreens.FinancialActivity:
        return (
          <FinancialActivity wallet={wallet!} onScreenSelect={onScreenSelect} />
        );
      case SettingsScreens.PayPal:
        return (
          <PayPalForm
            wallet={wallet!}
            onScreenSelect={onScreenSelect}
            transactionType={transactionType}
          />
        );
      case SettingsScreens.BankCard:
        return (
          <BankForm
            wallet={wallet!}
            onScreenSelect={onScreenSelect}
            transactionType={transactionType}
          />
        );
      case SettingsScreens.Transfer:
        return (
          <Transfer
            onScreenSelect={onScreenSelect}
            transactionType={transactionType}
            wallet={wallet!}
          />
        );
      case SettingsScreens.DetailsChannel:
        return <DetailsChannel onScreenSelect={onScreenSelect} />;
      case SettingsScreens.EarnStatistic:
        return (
          <EarningStatistic
            peerType={peerType}
            wallet={wallet!}
            onScreenSelect={onScreenSelect}
          />
        );
      case SettingsScreens.WalletSettings:
        return <WalletSettings />;
      case SettingsScreens.WalletCard:
        return <WalletCard />;
      case SettingsScreens.Subscriptions:
        return <SettingsSubscriptions onSelectChatMenu={onSelectChatMenu} />;
      case SettingsScreens.InvitationLink:
      case SettingsScreens.CreateLink:
        return (
          <SettingsInvitationLink
            isActive={isScreenActive}
            onReset={handleReset}
            shownScreen={currentKey}
            onScreenSelect={onScreenSelect}
          />
        );
      case SettingsScreens.DeleteUserInfo:
        return <SettingsDeleteUserInfo onScreenSelect={onScreenSelect} />;
      case SettingsScreens.BeforeDeletingUser:
        return (
          <SettingsBeforeDeletingAccount onScreenSelect={onScreenSelect} />
        );
      case SettingsScreens.Information:
        return <MainInformation />;
      case SettingsScreens.LoyaltyProgram:
        return (
          <LoyaltyProgram isActive={isScreenActive} onReset={handleReset} />
        );
      case SettingsScreens.aiSpace:
        return <AiSpaceMain isActive={isScreenActive} onReset={handleReset} />;
      default:
        return <></>;
    }
  }

  function renderContent(
    isScreenActive: boolean,
    isFrom: boolean,
    currentKey: SettingsScreens
  ) {
    return (
      <div
        ref={containerRef}
        id='settings_content'
        className={classNames('settings-content custom-scroll', {
          'space-bg': currentScreen === SettingsScreens.aiSpace,
        })}
      >
        {renderCurrentSectionContent(isScreenActive, currentKey)}
      </div>
    );
  }

  useEffect(() => {
    if (payment?.status === 'completed') {
      getWallets({ asset_id: wallet?.asset_name === 'usd' ? 2 : 1 });
      onScreenSelect(SettingsScreens.Wallet);
    }
  }, [payment?.status]);

  return (
    <div className='settings-layout'>
      <SettingsHeader
        currentScreen={currentScreen}
        onSaveFilter={handleSaveFilter}
        onScreenSelect={onScreenSelect}
        editedFolderId={foldersState.folderId}
        onReset={handleReset}
        wallet={wallet!}
        transactionType={transactionType}
        peerType={peerType!}
      />

      <Transition
        id='Settings'
        name='fade'
        activeKey={currentScreen}
        renderCount={TRANSITION_RENDER_COUNT}
        shouldCleanup
        cleanupExceptionKey={SettingsScreens.Main}
      >
        {renderContent}
      </Transition>
    </div>
  );
};

export default memo(Settings);
