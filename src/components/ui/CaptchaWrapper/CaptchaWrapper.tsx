import React, { FC, useEffect, useRef, useState } from 'react';
import type HCaptcha from '@hcaptcha/react-hcaptcha';
import { useTranslation } from 'react-i18next';
import { Captcha } from '../Captcha/Captcha';
import useCaptcha from '../../../hooks/useCaptcha';

interface CustomInputProps {
  type?: string;
}

interface IProps {
  onActiveCaptcha: (value: boolean) => void;
  errorCaptcha: string | undefined;
  captchaRef: any;
}

export const CaptchaWrapper: FC<IProps> = ({ onActiveCaptcha, errorCaptcha, captchaRef }) => {
  const { t } = useTranslation();
  const [token, setToken] = useState<HCaptcha | string | null>(null);
  const [error, setError] = useState('');
  const onLoad = useCaptcha();

  useEffect(() => {
    // token && onLoad();
    token && onActiveCaptcha(true);
  }, [token]);

  return (
    <div className='captcha-wrap'>
      <div className=''>
        <Captcha
          onLoad={() => onLoad(setError, token)}
          setToken={setToken}
          captchaRef={captchaRef}
          token={token}
        />
        {/* <button
          onClick={resetCaptcha}
          type='button'
          className='custom-captcha__item custom-captcha__item--btn'
        >
          <RestartSvg />
        </button> */}
      </div>
      {/* {errorCaptcha && (
        <p className='input-notification input-notification--error'>{t(String(errorCaptcha))}</p>
      )} */}
    </div>
  );
};
