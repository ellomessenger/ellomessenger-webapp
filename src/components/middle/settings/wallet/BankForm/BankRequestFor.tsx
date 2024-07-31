import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IBankRequisites,
  IWallet,
  IWithdrawTemplate,
} from '../../../../../global/types';
import { getActions, withGlobal } from '../../../../../global';
import Loading from '../../../../ui/Loading';
import { getMoneyFormat } from '../../../../../util/convertMoney';
import Button from '../../../../ui/Button';
import useLastCallback from '../../../../../hooks/useLastCallback';
import IconSvgSettings from '../../icons/IconSvgSettings';
import IconSvg from '../../../../ui/IconSvg';
import { SettingsScreens } from '../../../../../types';

type OwnProps = {
  wallet: IWallet;
  onScreenSelect: (screen: SettingsScreens) => void;
};

type StateProps = {
  bankWithdrawRequisites?: IBankRequisites;
  withdrawTemplate?: IWithdrawTemplate;
};

const BankRequestFor: FC<StateProps & OwnProps> = ({
  wallet,
  bankWithdrawRequisites,
  withdrawTemplate,
  onScreenSelect,
}) => {
  const {
    getConfirmCodeFromWithdraw,
    createWithdrawTemplate,
    getBankWithdrawRequisites,
  } = getActions();
  const { t } = useTranslation();
  const {
    person_info,
    bank_info,
    address_info,
    recipient_type,
    business_id_number,
    currency,
  } = bankWithdrawRequisites || {};
  const {
    payment_id,
    initial_amount,
    amount_fiat,
    bank_withdraw_requisites_id,
  } = withdrawTemplate || {};

  const handleWithdraw = useLastCallback(() => {
    if (payment_id) {
      getConfirmCodeFromWithdraw({
        payment_id,
        wallet_id: wallet.id,
        bank_requisites_id: bank_withdraw_requisites_id,
      });
    }
  });

  const onClickBack = useLastCallback(() => {
    onScreenSelect(SettingsScreens.BanksRequisitsList);
  });

  useEffect(() => {
    if (bank_withdraw_requisites_id) {
      createWithdrawTemplate({
        asset_id: 2,
        amount: initial_amount!,
        wallet_id: wallet.id,
        currency: wallet.asset_symbol,
        payment_id: payment_id,
        withdraw_system: 'bank',
        bank_withdraw_requisites_id,
      });
    }
  }, []);

  // useEffect(() => {
  //   getBankWithdrawRequisites({ requisite_id: bank_withdraw_requisites_id! });
  // }, [bank_withdraw_requisites_id]);

  if (!bankWithdrawRequisites) {
    return <Loading />;
  }
  return (
    <div className='settings-container bank-transfer'>
      <div className='request-wrapper'>
        <h3 className='mb-3 text-center'>{t('Wallet.RequestFor')}</h3>

        <>
          <dl className='request-block'>
            <dd>
              <span>{t('FirstName')}</span>
              <b>{person_info?.first_name}</b>
            </dd>
            <dd>
              <span>{t('LastName')}</span>
              <b>{person_info?.last_name}</b>
            </dd>
            <dd>
              <span>{t('PhoneNumber')}</span>
              <b>{person_info?.phone_number}</b>
            </dd>
            <dd>
              <span>{t('Email')}</span>
              <b>{person_info?.email}</b>
            </dd>
          </dl>
          <dl className='request-block'>
            <dd>
              <span>{t('Your address')}</span>
              <b>{`${address_info?.street}, ${address_info?.city}, ${
                bank_info?.country === 'united states'
                  ? `${address_info?.state}, ${address_info?.zip_code}`
                  : `${address_info?.region}, ${address_info?.postal_code}`
              }`}</b>
            </dd>
          </dl>
          <dl className='request-block'>
            <dd>
              <span>{t('Bank country')}</span>
              <b className='text-capitalize'>{bank_info?.country}</b>
            </dd>
            <dd>
              <span>{t('Recipient type')}</span>
              <b>{recipient_type}</b>
            </dd>
            {recipient_type?.toLowerCase() === 'business' && (
              <dd>
                <span>{t('Individual Identification Number')}</span>
                <b>{business_id_number}</b>
              </dd>
            )}
            <dd>
              <span>{t('Currency')}</span>
              <b>{currency?.toUpperCase()}</b>
            </dd>
          </dl>
          <dl className='request-block'>
            <dd>
              <span>{t('BankName')}</span>
              <b>{bank_info?.name}</b>
            </dd>
          </dl>
          {bank_info?.country === 'united states' ? (
            <dl className='request-block'>
              <dd>
                <span>{t('Routing number')}</span>
                <b>{bank_info?.routing_number}</b>
              </dd>
              <dd>
                <span>{t('Recipient account number')}</span>
                <b>{bank_info?.recipient_account_number}</b>
              </dd>
            </dl>
          ) : (
            <dl className='request-block'>
              <dd>
                <span>{t('Swift code')}</span>
                <b>{bank_info?.swift}</b>
              </dd>
              <dd>
                <span>{t('IBAN')}</span>
                <b>{bank_info?.recipient_account_number}</b>
              </dd>
            </dl>
          )}
        </>

        <div className='bank-transfer__label'>
          {t('Wallet.WithdrawalAmount')}
        </div>
        <p className='bank-transfer__sum amount'>
          <IconSvg name='dollar' w='24' h='24' />
          {getMoneyFormat(withdrawTemplate?.initial_amount, 2, 2)}
        </p>
        <div className='buttons-row'>
          <Button outline size='smaller' onClick={onClickBack}>
            {t('Back')}
          </Button>
          <Button size='smaller' onClick={handleWithdraw}>
            {t('Wallet.Withdraw')}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default withGlobal((global): StateProps => {
  const { bankWithdrawsRequisites, withdrawTemplate } = global;

  return {
    withdrawTemplate,
    bankWithdrawRequisites: bankWithdrawsRequisites?.current,
  };
})(BankRequestFor);
