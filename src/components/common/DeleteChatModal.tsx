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
  getChatTitle,
} from '../../global/helpers';
import renderText from './helpers/renderText';

import Avatar from './Avatar';
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
  isChatWithSelf?: boolean;
  isBot?: boolean;
  isPrivateChat: boolean;
  isBasicGroup: boolean;
  isSuperGroup: boolean;
  currentUserId: string | undefined;
  canDeleteForAll?: boolean;
  contactName?: string;
  animationLevel: AnimationLevel;
};

const DeleteChatModal: FC<OwnProps & StateProps> = ({
  isOpen,
  chat,
  isChannel,
  isPrivateChat,
  isChatWithSelf,
  isBot,
  isBasicGroup,
  isSuperGroup,
  currentUserId,
  canDeleteForAll,
  contactName,
  animationLevel,
  onClose,
  onCloseAnimationEnd,
}) => {
  const {
    leaveChannel,
    deleteHistory,
    deleteChannel,
    deleteChatUser,
    blockContact,
  } = getActions();

  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir(i18n.language) === 'rtl';
  const chatTitle = getChatTitle(t, chat);

  const handleDeleteForAll = useCallback(() => {
    deleteHistory({ chatId: chat.id, shouldDeleteForAll: true });
    onClose();
  }, [deleteHistory, chat.id, onClose]);

  const handleDeleteAndStop = useCallback(() => {
    deleteHistory({ chatId: chat.id, shouldDeleteForAll: true });
    //blockContact({ contactId: chat.id, accessHash: chat.accessHash! });

    onClose();
  }, [deleteHistory, chat.id, chat.accessHash, blockContact, onClose]);

  const handleDeleteChat = useCallback(() => {
    if (isPrivateChat) {
      deleteHistory({ chatId: chat.id, shouldDeleteForAll: false });
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

  const handleLeaveChat = useCallback(() => {
    if (isChannel || isSuperGroup) {
      leaveChannel({ chatId: chat.id });
      onClose();
    } else {
      handleDeleteChat();
    }
  }, [
    chat.id,
    handleDeleteChat,
    isChannel,
    isSuperGroup,
    leaveChannel,
    onClose,
  ]);

  function renderHeader() {
    return (
      <>
        <Avatar
          size='medium'
          peer={chat}
          isSavedMessages={isChatWithSelf}
          withVideo
          className='mb-3'
        />
        <h3>{t(renderTitle())}</h3>
      </>
    );
  }

  function renderTitle() {
    if (isChannel && !chat.isCreator) {
      return 'Channel.LeaveThe';
    }

    if (isChannel && chat.isCreator) {
      return 'Channel.Delete';
    }

    if (isSuperGroup && !chat.isCreator) {
      return 'Group.Leave';
    }

    if (isSuperGroup && chat.isCreator) {
      return 'Group.Delete';
    }

    return 'DeleteChat';
  }

  function renderContent() {
    if (isChannel && chat.isCreator) {
      return (
        <>
          {renderText(t('Channel.DeleteConfirmation', { chatTitle }), [
            'simple_markdown',
            'emoji',
          ])}
        </>
      );
    }

    if (isChannel && !chat.isCreator) {
      return (
        <>
          {renderText(t('Channel.UnsubscribeConfirmation', { chatTitle }), [
            'simple_markdown',
            'emoji',
          ])}
        </>
      );
    }

    if (isSuperGroup && chat.isCreator) {
      return (
        <>
          {renderText(t('Group.DeleteConfirmation', { chatTitle }), [
            'simple_markdown',
            'emoji',
          ])}
        </>
      );
    }

    if (isSuperGroup && !chat.isCreator) {
      return (
        <>
          {renderText(t('Group.LeaveConfirmation'), [
            'simple_markdown',
            'emoji',
          ])}
        </>
      );
    }

    return (
      <>
        {renderText(t('ChatList.DeleteChatConfirmation', { contactName }), [
          'simple_markdown',
          'emoji',
        ])}
      </>
    );
  }

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

    return canDeleteForAll ? 'ChatList.DeleteForCurrentUser' : 'Delete';
  }

  return (
    <Modal
      isOpen={isOpen}
      hasCloseButton
      className='delete'
      title={chatTitle}
      onClose={onClose}
      onCloseAnimationEnd={onCloseAnimationEnd}
    >
      <div className='modal-content'>
        <div className='d-flex column align-center'>
          {renderHeader()}
          <p className='text-center'>{renderContent()}</p>
        </div>

        <div className='dialog-buttons'>
          {isBot && (
            <Button color='danger' onClick={handleDeleteAndStop}>
              {t('Chat.DeleteAndStop')}
            </Button>
          )}
          {canDeleteForAll && contactName && (
            <Button color='danger' onClick={handleDeleteForAll}>
              {renderText(t('DeleteMessagesFor', { contactName }))}
            </Button>
          )}
          {/* {!isPrivateChat && chat.isCreator && (
            <Button color='danger' onClick={handleDeleteChat}>
              {t('DeleteForAll')}
            </Button>
          )} */}
          <Button
            color='danger'
            onClick={
              isPrivateChat || isChannel ? handleDeleteChat : handleLeaveChat
            }
          >
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
    const isPrivateChat = Boolean(isUserId(chat.id));
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
      isChatWithSelf,
      isBot,
      isChannel: isChatChannel(chat)!,
      isBasicGroup: isChatBasicGroup(chat),
      isSuperGroup: isChatSuperGroup(chat),
      currentUserId: global.currentUserId,
      canDeleteForAll,
      contactName,
      animationLevel: global.settings.byKey.animationLevel,
    };
  })(DeleteChatModal)
);
