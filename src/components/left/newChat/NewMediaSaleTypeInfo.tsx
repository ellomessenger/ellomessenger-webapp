import React, { FC } from 'react';

import useHistoryBack from '../../../hooks/useHistoryBack';
import { ChannelType } from './NewChat';
import Button from '../../ui/Button';
import IconSvg from '../../ui/IconSvg';
import { useTranslation } from 'react-i18next';

import Logo from '../../../assets/images/select-type-channel-logo.jpg';
import SelectChatModal from '../../middle/mediasale/SelectChatModal';
import useFlag from '../../../hooks/useFlag';
import ConfirmDialog from '../../ui/ConfirmDialog';
import CreateMediaSaleModal from '../../middle/mediasale/CreateMediaSaleModal';

export type OwnProps = {
  isActive: boolean;
  onReset: () => void;
};

const NewMediaSaleTypeInfo: FC<OwnProps> = ({ isActive, onReset }) => {
  const { t } = useTranslation();

  const [isOpenSelectChat, openSelectChat, closeSelectChat] = useFlag();
  const [isOpenCreateSale, openCreateSale, closeCreateSale] = useFlag();

  useHistoryBack({
    isActive,
    onBack: onReset,
  });

  return (
    <div className='NewChat'>
      <div className='left-header'>
        <Button
          round
          size='smaller'
          color='translucent'
          onClick={onReset}
          ariaLabel='Return to Chat List'
          className='mr-2'
        >
          <i className='icon-svg'>
            <IconSvg name='arrow-left' />
          </i>
        </Button>
        <h4>{t('Channel.MediaSales')}</h4>
      </div>
      <div className='channel-type-description custom-scroll'>
        <div className='centered-block'>
          <div className='AvatarEditable'>
            <img src={Logo} alt='' />
          </div>
          <h2 className='text-center'>{t('Channel.WhatMediaSaleTitle')}</h2>
          <p className='text-center text-secondary section-help'>
            {t('Channel.WhatMediaSaleInfo')}
          </p>
        </div>
        <Button fullWidth size='smaller' onClick={openCreateSale}>
          {t('Channel.CreateMediaSale')}
        </Button>
      </div>
      <SelectChatModal isOpen={isOpenSelectChat} onClose={closeSelectChat} />
      <CreateMediaSaleModal
        isOpen={isOpenCreateSale}
        onClose={closeCreateSale}
      />
    </div>
  );
};

export default NewMediaSaleTypeInfo;
