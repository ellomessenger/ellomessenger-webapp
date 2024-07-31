import React, { FC } from 'react';
import { IIconSvg } from '../../components/ui/IconSvg/types';

const IconSvgPayment: FC<IIconSvg> = ({ name, w, h }) => {
  switch (name) {
    case 'text':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '24'}
          height={h || '24'}
          fill='none'
          viewBox='0 0 24 24'
        >
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M1.99 5.93V4.42c0-1.02.83-1.85 1.85-1.85h12.92c1.02 0 1.85.83 1.85 1.85v1.51M10.3 18.1V3.32M6.9 18.1h5.58M13.68 10.34h7.01c.73 0 1.32.59 1.32 1.32v.8M16.08 21.43V10.87M13.94 21.43h4.28'
          />
        </svg>
      );
    case 'image':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '24'}
          height={h || '24'}
          fill='none'
          viewBox='0 0 24 24'
        >
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='m21.68 16.96-3.13-7.31c-1.06-2.48-3.01-2.58-4.32-.22l-1.89 3.41c-.96 1.73-2.75 1.88-3.99.33l-.22-.28c-1.29-1.62-3.11-1.42-4.04.43l-1.72 3.45C1.16 19.17 2.91 22 5.59 22h12.76c2.6 0 4.35-2.65 3.33-5.04ZM6.97 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'
          />
        </svg>
      );
    case 'image-text':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='10'
          fill='none'
          viewBox='0 0 16 10'
        >
          <path
            fill='#fff'
            fillRule='evenodd'
            d='M8.44 1.459a.398.398 0 0 0-.385.407v.724c0 .265-.204.48-.454.48a.467.467 0 0 1-.455-.48v-.724c0-.753.58-1.366 1.295-1.366h5.867c.714 0 1.294.613 1.294 1.366v.724c0 .265-.203.48-.454.48a.467.467 0 0 1-.454-.48v-.724a.398.398 0 0 0-.386-.407h-2.481v6.486h.807c.251 0 .455.214.455.48 0 .264-.204.479-.455.479H11.39a.439.439 0 0 1-.033 0h-1.255a.467.467 0 0 1-.455-.48c0-.265.204-.48.455-.48h.817V1.46H8.441Z'
            clipRule='evenodd'
          />
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='.8'
            d='M7.995 6.812 6.947 4.363C6.592 3.533 5.938 3.5 5.5 4.29l-.633 1.142c-.322.58-.921.63-1.337.11l-.073-.093c-.433-.543-1.042-.476-1.354.144l-.576 1.155A1.208 1.208 0 0 0 2.606 8.5H6.88c.87 0 1.457-.888 1.115-1.688Z'
          />
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='.734'
            d='M2.887 2.927a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z'
          />
        </svg>
      );
    case 'microphone':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '24'}
          height={h || '24'}
          fill='none'
          viewBox='0 0 24 24'
        >
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M12 15.5c2.21 0 4-1.79 4-4V6c0-2.21-1.79-4-4-4S8 3.79 8 6v5.5c0 2.21 1.79 4 4 4Z'
          />
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M4.35 9.65v1.7C4.35 15.57 7.78 19 12 19c4.22 0 7.65-3.43 7.65-7.65v-1.7M10.61 6.43c.9-.33 1.88-.33 2.78 0M11.2 8.55c.53-.14 1.08-.14 1.61 0M12 19v3'
          />
        </svg>
      );
    case 'video':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '24'}
          height={h || '24'}
          fill='none'
          viewBox='0 0 24 24'
        >
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M22 15V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7ZM2.52 7.11h18.96M8.52 2.11v4.86M15.48 2.11v4.41'
          />
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
            d='M9.75 14.45v-1.2c0-1.54 1.09-2.17 2.42-1.4l1.04.6 1.04.6c1.33.77 1.33 2.03 0 2.8l-1.04.6-1.04.6c-1.33.77-2.42.14-2.42-1.4v-1.2 0Z'
          />
        </svg>
      );
    case 'game':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '24'}
          height={h || '24'}
          fill='none'
          viewBox='0 0 24 24'
        >
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
            d='m9.57 12.46-3.05 3.05M6.55 12.49l3.05 3.05M13.53 14h.01M17.47 14h.01M15.5 15.98v-.02M15.5 12.04v-.02'
          />
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M9 22h6c5 0 7-2 7-7v-2c0-5-2-7-7-7H9c-5 0-7 2-7 7v2c0 5 2 7 7 7ZM13.01 2 13 3.01A1 1 0 0 1 12 4h-.03c-.55 0-.99.45-.99 1s.45 1 1 1h1'
          />
        </svg>
      );
    case 'flash':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='none'
        >
          <path
            fill='#fff'
            d='M11.94 7.147H9.88v-4.8c0-1.12-.607-1.347-1.347-.507L8 2.447 3.487 7.58c-.62.7-.36 1.273.573 1.273h2.06v4.8c0 1.12.607 1.347 1.347.507L8 13.553l4.513-5.133c.62-.7.36-1.273-.573-1.273Z'
          />
        </svg>
      );
    default:
      return <></>;
  }
};

export default IconSvgPayment;
