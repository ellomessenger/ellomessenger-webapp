import React, { FC, memo, useCallback, useEffect, useMemo } from 'react';
import { getActions } from '../../global';

import { copyTextToClipboard } from '../../util/clipboard';

import useAppLayout from '../../hooks/useAppLayout';

import Button from '../ui/Button';

import { useTranslation } from 'react-i18next';
import IconSvg from '../ui/IconSvg';
import ListItem from '../ui/ListItem';
import QRCodeStyling from 'qr-code-styling';

import Logo from '../../assets/logo-qr.png';

type OwnProps = {
  inviteLink: string;
  onRevoke?: VoidFunction;
  isDisabled?: boolean;
};

const QR_SIZE = 310;

const qrCode = new QRCodeStyling({
  width: QR_SIZE,
  height: QR_SIZE,
  type: 'svg',

  dotsOptions: {
    type: 'rounded',
    color: '#fff',
  },
  backgroundOptions: {
    color: '#6CA5F9',
  },
  cornersSquareOptions: {
    type: 'extra-rounded',
  },
  image: Logo,
  imageOptions: {
    imageSize: 0.3,
    margin: 3,
  },
  qrOptions: {
    errorCorrectionLevel: 'Q',
  },
});
const InviteLink: FC<OwnProps> = ({ inviteLink, onRevoke, isDisabled }) => {
  const { t } = useTranslation();
  const { showNotification, openChatWithDraft } = getActions();

  const { isMobile } = useAppLayout();

  const copyLink = useCallback((link: string) => {
    copyTextToClipboard(link);
    showNotification({
      message: t('Link.Copied'),
    });
  }, []);

  const onDownloadClick = () => {
    qrCode.download({
      extension: 'jpeg',
    });
  };

  const handleCopyPrimaryClicked = useCallback(() => {
    copyLink(inviteLink);
  }, [copyLink, inviteLink]);

  const handleShare = useCallback(() => {
    openChatWithDraft({ text: inviteLink });
  }, [inviteLink]);

  const actionsArray = useMemo(() => {
    const arr = [
      { title: t('Invitation.GetQr'), icon: 'qr', handler: onDownloadClick },
    ];
    if (onRevoke)
      arr.push({
        title: t('Link.Remove'),
        icon: 'delete',
        handler: onRevoke,
      });
    return arr;
  }, [onRevoke]);

  useEffect(() => {
    qrCode.update({ data: inviteLink });
  }, [inviteLink]);

  return (
    <div className='invite-wrap'>
      <ListItem
        className='text-trigger smaller mb-3'
        ripple
        secondaryIcon='filled'
        contextActions={actionsArray}
      >
        <div className='contact-info'>{inviteLink}</div>
      </ListItem>
      <div className='button-group'>
        <Button
          size='smaller'
          className='mb-3'
          onClick={handleCopyPrimaryClicked}
          disabled={isDisabled}
        >
          <IconSvg name='copy' /> {t('Copy.Copy')}
        </Button>
        {/* <Button
          size='smaller'
          className='mb-3'
          onClick={handleShare}
          disabled={isDisabled}
        >
          <IconSvg name='forward' /> {t('Share')}
        </Button> */}
      </div>
    </div>
  );
};

export default memo(InviteLink);
