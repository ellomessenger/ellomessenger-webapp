import React, {
  ChangeEvent,
  FC,
  KeyboardEvent,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { GlobalState } from '../../global/types';
import { getActions, withGlobal } from '../../global';
import { pick } from '../../util/iteratees';
import useInterval from '../../hooks/useInterval';
import Time from '../../util/Time';
import useDebouncedCallback from '../../hooks/useDebouncedCallback';
import SafeImg from '../../assets/Safe.png';
import { ConfirmEmailType } from '../../types';
import useEffectWithPrevDeps from '../../hooks/useEffectWithPrevDeps';

type OwnProps = {
  title?: string;
  text?: string;
  setScreen?: () => void;
};

type StateProps = Pick<GlobalState, 'confirmData'>;

const VerifyEmailForm: FC<OwnProps & StateProps> = ({
  title,
  text,
  setScreen,
  confirmData,
}) => {
  const {
    confirmForgotPassword,
    confirmEmail,
    setAuthCode,
    setRegistrationCode,
    changeEmail,
    changePassword,
    deleteAccount,
    approveWithdraw,
    setAuthUsernameAndPassword,
    requestForgotPassword,
    signUp,
    resendConfirmationCode,
    getConfirmCodeFromChangeEmail,
    getConfirmCodeFromWithdraw,
  } = getActions();
  const {
    type,
    expire = 0,
    email,
    password,
    newPassword,
    wallet_id,
    payment_id,
    username,
    error,
    params,
  } = confirmData! || {};

  const { t } = useTranslation();
  const [seconds, setSeconds] = useState(0);

  const [codeValue, setCodeValue] = useState('');
  const [numInput, setNumInput] = useState(0);
  const [localError, setLocalError] = useState('');

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const name = e.target.name;
      const val =
        e.target.value === '' ? ' ' : e.target.value.replace(/[^\d]/g, '');

      if (val.length === 2) {
        setCodeValue(
          codeValue.slice(0, Number(name)) +
            val[0] +
            codeValue.slice(Number(name) + 1)
        );
      } else {
        const maxValue = setCodeValue(
          codeValue.slice(0, Number(name)) +
            val +
            codeValue.slice(Number(name) + val.length)
        );
      }

      setNumInput(+name + 1);
    },
    [codeValue]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const name = (e.target as HTMLInputElement).name;
      if (
        e.key === 'Backspace' &&
        !(e.target as HTMLInputElement).value &&
        name !== '0'
      ) {
        setNumInput(+name - 1);
      }
    },
    [numInput]
  );

  const handleResendEmail = useCallback(() => {
    switch (type) {
      case ConfirmEmailType.confirmAuth:
        if (password) {
          setAuthUsernameAndPassword({ ...params, password });
        }
        break;
      case ConfirmEmailType.forgotPassword:
        if (email && password) {
          requestForgotPassword({ email, password });
        }
        break;
      case ConfirmEmailType.confirmEmail:
        resendConfirmationCode({
          username_or_email: params.email,
          type: ConfirmEmailType.confirmEmail,
        });
        break;
      case ConfirmEmailType.confirmUnauthorized:
        resendConfirmationCode({
          ...params,
          type: ConfirmEmailType.confirmUnauthorized,
        });
        break;
      case ConfirmEmailType.changePassword:
      case ConfirmEmailType.confirmChangeEmail:
        getConfirmCodeFromChangeEmail(params);
        break;
      case ConfirmEmailType.confirmWithdrawal:
        getConfirmCodeFromWithdraw(params);
    }
  }, [type, params]);

  useInterval(() => {
    if (expire && seconds > 0) {
      setSeconds(Time.getSecondsFromExpiry(expire * 1000, true));
    } else if (setScreen) {
      setScreen();
    }
  }, 1000);

  const debaunceRequest = useDebouncedCallback(
    () => {
      if (codeValue.replace(/ /g, '').length >= 6 && type) {
        if (seconds <= 0) {
          setLocalError(t('Errors.incorrect_code'));
          return;
        }
        const cutVal = codeValue.slice(0, 6);
        switch (type) {
          case ConfirmEmailType.confirmEmail:
            if (email) {
              setRegistrationCode({
                email,
                code: cutVal,
              });
            }
            break;
          case ConfirmEmailType.forgotPassword:
            if (email && password) {
              confirmForgotPassword({
                email,
                new_pass: password,
                code: cutVal,
              });
              setCodeValue('');
            }
            break;
          case ConfirmEmailType.confirmAuth:
            if (email) {
              setAuthCode({ code: cutVal, email });
            }
            break;
          case ConfirmEmailType.confirmUnauthorized:
            if (email) {
              confirmEmail({ code: cutVal, email });
            }
            break;
          case ConfirmEmailType.confirmChangeEmail:
            changeEmail({ new_email: email, code: cutVal });
            break;
          case ConfirmEmailType.changePassword:
            if (password && newPassword) {
              changePassword({
                prev_pass: password,
                new_pass: newPassword,
                code: cutVal,
              });
            }
            break;
          case ConfirmEmailType.DeleteAccount:
            deleteAccount({ code: cutVal });
            break;
          case ConfirmEmailType.confirmWithdrawal:
            if (wallet_id && payment_id) {
              approveWithdraw({
                wallet_id,
                payment_id,
                paypal_email: email || undefined,
                bank_withdraw_requisites_id:
                  params.bank_requisites_id || undefined,
                approve_code: cutVal,
              });
            }
            break;
        }
      }
    },
    [codeValue, type],
    600,
    true
  );

  useEffect(() => {
    debaunceRequest();
  }, [codeValue]);

  useEffect(() => {
    setCodeValue('');
    setSeconds(Time.getSecondsFromExpiry(expire * 1000, true));
  }, [expire]);

  useEffectWithPrevDeps(
    ([prevNumInput]) => {
      if (numInput < 6 && codeValue[numInput - 1] !== ' ') {
        const nextInput = document.querySelector<HTMLInputElement>(
          `[name="${numInput}"]`
        )!;
        nextInput.type = 'text';
        if (prevNumInput && prevNumInput > numInput) {
          nextInput.setSelectionRange(1, 1);
        } else {
          nextInput.setSelectionRange(0, 0);
        }
        nextInput.type = 'number';
        nextInput.focus();
      }
    },
    [numInput, codeValue]
  );

  return (
    <div className='auth-form'>
      <img
        className='mb-3'
        src={SafeImg}
        alt=''
        loading='lazy'
        width='130'
        height='120'
      />
      {title && <h2 className='mb-2'>{title}</h2>}
      {text && <p className='text-muted mb-0'>{text}</p>}
      <div className='text-red'>
        Also, remember to check your spam and junk email folders.
      </div>

      <div className='verifi-input-wrap'>
        {[...Array(6).keys()].map((_, idx) => {
          return (
            <input
              key={idx}
              name={String(idx)}
              value={codeValue[idx] || ''}
              className='form-control'
              type='number'
              inputMode='numeric'
              onInput={onChange}
              onKeyDown={onKeyDown}
              disabled={codeValue.length < idx}
            />
          );
        })}
        {(error || localError) && (
          <p className='input-notification--error'>{error || localError}</p>
        )}
      </div>

      <div className='verify-timer-wpapper'>
        <p>{t('ForgotPassword.VerificationRequest')}</p>
        <p className='verify-timer'>
          <span>{seconds}</span> <span className='text-muted'>seconds</span>
        </p>
        {type && !seconds && (
          <p>
            {t('ForgotPassword.VerificationReceive')}{' '}
            <span
              role='button'
              className='text-primary'
              onClick={handleResendEmail}
            >
              {t('Settings.ResendEmail')}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default memo(
  withGlobal((global): StateProps => pick(global, ['confirmData']))(
    VerifyEmailForm
  )
);
