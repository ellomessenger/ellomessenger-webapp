import React, { FC, memo } from 'react';
import { Field, Form, Formik, FormikValues } from 'formik';
import { getActions, withGlobal } from '../../global';
import Input from '../ui/Formik/Input';
import { useTranslation } from 'react-i18next';
import PasswordField from '../ui/Formik/PasswordField';
import Button from '../ui/Button';
import * as Yup from 'yup';
import Radio from '../ui/Formik/Radio/Radio';
import SelectDate from '../ui/Formik/SelectDate/SelectDate';
import { EGender } from '../../types';
import SelectCountry from '../ui/Formik/SelectCountry/SelectCountry';
import SelectDropdown from '../ui/Formik/SelectDropdown/SelectDropdown';
import useHistoryBack from '../../hooks/useHistoryBack';
import { GlobalState, SignUpPayload } from '../../global/types';
import { USERNAME_REGEX } from '../../config';
import Checkbox from '../ui/Formik/Checkbox/Checkbox';
import Link from '../ui/Link';
import { pick } from '../../util/iteratees';
import { ProfileType } from '../auth/Auth';

type OwnProps = {
  profile: ProfileType;
};

type StateProps = Pick<GlobalState, 'authErrorAvailable' | 'authRefCode'>;

const RegistrationForm: FC<OwnProps & StateProps> = ({
  profile,
  authErrorAvailable,
  authRefCode,
}) => {
  const { t } = useTranslation();
  const { signUp } = getActions();

  const initialValue = {
    username: '',
    password: '',
    confirmPassword: '',
    gender: '',
    date_of_birth: '',
    email: '',
    country_code: '',
    kind: 'public', //   | private
    acceptTerms: false,
    code: authRefCode || '',
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .matches(/^(?=.*?[a-z]).{1,}$/, t('Validation.username_validation'))
      .required(t('Validation.required_username'))
      .min(5, t('Validation.username_min_length'))
      .max(32, t('Validation.username_max_length'))
      .test(
        'unique_name',
        t('Errors.ThisUsernameUnavailable'),
        () => authErrorAvailable?.username
      ),
    email: Yup.string()
      .required(t('Validation.required_email'))
      .email(t('Validation.email_format'))
      .test(
        'unique_email',
        t('Errors.email_was_been_registered'),
        () => authErrorAvailable?.email
      ),
    password: Yup.string()
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/,
        t('Validation.password_validation')
      )
      .required(t('Validation.password_required'))
      .min(6, t('Validation.password_min_length'))
      .max(15, t('Validation.password_max_length')),
    confirmPassword: Yup.string()
      .required(t('Validation.password_confirm'))
      .oneOf([Yup.ref('password'), ''], t('Validation.password_match')),
    gender: Yup.string().when([], {
      is: () => profile === 'personal',
      then: () => Yup.string().required(t('Validation.gender_required')),
    }),
    date_of_birth: Yup.string().when([], {
      is: () => profile === 'personal',
      then: () => Yup.string().required(t('Validation.date_of_birth_required')),
    }),
    country_code: Yup.string().required(t('Validation.country_required')),
    acceptTerms: Yup.bool().oneOf([true], t('Validation.accept_terms')),
  });

  const handleSubmit = (values: FormikValues) => {
    const {
      username,
      password,
      gender,
      date_of_birth,
      email,
      country_code,
      kind,
      code,
    } = values;

    signUp({
      username,
      password,
      gender: gender || undefined,
      date_of_birth: date_of_birth
        ? date_of_birth.toISOString().split('.')[0] + '+0000'
        : undefined,
      email,
      phone: '',
      country_code,
      kind,
      type: profile,
      code,
    });
  };
  const d = new Date();
  const toDate = d.setFullYear(d.getFullYear() - 13);

  return (
    <div className='register-form-wrap'>
      <Formik
        initialValues={initialValue}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values);
          setSubmitting(false);
        }}
      >
        {({ isValid, isSubmitting, values }) => (
          <Form>
            <h2>{t(`Registration.${profile}_${values.kind}_heading`)}</h2>
            <Field
              name='username'
              component={Input}
              label={t('Registration.place_username')}
              is_required
              maxLength={32}
              regexp={USERNAME_REGEX}
            />
            <div className='radio-group mb-3'>
              <Field
                type='radio'
                name='kind'
                value='public'
                component={Radio}
                label={t('Registration.public')}
                className='radio--no-mb radio-button'
              />
              <Field
                type='radio'
                name='kind'
                value='private'
                component={Radio}
                label={t('Registration.private')}
                className='radio--no-mb radio-button'
              />
            </div>

            <p>{t(`Registration.kind_description`)}</p>
            <Field
              name='password'
              component={PasswordField}
              label={t('Registration.place_password')}
              is_required
            />
            <Field
              name='confirmPassword'
              component={PasswordField}
              label={t('Registration.place_confirm_password')}
              is_required
            />
            <Field
              name='email'
              component={Input}
              label={t('Registration.place_email')}
              is_required
            />
            {profile === 'personal' && (
              <Field
                name='date_of_birth'
                label='Date of birth'
                maxAt={toDate}
                component={SelectDate}
              />
            )}

            <Field
              name='code'
              component={Input}
              label={t('Registration.place_referral_code')}
            />

            <Field
              name='country_code'
              className='mb-4'
              component={SelectCountry}
              positionY='bottom'
            />

            {profile === 'personal' && (
              <Field
                className='mb-4'
                scrollId='auth-registration-form'
                name='gender'
                label={t('Registration.label_gender')}
                component={SelectDropdown}
                dataList={EGender}
              />
            )}
            <div className='checkbox-wrap'>
              <Field
                name='acceptTerms'
                component={Checkbox}
                label={
                  <span>
                    By registering, you agree to the{' '}
                    <Link
                      href='https://ellomessenger.com/terms'
                      className='link'
                      target='_blank'
                    >
                      Terms of Service
                    </Link>
                    ,{' '}
                    <Link
                      href='https://ellomessenger.com/privacy-policy'
                      className='link'
                      target='_blank'
                    >
                      Privacy Policy
                    </Link>
                    .{' '}
                  </span>
                }
              />
            </div>

            <div className='form-submit'>
              <Button type='submit' isShiny disabled={!isValid || isSubmitting}>
                {t('Registration.btn')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default memo(
  withGlobal((global): StateProps => {
    return { ...pick(global, ['authErrorAvailable', 'authRefCode']) };
  })(RegistrationForm)
);
