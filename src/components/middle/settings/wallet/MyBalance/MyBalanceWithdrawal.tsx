import React, { FC, memo, useEffect, useState } from 'react';
import { Field, Form, Formik, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '../../../../ui/Button';

import { useTranslation } from 'react-i18next';
import { getActions, withGlobal } from '../../../../../global';
import { pick } from '../../../../../util/iteratees';
import {
  IPayment,
  IWallet,
  IWithdrawTemplate,
} from '../../../../../global/types';
import Input from '../../../../ui/Formik/Input';

import { SettingsScreens } from '../../../../../types';
import { getMoneyFormat } from '../../../../../util/convertMoney';
import IconSvg from '../../../../ui/IconSvg';
import classNames from 'classnames';
import IconSvgSettings from '../../icons/IconSvgSettings';

type OwnProps = {
  wallet: IWallet;
  onScreenSelect: (screen: SettingsScreens) => void;
};

type StateProps = {
  wallets: IWallet[];
  withdrawTemplate?: IWithdrawTemplate;
};

const initialValue = {
  amount: '',
};

export const MyBalanceWithdrawal: FC<OwnProps & StateProps> = ({
  wallet,
  wallets,
  withdrawTemplate,
  onScreenSelect,
}) => {
  const { t } = useTranslation();
  const { withdrawalToWallet, getWallets, getFeeForInternalTransaction } =
    getActions();

  const validationSchema = Yup.object().shape({
    amount: Yup.string()
      .required(t('Validation.required_field'))
      .test(
        'min',
        t('Validation.min_withdrawal', {
          amount: '0.01',
        }),
        (value) => Number(value) >= 0.01
      )
      .test(
        'max',
        t('Validation.insufficient_funds'),
        (value) => wallet.amount > Number(value)
      ),
  });

  const toId = wallets.find((el) => el.type === 'main')?.id;
  const { fee, amount: some } = withdrawTemplate || {};

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    onSubmit: (values: { amount: string }, { resetForm }) => {
      if (toId) {
        withdrawalToWallet({
          from_wallet_id: wallet.id,
          to_wallet_id: toId,
          amount: Number(amount),
        });
      }
      resetForm();
    },
  });

  useEffect(() => {
    const { amount } = formik.values;
    if (toId) {
      getFeeForInternalTransaction({
        from_wallet_id: wallet.id,
        to_wallet_id: toId,
        amount: Number(amount),
      });
    }
  }, [formik.values.amount]);

  const { amount } = formik.values;
  const noMoney = Number(amount) > wallet.amount;

  return (
    <form onSubmit={formik.handleSubmit} className='form-height transfer-form'>
      <div className={classNames('error-line', { active: noMoney })}>
        {t('Errors.not_enough_funds')}
      </div>
      <div className='form-inner form-inner-custom center-error'>
        <div className='form-ello-img'>
          <IconSvg name='my_balance' />
        </div>

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
            0.01
          </div>
          <div className='description amount'>
            {t('Wallet.Commission', {
              amount: undefined,
            })}
            <IconSvg name='dollar' w='14' h='14' />
            {getMoneyFormat(fee, 2, 2)}
          </div>
          <div className='description amount mb-6'>
            {t('Wallet.YouWillReceiveApproximately', {
              amount: undefined,
            })}
            <IconSvg name='dollar' w='14' h='14' />
            {getMoneyFormat(some, 2, 2)}
          </div>
          <div className='form-submit'>
            <Button
              type='submit'
              fullWidth
              isShiny
              disabled={!formik.isValid || formik.isSubmitting}
            >
              {t('Confirm')}
            </Button>
          </div>
        </FormikProvider>
      </div>
    </form>
  );
};

export default withGlobal((global) =>
  pick(global, ['wallets', 'withdrawTemplate'])
)(MyBalanceWithdrawal);
