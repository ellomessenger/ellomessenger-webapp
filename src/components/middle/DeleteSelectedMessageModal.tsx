import type { FC } from 'react';
import React, { useCallback, memo, useEffect } from 'react';
import { getActions, withGlobal } from '../../global';

import {
  selectCanDeleteSelectedMessages,
  selectCurrentChat,
  selectTabState,
  selectUser,
} from '../../global/selectors';
import {
  isUserId,
  getUserFirstOrLastName,
  getPrivateChatUserId,
  isChatBasicGroup,
  isChatSuperGroup,
} from '../../global/helpers';
import renderText from '../common/helpers/renderText';
import usePrevious from '../../hooks/usePrevious';

import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';

export type OwnProps = {
  isOpen: boolean;
  isSchedule: boolean;
  onClose: () => void;
};

type StateProps = {
  selectedMessageIds?: number[];
  canDeleteForAll?: boolean;
  contactName?: string;
  willDeleteForCurrentUserOnly?: boolean;
  willDeleteForAll?: boolean;
};

const DeleteSelectedMessageModal: FC<OwnProps & StateProps> = ({
  isOpen,
  isSchedule,
  selectedMessageIds,
  canDeleteForAll,
  contactName,
  willDeleteForCurrentUserOnly,
  willDeleteForAll,
  onClose,
}) => {
  const { deleteMessages, deleteScheduledMessages, exitMessageSelectMode } =
    getActions();

  const prevIsOpen = usePrevious(isOpen);

  const handleDeleteMessageForAll = useCallback(() => {
    onClose();
    deleteMessages({
      messageIds: selectedMessageIds!,
      shouldDeleteForAll: true,
    });
  }, [deleteMessages, selectedMessageIds, onClose]);

  const handleDeleteMessageForSelf = useCallback(() => {
    if (isSchedule) {
      deleteScheduledMessages({ messageIds: selectedMessageIds! });
    } else {
      deleteMessages({
        messageIds: selectedMessageIds!,
        shouldDeleteForAll: false,
      });
    }

    onClose();
  }, [
    isSchedule,
    onClose,
    deleteScheduledMessages,
    selectedMessageIds,
    deleteMessages,
  ]);

  const { t } = useTranslation();

  // Returning `undefined` from FC instead of `<Modal>` doesn't trigger useHistoryBack
  useEffect(() => {
    if (!isOpen && prevIsOpen) {
      exitMessageSelectMode();
    }
  }, [exitMessageSelectMode, isOpen, prevIsOpen]);

  if (!selectedMessageIds) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hasCloseButton
      onEnter={canDeleteForAll ? undefined : handleDeleteMessageForSelf}
      className='delete'
      title={t('DeleteManyMessages')}
    >
      <div className='modal-content'>
        <p>{t('AreYouSureDeleteFewMessages')}</p>
        {willDeleteForCurrentUserOnly && (
          <p>
            This will delete them just for you, not for other participants in
            the chat.
          </p>
        )}
        {willDeleteForAll && (
          <p>This will delete them for everyone in this chat.</p>
        )}
        <div className='dialog-buttons'>
          {canDeleteForAll && (
            <Button color='danger' onClick={handleDeleteMessageForAll}>
              {contactName &&
                renderText(String(t('DeleteMessagesFor', { contactName })))}
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
  withGlobal<OwnProps>((global, { isSchedule }): StateProps => {
    const { messageIds: selectedMessageIds } =
      selectTabState(global).selectedMessages || {};
    const { canDeleteForAll } = selectCanDeleteSelectedMessages(global);
    const chat = selectCurrentChat(global);
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
      selectedMessageIds,
      canDeleteForAll: !isSchedule && canDeleteForAll,
      contactName,
      willDeleteForCurrentUserOnly,
      willDeleteForAll,
    };
  })(DeleteSelectedMessageModal)
);
