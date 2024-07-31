import React, { FC, memo, useCallback, useEffect, useState } from 'react';

import { CallGroup } from './CallGroup';
import { getActions, withGlobal } from '../../../global';
import Button from '../../ui/Button';
import { useTranslation } from 'react-i18next';
import { ApiMessage } from '../../../api/types';
import { selectMessagesWithCall } from '../../../global/selectors';
import CallListItem from './CallListItem';

import './CallsSidebarMain.scss';
import IconSvg from '../../ui/IconSvg';
import ConfirmDialog from '../../ui/ConfirmDialog';
import useFlag from '../../../hooks/useFlag';

interface OwnProps {
  handleCalls: (value: string) => void;
  openCall: string;
}

type StateProps = {
  messages?: ApiMessage[] | undefined;
};

const CallsSidebarMain: FC<OwnProps & StateProps> = ({
  handleCalls,
  openCall,
  messages,
}) => {
  const { deleteMessagesOutChat } = getActions();
  const { t } = useTranslation();
  const [missed, setMissed] = useState(false);
  const [currentMessages, setCurrentMessages] = useState(messages);
  const [isOpenModal, openDeleteModal, closeDeleteModal] = useFlag();

  const handleDeleteAll = useCallback(() => {
    const messageIds = messages?.map(({ id }) => id);
    if (messageIds) deleteMessagesOutChat({ messageIds });
    closeDeleteModal();
  }, [messages]);

  useEffect(() => {
    let items: ApiMessage[] | undefined = [];
    if (missed) {
      items = messages?.filter(
        (el) =>
          el.content.action?.phoneCall?.reason === 'missed' &&
          !el.content.action.phoneCall.isOutgoing
      );
    } else {
      items = messages;
    }
    setCurrentMessages(items);
  }, [missed, messages]);

  return (
    <div className='calls-wrap'>
      {openCall === 'group' ? <CallGroup handleCalls={handleCalls} /> : null}
      <div className='left-header'>
        <div className='btn-group tab-nav'>
          <Button
            isText
            className={!missed ? 'active' : ''}
            onClick={() => setMissed(false)}
          >
            {t('Call.All')}
          </Button>

          <Button
            isText
            className={missed ? 'active' : ''}
            onClick={() => setMissed(true)}
          >
            {t('Call.Missed')}
          </Button>
        </div>
        <Button
          color='translucent'
          className='destructive'
          round
          onClick={openDeleteModal}
          ariaLabel={t('Delete All')}
        >
          <i className='icon-svg'>
            <IconSvg name='delete' />
          </i>
        </Button>
      </div>

      <div className='chat-list custom-scroll'>
        {currentMessages &&
          currentMessages.map((message) => <CallListItem message={message} />)}
      </div>
      <ConfirmDialog
        isOpen={isOpenModal}
        title='Delete call history'
        text='Are you sure you want to delete your call history?'
        onClose={closeDeleteModal}
        confirmHandler={handleDeleteAll}
        confirmLabel={t('Delete')}
      />
    </div>
  );
};
export default memo(
  withGlobal((global): StateProps => {
    const messages = selectMessagesWithCall(global);

    return {
      messages,
    };
  })(CallsSidebarMain)
);
