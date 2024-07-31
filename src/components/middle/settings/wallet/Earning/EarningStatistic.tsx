import React, { FC } from 'react';
import { EPeerType, IWallet } from '../../../../../global/types';
import { withGlobal } from '../../../../../global';
import IconSvg from '../../../../ui/IconSvg';
import { getMoneyFormat } from '../../../../../util/convertMoney';
import { SettingsScreens } from '../../../../../types';
import TransactionHeader from '../TransactionHeader/TransactionHeader';
import IconSvgSettings from '../../icons/IconSvgSettings';

type StateProps = {
  reward?: number;
  lastMonthReward?: number;
};

type OwnType = {
  peerType: EPeerType | undefined;
  onScreenSelect: (screen: SettingsScreens) => void;
  wallet?: IWallet;
};

const EarningStatistic: FC<OwnType & StateProps> = ({
  lastMonthReward,
  reward,
  peerType,
  wallet,
  onScreenSelect,
}) => {
  return (
    <div className='wallet settings-container'>
      <div className='earning-content'>
        <div className='earning-reward row'>
          <div className='col'>
            <div className='reward total'>
              <i className='icon-svg'>
                <IconSvg name='wallet' w='18' h='18' />
              </i>
              <div className='reward-wrapper'>
                <div className='title'>Total Earned</div>
                <h3>
                  <IconSvg name='dollar' w='18' h='18' />
                  {getMoneyFormat(reward, 2, 2)}
                </h3>
              </div>
            </div>
          </div>
          <div className='col'>
            <div className='reward'>
              <i className='icon-svg'>
                <IconSvg name='ello-скувшеы' w='18' h='18' />
              </i>
              <div className='reward-wrapper'>
                <div className='title'>Earned last month</div>
                <h3>
                  <IconSvg name='dollar' w='16' h='16' />
                  {getMoneyFormat(lastMonthReward, 2, 2)}
                </h3>
              </div>
            </div>
          </div>
        </div>
        <TransactionHeader
          isEarnings
          wallet={wallet}
          peerType={peerType}
          onScreenSelect={onScreenSelect}
        />
      </div>
    </div>
  );
};

export default withGlobal((global): StateProps => {
  const { earnStatistics } = global;
  return {
    lastMonthReward: earnStatistics?.last_month_reward,
    reward: earnStatistics?.reward,
  };
})(EarningStatistic);
