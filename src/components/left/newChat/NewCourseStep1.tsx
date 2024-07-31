import React, { FC } from 'react';
import { ECreateCourse } from './NewChat';
import Button from '../../ui/Button';
import IconSvg from '../../ui/IconSvg';
import { useTranslation } from 'react-i18next';
import { Field, FormikProvider, useFormik } from 'formik';
import SelectDate from '../../ui/Formik/SelectDate/SelectDate';
import * as Yup from 'yup';
import LogoCoursePrice from '../../../assets/images/monthly-subscription.png';
import InputText from '../../ui/InputText';
import { getMoneyFormat } from '../../../util/convertMoney';

export type OwnProps = {
  isActive: boolean;
  cost: string;
  courseData?: ECreateCourse;
  setCreateCourseData: (data: ECreateCourse) => void;
  onNextStep: () => void;
  setCost: (cost: string) => void;
  onReset: (forceReturnToChatList?: boolean) => void;
};

const NewCourseStep1: FC<OwnProps> = ({
  isActive,
  cost,
  courseData,
  setCreateCourseData,
  setCost,
  onReset,
  onNextStep,
}) => {
  const { t } = useTranslation();
  const { startDate, endDate } = courseData || {};
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { currentTarget: target } = e;
    setCost(getMoneyFormat(target.value));
  };

  const handleClearPrice = () => {
    setCost('');
  };

  const validationSchema = Yup.object().shape({
    startDate: Yup.string().required(t('Validation.StartCourse')),
    endDate: Yup.string().required(t('Validation.EndCourse')),
  });

  const formik = useFormik({
    initialValues: {
      startDate: startDate || '',
      endDate: endDate || '',
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      setCreateCourseData({
        startDate: String(Date.parse(values.startDate)),
        endDate: String(Date.parse(values.endDate)),
      });
      onNextStep();
      setSubmitting(false);
    },
  });
  return (
    <div className='NewChat'>
      <div className='left-header'>
        <Button
          round
          size='smaller'
          color='translucent'
          onClick={() => onReset()}
          ariaLabel='Return to member selection'
          className='mr-2'
        >
          <i className='icon-svg'>
            <IconSvg name='arrow-left' />
          </i>
        </Button>
        <h4>{t('Channel.CourseSchedule')}</h4>
      </div>
      <div className='NewChat-inner subscription custom-scroll step-2'>
        <form onSubmit={formik.handleSubmit}>
          <div className='center-block'>
            <FormikProvider value={formik}>
              <p className='sublabel'>{t('Channel.StartDate')}</p>
              <Field
                name='startDate'
                label='Start date'
                isFutureMode
                maxAt={Date.parse(formik.values.endDate) - 86400000}
                component={SelectDate}
              />
              <p className='text-smaller text-secondary'>
                {t('Channel.StartCourseDescription')}
              </p>
              <p className='sublabel'>{t('Channel.EndCourse')}</p>
              <Field
                name='endDate'
                label='End date'
                minAt={Date.parse(formik.values.startDate) + 86400000}
                component={SelectDate}
              />
              <div className='AvatarEditable'>
                <img src={LogoCoursePrice} alt='' />
              </div>
              <p className='sublabel'>{t('Sale.Price')}</p>
              <InputText
                className='prefix-inside'
                label='0'
                prefix={<IconSvg name='dollar' w='24' h='24' />}
                as_disabled
                inputMode='numeric'
                value={cost}
                onChange={handlePriceChange}
                clearValue={handleClearPrice}
              />
            </FormikProvider>
          </div>

          <div className='fees'>
            <h4>
              <IconSvg name='info-circle' w='24' h='24' /> Fees
            </h4>
            <span>{t('Channel.Fees')}</span>
          </div>

          <Button
            fullWidth
            className='mb-3'
            size='smaller'
            type='submit'
            disabled={!formik.isValid || formik.isSubmitting}
          >
            {t('Confirm')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewCourseStep1;
