import React, { FC, useEffect, useState, memo, useCallback } from 'react';
import { getActions, withGlobal } from '../../global';

import { pick } from '../../util/iteratees';
import { GlobalState } from '../../global/types';
import { ApiCountryCode } from '../../api/types';
import { useTranslation } from 'react-i18next';
import RegistrationForm from '../common/RegistrationForm';

import personalImg from '../../assets/reg-personal.jpg';
import businesImg from '../../assets/reg-busines.jpg';
import { preloadImage } from '../../util/files';
import useEffectOnce from '../../hooks/useEffectOnce';
import useFlag from '../../hooks/useFlag';
import Button from '../ui/Button';
import useLastCallback from '../../hooks/useLastCallback';
import { ProfileType } from './Auth';
import useHistoryBack from '../../hooks/useHistoryBack';

type StateProps = Pick<GlobalState, 'connectionState'> & {
  phoneCodeList: ApiCountryCode[];
};

type OwnProps = {
  profile: ProfileType;
  isActive?: boolean;
  onClose: () => void;
  setProfileType: (type: ProfileType) => void;
};

const AuthRegister: FC<StateProps & OwnProps> = ({
  connectionState,
  profile,
  isActive,
  onClose,
  setProfileType,
}) => {
  const { returnToAuthPassword, loadCountryList, apiUpdate } = getActions();
  const { t, i18n } = useTranslation();

  const [isReady, markReady] = useFlag();

  const habdleReturnToAuthPassword = useCallback(() => {
    returnToAuthPassword();
  }, [returnToAuthPassword]);

  useHistoryBack({
    isActive,
    onBack: onClose,
  });

  const handleClickGoInfo = useLastCallback(() => {
    apiUpdate({
      '@type': 'updateAuthorizationState',
      authorizationState: 'authorizationStateWhatAccountChoose',
    });
  });

  useEffectOnce(() => {
    const safePreload = async () => {
      try {
        await Promise.all([
          preloadImage(personalImg),
          preloadImage(businesImg),
        ]);
      } catch (err) {
        // Do nothing
      }
    };

    Promise.race([safePreload()]).then(() => {
      markReady();
    });
  });

  useEffect(() => {
    if (connectionState === 'connectionStateReady') {
      loadCountryList({ langCode: i18n.language });
    }
  }, [connectionState, i18n.language, loadCountryList]);

  return (
    <div id='auth-registration-form' className='custom-scroll'>
      <div className='register-form'>
        {!profile ? (
          <>
            <div className='btn-group tab-nav'>
              <button
                type='button'
                className='Button text primary'
                onClick={habdleReturnToAuthPassword}
              >
                Login
              </button>
              <button type='button' className='Button text primary active'>
                Registration
              </button>
            </div>
            <div className='transition-block'>
              <div
                className='banner-link'
                role='button'
                onClick={() => setProfileType('personal')}
              >
                <div className='img-wrap'>
                  {isReady && <img src={personalImg} alt='' loading='lazy' />}
                </div>

                <div className='title'>{t('Registration.personal_title')}</div>
              </div>
              <div
                className='banner-link'
                role='button'
                onClick={() => setProfileType('business')}
              >
                <div className='img-wrap'>
                  {isReady && <img src={businesImg} alt='' loading='lazy' />}
                </div>

                <div className='title'>{t('Registration.business_title')}</div>
              </div>
            </div>
            <div className='go-info'>
              <div className='title'>
                {t('Registration.WhichAccountToChoose')}
              </div>
              <Button outline fullWidth onClick={handleClickGoInfo}>
                {t('Registration.PersonalVsBusinessAccount')}
              </Button>
            </div>
          </>
        ) : (
          <RegistrationForm profile={profile} />
        )}
      </div>
    </div>
  );
};

export default memo(
  withGlobal((global): StateProps => {
    const {
      countryList: { phoneCodes: phoneCodeList },
    } = global;

    return {
      ...pick(global, ['connectionState']),
      phoneCodeList,
    };
  })(AuthRegister)
);
