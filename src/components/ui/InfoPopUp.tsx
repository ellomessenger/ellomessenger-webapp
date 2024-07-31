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
  header?: ReactNode;
  text?: string;
};

const InfoPopUp: FC<OwnProps> = ({ isOpen, onClose, header, text }) => {
  const { t } = useTranslation();

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Modal
      className='info-confirm'
      isOpen={isOpen}
      centered
      onClose={onClose}
      hasCloseButton
    >
      <div className='modal-content custom-scroll'>
        {header && <h3>{header}</h3>}
        {text &&
          text
            .split('\\n')
            .map((textPart) => (
              <p key={textPart}>{renderText(textPart, ['simple_markdown'])}</p>
            ))}
      </div>
    </Modal>
  );
};

export default memo(InfoPopUp);
