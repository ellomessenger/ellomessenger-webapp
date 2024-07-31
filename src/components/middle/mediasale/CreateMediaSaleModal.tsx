import React, { FC } from 'react';
import Modal from '../../ui/Modal';
import { useTranslation } from 'react-i18next';
import Button from '../../ui/Button';

export type OwnProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateMediaSaleModal: FC<OwnProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  return (
    <Modal isOpen={isOpen} isSlim centered onClose={onClose} hasCloseButton>
      <div className='modal-content'>
        <div className='text-center'>
          <h3>{t('Channel.CreateMediaSale')}</h3>
          <p>{t('Channel.CreateMediaSaleInfo')}</p>
        </div>
        <div className='dialog-buttons-column'>
          <Button fullWidth>{t('Channel.Create')}</Button>
          <Button color='blue' fullWidth>
            {t('Channel.CreateCourse')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateMediaSaleModal;
