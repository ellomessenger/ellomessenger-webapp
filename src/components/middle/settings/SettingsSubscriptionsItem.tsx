import React, { FC, memo, useMemo } from 'react';
import ListItem from '../../ui/ListItem';
import IconSvg from '../../ui/IconSvg';
import Avatar from '../../common/Avatar';
import classNames from 'classnames';
import { ISubsriptionItem } from '../../../global/types';
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
import IconSvgSettings from './icons/IconSvgSettings';

type StateProps = {
  chat?: ApiChat;
};

type OwnProps = {
  item: ISubsriptionItem;
  onSelectChatMenu: () => void;
  selectSubscription: (payload: { id: string; isActive: boolean }) => void;
};

const SettingsSubscriptionsItem: FC<OwnProps & StateProps> = ({
  item: { peer_id, is_active, expire_at, amount },
  chat,
  onSelectChatMenu,
  selectSubscription,
}) => {
  const { openChat } = getActions();
  const { t } = useTranslation();

  const isChannelSubscription = useMemo(
    () => chat! && isChatSubscription(chat),
    [chat]
  );
  const isChannelCourse = useMemo(() => chat! && isChatCourse(chat), [chat]);
  const isAdult = useMemo(() => chat! && isChatAdult(chat), [chat]);
  const title = chat! && getChatTitle(t, chat as ApiChat);

  const handleClickChat = useLastCallback(() => {
    if (is_active) {
      openChat({ id: `-${peer_id}` });
      onSelectChatMenu();
    }
  });

  const handleLeaveChannel = useLastCallback(() => {
    selectSubscription({ id: `-${peer_id}`, isActive: is_active || false });
  });

  return (
    <ListItem
      className='chat-item-clickable subscriptions-item underline'
      onClick={handleClickChat}
      isStatic={!is_active}
      ripple
      secondaryIcon='filled'
      contextActions={
        is_active
          ? [
              {
                title: t('Channel.CancelSubscription'),
                icon: 'close-outline',
                handler: handleLeaveChannel,
              },
            ]
          : [
              {
                title: t('Channel.Subscribe'),
                icon: 'fly-subscribe',
                handler: handleLeaveChannel,
              },
            ]
      }
    >
      <div className='status'>
        <Avatar peer={chat} />
      </div>
      <div className='info'>
        <div className='info-row'>
          <div
            className={classNames('type', is_active ? 'active' : 'cancelled')}
          >
            <span className='icon-svg'>
              <IconSvg name={is_active ? 'check' : 'close'} w='10' h='10' />
            </span>
            <span className='text'>{is_active ? 'active' : 'Cancelling'}</span>
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
              {title!}
            </h3>
          </div>
        </div>
        <div className='subtitle'>
          <span className='amount'>
            <span className='text-secondary'>Price:</span>
            <span className='price'>
              <IconSvg name='dollar' w='14' h='14' />
              {getMoneyFormat(amount, 2, 2) ?? 0}
            </span>
          </span>
          {expire_at && (
            <span>
              <span className='text-secondary'>Renews:</span>{' '}
              {formatDateToString(Number(expire_at) * 1000)}
            </span>
          )}
        </div>
      </div>
    </ListItem>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { item: { peer_id } }): StateProps => {
    const chat = selectChat(global, `-${peer_id}`);
    if (!chat) {
      return {};
    }
    return {
      chat,
    };
  })(SettingsSubscriptionsItem)
);
