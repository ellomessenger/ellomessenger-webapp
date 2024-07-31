import React, { FC, memo, useCallback, useEffect, useRef } from 'react';

import MainContent from './MainContent';
import { MiddleColumnContent, SettingsScreens } from '../../../../types';
import WelcomeWallet from './WelcomeWallet/WelcomeWallet';
import { getActions, withGlobal } from '../../../../global';
import {
  EPeerType,
  GlobalState,
  IWallet,
  TabState,
} from '../../../../global/types';

import './WalletMainPage.scss';
import Transition from '../../../ui/Transition';
import Loading from '../../../ui/Loading';
import ConfirmPayModal from '../../../payment/ConfirmPayModal';
import { selectTabState } from '../../../../global/selectors';
import useHistoryBack from '../../../../hooks/useHistoryBack';

interface OwnProps {
  onScreenSelect: (screen: SettingsScreens) => void;
  onChangeCard: (wallet: IWallet | undefined) => void;
  onTransactionType: (type: 'deposit' | 'withdrawal') => void;
  wallet?: IWallet;
  transactionType: 'deposit' | 'withdrawal';
  setPeerType: (type: EPeerType) => void;
  isActive?: boolean;
  onReset: () => void;
}

type StateProps = Pick<GlobalState, 'wallets' | 'walletLoading' | 'payment'> &
  Pick<TabState, 'middleScreen'>;

const WalletMainPage: FC<OwnProps & StateProps> = ({
  onScreenSelect,
  payment,
  wallets,
  wallet,
  walletLoading,
  transactionType,
  middleScreen,
  isActive,
  onReset,
  onTransactionType,
  onChangeCard,
  setPeerType,
}) => {
  const {
    getWallets,
    apiUpdate,
    getLimitsAndFees,
    setLeftScreen,
    setMiddleScreen,
  } = getActions();

  const handleClearPayment = useCallback(() => {
    apiUpdate({
      '@type': 'updatePaymentState',
      payment: undefined,
    });
  }, []);

  useHistoryBack({
    isActive,
    onBack: onReset,
  });

  useEffect(() => {
    getWallets({ asset_id: 2 });
    getLimitsAndFees();
  }, []);

  useEffect(() => {
    if (wallet) {
      const newWallet = wallets.find((el) => el.id === wallet.id);
      if (wallet?.id && wallet.amount !== newWallet?.amount) {
        onChangeCard(newWallet);
      }
    }
  }, [wallets]);

  return (
    <div className='wallet settings-container'>
      <Transition name='fade' activeKey={wallets.length}>
        {wallets.length ? (
          <MainContent
            setPeerType={setPeerType}
            onScreenSelect={onScreenSelect}
            onTransactionType={onTransactionType}
            wallets={wallets}
            wallet={wallet}
            onChangeCard={onChangeCard}
          />
        ) : walletLoading ? (
          <WelcomeWallet />
        ) : (
          <Loading />
        )}
      </Transition>

      <ConfirmPayModal
        isOpen={
          middleScreen === MiddleColumnContent.Settings &&
          Boolean(
            payment?.status &&
              ['completed', 'canceled'].includes(payment?.status)
          )
        }
        onClose={handleClearPayment}
        payment={payment}
        transactionType={transactionType}
      />
    </div>
  );
};

export default memo(
  withGlobal((global): StateProps => {
    const { wallets, walletLoading, payment } = global;
    const tabState = selectTabState(global);
    return {
      wallets,
      walletLoading,
      payment,
      middleScreen: tabState.middleScreen,
    };
  })(WalletMainPage)
);
