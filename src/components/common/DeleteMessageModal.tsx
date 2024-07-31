import React, { FC, useCallback, memo } from 'react';
import { getActions, withGlobal } from '../../global';

import type { ApiMessage } from '../../api/types';
import type { IAlbum } from '../../types';

import {
  selectAllowedMessageActions,
  selectChat,
  selectCurrentMessageList,
  selectUser,
} from '../../global/selectors';
import {
  isUserId,
  getUserFirstOrLastName,
  getPrivateChatUserId,
  isChatBasicGroup,
  isChatSuperGroup,
} from '../../global/helpers';
import renderText from './helpers/renderText';

import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';

export type OwnProps = {
  isOpen: boolean;
  isSchedule: boolean;
  message: ApiMessage;
  album?: IAlbum;
  onClose: NoneToVoidFunction;
  onConfirm?: NoneToVoidFunction;
};

type StateProps = {
  canDeleteForAll?: boolean;
  contactName?: string;
  willDeleteForCurrentUserOnly?: boolean;
  willDeleteForAll?: boolean;
};

const DeleteMessageModal: FC<OwnProps & StateProps> = ({
  isOpen,
  isSchedule,
  message,
  album,
  canDeleteForAll,
  contactName,
  willDeleteForCurrentUserOnly,
  willDeleteForAll,
  onConfirm,
  onClose,
}) => {
  const { deleteMessages, deleteScheduledMessages } = getActions();

  const handleDeleteMessageForAll = useCallback(() => {
    onConfirm?.();
    const messageIds = album?.messages
      ? album.messages.map(({ id }) => id)
      : [message.id];
    deleteMessages({ messageIds, shouldDeleteForAll: true });
    onClose();
  }, [onConfirm, album, message.id, deleteMessages, onClose]);

  const handleDeleteMessageForSelf = useCallback(() => {
    onConfirm?.();
    const messageIds = album?.messages
      ? album.messages.map(({ id }) => id)
      : [message.id];
    if (isSchedule) {
      deleteScheduledMessages({ messageIds });
    } else {
      deleteMessages({
        messageIds,
        shouldDeleteForAll: false,
      });
    }
    onClose();
  }, [
    onConfirm,
    album,
    message.id,
    isSchedule,
    onClose,
    deleteScheduledMessages,
    deleteMessages,
  ]);

  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hasCloseButton
      onEnter={
        isOpen && !canDeleteForAll ? handleDeleteMessageForSelf : undefined
      }
      className='delete'
      title={String(t('DeleteSingleMessagesTitle'))}
    >
      <div className='modal-content'>
        <p>{t('AreYouSureDeleteSingleMessage')}</p>
        {willDeleteForCurrentUserOnly && (
          <p>{t('lng_delete_for_me_chat_hint')}</p>
        )}
        <div className='dialog-buttons'>
          {canDeleteForAll && (
            <Button color='danger' onClick={handleDeleteMessageForAll}>
              {contactName &&
                renderText(String(t('DeleteMessagesFor', { contactName })))}
              {!contactName && t('DeleteMessagesForEveryone')}
            </Button>
          )}
          <Button color='danger' onClick={handleDeleteMessageForSelf}>
            {t(canDeleteForAll ? 'ChatList.DeleteForCurrentUser' : 'Delete')}
          </Button>
          <Button outline onClick={onClose}>
            {t('Cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { message, isSchedule }): StateProps => {
    const { threadId } = selectCurrentMessageList(global) || {};
    const { canDeleteForAll } =
      (threadId && selectAllowedMessageActions(global, message, threadId)) ||
      {};
    const chat = selectChat(global, message.chatId);
    const contactName =
      chat && isUserId(chat.id)
        ? getUserFirstOrLastName(
            selectUser(global, getPrivateChatUserId(chat)!)
          )
        : undefined;

    const willDeleteForCurrentUserOnly =
      chat && isChatBasicGroup(chat) && !canDeleteForAll;
    const willDeleteForAll = chat && isChatSuperGroup(chat);

    return {
      canDeleteForAll: !isSchedule && canDeleteForAll,
      contactName,
      willDeleteForCurrentUserOnly,
      willDeleteForAll,
    };
  })(DeleteMessageModal)
);
