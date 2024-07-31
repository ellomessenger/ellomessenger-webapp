import React, { FC } from 'react';
import IconSvg from '../../../../ui/IconSvg';
import ListItem from '../../../../ui/ListItem';
import { useTranslation } from 'react-i18next';
import IconSvgSettings from '../../icons/IconSvgSettings';
import Button from '../../../../ui/Button';

type OwnProps = {
  setPaymentType: (type: string) => void;
};

export const Filter: FC<OwnProps> = ({ setPaymentType }) => {
  const { t } = useTranslation();

  const handleClear = () => {
    setPaymentType('all');
  };

  return (
    <>
      <div className='transactions__filter-title'>
        <span>Filter</span>
        <Button onClick={handleClear} isLink>
          {t('Clear').toUpperCase()}
        </Button>
      </div>
      <div className='transactions__filter-list'>
        <ListItem onClick={() => setPaymentType('deposit')}>
          <div className='thumbnail'>
            <IconSvg name='ello-coin' />
          </div>
          <div className='info'>
            <div className='info-row'>
              <h4>{t('Wallet.Deposit')}</h4>
            </div>
          </div>
        </ListItem>
        <ListItem onClick={() => setPaymentType('withdraw')}>
          <div className='thumbnail negative'>
            <IconSvg name='ello-coin' />
          </div>
          <div className='info'>
            <div className='info-row'>
              <h4>{t('Wallet.Withdrawal')}</h4>
            </div>
          </div>
        </ListItem>
        {/* <ListItem>
          <div className='thumbnail negative'>
            <IconSvgSettings name='radio' />
          </div>
          <div className='info'>
            <div className='info-row'>
              <h4>{t('Wallet.SubscriptionFee')}</h4>
            </div>
          </div>
        </ListItem> */}
        {/* <ListItem>
          <div className='thumbnail'>
            <IconSvgSettings name='radio' />
          </div>
          <div className='info'>
            <div className='info-row'>
              <h4>{t('Wallet.MySubscriptionChannel')}</h4>
            </div>
          </div>
        </ListItem> */}
        {/* <ListItem>
          <div className='thumbnail music'>
            <IconSvg name='media_sale' />
          </div>
          <div className='info'>
            <div className='info-row'>
              <h4>{t('Channel.MediaSales')}</h4>
            </div>
          </div>
        </ListItem> */}
        <ListItem onClick={() => setPaymentType('transfer')}>
          <div className='thumbnail'>
            <IconSvgSettings name='ello-coin' />
          </div>
          <div className='info'>
            <div className='info-row'>
              <h4>{t('Wallet.Transfer')}</h4>
            </div>
          </div>
        </ListItem>
      </div>
    </>
  );
};
