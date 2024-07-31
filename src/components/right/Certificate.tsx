import React, { FC, useEffect, useRef } from 'react';

import QRCodeStyling from 'qr-code-styling';

import './Certificate.scss';

import Logo from '../../assets/panda-logo-green.png';
import IconSvg from '../ui/IconSvg';

export type OwnProps = {
  onClose: (shouldScrollUp?: boolean) => void;
  isActive: boolean;
};

const QR_SIZE = 215;

const qrCode = new QRCodeStyling({
  width: QR_SIZE,
  height: QR_SIZE,
  margin: 5,
  type: 'svg',
  dotsOptions: {
    type: 'rounded',
    color: '#44BE2E',
  },
  cornersSquareOptions: {
    type: 'extra-rounded',
    color: '#44BE2E',
  },
  cornersDotOptions: {
    color: '#44BE2E',
  },
  image: Logo,
  imageOptions: {
    imageSize: 0.6,
    margin: 5,
  },
  qrOptions: {
    errorCorrectionLevel: 'M',
  },
});

const Certificate: FC<OwnProps> = ({ onClose, isActive }) => {
  const link = 'https://qr-code-styling.com';

  useEffect(() => {
    qrCode.append(qrCodeRef.current!);
  }, []);

  useEffect(() => {
    qrCode.update({ data: link });
  }, [link]);

  const qrCodeRef = useRef<HTMLDivElement>(null);
  return (
    <div className='right-content certificate-info-wrapper custom-scroll'>
      <div className='info-block has-qr'>
        <div className='logo'>
          <IconSvg name='ai-bot' w='55' h='55' />
        </div>
        <h3>AI certificate of authenticity</h3>
        <div className='qr-container' ref={qrCodeRef} />
      </div>
      <div className='info-block'>
        <h4>This certificate is intended for the following purposes:</h4>
        <ul>
          <li>Proves your identity as an original creator of AI content.</li>
          <li>Protects your AI content from alteration after publication.</li>
          <li>Ensures your AI content came from the AI software publisher.</li>
          <li>Ensures AI validity and usage details.</li>
        </ul>
        <div className='description'>
          <div className='table'>
            <div className='row'>
              <span className='subtitle'>Content</span>
              <span className='title'>AI image</span>
            </div>
            <div className='row'>
              <span className='subtitle'>Valid from</span>
              <span className='title'>March 9, 2023</span>
            </div>
            <div className='row'>
              <span className='subtitle'>Identification number</span>
              <span className='title'>74NRL9011ZQJR6</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
