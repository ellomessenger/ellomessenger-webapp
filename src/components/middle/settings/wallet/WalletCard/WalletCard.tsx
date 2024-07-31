import React, { FC } from 'react';
import IconSvg from '../../../../ui/IconSvg';
import './WalletCard.scss';

const data = [
  {
    svgName: 'master-card',
    cardName: 'MasterCard',
    cardInfo: 'Credit ••••7800',
  },
  {
    svgName: 'pay-pal',
    cardName: 'PayPal',
    cardInfo: 'qwerty@gmail.com',
  },
  {
    svgName: 'bank-transfer',
    cardName: 'Bank Transfer',
    cardInfo: 'Kristin Watson, 6391 Elgin St. Celina, Delaware 1 Best Bank',
  },
];

const WalletCard: FC = () => {
  return (
    <div className='wallet__wallet-card wallet-card'>
      <div className='wallet-card__wrap'>
        {data.map((card) => (
          <div key={card.cardName} className='wallet-card__box'>
            <div className='wallet-card__inner-info'>
              <div className='wallet-card__name-wrap'>
                <i className='icon-svg'>
                  <IconSvg name={card.svgName} />
                </i>
                <div className='wallet-card__name'>{card.cardName}</div>
              </div>
              <div className='wallet-card__info'>{card.cardInfo}</div>
            </div>
            <i className='icon-svg'>
              <IconSvg name='edit' />
            </i>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalletCard;
