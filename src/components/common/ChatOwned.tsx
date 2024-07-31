import React, { FC, memo, useCallback, useMemo } from 'react';
import ListItem from '../ui/ListItem';

import Avatar from './Avatar';
import { ApiChat } from '../../api/types';
import { withGlobal } from '../../global';
import { selectChat } from '../../global/selectors';
import FullNameTitle from './FullNameTitle';
import { isChatPublic } from '../../global/helpers';
import { APP_LINK_PREFIX } from '../../config';
import Button from '../ui/Button';
import IconSvg from '../ui/IconSvg';

import './ChatOwned.scss';
import DeleteChatModal from './DeleteChatModal';
import useFlag from '../../hooks/useFlag';

type OwnProps = {
  chatId: string;
};

type StateProps = {
  chat?: ApiChat;
};

const ChatOwned: FC<OwnProps & StateProps> = ({ chatId, chat }) => {
  const [isDeleteModalOpen, openDeleteModal, closeDeleteModal] = useFlag();
  const [
    shouldRenderDeleteModal,
    markRenderDeleteModal,
    unmarkRenderDeleteModal,
  ] = useFlag();

  const handleDelete = useCallback(() => {
    markRenderDeleteModal();
    openDeleteModal();
  }, [markRenderDeleteModal, openDeleteModal]);

  if (!chat?.isCreator || (chat && !isChatPublic(chat))) return;

  const activeUsernames = useMemo(() => {
    const result = chat.usernames?.filter((u) => u.isActive);
    return result?.length ? result : undefined;
  }, [chat]);

  const link = useMemo(() => {
    return `${APP_LINK_PREFIX}${activeUsernames?.[0].username}`;
  }, [activeUsernames]);

  return (
    <div className='limit-list-item'>
      <Button round color='danger' onClick={handleDelete}>
        <i className='icon-svg'>
          <IconSvg name='close' w='14' h='14' />
        </i>
      </Button>
      <ListItem className='chat-item-clickable force-rounded-corners small-icon'>
        <div className='ChatInfo'>
          <Avatar size='medium' peer={chat} />
          <div className='info'>
            <FullNameTitle peer={chat} />
            <span className='status' dir='auto'>
              {link}
            </span>
          </div>
        </div>
      </ListItem>
      {shouldRenderDeleteModal && (
        <DeleteChatModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onCloseAnimationEnd={unmarkRenderDeleteModal}
          chat={chat}
        />
      )}
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId }): StateProps => {
    const chat = selectChat(global, chatId);

    return {
      chat,
    };
  })(ChatOwned)
);
