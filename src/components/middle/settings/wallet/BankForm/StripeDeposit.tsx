import React, { FC, useCallback, useEffect } from 'react';
import * as Yup from 'yup';
import { SettingsScreens } from '../../../../../types';
import {
  IPayment,
  IWallet,
  IWalletSystemLimit,
} from '../../../../../global/types';
import { useTranslation } from 'react-i18next';
import { getActions } from '../../../../../global';
import { Field, FormikProvider, useFormik } from 'formik';
import Loading from '../../../../ui/Loading';
import elloCard from '../../../../../assets/images/card/Stripe.png';
import { getMoneyFormat } from '../../../../../util/convertMoney';
import Input from '../../../../ui/Formik/Input';
import Button from '../../../../ui/Button';
import IconSvgSettings from '../../icons/IconSvgSettings';
import IconSvg from '../../../../ui/IconSvg';

type OwnProps = {
  payment: IPayment | undefined;
  wallet: IWallet;
  limitsAndFee: IWalletSystemLimit;
  onScreenSelect: (screen: SettingsScreens) => void;
};

const StripeDeposit: FC<OwnProps> = ({
  payment,
  wallet,
  limitsAndFee,
  onScreenSelect,
}) => {
  const { t } = useTranslation();

  const { getStripePaymentLink, getWalletPaymentById } = getActions();
  const { pack_buy_fee, stripe_min_deposit_amount } = limitsAndFee;
  const onSubmitForm = (values: { amount: string }) => {
    getStripePaymentLink({
      asset_id: 2,
      wallet_id: wallet.id,
      currency: 'usd',
      // message: number,
      coins: +values.amount,
    });
  };

  const validationSchema = Yup.object().shape({
    amount: Yup.string()
      .required(t('Validation.required_field'))
      .test(
        'min',
        t('Validation.min_deposit', {
          amount: getMoneyFormat(stripe_min_deposit_amount, 2, 2),
        }),
        (value) => Number(value) >= stripe_min_deposit_amount
      ),
  });

  const formik = useFormik({
    initialValues: {
      amount: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      onSubmitForm(values);
      resetForm();
    },
  });

  useEffect(() => {
    const id = setInterval(() => {
      if (payment?.payment_id) {
        getWalletPaymentById({
          payment_id: payment.payment_id!,
          wallet_id: wallet.id,
        });
      }
    }, 6000);

    return () => clearInterval(id);
  }, [payment?.payment_id]);

  const getWillPay = useCallback(() => {
    if (formik.values.amount) {
      const amount = Number(formik.values.amount);
      return getMoneyFormat(amount + (amount * pack_buy_fee) / 100, 2, 2);
    } else {
      return 0;
    }
  }, [formik.values.amount]);

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className='form-height transfer-form'
      >
        {payment?.status &&
        ['connecting', 'processing'].includes(payment.status) ? (
          <Loading
            title={t(
              payment.status === 'connecting'
                ? 'Connecting'
                : payment.status === 'processing'
                ? 'InProgress'
                : ''
            )}
            text={t('PleaseDontCloseStripe')}
          />
        ) : (
          <div className='form-inner form-inner-custom center-error'>
            <img className='form-ello-img' src={elloCard} alt='' />
            <div className='form-sum-balance amount'>
              Balance:
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

              <div className='description'>
                {t('Wallet.MinimumDeposit')}
                <IconSvg name='dollar' w='14' h='14' />
                {getMoneyFormat(stripe_min_deposit_amount, 2, 2)}
              </div>
              {/* <div className='description'>
                {t('Wallet.YouWillPay')}
                <IconSvg name='dollar' w='14' h='14' />
                {getMoneyFormat(getWillPay(), 2, 2)}
              </div> */}

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
    </>
  );
};

export default StripeDeposit;
