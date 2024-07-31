import React, { FC } from 'react';
import Modal from '../../ui/Modal';
import { useTranslation } from 'react-i18next';
import Button from '../../ui/Button';

import * as Yup from 'yup';
import { Field, FormikProvider, useFormik } from 'formik';
import { getActions } from '../../../global';
import PasswordField from '../../ui/Formik/PasswordField';
import Input from '../../ui/Formik/Input';

export type OwnProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ChangeEmailModal: FC<OwnProps> = ({ isOpen, onClose }) => {
  const { getConfirmCodeFromChangeEmail } = getActions();
  const { t } = useTranslation();

  const validationShema = Yup.object({
    email: Yup.string()
      .required(t('Validation.required_email'))
      .email(t('Validation.email_format')),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationShema,
    onSubmit: (values) => {
      getConfirmCodeFromChangeEmail(values);
      onClose();
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      className='confirm'
      onClose={onClose}
      hasCloseButton
      title={String(t('Settings.ChangeEmail'))}
    >
      <div className='modal-content'>
        <FormikProvider value={formik}>
          <Field
            name='email'
            component={Input}
            label={t('Settings.NewEmail')}
          />
        </FormikProvider>

        <Button
          className='confirm-dialog-button'
          size='smaller'
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

export default ChangeEmailModal;
