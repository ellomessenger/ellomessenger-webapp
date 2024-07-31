import React, { FC } from 'react';
import Button from '../../../../ui/Button';
import VarietyOfMethods from './VarietyOfMethods/VarietyOfMethods';
import { useTranslation } from 'react-i18next';
import renderText from '../../../../common/helpers/renderText';
import AnimatedIcon from '../../../../common/AnimatedIcon';
import { LOCAL_TGS_URLS } from '../../../../common/helpers/animatedAssets';
import { STICKER_SIZE_TWO_FA } from '../../../../../config';
import { getActions } from '../../../../../global';
import walletEmpty from '../../../../../assets/images/walletEmpty.svg';

const WelcomeWallet: FC = () => {
  const { createWallet } = getActions();
  const { t } = useTranslation();

  const handleActivateWallets = () => {
    createWallet({ asset_id: 2 });
  };

  const descriptionList = t('Wallet.DescriptionList').split(';');

  return (
    <section className='wallet__welcome-page welcome-page'>
      <h3 className='text-center'>{renderText(t('Wallet.Welcome'), ['br'])}</h3>
      <div className='AvatarEditable'>
        <img src={walletEmpty} alt='' loading='lazy' width='160' height='160' />
      </div>

      <div className='welcome-page__wrap'>
        <ul className='welcome-page__desc'>
          {descriptionList.map((string, idx, arr) => (
            <li>{string}</li>
          ))}
        </ul>

        <div className='form-submit'>
          <Button size='smaller' onClick={handleActivateWallets}>
            {t('Wallet.Activate')}
          </Button>
        </div>
        {/* <VarietyOfMethods /> */}
      </div>
    </section>
  );
};

export default WelcomeWallet;
