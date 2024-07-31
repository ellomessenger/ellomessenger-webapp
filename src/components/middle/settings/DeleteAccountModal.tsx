import React, { FC } from 'react';
import Modal from '../../ui/Modal';
import { useTranslation } from 'react-i18next';
import Button from '../../ui/Button';

import * as Yup from 'yup';
import { Field, FormikProvider, useFormik } from 'formik';
import PasswordField from '../../ui/Formik/PasswordField';
import Input from '../../ui/Formik/Input';
import { getActions } from '../../../global';

export type OwnProps = {
  isOpen: boolean;
  onClose: () => void;
  onCloseAnimationEnd?: () => void;
};

const DeleteAccountModal: FC<OwnProps> = ({ isOpen, onClose }) => {
  const { getConfirmCodeFromDeleteAccount } = getActions();
  const { t } = useTranslation();
  const validationShema = Yup.object({
    password: Yup.string().required(t('Validation.password_required')),
    email: Yup.string()
      .required(t('Validation.required_email'))
      .email(t('Validation.email_format')),
  });
  const formik = useFormik({
    initialValues: {
      password: '',
      email: '',
    },
    validationSchema: validationShema,
    onSubmit: (values) => {
      getConfirmCodeFromDeleteAccount(values);
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      className='confirm'
      onClose={onClose}
      hasCloseButton
      title={String(t('Settings.DeleteAccountConfirm'))}
    >
      <div className='modal-content'>
        <p className='text-secondary'>
          {t('Settings.DeleteAccountDescription')}
        </p>
        <FormikProvider value={formik}>
          <Field
            name='email'
            component={Input}
            label={t('Registration.place_email')}
          />
          <Field
            name='password'
            component={PasswordField}
            label={t('Registration.place_password')}
          />
        </FormikProvider>

        <Button
          className='confirm-dialog-button'
          type='submit'
          onClick={formik.submitForm}
          disabled={!formik.isValid}
          fullWidth
        >
          {t('Settings.DeleteAccount')}
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;
