import React, { FC, memo, useCallback, useEffect } from 'react';
import Button from '../../../../ui/Button';

import { SettingsScreens } from '../../../../../types';
import { EPeerType, IGraphicData, IWallet } from '../../../../../global/types';

import './DetailsCard.scss';
import { useTranslation } from 'react-i18next';
import IconSvg from '../../../../ui/IconSvg';
import { getActions, withGlobal } from '../../../../../global';

import getDaysInMonth from 'date-fns/getDaysInMonth';
import { getMoneyFormat } from '../../../../../util/convertMoney';
import classNames from 'classnames';
import IconSvgSettings from '../../icons/IconSvgSettings';
import useFlag from '../../../../../hooks/useFlag';
import ConfirmDialog from '../../../../ui/ConfirmDialog';
interface OwnProps {
  setPeerType: (type: EPeerType) => void;
  onScreenSelect: (screen: SettingsScreens) => void;
  wallet: IWallet | undefined;
  onTransactionType: (type: 'deposit' | 'withdrawal') => void;
}

interface StateProps {
  lastMonthGraphic: IGraphicData;
}

const DetailsCard: FC<OwnProps & StateProps> = ({
  onScreenSelect,
  wallet,
  lastMonthGraphic,
  onTransactionType,
  setPeerType,
}) => {
  const { t } = useTranslation();
  const { getLastMonthActivityGraphic } = getActions();
  const { amount, data } = lastMonthGraphic || {};
  const { id: walletId, type } = wallet || {};

  const [showNote, openNoteModal, closeNoteModal] = useFlag();

  const handleDeposit = useCallback(() => {
    onScreenSelect(SettingsScreens.Transfer);
    onTransactionType('deposit');
  }, []);

  const handleWithdrawal = useCallback(() => {
    onScreenSelect(SettingsScreens.Transfer);
    onTransactionType('withdrawal');
  }, []);

  const handleEarnStatistic = (type: EPeerType) => {
    setPeerType(type);
    onScreenSelect(SettingsScreens.EarnStatistic);
  };

  const getBars = useCallback(() => {
    let largNumber = 0;
    if (data) {
      data.forEach((el, idx, arr) => {
        let amount = 0;
        const filterArr = arr.filter((elArr) => elArr.date === el.date);
        amount = filterArr.reduce((acc, cur) => {
          return cur.type === 'deposit' ? acc + cur.amount : acc - cur.amount;
        }, amount);
        largNumber =
          Math.abs(amount) > largNumber ? Math.abs(amount) : largNumber;
      });
    }
    return Array(getDaysInMonth(Date.now()))
      .fill(undefined)
      .map((e_, idx) => {
        const barData = data?.filter(
          (el) => Number(el.date.split('-')[2]) === idx + 1
        );

        let total = 0;
        if (barData?.length) {
          total = barData.reduce((acc, cur) => {
            return cur.type === 'deposit' ? acc + cur.amount : acc - cur.amount;
          }, total);
        }
        const height = total
          ? Math.abs(Math.floor((total * 100) / largNumber))
          : 0;
        return (
          <div key={idx} className='chart__column'>
            <div
              style={{ height: `${height}%` }}
              className={classNames('chart__column-color', {
                negative: total < 0,
              })}
            />
          </div>
        );
      });
  }, [data]);

  useEffect(() => {
    if (walletId) {
      getLastMonthActivityGraphic({
        wallet_id: walletId,
        limit: 0,
        page: 0,
      });
    }
  }, [wallet]);

  return (
    <>
      <div className='wallet__details details'>
        {type === 'earning' && (
          <p className='description'>
            All applicable commissions are subtracted from the balance.
          </p>
        )}
        <div className='details__btn-wrapper'>
          {type === 'main' && (
            <Button size='smaller' onClick={handleDeposit}>
              {t('Wallet.Deposit')}
            </Button>
          )}

          {type === 'earning' && (
            <>
              <Button size='smaller' onClick={handleWithdrawal} outline>
                {t('Wallet.Withdrawal')}
              </Button>
              <Button size='smaller' color='danger' onClick={openNoteModal}>
                <IconSvg name='mark' w='19' h='19' />
              </Button>
            </>
          )}
        </div>
      </div>
      <div className='wallet__charts chart'>
        <div className='chart__wrapper'>
          <div className='chart__title'>Monthly activity</div>
          <div className='chart__subtitle amount'>
            <span className='price'>
              <IconSvg name='dollar' w='14' h='14' />
              {`${amount && amount < 0 ? '-' : ''}${getMoneyFormat(
                amount,
                2,
                2
              )} Last month`}
            </span>
          </div>
          <div className='chart__wrap-column'>{getBars()}</div>

          <div className='row'>
            <div className='col col-6'>
              <Button
                outline
                fullWidth
                size='smaller'
                onClick={() =>
                  onScreenSelect(SettingsScreens.FinancialActivity)
                }
              >
                {t('Wallet.DetailedHistory')}
              </Button>
            </div>
            {/* {type === 'main' && (
              <div className='col col-6'>
                <Button outline size='smaller' fullWidth>
                  <IconSvg name='heart-fly' />
                  {t('Wallet.DonateStatistics')}
                </Button>
              </div>
            )} */}
          </div>
        </div>
      </div>
      {/* {type === 'earning' && (
        <div className='wallet__earn-statistic'>
          <div className='transactions__header'>
            <div className='transactions__title'>Statistics</div>
          </div>
          <div className='row'>
            <div className='col'>
              <Button
                outline
                fullWidth
                onClick={() =>
                  handleEarnStatistic(EPeerType.ChannelsSubscription)
                }
              >
                <IconSvgSettings name='coin' />
                <div className='title'>{t('Wallet.PaidChannels')}</div>
              </Button>
            </div>
            <div className='col'>
              <Button
                outline
                fullWidth
                onClick={() => handleEarnStatistic(EPeerType.CourseChannel)}
              >
                <IconSvgSettings name='radio-black' />
                <div className='title'>{t('Channel.OnlineCourse')}</div>
              </Button>
            </div>
            <div className='col'>
              <Button
                outline
                fullWidth
                onClick={() => handleEarnStatistic(EPeerType.MediaSale)}
              >
                <IconSvgSettings name='video-play' />
                <div className='title'>{t('Channel.MediaSale')}</div>
              </Button>
            </div>
          </div>
        </div>
      )} */}
      <ConfirmDialog
        isOpen={showNote}
        onClose={closeNoteModal}
        title='Info'
        confirmHandler={closeNoteModal}
        confirmLabel='Ok'
        withoutCancel
      >
        <div className='note-mark mb-3' />
        <h3>Note</h3>
        <p>
          We make monthly payouts. As long as you've completed all of the steps
          to get paid, you'll be issued a payment by the end of each month.
        </p>
      </ConfirmDialog>
    </>
  );
};

export default memo(
  withGlobal((global): StateProps => {
    const { statistic } = global;
    return {
      lastMonthGraphic: statistic?.lastMonth!,
    };
  })(DetailsCard)
);
