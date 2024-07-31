import React, { FC, memo, useCallback } from 'react';
import ListItem from '../../ui/ListItem';
import { getActions, withGlobal } from '../../../global';
import { ApiMessage, ApiUser } from '../../../api/types';
import useAppLayout from '../../../hooks/useAppLayout';
import Avatar from '../../common/Avatar';
import FullNameTitle from '../../common/FullNameTitle';
import { selectUser } from '../../../global/selectors';
import { getMessageContent } from '../../../global/helpers';
import classNames from 'classnames';
import IconSvg from '../../ui/IconSvg';
import { formatPastTime, formatPastTimeShort } from '../../../util/dateFormat';
import { useTranslation } from 'react-i18next';
import Button from '../../ui/Button';

import ConfirmDialog from '../../ui/ConfirmDialog';
import useFlag from '../../../hooks/useFlag';

type OwnProps = {
  message: ApiMessage;
};

type StateProps = {
  user: ApiUser;
};

const CallListItem: FC<OwnProps & StateProps> = ({ user, message }) => {
  const { requestMasterAndRequestCall, deleteMessagesOutChat, openChat } =
    getActions();
  const { isMobile } = useAppLayout();
  const { t } = useTranslation();
  const [isOpenModal, openDeleteModal, closeDeleteModal] = useFlag();
  const { action } = getMessageContent(message);
  const { isOutgoing, isVideo, reason } = action?.phoneCall || {};
  const isMissed = reason === 'missed';

  const handleCall = useCallback(() => {
    requestMasterAndRequestCall({ isVideo, userId: user.id });
  }, [user, isVideo, requestMasterAndRequestCall]);

  const handleDelCall = useCallback(() => {
    const messageIds = [message.id];
    deleteMessagesOutChat({ messageIds });
    closeDeleteModal();
  }, [message]);

  const handleClick = useCallback(() => {
    openChat(
      { id: message.chatId, shouldReplaceHistory: true },
      { forceOnHeavyAnimation: true }
    );
  }, [message]);

  return (
    <>
      <ListItem
        className='chat-item-clickable'
        onClick={handleClick}
        ripple={!isMobile}
        rightElement={
          <Button
            size='smaller'
            color='translucent'
            round
            className='activated'
            onClick={handleCall}
            ariaLabel={t(isOutgoing ? 'Call.Again' : 'Call.Back')}
          >
            <i className='icon-svg'>
              <IconSvg name={isVideo ? 'video-call' : 'phone'} />
            </i>
          </Button>
        }
        contextActions={[
          {
            title: t('Call.Delete'),
            icon: 'broom',
            destructive: true,
            handler: openDeleteModal,
          },
        ]}
      >
        <div className='ChatInfo'>
          <Avatar size='medium' peer={user} />
          <div className='info'>
            <div className='info-name-title'>
              <FullNameTitle peer={user} withEmojiStatus />
            </div>
            <span className='status' dir='auto'>
              <i
                className={classNames('icon-svg', {
                  missed: isMissed,
                  incoming: !isOutgoing,
                })}
              >
                <IconSvg name='rotate-arrow' />
              </i>
              <span>{formatPastTime(t, message.date * 1000)} </span>
            </span>
          </div>
        </div>
      </ListItem>
      <ConfirmDialog
        isOpen={isOpenModal}
        title='Delete call'
        text='Are you sure you want to delete your call?'
        onClose={closeDeleteModal}
        confirmHandler={handleDelCall}
        confirmLabel={t('Delete')}
      />
    </>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { message }): StateProps => {
    const user = selectUser(global, message.chatId)!;

    return {
      user,
    };
  })(CallListItem)
);
