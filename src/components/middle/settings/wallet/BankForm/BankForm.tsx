import React, { FC, memo } from 'react';

import { GlobalState, IWallet } from '../../../../../global/types';
import { SettingsScreens } from '../../../../../types';

import BankDeposit from './BankDeposit';
import BankWithdrawal from './BankWithdrawal';
import StripeDeposit from './StripeDeposit';
import { withGlobal } from '../../../../../global';
import { pick } from '../../../../../util/iteratees';

import '../PayPalForm/PayPalForm.scss';
import './BankForm.scss';

type OwnProps = {
  wallet: IWallet;
  transactionType: 'deposit' | 'withdrawal';
  onScreenSelect: (screen: SettingsScreens) => void;
};

type StateProps = Pick<GlobalState, 'payment' | 'limitsAndFee'>;

const BankForm: FC<OwnProps & StateProps> = ({
  wallet,
  transactionType,
  payment,
  limitsAndFee,
  onScreenSelect,
}) => {
  return transactionType === 'deposit' ? (
    // <BankDeposit wallet={wallet} onScreenSelect={onScreenSelect} />
    <StripeDeposit
      payment={payment}
      wallet={wallet}
      limitsAndFee={limitsAndFee!}
      onScreenSelect={onScreenSelect}
    />
  ) : (
    <BankWithdrawal wallet={wallet} onScreenSelect={onScreenSelect} />
  );
};

export default memo(
  withGlobal((global): StateProps => pick(global, ['payment', 'limitsAndFee']))(
    BankForm
  )
);
