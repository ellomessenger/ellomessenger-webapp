import React, { ChangeEvent, FC, memo, useCallback, useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { getActions } from '../../../../../lib/teact/teactn';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import Input from '../../../../ui/Formik/Input';
import SelectCountry from '../../../../ui/Formik/SelectCountry/SelectCountry';
import Button from '../../../../ui/Button';
import { withGlobal } from '../../../../../global';
import { GlobalState, IBankRequisites } from '../../../../../global/types';
import { getMoneyFormat } from '../../../../../util/convertMoney';
import InputPhone from '../../../../ui/Formik/Input/InputPhone';
import { USA_STATE } from '../../../../../config';
import SelectDropdown from '../../../../ui/Formik/SelectDropdown/SelectDropdown';
import Checkbox from '../../../../ui/Checkbox';
import { ApiCountryCode } from '../../../../../api/types';
import { SettingsScreens } from '../../../../../types';
import IconSvg from '../../../../ui/IconSvg';

const recipient = ['Individual', 'Business'];
enum ECurrency {
  usd = 'USD',
  eur = 'EUR',
}

type OwnProps = {
  onScreenSelect: (screen: SettingsScreens) => void;
};

type StateProps = {
  phoneCodeList: ApiCountryCode[];
  bankWithdrawRequisites?: IBankRequisites;
} & Pick<GlobalState, 'withdrawTemplate'>;

const BankRequisits: FC<StateProps & OwnProps> = ({
  withdrawTemplate,
  bankWithdrawRequisites,
  phoneCodeList,
  onScreenSelect,
}) => {
  const { ereateBankWithdrawRequisites, editBankWithdrawRequisites } =
    getActions();
  const { t } = useTranslation();
  const [saveDetails, setSaveDetails] = useState(true);
  const {
    person_info,
    bank_info,
    currency,
    business_id_number,
    address_info,
    recipient_type,
  } = bankWithdrawRequisites || {};

  const { bank_withdraw_requisites_id } = withdrawTemplate || {};

  const country = phoneCodeList.find(
    (el) => el.defaultName.toLowerCase() === bank_info?.country.toLowerCase()
  );

  const initialValues = {
    recipient_type: recipient_type || recipient[0],
    personal_first_name: person_info?.first_name || '',
    personal_last_name: person_info?.last_name || '',
    personal_phone_number: person_info?.phone_number || '',
    personal_email: person_info?.email || '',
    currency: currency || 'usd',
    bank_country: country?.countryCode || '',
    bank_routing_number: bank_info?.routing_number || '',
    message: '',
    bank_name: bank_info?.name || '',
    bank_street: bank_info?.street || '',
    bank_city: bank_info?.city || '',
    bank_state: bank_info?.state || '',
    bank_swift: bank_info?.swift || '',
    bank_address: bank_info?.address || '',
    bank_postal_code: bank_info?.postal_code || '',
    bank_zip_code: bank_info?.zip_code || '',
    bank_recipient_account_number: bank_info?.recipient_account_number || '',
    business_id_number: business_id_number || '',
    verify_account_number: bank_info?.recipient_account_number || '',
    user_address_address: '',
    user_address_street: address_info?.street || '',
    user_address_city: address_info?.city || '',
    user_address_state: address_info?.state || '',
    user_address_region: address_info?.region || '',
    user_address_zip_code: address_info?.zip_code || '',
    user_address_postal_code: address_info?.postal_code || '',
  };

  const validationSchema = Yup.object().shape({
    bank_country: Yup.string().required(t('Validation.country_required')),
    personal_first_name: Yup.string()
      .required(t('Validation.required_firstname'))
      .min(1, t('min_length', { count: 1 }))
      .max(64, t('max_length', { count: 64 })),
    personal_last_name: Yup.string()
      .min(1, t('min_length', { count: 1 }))
      .max(64, t('max_length', { count: 64 })),
    personal_phone_number: Yup.string().required(
      t('Validation.required_field')
    ),
    personal_email: Yup.string().required(t('Validation.required_field')),
    //user_address_address: Yup.string().required(t('Validation.required_field')),
    user_address_street: Yup.string().required(t('Validation.required_field')),
    user_address_city: Yup.string().required(t('Validation.required_field')),
    user_address_state: Yup.string().when(['bank_country'], {
      is: (bank_country: string) => bank_country === 'USA',
      then: () => Yup.string().required(t('Validation.required_field')),
    }),
    user_address_region: Yup.string().when(['bank_country'], {
      is: (bank_country: string) => bank_country !== 'USA',
      then: () => Yup.string().required(t('Validation.required_field')),
    }),
    user_address_zip_code: Yup.string().when(['bank_country'], {
      is: (bank_country: string) => bank_country === 'USA',
      then: () => Yup.string().required(t('Validation.required_field')),
    }),
    user_address_postal_code: Yup.string().when(['bank_country'], {
      is: (bank_country: string) => bank_country !== 'USA',
      then: () => Yup.string().required(t('Validation.required_field')),
    }),
    bank_name: Yup.string().required(t('Validation.required_field')),
    bank_street: Yup.string().when(['bank_country'], {
      is: (bank_country: string) => bank_country === 'USA',
      then: () => Yup.string().required(t('Validation.required_field')),
    }),
    bank_city: Yup.string().when(['bank_country'], {
      is: (bank_country: string) => bank_country === 'USA',
      then: () => Yup.string().required(t('Validation.required_field')),
    }),
    bank_state: Yup.string().when(['bank_country'], {
      is: (bank_country: string) => bank_country === 'USA',
      then: () => Yup.string().required(t('Validation.required_field')),
    }),
    business_id_number: Yup.string().when(['recipient_type'], {
      is: (recipient_type: string) => recipient_type !== recipient[0],
      then: () => Yup.string().required(t('Validation.required_field')),
    }),
    // bank_zip_code: Yup.string().when(['bank_country'], {
    //   is: (bank_country: string) => bank_country === 'USA',
    //   then: () => Yup.string().required(t('Validation.required_field')),
    // }),
    bank_recipient_account_number: Yup.string().required(
      t('Validation.required_field')
    ),
    verify_account_number: Yup.string()
      .required(t('Validation.required_field'))
      .oneOf(
        [Yup.ref('bank_recipient_account_number'), ''],
        t('Validation.field_not_match')
      ),
  });

  const checkSave = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSaveDetails(e.target.checked);
  }, []);

  const onSubmitBankTransferDesc = (values: any) => {
    if (bank_withdraw_requisites_id) {
      editBankWithdrawRequisites({
        template_id: bank_withdraw_requisites_id,
        data: { ...values },
      });
    } else {
      ereateBankWithdrawRequisites({
        data: { ...values, is_template: saveDetails },
      });
    }

    onScreenSelect(SettingsScreens.BankRequest);
  };

  if (bank_withdraw_requisites_id && !bankWithdrawRequisites) return undefined;

  return (
    <div className='settings-container bank-transfer'>
      <h3 className='mb-5'>{t('Wallet.BankTransfer')}</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          onSubmitBankTransferDesc({
            ...values,
            bank_country: phoneCodeList.find(
              (el) => el.countryCode === values.bank_country
            )?.defaultName,
          });
          setSubmitting(false);
          resetForm();
        }}
      >
        {({ isValid, isSubmitting, values }) => {
          return (
            <Form className='transfer-form'>
              <div className='form-inner-custom'>
                <div className='bank-transfer__label'>Bank country</div>
                <Field
                  name='bank_country'
                  component={SelectCountry}
                  value={country}
                />
                {values.bank_country !== 'USA' && (
                  <>
                    <div className='input-group'>
                      <div>
                        <div className='bank-transfer__label'>
                          Recipient type
                        </div>
                        <Field
                          component={SelectDropdown}
                          label={t('Wallet.email_address')}
                          dataList={recipient}
                          name='recipient_type'
                          value={recipient_type}
                        />
                      </div>
                      <div className='with-description'>
                        <div className='bank-transfer__label'>
                          {t('Currency')}
                        </div>
                        <div>
                          <Field
                            component={SelectDropdown}
                            dataList={ECurrency}
                            name='currency'
                            value={currency}
                          />
                          <p className='bank-transfer__gray'>
                            {t('Validation.add_without_spaces')}
                          </p>
                        </div>
                      </div>
                    </div>
                    {values.recipient_type !== recipient[0] && (
                      <>
                        <Field
                          name='business_id_number'
                          component={Input}
                          label={t('Individual Identification Number')}
                        />
                        <p className='bank-transfer__gray'>
                          {'Please add Business Identification Number.'}
                        </p>
                      </>
                    )}
                  </>
                )}

                <div className='bank-transfer__label mt-4'>Personal info</div>
                <div className='input-group'>
                  <Field
                    name='personal_first_name'
                    component={Input}
                    label={t('First name')}
                  />
                  <Field
                    name='personal_last_name'
                    component={Input}
                    label={t('Last Name')}
                  />
                  <Field
                    name='personal_phone_number'
                    component={InputPhone}
                    label={t('Phone number')}
                  />
                  <Field
                    name='personal_email'
                    component={Input}
                    label={t('Email')}
                  />
                </div>

                <div className='bank-transfer__label mt-4'>Address</div>
                <div className='input-group'>
                  {/* <Field
                    name='user_address_address'
                    component={Input}
                    label={t('Your address')}
                  /> */}
                  <Field
                    name='user_address_street'
                    component={Input}
                    label={t('Street')}
                  />
                  <Field
                    name='user_address_city'
                    component={Input}
                    label={t('City')}
                  />
                  {values.bank_country === 'USA' ? (
                    <Field
                      component={SelectDropdown}
                      label='State'
                      dataList={USA_STATE}
                      name='user_address_state'
                    />
                  ) : (
                    <Field
                      name='user_address_region'
                      component={Input}
                      label={t('Region')}
                    />
                  )}
                  {values.bank_country === 'USA' ? (
                    <Field
                      name='user_address_zip_code'
                      component={Input}
                      label={t('ZIP code')}
                    />
                  ) : (
                    <Field
                      name='user_address_postal_code'
                      component={Input}
                      label={t('Postal code (optional)')}
                    />
                  )}
                </div>

                <div className='bank-transfer__label mt-4'> Bank info </div>
                <div className='input-group'>
                  {values.bank_country === 'USA' ? (
                    <>
                      <Field
                        name='bank_name'
                        component={Input}
                        label={t('Bank name')}
                      />
                      <Field
                        name='bank_street'
                        component={Input}
                        label={t('Street')}
                      />
                      <Field
                        name='bank_city'
                        component={Input}
                        label={t('City')}
                      />
                      <Field
                        component={SelectDropdown}
                        label='State'
                        dataList={USA_STATE}
                        name='bank_state'
                      />
                    </>
                  ) : (
                    <>
                      <Field
                        name='bank_name'
                        component={Input}
                        label={t('Bank name')}
                      />
                      <Field
                        name='bank_swift'
                        component={Input}
                        label={t('Swift code')}
                      />
                      {/* <Field
                        name='bank_street'
                        component={Input}
                        label={t('Street')}
                      /> */}
                      {/* <Field
                        name='bank_city'
                        component={Input}
                        label={t('City')}
                      /> */}
                      {/* <Field
                        name='bank_postal_code'
                        component={Input}
                        label={t('Postal code')}
                      /> */}
                    </>
                  )}
                </div>
                {values.bank_country === 'USA' && (
                  <Field
                    name='bank_routing_number'
                    component={Input}
                    label={t('Bank routing number')}
                  />
                )}
                <div className='input-group mb-4'>
                  <Field
                    name='bank_recipient_account_number'
                    component={Input}
                    label={t(
                      values.bank_country === 'USA'
                        ? 'Recipient account number*'
                        : 'IBAN number*'
                    )}
                  />
                  <Field
                    name='verify_account_number'
                    component={Input}
                    label={t(
                      values.bank_country === 'USA'
                        ? 'Verify recipient account number'
                        : 'Re-enter IBAN number'
                    )}
                  />
                  <p className='bank-transfer__gray'>
                    {t('Validation.add_without_spaces')}
                  </p>
                </div>

                <Checkbox
                  label={t('Save bank account details')}
                  checked={saveDetails}
                  onChange={checkSave}
                />
                <div className='bank-transfer__label'>
                  {t('Wallet.WithdrawalAmount')}
                </div>
                <p className='bank-transfer__sum amount'>
                  <IconSvg name='dollar' w='24' h='24' />
                  {getMoneyFormat(withdrawTemplate?.initial_amount, 2, 2)}
                </p>
                <div className='form-submit'>
                  <Button
                    size='smaller'
                    type='submit'
                    isShiny
                    fullWidth
                    disabled={!isValid || isSubmitting}
                  >
                    {t('Wallet.Withdrawal')}
                  </Button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default memo(
  withGlobal((global): StateProps => {
    const {
      countryList: { phoneCodes: phoneCodeList },
      bankWithdrawsRequisites,
      withdrawTemplate,
    } = global;

    return {
      withdrawTemplate,
      bankWithdrawRequisites: bankWithdrawsRequisites?.current,
      phoneCodeList,
    };
  })(BankRequisits)
);
