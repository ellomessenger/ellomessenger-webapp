import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getActions, withGlobal } from '../../../../../global';
import { Field, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { GlobalState, IPayment, IWallet } from '../../../../../global/types';
import { SettingsScreens } from '../../../../../types';
import Loading from '../../../../ui/Loading';
import elloCard from '../../../../../assets/images/card/PayPal.png';
import { getMoneyFormat } from '../../../../../util/convertMoney';
import Input from '../../../../ui/Formik/Input';
import Button from '../../../../ui/Button';
import useLastCallback from '../../../../../hooks/useLastCallback';
import { pick } from '../../../../../util/iteratees';
import classNames from 'classnames';
import IconSvgSettings from '../../icons/IconSvgSettings';
import IconSvg from '../../../../ui/IconSvg';

type OwnProps = {
  payment: IPayment | undefined;
  wallet: IWallet;
  onScreenSelect: (screen: SettingsScreens) => void;
};

type StateProps = Pick<GlobalState, 'withdrawTemplate' | 'limitsAndFee'>;

const PayPalWithdrawal: FC<OwnProps & StateProps> = ({
  payment,
  wallet,
  withdrawTemplate,
  limitsAndFee,
  onScreenSelect,
}) => {
  const { createWithdrawTemplate, getConfirmCodeFromWithdraw } = getActions();

  const { t } = useTranslation();
  const {
    fee = 0,
    withdraw_min = 0,
    payment_system_fee = 0,
    payment_id,
    amount_fiat = 0,
  } = withdrawTemplate || {};

  const { pack_buy_fee = 0 } = limitsAndFee || {};

  const onSubmitForm = useLastCallback(
    (values: { amount?: string; paypal_email?: string }) => {
      const { paypal_email } = values;
      if (payment_id && paypal_email) {
        getConfirmCodeFromWithdraw({
          email: paypal_email,
          payment_id,
          wallet_id: wallet.id,
        });
      }
    }
  );

  const validationSchema = Yup.object().shape({
    amount: Yup.string()
      .required(t('Validation.required_field'))
      .test(
        'min',
        t('Validation.min_withdrawal', {
          amount: getMoneyFormat(withdraw_min, 2, 2),
        }),
        (value) => Number(value) >= withdraw_min
      )
      .test(
        'max',
        t('Validation.insufficient_funds'),
        (value) => wallet.amount > Number(value)
      ),
    paypal_email: Yup.string()
      .required(t('Validation.required_email'))
      .email(t('Validation.email_format')),
  });

  const formik = useFormik({
    initialValues: {
      amount: '',
      paypal_email: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      onSubmitForm(values);
      resetForm();
    },
  });

  const { amount } = formik.values;
  const noMoney = Number(amount) > wallet.amount;

  useEffect(() => {
    const { amount } = formik.values;
    if (Number(amount) > 0) {
      createWithdrawTemplate({
        asset_id: 2,
        amount: Number(amount),
        wallet_id: wallet.id,
        currency: wallet.asset_symbol,
        payment_id: payment_id || undefined,
        initial_amount: Number(amount),
      });
    }
  }, [formik.values.amount]);

  // useEffect(() => {
  //   const id = setInterval(() => {
  //     if (payment?.payment_id) {
  //       getWalletPaymentById({
  //         payment_id: payment.payment_id!,
  //         wallet_id: wallet.id,
  //       });
  //     }
  //   }, 6000);

  //   return () => clearInterval(id);
  // }, [payment?.payment_id]);

  return (
    <form onSubmit={formik.handleSubmit} className='form-height transfer-form'>
      <div className={classNames('error-line', { active: noMoney })}>
        {t('Errors.not_enough_funds')}
      </div>
      {payment?.status === 'connecting' || payment?.status === 'processing' ? (
        <Loading
          title={t(
            payment.status === 'connecting'
              ? 'Connecting'
              : payment.status === 'processing'
              ? 'InProgress'
              : ''
          )}
          text={t('PleaseDontClose')}
        />
      ) : (
        <div className='form-inner form-inner-custom center-error'>
          <img className='form-ello-img' src={elloCard} alt='' />
          <div className='form-sum-balance amount'>
            Balance:{' '}
            <span className='price'>
              <IconSvg name='dollar' w='14' h='14' />
              {getMoneyFormat(wallet.amount, 2, 2)}
            </span>
          </div>
          <FormikProvider value={formik}>
            <Field
              className='input-not-border'
              name='amount'
              autoFocus
              component={Input}
              regexp={/[^\d.]/g}
            />

            <div className='description amount'>
              {t('Wallet.MinimumWithdrawal')}
              <IconSvg name='dollar' w='14' h='14' />
              {getMoneyFormat(withdraw_min, 2, 2)}
            </div>
            <div className='description amount'>
              {t('Wallet.Commission', {
                amount: `$${getMoneyFormat(
                  //((fee + PaymentSystemFee) * (pack_buy_fee + 100)) / 100,
                  fee + payment_system_fee,
                  2,
                  2
                )}`,
              })}
            </div>
            <div className='description amount mb-6'>
              {t('Wallet.YouWillReceiveApproximately', {
                amount: `$${getMoneyFormat(
                  amount_fiat > 0 ? amount_fiat : 0,
                  2,
                  2
                )}`,
              })}
            </div>
            <Field
              name='paypal_email'
              component={Input}
              label={t('Registration.place_email')}
            />

            <div className='form-submit'>
              <Button
                type='submit'
                fullWidth
                size='smaller'
                isShiny
                disabled={!formik.isValid || formik.isSubmitting}
              >
                {t('Connect')}
              </Button>
            </div>
          </FormikProvider>
        </div>
      )}
    </form>
  );
};

export default withGlobal((global) =>
  pick(global, ['withdrawTemplate', 'limitsAndFee'])
)(PayPalWithdrawal);
