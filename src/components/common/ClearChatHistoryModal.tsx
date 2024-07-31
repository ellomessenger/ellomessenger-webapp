import React, { FC, useCallback, memo } from 'react';
import { getActions, withGlobal } from '../../global';

import type { ApiChat } from '../../api/types';
import type { AnimationLevel } from '../../types';

import { selectIsChatWithSelf, selectUser } from '../../global/selectors';
import {
  isUserId,
  isUserBot,
  getUserFirstOrLastName,
  getPrivateChatUserId,
  isChatBasicGroup,
  isChatSuperGroup,
  isChatChannel,
} from '../../global/helpers';
import renderText from './helpers/renderText';

import Modal from '../ui/Modal';
import Button from '../ui/Button';

import './DeleteChatModal.scss';
import { useTranslation } from 'react-i18next';

export type OwnProps = {
  isOpen: boolean;
  chat: ApiChat;
  onClose: () => void;
  onCloseAnimationEnd?: () => void;
};

type StateProps = {
  isChannel: boolean;
  isPrivateChat: boolean;
  isBasicGroup: boolean;
  isSuperGroup: boolean;
  currentUserId: string | undefined;
  canDeleteForAll?: boolean;
  contactName?: string;
  animationLevel: AnimationLevel;
};

const ClearChatHistoryModal: FC<OwnProps & StateProps> = ({
  isOpen,
  chat,
  isChannel,
  isPrivateChat,
  isBasicGroup,
  isSuperGroup,
  currentUserId,
  canDeleteForAll,
  contactName,
  onClose,
  onCloseAnimationEnd,
}) => {
  const { leaveChannel, deleteHistory, deleteChannel, deleteChatUser } =
    getActions();

  const { t } = useTranslation();

  const handleClearForAll = useCallback(() => {
    deleteHistory({ chatId: chat.id, shouldDeleteForAll: true, isClear: true });
    onClose();
  }, [deleteHistory, chat.id, onClose]);

  const handleClearChat = useCallback(() => {
    if (isPrivateChat) {
      deleteHistory({
        chatId: chat.id,
        shouldDeleteForAll: false,
        isClear: true,
      });
    } else if (isBasicGroup) {
      deleteChatUser({ chatId: chat.id, userId: currentUserId! });
      deleteHistory({ chatId: chat.id, shouldDeleteForAll: false });
    } else if ((isChannel || isSuperGroup) && !chat.isCreator) {
      leaveChannel({ chatId: chat.id });
    } else if ((isChannel || isSuperGroup) && chat.isCreator) {
      deleteChannel({ chatId: chat.id });
    }
    onClose();
  }, [
    isPrivateChat,
    isBasicGroup,
    isChannel,
    isSuperGroup,
    currentUserId,
    chat.isCreator,
    chat.id,
    onClose,
    deleteHistory,
    deleteChatUser,
    leaveChannel,
    deleteChannel,
  ]);

  function renderActionText() {
    if (isChannel && !chat.isCreator) {
      return 'Channel.Leave';
    }
    if (isChannel && chat.isCreator) {
      return 'Channel.Delete';
    }

    if (isBasicGroup || isSuperGroup) {
      return 'Group.Leave';
    }

    return canDeleteForAll ? 'ChatList.ClearForCurrentUser' : 'Clear';
  }

  return (
    <Modal
      isOpen={isOpen}
      hasCloseButton
      className='delete'
      title={t('Chat.ClearHistory')}
      onClose={onClose}
      onCloseAnimationEnd={onCloseAnimationEnd}
    >
      <div className='modal-content'>
        <div className='d-flex column align-center'>
          <p className='text-center'>
            {t('Chat.ClearHistoryText', { title: chat?.title })}
          </p>
        </div>

        <div className='dialog-buttons'>
          {canDeleteForAll && contactName && (
            <Button color='danger' onClick={handleClearForAll}>
              {renderText(t('ClearMessagesFor', { contactName }))}
            </Button>
          )}
          <Button color='danger' onClick={handleClearChat}>
            {t(renderActionText())}
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
  withGlobal<OwnProps>((global, { chat }): StateProps => {
    const isPrivateChat = Boolean(isUserId(chat.id)!);
    const isChatWithSelf = selectIsChatWithSelf(global, chat.id);
    const user =
      isPrivateChat && selectUser(global, getPrivateChatUserId(chat)!);
    const isBot = user && isUserBot(user) && !chat.isSupport;
    const canDeleteForAll = isPrivateChat && !isChatWithSelf && !isBot;
    const contactName = isPrivateChat
      ? getUserFirstOrLastName(selectUser(global, getPrivateChatUserId(chat)!))
      : undefined;

    return {
      isPrivateChat,
      isChannel: isChatChannel(chat)!,
      isBasicGroup: isChatBasicGroup(chat)!,
      isSuperGroup: isChatSuperGroup(chat)!,
      currentUserId: global.currentUserId,
      canDeleteForAll,
      contactName,
      animationLevel: global.settings.byKey.animationLevel,
    };
  })(ClearChatHistoryModal)
);
