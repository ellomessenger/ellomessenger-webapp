import React, { FC, memo, useCallback, useState } from 'react';
import FloatingActionButton from '../../ui/FloatingActionButton';
import Button from '../../ui/Button';
import IconSvg from '../../ui/IconSvg';
import useHistoryBack from '../../../hooks/useHistoryBack';
import { useTranslation } from 'react-i18next';
import RadioGroup from '../../ui/RadioGroup';
import UsernameInput from '../../common/UsernameInput';
import { ChannelType } from './NewChat';
import { ManagementProgress } from '../../../types';
import { withGlobal } from '../../../global';
import { selectManagement, selectTabState } from '../../../global/selectors';
import {
  CREATE_NEW_PUBLIC_CHANNEL_ID,
  STICKER_SIZE_CREATE_CHANNEL,
} from '../../../config';
import usePrevious from '../../../hooks/usePrevious';
import AnimatedIcon from '../../common/AnimatedIcon';
import { LOCAL_TGS_URLS } from '../../common/helpers/animatedAssets';
import { isChatGroup } from '../../../global/helpers';

export type OwnProps = {
  isActive: boolean;
  channelType?: ChannelType;
  setChannelType: (type: ChannelType) => void;
  onNextStep: () => void;
  onReset: () => void;
};

type StateProps = {
  progress?: ManagementProgress;
  isUsernameAvailable?: boolean;
  checkedUsername?: string;
  error?: string;
};

const NewChannelSelect: FC<OwnProps & StateProps> = ({
  isActive,
  onReset,
  onNextStep,
  channelType,
  progress,
  isUsernameAvailable,
  checkedUsername,
  setChannelType,
}) => {
  const { t } = useTranslation();
  const [editableUsername, setEditableUsername] = useState<string>();
  const [isProfileFieldsTouched, setIsProfileFieldsTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const previousIsUsernameAvailable = usePrevious(isUsernameAvailable);
  const renderingIsUsernameAvailable =
    isUsernameAvailable ?? previousIsUsernameAvailable;

  const canUpdate = Boolean(
    ((channelType === 'public' || channelType === 'subscription') &&
      isProfileFieldsTouched &&
      editableUsername != '' &&
      isValid &&
      renderingIsUsernameAvailable) ||
      channelType === 'private'
  );

  useHistoryBack({
    isActive,
    onBack: onReset,
  });

  const handleNextStep = useCallback(() => {
    onNextStep();
  }, [onNextStep]);

  const options = [
    {
      value: 'public',
      label: t('Channel.public'),
    },
    {
      value: 'private',
      label: t('Channel.private'),
    },
    {
      value: 'subscription',
      label: t('Channel.subscription'),
    },
  ];

  const tglUrl = useCallback(() => {
    return channelType === 'private'
      ? LOCAL_TGS_URLS.PrivateChannel
      : channelType === 'public'
      ? LOCAL_TGS_URLS.PublicChannel
      : LOCAL_TGS_URLS.SubscriptionChannel;
  }, [channelType]);

  const isLoading = progress === ManagementProgress.InProgress;

  const handleOptionChange = useCallback((value: string) => {
    setChannelType(value as ChannelType);
  }, []);

  const handleUsernameChange = useCallback((value: string) => {
    setEditableUsername(value);
    setIsProfileFieldsTouched(true);
  }, []);

  return (
    <div className='Management NewChat'>
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
        <h4>{t('Channel.Select')}</h4>
      </div>
      <div className='NewChat-inner custom-scroll step-1'>
        <div className='section'>
          <RadioGroup
            id='channelType'
            selected={channelType}
            name='channel-type'
            options={options}
            onChange={handleOptionChange}
            size='smaller'
            className='underline'
          />
        </div>
        {channelType === 'subscription' && (
          <p className='section-info'>{t('Channel.SubscriptionInfo')}</p>
        )}

        {channelType === 'public' && (
          <p className='section-info'>{t('Channel.PublicChannelsInfo')}</p>
        )}

        {channelType !== 'private' && (
          <div className='section'>
            <h4 className='section-heading'>{t('Link.Public')}</h4>
            <div className='link-block'>
              <UsernameInput
                asLink
                isNewLink
                prefix='@'
                placeholder={'channel_name'}
                currentUsername=''
                isLoading={isLoading}
                isUsernameAvailable={isUsernameAvailable}
                checkedUsername={checkedUsername}
                onChange={handleUsernameChange}
                setValid={setIsValid}
              />
            </div>
          </div>
        )}
        <p className='section-info'>
          {t(
            `${
              channelType === 'private'
                ? 'Channel.TypePrivateInfo'
                : 'Channel.PublicLinkInfo'
            }`
          )}
        </p>
        {channelType !== 'private' && (
          <p className='section-info'>{t('RequiredForText')}</p>
        )}

        <div className='channel-type-description custom-scroll'>
          <div className='centered-block'>
            <div className='AvatarEditable'>
              <AnimatedIcon
                tgsUrl={tglUrl()}
                size={STICKER_SIZE_CREATE_CHANNEL}
              />
            </div>
            <h2 className='text-center'>
              {t(`Channel.What${channelType}Title`)}
            </h2>
            <p className='text-secondary section-help'>
              {t(`Channel.What${channelType}Info`)}
            </p>
          </div>
        </div>

        <FloatingActionButton
          isShown={canUpdate}
          onClick={handleNextStep}
          ariaLabel={'Continue To Channel Select'}
        >
          <i className='icon-svg'>
            <IconSvg name='arrow-right' />
          </i>
        </FloatingActionButton>
      </div>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global): StateProps => {
    const { isUsernameAvailable, checkedUsername, error } =
      selectManagement(global, CREATE_NEW_PUBLIC_CHANNEL_ID) || {};

    return {
      progress: selectTabState(global).management.progress,
      error,
      isUsernameAvailable,
      checkedUsername,
    };
  })(NewChannelSelect)
);
