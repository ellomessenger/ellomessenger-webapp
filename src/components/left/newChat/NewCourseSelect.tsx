import React, { FC, memo, useCallback, useState } from 'react';
import FloatingActionButton from '../../ui/FloatingActionButton';
import Button from '../../ui/Button';
import IconSvg from '../../ui/IconSvg';
import useHistoryBack from '../../../hooks/useHistoryBack';
import { useTranslation } from 'react-i18next';
import RadioGroup from '../../ui/RadioGroup';
import UsernameInput from '../../common/UsernameInput';
import { ChannelType, CourseType } from './NewChat';
import {
  CREATE_NEW_PUBLIC_CHANNEL_ID,
  STICKER_SIZE_CREATE_CHANNEL,
} from '../../../config';
import { withGlobal } from '../../../global';
import { selectManagement, selectTabState } from '../../../global/selectors';
import { ManagementProgress } from '../../../types';
import usePrevious from '../../../hooks/usePrevious';
import AnimatedIcon from '../../common/AnimatedIcon';
import { LOCAL_TGS_URLS } from '../../common/helpers/animatedAssets';

type StateProps = {
  progress?: ManagementProgress;
  isUsernameAvailable?: boolean;
  checkedUsername?: string;
  error?: string;
};

export type OwnProps = {
  isActive: boolean;
  courseType?: CourseType;
  setCourseType: (type: CourseType) => void;
  onNextStep: () => void;
  onReset: () => void;
};

const NewCourseSelect: FC<OwnProps & StateProps> = ({
  isActive,
  onReset,
  onNextStep,
  courseType,
  setCourseType,
  progress,
  isUsernameAvailable,
  checkedUsername,
  error,
}) => {
  const { t } = useTranslation();
  const [editableUsername, setEditableUsername] = useState<string>();
  const [isProfileFieldsTouched, setIsProfileFieldsTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const previousIsUsernameAvailable = usePrevious(isUsernameAvailable);
  const renderingIsUsernameAvailable =
    isUsernameAvailable ?? previousIsUsernameAvailable;

  const canUpdate = Boolean(
    isProfileFieldsTouched &&
      editableUsername != '' &&
      isValid &&
      renderingIsUsernameAvailable
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
      value: 'online',
      label: t('Channel.OnlineCourse'),
    },
  ];

  const isLoading = progress === ManagementProgress.InProgress;

  const handleOptionChange = useCallback((value: string) => {
    setCourseType(value as CourseType);
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
            id='courseType'
            selected={courseType}
            name='course-type'
            options={options}
            onChange={handleOptionChange}
            size='smaller'
            className='underline'
          />
        </div>
        <p className='section-info'>{t('Channel.OnlineCourseInfo')}</p>

        <div className='section'>
          <h4 className='section-heading'>{t('Link.Public')}</h4>
          <div className='link-block'>
            <UsernameInput
              asLink
              isNewLink
              prefix='@'
              currentUsername=''
              placeholder='course_name'
              isLoading={isLoading}
              isUsernameAvailable={isUsernameAvailable}
              checkedUsername={checkedUsername}
              onChange={handleUsernameChange}
              setValid={setIsValid}
            />
          </div>
        </div>

        <p className='section-info'>{t('Channel.TypeOnlineCourseInfo')}</p>
        <p className='section-info'>{t('RequiredForText')}</p>
        <div className='channel-type-description custom-scroll'>
          <div className='centered-block'>
            <div className='AvatarEditable'>
              <AnimatedIcon
                tgsUrl={LOCAL_TGS_URLS.OnlineCourse}
                size={STICKER_SIZE_CREATE_CHANNEL}
              />
            </div>
            <h2 className='text-center'>
              {t('Channel.WhatOnlineCourseTitle')}
            </h2>
            <p className='text-secondary section-help'>
              {t('Channel.WhatOnlineCourseInfo')}
            </p>
          </div>
        </div>
        <FloatingActionButton
          isShown={canUpdate}
          onClick={handleNextStep}
          ariaLabel={'Continue to onlinecours select'}
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
    const { isUsernameAvailable, checkedUsername, error } = selectManagement(
      global,
      CREATE_NEW_PUBLIC_CHANNEL_ID
    )!;

    return {
      progress: selectTabState(global).management.progress,
      error,
      isUsernameAvailable,
      checkedUsername,
    };
  })(NewCourseSelect)
);
