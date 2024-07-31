import React, { FC, useCallback, useEffect } from 'react';
import Modal from '../../ui/Modal';
import { useTranslation } from 'react-i18next';
import Button from '../../ui/Button';
import IconSvg from '../../ui/IconSvg';
import ListItem from '../../ui/ListItem';
import QRCodeStyling from 'qr-code-styling';
import Logo from '../../../assets/panda-logo.png';
import { SettingsScreens } from '../../../types';

const QR_SIZE = 310;

const qrCode = new QRCodeStyling({
  width: QR_SIZE,
  height: QR_SIZE,
  margin: 5,
  type: 'svg',
  dotsOptions: {
    type: 'rounded',
  },
  cornersSquareOptions: {
    type: 'extra-rounded',
  },
  image: Logo,
  imageOptions: {
    imageSize: 0.5,
    margin: 5,
  },
  qrOptions: {
    errorCorrectionLevel: 'M',
  },
});

export type OwnProps = {
  isOpen: boolean;
  onClose: () => void;
  link: string;
  handleCopy: () => void;
  onScreenSelect?: (screen: SettingsScreens) => void;
};

const InvitationLinkModal: FC<OwnProps> = ({
  isOpen,
  onClose,
  link,
  handleCopy,
  onScreenSelect,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    qrCode.update({ data: link });
  }, [link]);

  const onDownloadClick = () => {
    qrCode.download({
      extension: 'jpeg',
    });
  };

  const goTo = useCallback(() => {
    onScreenSelect! && onScreenSelect(SettingsScreens.InvitationLink);
    onClose();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hasCloseButton
      className='confirm'
      title={String(t('Link.Invitation'))}
    >
      <div className='modal-content'>
        <i className='icon-svg'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='72'
            height='72'
            fill='none'
          >
            <rect width='72' height='72' fill='#D8E7FD' rx='36' />
            <path
              stroke='#0A49A5'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='3'
              d='M40.982 45.167H43.5c5.033 0 9.167-4.117 9.167-9.167 0-5.033-4.117-9.166-9.167-9.166h-2.517M31 26.834h-2.5c-5.05 0-9.166 4.116-9.166 9.166 0 5.033 4.117 9.167 9.167 9.167H31M29.334 36h13.333'
            />
          </svg>
        </i>
        <h3>{t('Link.Invitation')}</h3>
        <p className='mb-2'>{t('Invitation.Description')}</p>
        <ListItem
          className='text-trigger has-action smaller mb-3'
          ripple
          secondaryIcon='filled'
          contextActions={[
            {
              title: t('Invitation.GetQr'),
              icon: 'qr',
              handler: onDownloadClick,
            },
          ]}
        >
          <div className='contact-info'>{link}</div>
        </ListItem>
        <Button size='smaller' className='mb-3' fullWidth onClick={handleCopy}>
          <IconSvg name='copy' /> {t('Link.Copy')}
        </Button>
        <Button
          className='activated text-uppercase'
          outline
          fullWidth
          onClick={goTo}
        >
          <IconSvg name='manage-invite' />
          {t('Invitation.Manage')}
        </Button>
      </div>
    </Modal>
  );
};

export default InvitationLinkModal;
