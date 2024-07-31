import React, { FC, useCallback } from 'react';
import Button from '../../ui/Button';
import { useTranslation } from 'react-i18next';
import useHistoryBack from '../../../hooks/useHistoryBack';
import IconSvg from '../../ui/IconSvg';
import { LeftColumnContent } from '../../../types';
import { ChannelType } from './NewChat';

export type OwnProps = {
  isActive: boolean;
  isCourse?: boolean;
  onReset: (
    forceReturnToChatList?: boolean,
    content?: LeftColumnContent
  ) => void;
};

const AgeRestrictionPolicy: FC<OwnProps> = ({
  isActive,
  onReset,
  isCourse,
}) => {
  const { t } = useTranslation();
  const historyBack = useCallback(() => {
    onReset(false, isCourse ? LeftColumnContent.NewCourseStep1 : undefined);
  }, [isCourse]);
  useHistoryBack({
    isActive,
    onBack: historyBack,
  });

  return (
    <div className='NewChat'>
      <div className='left-header'>
        <Button
          round
          size='smaller'
          color='translucent'
          onClick={historyBack}
          ariaLabel='Return to member selection'
          className='mr-2'
        >
          <i className='icon-svg'>
            <IconSvg name='arrow-left' />
          </i>
        </Button>
        <h4>{t('Policy.AgeTitle')}</h4>
      </div>
      <div className='NewChat-inner step-2'>
        <p className='text-smaller'>{t('Policy.AgeNote1')}</p>
        <p className='text-bold'>{t('Policy.AgeNote2')}</p>
        <p className='text-smaller'>{t('Policy.AgeNote3')}</p>
      </div>
    </div>
  );
};

export default AgeRestrictionPolicy;
