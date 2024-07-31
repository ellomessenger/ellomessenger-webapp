import React, { FC } from 'react';

import useHistoryBack from '../../../hooks/useHistoryBack';
import { ChannelType } from './NewChat';
import Button from '../../ui/Button';
import IconSvg from '../../ui/IconSvg';
import { useTranslation } from 'react-i18next';

import Logo from '../../../assets/images/select-type-channel-logo.jpg';

export type OwnProps = {
  isActive: boolean;
  channelType: ChannelType;
  onNextStep: () => void;
  onReset: () => void;
};

const NewChannelTypeInfo: FC<OwnProps> = ({
  isActive,
  onNextStep,
  onReset,
  channelType,
}) => {
  const { t } = useTranslation();

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
        <h4>{t(`Channel.${channelType}`)}</h4>
      </div>
      <div className='channel-type-description custom-scroll'>
        <div className='centered-block'>
          <div className='AvatarEditable'>
            <img src={Logo} alt='' />
          </div>
          <h2 className='text-center'>
            {t(`Channel.What${channelType}Title`)}
          </h2>
          <p className='text-center text-secondary section-help'>
            {t(`Channel.What${channelType}Info`)}
          </p>
        </div>
        <Button fullWidth size='smaller' onClick={onNextStep}>
          {t('Channel.Create')}
        </Button>
      </div>
    </div>
  );
};

export default NewChannelTypeInfo;
