import React, { FC, useCallback, memo } from 'react';
import { getActions, withGlobal } from '../../global';

import type { ApiChat } from '../../api/types';

import { selectCurrentChat, selectUser } from '../../global/selectors';
import { getUserFirstOrLastName } from '../../global/helpers';
import renderText from '../common/helpers/renderText';

import ConfirmDialog from '../ui/ConfirmDialog';
import { useTranslation } from 'react-i18next';

export type OwnProps = {
  isOpen: boolean;
  userId?: string;
  isChannel?: boolean;
  onClose: () => void;
};

type StateProps = {
  chat?: ApiChat;
  contactName?: string;
};

const DeleteMemberModal: FC<OwnProps & StateProps> = ({
  isOpen,
  chat,
  userId,
  contactName,
  isChannel,
  onClose,
}) => {
  const { deleteChatMember } = getActions();

  const { t } = useTranslation();

  const handleDeleteChatMember = useCallback(() => {
    deleteChatMember({ chatId: chat!.id, userId: userId! });
    onClose();
  }, [chat, deleteChatMember, onClose, userId]);

  if (!chat || !userId) {
    return null;
  }

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      title={t('Channel.BlockUser')}
      textParts={renderText(
        t(`${isChannel ? 'Channel' : 'Group'}.PeerRemove`, { contactName })
      )}
      confirmLabel={t('Remove')}
      confirmHandler={handleDeleteChatMember}
      confirmIsDestructive
    />
  );
};

export default memo(
  withGlobal<OwnProps>((global, { userId }): StateProps => {
    const chat = selectCurrentChat(global);
    const user = userId && selectUser(global, userId);
    const contactName = user ? getUserFirstOrLastName(user) : undefined;

    return {
      chat,
      contactName,
    };
  })(DeleteMemberModal)
);
