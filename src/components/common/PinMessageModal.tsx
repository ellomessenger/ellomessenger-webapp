import React, { FC, useCallback, memo } from 'react';
import { getActions, withGlobal } from '../../global';

import {
  selectChat,
  selectIsChatWithSelf,
  selectUser,
} from '../../global/selectors';
import {
  isUserId,
  getUserFirstOrLastName,
  getPrivateChatUserId,
  isChatBasicGroup,
  isChatSuperGroup,
  isChatChannel,
} from '../../global/helpers';

import renderText from './helpers/renderText';

import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';

export type OwnProps = {
  isOpen: boolean;
  chatId: string;
  messageId: number;
  onClose: () => void;
};

type StateProps = {
  isChannel: boolean;
  isPrivateChat: boolean;
  isChatWithSelf: boolean;
  isGroup: boolean;
  isSuperGroup: boolean;
  canPinForAll: boolean;
  contactName?: string;
};

const PinMessageModal: FC<OwnProps & StateProps> = ({
  isOpen,
  messageId,
  isChannel,
  isGroup,
  isSuperGroup,
  canPinForAll,
  contactName,
  onClose,
}) => {
  const { pinMessage } = getActions();

  const handlePinMessageForAll = useCallback(() => {
    pinMessage({
      messageId,
      isUnpin: false,
    });
    onClose();
  }, [pinMessage, messageId, onClose]);

  const handlePinMessage = useCallback(() => {
    pinMessage({
      messageId,
      isUnpin: false,
      isOneSide: true,
      isSilent: true,
    });
    onClose();
  }, [messageId, onClose, pinMessage]);

  const { t } = useTranslation();

  function renderMessage() {
    if (isChannel) {
      return t('PinMessageAlertChannel');
    }

    if (isGroup || isSuperGroup) {
      return t('PinMessageAlert');
    }

    return t('PinMessageAlertChat');
  }

  return (
    <Modal
      isOpen={isOpen}
      hasCloseButton
      onClose={onClose}
      className='pin'
      title={String(t('PinnedMessage'))}
    >
      <div className='modal-content'>
        <p>{renderMessage()}</p>
        <div className='dialog-buttons'>
          <Button onClick={handlePinMessage}>{t('Pin')}</Button>
          {canPinForAll && (
            <Button onClick={handlePinMessageForAll}>
              {contactName
                ? renderText(String(t('PinMessagesFor', { contactName })))
                : t('PinAndNotifyMembers')}
            </Button>
          )}
          <Button outline onClick={onClose}>
            {t('Cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId }): StateProps => {
    const isPrivateChat = Boolean(isUserId(chatId));
    const isChatWithSelf = selectIsChatWithSelf(global, chatId);
    const chat = selectChat(global, chatId);
    const isChannel = Boolean(chat && isChatChannel(chat));
    const isGroup = Boolean(chat) && isChatBasicGroup(chat);
    const isSuperGroup = Boolean(chat) && isChatSuperGroup(chat);
    const canPinForAll =
      (isPrivateChat && !isChatWithSelf) || isSuperGroup || isGroup;
    const contactName =
      chat && isUserId(chat.id)
        ? getUserFirstOrLastName(
            selectUser(global, getPrivateChatUserId(chat)!)
          )
        : undefined;

    return {
      isPrivateChat,
      isChatWithSelf,
      isChannel,
      isGroup,
      isSuperGroup,
      canPinForAll,
      contactName,
    };
  })(PinMessageModal)
);
