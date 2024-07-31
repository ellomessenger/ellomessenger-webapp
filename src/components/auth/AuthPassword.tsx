import React, { FC, memo, useCallback, useEffect } from 'react';
import { getActions, withGlobal } from '../../global';

import LoginForm from '../common/LoginForm';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import { GlobalState } from '../../global/types';
import { pick } from '../../util/iteratees';
import useHistoryBack from '../../hooks/useHistoryBack';

type OwnProps = {
  isActive?: boolean;
  onClose: () => void;
};

type StateProps = Pick<GlobalState, 'authState'>;

const AuthPassword: FC<StateProps & OwnProps> = ({ isActive, onClose }) => {
  const { t } = useTranslation();

  const { goToRegistration, goToAuthQrCode, goToResetPassword } = getActions();

  const handleGoToRegistration = useCallback(() => {
    goToRegistration();
  }, [goToRegistration]);

  const handleGoToResetPassword = useCallback(() => {
    goToResetPassword();
  }, [goToResetPassword]);

  useHistoryBack({
    isActive,
    onBack: onClose,
  });

  return (
    <div
      id='auth-password-form'
      className='custom-scroll auth-password-center auth-password-form'
    >
      <div className='auth-form'>
        <div className='btn-group tab-nav'>
          <button type='button' className='Button text primary active'>
            Login
          </button>
          <button
            type='button'
            className='Button text primary'
            onClick={handleGoToRegistration}
          >
            Registration
          </button>
        </div>
        <div className='transition-block'>
          <LoginForm />

          <button className='link' onClick={handleGoToResetPassword}>
            {t('Login.forgot_link')}
          </button>
          <div className='footer'>
            {/* {isAuthReady && (
              <Button isLink ripple onClick={handleGoToAuthQrCode}>
                {t('Login.by_qr').toUpperCase()}
              </Button>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(
  withGlobal((global): StateProps => pick(global, ['authState']))(AuthPassword)
);
