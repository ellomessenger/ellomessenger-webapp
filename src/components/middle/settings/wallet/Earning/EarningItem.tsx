import React, { FC, memo, useMemo } from 'react';
import IconSvg from '../../../../ui/IconSvg';
import ListItem from '../../../../ui/ListItem';
import Avatar from '../../../../common/Avatar';
import { EPeerType, IEarnItem } from '../../../../../global/types';
import { ApiChat, ApiMediaFormat, ApiUser } from '../../../../../api/types';
import { withGlobal } from '../../../../../global';
import { selectChat, selectUser } from '../../../../../global/selectors';
import { useTranslation } from 'react-i18next';
import useMedia from '../../../../../hooks/useMedia';
import { isChatAdult } from '../../../../../global/helpers';
import { getMoneyFormat } from '../../../../../util/convertMoney';

type OwnProps = {
  earn: IEarnItem;
  peerType: EPeerType;
};

type StateProps = {
  chat?: ApiChat;
  lastSyncTime?: number;
};

const EarningItem: FC<OwnProps & StateProps> = ({
  earn,
  chat,
  peerType,
  lastSyncTime,
}) => {
  const { t } = useTranslation();
  const { service_photo, service_name, cost, participants_count } = earn;
  const isAdult = useMemo(() => !!chat && isChatAdult(chat), [chat]);

  return (
    <ListItem className='earn'>
      {chat ? (
        <Avatar peer={chat} size='medium' />
      ) : (
        <div className='Avatar size-mini no-photo'>
          {service_name.charAt(0).toUpperCase()}
        </div>
      )}

      <div className='info'>
        <div className='info-row'>
          {peerType === EPeerType.ChannelsSubscription && (
            <i className='icon-svg color-2'>
              <IconSvg name='dollar' />
            </i>
          )}
          {peerType === EPeerType.CourseChannel && (
            <IconSvg name='online-course-outline' />
          )}
          {isAdult && <IconSvg name='adult' />}
          <h4>{earn.service_name}</h4>
        </div>
      </div>
      <div className='row'>
        <div className='col'>
          <div className='subtitle'>Number subscribers</div>
          <h4>{participants_count}</h4>
        </div>
        <div className='col'>
          <div className='subtitle'>Subscription price</div>
          <h4>${getMoneyFormat(cost, 2, 2)}</h4>
        </div>
      </div>
    </ListItem>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { earn }): StateProps => {
    const { currentUserId, lastSyncTime } = global;
    const currentUser = currentUserId
      ? selectUser(global, currentUserId)
      : undefined;
    const chat = earn
      ? selectChat(global, String(`-${earn.peer_id}`))
      : undefined;
    return {
      chat,
      lastSyncTime,
    };
  })(EarningItem)
);
