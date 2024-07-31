import React, { FC, memo } from 'react';

import { withGlobal } from '../../../../../global';
import { IPayment, IWallet } from '../../../../../global/types';
import './PayPalForm.scss';
import { SettingsScreens } from '../../../../../types';
import PayPalDeposit from './PayPalDeposit';
import PayPalWithdrawal from './PayPalWithdrawal';

type StateProps = {
  payment: IPayment | undefined;
};

type OwnProps = {
  wallet: IWallet;
  transactionType: 'deposit' | 'withdrawal';
  onScreenSelect: (screen: SettingsScreens) => void;
};

const PayPalForm: FC<StateProps & OwnProps> = ({
  wallet,
  payment,
  transactionType,
  onScreenSelect,
}) => {
  return transactionType === 'deposit' ? (
    <PayPalDeposit
      payment={payment}
      wallet={wallet}
      onScreenSelect={onScreenSelect}
    />
  ) : (
    <PayPalWithdrawal
      payment={payment}
      wallet={wallet}
      onScreenSelect={onScreenSelect}
    />
  );
};

export default memo(
  withGlobal((global): StateProps => {
    const { payment } = global;
    return {
      payment: payment!,
    };
  })(PayPalForm)
);
