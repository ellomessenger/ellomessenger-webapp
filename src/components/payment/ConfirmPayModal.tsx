import React, { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Modal from '../ui/Modal';
import Button from '../ui/Button';

import renderText from '../common/helpers/renderText';
import { LOCAL_TGS_URLS } from '../common/helpers/animatedAssets';
import AnimatedIcon from '../common/AnimatedIcon';
import NotMoneyImg from '../../assets/images/not_money.png';
import { IPayment } from '../../global/types';
import { getMoneyFormat } from '../../util/convertMoney';
import IconSvg from '../ui/IconSvg';
import AiPurchase from '../../assets/images/congratulations.svg';

export type OwnProps = {
  isOpen: boolean;
  onClose: () => void;
  onCloseAnimationEnd?: () => void;
  payment?: IPayment;
  title?: string;
  text?: string;
  closeLabel?: string;
  confirmLabel?: string;
  confirmIsDestructive?: boolean;
  transactionType?:
    | 'deposit'
    | 'withdrawal'
    | 'paidCourse'
    | 'paidSubscription'
    | 'aiPurchased';
  confirmHandler?: () => void;
};

const ConfirmPayModal: FC<OwnProps> = ({
  isOpen,
  onClose,
  payment,
  title,
  text,
  closeLabel = 'Ok',
  confirmLabel,
  confirmIsDestructive,
  transactionType,
  confirmHandler,
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { status } = payment || {};
  const [header, setHeader] = useState('');

  function renderContent() {
    switch (status) {
      case 'canceled':
        return (
          <>
            <div className='AvatarEditable'>
              <AnimatedIcon tgsUrl={LOCAL_TGS_URLS.FailDeposit} size={250} />
            </div>
          </>
        );
      case 'subscribed':
        return (
          <>
            <div className='AvatarEditable'>
              <AnimatedIcon
                tgsUrl={LOCAL_TGS_URLS.SuccessSubscribed}
                size={250}
              />
            </div>
          </>
        );
      case 'completed':
        return transactionType === 'aiPurchased' ? (
          <>
            <div className='AvatarEditable'>
              <img src={AiPurchase} alt='' />
            </div>
          </>
        ) : (
          <>
            <div className='AvatarEditable'>
              <AnimatedIcon
                tgsUrl={LOCAL_TGS_URLS.SuccessfulDeposit}
                size={250}
              />
            </div>
          </>
        );
      case 'not-money':
        return (
          <>
            <div className='AvatarEditable'>
              <img src={NotMoneyImg} alt='not money' />
            </div>
          </>
        );
    }
  }

  useEffect(() => {
    if (title) {
      setHeader(title);
    } else {
      if (status === 'canceled') setHeader('Oops');
      if (status === 'completed') setHeader('Success!');
    }
  }, [status, header, title]);

  return (
    <Modal
      isOpen={isOpen}
      className='confirm payment-confirm'
      onClose={onClose}
      centered
      hasCloseButton
      header={t(header)}
    >
      <div className='modal-content'>
        {renderContent()}
        <h2>
          {title ? title : t(status === 'completed' ? 'Success!' : 'Oops!')}
        </h2>
        <div className='amount mb-4'>
          {!text &&
            renderText(
              t(
                `Wallet.${
                  status === 'subscribed'
                    ? transactionType === 'paidSubscription'
                      ? 'PaidChannelSuccessful'
                      : 'PaidCourseSuccessful'
                    : status === 'completed'
                    ? `${
                        transactionType === 'deposit' ? 'Deposit' : 'Withdraw'
                      }Successful`
                    : `${
                        transactionType === 'deposit' ? 'Deposit' : 'Withdraw'
                      }Unsuccessful`
                }`
              ),
              ['simple_markdown', 'br']
            )}
          {!text && status === 'completed' && (
            <>
              <IconSvg name='dollar' w='16' h='16' />{' '}
              {getMoneyFormat(payment?.amount, 2, 2)}
            </>
          )}
          {text}
        </div>

        <div className='dialog-buttons mt-2' ref={containerRef}>
          {confirmHandler && (
            <Button
              size='smaller'
              onClick={confirmHandler}
              color={confirmIsDestructive ? 'danger' : 'primary'}
            >
              {confirmLabel}
            </Button>
          )}
          <Button outline size='smaller' onClick={onClose}>
            {t(closeLabel)}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmPayModal;
