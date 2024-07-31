import React, { FC, memo, useCallback, useEffect } from 'react';
import { getActions } from '../../global';

import type { TabState } from '../../global/types';

import useFlag from '../../hooks/useFlag';

import RecipientPicker from '../common/RecipientPicker';
import { useTranslation } from 'react-i18next';

export type OwnProps = {
  requestedDraft?: TabState['requestedDraft'];
};

const DraftRecipientPicker: FC<OwnProps> = ({ requestedDraft }) => {
  const isOpen = Boolean(requestedDraft && !requestedDraft.chatId);
  const { openChatWithDraft, resetOpenChatWithDraft } = getActions();

  const { t } = useTranslation();

  const [isShown, markIsShown, unmarkIsShown] = useFlag();
  useEffect(() => {
    if (isOpen) {
      markIsShown();
    }
  }, [isOpen, markIsShown]);

  const handleSelectRecipient = useCallback(
    (recipientId: string, threadId?: number) => {
      openChatWithDraft({
        chatId: recipientId,
        threadId,
        text: requestedDraft!.text,
        files: requestedDraft!.files,
      });
    },
    [openChatWithDraft, requestedDraft]
  );

  const handleClose = useCallback(() => {
    resetOpenChatWithDraft();
  }, [resetOpenChatWithDraft]);

  if (!isOpen && !isShown) {
    return undefined;
  }

  return (
    <RecipientPicker
      isOpen={isOpen}
      searchPlaceholder={t('ForwardTo')}
      onSelectRecipient={handleSelectRecipient}
      onClose={handleClose}
      onCloseAnimationEnd={unmarkIsShown}
    />
  );
};

export default memo(DraftRecipientPicker);
