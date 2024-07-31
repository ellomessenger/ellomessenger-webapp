import React, { FC, Fragment, MouseEvent, memo, useState } from 'react';
import { SettingsScreens } from '../../../../../types';
import { GlobalState, ITransactions } from '../../../../../global/types';
import { pick } from '../../../../../util/iteratees';
import { withGlobal } from '../../../../../global';
import TransactionItem from './TransactionItem';
import NothingFound from '../../../../common/NothingFound';
import Loading from '../../../../ui/Loading';

type StateProps = Pick<GlobalState, 'transactionsHistory'>;

type OwnProps = {
  loading: boolean;
  onScreenSelect: (screen: SettingsScreens) => void;
};

const TransactionBody: FC<OwnProps & StateProps> = ({
  loading,
  transactionsHistory,
}) => {
  return (
    <>
      {loading && <Loading />}
      {transactionsHistory &&
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
              <TransactionItem transaction={transaction} />
            </Fragment>
          ))
        ) : (
          <NothingFound />
        ))}
    </>
  );
};

export default memo(
  withGlobal((global): StateProps => pick(global, ['transactionsHistory']))(
    TransactionBody
  )
);
