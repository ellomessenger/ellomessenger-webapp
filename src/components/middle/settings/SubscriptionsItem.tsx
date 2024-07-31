import React, { FC, memo, useMemo } from 'react';
import ListItem from '../../ui/ListItem';
import IconSvg from '../../ui/IconSvg';
import Avatar from '../../common/Avatar';
import { EPeerType, ISubsriptionItem } from '../../../global/types';
import { ApiChat } from '../../../api/types';
import { getActions, withGlobal } from '../../../global';
import { selectChat } from '../../../global/selectors';
import {
  getChatTitle,
  isChatAdult,
  isChatCourse,
  isChatSubscription,
} from '../../../global/helpers';
import { useTranslation } from 'react-i18next';
import { formatDateToString } from '../../../util/dateFormat';
import { getMoneyFormat } from '../../../util/convertMoney';
import useLastCallback from '../../../hooks/useLastCallback';
import classNames from 'classnames';

type StateProps = {
  chat?: ApiChat;
};

type OwnProps = {
  item: ISubsriptionItem;
  withLine?: boolean;
};

const SubscriptionsItem: FC<OwnProps & StateProps> = ({ chat, withLine }) => {
  const { openChat } = getActions();
  const { t } = useTranslation();
  const { id, cost, endDate } = chat || {};
  const isChannelSubscription = useMemo(
    () => chat! && isChatSubscription(chat),
    [chat]
  );
  const isChannelCourse = useMemo(() => chat! && isChatCourse(chat), [chat]);
  const isAdult = useMemo(() => chat! && isChatAdult(chat), [chat]);
  const title = chat! && getChatTitle(t, chat as ApiChat);

  const handleClickChat = useLastCallback(() => {
    openChat({ id: `-${id}` });
  });

  return (
    <ListItem
      className={classNames('chat-item-clickable subscriptions-item', {
        underline: withLine,
      })}
      onClick={handleClickChat}
      ripple
    >
      <div className='status'>
        <Avatar peer={chat} />
      </div>
      <div className='info'>
        <div className='info-row'>
          <div className='type active'>
            <span className='icon-svg'>
              <IconSvg name={'check'} w='10' h='10' />
            </span>
            <span className='text'>active</span>
          </div>
          {isChannelSubscription && (
            <span className='icon-svg'>
              <IconSvg name='channel' />
            </span>
          )}
          {isChannelCourse && <IconSvg name='online-course-outline' />}
          {isAdult && <IconSvg name='adult' />}
          <div className='title FullNameTitle-module__root'>
            <h3 dir='auto' className='fullName'>
              {title}
            </h3>
          </div>
        </div>
        <div className='subtitle'>
          <span className='amount'>
            <span className='text-secondary'>Price:</span>
            <span className='price'>
              <IconSvg name='dollar' w='14' h='14' />
              {getMoneyFormat(cost, 2, 2) ?? 0}
            </span>
          </span>

          {endDate && (
            <span>
              <span className='text-secondary'>Renews:</span>{' '}
              {formatDateToString(Number(endDate) * 1000)}
            </span>
          )}
        </div>
      </div>
    </ListItem>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { item: { id } }): StateProps => {
    const chat = selectChat(global, `-${id}`);

    if (!chat) {
      return {};
    }
    return {
      chat,
    };
  })(SubscriptionsItem)
);
