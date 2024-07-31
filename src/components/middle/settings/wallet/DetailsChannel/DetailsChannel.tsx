import React, { FC } from 'react';
import ColumnCharts from '../../../../ui/ColumnCharts/ColumnCharts';
import TransactionHeader from '../TransactionHeader/TransactionHeader';
import { SettingsScreens } from '../../../../../types';
import InfoChannel from './InfoChannel/InfoChannel';
import AvatarWrap from './AvatarWrap';
import './DetailsChannel.scss';

interface ITransactionHeader {
  onScreenSelect: (screen: SettingsScreens) => void;
}

const DetailsChannel: FC<ITransactionHeader> = ({ onScreenSelect }) => {
  return (
    <section className='wallet__main-content main-content'>
      <div className='wallet settings-content custom-scroll'>
        <div className='wallet__card-contant'>
          <section className='wallet__main-content main-content'>
            <AvatarWrap />
            <InfoChannel />
            <ColumnCharts onlyOneBtn onScreenSelect={onScreenSelect} />
            <TransactionHeader onScreenSelect={onScreenSelect} />
          </section>
        </div>
      </div>
    </section>
  );
};

export default DetailsChannel;
