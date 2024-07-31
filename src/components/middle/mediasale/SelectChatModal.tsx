import React, { FC } from 'react';
import Modal from '../../ui/Modal';
import { useTranslation } from 'react-i18next';
import Button from '../../ui/Button';

export type OwnProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SelectChatModal: FC<OwnProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hasCloseButton
      className='confirm'
      title={String(t('ChoseGroup'))}
    >
      <div className='modal-content'>
        <div className='section mb-3'>
          <div className='ListItem chat-item-clickable scroll-item no-selection'>
            <div className='ListItem-button' role='button'>
              <div className='ChatInfo'>
                <div className='Avatar size-medium color-bg-1'>
                  <img
                    src='blob:http://localhost:1234/93ce63ac-bde2-44e6-89f8-64729a06fce8'
                    className='Avatar__media avatar-media'
                    alt='Auto club'
                    decoding='async'
                  />
                </div>
                <div className='info'>
                  <div className='title FullNameTitle-module__root'>
                    <h3 dir='auto' className='fullName'>
                      Auto club
                    </h3>
                  </div>
                  <span className='status'>
                    <span className='group-status'>2 members</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Button fullWidth onClick={() => true}>
          {t('Confirm')}
        </Button>
      </div>
    </Modal>
  );
};
export default SelectChatModal;
