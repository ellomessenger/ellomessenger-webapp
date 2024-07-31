import React, { FC, memo, useCallback, useState } from 'react';
import Button from '../ui/Button';
import IconSvg from '../ui/IconSvg';

import './PaymentAi.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Switcher from '../ui/Switcher';

import TextBackground from '../../assets/payment/gradienta-LeG68PrXA6Y-unsplash.jpg';
import ImgBackground from '../../assets/payment/image-bg.jpg';
import ImgAndTextBackground from '../../assets/payment/image-and-text-bg.png';
import AudioBackground from '../../assets/payment/audio-bg.jpg';
import VideoBackground from '../../assets/payment/video-bg.jpg';
import GamesBackground from '../../assets/payment/game-bg.jpg';

import IconSvgPayment from './IconSvgPayment';
import { getActions, withGlobal } from '../../global';
import { MiddleColumnContent, SettingsScreens } from '../../types';
import { aiPurchases } from './paymentAiTarif';
import ConfirmPurchaseAi from './ConfirmPurchaseAi';
import ConfirmPayModal from './ConfirmPayModal';
import { GlobalState, TabState } from '../../global/types';

import { selectTabState } from '../../global/selectors';
import { useTranslation } from 'react-i18next';
import IconSvgSettings from '../middle/settings/icons/IconSvgSettings';
import useLastCallback from '../../hooks/useLastCallback';
import classNames from 'classnames';

enum PaymentType {
  buy = 'Buy',
  subscription = 'Subscription',
}

export enum AiPurchaseType {
  all,
  text_subscription,
  image_subscription,
  text_pack,
  image_pack,
  double,
}

type StateProps = Pick<GlobalState, 'payment'> & Pick<TabState, 'middleScreen'>;
type OwnProps = {
  onScreenSettingSelect: (screen: SettingsScreens) => void;
};

const PaymentAi: FC<StateProps & OwnProps> = ({
  payment,
  middleScreen,
  onScreenSettingSelect,
}) => {
  const { setMiddleScreen, apiUpdate } = getActions();
  const { t } = useTranslation();
  const [isOpenConfirm, setIsOpenConfirm] = useState(false);
  const [purchaseType, setPurchaseType] = useState<AiPurchaseType>();
  const [visibleDescription, setVisibleDescription] = useState<AiPurchaseType>(
    AiPurchaseType.text_pack
  );
  const handleChangeDescr = useLastCallback((type: AiPurchaseType) => {
    setVisibleDescription(type);
  });
  const { text, image, imageAndChat } = aiPurchases;
  const { amount, status } = payment || {};

  const handleOpenConfirmModal = useCallback((type: AiPurchaseType) => {
    setPurchaseType(type);
    setIsOpenConfirm(true);
  }, []);
  const historyState = window.history.state;

  const onReset = useLastCallback(() => {
    if (historyState.middleScreen === MiddleColumnContent.Settings) {
      setMiddleScreen({ screen: MiddleColumnContent.Settings });
      onScreenSettingSelect(SettingsScreens.aiSpace);
    } else {
      setMiddleScreen({ screen: MiddleColumnContent.Messages });
    }
  });

  const closeConfirmModal = useCallback(() => {
    setIsOpenConfirm(false);
  }, []);

  const [paymentType, setPaymentType] = useState(PaymentType.buy);
  const handlePaymentType = useCallback((type: PaymentType) => {
    setPaymentType(type);
  }, []);

  const handleClearPayment = useCallback(() => {
    apiUpdate({
      '@type': 'updatePaymentState',
      payment: undefined,
    });
  }, []);

  // const successText = useCallback(() => {
  //   switch (purchaseType) {
  //     case AiPurchaseType.text_pack:
  //       return t('PaymentAi.YouHavePurchased', { count: amount });

  //     case AiPurchaseType.image_pack:
  //       return t('PaymentAi.YouHavePurchased', { count: amount });
  //   }
  // }, [purchaseType]);

  return (
    <div id='PaymentAi' className='settings-layout'>
      <div className='MiddleHeader'>
        <div className='setting-info'>
          <Button
            round
            size='smaller'
            color='translucent'
            onClick={onReset}
            ariaLabel={String(t('GoBack'))}
          >
            <i className='icon-svg'>
              <IconSvg name='arrow-left' />
            </i>
          </Button>
          <h4>{t('PaymentAi.Title')}</h4>
        </div>
      </div>
      <div className='settings-content payment-content custom-scroll'>
        {/* <div className='btn-group tab-nav'>
          <Button
            className={paymentType === PaymentType.subscription ? 'active' : ''}
            onClick={() => handlePaymentType(PaymentType.subscription)}
          >
            {t(PaymentType.subscription)}
          </Button>
          <Button
            className={paymentType === PaymentType.buy ? 'active' : ''}
            onClick={() => handlePaymentType(PaymentType.buy)}
          >
            {t(PaymentType.buy)}
          </Button>
        </div> */}
        <div className='swiper-wrap'>
          <Swiper
            //loop
            centeredSlides={true}
            pagination={{
              clickable: true,
            }}
            navigation
            modules={[Pagination, Navigation]}
            className='payment-swipe'
            spaceBetween={20}
            slidesPerView={3}
            breakpoints={{
              // when window width is >= 320px
              320: {
                spaceBetween: 10,
              },
              1200: {
                spaceBetween: 20,
                slidesPerView: 3,
              },
            }}
          >
            <SwiperSlide>
              <>
                <div
                  className='payment-item'
                  style={{ backgroundImage: `url(${ImgAndTextBackground})` }}
                >
                  <span>
                    <IconSvgPayment name='image' />
                    <IconSvgPayment name='text' />
                  </span>

                  <div className='title'>{t('PaymentAi.ImagesAndChat')}</div>
                  {paymentType === PaymentType.buy ? (
                    <p className='description'>
                      {t('PaymentAi.RunOutOfPrompts')}
                    </p>
                  ) : (
                    <div className='switcher-wrap'>
                      <span>Month</span>
                      <Switcher label='Month' />
                      <span>Year</span>
                    </div>
                  )}

                  <div className='price'>
                    {paymentType === PaymentType.buy ? (
                      <h3 className='amount smaller'>
                        {Array.isArray(imageAndChat.count)
                          ? imageAndChat.count.map((qty) => <span>{qty}</span>)
                          : imageAndChat.count}
                        {t('PaymentAi.count_for')}
                        <IconSvg name='dollar' w='18' h='20' />
                        {imageAndChat.price}
                      </h3>
                    ) : (
                      <>
                        <div className='td'>
                          <span className='subtitle'>month</span>
                          <span className='title'>$15</span>
                        </div>
                        <div className='td'>
                          <span className='subtitle'>
                            year <span className='sale'>- 40%</span>
                          </span>
                          <span className='title'>$185</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className='hide-content'>
                  <div className='btn-group tab-nav full-width'>
                    <div
                      className={classNames('Button text primary', {
                        active: visibleDescription === AiPurchaseType.text_pack,
                      })}
                      onClick={() =>
                        handleChangeDescr(AiPurchaseType.text_pack)
                      }
                    >
                      AI Chat
                    </div>
                    <div
                      className={classNames('Button text primary', {
                        active:
                          visibleDescription === AiPurchaseType.image_pack,
                      })}
                      onClick={() =>
                        handleChangeDescr(AiPurchaseType.image_pack)
                      }
                    >
                      AI Image
                    </div>
                  </div>
                  {visibleDescription === AiPurchaseType.text_pack ? (
                    <>
                      <div className='free-block'>
                        <span>Free</span>
                        {imageAndChat.per_month.map((qty) => (
                          <span>{qty}</span>
                        ))}
                        {t('PaymentAi.prompts_per_month', { count: undefined })}
                      </div>
                      <ul className='main-description'>
                        {text.possibilities.map((row) => (
                          <li key={row}>
                            <h4>{t(`PaymentAi.Text.${row}`)}:</h4>
                            <p>{t(`PaymentAi.Text.${row}Description`)} </p>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <>
                      <div className='free-block'>
                        <span>Free</span>
                        {t('PaymentAi.prompts_per_month', {
                          count: image.per_month,
                        })}
                      </div>
                      <ul className='main-description'>
                        {image.possibilities.map((row) => (
                          <li key={row}>
                            <h4>{t(`PaymentAi.Image.${row}`)}:</h4>
                            <p>{t(`PaymentAi.Image.${row}Description`)} </p>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <div className='form-submit'>
                    <Button
                      type='submit'
                      size='smaller'
                      fullWidth
                      onClick={() =>
                        handleOpenConfirmModal(AiPurchaseType.double)
                      }
                    >
                      Buy
                    </Button>
                  </div>
                </div>
              </>
            </SwiperSlide>

            <SwiperSlide>
              <>
                <div
                  className='payment-item'
                  style={{ backgroundImage: `url(${TextBackground})` }}
                >
                  <IconSvgPayment name='text' />
                  <div className='title'>{t('PaymentAi.Text.Title')}</div>
                  {paymentType === PaymentType.buy ? (
                    <p className='description'>
                      {t('PaymentAi.RunOutOfPrompts')}
                    </p>
                  ) : (
                    <div className='switcher-wrap'>
                      <span>Month</span>
                      <Switcher label='Month' />
                      <span>Year</span>
                    </div>
                  )}

                  <div className='price'>
                    {paymentType === PaymentType.buy ? (
                      <h3 className='amount'>
                        {text.count} {t('PaymentAi.count_for')}{' '}
                        <IconSvg name='dollar' w='22' h='22' />
                        {text.price}
                      </h3>
                    ) : (
                      <>
                        <div className='td'>
                          <span className='subtitle'>month</span>
                          <span className='title'>$15</span>
                        </div>
                        <div className='td'>
                          <span className='subtitle'>
                            year <span className='sale'>- 40%</span>
                          </span>
                          <span className='title'>$185</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className='hide-content'>
                  <div className='free-block'>
                    <span>Free</span>
                    {t('PaymentAi.prompts_per_month', {
                      count: text.per_month,
                    })}
                  </div>
                  <ul className='main-description'>
                    {text.possibilities.map((row) => (
                      <li key={row}>
                        <h4>{t(`PaymentAi.Text.${row}`)}:</h4>
                        <p>{t(`PaymentAi.Text.${row}Description`)} </p>
                      </li>
                    ))}
                  </ul>
                  <div className='form-submit'>
                    <Button
                      type='submit'
                      size='smaller'
                      fullWidth
                      onClick={() =>
                        handleOpenConfirmModal(AiPurchaseType.text_pack)
                      }
                    >
                      Buy
                    </Button>
                  </div>
                </div>
              </>
            </SwiperSlide>

            <SwiperSlide>
              <>
                <div
                  className='payment-item'
                  style={{ backgroundImage: `url(${ImgBackground})` }}
                >
                  <IconSvgPayment name='image' />
                  <div className='title'>{t('PaymentAi.Image.Title')}</div>
                  <p className='description'>
                    {t('PaymentAi.RunOutOfPrompts')}
                  </p>
                  <div className='price'>
                    <h3 className='amount'>
                      {image.count} {t('PaymentAi.count_for')}{' '}
                      <IconSvg name='dollar' w='22' h='22' />
                      {image.price}
                    </h3>
                  </div>
                </div>
                <div className='hide-content'>
                  <div className='free-block'>
                    <span>Free</span>
                    {t('PaymentAi.prompts_per_month', {
                      count: image.per_month,
                    })}
                  </div>
                  <ul className='main-description'>
                    {image.possibilities.map((row) => (
                      <li key={row}>
                        <h4>{t(`PaymentAi.Image.${row}`)}:</h4>
                        <p>{t(`PaymentAi.Image.${row}Description`)} </p>
                      </li>
                    ))}
                  </ul>
                  <div className='form-submit'>
                    <Button
                      type='submit'
                      size='smaller'
                      fullWidth
                      onClick={() =>
                        handleOpenConfirmModal(AiPurchaseType.image_pack)
                      }
                    >
                      Buy
                    </Button>
                  </div>
                </div>
              </>
            </SwiperSlide>

            {/* <SwiperSlide>
              <>
                <div
                  className='payment-item'
                  style={{ backgroundImage: `url(${VideoBackground})` }}
                >
                  <IconSvgPayment name='video' />
                  <div className='title'>Video</div>
                  {paymentType === PaymentType.buy ? (
                    <p className='description'>
                      Or you can buy requests by the piece:
                    </p>
                  ) : (
                    <div className='switcher-wrap'>
                      <span>Month</span>
                      <Switcher label='Month' checked />
                      <span>Year</span>
                    </div>
                  )}
                  <div className='price'>
                    <div className='row'>
                      <span className='title'>$2</span>
                      <span className='subtitle'> / for 100Mb video</span>
                    </div>
                  </div>
                </div>
                <div className='hide-content'>
                  <div className='free-block'>
                    <span>Free</span> 2 video
                  </div>
                  <ul className='main-description'>
                    <li>Improving video quality</li>
                    <li>Video processing in 3D</li>
                    <li>Creating a talking avatar</li>
                  </ul>
                  <Button type='submit' size='smaller' fullWidth>
                    Buy
                  </Button>
                </div>
              </>
            </SwiperSlide> */}
            {/* <SwiperSlide>
              <>
                <div
                  className='payment-item'
                  style={{ backgroundImage: `url(${AudioBackground})` }}
                >
                  <IconSvgPayment name='microphone' />
                  <div className='title'>Audio</div>
                  <p className='description'>
                    Or you can buy requests by the piece:
                  </p>
                  <div className='price'>
                    <div className='row'>
                      <span className='title'>$1</span>
                      <span className='subtitle'> / per 1 audio</span>
                    </div>
                  </div>
                </div>
                <div className='hide-content'>
                  <div className='free-block'>
                    <span>Free</span> 2 voice/audio
                  </div>
                  <ul className='main-description'>
                    <li>Working with voice/audio</li>
                  </ul>
                  <Button type='submit' size='smaller' fullWidth>
                    Buy
                  </Button>
                </div>
              </>
            </SwiperSlide> */}
            {/* <SwiperSlide>
              <>
                <div
                  className='payment-item'
                  style={{ backgroundImage: `url(${VideoBackground})` }}
                >
                  <IconSvgPayment name='video' />
                  <div className='title'>Video</div>
                  <p className='description'>
                    Or you can buy requests by the piece:
                  </p>
                  <div className='price'>
                    <div className='row'>
                      <span className='title'>$2</span>
                      <span className='subtitle'> / for 100Mb video</span>
                    </div>
                  </div>
                </div>
                <div className='hide-content'>
                  <div className='free-block'>
                    <span>Free</span> 2 video
                  </div>
                  <ul className='main-description'>
                    <li>Improving video quality</li>
                    <li>Video processing in 3D</li>
                    <li>Creating a talking avatar</li>
                  </ul>
                  <Button type='submit' size='smaller' fullWidth>
                    Buy
                  </Button>
                </div>
              </>
            </SwiperSlide> */}
            {/* <SwiperSlide>
              <>
                <div
                  className='payment-item'
                  style={{ backgroundImage: `url(${GamesBackground})` }}
                >
                  <IconSvgPayment name='game' />
                  <div className='title'>Games</div>
                  <p className='description'>
                    Or you can buy requests by the piece:
                  </p>
                  <div className='price'>
                    <div className='row'>
                      <span className='title'>$0.1</span>
                      <span className='subtitle'> / per request</span>
                    </div>
                  </div>
                </div>
                <div className='hide-content'>
                  <div className='free-block'>
                    <span>Free</span> Up to 3 requests per day
                  </div>
                  <ul className='main-description'>
                    <li>Games/quizzes with AI </li>
                  </ul>
                  <Button type='submit' size='smaller' fullWidth>
                    Buy
                  </Button>
                </div>
              </>
            </SwiperSlide> */}
          </Swiper>
        </div>
      </div>
      <ConfirmPurchaseAi
        type={purchaseType}
        isOpen={isOpenConfirm}
        onClose={closeConfirmModal}
      />
      <ConfirmPayModal
        isOpen={
          middleScreen === MiddleColumnContent.PaymentAi &&
          Boolean(status && ['completed', 'canceled'].includes(status))
        }
        title='Congratulations!'
        closeLabel='Back'
        onClose={handleClearPayment}
        text={
          purchaseType === AiPurchaseType.double
            ? t('PaymentAi.YouHavePurchasedDuble')
            : t('PaymentAi.YouHavePurchased', {
                count:
                  purchaseType === AiPurchaseType.image_pack
                    ? image.count
                    : purchaseType === AiPurchaseType.text_pack
                    ? text.count
                    : undefined,
              })
        }
        payment={payment}
        transactionType='aiPurchased'
      />
    </div>
  );
};

export default memo(
  withGlobal((global): StateProps => {
    const { payment } = global;
    const tabState = selectTabState(global);
    return { payment, middleScreen: tabState.middleScreen };
  })(PaymentAi)
);
