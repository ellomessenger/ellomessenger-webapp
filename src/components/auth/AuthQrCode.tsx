import React, { FC, useEffect, useRef, memo, useCallback } from 'react';
import { getActions, withGlobal } from '../../global';

import type { GlobalState } from '../../global/types';
import type { LangCode } from '../../types';
import { CSSTransition } from 'react-transition-group';
import { LOCAL_TGS_URLS } from '../common/helpers/animatedAssets';

import useFlag from '../../hooks/useFlag';
import useAsync from '../../hooks/useAsync';

import Loading from '../ui/Loading';
import Button from '../ui/Button';
import AnimatedIcon from '../common/AnimatedIcon';

import logo from '../../assets/panda-logo.png';
import { useTranslation } from 'react-i18next';
import useHistoryBack from '../../hooks/useHistoryBack';

type StateProps = Pick<
  GlobalState,
  'connectionState' | 'authState' | 'authQrCode'
> & { language?: LangCode };

const DATA_PREFIX = 'tg://login?token=';
const QR_SIZE = 210;
const QR_PLANE_SIZE = 40;

let qrCodeStylingPromise: Promise<typeof import('qr-code-styling')>;

function ensureQrCodeStyling() {
  if (!qrCodeStylingPromise) {
    qrCodeStylingPromise = import('qr-code-styling');
  }
  return qrCodeStylingPromise;
}

const AuthCode: FC<StateProps> = ({
  connectionState,
  authState,
  authQrCode,
}) => {
  const { t } = useTranslation();
  const { returnToAuthPhoneNumber, returnToAuthPassword } = getActions();

  const qrCodeRef = useRef<HTMLDivElement>(null);

  const [isQrMounted, markQrMounted, unmarkQrMounted] = useFlag();

  const habdleReturnToAuthPassword = useCallback(() => {
    returnToAuthPassword();
  }, [returnToAuthPassword]);

  // useHistoryBack({
  //   isActive: true,
  //   onBack: habdleReturnToAuthPassword,
  // });

  const { result: qrCode } = useAsync(async () => {
    const QrCodeStyling = (await ensureQrCodeStyling()).default;
    return new QrCodeStyling({
      width: QR_SIZE,
      height: QR_SIZE,
      image: logo,
      margin: 5,
      type: 'svg',
      dotsOptions: {
        type: 'rounded',
      },
      cornersSquareOptions: {
        type: 'extra-rounded',
      },
      imageOptions: {
        imageSize: 0.6,
        margin: 5,
      },
      qrOptions: {
        errorCorrectionLevel: 'M',
      },
    });
  }, []);

  useEffect(() => {
    if (!authQrCode || !qrCode) {
      return () => {
        unmarkQrMounted();
      };
    }

    if (connectionState !== 'connectionStateReady') {
      return undefined;
    }

    const container = qrCodeRef.current!;
    const data = `${DATA_PREFIX}${authQrCode.token}`;

    qrCode.update({
      data,
    });

    if (!isQrMounted) {
      qrCode.append(container);
      markQrMounted();
    }
    return undefined;
  }, [
    connectionState,
    authQrCode,
    isQrMounted,
    markQrMounted,
    unmarkQrMounted,
    qrCode,
  ]);

  return (
    <div id='auth-qr-form' className='custom-scroll'>
      <div className='auth-form qr'>
        <div className='qr-outer'>
          <CSSTransition in={isQrMounted} timeout={300}>
            <div className='qr-inner'>
              <div
                key='qr-container'
                className='qr-container'
                ref={qrCodeRef}
                style={{ width: `${QR_SIZE}px`, height: `${QR_SIZE}px` }}
              />
              {/* <AnimatedIcon
                tgsUrl={LOCAL_TGS_URLS.QrPlane}
                size={QR_PLANE_SIZE}
                className='qr-plane'
                nonInteractive
                noLoop={false}
              /> */}
            </div>
          </CSSTransition>
          <div className='AvatarEditable'>
            <AnimatedIcon tgsUrl={LOCAL_TGS_URLS.Invite} size={140} />
          </div>
          {!isQrMounted && (
            <div className='qr-loading'>
              <Loading />
            </div>
          )}
        </div>
        <div className='title'>{t('Login.qr_heading')}</div>
        <ol>
          <li>
            <span>1. {t('Login.qr_help1')}</span>
          </li>
          <li>
            <span>2. {t('Login.qr_help2')}</span>
          </li>
          <li>
            <span>3. {t('Login.qr_help3')}</span>
          </li>
        </ol>
        <Button isLink ripple onClick={habdleReturnToAuthPassword}>
          {t('Login.by_login')}
        </Button>
      </div>
    </div>
  );
};

export default memo(
  withGlobal((global): StateProps => {
    const {
      connectionState,
      authState,
      authQrCode,
      settings: {
        byKey: { language },
      },
    } = global;

    return {
      connectionState,
      authState,
      authQrCode,
      language,
    };
  })(AuthCode)
);
