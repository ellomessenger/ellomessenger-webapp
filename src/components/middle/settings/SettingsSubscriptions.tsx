import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import SettingsSubscriptionsItem from './SettingsSubscriptionsItem';
import DropdownMenu from '../../ui/DropdownMenu';
import MenuItem from '../../ui/MenuItem';
import IconSvg from '../../ui/IconSvg';
import Button from '../../ui/Button';
import classNames from 'classnames';
import { getActions, withGlobal } from '../../../global';
import { GlobalState, ISubsriptionItem } from '../../../global/types';
import { pick } from '../../../util/iteratees';
import { useTranslation } from 'react-i18next';
import ConfirmDialog from '../../ui/ConfirmDialog';
import useLastCallback from '../../../hooks/useLastCallback';

enum ETypeSubscription {
  all = 'AllChannels',
  current = 'MyCurrentSubscriptions',
  previous = 'MyPreviousSubscriptions',
}

type StateProps = Pick<GlobalState, 'subscriptionsList'>;
type OwnProps = {
  onSelectChatMenu: () => void;
};

const SettingsSubscriptions: FC<StateProps & OwnProps> = ({
  subscriptionsList,
  onSelectChatMenu,
}) => {
  const { getPaidSubscriptions, leaveChannel, joinChannel, openChat } =
    getActions();
  const { t } = useTranslation();
  const [type, setType] = useState(ETypeSubscription.all);
  const [selectChat, setSelectChat] = useState<{
    id: string;
    isActive: boolean;
  }>();

  const SelectButton: FC<{ onTrigger: () => void; isOpen?: boolean }> =
    useMemo(() => {
      return ({ onTrigger, isOpen }) => (
        <Button
          isText
          color='translucent'
          className={classNames('no-style', { active: isOpen })}
          onClick={onTrigger}
        >
          {t(`Channel.${type}`)}

          <i className='css-icon-down' />
        </Button>
      );
    }, [type]);

  const filteredList = subscriptionsList
    .filter((el) => {
      if (type === ETypeSubscription.current) {
        return el.is_active;
      } else if (type === ETypeSubscription.previous) {
        return !el.is_active;
      } else {
        return el;
      }
    })
    .sort((a) => (a.is_active ? -1 : 1));

  const handleLeaveChannel = useLastCallback(() => {
    if (selectChat) {
      if (selectChat.isActive) {
        leaveChannel({ chatId: selectChat.id });
      } else {
        openChat({ id: selectChat.id });
      }

      getPaidSubscriptions();
      setSelectChat(undefined);
    }
  });

  const handSubscribeChannel = useLastCallback(() => {
    if (selectChat) {
      getPaidSubscriptions();
      setSelectChat(undefined);
    }
  });

  useEffect(() => {
    getPaidSubscriptions();
  }, []);

  return (
    <div className='settings-container'>
      <div className='settings-subscriptions'>
        <div className='type-select'>
          <DropdownMenu trigger={SelectButton}>
            <MenuItem
              //customIcon={<IconSvg name='dollar' w='25' h='25' />}
              onClick={() => setType(ETypeSubscription.all)}
            >
              {t(`Channel.${ETypeSubscription.all}`)}
            </MenuItem>
            <MenuItem
              customIcon={<IconSvg name='channel' w='25' h='25' />}
              onClick={() => setType(ETypeSubscription.current)}
            >
              {t(`Channel.${ETypeSubscription.current}`)}
            </MenuItem>
            <MenuItem
              customIcon={<IconSvg name='subscription' w='25' h='25' />}
              onClick={() => setType(ETypeSubscription.previous)}
            >
              {t(`Channel.${ETypeSubscription.previous}`)}
            </MenuItem>
          </DropdownMenu>
        </div>

        <div className='subscriptions-list'>
          {filteredList.map((el) => (
            <SettingsSubscriptionsItem
              key={el.peer_id}
              item={el}
              onSelectChatMenu={onSelectChatMenu}
              selectSubscription={setSelectChat}
            />
          ))}
        </div>
      </div>
      <ConfirmDialog
        isOpen={Boolean(selectChat)}
        onClose={() => setSelectChat(undefined)}
        text={t(
          selectChat?.isActive
            ? 'Channel.UnsubscribeConfirmation'
            : 'Channel.SubscribeConfirmation'
        )}
        confirmLabel={t(selectChat?.isActive ? 'Channel.Leave' : 'Confirm')}
        confirmHandler={handleLeaveChannel}
        confirmIsDestructive
      />
    </div>
  );
};

export default memo(
  withGlobal((global): StateProps => pick(global, ['subscriptionsList']))(
    SettingsSubscriptions
  )
);
