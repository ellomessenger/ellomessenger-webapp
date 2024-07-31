import HCaptcha from '@hcaptcha/react-hcaptcha';
import classNames from 'classnames';
import React, { FC } from 'react';
import { IProps } from './tepes';

export const Captcha: FC<IProps> = ({ onLoad, setToken, captchaRef, token }) => {
  return (
    <div
      className={classNames('captcha-center', { 'captcha-right': true })}
    >
      <HCaptcha
        // theme='dark'
        sitekey='c72610d4-b954-4302-8195-423734d53486'
        onLoad={onLoad}
        onVerify={(token) => setToken(token)}
        onExpire={() => setToken('')}
        ref={captchaRef}
      />

      {/* <div className='custom-captcha__item custom-captcha__item--frame position-block-custom'>
        {token ? (
          <span>
            <div>I am a human</div>
            <div>
              <SuccessSvg />
            </div>
          </span>
        ) : (
          <span>
            Click here! <br />
            {`I'm not bot`}
          </span>
        )}
      </div> */}
    </div>
  );
};
