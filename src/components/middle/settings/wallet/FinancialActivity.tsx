import React, { FC, memo } from 'react';
import TinyBarChart from './TinyBarChart/TinyBarChart';
import { SettingsScreens } from '../../../../types';
import TransactionHeader from './TransactionHeader/TransactionHeader';
import { IGraphicData, IWallet } from '../../../../global/types';

interface OwnProps {
  wallet: IWallet | undefined;
  onScreenSelect: (screen: SettingsScreens) => void;
}

const FinancialActivity: FC<OwnProps> = ({ wallet, onScreenSelect }) => {
  return (
    <div className='wallet settings-container'>
      <div className='wallet__card-contant'>
        <TinyBarChart wallet={wallet} />
        <TransactionHeader onScreenSelect={onScreenSelect} wallet={wallet} />
      </div>
    </div>
  );
};

export default FinancialActivity;
