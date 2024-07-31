import React from 'react';
import { Field, Form, Formik } from 'formik';
import { getActions } from '../../global';
import Input from '../ui/Formik/Input';
import { useTranslation } from 'react-i18next';
import PasswordField from '../ui/Formik/PasswordField';
import Button from '../ui/Button';
import * as Yup from 'yup';

const initialValue = {
  username: '',
  password: '',
};

const LoginForm = () => {
  const { t } = useTranslation();
  const { setAuthUsernameAndPassword } = getActions();

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required(t('Validation.required_username'))
      .min(5, t('Validation.username_min_length')) // min 5
      .max(32, t('Validation.username_max_length')),
    password: Yup.string()
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{1,}$/,
        t('Validation.password_validation')
      )
      .required(t('Validation.password_required'))
      .min(6, t('Validation.password_min_length'))
      .max(15, t('Validation.password_max_length')),
  });

  return (
    <Formik
      initialValues={initialValue}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setAuthUsernameAndPassword(values);
        setSubmitting(false);
      }}
    >
      {({ isValid, isSubmitting }) => (
        <Form className='mb-4'>
          <Field
            name='username'
            component={Input}
            label={t('Login.place_username')}
          />
          <Field
            name='password'
            component={PasswordField}
            label={t('Login.place_password')}
          />
          <div className='form-submit'>
            <Button type='submit' isShiny disabled={!isValid || isSubmitting}>
              {t('Login.btn')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
