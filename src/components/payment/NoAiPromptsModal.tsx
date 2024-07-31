import React, { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import Modal from '../ui/Modal';
import Button from '../ui/Button';

import { getActions } from '../../global';
import useLastCallback from '../../hooks/useLastCallback';
import { MiddleColumnContent } from '../../types';
import IconSvg from '../ui/IconSvg';
import { AiState } from '../../global/types';

export type OwnProps = {
  isOpen: boolean;
  aiState: AiState;
  onClose: () => void;
  onCloseAnimationEnd?: () => void;
};

const NoAiPromptsModal: FC<OwnProps> = ({ isOpen, onClose, aiState }) => {
  const { t } = useTranslation();
  const { setMiddleScreen } = getActions();

  const handlePaymentAi = useLastCallback(() => {
    setMiddleScreen({ screen: MiddleColumnContent.PaymentAi });
    onClose();
  });

  return (
    <Modal
      isOpen={isOpen}
      className='confirm payment-confirm'
      onClose={onClose}
      centered
      hasCloseButton
    >
      <div className='modal-content'>
        <div className='logo-wrap'>
          <IconSvg name='ai-bot' w='74' h='74' />
        </div>
        <p>
          {aiState === AiState.text
            ? 'There are no more complimentary Al chat prompts available. Please purchase an Al text pack.'
            : 'There are no more complimentary Al image prompts available. Please purchase an Al image pack.'}
        </p>

        <div className='dialog-buttons'>
          <Button onClick={handlePaymentAi}>{t('Settings.Purchases')}</Button>
          <Button outline onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NoAiPromptsModal;
