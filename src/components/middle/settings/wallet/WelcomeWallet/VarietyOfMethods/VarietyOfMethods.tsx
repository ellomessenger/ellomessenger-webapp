import React, { FC } from 'react';
import { varietyOfMethods } from '../data';
import { useTranslation } from 'react-i18next';

const VarietyOfMethods: FC = () => {
  const { t } = useTranslation();
  return (
    <section className='welcome-page__veriety'>
      <h3 className='welcome-page__title'>{t('Wallet.MethodsTitle')}</h3>
      {varietyOfMethods.map((method) => (
        <div key={method.id} className='welcome-page__desc-wrap'>
          <img src={method.image} className='welcome-page__name' />
          <p>{t(`Wallet.Method${method.desc}`)}</p>
        </div>
      ))}
      {/* <a href='/'>Read more</a> */}
    </section>
  );
};

export default VarietyOfMethods;
