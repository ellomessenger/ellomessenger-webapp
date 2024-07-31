import React, { FC, memo, useCallback, useEffect } from 'react';
import { Field, Form, Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import * as Yup from 'yup';
import { getActions, withGlobal } from '../../global';
import PasswordField from '../ui/Formik/PasswordField';
import { ResetPasswordScreens } from './Auth';
import { GlobalState } from '../../global/types';
import { pick } from '../../util/iteratees';

const initialValue = {
  password: '',
  confirmPassword: '',
};

export interface VerifyRequest {
  email?: string;
  code?: number;
  new_pass?: string;
  password?: string;
  username?: string;
}

type StateProps = Pick<GlobalState, 'confirmData'>;

type OwnProps = {
  formData: VerifyRequest;
};

const CreateNewPasswordForm: FC<OwnProps & StateProps> = ({ formData }) => {
  const { requestForgotPassword } = getActions();
  const { t } = useTranslation();
  const { email } = formData;
  const handleSubmit = (values: {
    password: string;
    confirmPassword: string;
  }) => {
    const { password } = values;
    if (email) {
      requestForgotPassword({ email, password });
    }
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{1,}$/,
        t('Validation.password_validation')
      )
      .required(t('Validation.password_required'))
      .min(6, t('Validation.password_min_length'))
      .max(15, t('Validation.password_max_length')),
    confirmPassword: Yup.string()
      .required(t('Validation.password_confirm'))
      .oneOf([Yup.ref('password'), ''], t('Validation.password_match')),
  });

  return (
    <div
      id='forgot-password'
      className='auth-password-center auth-password-form'
    >
      <div className='auth-form'>
        <div className='title'>{t('ForgotPassword.CreatePasswordTitle')}</div>
        <p className='text-muted'>{t('ForgotPassword.CreatePasswordText')}</p>

        <Formik
          initialValues={initialValue}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values);
            setSubmitting(false);
          }}
        >
          {({ isValid, isSubmitting }) => (
            <Form>
              <Field
                name='password'
                component={PasswordField}
                label={t('Registration.place_new_password')}
              />
              <Field
                name='confirmPassword'
                component={PasswordField}
                label={t('Registration.place_confirm_password')}
              />

              <div className='form-submit'>
                <Button
                  type='submit'
                  isShiny
                  disabled={!isValid || isSubmitting}
                >
                  {t('Save')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default memo(
  withGlobal((global): StateProps => pick(global, ['confirmData']))(
    CreateNewPasswordForm
  )
);
