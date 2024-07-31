import React, { FC, memo } from 'react';

import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';
import useLastCallback from '../../hooks/useLastCallback';

export type OwnProps = {
  isOpen: boolean;
  onClose: () => void;
  confirmHandler: () => void;
  deleteHandler: () => void;
};

const UploadProfilePhotoModal: FC<OwnProps> = ({
  isOpen,
  onClose,
  confirmHandler,
  deleteHandler,
}) => {
  const { t } = useTranslation();

  const handleConfirm = useLastCallback(() => {
    confirmHandler();
    onClose();
  });

  const handleDelete = useLastCallback(() => {
    deleteHandler();
    onClose();
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hasCloseButton
      onEnter={handleConfirm}
      className='delete'
      centered
      title={t('Settings.SetProfilePhoto')}
    >
      <div className='modal-content'>
        <p>{t('AreYouSureDeleteThisPhoto')}</p>
        <div className='dialog-buttons'>
          <Button onClick={handleConfirm}>{t('Upload')}</Button>
          <Button color='danger' onClick={handleDelete}>
            {t('Delete')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(UploadProfilePhotoModal);
