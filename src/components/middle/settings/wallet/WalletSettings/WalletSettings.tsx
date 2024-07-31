import React, { FC, useCallback, useState } from "react";
import './WalletSettings.scss';
import { useTranslation } from "react-i18next";
import RadioGroup, { IRadioOption } from "../../../../ui/RadioGroup";


const WalletSettings: FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedReason, setSelectedReason] = useState<string>('dollar');

  const WELCOME_TO_YOUR_WALLET: IRadioOption[] = [
    {
      label: 'United States dollar',
      value: 'dollar',
      text: 'USD'
    },
    {
      label: 'Euro',
      value: 'euro',
      text: '€',
    },
    {
      label: 'Kazakhstani tenge',
      value: 'tenge',
      text: 'KZT',
    },
  ];

  const ALL_CURRENCIES: IRadioOption[] = [
    {
      label: 'United States dollar',
      value: 'all_dollar',
      text: 'USD'
    },
    {
      label: 'Euro',
      value: 'all_euro',
      text: '€',
    },
    {
      label: 'Kazakhstani tenge',
      value: 'all_tenge',
      text: 'KZT',
    },
  ];

  const handleRadioChange = useCallback((value: string) => {
    setSelectedReason(value);
  }, []);

  return (
    <div className="wallet__settings-wallet settings-wallet">
      <div className="settings-wallet__wrap">
        <h2 className="global-title blue-text">Welcome to your wallet!</h2>
        <div className="settings-wallet__check-box">
          <RadioGroup
            name=""
            options={WELCOME_TO_YOUR_WALLET}
            onChange={handleRadioChange}
            selected={selectedReason}
          />
        </div>
      </div>

      <div className="settings-wallet__wrap">
        <h2 className="global-title blue-text">All currencies</h2>
        <div className="settings-wallet__check-box">
          <RadioGroup
            name=""
            options={ALL_CURRENCIES}
            onChange={handleRadioChange}
            selected={selectedReason}
          />
        </div>
      </div>
    </div>
  )
}

export default WalletSettings;
