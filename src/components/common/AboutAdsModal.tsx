import React, { FC, memo } from 'react';

import renderText from './helpers/renderText';
import { useTranslation } from 'react-i18next';

import Modal from '../ui/Modal';
import Button from '../ui/Button';
import SafeLink from './SafeLink';

export type OwnProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AboutAdsModal: FC<OwnProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hasCloseButton
      title={String(t('SponsoredMessageInfo'))}
    >
      <p>{renderText(String(t('SponsoredMessageInfoDescription1')), ['br'])}</p>
      <p>{renderText(String(t('SponsoredMessageInfoDescription2')), ['br'])}</p>
      <p>{renderText(String(t('SponsoredMessageInfoDescription3')), ['br'])}</p>
      <p>
        <SafeLink
          url={String(t('SponsoredMessageAlertLearnMoreUrl'))}
          text={t('SponsoredMessageAlertLearnMoreUrl')}
        />
      </p>
      <p>{renderText(String(t('SponsoredMessageInfoDescription4')), ['br'])}</p>
      <div className='dialog-buttons mt-2'>
        <Button className='confirm-dialog-button' isText onClick={onClose}>
          {t('Close')}
        </Button>
      </div>
    </Modal>
  );
};

export default memo(AboutAdsModal);
