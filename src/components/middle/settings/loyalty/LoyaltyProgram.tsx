import React, { FC, memo, useCallback, useEffect, useState } from 'react';

import MyProgress from './MyProgress';
import MyReferrals from './MyReferrals';
import { getActions, withGlobal } from '../../../../global';
import { GlobalState } from '../../../../global/types';
import { pick } from '../../../../util/iteratees';
import Loading from '../../../ui/Loading';
import { MiddleColumnContent } from '../../../../types';
import useHistoryBack from '../../../../hooks/useHistoryBack';

export enum ETab {
  progress,
  referrals,
}

type OwnProps = {
  isActive?: boolean;
  onReset: () => void;
};

type StateProps = Pick<GlobalState, 'loyalty' | 'currentUserId'>;

const LoyaltyProgram: FC<StateProps & OwnProps> = ({
  loyalty,
  currentUserId,
  isActive,
  onReset,
}) => {
  const {
    getReferralCode,

    getLoyaltyBonusDataWithSum,
  } = getActions();
  const [activeTab, setActiveTab] = useState<ETab>(ETab.progress);

  useHistoryBack({
    isActive,
    onBack: onReset,
  });

  useEffect(() => {
    getReferralCode();
    getLoyaltyBonusDataWithSum();
  }, []);

  if (!loyalty) return <Loading />;

  return (
    <>
      {activeTab === ETab.progress ? (
        <MyProgress
          loyalty={loyalty}
          setTab={setActiveTab}
          currentUserId={currentUserId!}
        />
      ) : (
        <MyReferrals loyalty={loyalty} setTab={setActiveTab} />
      )}
    </>
  );
};

export default memo(
  withGlobal(
    (global): StateProps => pick(global, ['loyalty', 'currentUserId'])
  )(LoyaltyProgram)
);
