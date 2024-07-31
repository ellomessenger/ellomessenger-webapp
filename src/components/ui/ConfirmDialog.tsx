import React, { FC, ReactNode, memo, useCallback, useRef } from 'react';

import type { TextPart } from '../../types';

import useKeyboardListNavigation from '../../hooks/useKeyboardListNavigation';

import Modal from './Modal';
import Button from './Button';
import { useTranslation } from 'react-i18next';
import renderText from '../common/helpers/renderText';

type OwnProps = {
  isOpen: boolean;
  onClose: () => void;
  onCloseAnimationEnd?: () => void;
  title?: string;
  header?: ReactNode;
  textParts?: TextPart;
  text?: string;
  confirmLabel?: string;
  confirmHandler: () => void;
  confirmIsDestructive?: boolean;
  areButtonsInColumn?: boolean;
  withoutCancel?: boolean;
  children?: React.ReactNode;
};

const ConfirmDialog: FC<OwnProps> = ({
  isOpen,
  onClose,
  onCloseAnimationEnd,
  title,
  header,
  text,
  textParts,
  confirmLabel = 'Confirm',
  confirmHandler,
  confirmIsDestructive,
  areButtonsInColumn,
  children,
  withoutCancel,
}) => {
  const { t } = useTranslation();

  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelectWithEnter = useCallback(
    (index: number) => {
      if (index === -1) confirmHandler();
    },
    [confirmHandler]
  );

  const handleKeyDown = useKeyboardListNavigation(
    containerRef,
    isOpen,
    handleSelectWithEnter,
    '.Button'
  );

  return (
    <Modal
      className='confirm'
      title={title}
      header={header}
      isOpen={isOpen}
      centered
      onClose={onClose}
      onCloseAnimationEnd={onCloseAnimationEnd}
      hasCloseButton
    >
      <div className='modal-content custom-scroll'>
        {text &&
          text
            .split('\\n')
            .map((textPart) => (
              <p key={textPart}>{renderText(textPart, ['simple_markdown'])}</p>
            ))}
        {textParts || children}
        <div
          className={
            areButtonsInColumn ? 'dialog-buttons-column' : 'dialog-buttons mt-2'
          }
          ref={containerRef}
          onKeyDown={handleKeyDown}
        >
          <Button
            onClick={confirmHandler}
            color={confirmIsDestructive ? 'danger' : 'primary'}
          >
            {confirmLabel}
          </Button>
          {!withoutCancel && (
            <Button outline onClick={onClose}>
              {t('Cancel')}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default memo(ConfirmDialog);
