import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import renderText from '../../common/helpers/renderText';
import Checkbox from '../../ui/Checkbox';
import Button from '../../ui/Button';
import useLastCallback from '../../../hooks/useLastCallback';
import { SettingsScreens } from '../../../types';

type OwnProps = { onScreenSelect: (screen: SettingsScreens) => void };

const SettingsDeleteUserInfo: FC<OwnProps> = ({ onScreenSelect }) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);
  const handleDeleteAccount = useLastCallback(() => {
    onScreenSelect(SettingsScreens.BeforeDeletingUser);
  });
  return (
    <div className='settings-container'>
      <div className='settings-privacy'>
        <h2>{t('Settings.AccountDeletionInformationTitle')}</h2>
        <p className='text-smaller mb-4'>
          {t('Settings.AccountDeletionDescription')}
        </p>
        <h3>1. {t('Settings.WithdrawYourLeftoverBalance')}</h3>
        <p className='text-smaller mb-4'>
          {renderText(t('Settings.WithdrawYourLeftoverBalanceText'), ['br'])}
        </p>
        <h3>2. {t('Settings.CancelYourActiveSubscriptions')}</h3>
        <p className='text-smaller mb-4'>
          {renderText(t('Settings.CancelYourActiveSubscriptionsText'), ['br'])}
        </p>
        <h3>3. {t('Settings.CancelSubscriptionsMadeAppleorGoogle')}</h3>
        <p className='text-smaller mb-4'>
          {renderText(t('Settings.CancelSubscriptionsMadeAppleorGoogleText'), [
            'br',
          ])}
        </p>
        <h3>4. {t('Settings.TransferOwnershipOrDeletePaidChannels')}</h3>
        <p className='text-smaller mb-4'>
          {renderText(t('Settings.TransferOwnershipOrDeletePaidChannelsText'), [
            'br',
          ])}
        </p>
        <p className='text-smaller mb-4'>
          {renderText(t('Settings.AfterYouHaveCompleted'), ['br'])}
        </p>
        <div className='settings-item-middle'>
          <Checkbox
            label={t('IHaveReadAndUnderstood')}
            checked={checked}
            onChange={() => setChecked(!checked)}
          />
        </div>

        <div className='form-submit'>
          <Button
            color='danger'
            disabled={!checked}
            onClick={handleDeleteAccount}
          >
            {t('Settings.DeleteAccount')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsDeleteUserInfo;
