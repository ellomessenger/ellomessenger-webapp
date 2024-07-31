import React, { FC, memo } from 'react';
import { Field, Form, Formik } from 'formik';
import Input from '../ui/Formik/Input';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import * as Yup from 'yup';
import { ResetPasswordScreens } from './Auth';
import { VerifyRequest } from './CreateNewPasswordForm';

const initialValue = {
  email: '',
};

type OwnProps = {
  setData: (values: VerifyRequest) => void;
  setScreen: (screen: ResetPasswordScreens) => void;
};

const ResetPasswordForm: FC<OwnProps> = ({ setData, setScreen }) => {
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required(t('Validation.required_email'))
      .email(t('Validation.email_format')),
  });

  return (
    <div
      id='forgot-password'
      className='auth-password-center auth-password-form'
    >
      <div className='auth-form'>
        <div className='title'>{t('ForgotPassword.heading')}</div>
        <p className='text-muted'>{t('ForgotPassword.text')}</p>

        <Formik
          initialValues={initialValue}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            setData(values);
            setScreen(ResetPasswordScreens.CreatePassword);
            setSubmitting(false);
          }}
        >
          {({ isValid, isSubmitting }) => (
            <Form>
              <Field
                name='email'
                component={Input}
                label={t('Registration.place_email')}
              />

              <div className='form-submit'>
                <Button
                  type='submit'
                  isShiny
                  disabled={!isValid || isSubmitting}
                >
                  {t('Send')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default memo(ResetPasswordForm);
