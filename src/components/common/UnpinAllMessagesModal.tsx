import type { FC } from 'react';
import React, { memo } from 'react';

import useLang from '../../hooks/useLang';

import Modal from '../ui/Modal';
import Button from '../ui/Button';

export type OwnProps = {
  isOpen: boolean;
  chatId?: string;
  pinnedMessagesCount?: number;
  onClose: () => void;
  onUnpin: () => void;
};

const UnpinAllMessagesModal: FC<OwnProps> = ({
  isOpen,
  pinnedMessagesCount = 0,
  onClose,
  onUnpin,
}) => {
  const lang = useLang();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className='unpin-all'
      title={lang('Chat.PanelUnpinAllMessages')}
    >
      <p>
        {lang('Chat.UnpinAllMessagesConfirmation', pinnedMessagesCount, 'i')}
      </p>
      <div className='dialog-buttons mt-2'>
        <Button className='confirm-dialog-button' isText onClick={onUnpin}>
          {lang('DialogUnpin')}
        </Button>
        <Button className='confirm-dialog-button' isText onClick={onClose}>
          {lang('Cancel')}
        </Button>
      </div>
    </Modal>
  );
};

export default memo(UnpinAllMessagesModal);
