import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import renderText from '../common/helpers/renderText';
import useHistoryBack from '../../hooks/useHistoryBack';

type OwnProps = {
  isActive?: boolean;
  onClose: () => void;
};

const AccountInfo: FC<OwnProps> = ({ isActive, onClose }) => {
  const { t } = useTranslation();

  useHistoryBack({
    isActive,
    onBack: onClose,
  });
  return (
    <div className='account-info-container custom-scroll'>
      <div className='account-info-content'>
        <h2>{t('Registration.personal_title')}</h2>
        <p>{t('Registration.personal_account_description')}</p>
        <div className='text-bubble'>
          {renderText(t('Registration.personal_account_description_list'), [
            'simple_markdown',
            'br',
          ])}
        </div>
        <h2>{t('Registration.business_title')}</h2>
        <p>{t('Registration.business_account_description')}</p>
        <div className='text-bubble'>
          {renderText(t('Registration.business_account_description_list'), [
            'simple_markdown',
            'br',
          ])}
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
