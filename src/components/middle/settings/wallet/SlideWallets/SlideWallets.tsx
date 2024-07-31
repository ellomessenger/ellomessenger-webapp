import React, { FC, useCallback, useRef } from 'react';
import { IWallet } from '../../../../../global/types';
import walletMain from '../../../../../assets/images/wallet.jpg';
import walletEarning from '../../../../../assets/images/wallet2.jpg';
import IconSvg from '../../../../ui/IconSvg';
import {
  Swiper as SwiperWrapper,
  SwiperSlide,
  useSwiperSlide,
} from 'swiper/react';
import { Pagination, A11y, EffectFade } from 'swiper';
import './SlideWallets.scss';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useTranslation } from 'react-i18next';
import { getMoneyFormat } from '../../../../../util/convertMoney';
import classNames from 'classnames';

interface OwnProps {
  wallets: Array<IWallet>;
  onChangeCard: (wallet: IWallet | undefined) => void;
}

const SlideWallets: FC<OwnProps> = ({ wallets, onChangeCard }) => {
  const sliderRef = useRef<any>();
  const { t } = useTranslation();

  if (!wallets) return null;

  const sortWallets = useCallback(() => {
    const mainWallet = wallets?.find((el) => el.type === 'main');
    const earning = wallets?.find((el) => el.type === 'earning');
    return [mainWallet, earning].filter(Boolean);
  }, [wallets]);

  const slideCount = sortWallets().length;

  return (
    <div className='wallet__slide-wallet slide-wallet'>
      <SwiperWrapper
        modules={[Pagination, A11y, EffectFade]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
        effect='cube'
        onSwiper={(swiper) => {
          onChangeCard(wallets.find((el) => el.type === 'main'));
          sliderRef.current = swiper;
        }}
        onSlideChange={(swiper) =>
          onChangeCard(
            wallets.find((el) =>
              swiper.activeIndex === 0
                ? el.type === 'main'
                : el.type === 'earning'
            )
          )
        }
      >
        {sortWallets().map((wallet) => (
          <SwiperSlide key={wallet?.id} data-id={wallet?.id}>
            <div className='slide-wallet__container'>
              <div className='slide-wallet__container-img'>
                <img
                  src={wallet?.type === 'main' ? walletMain : walletEarning}
                  alt=''
                />
                <div className='container-desc'>
                  <div className='left-side'>
                    <span className='title'>
                      {t(`Wallet.Title_${wallet?.type}`)}
                    </span>
                    <span className='amount'>
                      <IconSvg name='dollar' w='26' h='26' />
                      {getMoneyFormat(wallet?.amount, 2, 2)}
                    </span>
                  </div>
                  {wallet?.type === 'earning' && (
                    <div className='right-side'>
                      <div>
                        <span>{t('Wallet.OnHold')}</span>
                        <span className='amount'>
                          <span className='price'>
                            <IconSvg name='dollar' w='13' h='13' />
                            {getMoneyFormat(wallet?.freeze_amount, 2, 2)}
                          </span>
                        </span>
                      </div>
                      <div>
                        <span>{t('Wallet.Available')}</span>
                        <span className='amount'>
                          <span className='price'>
                            <IconSvg name='dollar' w='13' h='13' />
                            {getMoneyFormat(wallet?.available_balance, 2, 2)}
                          </span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        <div
          className={classNames('slide-wallet__arrow-wrapper', {
            active: slideCount > 1,
          })}
        >
          <div
            className='slide-wallet__btn'
            onClick={() => sliderRef.current?.slidePrev()}
          >
            <IconSvg name='arrow-left-slide' w='16' h='13' />
          </div>
          <div
            className='slide-wallet__btn'
            onClick={() => sliderRef.current?.slideNext()}
          >
            <IconSvg name='arrow-right-slide' w='20' h='19' />
          </div>
        </div>
      </SwiperWrapper>
    </div>
  );
};

export default SlideWallets;
