import React, {
  ChangeEvent,
  FC,
  Fragment,
  memo,
  useEffect,
  useState,
} from 'react';

import IconSvg from '../../../../ui/IconSvg';
import TransactionBody from '../TransactionsBody/TransactionsBody';
import { SettingsScreens } from '../../../../../types';
import { Filter } from './Filter';
import {
  ASSET_ID,
  EPeerType,
  GlobalState,
  IEarnItem,
  ITransactions,
  IWallet,
} from '../../../../../global/types';
import { getActions, withGlobal } from '../../../../../global';
import useFlag from '../../../../../hooks/useFlag';
import useShowTransition from '../../../../../hooks/useShowTransition';
import { useDebounce } from '../../../../../hooks/useDebounce';
import CalendarModal from '../../../../common/CalendarModal';
import classNames from 'classnames';
import './TransactionHeader.scss';
import NothingFound from '../../../../common/NothingFound';
import TransactionItem from '../TransactionsBody/TransactionItem';
import Loading from '../../../../ui/Loading';
import { pick } from '../../../../../util/iteratees';
import EarningItem from '../Earning/EarningItem';

interface OwnProps {
  wallet: IWallet | undefined;
  peerType?: EPeerType | undefined;
  isEarnings?: boolean;
  onScreenSelect: (screen: SettingsScreens) => void;
}

type StateProps = {
  earnings?: IEarnItem[];
  transactionsHistory: ITransactions[];
};

const TransactionHeader: FC<OwnProps & StateProps> = ({
  wallet,
  peerType,
  transactionsHistory,
  isEarnings,
  earnings,
  onScreenSelect,
}) => {
  const { getWalletTransactions, channelsEarnStatistics } = getActions();
  const [isOpenFilter, openFilter, closeFilter] = useFlag();
  const [paymentType, setPaymentType] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, openLoading, closeLoading] = useFlag();
  const [isOpenCalendar, openCalendar, closeCalendar] = useFlag();
  const { transitionClassNames } = useShowTransition(
    isOpenFilter,
    undefined,
    undefined,
    undefined,
    true
  );
  const [startDate, setStartDate] = useState<number | undefined>();
  const [endDate, setEndDate] = useState<number | undefined>();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleOpenCalendar = () => {
    openCalendar();
    closeFilter();
  };

  const handleSelectFilter = (item: string) => {
    setPaymentType(item);
    closeFilter();
  };

  const handleSelectDate = ([date, secondDate]: [
    Date | undefined,
    Date | undefined
  ]) => {
    setStartDate(date?.getTime());
    setEndDate(secondDate?.getTime());
  };

  const debouncedSearch = useDebounce(searchValue, 500);

  useEffect(() => {
    closeCalendar();
    openLoading();
    const dateFrom = startDate ? formatDay(startDate) : undefined;
    const dateTo =
      endDate && String(startDate).slice(0, 8) !== String(endDate).slice(0, 8)
        ? formatDay(endDate)
        : undefined;
    if (wallet) {
      if (!isEarnings) {
        getWalletTransactions({
          wallet_id: wallet?.id,
          asset_id: ASSET_ID.USD,
          payment_type: paymentType,
          search: debouncedSearch || undefined,
          date_from: dateFrom,
          date_to: dateTo,
        });
      } else {
        channelsEarnStatistics({
          peer_type: peerType!,
          limit: 999,
          offset: 0,
        });
      }
    }

    const handler = setTimeout(() => {
      closeLoading();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [wallet, paymentType, debouncedSearch, startDate, endDate, peerType]);

  return (
    <div className='wallet__transactions transactions'>
      <div className='transactions__wrapper'>
        <div className='transactions__header'>
          <div className='transactions__title'>Transaction History</div>
        </div>
        <div className='transactions__search-wrap'>
          <input
            placeholder='Search...'
            className='transactions__search-input'
            type='text'
            onChange={onChange}
            value={searchValue}
          />
          <i className='icon-svg-wrapper'>
            <div
              onClick={isOpenFilter ? closeFilter : openFilter}
              className={classNames('transactions__filter', {
                active: isOpenFilter,
              })}
            >
              <IconSvg name='filter' w='24' h='24' />
            </div>
            <div className='transactions__filter' onClick={handleOpenCalendar}>
              <IconSvg name='calendar-gray' w='24' h='24' />
            </div>
          </i>
        </div>
        <div
          className={classNames(
            'transactions__filter-wrapper',
            transitionClassNames
          )}
        >
          <Filter setPaymentType={handleSelectFilter} />
        </div>
      </div>
      <div className={classNames('transactions__body', { hide: isOpenFilter })}>
        {isLoading && <Loading />}
        {transactionsHistory &&
          !isEarnings &&
          (transactionsHistory.length ? (
            transactionsHistory.map((transaction, idx, arr) => (
              <Fragment key={transaction.transaction.id}>
                {(idx === 0 ||
                  transaction.transaction.created_at_formatted !==
                    arr[idx - 1].transaction.created_at_formatted) && (
                  <div className='transactions__month-row'>
                    {transaction.transaction.created_at_formatted}
                  </div>
                )}
                <TransactionItem
                  transaction={transaction}
                  walletType={wallet?.type}
                />
              </Fragment>
            ))
          ) : (
            <NothingFound text='It seems you haven`t made any transactions yet.' />
          ))}
        {earnings &&
          isEarnings &&
          (earnings.length ? (
            earnings.map((earn, idx, arr) => (
              <Fragment key={earn.peer_id * idx}>
                {(idx === 0 || earn.start_date !== arr[idx - 1].start_date) && (
                  <div className='transactions__month-row'>
                    {earn.start_date}
                  </div>
                )}
                <EarningItem earn={earn} peerType={peerType!} />
              </Fragment>
            ))
          ) : (
            <NothingFound />
          ))}
      </div>
      <CalendarModal
        isOpen={isOpenCalendar}
        selectedAt={startDate}
        secondSelectedAt={endDate}
        isPastMode
        rangeFormat
        onSelectRange={handleSelectDate}
        onClose={closeCalendar}
        onSubmit={() => true}
      />
    </div>
  );
};

export default memo(
  withGlobal((global): StateProps => {
    const { transactionsHistory, earnStatistics } = global;

    return {
      transactionsHistory: transactionsHistory!,
      earnings: earnStatistics?.data,
    };
  })(TransactionHeader)
);

function formatDay(currDate: number) {
  const date = new Date(currDate);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return `${year}-${month + 1}-${String(day).length === 1 ? `0${day}` : day}`;
}
