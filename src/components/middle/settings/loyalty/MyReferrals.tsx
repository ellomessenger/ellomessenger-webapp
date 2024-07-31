import React, { FC, useEffect, useState } from 'react';
import IconSvgSettings from '../icons/IconSvgSettings';
import { getMoneyFormat } from '../../../../util/convertMoney';
import { getActions } from '../../../../lib/teact/teactn';
import { ILoyalty } from '../../../../global/types';
import ReferralItem from './ReferralItem';
import { ETab } from './LoyaltyProgram';
import Pagination from '../../../ui/Pagination';
import useLastCallback from '../../../../hooks/useLastCallback';
import NothingFound from '../../../common/NothingFound';
import { useTranslation } from 'react-i18next';
import IconSvg from '../../../ui/IconSvg';

type OwnProps = { loyalty: ILoyalty; setTab: (tab: ETab) => void };

const MyReferrals: FC<OwnProps> = ({ loyalty, setTab }) => {
  const { getReferralUsers } = getActions();
  const { users, sum = 0, total } = loyalty;

  const [page, setPage] = useState(1);

  const { t } = useTranslation();

  const getMore = useLastCallback(() => {
    if (users && total && users?.length < total) {
      setPage((prevState) => prevState + 1);
    }
  });

  useEffect(() => {
    getReferralUsers({ pagination: { page, per_page: 20 } });
  }, [page]);

  return (
    <Pagination
      className='Loyalty-page custom-scroll'
      onLoadMore={getMore}
      offset={150}
    >
      <div className='btn-group tab-nav full-width'>
        <div className='Button text' onClick={() => setTab(ETab.progress)}>
          My progress
        </div>
        <div className='Button text active'>My referrals</div>
      </div>

      <div className='heading-banner referrals'>
        <div className='mb-3'>
          <IconSvgSettings name='three-users' w='34' h='34' />
        </div>
        <h4>Commission from referrals</h4>
        <h2 className='amount'>
          <IconSvg name='dollar' w='26' h='26' />
          {getMoneyFormat(sum, 2, 2)}
        </h2>
      </div>
      <div className='settings-container mt-2'>
        <div className='subscriptions-list'>
          {users?.length ? (
            users.map(({ user, commission, sum }) => (
              <ReferralItem
                key={user.id}
                referral={user}
                commission={commission}
                total={sum}
              />
            ))
          ) : (
            <NothingFound
              text={t('SearchNothingFound')}
              //description={t('SearchNothingFound')}
            />
          )}
        </div>
      </div>
    </Pagination>
  );
};

export default MyReferrals;
