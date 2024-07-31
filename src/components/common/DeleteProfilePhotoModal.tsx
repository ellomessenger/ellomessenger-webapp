import React, { FC, useCallback, memo } from 'react';
import { getActions } from '../../global';

import type { ApiPhoto } from '../../api/types';

import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { isUserId } from '../../global/helpers';
import { useTranslation } from 'react-i18next';

export type OwnProps = {
  isOpen: boolean;
  photo: ApiPhoto;
  profileId: string;
  onConfirm?: NoneToVoidFunction;
  onClose: NoneToVoidFunction;
};

const DeleteProfilePhotoModal: FC<OwnProps> = ({
  isOpen,
  photo,
  profileId,
  onClose,
  onConfirm,
}) => {
  const { deleteProfilePhoto, deleteChatPhoto } = getActions();
  const { t } = useTranslation();

  const handleDeletePhoto = useCallback(() => {
    onConfirm?.();
    if (isUserId(profileId)) {
      deleteProfilePhoto({ photo });
    } else {
      deleteChatPhoto({
        photo,
        chatId: profileId,
      });
    }
    onClose();
  }, [
    onConfirm,
    profileId,
    onClose,
    deleteProfilePhoto,
    photo,
    deleteChatPhoto,
  ]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hasCloseButton
      centered
      onEnter={handleDeletePhoto}
      className='delete'
      title={t('DeletePhoto')}
    >
      <div className='modal-content'>
        <p>{t('AreYouSureDeleteThisPhoto')}</p>
        <div className='dialog-buttons'>
          <Button color='danger' onClick={handleDeletePhoto}>
            {t('Delete')}
          </Button>
          <Button outline onClick={onClose}>
            {t('Cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(DeleteProfilePhotoModal);
