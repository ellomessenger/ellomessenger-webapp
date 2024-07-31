import React, { FC, memo, useRef, useState, useCallback } from 'react';
import { getActions } from '../../../global';

import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import InputText from '../../ui/InputText';

import styles from './RatePhoneCallModal.module.scss';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import IconSvg from '../../ui/IconSvg';

export type OwnProps = {
  isOpen?: boolean;
};

const RatePhoneCallModal: FC<OwnProps> = ({ isOpen }) => {
  const { closeCallRatingModal, setCallRating } = getActions();

  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const [rating, setRating] = useState<number | undefined>();

  const handleSend = useCallback(() => {
    if (!rating) {
      closeCallRatingModal();
      return;
    }
    setCallRating({
      rating: rating + 1,
      comment: inputRef.current?.value || '',
    });
  }, [closeCallRatingModal, rating, setCallRating]);

  function handleClickStar(index: number) {
    return () => setRating(rating === index ? undefined : index);
  }

  const handleCancelClick = useCallback(() => {
    closeCallRatingModal();
  }, [closeCallRatingModal]);

  return (
    <Modal
      hasCloseButton
      title={t('Call.RateLabel')}
      className='confirm'
      onClose={closeCallRatingModal}
      isOpen={isOpen}
      centered
    >
      <div className='modal-content'>
        <p>{t('Call.RateText')}</p>
        <div className={styles.stars}>
          {new Array(5).fill(undefined).map((_, i) => {
            const isFilled = rating !== undefined && rating >= i;
            return (
              <i
                className={classNames(
                  'icon-svg',
                  styles.star,
                  isFilled && styles.isFilled,
                  {
                    'icon-filled': isFilled,
                  }
                )}
                onClick={handleClickStar(i)}
              >
                <IconSvg name='star' />
              </i>
            );
          })}
        </div>
        <InputText
          elRef={inputRef}
          placeholder={t('Call.RateComment')}
          className={classNames(
            styles.comment,
            rating !== 4 && rating !== undefined && styles.visible
          )}
        />

        <div className='dialog-buttons mt-5'>
          <Button onClick={handleSend} size='smaller'>
            {t('Submit')}
          </Button>
          <Button outline onClick={handleCancelClick} size='smaller'>
            {t('Cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(RatePhoneCallModal);
