import React, { FC } from 'react';
import * as Yup from 'yup';
import { IWallet } from '../../../../../global/types';
import { SettingsScreens } from '../../../../../types';
import { useTranslation } from 'react-i18next';
import { getActions } from '../../../../../global';
import { Field, Form, Formik } from 'formik';
import { getMoneyFormat } from '../../../../../util/convertMoney';
import Input from '../../../../ui/Formik/Input';
import IconSvg from '../../../../ui/IconSvg';
import valid from 'card-validator';

import bank from '../../../../../assets/images/card/Bank.png';
import IconSvgSettings from '../../icons/IconSvgSettings';
import Button from '../../../../ui/Button';
import moment from 'moment';

const initialValue = {
  amount: '',
  card_number: '',
  mm_yy: '',
  cvv: '',
  holder: '',
};

interface OwnProps {
  wallet: IWallet;
  onScreenSelect: (screen: SettingsScreens) => void;
}

const BankDeposit: FC<OwnProps> = ({ wallet, onScreenSelect }) => {
  const { t } = useTranslation();
  const { makePayment } = getActions();

  const validationSchema = Yup.object().shape({
    amount: Yup.string()
      .required(t('Validation.required_field'))
      .test('min', t('Validation.min_deposit'), (value) => Number(value) >= 10)
      .test(
        'max',
        t('Validation.max_deposit'),
        (value) => Number(value) <= 99999
      ),
    card_number: Yup.string()
      .required(t('Validation.required_card_number'))
      .max(19, t('Validation.max_length_card'))
      .test(
        'test-number', // this is used internally by yup
        'Credit Card number is invalid', // validation message
        (value) => valid.number(value).isValid
      )
      .min(16, t('Validation.min_length_card')),
    mm_yy: Yup.string()
      .required(t('Validation.required_expire_date'))
      .test(
        'test-number', // this is used internally by yup
        'Not a valid expiration date. Example: MM/YY', // validation message
        (value) => {
          if (
            Number(value?.slice(0, 2)) <= 12 &&
            Number(moment().format('YY')) <= Number(value?.slice(3, 5))
          ) {
            if (
              Number(moment().format('MM')) > Number(value?.slice(0, 2)) &&
              Number(moment().format('YY')) === Number(value?.slice(3, 5))
            ) {
              return false;
            }
            return true;
          }
          return false;
        }
      )
      .max(5, t('Validation.max_expire_date')),
    cvv: Yup.string()
      .required(t('Validation.required_cvv'))
      .min(3, t('Validation.min_length'))
      .max(4, t('Validation.max_length')),
  });

  const onSubmitForm = (values: {
    card_number: string;
    mm_yy: string;
    cvv: string;
    amount: string;
  }) => {
    const { card_number, mm_yy, cvv, amount } = values;

    makePayment({
      payment_system: 'stripe',
      asset_id: 2,
      wallet_id: wallet.id,
      currency: 'usd',
      number: card_number.replace(/\s/g, ''),
      exp_month: Number(mm_yy.slice(0, 2)),
      exp_year: Number(mm_yy.slice(2, 4)),
      csv: Number(cvv),
      amount: Number(amount),
    });
  };

  const clearNumber = (value: number | string) => {
    return String(value).replace(/\D+/g, '');
  };

  const formatExpirationDate = (value: number | string) => {
    const clearValue = clearNumber(value);

    if (clearValue.length >= 3) {
      return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
    }

    return clearValue;
  };

  return (
    <Formik
      initialValues={initialValue}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmitForm(values);
        setSubmitting(false);
      }}
    >
      {({ isValid, isSubmitting, dirty, values }) => (
        <Form className='form-height transfer-form'>
          <div className='form-inner'>
            <img className='form-ello-img' src={bank} alt='' />
            <div className='form-sum-balance amount'>
              Balance:{' '}
              <span className='price'>
                <IconSvg name='dollar' w='14' h='14' />
                {getMoneyFormat(wallet.amount, 2, 2)}
              </span>
            </div>
            <div className='center-error'>
              <Field
                className='input-not-border'
                name='amount'
                autoFocus
                component={Input}
                regexp={/[^\d.]/g}
                prefix='$'
              />
            </div>

            <div className='description mb-6'>
              {t('Wallet.MinimumDeposit', { amount: '$10.00' })}
            </div>
            <div className='form-card-title'>
              <b>Card information</b>
            </div>
            <Field
              name='card_number'
              component={Input}
              iconRight={<IconSvg name='card' />}
              label={t('Wallet.card_number')}
              value={values.card_number
                .replace(/\s/g, '')
                .replace(/(\d{4})/g, '$1 ')
                .replace(/\s+\D+/g, '')
                .trim()}
            />
            <div className='form-wrapper'>
              <Field
                name='mm_yy'
                type='text'
                component={Input}
                label={t('Wallet.mm_yy')}
                value={formatExpirationDate(values.mm_yy)}
              />
              <Field
                type='number'
                name='cvv'
                component={Input}
                label={t('Wallet.cvv')}
                maxLength={4}
                iconRight={<IconSvgSettings name='password-check' />}
              />
            </div>
            <div className='form-card-title'>
              <b>Cardholder</b>
            </div>
            <Field name='holder' component={Input} label={t('Name')} />
            <div className='form-submit mt-5'>
              <Button
                fullWidth
                type='submit'
                size='smaller'
                isShiny
                disabled={!isValid || isSubmitting}
              >
                {t(`Pay $${getMoneyFormat(values.amount, 2, 2)}`)}
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default BankDeposit;
