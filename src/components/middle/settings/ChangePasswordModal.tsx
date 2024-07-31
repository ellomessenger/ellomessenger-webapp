import React, { FC } from 'react';
import Modal from '../../ui/Modal';
import { useTranslation } from 'react-i18next';
import Button from '../../ui/Button';
import InputText from '../../ui/InputText';

import * as Yup from 'yup';
import { Field, FormikProvider, useFormik } from 'formik';
import PasswordField from '../../ui/Formik/PasswordField';
import { getActions } from '../../../global';

export type OwnProps = {
  isOpen: boolean;
  email: string;
  onClose: () => void;
  onCloseAnimationEnd?: () => void;
};

const ChangePasswordModal: FC<OwnProps> = ({ isOpen, email, onClose }) => {
  const { getConfirmCodeFromChangeEmail } = getActions();
  const { t } = useTranslation();

  const validationShema = Yup.object({
    currentPassword: Yup.string().required(t('Validation.password_required')),
    newPassword: Yup.string()
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/,
        t('Validation.password_validation')
      )
      .required(t('Validation.password_required'))
      .max(25, t('Validation.password_max_length')),
    confirmPassword: Yup.string()
      .required(t('Validation.password_confirm'))
      .oneOf([Yup.ref('newPassword'), ''], t('Validation.password_match')),
  });

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: validationShema,
    onSubmit: (values, { resetForm }) => {
      const { currentPassword, newPassword } = values;
      getConfirmCodeFromChangeEmail({
        email,
        password: currentPassword,
        newPassword,
      });
      onClose();
      resetForm();
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      className='confirm'
      onClose={onClose}
      hasCloseButton
      title={String(t('Settings.ChangePassword'))}
    >
      <div className='modal-content'>
        <p className='text-secondary'>
          {t('Settings.ChangePasswordDescription')}
        </p>
        <FormikProvider value={formik}>
          <Field
            name='currentPassword'
            component={PasswordField}
            label={t('Settings.CurrentPassword')}
          />
          <Field
            name='newPassword'
            component={PasswordField}
            label={t('Settings.NewPassword')}
          />

          <Field
            name='confirmPassword'
            component={PasswordField}
            label={t('Settings.ConfirmNewPassword')}
          />
        </FormikProvider>
        <Button
          className='confirm-dialog-button'
          type='submit'
          onClick={formik.submitForm}
          disabled={!formik.isValid}
          fullWidth
        >
          {t('Change')}
        </Button>
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
