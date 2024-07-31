import React, { FC, useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { SettingsScreens } from '../../../../../types';
import IconSvg from '../../../../ui/IconSvg';
import '../WalletMainPage.scss';
import './TopUp.scss';
import { GlobalState, IWallet } from '../../../../../global/types';
import useLastCallback from '../../../../../hooks/useLastCallback';
import { getActions, withGlobal } from '../../../../../global';
import { pick } from '../../../../../util/iteratees';

type OwnProps = {
  wallet: IWallet | undefined;
  transactionType: 'deposit' | 'withdrawal';
  onScreenSelect: (screen: SettingsScreens) => void;
};

type StateProps = Pick<GlobalState, 'availablePaymentSystem'>;

const Transfer: FC<OwnProps & StateProps> = ({
  transactionType,
  onScreenSelect,
  wallet,
  availablePaymentSystem,
}) => {
  const { getAvailablePaymentSystem } = getActions();
  const { t } = useTranslation();

  const isDepositShown =
    availablePaymentSystem &&
    availablePaymentSystem.some(({ on_off_deposit }) => !on_off_deposit);

  const payPalMethod =
    availablePaymentSystem &&
    availablePaymentSystem.find(({ type }) => type === 'paypal');

  const stripeMethod =
    availablePaymentSystem &&
    availablePaymentSystem.find(({ type }) => type === 'stripe');

  const handleClickPayPal = useLastCallback(() => {
    onScreenSelect(SettingsScreens.PayPal);
  });

  const handleClickBank = useLastCallback(() => {
    onScreenSelect(SettingsScreens.BankCard);
  });

  const handleClickMyBalance = useLastCallback(() => {
    onScreenSelect(SettingsScreens.MyBalance);
  });

  useEffect(() => {
    getAvailablePaymentSystem();
  }, [wallet?.type]);

  if (!availablePaymentSystem) return;

  return (
    <section className='top-up settings-container'>
      {wallet?.type === 'earning' && (
        <div onClick={handleClickMyBalance} className='top-up__inner'>
          <div className='top-up__box'>
            <IconSvg name='my_balance' w='110' h='36' />
          </div>
          <p className='top-up__title'>My Balance</p>
        </div>
      )}

      {wallet?.type === 'main' && !isDepositShown && (
        <div className='top-up__inner'>
          <div className='top-up__box not-hover'>
            <IconSvg name='wallet' w='75' h='75' />
          </div>
          <p className='top-up__title'>No deposit methods available</p>
        </div>
      )}

      {((wallet?.type === 'main' && !payPalMethod?.on_off_deposit) ||
        (wallet?.type === 'earning' && !payPalMethod?.on_off_withdrawals)) && (
        <div onClick={handleClickPayPal} className='top-up__inner'>
          <div className='top-up__box'>
            <IconSvg name='pay-pal-large' />
          </div>
          <p className='top-up__title'>PayPal</p>
        </div>
      )}

      {((wallet?.type === 'main' && !stripeMethod?.on_off_deposit) ||
        (wallet?.type === 'earning' && !stripeMethod?.on_off_withdrawals)) && (
        <div onClick={handleClickBank} className='top-up__inner'>
          <div className='top-up__box'>
            <IconSvg
              name={
                transactionType === 'deposit'
                  ? 'stripe-account'
                  : 'transfer-desc'
              }
              w='88'
              h='89'
            />
          </div>
          <p className='top-up__title'>
            {t(
              `Wallet.${
                transactionType === 'deposit' ? 'Stripe' : 'BankTransfer'
              }`
            )}
          </p>
        </div>
      )}
    </section>
  );
};

export default withGlobal((global) => pick(global, ['availablePaymentSystem']))(
  Transfer
);
