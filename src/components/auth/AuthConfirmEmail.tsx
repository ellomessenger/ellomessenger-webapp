import React, { FC, memo } from 'react';
import VerifyEmailForm from './VerifyEmailForm';
import { useTranslation } from 'react-i18next';

const AuthConfirmEmail: FC = () => {
  const { t } = useTranslation();
  return (
    <div id='confirm-form' className='auth-password-center auth-password-form'>
      <VerifyEmailForm
        title={t('VerifyEmail.Title')}
        text={t('VerifyEmail.Text')}
      />
    </div>
  );
};

export default memo(AuthConfirmEmail);
