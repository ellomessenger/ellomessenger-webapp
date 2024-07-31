import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { getActions, withGlobal } from '../../global';
import type { GlobalState } from '../../global/types';

import '../../global/actions/initial';
import useCurrentOrPrev from '../../hooks/useCurrentOrPrev';

import AuthPassword from './AuthPassword.async';
import AuthRegister from './AuthRegister';
import AuthQrCode from './AuthQrCode';

import './Auth.scss';
import Loading from '../ui/Loading';
import AuthResetPassword from './AuthResetPassword';
import Transition from '../ui/Transition';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import classNames from 'classnames';
import IconSvg from '../ui/IconSvg';
import SelectLanguage from '../ui/SelectLanguage';
import useHistoryBack from '../../hooks/useHistoryBack';
import AuthConfirmEmail from './AuthConfirmEmail';
import AccountInfo from './AccountInfo';
import AuthUserBlocked from './AuthUserBlocked';
import { parseInitialLocationHash } from '../../util/routing';
import { processDeepLink } from '../../util/deeplink';
import useEffectWithPrevDeps from '../../hooks/useEffectWithPrevDeps';
import { selectTabState } from '../../global/selectors';
import { APP_NAME } from '../../config';
import useFlag from '../../hooks/useFlag';
import { useTranslation } from 'react-i18next';
import { PLATFORM_ENV } from '../../util/windowEnvironment';

export enum ResetPasswordScreens {
  Email,
  CreatePassword,
  ConfirmCode,
}

export type ProfileType = 'personal' | 'business' | undefined;

type StateProps = {
  username?: string;
  errorMessage?: string;
} & Pick<GlobalState, 'authState' | 'authRefCode' | 'connectionState'>;

const Auth: FC<StateProps> = ({
  authState,
  username,
  errorMessage,
  authRefCode,
  connectionState,
}) => {
  const { returnToAuthPassword, goToRegistration } = getActions();
  const { t } = useTranslation();
  const [resetScreen, setResetScreen] = useState(ResetPasswordScreens.Email);
  const [profile, setProfile] = useState<ProfileType>();
  const [isModalOpen, openModal, closeModal] = useFlag();

  const renderingAuthState = useCurrentOrPrev(
    authState !== 'authorizationStateReady' ? authState : undefined,
    true
  );

  const handleGoBack = useCallback(() => {
    console.log(authState);
    switch (authState) {
      case 'authorizationStateWaitQrCode':
      case 'authorizationStateWhatUserBlocked':
        returnToAuthPassword();
        break;
      case 'authorizationStateWaitRegistration':
        if (profile) {
          setProfile(undefined);
        } else {
          returnToAuthPassword();
        }
        break;
      case 'authorizationStateWhatAccountChoose':
      case 'authorizationStateWaitConfirmEmail':
        goToRegistration();
        break;
      case 'authorizationStateWaitResetPassword': {
        switch (resetScreen) {
          case ResetPasswordScreens.ConfirmCode:
            setResetScreen(ResetPasswordScreens.CreatePassword);
            break;
          case ResetPasswordScreens.CreatePassword:
            setResetScreen(ResetPasswordScreens.Email);
            break;
          default:
            returnToAuthPassword();
        }
        break;
      }
      default:
        break;
    }
  }, [authState, resetScreen, profile]);

  const show =
    (authState &&
      [
        'authorizationStateWaitQrCode',
        'authorizationStateWaitResetPassword',
        'authorizationStateWhatAccountChoose',
        'authorizationStateWhatUserBlocked',
      ].includes(authState)) ||
    profile?.length;

  function getScreen(isScreenActive: boolean) {
    switch (renderingAuthState) {
      case 'authorizationStateWaitCode':
      //return <AuthCode />;
      case 'authorizationStateWaitPassword':
        return (
          <AuthPassword isActive={isScreenActive} onClose={handleGoBack} />
        );
      case 'authorizationStateWaitRegistration':
        return (
          <AuthRegister
            profile={profile}
            setProfileType={setProfile}
            isActive={isScreenActive}
            onClose={handleGoBack}
          />
        );
      case 'authorizationStateWaitQrCode':
        return <AuthQrCode />;
      case 'authorizationStateWaitResetPassword':
        return (
          <AuthResetPassword
            screen={resetScreen}
            setScreen={setResetScreen}
            isActive={isScreenActive}
            onClose={handleGoBack}
          />
        );
      case 'authorizationStateWaitConfirmEmail':
        return <AuthConfirmEmail />;

      case 'authorizationStateWhatAccountChoose':
        return <AccountInfo isActive={isScreenActive} onClose={handleGoBack} />;
      case 'authorizationStateWhatUserBlocked':
        return (
          <AuthUserBlocked
            username={username!}
            errorMessage={errorMessage}
            onClose={handleGoBack}
          />
        );
      default:
        return <Loading />;
    }
  }

  function getActiveKey() {
    switch (renderingAuthState) {
      case 'authorizationStateWaitPassword':
        return 0;
      case 'authorizationStateWaitRegistration':
        return 1;
      case 'authorizationStateWaitQrCode':
        return 2;
      case 'authorizationStateWaitResetPassword':
        return 3;
      case 'authorizationStateWaitConfirmEmail':
        return 4;
      case 'authorizationStateWhatAccountChoose':
        return 5;
      case 'authorizationStateWhatUserBlocked':
        return 6;
      default:
        return 1;
    }
  }

  useEffect(() => {
    if (authState === 'authorizationStateWaitPassword') {
      setResetScreen(ResetPasswordScreens.Email);
    }
  }, [authState]);

  // Parse deep link
  useEffect(() => {
    const parsedInitialLocationHash = parseInitialLocationHash();
    if (parsedInitialLocationHash?.elloaddr) {
      processDeepLink(decodeURIComponent(parsedInitialLocationHash.elloaddr));
    }
  }, []);

  useEffect(() => {
    window.history.replaceState({}, APP_NAME, ' ');
  }, []);

  useEffect(() => {
    let timeout;
    if (connectionState === 'connectionStateConnecting') {
      timeout = setTimeout(() => {
        openModal();
      }, 6000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [connectionState]);

  useEffectWithPrevDeps(
    ([prevRenderingAuthState]) => {
      if (authRefCode && renderingAuthState && !prevRenderingAuthState) {
        goToRegistration();
      }
    },
    [renderingAuthState]
  );

  return (
    <section className='Auth'>
      <header className='AuthHeader'>
        <Button
          round
          size='smaller'
          color='translucent'
          className={classNames({ hidden: !show })}
          onClick={handleGoBack}
        >
          <i className='icon-svg color-text'>
            <IconSvg name='arrow-left' />
          </i>
        </Button>
        {/* <SelectLanguage /> */}
      </header>
      <Transition
        name='fade'
        activeKey={getActiveKey()}
        className='auth-section'
      >
        {getScreen}
      </Transition>
      {connectionState === 'connectionStateConnecting' && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          className='error'
          title='Ello'
        >
          <div className='modal-content'>
            {t('Errors.client_disconnect')}
            <div className='dialog-buttons mt-2'>
              <Button isText onClick={closeModal}>
                {t('OK')}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};

export default withGlobal((global): StateProps => {
  const { authState, confirmData, authRefCode, connectionState } = global;
  return {
    authState,
    username: confirmData?.params ? confirmData?.params.username : undefined,
    errorMessage: confirmData?.params
      ? confirmData?.params.errorMessage
      : undefined,
    authRefCode,
    connectionState,
  };
})(Auth);
