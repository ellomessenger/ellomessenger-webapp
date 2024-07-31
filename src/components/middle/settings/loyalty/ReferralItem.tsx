import React, { FC, memo, useEffect } from 'react';
import { ILoyaltyUser } from '../../../../global/types';
import ListItem from '../../../ui/ListItem';
import useLastCallback from '../../../../hooks/useLastCallback';
import { getActions, withGlobal } from '../../../../global';
import Avatar from '../../../common/Avatar';
import { ApiMediaFormat, ApiUser } from '../../../../api/types';
import { selectUser } from '../../../../global/selectors';
import IconSvgSettings from '../icons/IconSvgSettings';
import { getMoneyFormat } from '../../../../util/convertMoney';
import { getFirstLetters } from '../../../../util/textFormat';
import useMedia from '../../../../hooks/useMedia';
import IconSvg from '../../../ui/IconSvg';

type OwnProps = {
  referral: ILoyaltyUser;
  commission?: number;
  total?: number;
  lastSyncTime?: number;
};

type StateProps = {
  user?: ApiUser;
};

const ReferralItem: FC<OwnProps & StateProps> = ({
  referral,
  user,
  commission = 0,
  total = 0,
}) => {
  const { openChatByUsername, fetchUserByUsername } = getActions();
  const { username, first_name, last_name = '' } = referral;

  const handleClickChat = useLastCallback(() => {
    openChatByUsername({ username: username! });
  });

  useEffect(() => {
    if (referral) {
      fetchUserByUsername({ username: referral.username });
    }
  }, [referral]);

  return (
    <ListItem
      className='chat-item-clickable referral-item underline'
      onClick={handleClickChat}
      ripple
    >
      <div className='status'>
        {user ? (
          <Avatar peer={user} size='medium' />
        ) : (
          <div className='Avatar size-medium'>
            {getFirstLetters(`${first_name} ${last_name}`, 2)}
          </div>
        )}
      </div>
      <div className='info'>
        <div className='info-row'>
          <div className='title FullNameTitle-module__root'>
            <h3 dir='auto' className='fullName'>
              {first_name} {last_name!}
            </h3>
          </div>
        </div>
        <div className='subtitle'>
          <span className='amount'>
            <span className='text-secondary '>Total</span>
            <span className='price'>
              <IconSvg name='dollar' w='14' h='14' />
              {getMoneyFormat(total, 2, 2)}
            </span>
          </span>
          <span className='text-secondary '>/</span>
          <span className='amount'>
            <span className='text-secondary '>Your %</span>
            <span className='price'>
              <IconSvg name='dollar' w='14' h='14' />
              {getMoneyFormat(commission, 2, 2)}
            </span>
          </span>
        </div>
      </div>
    </ListItem>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { referral }): StateProps => {
    const user = referral ? selectUser(global, String(referral.id)) : undefined;

    return {
      user,
    };
  })(ReferralItem)
);
