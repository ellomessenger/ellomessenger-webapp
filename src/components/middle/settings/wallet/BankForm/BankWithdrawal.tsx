import React, { FC, memo, useEffect } from 'react';
import { Field, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '../../../../ui/Button';

import { useTranslation } from 'react-i18next';
import { getActions, withGlobal } from '../../../../../global';
import { GlobalState, IWallet } from '../../../../../global/types';
import Input from '../../../../ui/Formik/Input';

import elloCard from '../../../../../assets/images/card/transfer.png';
import { SettingsScreens } from '../../../../../types';

import { getMoneyFormat } from '../../../../../util/convertMoney';
import { pick } from '../../../../../util/iteratees';
import classNames from 'classnames';
import IconSvgSettings from '../../icons/IconSvgSettings';
import IconSvg from '../../../../ui/IconSvg';

interface OwnProps {
  wallet: IWallet;
  onScreenSelect: (screen: SettingsScreens) => void;
}

type StateProps = Pick<GlobalState, 'withdrawTemplate' | 'limitsAndFee'>;

export const BankWithdrawal: FC<OwnProps & StateProps> = ({
  wallet,
  withdrawTemplate,
  onScreenSelect,
  limitsAndFee,
}) => {
  const { createWithdrawTemplate } = getActions();
  const { t } = useTranslation();

  const {
    fee = 0,
    withdraw_min = 0,
    payment_system_fee = 0,
    payment_id,
    amount_fiat = 0,
  } = withdrawTemplate || {};

  const { pack_buy_fee = 0, bank_withdraw_min } = limitsAndFee || {};

  const validationSchema = Yup.object().shape({
    amount: Yup.string()
      .required(t('Validation.required_field'))
      .test(
        'min',
        t('Validation.min_withdrawal', {
          amount: getMoneyFormat(withdraw_min, 2, 2),
        }),
        (value) => Number(value) >= withdraw_min
      ),
  });

  const formik = useFormik({
    initialValues: { amount: '' },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm, setSubmitting }) => {
      onScreenSelect(SettingsScreens.BanksRequisitsList);
      setSubmitting(false);
      //resetForm();
    },
  });

  const { amount } = formik.values;
  const noMoney = Number(amount) > wallet.amount;

  useEffect(() => {
    if (Number(amount) > 0) {
      createWithdrawTemplate({
        asset_id: 2,
        amount: Number(amount),
        wallet_id: wallet.id,
        currency: wallet.asset_symbol,
        payment_id: payment_id || undefined,
        initial_amount: Number(amount),
        withdraw_system: 'bank',
      });
    }
  }, [amount]);

  useEffect(() => {
    if (!withdrawTemplate && Boolean(amount)) {
      formik.resetForm();
    }
  }, [withdrawTemplate]);

  return (
    <form onSubmit={formik.handleSubmit} className='form-height transfer-form'>
      <div className={classNames('error-line', { active: noMoney })}>
        {t('Errors.not_enough_funds')}
      </div>
      <div className='form-inner form-inner-custom center-error'>
        <img className='form-ello-img' src={elloCard} alt='' />
        <div className='form-sum-balance amount'>
          Balance: <IconSvg name='dollar' w='14' h='14' />
          {getMoneyFormat(wallet.amount, 2, 2)}
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
          <div className='form-submit'>
            <Button
              type='submit'
              fullWidth
              size='smaller'
              isShiny
              disabled={!formik.isValid || formik.isSubmitting || noMoney}
            >
              {t('Confirm')}
            </Button>
          </div>
        </FormikProvider>
      </div>
    </form>
  );
};

export default memo(
  withGlobal((global) => pick(global, ['withdrawTemplate', 'limitsAndFee']))(
    BankWithdrawal
  )
);
