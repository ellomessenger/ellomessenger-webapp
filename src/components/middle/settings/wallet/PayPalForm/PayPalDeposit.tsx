import React, { FC } from 'react';
import * as Yup from 'yup';
import { SettingsScreens } from '../../../../../types';
import { GlobalState, IPayment, IWallet } from '../../../../../global/types';
import { useTranslation } from 'react-i18next';
import { getActions, withGlobal } from '../../../../../global';
import { Field, FormikProvider, useFormik } from 'formik';
import Loading from '../../../../ui/Loading';
import elloCard from '../../../../../assets/images/card/PayPal.png';
import { getMoneyFormat } from '../../../../../util/convertMoney';
import Input from '../../../../ui/Formik/Input';
import Button from '../../../../ui/Button';
import IconSvg from '../../../../ui/IconSvg';
import { pick } from '../../../../../util/iteratees';

type OwnProps = {
  payment: IPayment | undefined;
  wallet: IWallet;
  onScreenSelect: (screen: SettingsScreens) => void;
};

type StateProps = Pick<GlobalState, 'limitsAndFee'>;

const PayPalDeposit: FC<OwnProps & StateProps> = ({
  payment,
  wallet,
  limitsAndFee,
  onScreenSelect,
}) => {
  const { t } = useTranslation();

  const { getPayPalPaymentLink, getWalletPaymentById, apiUpdate, getWallets } =
    getActions();

  const { paypal_min_deposit_amount } = limitsAndFee || {};

  const onSubmitForm = (values: { amount: string }) => {
    getPayPalPaymentLink({
      asset_id: 2,
      wallet_id: wallet.id,
      currency: 'usd',
      // message: number,
      amount: +values.amount,
    });
  };

  const validationSchema = Yup.object().shape({
    amount: Yup.string()
      .required(t('Validation.required_field'))
      .test(
        'min',
        t('Validation.min_deposit', { amount: '$10:00' }),
        (value) => Number(value) >= 10
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
    <>
      <form
        onSubmit={formik.handleSubmit}
        className='form-height transfer-form'
      >
        {payment?.status && ['connecting'].includes(payment?.status) ? (
          <Loading
            title={t(
              payment?.status === 'connecting'
                ? 'Connecting'
                : payment?.status === 'processing'
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
                {t('Wallet.MinimumDeposit')}
                <IconSvg name='dollar' w='14' h='14' />
                {getMoneyFormat(paypal_min_deposit_amount, 2, 2)}
              </div>

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

export default withGlobal((global) => pick(global, ['limitsAndFee']))(
  PayPalDeposit
);
