import React, { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import Modal from '../ui/Modal';
import Button from '../ui/Button';

import TextBackground from '../../assets/payment/gradienta-LeG68PrXA6Y-unsplash.jpg';
import ImgBackground from '../../assets/payment/image-bg.jpg';
import { AiPurchaseType } from './PaymentAi';
import IconSvg from '../ui/IconSvg';
import IconSvgPayment from './IconSvgPayment';
import { aiPurchases } from './paymentAiTarif';
import { getActions } from '../../global';
import IconSvgSettings from '../middle/settings/icons/IconSvgSettings';
import classNames from 'classnames';

export type OwnProps = {
  isOpen: boolean;
  type?: AiPurchaseType;
  onClose: () => void;
  onCloseAnimationEnd?: () => void;
};

const ConfirmPurchaseAi: FC<OwnProps> = ({ isOpen, onClose, type }) => {
  const { subscribeAi } = getActions();
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  if (!type) return;
  let purchaseData: any;
  switch (type) {
    case AiPurchaseType.text_pack:
      purchaseData = aiPurchases.text;
      break;
    case AiPurchaseType.image_pack:
      purchaseData = aiPurchases.image;
      break;
    case AiPurchaseType.double:
      purchaseData = aiPurchases.imageAndChat;
      break;
  }

  function getIcon() {
    switch (type) {
      case AiPurchaseType.text_pack:
        return (
          <div
            className='icon-svg'
            style={{ backgroundImage: `url(${TextBackground})` }}
          >
            <IconSvgPayment name='text' w='32' h='32' />
          </div>
        );
      case AiPurchaseType.image_pack:
        return (
          <div
            className='icon-svg'
            style={{ backgroundImage: `url(${ImgBackground})` }}
          >
            <IconSvgPayment name='image' w='32' h='32' />
          </div>
        );
      case AiPurchaseType.double:
        return (
          <>
            <div
              className='icon-svg'
              style={{ backgroundImage: `url(${TextBackground})` }}
            >
              <IconSvgPayment name='text' w='32' h='32' />
            </div>
            <div
              className='icon-svg'
              style={{ backgroundImage: `url(${ImgBackground})` }}
            >
              <IconSvgPayment name='image' w='32' h='32' />
            </div>
          </>
        );
    }
  }

  const handleSubscribe = () => {
    subscribeAi({
      sub_type: type!,
      quantity: Array.isArray(purchaseData.count)
        ? undefined
        : purchaseData?.count,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      className='confirm payment-confirm'
      onClose={onClose}
      centered
      hasCloseButton
    >
      <div className='modal-content'>
        <h3>Confirm purchase</h3>
        <div className='pair-icon'>
          {getIcon()}
          <div className='icon-svg main'>
            <IconSvg name='ai-bot' w='54' h='54' />
          </div>
        </div>
        <div className='label'>Available for purchase</div>
        <div
          className={classNames('price-wrap', {
            'direction-column': Array.isArray(purchaseData.count),
          })}
        >
          {Array.isArray(purchaseData.count) ? (
            purchaseData.count.map((qty, idx) => (
              <div className='prompts'>
                <span className='flash-prompt'>
                  <IconSvgPayment name='flash' />
                  {qty.replace(/[^\d]/g, '')}
                </span>
                {idx === 0 ? 'AI chat prompts' : 'AI images prompts'}
              </div>
            ))
          ) : (
            <div className='prompts'>
              <span className='flash-prompt'>
                <IconSvgPayment name='flash' />
                {purchaseData?.count}
              </span>
              {type === AiPurchaseType.text_pack
                ? 'AI chat prompts'
                : 'AI images prompts'}
            </div>
          )}

          <div className='price'>
            <IconSvg name='dollar' w='20' h='20' />
            {purchaseData?.price}
          </div>
        </div>
        <div className='dialog-buttons' ref={containerRef}>
          <Button onClick={handleSubscribe}>Buy</Button>
        </div>
        {/* <div className='notification'>
          <IconSvg name='info-circle' w='18' h='18' />
          <p>
            <b>Note!</b> At the end of the month, the number of requests is
            reset to zero.
          </p>
        </div> */}
      </div>
    </Modal>
  );
};

export default ConfirmPurchaseAi;
