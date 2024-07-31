import React, { FC } from 'react';
import { IIconSvg } from './types';

const IconSvg: FC<IIconSvg> = ({
  name,
  w,
  h,
  color,
  stroke,
  fill,
  className = '',
  id,
}) => {
  switch (name) {
    case 'eye-hide':
      return (
        <svg
          width='30'
          height='30'
          viewBox='0 0 30 30'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M17.5299 12.4699L12.4699 17.5299C11.8199 16.8799 11.4199 15.9899 11.4199 14.9999C11.4199 13.0199 13.0199 11.4199 14.9999 11.4199C15.9899 11.4199 16.8799 11.8199 17.5299 12.4699Z'
            stroke='#B1B1B5'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M20.8198 8.7701C19.0698 7.4501 17.0698 6.7301 14.9998 6.7301C11.4698 6.7301 8.17984 8.8101 5.88984 12.4101C4.98984 13.8201 4.98984 16.1901 5.88984 17.6001C6.67984 18.8401 7.59984 19.9101 8.59984 20.7701'
            stroke='#B1B1B5'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M11.4199 22.5301C12.5599 23.0101 13.7699 23.2701 14.9999 23.2701C18.5299 23.2701 21.8199 21.1901 24.1099 17.5901C25.0099 16.1801 25.0099 13.8101 24.1099 12.4001C23.7799 11.8801 23.4199 11.3901 23.0499 10.9301'
            stroke='#B1B1B5'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M18.5099 15.7C18.2499 17.11 17.0999 18.26 15.6899 18.52'
            stroke='#B1B1B5'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M12.47 17.5301L5 25.0001'
            stroke='#B1B1B5'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M25.0003 5L17.5303 12.47'
            stroke='#B1B1B5'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      );
    case 'eye':
      return (
        <svg
          width={w || '30'}
          height={h || '30'}
          viewBox='0 0 30 30'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M18.7288 14.9999C18.7288 17.0624 17.0622 18.7291 14.9997 18.7291C12.9372 18.7291 11.2705 17.0624 11.2705 14.9999C11.2705 12.9374 12.9372 11.2708 14.9997 11.2708C17.0622 11.2708 18.7288 12.9374 18.7288 14.9999Z'
            stroke='#B1B1B5'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M15.0003 23.6147C18.6774 23.6147 22.1045 21.448 24.4899 17.698C25.4274 16.2293 25.4274 13.7605 24.4899 12.2918C22.1045 8.54179 18.6774 6.37512 15.0003 6.37512C11.3232 6.37512 7.89616 8.54179 5.51074 12.2918C4.57324 13.7605 4.57324 16.2293 5.51074 17.698C7.89616 21.448 11.3232 23.6147 15.0003 23.6147Z'
            stroke='#B1B1B5'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      );
    case 'eye-bold':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='17'
          fill='none'
          viewBox='0 0 16 17'
        >
          <path
            fill='#929298'
            d='M14.167 6.6C12.627 4.18 10.374 2.787 8 2.787c-1.186 0-2.34.346-3.393.993-1.054.653-2 1.607-2.774 2.82-.666 1.047-.666 2.747 0 3.793C3.373 12.82 5.627 14.207 8 14.207c1.187 0 2.34-.347 3.393-.994 1.054-.653 2-1.606 2.774-2.82.667-1.04.667-2.746 0-3.793ZM8 11.193A2.69 2.69 0 0 1 5.307 8.5 2.69 2.69 0 0 1 8 5.807 2.69 2.69 0 0 1 10.694 8.5 2.69 2.69 0 0 1 8 11.193Z'
          />
          <path
            fill='#929298'
            d='M8 6.593A1.903 1.903 0 0 0 8 10.4a1.91 1.91 0 0 0 1.907-1.9c0-1.047-.86-1.907-1.907-1.907Z'
          />
        </svg>
      );
    case 'arrow-left':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '20'}
          height={h || '16'}
          fill='none'
          viewBox='0 0 20 16'
        >
          <path
            stroke='#929298'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M19 8H1m0 0 7.508 7M1 8l7.508-7'
          />
        </svg>
      );

    case 'arrow-right':
      return (
        <svg
          width={w || '24'}
          height={h || '24'}
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M14.4302 5.92969L20.5002 11.9997L14.4302 18.0697'
            stroke='#173B58'
            strokeWidth='1.5'
            strokeMiterlimit='10'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M3.5 12H20.33'
            stroke='#173B58'
            strokeWidth='1.5'
            strokeMiterlimit='10'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      );

    case 'arrow-left-slide':
      return (
        <svg
          width={w}
          height={h}
          viewBox='0 0 16 13'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M15.125 6.50002L0.875 6.50002M0.875 6.50002L6.81885 12.0417M0.875 6.50002L6.81885 0.958353'
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      );

    case 'arrow-right-slide':
      return (
        <svg
          width={w}
          height={h}
          viewBox='0 0 20 19'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M11.9238 4.69458L16.7292 9.5L11.9238 14.3054'
            stroke='#0A49A5'
            strokeMiterlimit='10'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M3.27148 9.5H16.5952'
            stroke='#0A49A5'
            strokeMiterlimit='10'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      );

    case 'arrow-up-feed':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='12'
          height='12'
          fill='none'
        >
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
            d='M9.035 4.785 6 1.75 2.965 4.785M6 10.25V1.837'
          />
        </svg>
      );

    case 'select-arrow':
      return (
        <svg
          width={w}
          height={h}
          viewBox='0 0 10 5'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M10 0H1H0L5 5L10 0Z' fill='#777E90' />
        </svg>
      );
    case 'arrow-down':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '22'}
          height={h || '22'}
          fill='none'
          viewBox='0 0 22 22'
        >
          <path
            stroke='#929298'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
            d='m16.808 8.763-4.781 4.781a1.456 1.456 0 0 1-2.053 0l-4.782-4.78'
          />
        </svg>
      );
    case 'arrow-up':
      return (
        <svg
          width='18'
          height='19'
          viewBox='0 0 18 19'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M4.5 11.75L9 7.25L13.5 11.75'
            stroke='black'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      );
    case 'rotate-arrow':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '16'}
          height={h || '17'}
          fill='none'
          viewBox='0 0 16 17'
        >
          <g
            stroke='#44BE2E'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
          >
            <path d='M2.667 13.834 13.333 3.167M2.667 5.834v8h8' />
          </g>
        </svg>
      );
    case 'plus':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='18'
          height='18'
          fill='none'
          viewBox='0 0 18 18'
        >
          <path
            stroke={color || '#fff'}
            strokeLinecap='round'
            strokeWidth='1.5'
            d='M16.979 9H1.019M9 16.98V1.02'
          />
        </svg>
      );

    case 'error-circle':
      return (
        <svg
          width={w}
          height={h}
          viewBox='0 0 20 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M3.66583 3.66582C5.2863 2.04537 7.52674 1.04199 10.0003 1.04199C12.4739 1.04199 14.7144 2.04537 16.3348 3.66582L15.8929 4.10777L16.3348 3.66583C17.9553 5.2863 18.9587 7.52674 18.9587 10.0003C18.9587 12.4739 17.9553 14.7144 16.3348 16.3348C14.7144 17.9553 12.4739 18.9587 10.0003 18.9587C7.52674 18.9587 5.2863 17.9553 3.66583 16.3348L4.10777 15.8929L3.66582 16.3348C2.04537 14.7144 1.04199 12.4739 1.04199 10.0003C1.04199 7.52674 2.04537 5.2863 3.66582 3.66583L3.66583 3.66582ZM10.0003 2.29199C7.87158 2.29199 5.94535 3.15409 4.54971 4.54971C3.15409 5.94536 2.29199 7.87158 2.29199 10.0003C2.29199 12.1291 3.15409 14.0553 4.54971 15.4509C5.94535 16.8466 7.87158 17.7087 10.0003 17.7087C12.1291 17.7087 14.0553 16.8466 15.4509 15.4509C16.8466 14.0553 17.7087 12.1291 17.7087 10.0003C17.7087 7.87158 16.8466 5.94535 15.4509 4.54971C14.0553 3.15409 12.1291 2.29199 10.0003 2.29199Z'
            fill='#EB5757'
          />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M9.99967 15.4163C10.575 15.4163 11.0413 14.95 11.0413 14.3747C11.0413 13.7994 10.575 13.333 9.99967 13.333C9.42438 13.333 8.95801 13.7994 8.95801 14.3747C8.95801 14.95 9.42438 15.4163 9.99967 15.4163Z'
            fill='#EB5757'
          />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M10 4.375C10.3452 4.375 10.625 4.65482 10.625 5V11.6667C10.625 12.0118 10.3452 12.2917 10 12.2917C9.65482 12.2917 9.375 12.0118 9.375 11.6667V5C9.375 4.65482 9.65482 4.375 10 4.375Z'
            fill='#EB5757'
          />
        </svg>
      );
    case 'close-circle':
      return (
        <svg
          width='19'
          height='20'
          viewBox='0 0 19 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g clipPath='url(#clip0_220_646)'>
            <circle cx='9.5' cy='10' r='9.5' fill='#B1B1B5' />
            <path
              d='M13.7972 6.68184C14.0676 6.41148 14.0676 5.97314 13.7972 5.70277C13.5269 5.43241 13.0885 5.43241 12.8182 5.70277L9.5 9.02093L6.18184 5.70277C5.91148 5.43241 5.47314 5.43241 5.20277 5.70277C4.93241 5.97314 4.93241 6.41148 5.20277 6.68184L8.52093 10L5.20277 13.3182C4.93241 13.5885 4.93241 14.0269 5.20277 14.2972C5.47314 14.5676 5.91148 14.5676 6.18184 14.2972L9.5 10.9791L12.8182 14.2972C13.0885 14.5676 13.5269 14.5676 13.7972 14.2972C14.0676 14.0269 14.0676 13.5885 13.7972 13.3182L10.4791 10L13.7972 6.68184Z'
              fill='white'
            />
          </g>
          <defs>
            <clipPath id='clip0_220_646'>
              <rect
                width='19'
                height='19'
                fill='white'
                transform='translate(0 0.5)'
              />
            </clipPath>
          </defs>
        </svg>
      );
    case 'close-outline':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          width='25'
          height='25'
          viewBox='0 0 25 25'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M12.5 22.917c5.73 0 10.417-4.688 10.417-10.417 0-5.73-4.687-10.417-10.416-10.417-5.73 0-10.417 4.688-10.417 10.417 0 5.73 4.687 10.417 10.417 10.417ZM9.553 15.448l5.896-5.896'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M15.449 15.448 9.553 9.552'
          />
        </svg>
      );
    case 'copy':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '19'}
          height={h || '20'}
          fill='none'
          viewBox='0 0 19 20'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M12.667 10.713v3.325c0 2.77-1.108 3.879-3.879 3.879H5.463c-2.77 0-3.879-1.109-3.879-3.88v-3.324c0-2.771 1.108-3.88 3.88-3.88h3.324c2.771 0 3.88 1.109 3.88 3.88Z'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M17.417 5.963v3.325c0 2.77-1.108 3.879-3.879 3.879h-.87v-2.454c0-2.771-1.109-3.88-3.88-3.88H6.334v-.87c0-2.771 1.108-3.88 3.88-3.88h3.324c2.771 0 3.88 1.109 3.88 3.88Z'
          />
        </svg>
      );

    case 'close':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || 24}
          height={h || 24}
          fill='none'
          viewBox='0 0 24 24'
        >
          <path
            stroke='#929298'
            strokeLinecap='round'
            strokeWidth='1.5'
            d='M17.781 17.968 6.594 6.781m0 11.187L17.78 6.781'
          />
        </svg>
      );
    case 'download':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || 25}
          height={h || 25}
          fill='none'
          viewBox='0 0 25 25'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M7.292 11.65 12.5 16.86l5.208-5.208'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M12.5 16.859V2.97M2.083 20.331a32.898 32.898 0 0 0 20.834 0'
          />
        </svg>
      );
    case 'check':
      return (
        <svg
          width={w || '15'}
          height={h || '16'}
          viewBox='0 0 15 17'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='m2.5 7.737 3.548 3.208L12.5 4.07'
          />
        </svg>
      );
    case 'check-thin':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='28'
          height='28'
          fill='none'
          viewBox='0 0 28 28'
        >
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='m4.88 13.848 6.472 5.852L23.12 7.16'
          />
        </svg>
      );
    case 'success':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          fill='none'
          viewBox='0 0 24 24'
        >
          <path
            stroke='#27AE60'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10Z'
          />
          <path
            stroke='#27AE60'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='m7.75 12 2.83 2.83 5.67-5.66'
          />
        </svg>
      );
    case 'select':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          width='25'
          height='25'
          viewBox='0 0 25 25'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M9.375 22.917h6.25c5.208 0 7.292-2.084 7.292-7.292v-6.25c0-5.208-2.084-7.292-7.292-7.292h-6.25c-5.208 0-7.292 2.084-7.292 7.292v6.25c0 5.208 2.084 7.292 7.292 7.292Z'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='m8.073 12.5 2.948 2.948 5.906-5.896'
          />
        </svg>
      );
    case 'message-succeeded':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='18'
          height='19'
          fill='none'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='m3 9.4 4.258 3.85L15 5'
          />
        </svg>
      );
    case 'message-read':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='18'
          height='19'
          fill='none'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='m1.5 9.4 4.258 3.85L13.5 5M9 13.25 16.5 5'
          />
        </svg>
      );
    case 'keyboard-open':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          fill='none'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M7.563 2.083h9.864c.678 0 1.282.021 1.823.094 2.886.323 3.667 1.677 3.667 5.385v6.584c0 3.708-.781 5.062-3.667 5.385-.541.073-1.135.094-1.823.094H7.563c-.677 0-1.281-.02-1.823-.094-2.886-.323-3.667-1.677-3.667-5.385V7.562c0-3.708.781-5.062 3.667-5.385.542-.073 1.146-.094 1.823-.094ZM14.146 8.666h3.834M7.021 14.698H17.99M7.292 22.917h10.417'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M7.495 8.646h.009M10.932 8.646h.01'
          />
        </svg>
      );

    case 'key':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          width={w || '25'}
          height={h || '25'}
          viewBox='0 0 25 25'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M9.375 22.917h6.25c5.208 0 7.292-2.084 7.292-7.292v-6.25c0-5.208-2.084-7.292-7.292-7.292h-6.25c-5.208 0-7.292 2.084-7.292 7.292v6.25c0 5.208 2.084 7.292 7.292 7.292Z'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
            d='M16.958 14.177a4.32 4.32 0 0 1-4.354 1.073l-2.698 2.688c-.187.197-.573.322-.854.28l-1.25-.166c-.417-.052-.792-.448-.854-.854l-.167-1.25c-.041-.27.094-.656.282-.854l2.687-2.688a4.343 4.343 0 0 1 1.073-4.354c1.687-1.687 4.437-1.687 6.135 0 1.688 1.677 1.688 4.427 0 6.125ZM10.885 16.958 10 16.063'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M13.953 11.146h.009'
          />
        </svg>
      );

    case 'search':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || 20}
          height={h || 20}
          fill='none'
          viewBox='0 0 20 20'
        >
          <path
            fill='#0A49A5'
            d='m1.316 11.781.73-.171-.73.171Zm0-5.457.73.171-.73-.171Zm15.473 0 .73-.171-.73.171Zm0 5.457.73.171-.73-.171Zm-5.008 5.008-.171-.73.171.73Zm-5.457 0-.171.73.171-.73Zm0-15.473-.171-.73.171.73Zm5.457 0 .171-.73-.171.73ZM18.47 19.53a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM2.046 11.61a11.198 11.198 0 0 1 0-5.115l-1.46-.342a12.698 12.698 0 0 0 0 5.8l1.46-.343Zm14.013-5.115a11.196 11.196 0 0 1 0 5.115l1.46.342a12.698 12.698 0 0 0 0-5.8l-1.46.343Zm-4.45 9.564a11.196 11.196 0 0 1-5.114 0l-.342 1.46c1.907.448 3.892.448 5.8 0l-.343-1.46ZM6.496 2.046a11.198 11.198 0 0 1 5.115 0l.342-1.46a12.698 12.698 0 0 0-5.8 0l.343 1.46Zm0 14.013a5.97 5.97 0 0 1-4.45-4.45l-1.46.343a7.47 7.47 0 0 0 5.568 5.568l.342-1.46Zm5.457 1.46a7.47 7.47 0 0 0 5.568-5.567l-1.46-.342a5.97 5.97 0 0 1-4.45 4.45l.342 1.46ZM11.61 2.046a5.97 5.97 0 0 1 4.45 4.45l1.46-.343A7.47 7.47 0 0 0 11.952.586l-.342 1.46ZM6.153.586A7.47 7.47 0 0 0 .586 6.153l1.46.342a5.97 5.97 0 0 1 4.45-4.45L6.152.586Zm8.652 15.28 3.665 3.664 1.06-1.06-3.665-3.665-1.06 1.06Z'
          />
        </svg>
      );
    case 'user':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='25'
          fill='none'
          viewBox='0 0 24 25'
        >
          <path
            stroke={stroke || '#0A49A5'}
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M12 12.82a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM20.59 22.82c0-3.87-3.85-7-8.59-7s-8.59 3.13-8.59 7'
          />
        </svg>
      );
    case 'user-border':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='26'
          height='25'
          fill='none'
        >
          <path
            stroke='#929298'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M19.396 22.52c-.916.272-2 .397-3.27.397h-6.25c-1.272 0-2.355-.125-3.272-.396.23-2.709 3.01-4.844 6.396-4.844s6.167 2.135 6.396 4.844Z'
          />
          <path
            stroke='#929298'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M16.125 2.083h-6.25c-5.209 0-7.292 2.084-7.292 7.292v6.25c0 3.937 1.188 6.094 4.02 6.896.23-2.709 3.011-4.844 6.397-4.844 3.385 0 6.166 2.135 6.395 4.844 2.834-.802 4.021-2.959 4.021-6.896v-6.25c0-5.208-2.083-7.292-7.291-7.292ZM13 14.76a3.734 3.734 0 0 1-3.73-3.74A3.725 3.725 0 0 1 13 7.293a3.725 3.725 0 0 1 3.729 3.729 3.734 3.734 0 0 1-3.73 3.74Z'
          />
          <path
            stroke='#929298'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M16.729 11.02a3.734 3.734 0 0 1-3.73 3.74 3.734 3.734 0 0 1-3.728-3.74A3.725 3.725 0 0 1 13 7.293a3.725 3.725 0 0 1 3.729 3.729Z'
          />
        </svg>
      );
    case 'users':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          width={w || '20'}
          height={h || '21'}
          viewBox='0 0 20 21'
        >
          <path
            stroke={stroke || '#0A49A5'}
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M7.634 9.378a1.515 1.515 0 0 0-.275 0 3.683 3.683 0 0 1-3.558-3.691c0-2.042 1.65-3.7 3.7-3.7a3.696 3.696 0 0 1 .133 7.392ZM13.675 3.653A2.915 2.915 0 0 1 16.59 6.57a2.92 2.92 0 0 1-2.808 2.917.94.94 0 0 0-.217 0M3.468 12.453c-2.017 1.35-2.017 3.55 0 4.892 2.291 1.533 6.05 1.533 8.341 0 2.017-1.35 2.017-3.55 0-4.892-2.283-1.525-6.041-1.525-8.341 0ZM15.283 16.987a4.03 4.03 0 0 0 1.633-.725c1.3-.975 1.3-2.584 0-3.559-.458-.35-1.016-.583-1.608-.716'
          />
        </svg>
      );
    case 'user-plus':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          width={w || '25'}
          height={h || '25'}
          viewBox='0 0 25 25'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M19.27 20.313h-4.166M17.188 22.396v-4.167M12.667 11.323c-.104-.01-.23-.01-.344 0a4.604 4.604 0 0 1-4.448-4.615 4.612 4.612 0 0 1 4.615-4.625 4.628 4.628 0 0 1 4.625 4.625c0 2.5-1.98 4.532-4.448 4.615ZM12.49 22.719c-1.896 0-3.782-.48-5.22-1.438-2.52-1.687-2.52-4.437 0-6.114 2.865-1.917 7.563-1.917 10.428 0'
          />
        </svg>
      );
    case 'user-minus':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='25'
          fill='none'
          viewBox='0 0 24 25'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M19.5 19.14h-4M12.15 11.01c-.1-.01-.22-.01-.33 0a4.42 4.42 0 0 1-4.27-4.43c0-2.45 1.98-4.44 4.44-4.44a4.435 4.435 0 0 1 .16 8.87ZM11.99 21.95c-1.82 0-3.63-.46-5.01-1.38-2.42-1.62-2.42-4.26 0-5.87 2.75-1.84 7.26-1.84 10.01 0'
          />
        </svg>
      );
    case 'settings':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='26'
          height='25'
          fill='none'
          viewBox='0 0 26 25'
        >
          <path
            stroke='#929298'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
            d='M13 15.625a3.125 3.125 0 1 0 0-6.25 3.125 3.125 0 0 0 0 6.25Z'
          />
          <path
            stroke='#929298'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
            d='M2.583 13.417v-1.834c0-1.083.885-1.979 1.98-1.979 1.885 0 2.655-1.333 1.708-2.969A1.978 1.978 0 0 1 7 3.937l1.802-1.03c.823-.49 1.885-.199 2.375.624l.114.198c.938 1.635 2.48 1.635 3.427 0l.115-.198c.49-.823 1.552-1.114 2.375-.625l1.802 1.031c.948.542 1.27 1.76.73 2.698-.949 1.636-.178 2.97 1.708 2.97 1.083 0 1.979.884 1.979 1.978v1.834c0 1.083-.886 1.979-1.98 1.979-1.885 0-2.656 1.333-1.708 2.968a1.976 1.976 0 0 1-.729 2.698l-1.802 1.032c-.823.49-1.885.198-2.375-.625l-.115-.198c-.937-1.636-2.479-1.636-3.427 0l-.114.198c-.49.823-1.552 1.114-2.375.625L7 21.062a1.978 1.978 0 0 1-.73-2.698c.948-1.635.178-2.968-1.708-2.968a1.985 1.985 0 0 1-1.979-1.98Z'
          />
        </svg>
      );
    case 'calendar':
      return (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M8 2V5'
            stroke='#0A49A5'
            strokeWidth='1.5'
            strokeMiterlimit='10'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M16 2V5'
            stroke='#0A49A5'
            strokeWidth='1.5'
            strokeMiterlimit='10'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M3.5 9.09009H20.5'
            stroke='#0A49A5'
            strokeWidth='1.5'
            strokeMiterlimit='10'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z'
            stroke='#0A49A5'
            strokeWidth='1.5'
            strokeMiterlimit='10'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M15.6947 13.7H15.7037'
            stroke='#0A49A5'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M15.6947 16.7H15.7037'
            stroke='#0A49A5'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M11.9955 13.7H12.0045'
            stroke='#0A49A5'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M11.9955 16.7H12.0045'
            stroke='#0A49A5'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M8.29431 13.7H8.30329'
            stroke='#0A49A5'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M8.29431 16.7H8.30329'
            stroke='#0A49A5'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      );
    case 'avatar-deleted':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '32'}
          height={h || '32'}
          fill='none'
          viewBox='0 0 32 32'
        >
          <path
            stroke='#fff'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M16.02 1.778c2.009 0 3.24.512 4.164 1.253.922.74 1.54 1.784 2.04 2.949.5 1.163.852 2.43 1.305 3.555.228.563.472 1.084.857 1.576.385.491.993.97 1.715 1.131 2.365.53 3.19 1.451 3.713 2.708.39.935.373 2.265.408 3.555-1.395.065-2.562.263-3.387.807-1.127.745-1.567 1.895-1.796 2.789-.229.892-.381 1.616-.693 2.14-.313.524-.758.98-2.082 1.375-.93.277-1.598.91-2.04 1.495-.441.584-.709 1.16-1.021 1.616-.623.91-1.074 1.469-3.1 1.494-1.284.017-1.975-.231-2.45-.566-.474-.333-.779-.816-1.101-1.494-.584-1.224-1.403-2.12-2.368-2.666-.965-.547-1.972-.812-3.305-1.253-.073-.025-.018.035-.04 0a1.71 1.71 0 0 1-.123-.445c-.092-.512-.12-1.401-.286-2.383-.165-.982-.558-2.14-1.55-3.03-.738-.662-1.812-1.06-3.102-1.293.34-2.45 1.788-4.083 4.204-4.93 1.384-.485 2.07-1.68 2.53-2.827.459-1.15.785-2.427 1.265-3.556.478-1.129 1.086-2.084 1.999-2.789.913-.703 2.159-1.211 4.244-1.211Z'
          />
          <path
            fill='#fff'
            d='M12.923 7.385c-1.02 0-1.846 1.101-1.846 2.461 0 1.36.827 2.462 1.846 2.462 1.019 0 1.846-1.102 1.846-2.462s-.827-2.461-1.846-2.461ZM17.846 7.385C16.827 7.385 16 8.486 16 9.846c0 1.36.827 2.462 1.846 2.462 1.02 0 1.846-1.102 1.846-2.462s-.827-2.461-1.846-2.461Z'
          />
        </svg>
      );
    case 'avatar-forward':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '32'}
          height={h || '32'}
          fill='none'
          viewBox='0 0 32 32'
        >
          <path
            fill='#fff'
            d='m18.548 6.067 7.012 6.448c1.311 1.205 1.967 1.808 2.208 2.52a3.01 3.01 0 0 1 0 1.93c-.241.712-.897 1.315-2.208 2.52l-7.012 6.448c-.595.547-.893.82-1.145.83a.695.695 0 0 1-.57-.265c-.161-.201-.161-.613-.161-1.437v-5.229c-5.748 0-7.034 2.3-9.672 4.318-1.373 1.05-2.06 1.575-2.321 1.554-.255-.02-.417-.123-.55-.35-.135-.231-.015-.957.225-2.408 1.556-9.423 7.825-11.942 12.318-11.942V6.938c0-.823 0-1.235.16-1.436a.695.695 0 0 1 .57-.265c.253.01.55.283 1.146.83Z'
          />
        </svg>
      );
    case 'ai-bot':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '24'}
          height={h || '24'}
          fill='none'
          viewBox='0 0 24 24'
        >
          <g clipPath='url(#aiBot)'>
            <path
              fill='#0A49A5'
              d='M0 10C0 4.477 4.477 0 10 0h4c5.523 0 10 4.477 10 10v4c0 5.523-4.477 10-10 10h-4C4.477 24 0 19.523 0 14v-4Z'
            />
            <g clipPath='url(#biBot)'>
              <mask id={id || 'ciBot'} fill='#fff'>
                <path d='M5.078 11.49v7.49h7.42c4.099 0 7.421-3.353 7.421-7.49 0-4.137-3.322-7.49-7.42-7.49C8.4 4 5.077 7.353 5.077 11.49Z' />
              </mask>
              <path
                fill='#fff'
                d='M5.078 11.49v7.49h7.42c4.099 0 7.421-3.353 7.421-7.49 0-4.137-3.322-7.49-7.42-7.49C8.4 4 5.077 7.353 5.077 11.49Z'
              />
              <path
                fill='#fff'
                d='M5.078 18.98h-7.969v7.969h7.969V18.98Zm7.42 7.969c8.57 0 15.39-6.992 15.39-15.459H11.95c0-.194.176-.479.548-.479V26.95Zm15.39-15.459c0-8.467-6.82-15.459-15.39-15.459V11.97c-.372 0-.548-.285-.548-.479h15.938ZM12.498-3.969C3.93-3.969-2.89 3.023-2.89 11.491h15.938c0 .193-.176.478-.549.478V-3.97ZM-2.89 11.491V18.98h15.938V11.49H-2.891Zm7.969 7.49v7.968H12.499V11.01H5.078v7.97Z'
                mask={`url(#${id || 'ciBot'})`}
              />
              <path
                fill='#0A49A5'
                fillRule='evenodd'
                d='m13.188 14.796-.502-1.599H10.37l-.503 1.599H8.452l2.288-6.592h1.621l1.956 5.621V11.5c0-.76.615-1.375 1.375-1.375v3.295c0 .648-.448 1.192-1.051 1.337l.013.039h-1.466Zm-1.676-5.331-.845 2.7h1.722l-.845-2.7h-.032Zm3.492.115a.688.688 0 1 0 0-1.376.688.688 0 0 0 0 1.376Z'
                clipRule='evenodd'
              />
            </g>
          </g>
          <defs>
            <clipPath id='aiBot'>
              <rect width='24' height='24' fill='#fff' rx='10' />
            </clipPath>
            <clipPath id='biBot'>
              <path fill='#fff' d='M5 4h15v15H5z' />
            </clipPath>
          </defs>
        </svg>
      );
    case 'ai-bot-ql':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          fill='none'
          viewBox='0 0 24 24'
        >
          <g clipPath='url(#aiBotQl)'>
            <path
              fill='#070708'
              fillOpacity='.05'
              d='M0 12v12h12c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12Z'
            />
            <path
              fill='#0A49A5'
              fillRule='evenodd'
              d='m13.196 17-.763-2.425H8.915L8.15 17H6L9.477 7h2.463l2.97 8.525v-3.522A2.09 2.09 0 0 1 17 9.913v4.997c0 .984-.68 1.81-1.596 2.031l.02.059H13.196ZM10.65 8.913l-1.284 4.095h2.616l-1.284-4.095h-.048Zm5.305.174a1.044 1.044 0 1 0 .002-2.089 1.044 1.044 0 0 0-.002 2.089Z'
              clipRule='evenodd'
            />
          </g>
          <defs>
            <clipPath id='aiBotQl'>
              <path fill='#fff' d='M0 0h24v24H0z' />
            </clipPath>
          </defs>
        </svg>
      );
    case 'panda-bot':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '24'}
          height={h || '24'}
          fill='none'
          viewBox='0 0 24 24'
        >
          <g
            fill={color || '#44BE2E'}
            fillRule='evenodd'
            clipPath='url(#a)'
            clipRule='evenodd'
          >
            <path d='M13.462 2.523a.448.448 0 0 0-.895-.039c-.016.37-.127.67-.302.888a1.176 1.176 0 0 1-.276.25c.02-.146.02-.297-.003-.447a.447.447 0 1 0-.884.141.738.738 0 0 1-.126.51.477.477 0 0 1-.227.193c-1.54.18-2.967.674-4.2 1.404a2.275 2.275 0 0 0-.917-.967c-1.32-.738-3.149.025-4.086 1.702-.938 1.678-.628 3.636.692 4.373.06.034.12.064.181.09-.19.68-.29 1.391-.29 2.122 0 4.861 4.45 8.802 9.941 8.802 5.49 0 9.942-3.94 9.942-8.802 0-.78-.115-1.538-.33-2.26l.073-.039c1.323-.73 1.642-2.687.712-4.37-.93-1.681-2.755-2.452-4.079-1.72a2.28 2.28 0 0 0-.934.989 10.593 10.593 0 0 0-3.013-1.15c.122-.135.227-.298.3-.493a.448.448 0 0 0-.84-.311c-.069.187-.224.326-.428.424a1.306 1.306 0 0 1-.52.13l.008-.007a.08.08 0 0 1 .002-.004c.313-.39.476-.88.499-1.409ZM10.926 4.9a1.129 1.129 0 0 1-.24.029c-4.414.588-7.663 3.943-7.663 7.815 0 4.268 3.945 7.907 9.047 7.907s9.047-3.64 9.047-7.907c0-4.267-3.945-7.906-9.047-7.906-.388 0-.77.02-1.144.062Z' />
            <path d='M7.191 14.879c1.187.395 2.598-.633 3.153-2.297.555-1.664.043-3.333-1.143-3.729-1.187-.395-2.598.633-3.153 2.297-.555 1.663-.043 3.333 1.143 3.729Zm9.652.01c-1.171.39-2.571-.643-3.127-2.307-.556-1.664-.057-3.328 1.114-3.718 1.17-.39 2.57.643 3.127 2.307.555 1.664.057 3.328-1.114 3.718Zm-5.057.428c-.396-.115-1.434-.415-1.3-1.142.163-.883 1.832-1.019 2.667-.71.835.309.914 1.576-1.218 1.903-.007-.01-.063-.026-.149-.05Zm-.801 1.155a.448.448 0 0 0-.788.426 2.08 2.08 0 0 0 1.8 1.016 2.08 2.08 0 0 0 1.8-1.016.447.447 0 1 0-.787-.425c-.086.158-.433.546-1.012.546-.58 0-.927-.388-1.013-.546Zm3.69-3.571c0 .554.41 1.003.913 1.003.504 0 .912-.449.912-1.003 0-.554-.409-1.003-.912-1.003-.504 0-.912.449-.912 1.003Zm-5.31.013c0 .554-.408 1.004-.911 1.004-.504 0-.912-.45-.912-1.004s.408-1.003.912-1.003c.503 0 .912.45.912 1.003Z' />
          </g>
          <defs>
            <clipPath id='a'>
              <path fill='#fff' d='M1 1h22v22H1z' />
            </clipPath>
          </defs>
        </svg>
      );

    case 'support-bot':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '42'}
          height={h || '36'}
          fill='none'
          viewBox='0 0 42 36'
        >
          <ellipse
            cx='6.929'
            cy='10.835'
            fill='#4E92F5'
            rx='4.777'
            ry='6.073'
            transform='rotate(29.194 6.929 10.835)'
          />
          <ellipse
            cx='35.09'
            cy='10.669'
            fill='#4E92F5'
            rx='4.777'
            ry='6.073'
            transform='rotate(151.075 35.09 10.67)'
          />
          <ellipse
            cx='21.126'
            cy='19.997'
            fill='#fff'
            rx='17.351'
            ry='15.361'
          />
          <path
            fill='#4E92F5'
            fillRule='evenodd'
            d='M21.126 33.796c8.904 0 15.789-6.352 15.789-13.8 0-7.447-6.885-13.798-15.789-13.798S5.337 12.549 5.337 19.997c0 7.447 6.885 13.799 15.789 13.799Zm0 1.562c9.582 0 17.35-6.877 17.35-15.361 0-8.484-7.767-15.36-17.35-15.36-9.583 0-17.35 6.876-17.35 15.36 0 8.483 7.768 15.36 17.35 15.36Z'
            clipRule='evenodd'
          />
          <path
            fill='#4E92F5'
            fillRule='evenodd'
            d='M18.175 26.189a.781.781 0 0 1 1.058.316c.15.277.756.954 1.767.954 1.012 0 1.618-.677 1.768-.954a.781.781 0 0 1 1.374.742c-.341.632-1.404 1.774-3.142 1.774s-2.8-1.142-3.141-1.774a.781.781 0 0 1 .316-1.058Z'
            clipRule='evenodd'
          />
          <path
            fill='#4E92F5'
            d='M18.362 22.497c-.284 1.541 2.457 1.984 2.529 2.08 3.72-.57 3.582-2.781 2.125-3.32-1.456-.54-4.37-.303-4.654 1.24Z'
          />
          <ellipse
            cx='14.366'
            cy='18.466'
            fill='#4E92F5'
            rx='3.952'
            ry='5.542'
            transform='rotate(18.441 14.366 18.466)'
          />
          <ellipse
            cx='3.9'
            cy='5.543'
            fill='#4E92F5'
            rx='3.9'
            ry='5.543'
            transform='matrix(-.94883 .3158 .31687 .94847 29.643 11.995)'
          />
          <ellipse cx='14.815' cy='20.295' fill='#fff' rx='1.592' ry='1.751' />
          <ellipse
            cx='1.592'
            cy='1.751'
            fill='#fff'
            rx='1.592'
            ry='1.751'
            transform='matrix(-1 0 0 1 28.857 18.52)'
          />
          <path
            fill='#fff'
            d='m2.045 14.074 1.544-.325-.763 10.015-1.49-.379c-1.65-.655-1.109-8.92.71-9.311Z'
          />
          <path
            fill='#000'
            fillRule='evenodd'
            d='m4.21 14.695-1.43-.109c-.528-.04-.972.311-1.06.78-.425 2.278-.55 4.073-.481 6.496a1 1 0 0 0 .937.954l1.406.107.627-8.228ZM2.86 13.517c-1.047-.08-2.002.62-2.194 1.652-.441 2.36-.57 4.232-.5 6.724.03 1.06.87 1.911 1.928 1.992l2.475.188.79-10.365-2.499-.19Z'
            clipRule='evenodd'
          />
          <path
            fill='#878787'
            d='m3.74 13.16 3.523-.177c-2.026 3.965-1.68 6.784-1.233 11.453l-3.035-.176c-2.075-.352-1.282-11.013.744-11.1Z'
          />
          <path
            fill='#727272'
            fillRule='evenodd'
            d='m5.677 23.996-3.29-.269-.41-4.137h3.7v4.406Z'
            clipRule='evenodd'
          />
          <path
            fill='#A0A0A0'
            fillRule='evenodd'
            d='M5.727 18.005H2.24l.623-2.996h3.166l-.302 2.996Z'
            clipRule='evenodd'
          />
          <path
            fill='#000'
            fillRule='evenodd'
            d='M5.796 13.87h-1.33c-.327 0-.537.162-.616.322-1.203 2.452-1.28 5.196-.927 8.622a.823.823 0 0 0 .832.724h1.247c-.33-3.442-.493-6.294.794-9.667Zm-1.33-1.25c-.727 0-1.418.368-1.738 1.02-1.364 2.78-1.408 5.82-1.049 9.302.11 1.058 1.013 1.847 2.076 1.847h2.626l-.046-.474-.076-.777c-.349-3.62-.504-6.34.883-9.667.17-.407.363-.823.58-1.251H4.468ZM36.535 20.466c.344 0 .623.278.623.622 0 1.765-.23 3.242-.844 4.478-.621 1.25-1.607 2.196-3.01 2.944-2.83 1.509-6.12 1.155-7.147 1.038a.623.623 0 0 1 .141-1.237c1.03.117 3.964.41 6.42-.9 1.219-.65 1.995-1.423 2.48-2.4.493-.992.714-2.252.714-3.923 0-.344.28-.622.623-.622Z'
            clipRule='evenodd'
          />
          <rect
            width='4.229'
            height='2.114'
            x='26.051'
            y='27.872'
            fill='#2B2B2B'
            rx='.554'
          />
          <path
            fill='#000'
            fillRule='evenodd'
            d='M26.757 28.577v.705h2.819v-.705h-2.82Zm-.177-.705a.529.529 0 0 0-.528.529v1.057c0 .292.236.529.528.529h3.172a.529.529 0 0 0 .529-.529v-1.057a.529.529 0 0 0-.529-.529H26.58Z'
            clipRule='evenodd'
          />
          <path
            fill='#656565'
            d='M24.818 28.93c0-.78.631-1.41 1.41-1.41h1.913c.306 0 .554.248.554.553v1.712a.554.554 0 0 1-.554.554h-1.913a1.41 1.41 0 0 1-1.41-1.41Z'
          />
          <path
            fill='#000'
            fillRule='evenodd'
            d='M27.99 28.224h-1.762a.705.705 0 0 0 0 1.41h1.762v-1.41Zm-1.762-.704a1.41 1.41 0 0 0 0 2.819h1.938a.529.529 0 0 0 .529-.529v-1.762a.529.529 0 0 0-.529-.528h-1.938Z'
            clipRule='evenodd'
          />
          <path
            fill='#fff'
            d='m39.932 14.074-1.543-.325.763 10.015 1.49-.379c1.649-.655 1.108-8.92-.71-9.311Z'
          />
          <path
            fill='#000'
            fillRule='evenodd'
            d='m37.769 14.695 1.429-.109c.527-.04.972.311 1.06.78.424 2.278.55 4.073.48 6.496a1 1 0 0 1-.937.954l-1.405.107-.627-8.228Zm1.348-1.178c1.047-.08 2.001.62 2.194 1.652.44 2.36.57 4.232.5 6.724-.03 1.06-.871 1.911-1.928 1.992l-2.475.188-.79-10.365 2.498-.19Z'
            clipRule='evenodd'
          />
          <path
            fill='#878787'
            d='m38.24 13.16-3.524-.177c2.026 3.965 1.68 6.784 1.233 11.453l3.034-.176c2.075-.352 1.283-11.013-.744-11.1Z'
          />
          <path
            fill='#727272'
            fillRule='evenodd'
            d='m36.302 23.996 3.312-.269.388-4.137h-3.7v4.406Z'
            clipRule='evenodd'
          />
          <path
            fill='#A0A0A0'
            fillRule='evenodd'
            d='M36.273 18.005h3.464l-.6-2.996h-3.188l.324 2.996Z'
            clipRule='evenodd'
          />
          <path
            fill='#000'
            fillRule='evenodd'
            d='M36.12 13.87h1.413c.327 0 .537.162.615.321 1.2 2.45 1.264 5.192.907 8.622a.825.825 0 0 1-.833.725h-1.248c.322-3.454.442-6.3-.854-9.667Zm1.413-1.25c.727 0 1.418.368 1.738 1.021 1.36 2.78 1.39 5.818 1.028 9.301-.11 1.058-1.014 1.847-2.077 1.847h-2.626l.015-.153c.037-.375.073-.741.106-1.098.34-3.62.452-6.34-.945-9.667-.17-.407-.364-.823-.582-1.251h3.343Z'
            clipRule='evenodd'
          />
          <g fillRule='evenodd' clipRule='evenodd'>
            <path
              fill='#464646'
              d='M7.723 12.62c.817-3.376 4.668-8.54 13.167-8.54 8.498 0 12.483 5.153 13.3 8.529l1.736.01C35.298 9.038 31.415 1.344 20.89 1.344 10.365 1.343 6.7 9.037 6.074 12.62h1.649Z'
            />
            <path
              fill='#000'
              d='M13.533 4.325C15.52 3.41 17.957 2.83 20.89 2.83c2.942 0 5.4.583 7.414 1.505-1.928-1.048-4.366-1.74-7.414-1.74-3.067 0-5.476.693-7.357 1.731ZM34.19 12.61c-.817-3.376-4.802-8.529-13.3-8.529-8.499 0-12.35 5.164-13.167 8.54H6.074c.066-.376.165-.798.302-1.25C7.546 7.505 11.47 1.342 20.89 1.342c9.418 0 13.519 6.161 14.726 10.024.142.454.244.876.31 1.253l-1.736-.011Z'
            />
            <path
              fill='#727272'
              d='M28.188 6.621c-6.125-3.707-12.507-1.538-14.852-.028a1.878 1.878 0 0 1-2.632-.622c-.56-.919-.288-2.13.605-2.705 3.093-1.992 11.057-4.724 18.816-.028.909.55 1.212 1.753.677 2.687-.535.934-1.705 1.246-2.614.696Z'
            />
            <path
              fill='#000'
              d='M10.97 2.74c3.216-2.07 11.446-4.9 19.48-.037 1.205.73 1.594 2.31.895 3.533-.705 1.232-2.264 1.656-3.48.92-5.853-3.542-11.97-1.467-14.19-.037a2.504 2.504 0 0 1-3.505-.823c-.732-1.202-.384-2.793.8-3.556Zm18.831 1.033c-7.485-4.53-15.183-1.894-18.153.018-.602.388-.796 1.22-.41 1.855.381.625 1.167.802 1.76.421 2.469-1.59 9.117-3.853 15.514.019a1.255 1.255 0 0 0 1.747-.472c.37-.646.154-1.471-.458-1.841Z'
            />
            <path
              fill='#878787'
              d='M28.8 4.723c-6.641-3.909-13.523-1.626-16.104-.01a.705.705 0 0 1-.748-1.195c2.857-1.789 10.322-4.273 17.566-.01a.705.705 0 0 1-.715 1.215Z'
            />
          </g>
          <path
            fill='#4E92F5'
            fillRule='evenodd'
            d='M24.629 2.706a.78.78 0 0 1 .551.957c-.422 1.569-1.731 2.178-2.465 2.246a.781.781 0 0 1-.144-1.556c.216-.02.88-.277 1.1-1.096a.781.781 0 0 1 .958-.551ZM19.551 3.09a.52.52 0 0 1 .634.376c.161.632.04 1.317-.26 1.858-.298.538-.821 1.01-1.518 1.075a.52.52 0 0 1-.096-1.037c.254-.023.516-.205.703-.543.186-.336.25-.75.162-1.095a.52.52 0 0 1 .375-.633Z'
            clipRule='evenodd'
          />
          <path
            fill='#4E92F5'
            fillRule='evenodd'
            d='M22.449 1.253c.43-.02.797.311.818.742.044.922-.16 1.8-.64 2.529-.485.734-1.22 1.268-2.148 1.545a.781.781 0 1 1-.445-1.497c.604-.18 1.023-.505 1.29-.909.269-.409.414-.946.382-1.592a.781.781 0 0 1 .743-.818Z'
            clipRule='evenodd'
          />
        </svg>
      );
    case 'ello-logo':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '54'}
          height={h || '54'}
          fill='none'
          viewBox='0 0 54 54'
        >
          <g clipPath='url(#aLogo)'>
            <rect width='54' height='54' fill='#0049A6' rx='26' />
            <g fill='#fff' clipPath='url(#bLogo)'>
              <mask id='cLogo'>
                <path
                  fillRule='evenodd'
                  d='M13.29 40.987v-15.22c0-8.406 6.75-15.22 15.078-15.22s15.079 6.814 15.079 15.22-6.751 15.22-15.08 15.22H13.29Zm5.574-22.353v16.708H34.97V31.92H23.04v-3.623h5.17v-3.02h-5.17V21.05c0-1.772-1.723-2.349-2.584-2.416h-1.59Zm7.556 0h8.35v2.416c0 1.127-1.06 1.409-1.59 1.409h-8.35v-2.416c0-1.127 1.06-1.409 1.59-1.409Z'
                  clipRule='evenodd'
                />
              </mask>
              <path
                fillRule='evenodd'
                d='M13.29 40.987v-15.22c0-8.406 6.75-15.22 15.078-15.22s15.079 6.814 15.079 15.22-6.751 15.22-15.08 15.22H13.29Zm5.574-22.353v16.708H34.97V31.92H23.04v-3.623h5.17v-3.02h-5.17V21.05c0-1.772-1.723-2.349-2.584-2.416h-1.59Zm7.556 0h8.35v2.416c0 1.127-1.06 1.409-1.59 1.409h-8.35v-2.416c0-1.127 1.06-1.409 1.59-1.409Z'
                clipRule='evenodd'
              />
              <path
                d='M13.29 40.987H5.32v7.969h7.97v-7.97Zm5.574-5.645h-7.969v7.969h7.97v-7.969Zm0-16.708v-7.969h-7.969v7.969h7.97ZM34.97 35.342v7.969h7.97v-7.969h-7.97Zm0-3.422h7.97v-7.969h-7.97v7.969Zm-11.93 0h-7.968v7.969h7.969V31.92Zm0-3.623v-7.97h-7.968v7.97h7.969Zm5.17 0v7.968h7.969v-7.968h-7.969Zm0-3.02h7.969v-7.969h-7.969v7.969Zm-5.17 0h-7.968v7.969h7.969v-7.969Zm-2.584-6.643.619-7.945-.31-.024h-.31v7.969Zm14.316 0h7.968v-7.969h-7.968v7.969Zm-9.942 3.825H16.86v7.969h7.97v-7.97ZM5.32 25.767v15.22h15.938v-15.22H5.32ZM28.368 2.578C15.569 2.578 5.32 13.03 5.32 25.767h15.938c0-4.075 3.253-7.251 7.11-7.251V2.578Zm23.047 23.189c0-12.737-10.248-23.189-23.047-23.189v15.938c3.857 0 7.11 3.176 7.11 7.25h15.937ZM28.368 48.956c12.799 0 23.047-10.453 23.047-23.19H35.478c0 4.076-3.253 7.252-7.11 7.252v15.938Zm-15.079 0h15.079V33.018H13.289v15.938Zm13.544-13.614V18.634H10.896v16.708h15.937Zm8.136-7.969H18.864v15.938H34.97V27.373Zm-7.968 4.547v3.422h15.937V31.92H27.001Zm-3.961 7.969h11.93V23.95H23.04V39.89Zm-7.97-11.592v3.623h15.938v-3.623H15.071Zm13.14-7.97h-5.17v15.938h5.17V20.328Zm-7.97 4.95v3.02h15.938v-3.02H20.24Zm2.8 7.969h5.17V17.308h-5.17v15.938ZM15.07 21.05v4.227h15.938V21.05H15.071Zm4.766 5.529a4.535 4.535 0 0 1-2.312-.832 5.694 5.694 0 0 1-1.675-1.84 5.778 5.778 0 0 1-.778-2.857h15.937c0-3.96-2.12-6.814-4.391-8.392-1.96-1.36-4.054-1.853-5.543-1.969l-1.238 15.89Zm-.972.024h1.59V10.665h-1.59v15.938ZM34.77 10.665h-8.35v15.938h8.35V10.665Zm7.97 10.385v-2.416H26.801v2.416h15.937Zm-9.56 9.378c1.36 0 3.353-.304 5.28-1.533 2.355-1.502 4.28-4.255 4.28-7.845H26.801c0-1.021.256-2.194.908-3.315a6.699 6.699 0 0 1 2.179-2.276 6.035 6.035 0 0 1 3.29-.969v15.938Zm-8.35 0h8.35V14.49h-8.35v15.938Zm-7.97-10.385v2.416h15.938v-2.416H16.86Zm9.56-9.378c-1.361 0-3.353.304-5.28 1.533-2.356 1.502-4.28 4.255-4.28 7.845h15.938c0 1.021-.256 2.193-.909 3.314a6.698 6.698 0 0 1-2.178 2.277 6.034 6.034 0 0 1-3.291.969V10.665Z'
                mask='url(#cLogo)'
              />
            </g>
          </g>
          <rect
            width='53'
            height='53'
            x='.5'
            y='.5'
            stroke='#F2F2F2'
            rx='25.5'
          />
          <defs>
            <clipPath id='aLogo'>
              <rect width='54' height='54' fill='#fff' rx='26' />
            </clipPath>
            <clipPath id='bLogo'>
              <path fill='#fff' d='M13.29 10.547h30.163v30.48H13.29z' />
            </clipPath>
          </defs>
        </svg>
      );
    case 'panda-logo':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '45'}
          height={h || '44'}
          fill='none'
          viewBox='0 0 45 44'
        >
          <g clipPath='url(#pandaLogo)'>
            <path
              fill='#fff'
              fillRule='evenodd'
              d='M23.677 3.683a.853.853 0 0 1 1.003.669c.243 1.212-.03 2.293-.609 3.096h.13l.052-.03a4.26 4.26 0 0 0 1.173-1.037c.303-.394.45-.75.479-.996a.853.853 0 0 1 1.694.204c-.078.646-.4 1.284-.819 1.83a5.445 5.445 0 0 1-.148.184c.458.056.912.127 1.359.212a4.412 4.412 0 0 1 .85-1.503c1.976-2.29 5.942-2.111 8.858.398 2.748 2.366 3.582 5.96 2.011 8.282 1.871 2.565 2.957 5.62 2.957 8.898 0 9.082-8.328 16.443-18.601 16.443-7.545 0-14.04-3.97-16.958-9.677a2.25 2.25 0 0 1-.198.226.84.84 0 0 1-1.192-.005.853.853 0 0 1 .005-1.201c.156-.156.3-.522.345-1.107a2.59 2.59 0 0 1-.871.722.84.84 0 0 1-1.128-.392.852.852 0 0 1 .39-1.135c.2-.098.458-.406.69-.96.218-.515.345-1.078.391-1.424a14.734 14.734 0 0 1-.064-2.044 5.16 5.16 0 0 1-1.745-.487C.54 21.31-.456 16.782 1.503 12.734s6.132-6.083 9.32-4.545c1.042.503 1.85 1.323 2.396 2.342a19.591 19.591 0 0 1 5.323-2.346c.264-.178.535-.406.772-.654.254-.265.442-.525.548-.742.085-.173.087-.256.088-.27v-.003a.853.853 0 0 1 1.635-.487c.122.4.073.794-.037 1.134.928-.157 1.742-1.065 1.46-2.477a.852.852 0 0 1 .669-1.003Zm8.865 5.567a18.596 18.596 0 0 1 5.295 3.587c.393-.973.148-2.282-.72-3.324-1.158-1.389-2.983-1.778-4.077-.87a2.074 2.074 0 0 0-.498.607Zm-23.598 2.8c.47.226.838.59 1.094 1.042-1.711 1.736-3.017 3.792-3.787 6.054a2.412 2.412 0 0 1-.641-.205c-1.5-.723-1.968-2.852-1.048-4.755.921-1.903 2.883-2.86 4.382-2.136Zm29.608 6.875c1.758 2.877 1.842 6.026.188 7.032-1.653 1.008-4.418-.509-6.176-3.386-1.757-2.877-1.841-6.025-.188-7.032 1.654-1.007 4.419.509 6.176 3.386ZM18.457 30.303c2.543.846 5.583-1.397 6.79-5.01 1.206-3.614.123-7.23-2.42-8.077-2.542-.846-5.582 1.397-6.788 5.01-1.207 3.614-.124 7.23 2.418 8.077Zm8.503-2.562c.082 1.558 2.445 1.653 3.348 1.69.196.007.323.012.344.03 4.378-1.744 3.57-4.304 1.635-4.518-1.935-.215-5.426.904-5.327 2.798Zm-2.309 4.257a1.203 1.203 0 0 1 1.698-.062c.557.516 1.336.958 2.28.615a1.2 1.2 0 1 1 .821 2.255c-2.227.809-3.947-.38-4.736-1.112a1.198 1.198 0 0 1-.063-1.696Zm11.13-7.624c.99 0 1.792-.915 1.792-2.045 0-1.129-.802-2.044-1.792-2.044s-1.791.915-1.791 2.044c0 1.13.802 2.045 1.791 2.045Zm-14.61 2.907c1.083 0 1.962-.991 1.962-2.215 0-1.223-.879-2.215-1.962-2.215-1.084 0-1.963.992-1.963 2.215 0 1.224.879 2.215 1.963 2.215Z'
              clipRule='evenodd'
            />
          </g>
          <defs>
            <clipPath id='pandaLogo'>
              <path fill='#fff' d='M.5 0h44v44H.5z' />
            </clipPath>
          </defs>
        </svg>
      );
    case 'online-course':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          fill='none'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M13.052 21.27H6.468c-3.291 0-4.385-2.187-4.385-4.384V8.114c0-3.292 1.094-4.386 4.385-4.386h6.584c3.291 0 4.385 1.094 4.385 4.386v8.77c0 3.292-1.104 4.386-4.385 4.386ZM20.333 17.812l-2.895-2.03V9.207l2.895-2.031c1.417-.99 2.584-.385 2.584 1.354v7.938c0 1.74-1.167 2.343-2.584 1.343Z'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M11.98 11.458a1.563 1.563 0 1 0 0-3.125 1.563 1.563 0 0 0 0 3.125Z'
          />
        </svg>
      );
    case 'message':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          fill='none'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M22.916 11.921a9.698 9.698 0 0 1-1.041 4.398 9.837 9.837 0 0 1-8.797 5.44 9.7 9.7 0 0 1-4.398-1.041l-6.597 2.199 2.2-6.598a9.7 9.7 0 0 1-1.043-4.398 9.838 9.838 0 0 1 5.44-8.796 9.699 9.699 0 0 1 4.398-1.042h.58a9.815 9.815 0 0 1 9.258 9.26v.578Z'
          />
        </svg>
      );
    case 'comment':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          fill='none'
          viewBox='0 0 20 20'
        >
          <path
            stroke='#4D4D50'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
            d='M5.833 15.358h3.333l3.709 2.467a.83.83 0 0 0 1.291-.692v-1.775c2.5 0 4.167-1.666 4.167-4.166v-5c0-2.5-1.666-4.167-4.166-4.167H5.832c-2.5 0-4.167 1.667-4.167 4.167v5c0 2.5 1.667 4.166 4.167 4.166Z'
          />
        </svg>
      );
    case 'grid':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='26'
          height='25'
          fill='none'
        >
          <path
            stroke='#929298'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
            d='M5.708 10.417h2.083c2.084 0 3.125-1.042 3.125-3.125V5.208c0-2.083-1.041-3.125-3.125-3.125H5.708c-2.083 0-3.125 1.042-3.125 3.125v2.084c0 2.083 1.042 3.125 3.125 3.125ZM18.208 10.417h2.083c2.084 0 3.125-1.042 3.125-3.125V5.208c0-2.083-1.041-3.125-3.125-3.125h-2.083c-2.083 0-3.125 1.042-3.125 3.125v2.084c0 2.083 1.042 3.125 3.125 3.125ZM18.208 22.917h2.083c2.084 0 3.125-1.042 3.125-3.125v-2.084c0-2.083-1.041-3.125-3.125-3.125h-2.083c-2.083 0-3.125 1.042-3.125 3.125v2.084c0 2.083 1.042 3.125 3.125 3.125ZM5.708 22.917h2.083c2.084 0 3.125-1.042 3.125-3.125v-2.084c0-2.083-1.041-3.125-3.125-3.125H5.708c-2.083 0-3.125 1.042-3.125 3.125v2.084c0 2.083 1.042 3.125 3.125 3.125Z'
          />
        </svg>
      );
    case 'calls':
    case 'phone':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '26'}
          height={h || '25'}
          fill='none'
          viewBox='0 0 25 25'
        >
          <path
            stroke='#0A49A5'
            strokeWidth='1.5'
            d='M16.297 21.754a8.02 8.02 0 0 0 2.78 0c1.477-.26 2.666-1.251 3.075-2.563l.087-.278c.09-.29.136-.588.136-.889 0-1.325-1.185-2.399-2.647-2.399h-4.081c-1.462 0-2.647 1.074-2.647 2.4 0 .3.046.599.136.888l.087.278c.41 1.312 1.598 2.303 3.074 2.563Zm0 0A15.667 15.667 0 0 1 3.747 9.203m0 0a8.024 8.024 0 0 1 0-2.78c.26-1.477 1.25-2.666 2.562-3.075l.278-.087c.29-.09.588-.136.889-.136 1.325 0 2.399 1.185 2.399 2.647v4.081c0 1.462-1.074 2.647-2.4 2.647-.3 0-.599-.046-.888-.136l-.278-.087c-1.312-.41-2.303-1.598-2.563-3.074Z'
          />
        </svg>
      );
    case 'video-call':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          width='25'
          height='25'
          viewBox='0 0 25 25'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M13.052 21.27H6.47c-3.292 0-4.386-2.187-4.386-4.385v-8.77c0-3.292 1.094-4.386 4.386-4.386h6.583c3.292 0 4.386 1.094 4.386 4.386v8.77c0 3.292-1.105 4.386-4.386 4.386Z'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='m20.333 17.813-2.895-2.032V9.208l2.895-2.03c1.417-.99 2.584-.386 2.584 1.353v7.938c0 1.74-1.167 2.343-2.584 1.343ZM11.98 11.458a1.562 1.562 0 1 0 0-3.125 1.562 1.562 0 0 0 0 3.125Z'
          />
        </svg>
      );
    case 'muted':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='12'
          height='12'
          fill='none'
        >
          <path
            fill='#74747B'
            d='M9 8.375a.375.375 0 0 1-.3-.6c.63-.84.765-1.955.36-2.92a.375.375 0 0 1 .69-.29A3.728 3.728 0 0 1 9.3 8.23a.379.379 0 0 1-.3.145Z'
          />
          <path
            fill='#74747B'
            d='M9.915 9.625a.375.375 0 0 1-.3-.6 5.064 5.064 0 0 0 .615-4.98.375.375 0 0 1 .69-.29 5.809 5.809 0 0 1-.705 5.72c-.07.1-.185.15-.3.15ZM7.02 6.48a.502.502 0 0 1 .855.355V8.3c0 .86-.31 1.505-.865 1.815a1.5 1.5 0 0 1-.735.185c-.4 0-.83-.135-1.27-.41l-.32-.2a.5.5 0 0 1-.09-.775L7.02 6.48ZM10.885 1.115a.386.386 0 0 0-.545 0L7.865 3.59c-.03-.8-.33-1.4-.86-1.695-.56-.31-1.275-.23-2.005.225l-1.455.91a.648.648 0 0 1-.33.095H2.5C1.29 3.125.625 3.79.625 5v2c0 1.21.665 1.875 1.875 1.875h.08l-1.47 1.47a.386.386 0 0 0 0 .545c.08.07.175.11.275.11.1 0 .195-.04.27-.115l9.23-9.23a.372.372 0 0 0 0-.54Z'
          />
        </svg>
      );
    case 'open-in-new-tab':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          fill='none'
        >
          <g fill='#0A49A5' clipPath='url(#a)'>
            <path d='M20.313 20.313H4.688V4.688H12.5V3.125H4.687a1.564 1.564 0 0 0-1.562 1.563v15.625a1.564 1.564 0 0 0 1.563 1.562h15.625a1.564 1.564 0 0 0 1.562-1.563V12.5h-1.563v7.813Z' />
            <path d='M20.313 20.313H4.688V4.688H12.5V3.125H4.687a1.564 1.564 0 0 0-1.562 1.563v15.625a1.564 1.564 0 0 0 1.563 1.562h15.625a1.564 1.564 0 0 0 1.562-1.563V12.5h-1.563v7.813Z' />
            <path d='M20.313 4.688V1.563H18.75v3.125h-3.125V6.25h3.125v3.125h1.563V6.25h3.125V4.687h-3.125Z' />
          </g>
          <defs>
            <clipPath id='a'>
              <path fill='#fff' d='M0 0h25v25H0z' />
            </clipPath>
          </defs>
        </svg>
      );
    case 'readchats':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='26'
          height='25'
          fill='none'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
            d='M22.917 10.417v3.125c0 4.166-2.084 6.25-6.25 6.25h-.521c-.323 0-.636.156-.834.416l-1.562 2.084c-.688.916-1.813.916-2.5 0l-1.562-2.084c-.167-.229-.553-.416-.834-.416h-.52c-4.167 0-6.25-1.042-6.25-6.25V8.333c0-4.166 2.083-6.25 6.25-6.25h6.25'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M16.663 11.458h.01M12.495 11.458h.01M8.328 11.458h.009'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='m16.667 4.688 2.774 2.604L25 2.083'
          />
        </svg>
      );
    case 'unread':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          fill='none'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
            d='M22.917 10.417v3.125c0 4.166-2.084 6.25-6.25 6.25h-.521c-.323 0-.635.156-.833.416l-1.563 2.084c-.687.916-1.812.916-2.5 0l-1.562-2.084c-.167-.229-.552-.416-.834-.416h-.52c-4.167 0-6.25-1.042-6.25-6.25V8.333c0-4.166 2.083-6.25 6.25-6.25h6.25'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M20.313 7.292a2.604 2.604 0 1 0 0-5.209 2.604 2.604 0 0 0 0 5.209Z'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M16.663 11.458h.01M12.495 11.458h.01M8.328 11.458h.009'
          />
        </svg>
      );
    case 'badge-pin':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='none'
          viewBox='0 0 16 16'
        >
          <path
            stroke='#B1B1B5'
            strokeLinecap='round'
            strokeWidth='1.5'
            d='M8 14.5v-3.333'
          />
          <path
            stroke='#B1B1B5'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M4.667 11.167h6.666V9.833L10 7.167v-4H6v4L4.667 9.833v1.334Z'
          />
          <path
            stroke='#B1B1B5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M5.333 3.167h5.334'
          />
        </svg>
      );
    case 'pin':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || 25}
          height={h || 25}
          fill='none'
          viewBox='0 0 25 25'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeWidth='1.5'
            d='M12.5 21.875v-5.208'
          />
          <path
            stroke='#0A49A5'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M7.292 16.667h10.416v-2.084l-2.083-4.166v-6.25h-6.25v6.25l-2.083 4.166v2.084Z'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M8.334 4.167h8.333'
          />
        </svg>
      );
    case 'unpin':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          fill='none'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeWidth='1.5'
            d='M21.354 13.02h-5.208'
          />
          <path
            stroke='#0A49A5'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M16.146 18.23V7.811h-2.083L9.896 9.896h-6.25v6.25h6.25l4.167 2.083h2.083Z'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M3.646 17.188V8.854'
          />
        </svg>
      );
    case 'unmute':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          fill='none'
        >
          <path
            stroke='#0A49A5'
            strokeWidth='1.5'
            d='M2.083 10.417v4.166c0 2.084 1.042 3.125 3.125 3.125h1.49c.385 0 .77.115 1.104.313l3.042 1.906c2.625 1.646 4.781.448 4.781-2.646V7.72c0-3.104-2.156-4.292-4.781-2.646L7.802 6.979a2.184 2.184 0 0 1-1.104.313h-1.49c-2.083 0-3.125 1.041-3.125 3.125Z'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M18.75 8.333a6.937 6.937 0 0 1 0 8.334M20.656 5.73a11.281 11.281 0 0 1 0 13.54'
          />
        </svg>
      );
    case 'mute':
      return (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M6.01993 11.8002V8.91016C6.01993 5.60016 8.70993 2.91016 12.0199 2.91016C13.1799 2.9401 14.9998 3.5 15.9998 4.5M17.4998 7C17.8998 7.4 18.0132 10.3668 18.0199 11.8002C18.0199 12.4102 18.2799 13.3402 18.5799 13.8602L19.7299 15.7702C20.3899 16.8702 19.8599 18.3002 18.6499 18.7002C14.3399 20.1402 9.68993 20.1402 5.37993 18.7002C4.91989 18.4668 4.0998 17.8 4.4998 17'
            stroke='#0A49A5'
            strokeWidth='1.5'
            strokeMiterlimit='10'
            strokeLinecap='round'
          />
          <path
            d='M18.85 2.47998L3 18.33'
            stroke='#0A49A5'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M13.8699 3.19994C13.5599 3.10994 13.2399 3.03994 12.9099 2.99994C11.9499 2.87994 11.0299 2.94994 10.1699 3.19994C10.4599 2.45994 11.1799 1.93994 12.0199 1.93994C12.8599 1.93994 13.5799 2.45994 13.8699 3.19994Z'
            stroke='#0A49A5'
            strokeWidth='1.5'
            strokeMiterlimit='10'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601'
            stroke='#0A49A5'
            strokeWidth='1.5'
            strokeMiterlimit='10'
          />
        </svg>
      );
    case 'error':
    case 'flag':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '25'}
          height={h || '25'}
          fill='none'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M12.5 9.375v5.208M12.5 22.302H6.188c-3.615 0-5.125-2.583-3.375-5.74l3.25-5.854 3.062-5.5c1.854-3.344 4.896-3.344 6.75 0l3.063 5.51 3.25 5.855c1.75 3.156.229 5.74-3.375 5.74H12.5v-.011Z'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M12.494 17.708h.01'
          />
        </svg>
      );
    case 'delete':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '25'}
          height={h || '25'}
          fill='none'
          viewBox='0 0 25 25'
        >
          <path
            stroke='#EF4062'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M21.875 6.23a105.94 105.94 0 0 0-10.438-.522 61.53 61.53 0 0 0-6.187.313l-2.125.208M8.854 5.177l.23-1.364c.166-.99.29-1.73 2.051-1.73h2.73c1.76 0 1.895.782 2.051 1.74l.23 1.354M19.636 9.52l-.677 10.49c-.115 1.636-.209 2.907-3.115 2.907H9.156c-2.906 0-3-1.271-3.114-2.907L5.365 9.52M10.76 17.188h3.469M9.896 13.02h5.208'
          />
        </svg>
      );
    case 'archive':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || 25}
          height={h || 25}
          fill='none'
          viewBox='0 0 25 25'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M9.375 22.917h6.25c5.209 0 7.292-2.084 7.292-7.292v-6.25c0-5.208-2.084-7.292-7.292-7.292h-6.25c-5.208 0-7.292 2.084-7.292 7.292v6.25c0 5.208 2.084 7.292 7.292 7.292Z'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M2.083 13.542H6c.792 0 1.51.448 1.865 1.156l.927 1.864c.583 1.146 1.625 1.146 1.875 1.146h3.677c.792 0 1.51-.448 1.865-1.156l.927-1.864A2.083 2.083 0 0 1 19 13.53h3.896M12.5 5.73v5.728l2.083-2.083M12.5 11.458l-2.084-2.083'
          />
        </svg>
      );
    case 'unarchive':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          fill='none'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M9.375 22.917h6.25c5.209 0 7.292-2.084 7.292-7.292v-6.25c0-5.208-2.084-7.292-7.292-7.292h-6.25c-5.208 0-7.292 2.084-7.292 7.292v6.25c0 5.208 2.084 7.292 7.292 7.292Z'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M2.083 13.542H6c.792 0 1.51.448 1.865 1.156l.927 1.864c.583 1.146 1.625 1.146 1.875 1.146h3.677c.792 0 1.51-.448 1.865-1.156l.927-1.864A2.083 2.083 0 0 1 19 13.53h3.896M12.5 11.458V5.73l-2.083 2.084M12.5 5.73l2.084 2.082'
          />
        </svg>
      );
    case 'filled':
    case 'points':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '24'}
          height={h || '24'}
          fill='none'
          viewBox='0 0 24 24'
        >
          <path
            fill={fill || '#0A49A5'}
            d='M13.333 5.333a1.778 1.778 0 1 1-3.555 0 1.778 1.778 0 0 1 3.555 0ZM13.333 11.556a1.778 1.778 0 1 1-3.555 0 1.778 1.778 0 0 1 3.555 0ZM13.333 17.778a1.778 1.778 0 1 1-3.555 0 1.778 1.778 0 0 1 3.555 0Z'
          />
        </svg>
      );
    case 'keyboard':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          fill='none'
        >
          <mask
            id='a-mask'
            width='24'
            height='24'
            x='0'
            y='0'
            maskUnits='userSpaceOnUse'
          >
            <path fill='#D9D9D9' d='M0 0h24v24H0z' />
          </mask>
          <g mask='url(#a-mask)'>
            <path
              fill='#929298'
              d='M4.308 18.5c-.505 0-.933-.175-1.283-.525a1.745 1.745 0 0 1-.525-1.283V7.308c0-.505.175-.933.525-1.283.35-.35.778-.525 1.283-.525h15.384c.505 0 .933.175 1.283.525.35.35.525.778.525 1.283v9.384c0 .505-.175.933-.525 1.283-.35.35-.778.525-1.283.525H4.308Zm0-1.5h15.384a.294.294 0 0 0 .212-.096.294.294 0 0 0 .096-.212V7.308a.294.294 0 0 0-.096-.212.294.294 0 0 0-.212-.096H4.308a.294.294 0 0 0-.212.096.294.294 0 0 0-.096.212v9.384c0 .077.032.148.096.212a.294.294 0 0 0 .212.096Zm3.807-1.115h7.77v-1.77h-7.77v1.77Zm-3-3h1.77v-1.77h-1.77v1.77Zm3 0h1.77v-1.77h-1.77v1.77Zm3 0h1.77v-1.77h-1.77v1.77Zm3 0h1.77v-1.77h-1.77v1.77Zm3 0h1.77v-1.77h-1.77v1.77Zm-12-3h1.77v-1.77h-1.77v1.77Zm3 0h1.77v-1.77h-1.77v1.77Zm3 0h1.77v-1.77h-1.77v1.77Zm3 0h1.77v-1.77h-1.77v1.77Zm3 0h1.77v-1.77h-1.77v1.77Z'
            />
          </g>
        </svg>
      );
    case 'smile':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='27'
          height='28'
          fill='none'
        >
          <path
            stroke='#929298'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M13.5 23.9c5.468 0 9.9-4.432 9.9-9.9s-4.432-9.9-9.9-9.9S3.6 8.532 3.6 14s4.432 9.9 9.9 9.9Z'
          />
          <path
            stroke='#929298'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M9.9 16.475s1.35 1.8 3.6 1.8 3.6-1.8 3.6-1.8'
          />
          <path
            stroke='#929298'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M10.125 11.3h.01M16.875 11.3h.01'
          />
        </svg>
      );
    case 'paperclip':
    case 'clip':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='27'
          height='27'
          fill='none'
        >
          <path
            stroke='#929298'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='m21.6 12.938-8.085 8.026A5.3 5.3 0 0 1 9.781 22.5a5.3 5.3 0 0 1-3.734-1.536A5.224 5.224 0 0 1 4.5 17.257c0-1.39.556-2.724 1.547-3.707l8.084-8.026a3.534 3.534 0 0 1 2.49-1.024c.934 0 1.83.368 2.49 1.024a3.482 3.482 0 0 1 1.03 2.471c0 .927-.37 1.816-1.03 2.472l-8.094 8.026a1.766 1.766 0 0 1-2.49 0 1.741 1.741 0 0 1 0-2.472l7.47-7.406'
          />
        </svg>
      );
    case 'microphone':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '22'}
          height={h || '22'}
          fill='none'
          viewBox='0 0 22 22'
        >
          <path
            stroke='#929298'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M11 14.208a3.666 3.666 0 0 0 3.667-3.666V5.5A3.666 3.666 0 0 0 11 1.833 3.666 3.666 0 0 0 7.333 5.5v5.042A3.666 3.666 0 0 0 11 14.208Z'
          />
          <path
            stroke='#929298'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M3.988 8.846v1.558A7.018 7.018 0 0 0 11 17.417a7.018 7.018 0 0 0 7.012-7.013V8.846M9.726 5.894a3.692 3.692 0 0 1 2.548 0M10.267 7.837c.486-.128.99-.128 1.476 0M11 17.417v2.75'
          />
        </svg>
      );
    case 'mention':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          width={w || 22}
          height={h || 22}
          viewBox='0 0 16 17'
        >
          <path
            fill='#fff'
            fillRule='evenodd'
            d='M.667 8.333a7.167 7.167 0 0 1 14.333 0 .5.5 0 1 1-1 0 6.167 6.167 0 1 0-2.142 4.673.5.5 0 0 1 .653.757A7.167 7.167 0 0 1 .667 8.333Z'
            clipRule='evenodd'
          />
          <path
            fill='#fff'
            fillRule='evenodd'
            d='M4.667 8.333a3.167 3.167 0 1 1 6.333 0 3.167 3.167 0 0 1-6.333 0Zm3.166-2.166a2.167 2.167 0 1 0 0 4.333 2.167 2.167 0 0 0 0-4.333Z'
            clipRule='evenodd'
          />
          <path
            fill='#fff'
            fillRule='evenodd'
            d='M10.5 7.833a.5.5 0 0 1 .5.5 1.5 1.5 0 0 0 3 0 .5.5 0 0 1 1 0 2.5 2.5 0 0 1-5 0 .5.5 0 0 1 .5-.5Z'
            clipRule='evenodd'
          />
          <path
            fill='#fff'
            fillRule='evenodd'
            d='M10.5 5.167a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5Z'
            clipRule='evenodd'
          />
        </svg>
      );
    case 'mail':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          width={w || 24}
          height={h || 24}
          viewBox='0 0 24 24'
        >
          <path
            fill='#929298'
            fillRule='evenodd'
            d='M1 11.75C1 5.813 5.813 1 11.75 1S22.5 5.813 22.5 11.75a.75.75 0 0 1-1.5 0A9.25 9.25 0 1 0 11.75 21a9.211 9.211 0 0 0 6.037-2.242.75.75 0 0 1 .98 1.137A10.711 10.711 0 0 1 11.75 22.5C5.813 22.5 1 17.687 1 11.75Z'
            clipRule='evenodd'
          />
          <path
            fill='#929298'
            fillRule='evenodd'
            d='M7 11.75a4.75 4.75 0 1 1 9.5 0 4.75 4.75 0 0 1-9.5 0Zm4.75-3.25a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5Z'
            clipRule='evenodd'
          />
          <path
            fill='#929298'
            fillRule='evenodd'
            d='M15.75 11a.75.75 0 0 1 .75.75 2.25 2.25 0 0 0 4.5 0 .75.75 0 0 1 1.5 0 3.75 3.75 0 1 1-7.5 0 .75.75 0 0 1 .75-.75Z'
            clipRule='evenodd'
          />
          <path
            fill='#929298'
            fillRule='evenodd'
            d='M15.75 7a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5a.75.75 0 0 1 .75-.75Z'
            clipRule='evenodd'
          />
        </svg>
      );
    case 'heart':
    case 'heart-outline':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          width={w || 22}
          height={h || 22}
          viewBox='0 0 22 22'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M11.568 19.076c-.311.11-.825.11-1.136 0-2.659-.908-8.599-4.694-8.599-11.11 0-2.833 2.283-5.124 5.097-5.124 1.668 0 3.144.806 4.07 2.053a5.07 5.07 0 0 1 4.07-2.053c2.814 0 5.097 2.291 5.097 5.124 0 6.416-5.94 10.202-8.599 11.11Z'
          />
        </svg>
      );
    case 'heart-fly':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='19'
          height='19'
          fill='none'
          viewBox='0 0 19 19'
        >
          <path
            fill='#070708'
            fillRule='evenodd'
            d='M1.619 3.961A4.83 4.83 0 0 0 .197 7.393c0 2.843 1.312 5.087 2.877 6.7 1.557 1.603 3.4 2.62 4.576 3.025.21.074.451.1.662.1.21 0 .45-.026.662-.1.234-.081.496-.186.776-.316a.592.592 0 0 0 .343.315c.21.075.45.102.66.102.21 0 .448-.027.658-.1 1.166-.4 2.993-1.408 4.537-2.995 1.552-1.597 2.854-3.82 2.854-6.635 0-1.24-.327-2.662-1.325-3.67-.999-1.009-2.554-1.488-4.755-1.125a4.73 4.73 0 0 0-4.41 1.26 4.736 4.736 0 0 0-6.693.007Zm0 0 3.493 3.412L1.619 3.96Zm3.493 3.412c-.17.333-.22.735-.096 1.145l.001.004 1.138 3.66c.438 1.414 2.441 1.451 2.911.03l.339-1.008a.333.333 0 0 1 .214-.214l1.009-.338c1.417-.47 1.387-2.469-.026-2.914H10.6L6.927 6.6a1.52 1.52 0 0 0-1.815.772Zm0 0 1.137 1.11 1.04 3.347v.001c.1.322.547.32.65.007l.001-.003.338-1.008c.03-.088.067-.173.111-.253m0 0a1.52 1.52 0 0 1 .854-.71l1.01-.338.002-.001a.343.343 0 0 0-.009-.654l-3.67-1.136a.343.343 0 0 0-.424.436l.097.312 2.14 2.09Zm6.708 2.722c-1.212 1.246-2.613 2.092-3.615 2.522a13.182 13.182 0 0 0 2.067-1.725c1.566-1.613 2.877-3.857 2.877-6.7 0-1.42-.609-2.7-1.579-3.582.82.12 1.39.444 1.787.844.694.701.98 1.764.98 2.834 0 2.422-1.114 4.363-2.517 5.807Z'
            clipRule='evenodd'
          />
        </svg>
      );
    case 'reply':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          fill='none'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
            d='M7.292 18.75h8.333a5.21 5.21 0 0 0 5.208-5.208 5.21 5.21 0 0 0-5.208-5.209H4.167'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M7.292 11.458 4.167 8.333l3.125-3.125'
          />
        </svg>
      );
    case 'view-reply':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='18'
          height='19'
          fill='none'
        >
          <path
            stroke='#0A49A5'
            d='M14.04 7.908c.374.344.632.582.816.782.18.196.254.321.29.428.084.247.084.517 0 .764-.036.107-.11.232-.29.428-.184.2-.442.437-.817.782l-3.944 3.627-.215.196a18.358 18.358 0 0 1-.002-.318v-3.441h-.5c-1.692 0-2.774.34-3.635.86a8.204 8.204 0 0 0-1.11.83l-.242.21c-.248.216-.487.425-.757.63-.36.276-.624.478-.819.616.025-.197.069-.46.127-.813l-.493-.082.493.082c.42-2.545 1.465-4.105 2.66-5.034 1.202-.935 2.6-1.265 3.776-1.265h.5V4.403c0-.131 0-.235.002-.318l.215.196 3.944 3.627ZM2.792 14.612l-.001-.007v.007Zm-.257-.136.01-.004a.038.038 0 0 1-.01.004Z'
          />
        </svg>
      );
    case 'forward':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '25'}
          height={h || '25'}
          fill='none'
          viewBox='0 0 25 25'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
            d='M20.698 8.656H9.24a5.21 5.21 0 0 0-5.209 5.209v5.406'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='m15.625 13.542 5.208-4.688-5.208-5.208'
          />
        </svg>
      );
    case 'copy-media':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '25'}
          height={h || '25'}
          fill='none'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M12.448 22.917h5.312c4.427 0 6.198-1.771 6.198-6.198v-5.313c0-4.427-1.77-6.198-6.198-6.198h-5.312c-4.427 0-6.198 1.771-6.198 6.198v5.313c0 4.427 1.77 6.198 6.198 6.198Z'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M18.75 3.11c-.931-1.441-2.615-2.068-5.24-2.068H8.236c-4.395 0-6.153 1.758-6.153 6.153v5.274c0 2.624.627 4.308 2.068 5.24'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M12.5 12.5a2.083 2.083 0 1 0 0-4.167 2.083 2.083 0 0 0 0 4.167ZM7.292 19.792l4.25-2.976c.681-.476 1.664-.422 2.277.126l.284.26c.673.603 1.76.603 2.432 0l3.586-3.209c.673-.602 1.76-.602 2.432 0l1.405 1.259'
          />
        </svg>
      );
    case 'media':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '25'}
          height={h || '25'}
          fill='none'
          viewBox='0 0 25 25'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M9.375 22.917h6.25c5.208 0 7.292-2.084 7.292-7.292v-6.25c0-5.208-2.084-7.292-7.292-7.292h-6.25c-5.208 0-7.292 2.084-7.292 7.292v6.25c0 5.208 2.084 7.292 7.292 7.292Z'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M9.375 10.417a2.083 2.083 0 1 0 0-4.167 2.083 2.083 0 0 0 0 4.167ZM2.781 19.74l5.136-3.448c.823-.552 2.01-.49 2.75.145l.343.303c.813.698 2.125.698 2.938 0l4.333-3.72c.813-.697 2.125-.697 2.938 0l1.698 1.46'
          />
        </svg>
      );
    case 'wallet':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '25'}
          height={h || '25'}
          fill='none'
          viewBox='0 0 25 25'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M22.917 12.5v5.208c0 3.125-2.084 5.209-5.209 5.209H7.292c-3.125 0-5.209-2.084-5.209-5.209V12.5c0-2.833 1.709-4.812 4.365-5.146.27-.041.552-.062.844-.062h10.416c.271 0 .532.01.782.052 2.687.312 4.427 2.302 4.427 5.156Z'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M18.491 7.344a4.763 4.763 0 0 0-.781-.052H7.293c-.292 0-.573.02-.844.062a3.17 3.17 0 0 1 .605-.812l3.385-3.396a3.672 3.672 0 0 1 5.167 0l1.822 1.844a3.515 3.515 0 0 1 1.063 2.354ZM22.917 13.02h-3.125a2.09 2.09 0 0 0-2.084 2.084 2.09 2.09 0 0 0 2.084 2.084h3.125'
          />
        </svg>
      );
    case 'link':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          fill='none'
          viewBox='0 0 25 25'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M15.615 18.23h1.572c3.146 0 5.73-2.574 5.73-5.73 0-3.146-2.573-5.73-5.73-5.73h-1.572M9.375 6.77H7.813a5.74 5.74 0 0 0-5.73 5.73c0 3.146 2.573 5.73 5.73 5.73h1.562M8.333 12.5h8.334'
          />
        </svg>
      );
    case 'edit':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          fill='none'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
            d='m13.816 5.666-8.552 9.052c-.323.344-.636 1.02-.698 1.49l-.385 3.374c-.136 1.22.74 2.052 1.947 1.844l3.355-.573c.468-.083 1.125-.427 1.447-.781l8.553-9.052c1.479-1.563 2.145-3.344-.157-5.521-2.291-2.156-4.03-1.396-5.51.167Z'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
            d='M12.39 7.176a6.381 6.381 0 0 0 5.677 5.364'
          />
        </svg>
      );
    case 'share':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          fill='none'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M18.75 8.334a3.125 3.125 0 1 0 0-6.25 3.125 3.125 0 0 0 0 6.25ZM6.25 15.625a3.125 3.125 0 1 0 0-6.25 3.125 3.125 0 0 0 0 6.25ZM18.75 22.916a3.125 3.125 0 1 0 0-6.25 3.125 3.125 0 0 0 0 6.25ZM8.948 14.073l7.115 4.146M16.052 6.781l-7.104 4.146'
          />
        </svg>
      );
    case 'share-2':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          fill='none'
          viewBox='0 0 20 20'
        >
          <path
            stroke='#4D4D50'
            strokeLinecap='round'
            strokeWidth='1.5'
            d='M13.334 5.833h1.333a2 2 0 0 1 2 2v9.334a2 2 0 0 1-2 2H5.333a2 2 0 0 1-2-2V7.833a2 2 0 0 1 2-2h1.334'
          />
          <path
            stroke='#4D4D50'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M10 12.5V1.667M12.5 3.333 10 .833l-2.5 2.5'
          />
        </svg>
      );
    case 'document':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '25'}
          height={h || '25'}
          fill='none'
          viewBox='0 0 25 25'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M22.917 10.417v5.208c0 5.208-2.084 7.292-7.292 7.292h-6.25c-5.208 0-7.292-2.084-7.292-7.292v-6.25c0-5.208 2.084-7.292 7.292-7.292h5.208'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M22.917 10.417H18.75c-3.125 0-4.167-1.042-4.167-4.167V2.083l8.334 8.334Z'
          />
        </svg>
      );
    case 'send':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='25'
          fill='none'
        >
          <g clipPath='url(#a)'>
            <path
              fill='#0A49A5'
              d='m2.716 19.99 2.383-7.421C4.6 11.389 3.423 8.4 2.71 5.89c-.713-2.51.426-3.045 2.955-1.947 4.044 1.934 12.658 6.04 14.761 7 2.104.96 1.302 2.527.183 3.042-3.698 1.817-11.887 5.65-14.756 7.099-3.257 1.645-3.312-.18-3.137-1.095Z'
            />
          </g>
          <defs>
            <clipPath id='a'>
              <path fill='#fff' d='M0 .5h24v24H0z' />
            </clipPath>
          </defs>
        </svg>
      );
    case 'pin-list':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          fill='none'
          viewBox='0 0 24 24'
        >
          <path
            stroke='#B1B1B5'
            strokeLinecap='round'
            strokeWidth='1.5'
            d='M3 10h10M3 14h8M3 18h10M18 19v-4'
          />
          <path
            stroke='#B1B1B5'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M14 15h8v-1.667L20.4 10V5h-4.8v5L14 13.333V15Z'
          />
          <path
            stroke='#B1B1B5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M14 5h8'
          />
        </svg>
      );
    case 'arrow-back':
      return (
        <svg
          className={className}
          width='20'
          height='16'
          viewBox='0 0 20 16'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M19 8L1 8M1 8L8.50802 15M1 8L8.50802 0.999999'
            stroke={stroke || '#929298'}
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      );
    case 'qr':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          fill='none'
          viewBox='0 0 24 24'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M2 3.364C2 2.61 2.61 2 3.364 2h5.454c.753 0 1.364.61 1.364 1.364v5.454c0 .753-.611 1.364-1.364 1.364H3.364A1.364 1.364 0 0 1 2 8.818V3.364Zm0 11.818c0-.753.61-1.364 1.364-1.364h5.454c.753 0 1.364.611 1.364 1.364v5.454c0 .753-.611 1.364-1.364 1.364H3.364A1.364 1.364 0 0 1 2 20.636v-5.454ZM13.818 3.364c0-.753.611-1.364 1.364-1.364h5.454C21.39 2 22 2.61 22 3.364v5.454c0 .753-.61 1.364-1.364 1.364h-5.454a1.364 1.364 0 0 1-1.364-1.364V3.364Z'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M5.637 5.636h.909v.91h-.91v-.91Zm0 11.818h.909v.91h-.91v-.91ZM17.455 5.636h.909v.91h-.91v-.91Zm-3.636 8.182h.909v.91h-.91v-.91Zm0 7.273h.909V22h-.91v-.91Zm7.272-7.273h.91v.91h-.91v-.91Zm0 7.273h.91V22h-.91v-.91Zm-3.636-3.637h.909v.91h-.91v-.91Z'
          />
        </svg>
      );
    case 'filter':
      return (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M3 7H21'
            stroke='#929298'
            strokeWidth='1.5'
            strokeLinecap='round'
          />
          <path
            d='M6 12H18'
            stroke='#929298'
            strokeWidth='1.5'
            strokeLinecap='round'
          />
          <path
            d='M10 17H14'
            stroke='#929298'
            strokeWidth='1.5'
            strokeLinecap='round'
          />
        </svg>
      );
    case 'calendar-gray':
      return (
        <svg
          width='22'
          height='22'
          viewBox='0 0 22 22'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M7.33398 1.83295V4.58304'
            stroke='#929298'
            strokeWidth='1.5'
            strokeMiterlimit='10'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M14.666 1.83295V4.58304'
            stroke='#929298'
            strokeWidth='1.5'
            strokeMiterlimit='10'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M3.20898 8.33221H18.7929'
            stroke='#929298'
            strokeWidth='1.5'
            strokeMiterlimit='10'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M19.2506 7.79285V15.5848C19.2506 18.3349 17.8755 20.1683 14.6671 20.1683H7.3335C4.12505 20.1683 2.75 18.3349 2.75 15.5848V7.79285C2.75 5.04275 4.12505 3.20935 7.3335 3.20935H14.6671C17.8755 3.20935 19.2506 5.04275 19.2506 7.79285Z'
            stroke='#929298'
            strokeWidth='1.5'
            strokeMiterlimit='10'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M14.3869 12.5594H14.3951'
            stroke='#929298'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M14.3869 15.31H14.3951'
            stroke='#929298'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M10.9963 12.5594H11.0045'
            stroke='#929298'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M10.9963 15.31H11.0045'
            stroke='#929298'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M7.60371 12.5594H7.61194'
            stroke='#929298'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M7.60371 15.31H7.61194'
            stroke='#929298'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      );
    case 'coin':
      return (
        <svg
          width='32'
          height='32'
          viewBox='0 0 32 32'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M29.2271 22.3333C28.7871 25.88 25.8805 28.7867 22.3338 29.2267C20.1871 29.4933 18.1871 28.9067 16.6271 27.76C15.7338 27.1067 15.9471 25.72 17.0138 25.4C21.0271 24.1867 24.1871 21.0133 25.4138 17C25.7338 15.9467 27.1205 15.7333 27.7738 16.6133C28.9071 18.1867 29.4938 20.1867 29.2271 22.3333Z'
            fill='#070708'
          />
          <path
            d='M13.3193 2.66669C7.43935 2.66669 2.66602 7.44002 2.66602 13.32C2.66602 19.2 7.43935 23.9734 13.3193 23.9734C19.1993 23.9734 23.9727 19.2 23.9727 13.32C23.9593 7.44002 19.1993 2.66669 13.3193 2.66669ZM12.066 11.8267L15.2793 12.9467C16.4393 13.36 16.9993 14.1734 16.9993 15.4267C16.9993 16.8667 15.8527 18.0534 14.4527 18.0534H14.3327V18.12C14.3327 18.6667 13.8793 19.12 13.3327 19.12C12.786 19.12 12.3327 18.6667 12.3327 18.12V18.04C10.8527 17.9734 9.66602 16.7334 9.66602 15.1867C9.66602 14.64 10.1193 14.1867 10.666 14.1867C11.2127 14.1867 11.666 14.64 11.666 15.1867C11.666 15.6667 12.0127 16.0534 12.4393 16.0534H14.4393C14.746 16.0534 14.986 15.7734 14.986 15.4267C14.986 14.96 14.906 14.9334 14.5993 14.8267L11.386 13.7067C10.2393 13.3067 9.66602 12.4934 9.66602 11.2267C9.66602 9.78669 10.8127 8.60002 12.2127 8.60002H12.3327V8.54669C12.3327 8.00002 12.786 7.54669 13.3327 7.54669C13.8793 7.54669 14.3327 8.00002 14.3327 8.54669V8.62669C15.8127 8.69335 16.9993 9.93335 16.9993 11.48C16.9993 12.0267 16.546 12.48 15.9993 12.48C15.4527 12.48 14.9993 12.0267 14.9993 11.48C14.9993 11 14.6527 10.6134 14.226 10.6134H12.226C11.9193 10.6134 11.6793 10.8934 11.6793 11.24C11.666 11.6934 11.746 11.72 12.066 11.8267Z'
            fill='#070708'
          />
        </svg>
      );

    case 'course':
      return (
        <svg
          width='33'
          height='32'
          viewBox='0 0 33 32'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M10.668 2.66669V6.66669H9.66797C9.3213 6.66669 8.98797 6.68002 8.66797 6.73335V2.66669C8.66797 2.12002 9.1213 1.66669 9.66797 1.66669C10.2146 1.66669 10.668 2.12002 10.668 2.66669Z'
            fill='#070708'
          />
          <path
            d='M23 6.66669H9.66667C9.32 6.66669 8.98667 6.68002 8.66667 6.73335C5.22667 7.13335 3 9.68002 3 13.3334V22.6667C3 26.6667 5.66667 29.3334 9.66667 29.3334H23C27 29.3334 29.6667 26.6667 29.6667 22.6667V13.3334C29.6667 9.33335 27 6.66669 23 6.66669ZM10.84 21.3334C9 21.3334 7.50667 19.84 7.50667 18C7.50667 16.16 9 14.6667 10.84 14.6667C12.68 14.6667 14.1733 16.16 14.1733 18C14.1733 19.84 12.68 21.3334 10.84 21.3334ZM19.5067 21.6667H18.84C18.2933 21.6667 17.84 21.2134 17.84 20.6667C17.84 20.12 18.2933 19.6667 18.84 19.6667H19.5067C20.0533 19.6667 20.5067 20.12 20.5067 20.6667C20.5067 21.2134 20.0533 21.6667 19.5067 21.6667ZM24.1733 21.6667H23.5067C22.96 21.6667 22.5067 21.2134 22.5067 20.6667C22.5067 20.12 22.96 19.6667 23.5067 19.6667H24.1733C24.72 19.6667 25.1733 20.12 25.1733 20.6667C25.1733 21.2134 24.72 21.6667 24.1733 21.6667ZM24.1733 16.3334H18.84C18.2933 16.3334 17.84 15.88 17.84 15.3334C17.84 14.7867 18.2933 14.3334 18.84 14.3334H24.1733C24.72 14.3334 25.1733 14.7867 25.1733 15.3334C25.1733 15.88 24.72 16.3334 24.1733 16.3334Z'
            fill='#070708'
          />
        </svg>
      );

    case 'sale':
      return (
        <svg
          width='33'
          height='32'
          viewBox='0 0 33 32'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M20.666 4H12.666V10H20.666V4Z' fill='#070708' />
          <path
            d='M22.666 4V10H28.666C28.1235 6.2156 25.9639 4.01376 22.666 4Z'
            fill='#070708'
          />
          <path
            d='M4.66602 11V21.0149C4.66602 25.3911 7.27002 28 11.638 28H21.694C26.062 28 28.666 25.3911 28.666 21.0149V11H4.66602ZM19.594 21.0028L17.098 22.4455C16.57 22.7461 16.054 22.9024 15.574 22.9024C15.214 22.9024 14.89 22.8182 14.59 22.6499C13.894 22.2532 13.51 21.4356 13.51 20.3777V17.4922C13.51 16.4342 13.894 15.6167 14.59 15.2199C15.286 14.8112 16.174 14.8833 17.098 15.4243L19.594 16.867C20.518 17.396 21.022 18.1414 21.022 18.947C21.022 19.7525 20.506 20.4618 19.594 21.0028Z'
            fill='#070708'
          />
          <path
            d='M11.666 4C7.8185 4.01376 5.29899 6.2156 4.66602 10H11.666V4Z'
            fill='#070708'
          />
        </svg>
      );
    case 'play':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          width={w || '6'}
          height={h || '7'}
          viewBox='0 0 6 7'
        >
          <path
            fill='#fff'
            d='M.666 1.762v3.477c0 .712.742 1.159 1.333.803l1.445-.869 1.445-.872c.592-.356.592-1.246 0-1.602l-1.445-.872L2 .96C1.408.603.666 1.046.666 1.762Z'
          />
        </svg>
      );
    case 'pause':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '24'}
          height={h || '24'}
          fill='none'
          viewBox='0 0 24 24'
        >
          <path
            fill='#0A49A5'
            fillRule='evenodd'
            d='M10.95 6.47v11.06c0 1.05-.444 1.47-1.564 1.47H6.563C5.443 19 5 18.58 5 17.53V6.47C5 5.42 5.443 5 6.563 5h2.823c1.12 0 1.564.42 1.564 1.47Zm8.05 0v11.06c0 1.05-.443 1.47-1.563 1.47h-2.823c-1.12 0-1.564-.42-1.564-1.47V6.47c0-1.05.452-1.47 1.564-1.47h2.823C18.557 5 19 5.42 19 6.47Z'
            clipRule='evenodd'
          />
        </svg>
      );
    case 'play-music':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          width={w || '16'}
          height={h || '20'}
          viewBox='0 0 16 20'
        >
          <path
            stroke='#fff'
            strokeWidth='2'
            d='M13.158 6.606c2.456 1.509 2.456 5.28 0 6.79L6.526 17.47C4.07 18.979 1 17.093 1 14.075V5.927c0-3.018 3.07-4.904 5.526-3.395l6.632 4.074Z'
          />
        </svg>
      );
    case 'audio':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='14'
          height='14'
          fill='none'
          viewBox='0 0 14 14'
        >
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M7.36 10.722c0 1.38-1.126 2.5-2.514 2.5a2.506 2.506 0 0 1-2.513-2.5c0-1.38 1.126-2.5 2.513-2.5a2.506 2.506 0 0 1 2.513 2.5Zm0 0V4.89m0 .833V1.556l.502.666a6.712 6.712 0 0 0 5.36 2.667'
          />
        </svg>
      );
    case 'master-card':
      return (
        <svg
          width='50'
          height='34'
          viewBox='0 0 50 34'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <rect
            x='0.5'
            y='0.5'
            width='49'
            height='33'
            rx='5.5'
            fill='white'
            stroke='#CFCFD2'
          />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M24.6437 24.3057C22.9415 25.7624 20.7334 26.6418 18.3205 26.6418C12.9367 26.6418 8.57227 22.2635 8.57227 16.8626C8.57227 11.4617 12.9367 7.08337 18.3205 7.08337C20.7334 7.08337 22.9415 7.96277 24.6437 9.4195C26.3459 7.96277 28.554 7.08337 30.9669 7.08337C36.3507 7.08337 40.7151 11.4617 40.7151 16.8626C40.7151 22.2635 36.3507 26.6418 30.9669 26.6418C28.554 26.6418 26.3459 25.7624 24.6437 24.3057Z'
            fill='#ED0006'
          />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M24.6445 24.3057C26.7405 22.512 28.0696 19.843 28.0696 16.8626C28.0696 13.8822 26.7405 11.2132 24.6445 9.4195C26.3468 7.96277 28.5549 7.08337 30.9677 7.08337C36.3515 7.08337 40.716 11.4617 40.716 16.8626C40.716 22.2635 36.3515 26.6418 30.9677 26.6418C28.5549 26.6418 26.3468 25.7624 24.6445 24.3057Z'
            fill='#F9A000'
          />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M24.6438 9.41956C26.7397 11.2132 28.0688 13.8822 28.0688 16.8626C28.0688 19.843 26.7397 22.512 24.6438 24.3057C22.5478 22.512 21.2188 19.843 21.2188 16.8626C21.2188 13.8822 22.5478 11.2132 24.6438 9.41956Z'
            fill='#FF5E00'
          />
        </svg>
      );

    case 'pay-pal':
      return (
        <svg
          width='50'
          height='34'
          viewBox='0 0 50 34'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <rect
            x='0.5'
            y='0.5'
            width='49'
            height='33'
            rx='5.5'
            fill='white'
            stroke='#CFCFD2'
          />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M21.492 26.135L21.8166 24.0821L21.0935 24.0653H17.6406L20.0402 8.91603C20.0477 8.87016 20.0719 8.82757 20.1072 8.79728C20.1426 8.76698 20.1878 8.75037 20.2351 8.75037H26.0572C27.9901 8.75037 29.324 9.15077 30.0203 9.94118C30.3468 10.312 30.5547 10.6996 30.6554 11.1259C30.7609 11.5734 30.7627 12.108 30.6597 12.7601L30.6523 12.8075V13.2254L30.9788 13.4096C31.2536 13.5548 31.4722 13.721 31.6398 13.9113C31.919 14.2284 32.0996 14.6314 32.176 15.109C32.2549 15.6003 32.2288 16.1851 32.0996 16.847C31.9506 17.6084 31.7098 18.2715 31.3846 18.8141C31.0855 19.314 30.7044 19.7288 30.2519 20.0501C29.8198 20.3554 29.3066 20.5872 28.7262 20.7356C28.1638 20.8813 27.5226 20.9549 26.8194 20.9549H26.3663C26.0424 20.9549 25.7277 21.0711 25.4806 21.2793C25.2329 21.4919 25.0691 21.7824 25.0189 22.1L24.9846 22.2849L24.4111 25.9034L24.3852 26.0362C24.3782 26.0782 24.3664 26.0992 24.349 26.1134C24.3335 26.1264 24.3113 26.135 24.2895 26.135H21.492Z'
            fill='#28356A'
          />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M31.2888 12.8558C31.2716 12.9665 31.2516 13.0795 31.2293 13.1956C30.4616 17.1207 27.8347 18.4767 24.4799 18.4767H22.7718C22.3615 18.4767 22.0157 18.7732 21.9519 19.1762L20.8296 26.2642C20.788 26.5289 20.9928 26.7672 21.2609 26.7672H24.2906C24.6493 26.7672 24.9541 26.5077 25.0106 26.1555L25.0403 26.0023L25.6107 22.398L25.6474 22.2003C25.7032 21.8468 26.0087 21.5871 26.3674 21.5871H26.8204C29.7557 21.5871 32.0536 20.4006 32.7252 16.9668C33.0057 15.5324 32.8605 14.3347 32.1181 13.4924C31.8935 13.2384 31.6148 13.0276 31.2888 12.8558Z'
            fill='#298FC2'
          />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M30.4851 12.537C30.3677 12.5028 30.2467 12.472 30.1226 12.4442C29.9977 12.417 29.8699 12.3929 29.7383 12.3718C29.2778 12.2977 28.7731 12.2626 28.2325 12.2626H23.6693C23.5568 12.2626 23.45 12.2878 23.3546 12.3335C23.144 12.4343 22.9877 12.6327 22.9498 12.8756L21.979 18.9977L21.9512 19.1762C22.015 18.7732 22.3608 18.4767 22.7711 18.4767H24.4793C27.8341 18.4767 30.4609 17.12 31.2287 13.1956C31.2516 13.0795 31.2709 12.9664 31.2881 12.8558C31.0939 12.7532 30.8835 12.6654 30.657 12.5906C30.601 12.5721 30.5433 12.5543 30.4851 12.537Z'
            fill='#22284F'
          />
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M22.9497 12.8756C22.9876 12.6328 23.1439 12.4344 23.3545 12.3343C23.4506 12.2884 23.5567 12.2632 23.6692 12.2632H28.2325C28.773 12.2632 29.2777 12.2985 29.7383 12.3726C29.8699 12.3935 29.9977 12.4178 30.1225 12.4449C30.2466 12.4726 30.3676 12.5036 30.485 12.5375C30.5432 12.5549 30.6009 12.5729 30.6575 12.5907C30.884 12.6655 31.0945 12.7539 31.2887 12.8559C31.5172 11.4054 31.2868 10.4178 30.4992 9.52355C29.6308 8.5389 28.0636 8.11755 26.0582 8.11755H20.236C19.8264 8.11755 19.4769 8.41409 19.4136 8.81778L16.9886 24.1229C16.9408 24.4256 17.1754 24.6988 17.482 24.6988H21.0764L22.9497 12.8756Z'
            fill='#28356A'
          />
        </svg>
      );
    case 'bank-transfer':
      return (
        <svg
          width='50'
          height='34'
          viewBox='0 0 50 34'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <rect
            x='0.5'
            y='0.5'
            width='49'
            height='33'
            rx='5.5'
            fill='white'
            stroke='#CFCFD2'
          />
          <path
            d='M19.6631 23.7499H22.2476L22.6969 25.1368H24.2859L21.8176 18.3984H20.1307L17.6361 25.1376H19.1762L19.6631 23.7499ZM20.9505 19.9198H20.9707L21.8377 22.5842H20.0529L20.9505 19.9198ZM17.2113 23.141C17.2113 22.4741 16.9876 21.8172 16.1293 21.5086C16.4212 21.3681 16.9876 21.0964 16.9876 20.1284C16.9876 19.4337 16.5488 18.4001 14.8313 18.4001H11.4277V25.1402H14.3934C15.8277 25.1402 16.2079 24.9055 16.6074 24.5279C16.9771 24.1822 17.2113 23.6734 17.2113 23.141ZM12.8332 19.5658H14.5114C15.1739 19.5658 15.5839 19.734 15.5839 20.2874C15.5839 20.824 15.1267 21.0393 14.549 21.0393H12.8332V19.5658ZM14.6268 23.9753H12.8332V22.173H14.6958C15.2237 22.173 15.7491 22.4009 15.7491 22.9896C15.7482 23.6734 15.3383 23.9753 14.6268 23.9753ZM35.5472 21.1595L38.5706 25.1368H36.6879L34.5229 22.1805L33.8402 22.8567V25.1368H32.3771V18.3984H33.8402V21.1385L36.5139 18.3984H38.4054L35.5472 21.1595ZM17.637 28.8794C17.637 28.2352 17.4762 28.1292 17.1816 28.0048C17.5365 27.8895 17.7367 27.5641 17.7367 27.1814C17.7367 26.8836 17.5627 26.2066 16.6082 26.2066H14.7937V29.6582H15.5297V28.3084H16.3032C16.8582 28.3084 16.8888 28.4917 16.8888 28.961C16.8888 29.3159 16.9177 29.4959 16.9675 29.6574H17.797V29.5674C17.637 29.5094 17.637 29.3832 17.637 28.8794ZM16.4055 27.7281H15.5288V26.8029H16.4623C16.9011 26.8029 16.9867 27.0704 16.9867 27.2545C16.9858 27.5943 16.797 27.7281 16.4055 27.7281ZM18.8371 12.5002C18.8318 12.3454 18.8266 12.1587 18.8196 11.9434C18.8056 11.7247 18.8642 11.4876 18.8878 11.2193C18.9166 10.9501 18.9542 10.6583 19.06 10.3606C19.1491 10.0603 19.2269 9.73063 19.3982 9.42365C19.4734 9.26553 19.5503 9.10321 19.6307 8.94005C19.7146 8.77941 19.8309 8.63391 19.9314 8.47663C20.1298 8.15368 20.3868 7.8694 20.6499 7.58513C20.9042 7.28824 21.218 7.062 21.5038 6.80044C21.8176 6.58682 22.1165 6.33955 22.4373 6.16545C22.7528 5.9737 23.064 5.80213 23.3708 5.66083C23.6732 5.50356 23.973 5.39758 24.2466 5.27984C24.6696 5.12172 25.0455 4.99893 25.3549 4.91146C25.2255 4.60532 25.1145 4.28657 25.0324 3.94679C24.9458 3.59692 24.8724 3.23947 24.8654 2.83325C25.2719 2.94259 25.6119 3.10154 25.9431 3.26807C26.2727 3.43628 26.5733 3.62383 26.8548 3.82736C27.4229 4.23022 27.9063 4.69532 28.345 5.19405C28.6781 5.57168 28.7069 6.09901 28.4595 6.50187L28.408 6.58429C28.005 7.23274 27.5252 7.83576 26.9448 8.37571C26.6581 8.64652 26.3408 8.89968 25.9886 9.13265C25.8112 9.24703 25.625 9.35805 25.4353 9.46486C25.2387 9.56831 25.0315 9.66334 24.8034 9.74745C24.7876 9.51364 24.7911 9.2916 24.8086 9.07714C24.8305 8.86604 24.8584 8.65914 24.8925 8.45477C24.9677 8.05191 25.0752 7.66924 25.2133 7.30506C25.2273 7.26554 25.2439 7.22853 25.2596 7.18984C25.125 7.20582 24.9852 7.22348 24.8331 7.24451C24.5962 7.29329 24.3244 7.32693 24.0543 7.40263C23.7764 7.46318 23.4923 7.54813 23.2039 7.64905C22.9014 7.73484 22.6305 7.88286 22.3228 8.00145C22.0527 8.16209 21.7407 8.29413 21.4846 8.49009C21.2163 8.6768 20.9453 8.8652 20.7233 9.09816C20.6105 9.21086 20.4794 9.31431 20.3772 9.43458C20.2801 9.55821 20.1823 9.68269 20.087 9.80296C19.8755 10.0376 19.7452 10.3093 19.6019 10.5607C19.4446 10.808 19.3493 11.0654 19.2671 11.3067C19.1902 11.5481 19.0792 11.7668 19.0469 11.9728C19.0058 12.1797 18.9699 12.3589 18.9411 12.5077C18.8834 12.808 18.8493 12.9804 18.8493 12.9804C18.8493 12.9804 18.8467 12.8055 18.8371 12.5002ZM11.4286 26.2066H14.3462V26.8197H13.2598V29.6599H12.5124V26.8197H11.4286V26.2066ZM19.3021 26.2066L18.0233 29.6582H18.8135L19.0626 28.9459H20.3859L20.6167 29.6582H21.4313L20.1683 26.2066H19.3021ZM19.2636 28.3504L19.7242 26.9863H19.7312L20.1788 28.3504H19.2636ZM25.8881 14.5599C25.59 14.7256 25.2937 14.8416 25.0245 14.9661C24.6058 15.136 24.2361 15.2689 23.9284 15.3656C24.0683 15.6675 24.188 15.9838 24.2816 16.321C24.3751 16.6684 24.4607 17.0233 24.4826 17.4278C24.0709 17.3311 23.7265 17.1814 23.3918 17.025C23.0553 16.8669 22.7485 16.6886 22.4618 16.4926C21.8832 16.1066 21.385 15.6549 20.9304 15.1696C20.5852 14.8013 20.5397 14.2756 20.7749 13.8652L20.8247 13.7828C21.2075 13.1225 21.6681 12.5061 22.231 11.9501C22.509 11.6701 22.8184 11.4085 23.161 11.1654C23.3367 11.046 23.5159 10.93 23.7038 10.8181C23.897 10.7088 24.1015 10.607 24.327 10.5178C24.3489 10.75 24.3524 10.9728 24.341 11.1873C24.3253 11.3993 24.3052 11.607 24.2781 11.8122C24.2151 12.2167 24.119 12.6019 23.9931 12.9712C23.9791 13.0107 23.9625 13.0477 23.9503 13.0872C24.0832 13.0679 24.2239 13.046 24.3751 13.0199C24.6111 12.9653 24.8803 12.9241 25.1469 12.84C25.4231 12.7718 25.7054 12.6793 25.9895 12.5691C26.2893 12.4758 26.5559 12.3193 26.8583 12.1924C27.124 12.0233 27.4334 11.8837 27.6808 11.6802C27.9438 11.4867 28.2087 11.2891 28.422 11.0511C28.5347 10.935 28.6606 10.8273 28.7611 10.7054C28.8537 10.5776 28.9473 10.4514 29.0382 10.3278C29.2427 10.0864 29.3642 9.81221 29.4988 9.55653C29.6491 9.30422 29.7357 9.04518 29.8082 8.80128C29.8781 8.55737 29.9821 8.33618 30.0084 8.12928C30.0425 7.92155 30.0713 7.74072 30.0966 7.59186C30.15 7.28993 30.1753 7.11751 30.1753 7.11751C30.1753 7.11751 30.1893 7.29077 30.2059 7.59522C30.2146 7.74998 30.2251 7.93753 30.24 8.15199C30.2592 8.36982 30.2111 8.60952 30.1928 8.87781C30.1736 9.14694 30.1421 9.44047 30.0477 9.73988C29.9673 10.0418 29.8991 10.374 29.7383 10.6852C29.6684 10.8458 29.5949 11.0098 29.5215 11.1755C29.4411 11.3387 29.3318 11.4876 29.2357 11.6482C29.0469 11.977 28.8004 12.2672 28.5461 12.559C28.3005 12.8618 27.9937 13.099 27.7166 13.3673C27.4081 13.5902 27.1161 13.8458 26.8015 14.0292C26.4964 14.2302 26.1887 14.411 25.8881 14.5599ZM28.8625 26.2066H31.4147V26.8197H29.6124V27.5985H31.191V28.2091H29.6124V29.6608H28.8625V26.2066ZM24.1041 26.2066H24.8042V29.6582H24.0534L22.5903 27.1965H22.5789V29.6582H21.8805V26.2066H22.6689L24.0945 28.6095H24.1033L24.1041 26.2066ZM38.096 28.8794C38.096 28.2352 37.9334 28.1292 37.6406 28.0048C37.9937 27.8895 38.1974 27.5641 38.1974 27.1814C38.1974 26.8836 38.0217 26.2066 37.0672 26.2066H35.2544V29.6582H35.9904V28.3084H36.7639C37.3172 28.3084 37.3495 28.4917 37.3495 28.961C37.3495 29.3159 37.3784 29.4959 37.4291 29.6574H38.2559V29.5674C38.096 29.5094 38.096 29.3832 38.096 28.8794ZM36.8671 27.7281H35.9895V26.8029H36.9213C37.3618 26.8029 37.4474 27.0704 37.4474 27.2545C37.4474 27.5943 37.2578 27.7281 36.8671 27.7281ZM28.29 28.6204C28.29 29.6557 27.1895 29.7499 26.8766 29.7499C25.5673 29.7499 25.3444 29.0258 25.3444 28.596H26.0611C26.0664 28.7886 26.1669 29.1536 26.8224 29.1536C27.1747 29.1536 27.5706 29.0695 27.5706 28.7087C27.5706 28.4379 27.2997 28.3672 26.9212 28.2789L26.5375 28.1915C25.9571 28.0636 25.3986 27.9366 25.3986 27.1763C25.3986 26.792 25.6127 26.1149 26.777 26.1149C27.8765 26.1149 28.1702 26.8063 28.1755 27.2293H27.4587C27.4386 27.0754 27.3783 26.7112 26.7228 26.7112C26.4396 26.7112 26.0978 26.8113 26.0978 27.1233C26.0978 27.3925 26.3286 27.4505 26.4789 27.485L27.3512 27.6919C27.8398 27.8063 28.29 28.0006 28.29 28.6204ZM32.6524 29.0476H34.6408V29.6599H31.9182V26.2083H34.5569V26.8206H32.6524V27.5455H34.4005V28.1561H32.6524V29.0476ZM26.5218 25.1402H25.1565V18.4009H26.6974L29.4787 23.0931H29.497V18.4009H30.8623V25.141H29.4009L26.5419 20.3361H26.5235L26.5218 25.1402Z'
            fill='black'
          />
        </svg>
      );
    case 'card':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          fill='none'
        >
          <g
            stroke='#929298'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
          >
            <path
              strokeMiterlimit='10'
              d='M2 8.505h20M6 16.505h2M10.5 16.505h4'
            />
            <path d='M6.44 3.505h11.11c3.56 0 4.45.88 4.45 4.39v8.21c0 3.51-.89 4.39-4.44 4.39H6.44c-3.55.01-4.44-.87-4.44-4.38v-8.22c0-3.51.89-4.39 4.44-4.39Z' />
          </g>
        </svg>
      );
    case 'camera':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '48'}
          height={h || '48'}
          fill='none'
          viewBox='0 0 48 48'
        >
          <path
            fill='#fff'
            d='M36 12c-1.22 0-2.34-.7-2.9-1.78l-1.44-2.9C30.74 5.5 28.34 4 26.3 4h-4.58c-2.06 0-4.46 1.5-5.38 3.32l-1.44 2.9A3.287 3.287 0 0 1 12 12c-4.34 0-7.78 3.66-7.5 7.98L5.54 36.5C5.78 40.62 8 44 13.52 44h20.96c5.52 0 7.72-3.38 7.98-7.5l1.04-16.52C43.78 15.66 40.34 12 36 12Zm-15 2.5h6c.82 0 1.5.68 1.5 1.5s-.68 1.5-1.5 1.5h-6c-.82 0-1.5-.68-1.5-1.5s.68-1.5 1.5-1.5Zm3 21.74c-3.72 0-6.76-3.02-6.76-6.76 0-3.74 3.02-6.76 6.76-6.76 3.74 0 6.76 3.02 6.76 6.76 0 3.74-3.04 6.76-6.76 6.76Z'
          />
        </svg>
      );
    case 'add-foto':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          width='20'
          height='19'
          viewBox='0 0 20 19'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='m17.72 7.909-.412 6.539c-.103 1.63-.974 2.969-3.16 2.969H5.853c-2.185 0-3.064-1.338-3.159-2.969l-.411-6.54A2.971 2.971 0 0 1 5.25 4.75a1.3 1.3 0 0 0 1.148-.705l.57-1.147c.365-.72 1.315-1.315 2.13-1.315h1.813M8.813 6.333h2.374'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M10 14.25a2.578 2.578 0 0 0 2.574-2.573A2.578 2.578 0 0 0 10 9.104a2.578 2.578 0 0 0-2.573 2.573A2.578 2.578 0 0 0 10 14.25Z'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            d='M12.969 3.958h4.354'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeWidth='1.5'
            d='M15.146 6.135V1.781'
          />
        </svg>
      );
    case 'block':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          fill='none'
        >
          <g
            stroke='#EF4062'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
          >
            <path d='M15.52 2.083H9.48c-.71 0-1.71.417-2.21.917L3 7.27c-.5.5-.917 1.5-.917 2.21v6.04c0 .71.417 1.71.917 2.21L7.27 22c.5.5 1.5.917 2.21.917h6.04c.71 0 1.71-.417 2.21-.917L22 17.73c.5-.5.917-1.5.917-2.21V9.48c0-.71-.417-1.71-.917-2.21L17.73 3c-.5-.5-1.5-.917-2.21-.917ZM5.146 19.875l14.729-14.73' />
          </g>
        </svg>
      );
    case 'unblock':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          width='25'
          height='25'
          viewBox='0 0 25 25'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M15.52 2.083H9.48c-.71 0-1.71.417-2.21.917L3 7.27c-.5.5-.917 1.5-.917 2.21v6.04c0 .71.417 1.71.917 2.21L7.27 22c.5.5 1.5.917 2.21.917h6.04c.71 0 1.71-.417 2.21-.917L22 17.73c.5-.5.917-1.5.917-2.21V9.48c0-.71-.417-1.71-.917-2.21L17.73 3c-.5-.5-1.5-.917-2.21-.917ZM5.146 19.875 10 15M15 10l4.5-4.5'
          />
        </svg>
      );
    case 'lock':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='18'
          height='18'
          fill='none'
          viewBox='0 0 18 18'
        >
          <path
            stroke='#070708'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.2'
            d='M8.976 17.125a8.125 8.125 0 1 0 0-16.25 8.125 8.125 0 0 0 0 16.25Z'
          />
          <path
            stroke='#070708'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.2'
            d='M6.375 8.125V7.25c0-1.448.438-2.625 2.625-2.625 2.188 0 2.625 1.177 2.625 2.625v.875M9 11.844a1.094 1.094 0 1 0 0-2.188 1.094 1.094 0 0 0 0 2.188Z'
          />
          <path
            stroke='#070708'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.2'
            d='M11.188 13.375H6.811c-1.75 0-2.187-.438-2.187-2.188v-.874c0-1.75.438-2.188 2.188-2.188h4.375c1.75 0 2.187.438 2.187 2.188v.874c0 1.75-.438 2.188-2.188 2.188Z'
          />
        </svg>
      );
    case 'dollar':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '27'}
          height={h || '27'}
          fill='none'
          viewBox='0 0 27 27'
        >
          <g stroke='#070708' strokeLinecap='round' strokeWidth='2'>
            <path d='M18.817 8.392C18.61 7.095 17.399 4.5 13.577 4.5c-2.08 0-5.317.86-5.317 3.892 0 3.81 3.082 4.135 5.317 4.784 2.235.648 5.548 1.135 5.548 4.865 0 3.73-4.47 4.459-5.548 4.459-1.079 0-4.623-.486-5.702-4.216M13.5 2.25v22.5' />
          </g>
        </svg>
      );
    case 'dollar-green':
      return (
        <svg
          className={className}
          width='19'
          height='19'
          viewBox='0 0 19 19'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <circle
            cx='9.5'
            cy='9.5'
            r='8.25'
            stroke='#44BE2E'
            strokeWidth='1.5'
          />
          <path
            d='M7.00391 11.2474C7.00391 12.2149 7.74641 12.9949 8.66891 12.9949H10.5514C11.3539 12.9949 12.0064 12.3124 12.0064 11.4724C12.0064 10.5574 11.6089 10.2349 11.0164 10.0249L7.99391 8.97488C7.40141 8.76488 7.00391 8.44238 7.00391 7.52738C7.00391 6.68738 7.65641 6.00488 8.45891 6.00488H10.3414C11.2639 6.00488 12.0064 6.78488 12.0064 7.75238'
            stroke='#44BE2E'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M9.5 5V14'
            stroke='#44BE2E'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      );
    case 'channel':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '18'}
          height={h || '18'}
          viewBox='0 0 18 18'
          fill='none'
        >
          <g clipPath='url(#abc)'>
            <path
              fill='#070708'
              d='M5 8.125h8v1H5zM5 10.625h8v1H5zM5 5.625h8v1H5z'
            />
            <path
              stroke='#070708'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='1.2'
              d='M8.976 16.75a8.125 8.125 0 1 0 0-16.25 8.125 8.125 0 0 0 0 16.25Z'
            />
          </g>
          <defs>
            <clipPath id='adc'>
              <path fill='#fff' d='M0 0h18v18H0z' />
            </clipPath>
          </defs>
        </svg>
      );
    case 'adult':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '18'}
          height={h || '18'}
          fill='none'
          viewBox='0 0 18 18'
        >
          <path
            stroke='#070708'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.2'
            d='M12 3.75h4.5M14.25 6V1.5'
          />
          <path
            fill='#070708'
            d='M5.949 7.215 4.5 7.944v-.981l1.674-.891h.828v6.3H5.949V7.215ZM10.062 12.444c-.414 0-.78-.069-1.098-.207a1.693 1.693 0 0 1-.73-.585 1.499 1.499 0 0 1-.26-.873v-.369c0-.258.084-.501.252-.729.168-.228.399-.411.693-.549v-.009a1.56 1.56 0 0 1-.54-.504 1.217 1.217 0 0 1-.198-.657v-.378c0-.312.08-.588.243-.828.168-.24.399-.426.693-.558.3-.132.645-.198 1.035-.198h.774c.39 0 .735.066 1.035.198.3.132.53.318.693.558.168.24.252.516.252.828v.378c0 .222-.066.438-.198.648a1.643 1.643 0 0 1-.54.513v.009c.294.138.525.321.693.549.168.228.252.471.252.729v.369c0 .33-.087.621-.261.873-.174.252-.42.447-.738.585a2.736 2.736 0 0 1-1.098.207h-.954Zm.864-3.735c.276 0 .498-.069.666-.207a.657.657 0 0 0 .26-.54v-.369a.584.584 0 0 0-.26-.495c-.168-.126-.39-.189-.666-.189h-.774c-.276 0-.498.063-.666.189a.59.59 0 0 0-.252.495v.369c0 .222.084.402.252.54.168.138.39.207.666.207h.774Zm.09 2.826c.312 0 .564-.072.756-.216a.708.708 0 0 0 .288-.585v-.306a.705.705 0 0 0-.315-.603c-.204-.156-.477-.234-.82-.234h-.773c-.336 0-.61.078-.82.234a.711.711 0 0 0-.305.603v.306c0 .24.093.435.279.585.192.144.444.216.756.216h.954Z'
          />
          <path
            stroke='#070708'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.2'
            d='M10.515 1.65A7.803 7.803 0 0 0 9 1.5C4.86 1.5 1.5 4.86 1.5 9c0 4.14 3.36 7.5 7.5 7.5a7.503 7.503 0 0 0 7.35-8.992'
          />
        </svg>
      );
    case 'adult-white':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='31'
          height='32'
          fill='none'
          viewBox='0 0 31 32'
        >
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M20.666 6.958h7.75M24.541 10.834v-7.75'
          />
          <g fill='#fff'>
            <path d='M10.245 12.926 7.75 14.181v-1.689l2.883-1.535h1.426v10.85h-1.813v-8.881ZM17.329 21.931c-.713 0-1.344-.118-1.891-.356-.538-.238-.956-.573-1.256-1.008-.3-.433-.45-.935-.45-1.503v-.636c0-.444.145-.862.435-1.255.289-.393.687-.708 1.193-.945v-.016a2.69 2.69 0 0 1-.93-.868 2.096 2.096 0 0 1-.34-1.131v-.651c0-.538.139-1.013.418-1.426.289-.414.687-.734 1.193-.961.517-.228 1.111-.341 1.783-.341h1.333c.671 0 1.265.113 1.782.34.517.228.915.548 1.194.962.289.413.434.888.434 1.426v.65c0 .383-.114.755-.341 1.117a2.83 2.83 0 0 1-.93.883v.015c.506.238.904.553 1.193.946.29.393.434.811.434 1.256v.635c0 .568-.15 1.07-.45 1.503-.299.434-.723.77-1.27 1.008-.548.238-1.178.357-1.891.357h-1.643Zm1.488-6.432c.475 0 .857-.119 1.147-.357.3-.237.45-.547.45-.93v-.635c0-.351-.15-.636-.45-.852-.29-.217-.672-.326-1.147-.326h-1.333c-.476 0-.858.109-1.147.326-.29.216-.434.5-.434.852v.636c0 .382.144.692.434.93.289.237.671.356 1.147.356h1.333Zm.155 4.867c.537 0 .971-.124 1.302-.372a1.22 1.22 0 0 0 .496-1.008v-.527c0-.433-.181-.78-.543-1.038-.351-.269-.821-.403-1.41-.403h-1.333c-.579 0-1.05.134-1.41.403a1.225 1.225 0 0 0-.528 1.038v.527c0 .414.16.75.48 1.008.331.248.765.372 1.303.372h1.643Z' />
          </g>
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M18.11 3.342a13.438 13.438 0 0 0-2.61-.259C8.37 3.083 2.584 8.87 2.584 16S8.37 28.917 15.5 28.917c7.13 0 12.917-5.787 12.917-12.917 0-.878-.09-1.744-.259-2.57'
          />
        </svg>
      );

    case 'subscription':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          width={w || '25'}
          height={h || '25'}
          viewBox='0 0 25 25'
        >
          <path
            stroke='#070708'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='m16.824 13.365-1.802.604c-.5.166-.886.552-1.053 1.052l-.604 1.802c-.51 1.552-2.698 1.52-3.177-.031L8.157 10.25c-.396-1.302.802-2.5 2.083-2.104l6.552 2.031c1.552.49 1.573 2.677.032 3.188Z'
          />
          <path
            stroke='#070708'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M12.5 22.917c5.754 0 10.417-4.664 10.417-10.417S18.254 2.083 12.501 2.083 2.084 6.747 2.084 12.5s4.664 10.417 10.417 10.417Z'
          />
        </svg>
      );
    case 'manage-invite':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='19'
          height='19'
          fill='none'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
            d='M13.885 6.579a1.947 1.947 0 1 0 0-3.895 1.947 1.947 0 0 0 0 3.895ZM5.114 6.579a1.947 1.947 0 1 0 0-3.895 1.947 1.947 0 0 0 0 3.895ZM13.885 16.316a1.947 1.947 0 1 0 0-3.895 1.947 1.947 0 0 0 0 3.895ZM5.114 16.316a1.947 1.947 0 1 0 0-3.895 1.947 1.947 0 0 0 0 3.895Z'
          />
        </svg>
      );
    case 'menu':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          fill='none'
          viewBox='0 0 20 20'
        >
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeWidth='1.5'
            d='M2.5 5.833h15M2.5 10h15M2.5 14.167h15'
          />
        </svg>
      );

    case 'payment-methods':
      return (
        <svg
          width='25'
          height='24'
          viewBox='0 0 25 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M2.33398 8.50488H22.334'
            stroke='#070708'
            strokeWidth='1.5'
            strokeMiterlimit='10'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M6.33398 16.5049H8.33398'
            stroke='#070708'
            strokeWidth='1.5'
            strokeMiterlimit='10'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M10.834 16.5049H14.834'
            stroke='#070708'
            strokeWidth='1.5'
            strokeMiterlimit='10'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M6.77398 3.50488H17.884C21.444 3.50488 22.334 4.38488 22.334 7.89488V16.1049C22.334 19.6149 21.444 20.4949 17.894 20.4949H6.77398C3.22398 20.5049 2.33398 19.6249 2.33398 16.1149V7.89488C2.33398 4.38488 3.22398 3.50488 6.77398 3.50488Z'
            stroke='#070708'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      );

    case 'currency':
      return (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M8.67188 14.3298C8.67188 15.6198 9.66188 16.6598 10.8919 16.6598H13.4019C14.4719 16.6598 15.3419 15.7498 15.3419 14.6298C15.3419 13.4098 14.8119 12.9798 14.0219 12.6998L9.99187 11.2998C9.20187 11.0198 8.67188 10.5898 8.67188 9.36984C8.67188 8.24984 9.54187 7.33984 10.6119 7.33984H13.1219C14.3519 7.33984 15.3419 8.37984 15.3419 9.66984'
            stroke='#0A49A5'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M12 6V18'
            stroke='#0A49A5'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H15C20 2 22 4 22 9V15C22 20 20 22 15 22Z'
            stroke='#0A49A5'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      );
    case 'saved-payment-options':
      return (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M2 8.505H22'
            stroke='#0A49A5'
            strokeWidth='1.5'
            strokeMiterlimit='10'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M6 16.505H8'
            stroke='#0A49A5'
            strokeWidth='1.5'
            strokeMiterlimit='10'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M10.5 16.505H14.5'
            stroke='#0A49A5'
            strokeWidth='1.5'
            strokeMiterlimit='10'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M6.44 3.505H17.55C21.11 3.505 22 4.385 22 7.895V16.105C22 19.615 21.11 20.495 17.56 20.495H6.44C2.89 20.505 2 19.625 2 16.115V7.895C2 4.385 2.89 3.505 6.44 3.505Z'
            stroke='#0A49A5'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      );
    case 'award':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          fill='none'
          viewBox='0 0 25 25'
        >
          <path
            stroke='#44BE2E'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M4.438 11.48v5.176c0 1.896 0 1.896 1.791 3.104l4.927 2.844c.74.427 1.948.427 2.688 0l4.927-2.844c1.791-1.208 1.791-1.208 1.791-3.104V11.48c0-1.896 0-1.896-1.791-3.104l-4.927-2.844c-.74-.427-1.948-.427-2.688 0L6.23 8.375c-1.792 1.208-1.792 1.208-1.792 3.104Z'
          />
          <path
            stroke='#44BE2E'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M18.23 7.948v-2.74c0-2.083-1.043-3.125-3.126-3.125H9.896c-2.084 0-3.125 1.042-3.125 3.125v2.667M13.156 11.448l.594.927a.908.908 0 0 0 .458.333l1.063.271c.656.167.833.73.406 1.25l-.698.844a.935.935 0 0 0-.177.542l.063 1.093c.041.678-.438 1.021-1.063.771l-1.02-.406a.899.899 0 0 0-.574 0l-1.02.406c-.626.25-1.105-.104-1.063-.77l.063-1.094a.911.911 0 0 0-.178-.542l-.697-.844c-.428-.52-.25-1.083.406-1.25l1.062-.27a.881.881 0 0 0 .459-.334l.593-.927c.375-.563.959-.563 1.323 0Z'
          />
        </svg>
      );
    case 'moneys':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          fill='none'
          viewBox='0 0 25 25'
        >
          <path
            stroke='#44BE2E'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
            d='M20.104 8.25v5.365c0 3.208-1.833 4.583-4.583 4.583H6.365c-.47 0-.917-.042-1.334-.135a4.056 4.056 0 0 1-.74-.198c-1.562-.584-2.51-1.938-2.51-4.25V8.25c0-3.208 1.834-4.583 4.584-4.583h9.156c2.333 0 4.01.99 4.458 3.25.073.416.125.843.125 1.333Z'
          />
          <path
            stroke='#44BE2E'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
            d='M23.23 11.375v5.365c0 3.208-1.833 4.583-4.583 4.583H9.491c-.771 0-1.469-.104-2.073-.333-1.24-.458-2.084-1.406-2.386-2.927.417.094.865.135 1.334.135h9.156c2.75 0 4.583-1.375 4.583-4.583V8.25c0-.49-.041-.927-.125-1.333 1.98.417 3.25 1.812 3.25 4.458Z'
          />
          <path
            stroke='#44BE2E'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
            d='M10.936 13.688a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5ZM4.98 8.646v4.583M16.898 8.646v4.584'
          />
        </svg>
      );

    case 'mark':
      return (
        <svg
          width={w || '24'}
          height={h || '24'}
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z'
            stroke='#929298'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M9 9.00008C9.2351 8.33175 9.69915 7.76819 10.31 7.40921C10.9208 7.05024 11.6389 6.91902 12.3372 7.03879C13.0355 7.15857 13.6688 7.52161 14.1251 8.06361C14.5813 8.60561 14.8311 9.2916 14.83 10.0001C14.83 12.0001 11.83 13.0001 11.83 13.0001'
            stroke='#929298'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M11.9102 17H11.9202'
            stroke='#929298'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      );
    case 'settings-blue':
      return (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z'
            stroke='#0A49A5'
            strokeWidth='1.5'
            strokeMiterlimit='10'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M2 12.8801V11.1201C2 10.0801 2.85 9.22006 3.9 9.22006C5.71 9.22006 6.45 7.94006 5.54 6.37006C5.02 5.47006 5.33 4.30006 6.24 3.78006L7.97 2.79006C8.76 2.32006 9.78 2.60006 10.25 3.39006L10.36 3.58006C11.26 5.15006 12.74 5.15006 13.65 3.58006L13.76 3.39006C14.23 2.60006 15.25 2.32006 16.04 2.79006L17.77 3.78006C18.68 4.30006 18.99 5.47006 18.47 6.37006C17.56 7.94006 18.3 9.22006 20.11 9.22006C21.15 9.22006 22.01 10.0701 22.01 11.1201V12.8801C22.01 13.9201 21.16 14.7801 20.11 14.7801C18.3 14.7801 17.56 16.0601 18.47 17.6301C18.99 18.5401 18.68 19.7001 17.77 20.2201L16.04 21.2101C15.25 21.6801 14.23 21.4001 13.76 20.6101L13.65 20.4201C12.75 18.8501 11.27 18.8501 10.36 20.4201L10.25 20.6101C9.78 21.4001 8.76 21.6801 7.97 21.2101L6.24 20.2201C5.33 19.7001 5.02 18.5301 5.54 17.6301C6.45 16.0601 5.71 14.7801 3.9 14.7801C2.85 14.7801 2 13.9201 2 12.8801Z'
            stroke='#0A49A5'
            strokeWidth='1.5'
            strokeMiterlimit='10'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      );

    case 'pay-pal-large':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '57'}
          height={h || '68'}
          fill='none'
          viewBox='0 0 57 68'
        >
          <path
            fill='#28356A'
            fillRule='evenodd'
            d='m16.028 65.155 1.148-7.316-2.556-.06H2.418l8.48-53.986a.716.716 0 0 1 .237-.423.691.691 0 0 1 .452-.167H32.16c6.831 0 11.545 1.427 14.006 4.243 1.154 1.322 1.889 2.703 2.244 4.222.373 1.595.38 3.5.016 5.824l-.027.169v1.49l1.154.655c.972.518 1.744 1.11 2.336 1.788.987 1.13 1.625 2.566 1.895 4.268.279 1.751.187 3.835-.27 6.194-.526 2.713-1.377 5.077-2.527 7.01-1.057 1.782-2.403 3.26-4.003 4.405-1.526 1.088-3.34 1.914-5.391 2.443-1.988.519-4.254.781-6.739.781h-1.601a4.844 4.844 0 0 0-3.13 1.156 4.87 4.87 0 0 0-1.632 2.925l-.12.659-2.028 12.895-.091.473c-.025.15-.067.225-.128.275a.336.336 0 0 1-.21.077h-9.887'
            clipRule='evenodd'
          />
          <path
            fill='#298FC2'
            fillRule='evenodd'
            d='M50.651 17.833c-.06.394-.131.797-.21 1.211-2.713 13.988-11.996 18.82-23.852 18.82h-6.037a2.934 2.934 0 0 0-2.897 2.493l-3.966 25.258a1.549 1.549 0 0 0 1.524 1.793H25.92a2.58 2.58 0 0 0 2.544-2.18l.105-.546 2.016-12.844.13-.705a2.578 2.578 0 0 1 2.544-2.185h1.601c10.373 0 18.494-4.228 20.867-16.465.991-5.111.478-9.38-2.145-12.382-.794-.905-1.779-1.656-2.93-2.268'
            clipRule='evenodd'
          />
          <path
            fill='#22284F'
            fillRule='evenodd'
            d='M47.81 16.696a21.227 21.227 0 0 0-2.638-.588c-1.628-.264-3.411-.39-5.322-.39H23.724c-.398 0-.775.09-1.112.253a2.58 2.58 0 0 0-1.43 1.932L17.75 39.72l-.099.636a2.934 2.934 0 0 1 2.898-2.493h6.037c11.855 0 21.138-4.835 23.851-18.82.081-.414.15-.816.21-1.21a14.394 14.394 0 0 0-2.23-.946c-.198-.066-.402-.13-.607-.191'
            clipRule='evenodd'
          />
          <path
            fill='#28356A'
            fillRule='evenodd'
            d='M21.18 17.903a2.572 2.572 0 0 1 2.542-2.182H39.85c1.91 0 3.694.126 5.321.39a21.225 21.225 0 0 1 3.248.777c.801.266 1.545.582 2.232.945.807-5.169-.007-8.688-2.79-11.875-3.07-3.51-8.608-5.01-15.695-5.01H11.59a2.944 2.944 0 0 0-2.906 2.495L.114 57.984a1.772 1.772 0 0 0 1.743 2.053H14.56l6.62-42.134'
            clipRule='evenodd'
          />
        </svg>
      );
    case 'bank-account':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '50'}
          height={h || '50'}
          fill='none'
          viewBox='0 0 50 50'
        >
          <path
            fill='#070708'
            fillRule='evenodd'
            d='m16.915 17.582 11.814-11.82c.44-.44.44-1.177-.011-1.606a3.929 3.929 0 0 0-5.566 0l-7.865 7.869a3.94 3.94 0 0 0 0 5.557h.01c.44.451 1.167.451 1.618 0ZM35.175 25a.831.831 0 0 0 .825-.825.831.831 0 0 0-.825-.826h-8.107l7.623-7.638a3.917 3.917 0 0 0 .01-5.58l-3.354-3.356a1.135 1.135 0 0 0-1.617 0l-11.814 11.82a1.136 1.136 0 0 0 0 1.618l3.125 3.136h-6.216a.831.831 0 0 0-.825.826c0 .45.374.825.825.825h20.35Zm-9.34-4.93-1.33 1.342a.724.724 0 0 1-1.012 0 .724.724 0 0 1 0-1.012l1.342-1.343a.731.731 0 0 1 1 0c.276.275.276.748 0 1.013Zm4.368-4.37-2.684 2.697a.745.745 0 0 1-1.012 0 .724.724 0 0 1 0-1.013l2.695-2.696a.731.731 0 0 1 1 0 .724.724 0 0 1 0 1.012ZM15.72 38.854h4.62l.803 2.577h2.84l-4.412-12.517h-3.015l-4.459 12.518h2.753l.87-2.578Zm2.301-7.114h.036l1.55 4.95h-3.19l1.604-4.95Zm-6.683 5.983c0-1.239-.4-2.459-1.934-3.032h.001c.522-.262 1.533-.767 1.533-2.564 0-1.29-.785-3.21-3.854-3.21H1v12.52h5.3c2.565 0 3.244-.436 3.958-1.137a3.637 3.637 0 0 0 1.08-2.577Zm-7.826-6.64h3c1.184 0 1.917.312 1.917 1.34 0 .996-.817 1.396-1.85 1.396H3.512v-2.737Zm3.206 8.19H3.512v-3.348h3.33c.943 0 1.882.424 1.882 1.517-.002 1.27-.734 1.831-2.006 1.831Zm37.394-5.23 5.404 7.388H46.15l-3.87-5.492-1.22 1.256v4.236h-2.616V28.914h2.616v5.09l4.779-5.09h3.38l-5.108 5.129Zm-16.133 7.394h-2.44V28.918h2.755l4.97 8.716h.033v-8.716h2.44v12.52h-2.611l-5.11-8.925h-.033l-.004 8.924Zm-10.803 6.23h1.28c-.034.455-.16.858-.377 1.21a2.26 2.26 0 0 1-.907.824c-.389.2-.859.299-1.411.299-.425 0-.809-.075-1.15-.224a2.49 2.49 0 0 1-.87-.65 2.974 2.974 0 0 1-.55-1.02A4.404 4.404 0 0 1 13 46.764v-.519c0-.495.065-.943.195-1.342.13-.399.317-.739.56-1.02.244-.283.538-.501.88-.654A2.82 2.82 0 0 1 15.788 43c.552 0 1.02.103 1.401.309.382.202.678.481.89.837.21.355.338.763.381 1.225h-1.28a2.023 2.023 0 0 0-.186-.73.982.982 0 0 0-.438-.453c-.192-.106-.449-.16-.768-.16-.249 0-.467.047-.657.141a1.204 1.204 0 0 0-.465.42 2.018 2.018 0 0 0-.28.693 4.352 4.352 0 0 0-.093.954v.528c0 .346.028.656.084.93.056.275.143.507.26.697.119.19.27.336.457.435.186.1.408.15.666.15.313 0 .568-.05.763-.15.199-.1.35-.246.452-.44.105-.193.172-.433.2-.72Zm5.396-4.569H21.39l-2.533 6.809h1.355l.506-1.516h2.532l.51 1.516h1.359l-2.547-6.809Zm.337 4.279h-1.851l.923-2.76.928 2.76Zm5.37-4.279h-2.462v6.809h1.28v-2.572h1.223l1.324 2.572h1.373v-.066l-1.495-2.815c.194-.085.368-.188.522-.309.227-.174.402-.39.526-.65.125-.258.187-.564.187-.916 0-.446-.1-.822-.298-1.127a1.836 1.836 0 0 0-.852-.692c-.37-.156-.812-.234-1.327-.234Zm-1.182 3.222h1.197c.264 0 .482-.047.656-.14a.923.923 0 0 0 .391-.388c.09-.166.135-.354.135-.566a1.25 1.25 0 0 0-.13-.59.885.885 0 0 0-.396-.388c-.177-.09-.4-.135-.67-.135h-1.183v2.207Zm6.807 3.587h-2.025v-6.809h2.053c.453 0 .866.077 1.238.23a2.857 2.857 0 0 1 1.606 1.679c.15.395.224.838.224 1.327v.341c0 .487-.075.93-.224 1.328a2.857 2.857 0 0 1-.633 1.02c-.273.283-.599.502-.977.654-.379.153-.8.23-1.262.23Zm0-1.01h-.745v-4.784h.773c.285 0 .538.048.759.145.22.096.405.238.554.425.152.187.267.418.344.692.078.275.117.591.117.95v.35c0 .465-.069.864-.205 1.197-.137.33-.338.585-.605.763-.267.174-.598.262-.992.262Z'
            clipRule='evenodd'
          />
        </svg>
      );
    case 'stripe-account':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='75'
          height='52'
          fill='none'
        >
          <path
            fill='#6461FC'
            fillRule='evenodd'
            d='m40.298 17.641-3.81.827v-3.123l3.81-.812v3.108Zm7.923 1.73c-1.488 0-2.444.704-2.975 1.194l-.197-.949h-3.34v17.851l3.795-.811.015-4.333c.547.398 1.351.965 2.687.965 2.717 0 5.19-2.205 5.19-7.058-.014-4.44-2.519-6.859-5.175-6.859Zm-.91 10.549c-.896 0-1.428-.322-1.792-.72l-.015-5.68c.395-.444.941-.75 1.806-.75 1.381 0 2.338 1.561 2.338 3.567 0 2.052-.941 3.582-2.338 3.582Zm18.047-3.537c0-3.92-1.882-7.012-5.48-7.012-3.612 0-5.798 3.093-5.798 6.981 0 4.608 2.58 6.936 6.284 6.936 1.806 0 3.172-.414 4.204-.995V29.23c-1.032.521-2.216.843-3.718.843-1.473 0-2.778-.521-2.945-2.328h7.422c0-.084.006-.275.012-.496.009-.3.019-.654.019-.866Zm-7.499-1.454c0-1.73 1.048-2.45 2.004-2.45.926 0 1.913.72 1.913 2.45h-3.917ZM36.488 19.63h3.81v13.396h-3.81V19.631Zm-4.326 0 .243 1.133c.896-1.653 2.672-1.316 3.157-1.133v3.522c-.47-.169-1.988-.383-2.884.796v9.078h-3.794V19.631h3.278Zm-7.346-3.322-3.704.796-.015 12.263c0 2.266 1.685 3.935 3.931 3.935 1.245 0 2.155-.23 2.656-.505V29.69c-.485.199-2.884.903-2.884-1.363v-5.435h2.884v-3.26H24.8l.016-3.323Zm-8.97 6.384c-.805 0-1.291.23-1.291.827 0 .652.836.939 1.873 1.294 1.69.58 3.916 1.344 3.925 4.172 0 2.74-2.17 4.317-5.327 4.317-1.306 0-2.733-.26-4.144-.873v-3.643c1.275.704 2.884 1.224 4.144 1.224.85 0 1.457-.23 1.457-.933 0-.723-.906-1.053-2-1.451-1.667-.607-3.768-1.373-3.768-3.923 0-2.71 2.049-4.333 5.13-4.333 1.26 0 2.505.2 3.764.704v3.598c-1.153-.628-2.61-.98-3.764-.98Z'
            clipRule='evenodd'
          />
        </svg>
      );
    case 'ello-card':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          fill='none'
        >
          <rect width='20' height='20' fill='#0A49A5' rx='9' />
          <path
            fill='#fff'
            fillRule='evenodd'
            d='M5 15V5h.988c.535.04 1.605.386 1.605 1.446v2.53h3.21v1.807h-3.21v2.169H15V15H5Zm9.877-10H9.69c-.329 0-.987.169-.987.843V7.29h5.185c.33 0 .988-.169.988-.843V5Z'
            clipRule='evenodd'
          />
        </svg>
      );
    case 'transfer-desc':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '42'}
          height={h || '42'}
          fill='none'
          viewBox='0 0 42 42'
        >
          <path
            fill='#070708'
            d='M12.988 32.638h3.88l.675 2.164h2.386l-3.706-10.515H13.69L9.945 34.803h2.312l.73-2.165Zm1.933-5.977h.03l1.302 4.158h-2.68l1.348-4.158Zm-5.614 5.027c0-1.041-.336-2.066-1.625-2.548.438-.219 1.289-.643 1.289-2.153 0-1.084-.659-2.697-3.238-2.697H.623v10.517h4.453c2.153 0 2.724-.366 3.324-.955.555-.54.907-1.334.907-2.164Zm-6.574-5.58h2.52c.995 0 1.61.263 1.61 1.127 0 .837-.686 1.173-1.554 1.173H2.733v-2.3Zm2.693 6.881H2.733v-2.812H5.53c.793 0 1.581.356 1.581 1.274-.001 1.067-.617 1.538-1.685 1.538Zm31.411-4.393 4.54 6.206H38.55l-3.251-4.613-1.025 1.055v3.558h-2.197V24.287h2.197v4.276l4.014-4.276h2.84l-4.291 4.309ZM9.946 40.642c0-1.006-.242-1.17-.684-1.365.533-.18.833-.688.833-1.285 0-.464-.26-1.52-1.694-1.52H5.677v5.385h1.105v-2.106h1.161c.834 0 .88.286.88 1.018 0 .554.043.835.118 1.087h1.245v-.14c-.24-.091-.24-.288-.24-1.074Zm-1.85-1.797H6.782v-1.443h1.401c.659 0 .787.417.787.704 0 .53-.284.74-.872.74Zm3.652-23.761-.026-.869c-.021-.341.066-.711.102-1.13.043-.42.1-.875.258-1.34.134-.468.251-.982.508-1.461.113-.247.229-.5.35-.755.125-.25.3-.478.45-.723.299-.504.684-.948 1.08-1.391.381-.464.852-.817 1.282-1.225.47-.333.92-.719 1.401-.99.474-.3.941-.567 1.402-.788.454-.245.904-.41 1.315-.594.635-.247 1.2-.439 1.664-.575a9.986 9.986 0 0 1-.484-1.505c-.13-.546-.24-1.104-.251-1.738.61.17 1.12.419 1.618.678.495.263.946.556 1.369.873.853.629 1.578 1.355 2.237 2.133.5.589.544 1.412.172 2.04l-.077.129a13.474 13.474 0 0 1-2.197 2.795c-.43.423-.907.818-1.436 1.181a16.23 16.23 0 0 1-.83.519c-.296.161-.607.31-.95.44a7.281 7.281 0 0 1 .009-1.045c.032-.33.074-.652.126-.971.112-.629.274-1.226.481-1.794.021-.062.046-.12.07-.18-.202.025-.412.052-.64.085-.356.076-.764.129-1.17.247-.417.094-.844.227-1.277.384-.454.134-.86.365-1.323.55-.405.251-.874.457-1.258.763-.403.291-.81.585-1.143.949-.17.175-.366.337-.52.524l-.436.575c-.317.367-.513.79-.728 1.183-.236.386-.38.787-.503 1.164-.115.376-.282.718-.33 1.04l-.16.834-.137.737s-.004-.273-.018-.749ZM.624 36.471h4.38v.957h-1.63v4.432H2.252v-4.432H.624v-.957Zm11.822 0-1.92 5.386h1.186l.374-1.112h1.987l.347 1.112h1.223l-1.897-5.386h-1.3Zm-.058 3.345.692-2.128h.01l.672 2.128h-1.374Zm9.946-21.518c-.447.258-.892.44-1.296.634-.629.265-1.184.472-1.646.623.21.471.39.965.53 1.49.14.543.27 1.097.302 1.728-.618-.151-1.135-.384-1.638-.629a9.907 9.907 0 0 1-1.396-.83c-.869-.603-1.617-1.307-2.3-2.065a1.766 1.766 0 0 1-.233-2.035l.075-.129a13.468 13.468 0 0 1 2.111-2.86c.418-.436.882-.844 1.397-1.224.264-.186.533-.367.815-.542.29-.17.597-.33.936-.468.032.362.038.71.02 1.044-.023.331-.053.655-.094.976a11.018 11.018 0 0 1-.428 1.808c-.02.062-.046.12-.064.181.2-.03.41-.064.638-.105.354-.085.758-.15 1.159-.28.414-.107.838-.252 1.265-.423.45-.146.85-.39 1.304-.588.399-.264.863-.482 1.235-.8.395-.301.793-.61 1.113-.981.17-.181.358-.35.509-.54l.416-.589c.307-.376.49-.804.692-1.203.225-.394.355-.798.464-1.179.105-.38.261-.725.3-1.048.052-.324.095-.607.133-.839.08-.47.118-.74.118-.74s.021.27.046.745c.013.242.03.535.052.87.028.34-.044.713-.071 1.132-.03.42-.076.878-.218 1.345-.121.471-.223.99-.465 1.475-.105.25-.215.506-.325.765-.121.255-.285.487-.43.738-.283.513-.653.965-1.035 1.42-.369.473-.83.843-1.245 1.262-.463.348-.902.747-1.374 1.033-.458.314-.92.596-1.372.828ZM26.8 36.47h3.832v.957h-2.706v1.215h2.37v.953h-2.37v2.265H26.8v-5.39Zm-7.144 0h1.051v5.386H19.58l-2.197-3.841h-.017v3.841h-1.049v-5.386h1.184l2.14 3.75h.014v-3.75Zm21.008 4.17c0-1.005-.244-1.17-.684-1.364.53-.18.836-.688.836-1.285 0-.464-.264-1.52-1.697-1.52h-2.722v5.385h1.105v-2.106h1.162c.83 0 .879.286.879 1.018 0 .554.043.835.12 1.087h1.24v-.14c-.24-.091-.24-.288-.24-1.074Zm-1.845-1.796H37.5v-1.443H38.9c.661 0 .79.417.79.704 0 .53-.285.74-.871.74ZM25.94 40.237c0 1.616-1.653 1.763-2.122 1.763-1.966 0-2.3-1.13-2.3-1.8h1.075c.008.3.159.87 1.143.87.53 0 1.124-.132 1.124-.695 0-.422-.407-.532-.976-.67l-.576-.137c-.871-.2-1.71-.397-1.71-1.584 0-.6.322-1.656 2.07-1.656 1.65 0 2.092 1.079 2.1 1.739h-1.076c-.03-.24-.121-.809-1.105-.809-.426 0-.939.157-.939.644 0 .42.347.51.572.564l1.31.323c.734.178 1.41.481 1.41 1.448Zm6.55.667h2.985v.956h-4.088v-5.386h3.962v.955h-2.86v1.131h2.625v.953H32.49v1.391Zm-9.205-6.097h-2.05V24.291h2.314l4.175 7.322h.028V24.29h2.05v10.517h-2.194l-4.293-7.497h-.028l-.002 7.496Z'
          />
        </svg>
      );

    case 'arrow-big-right':
      return (
        <svg
          width='11'
          height='18'
          viewBox='0 0 11 18'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M1 1L10 9L0.999997 17'
            stroke='#929298'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      );
    case 'check-green':
      return (
        <svg
          width='28'
          height='28'
          viewBox='0 0 28 28'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <rect
            x='0.5'
            y='0.5'
            width='27'
            height='27'
            rx='13.5'
            fill='white'
            fillOpacity='0.9'
          />
          <g clipPath='url(#clip0_22_43743)'>
            <path
              d='M4.39209 10.6116C5.11597 7.52556 7.52556 5.11597 10.6116 4.39208C12.8403 3.8693 15.1597 3.86931 17.3884 4.39209C20.4744 5.11597 22.884 7.52557 23.6079 10.6116C24.1307 12.8403 24.1307 15.1597 23.6079 17.3884C22.884 20.4744 20.4744 22.884 17.3884 23.6079C15.1597 24.1307 12.8403 24.1307 10.6116 23.6079C7.52557 22.884 5.11597 20.4744 4.39209 17.3884C3.8693 15.1597 3.8693 12.8403 4.39209 10.6116Z'
              fill='#44BE2E'
            />
            <path
              d='M19 10L11.8571 18L9 14.8'
              stroke='white'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </g>
          <rect
            x='0.5'
            y='0.5'
            width='27'
            height='27'
            rx='13.5'
            stroke='#CFCFD2'
          />
          <defs>
            <clipPath id='clip0_22_43743'>
              <rect
                width='24'
                height='24'
                fill='white'
                transform='translate(2 2)'
              />
            </clipPath>
          </defs>
        </svg>
      );
    case 'check-circle':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          fill='none'
        >
          <g
            stroke='#44BE2E'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
          >
            <path d='M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10Z' />
            <path d='m7.75 12 2.83 2.83 5.67-5.66' />
          </g>
        </svg>
      );
    case 'info-circle':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '20'}
          height={h || '21'}
          fill='none'
          viewBox='0 0 20 21'
        >
          <g stroke='#fff' strokeLinecap='round' strokeLinejoin='round'>
            <path
              strokeWidth='1.5'
              d='M10 1.987c-4.583 0-8.333 3.75-8.333 8.333s3.75 8.333 8.334 8.333c4.583 0 8.333-3.75 8.333-8.333s-3.75-8.333-8.333-8.333ZM10 13.653v-3.75'
            />
            <path strokeWidth='2' d='M10.004 6.987h-.008' />
          </g>
        </svg>
      );
    case 'arrow-down-blue':
      return (
        <svg
          width='14'
          height='10'
          viewBox='0 0 14 10'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M13 1.625L7 8.375L1 1.625'
            stroke='#0A49A5'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      );
    case 'theme':
      return (
        <svg
          width='70'
          height='36'
          viewBox='0 0 70 36'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g filter='url(#filter0_d_145_16814)'>
            <g clipPath='url(#clip0_145_16814)'>
              <path
                d='M1 12C1 5.37258 6.37258 0 13 0H47C53.6274 0 59 5.37258 59 12V22C59 28.6274 53.6274 34 47 34H13C6.37258 34 1 28.6274 1 22V12Z'
                fill={color || '#0A49A5'}
              />
            </g>
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M53 30.6754L58.9398 13.112V13C58.9398 28.689 66.6001 31.6732 68.9466 32.5874C68.9647 32.5944 68.9825 32.6014 69 32.6082C62.6571 33.6576 57.1512 32.4585 53 30.6754Z'
              fill={color || '#0A49A5'}
            />
          </g>
          <defs>
            <filter
              id='filter0_d_145_16814'
              x='0'
              y='0'
              width='70'
              height='36'
              filterUnits='userSpaceOnUse'
              color-interpolation-filters='sRGB'
            >
              <feFlood flood-opacity='0' result='BackgroundImageFix' />
              <feColorMatrix
                in='SourceAlpha'
                type='matrix'
                values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                result='hardAlpha'
              />
              <feOffset dy='1' />
              <feGaussianBlur stdDeviation='0.5' />
              <feColorMatrix
                type='matrix'
                values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0'
              />
              <feBlend
                mode='normal'
                in2='BackgroundImageFix'
                result='effect1_dropShadow_145_16814'
              />
              <feBlend
                mode='normal'
                in='SourceGraphic'
                in2='effect1_dropShadow_145_16814'
                result='shape'
              />
            </filter>
            <clipPath id='clip0_145_16814'>
              <path
                d='M1 12C1 5.37258 6.37258 0 13 0H47C53.6274 0 59 5.37258 59 12V22C59 28.6274 53.6274 34 47 34H13C6.37258 34 1 28.6274 1 22V12Z'
                fill='white'
              />
            </clipPath>
          </defs>
        </svg>
      );
    case 'theme-white':
      return (
        <svg
          width='70'
          height='36'
          viewBox='0 0 70 36'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g filter='url(#filter0_d_145_10911)'>
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M17 30.6754L11.0602 13.112V13C11.0602 28.689 3.39995 31.6732 1.05337 32.5874C1.03526 32.5944 1.01747 32.6014 1 32.6082C7.34289 33.6576 12.8488 32.4585 17 30.6754Z'
              fill='white'
            />
            <g clipPath='url(#clip0_145_10911)'>
              <path
                d='M11 12C11 5.37258 16.3726 0 23 0H57C63.6274 0 69 5.37258 69 12V22C69 28.6274 63.6274 34 57 34H23C16.3726 34 11 28.6274 11 22V12Z'
                fill='white'
              />
            </g>
          </g>
          <defs>
            <filter
              id='filter0_d_145_10911'
              x='0'
              y='0'
              width='70'
              height='36'
              filterUnits='userSpaceOnUse'
              color-interpolation-filters='sRGB'
            >
              <feFlood flood-opacity='0' result='BackgroundImageFix' />
              <feColorMatrix
                in='SourceAlpha'
                type='matrix'
                values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                result='hardAlpha'
              />
              <feOffset dy='1' />
              <feGaussianBlur stdDeviation='0.5' />
              <feColorMatrix
                type='matrix'
                values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0'
              />
              <feBlend
                mode='normal'
                in2='BackgroundImageFix'
                result='effect1_dropShadow_145_10911'
              />
              <feBlend
                mode='normal'
                in='SourceGraphic'
                in2='effect1_dropShadow_145_10911'
                result='shape'
              />
            </filter>
            <clipPath id='clip0_145_10911'>
              <path
                d='M11 12C11 5.37258 16.3726 0 23 0H57C63.6274 0 69 5.37258 69 12V22C69 28.6274 63.6274 34 57 34H23C16.3726 34 11 28.6274 11 22V12Z'
                fill='white'
              />
            </clipPath>
          </defs>
        </svg>
      );
    case 'permissions':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='25'
          fill='none'
          viewBox='0 0 24 25'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
            d='M19.79 15.75a7.575 7.575 0 0 1-7.6 1.87l-4.71 4.7c-.34.35-1.01.56-1.49.49l-2.18-.3c-.72-.1-1.39-.78-1.5-1.5l-.3-2.18c-.07-.48.16-1.15.49-1.49l4.7-4.7c-.8-2.6-.18-5.55 1.88-7.6 2.95-2.95 7.74-2.95 10.7 0 2.96 2.95 2.96 7.76.01 10.71ZM6.89 18.31l2.3 2.3'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M14.5 11.82a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z'
          />
        </svg>
      );
    case 'admin':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='25'
          fill='none'
          viewBox='0 0 24 25'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M10.49 3.05 5.5 4.92c-1.15.43-2.09 1.79-2.09 3.02v7.43c0 1.18.78 2.73 1.73 3.44l4.3 3.21c1.41 1.06 3.73 1.06 5.14 0l4.3-3.21c.95-.71 1.73-2.26 1.73-3.44V7.94c0-1.23-.94-2.59-2.09-3.02l-4.99-1.87c-.85-.31-2.21-.31-3.04 0Z'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M12 11.74h-.13c-.94-.03-1.69-.81-1.69-1.76 0-.97.79-1.76 1.76-1.76s1.76.79 1.76 1.76c-.01.96-.76 1.73-1.7 1.76ZM10.01 14.54c-.96.64-.96 1.69 0 2.33 1.09.73 2.88.73 3.97 0 .96-.64.96-1.69 0-2.33-1.08-.73-2.87-.73-3.97 0Z'
          />
        </svg>
      );
    case 'money':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          fill='none'
          viewBox='0 0 25 25'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
            d='M17.708 21.354H7.292c-3.125 0-5.209-1.562-5.209-5.208V8.854c0-3.646 2.084-5.208 5.209-5.208h10.416c3.125 0 5.209 1.562 5.209 5.208v7.292c0 3.646-2.084 5.208-5.209 5.208Z'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
            d='M12.5 15.625a3.125 3.125 0 1 0 0-6.25 3.125 3.125 0 0 0 0 6.25ZM5.73 9.896v5.208M19.27 9.896v5.208'
          />
        </svg>
      );
    case 'online-course-outline':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '18'}
          height={h || '18'}
          fill='none'
          viewBox='0 0 18 18'
        >
          <path
            stroke='#070708'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.2'
            d='M8.976 17.125a8.125 8.125 0 1 0 0-16.25 8.125 8.125 0 0 0 0 16.25Z'
          />
          <path
            stroke='#070708'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M9.215 12.42H6.648c-1.284 0-1.71-.852-1.71-1.71V7.29c0-1.284.426-1.71 1.71-1.71h2.567c1.284 0 1.71.426 1.71 1.71v3.42c0 1.284-.43 1.71-1.71 1.71ZM12.055 11.072l-1.13-.792V7.716l1.13-.792c.553-.386 1.008-.15 1.008.528v3.096c0 .678-.455.914-1.008.524Z'
          />
        </svg>
      );
    case 'left-appendix':
      return (
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 18 35'>
          <g filter='url(#appendix-not-own)'>
            <path
              fill='#fff'
              fillRule='evenodd'
              d='m17 30.675-5.94-17.563V13c0 15.689-7.66 18.673-10.007 19.587L1 32.608a28.536 28.536 0 0 0 16-1.933Z'
              clipRule='evenodd'
            ></path>
          </g>
          <defs>
            <filter
              id='appendix-not-own'
              width='18'
              height='36'
              x='0'
              y='0'
              colorInterpolationFilters='sRGB'
              filterUnits='userSpaceOnUse'
            >
              <feFlood floodOpacity='0' result='BackgroundImageFix' />
              <feColorMatrix
                in='SourceAlpha'
                result='hardAlpha'
                values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
              />
              <feOffset dy='1' />
              <feGaussianBlur stdDeviation='.5' />
              <feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0' />
              <feBlend
                in2='BackgroundImageFix'
                result='effect1_dropShadow_2_53331'
              />
              <feBlend
                in='SourceGraphic'
                in2='effect1_dropShadow_2_53331'
                result='shape'
              />
            </filter>
          </defs>
        </svg>
      );
    case 'clock-outline':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          fill='none'
          viewBox='0 0 24 24'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10Z'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='m15.71 15.18-3.1-1.85c-.54-.32-.98-1.09-.98-1.72v-4.1'
          />
        </svg>
      );
    case 'clock':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='18'
          height='19'
          fill='none'
          viewBox='0 0 18 19'
        >
          <path
            fill='#F2C94C'
            d='M9 2C4.867 2 1.5 5.367 1.5 9.5S4.867 17 9 17s7.5-3.367 7.5-7.5S13.133 2 9 2Zm3.262 10.178a.56.56 0 0 1-.772.194l-2.325-1.387c-.577-.345-1.005-1.102-1.005-1.77V6.14c0-.308.255-.563.563-.563.307 0 .562.255.562.563v3.075c0 .27.225.668.457.803l2.325 1.387c.27.158.36.503.195.773Z'
          />
        </svg>
      );
    case 'chat':
      return (
        <svg
          width='16'
          height='20'
          viewBox='0 0 16 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M0 17.6754L5.93982 0.112048V0C5.93982 15.689 13.6001 18.6732 15.9466 19.5874C15.9647 19.5944 15.9825 19.6014 16 19.6082C9.65711 20.6576 4.15116 19.4585 0 17.6754Z'
            fill='white'
          />
        </svg>
      );

    case 'phone-gray':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='18'
          height='18'
          fill='none'
          viewBox='0 0 18 18'
        >
          <path
            fill='#929298'
            d='M5.256 11.995a20.77 20.77 0 0 1-1.754-2.08c-.614-.855-1.11-1.71-1.47-2.557C1.68 6.502 1.5 5.684 1.5 4.905c0-.51.09-.998.27-1.448.18-.457.465-.877.862-1.252.48-.473 1.006-.705 1.56-.705.21 0 .42.045.608.135.195.09.368.225.503.42l1.74 2.453c.135.187.232.36.3.524.067.158.104.316.104.458 0 .18-.052.36-.157.532-.098.173-.24.353-.42.533l-.57.593a.401.401 0 0 0-.12.3c0 .06.008.112.022.172.01.028.021.052.03.075.012.026.022.05.03.075.136.248.368.57.698.96.303.35.623.705.967 1.061.135.11.447.378.8.68.629.539 1.385 1.187 1.48 1.236l.068.03.068.03c.06.023.12.03.187.03a.413.413 0 0 0 .308-.127l.57-.563c.187-.187.367-.33.54-.42a.999.999 0 0 1 .532-.157c.143 0 .293.03.458.098a2.9 2.9 0 0 1 .525.292l2.482 1.762c.195.136.33.293.413.48.075.188.12.375.12.585 0 .21-.038.428-.113.638a3.095 3.095 0 0 1-.585.945 3.381 3.381 0 0 1-1.23.885c-.004 0-.007.002-.011.004a3.789 3.789 0 0 1-1.451.281c-.765 0-1.583-.18-2.445-.547a13.173 13.173 0 0 1-2.58-1.486 33.522 33.522 0 0 1-2.398-2.063.223.223 0 0 1-.04-.029 26.33 26.33 0 0 1-.164-.167L5.25 12l.006-.005ZM15 7.162a.567.567 0 0 1-.562-.562V3.563H11.4A.567.567 0 0 1 10.838 3c0-.308.255-.563.562-.563H15c.308 0 .563.256.563.563v3.6a.567.567 0 0 1-.563.563Z'
          />
        </svg>
      );
    case 'close-white':
      return (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M17.7807 17.968L6.59333 6.78069M6.59333 17.968L17.7807 6.78069'
            stroke='white'
            strokeWidth='1.5'
            strokeLinecap='round'
          />
        </svg>
      );
    case 'large-phone':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='70'
          height='70'
          fill='none'
          viewBox='0 0 70 70'
        >
          <rect width='70' height='70' fill='#EF4062' rx='30' />
          <path
            fill='#fff'
            fillRule='evenodd'
            d='M35.963 28.023c1.736.042 3.46.175 5.115.436 1.962.32 3.763.8 5.374 1.45 1.611.671 2.942 1.522 3.983 2.563.68.68 1.211 1.45 1.571 2.291.37.85.55 1.791.52 2.822-.01 1.271-.4 2.282-1.14 3.023-.28.28-.62.5-.99.63-.381.14-.791.19-1.232.11l-5.594-.95a4.84 4.84 0 0 1-1.1-.3c-.301-.12-.561-.281-.751-.471a1.92 1.92 0 0 1-.5-.92c-.1-.361-.15-.791-.15-1.272l-.03-1.551c0-.22-.08-.4-.241-.56-.08-.08-.16-.14-.26-.2-.05-.024-.097-.042-.14-.06-.05-.02-.097-.039-.14-.06-.51-.15-1.251-.27-2.212-.35-.87-.064-1.773-.11-2.707-.127-.326.034-1.1.093-1.973.16-1.559.121-3.433.266-3.626.327a3.036 3.036 0 0 1-.13.05c-.04.015-.085.031-.13.05-.11.05-.2.12-.29.21-.171.17-.241.36-.241.58l-.01 1.511c0 .5-.05.93-.16 1.281-.09.37-.25.67-.5.92-.19.191-.43.351-.741.481-.31.13-.67.23-1.09.31l-5.665.961c-.44.08-.83.05-1.191-.09-.35-.15-.66-.34-.94-.62a3.594 3.594 0 0 1-.841-1.341c-.19-.53-.31-1.091-.34-1.702-.05-1.03.1-1.961.46-2.822a.05.05 0 0 0 .01-.02 7.147 7.147 0 0 1 1.561-2.312c1.02-1.02 2.352-1.87 3.993-2.531 1.641-.66 3.453-1.151 5.424-1.461.599-.088 3.274-.378 5.953-.446a.42.42 0 0 1 .092-.015c.147 0 .294.002.441.004.187-.003.374-.004.56-.004l-.002.015Z'
            clipRule='evenodd'
          />
        </svg>
      );
    case 'unmute-large':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='36'
          height='36'
          fill='none'
        >
          <g fill='#fff'>
            <path d='M27 25.125a1.125 1.125 0 0 1-.9-1.8 8.89 8.89 0 0 0 1.08-8.76c-.24-.57.03-1.23.6-1.47s1.23.03 1.47.6A11.183 11.183 0 0 1 27.9 24.69a1.136 1.136 0 0 1-.9.435Z' />
            <path d='M29.745 28.875a1.125 1.125 0 0 1-.9-1.8c3.21-4.275 3.915-10.005 1.845-14.94-.24-.57.03-1.23.6-1.47s1.23.03 1.47.6a17.427 17.427 0 0 1-2.115 17.16c-.21.3-.555.45-.9.45ZM21.06 19.44c.945-.945 2.565-.27 2.565 1.065V24.9c0 2.58-.93 4.515-2.595 5.445a4.5 4.5 0 0 1-2.205.555c-1.2 0-2.49-.405-3.81-1.23l-.96-.6c-.81-.51-.945-1.65-.27-2.325l7.275-7.305ZM32.655 3.345a1.159 1.159 0 0 0-1.635 0l-7.425 7.425c-.09-2.4-.99-4.2-2.58-5.085-1.68-.93-3.825-.69-6.015.675l-4.365 2.73c-.3.18-.645.285-.99.285H7.5c-3.63 0-5.625 1.995-5.625 5.625v6c0 3.63 1.995 5.625 5.625 5.625h.24l-4.41 4.41c-.45.45-.45 1.185 0 1.635.24.21.525.33.825.33.3 0 .585-.12.81-.345l27.69-27.69c.465-.45.465-1.17 0-1.62Z' />
          </g>
        </svg>
      );
    case 'mute-large':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '36'}
          height={h || '36'}
          fill='none'
          viewBox='0 0 36 36'
        >
          <path
            fill='#fff'
            d='M27 25.125a1.125 1.125 0 0 1-.9-1.8c2.355-3.135 2.355-7.515 0-10.65a1.125 1.125 0 0 1 1.8-1.35c2.94 3.93 2.94 9.42 0 13.35-.225.3-.555.45-.9.45Z'
          />
          <path
            fill='#fff'
            d='M29.745 28.875a1.125 1.125 0 0 1-.9-1.8c4.005-5.34 4.005-12.81 0-18.15a1.125 1.125 0 0 1 1.8-1.35c4.605 6.135 4.605 14.715 0 20.85-.21.3-.555.45-.9.45ZM21.03 5.67c-1.68-.93-3.825-.69-6.015.675l-4.38 2.745c-.3.18-.645.285-.99.285H7.5c-3.63 0-5.625 1.995-5.625 5.625v6c0 3.63 1.995 5.625 5.625 5.625h2.145c.345 0 .69.105.99.285l4.38 2.745c1.32.825 2.61 1.23 3.81 1.23a4.5 4.5 0 0 0 2.205-.555c1.665-.93 2.595-2.865 2.595-5.445v-13.77c0-2.58-.93-4.515-2.595-5.445Z'
          />
        </svg>
      );
    case 'video-camera-mute':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='36'
          height='36'
          fill='none'
        >
          <g fill='#fff'>
            <path d='M23.823 4.787a.985.985 0 0 1 1.39 0 .97.97 0 0 1 0 1.377L1.663 29.707A.966.966 0 0 1 .976 30c-.242 0-.497-.102-.688-.28a.985.985 0 0 1 0-1.39l1.56-1.56a5.404 5.404 0 0 1-.347-1.913V11.143C1.5 8.303 3.67 6 6.346 6h11.308c1.344 0 2.56.58 3.438 1.519l2.731-2.732ZM6.346 30c-.585 0-1.145-.11-1.664-.311L22.5 11.876v12.981c0 2.84-2.17 5.143-4.846 5.143H6.346Z' />
            <path
              fillRule='evenodd'
              d='M25.5 18v-4l3.214-3c.269-.209.509-.417.739-.617C30.324 9.626 31.045 9 32.57 9c1.286 0 1.929 1 1.929 2v14c0 1-.643 2-1.929 2-1.526 0-2.247-.626-3.118-1.383-.23-.2-.47-.408-.739-.617L25.5 22v-4Z'
              clipRule='evenodd'
            />
          </g>
        </svg>
      );
    case 'video-camera':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '36'}
          height={h || '36'}
          fill='none'
          viewBox='0 0 36 36'
        >
          <path
            fill='#fff'
            fillRule='evenodd'
            d='M6.346 6C3.67 6 1.5 8.303 1.5 11.143v13.714C1.5 27.697 3.67 30 6.346 30h11.308c2.676 0 4.846-2.302 4.846-5.143V11.143C22.5 8.303 20.33 6 17.654 6H6.346ZM25.5 18v-4l3.214-3c.269-.209.509-.417.739-.617C30.324 9.626 31.045 9 32.57 9c1.286 0 1.929 1 1.929 2v14c0 1-.643 2-1.929 2-1.526 0-2.247-.626-3.118-1.383-.23-.2-.47-.408-.739-.617L25.5 22v-4Z'
            clipRule='evenodd'
          />
        </svg>
      );
    case 'sing':
      return (
        <svg
          width='22'
          height='20'
          viewBox='0 0 22 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <circle cx='1' cy='10' r='1' fill='white' />
          <rect x='5' y='4' width='2' height='12' rx='1' fill='white' />
          <rect x='10' width='2' height='20' rx='1' fill='white' />
          <rect x='15' y='4' width='2' height='12' rx='1' fill='white' />
          <circle cx='21' cy='10' r='1' fill='white' />
        </svg>
      );
    case 'screen':
      return (
        <svg
          width='22'
          height='22'
          viewBox='0 0 22 22'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M7.38188 13.2891H8.85873V11.0739C8.85873 10.6833 8.99083 10.356 9.25502 10.0918C9.51922 9.82757 9.84658 9.69547 10.2371 9.69547H12.2309V11.4185L14.6923 8.95705L12.2309 6.49563V8.21862H10.2371C9.44401 8.21862 8.76985 8.49621 8.21465 9.0514C7.65947 9.60659 7.38188 10.2808 7.38188 11.0739V13.2891ZM0.908348 19.8611C0.699127 19.8611 0.523751 19.79 0.382219 19.6476C0.240688 19.5052 0.169922 19.3288 0.169922 19.1184C0.169922 18.908 0.240688 18.733 0.382219 18.5935C0.523751 18.454 0.699127 18.3843 0.908348 18.3843H21.092C21.3012 18.3843 21.4766 18.4555 21.6181 18.5978C21.7596 18.7402 21.8304 18.9166 21.8304 19.127C21.8304 19.3375 21.7596 19.5124 21.6181 19.6519C21.4766 19.7914 21.3012 19.8611 21.092 19.8611H0.908348ZM2.63134 16.9074C2.23751 16.9074 1.89292 16.7597 1.59755 16.4644C1.30218 16.169 1.15449 15.8244 1.15449 15.4306V3.61577C1.15449 3.22194 1.30218 2.87734 1.59755 2.58197C1.89292 2.2866 2.23751 2.13892 2.63134 2.13892H19.369C19.7628 2.13892 20.1074 2.2866 20.4028 2.58197C20.6982 2.87734 20.8458 3.22194 20.8458 3.61577V15.4306C20.8458 15.8244 20.6982 16.169 20.4028 16.4644C20.1074 16.7597 19.7628 16.9074 19.369 16.9074H2.63134Z'
            fill='white'
          />
        </svg>
      );
    case 'hand':
      return (
        <svg
          width='22'
          height='22'
          viewBox='0 0 22 22'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g clipPath='url(#clip0_23_9390)'>
            <path
              d='M11.9163 22C10.2511 22 8.81495 21.5722 7.60801 20.7167C6.40106 19.8611 5.53023 18.7229 4.99551 17.3021L2.65801 11.1833C2.61217 11.0611 2.5778 10.9351 2.55488 10.8052C2.53197 10.6753 2.52051 10.5417 2.52051 10.4042C2.52051 10.0069 2.67329 9.65556 2.97884 9.35C3.2844 9.04445 3.63579 8.89167 4.03301 8.89167C4.12467 8.89167 4.21252 8.89549 4.29655 8.90312C4.38058 8.91076 4.46079 8.92986 4.53717 8.96042L5.22467 9.14375C5.53023 9.22014 5.77086 9.32326 5.94655 9.45312C6.12224 9.58299 6.31704 9.81597 6.53092 10.1521V3.78125C6.53092 3.24653 6.7219 2.78819 7.10384 2.40625C7.48579 2.02431 7.94412 1.83333 8.47884 1.83333C8.66217 1.83333 8.83023 1.86007 8.98301 1.91354C9.13579 1.96701 9.27329 2.03958 9.39551 2.13125V1.94792C9.39551 1.41319 9.5903 0.954861 9.97988 0.572917C10.3695 0.190972 10.8316 0 11.3663 0C11.8552 0 12.2754 0.160417 12.6268 0.48125C12.9781 0.802083 13.192 1.17639 13.2684 1.60417C13.3295 1.52778 13.4594 1.47049 13.658 1.43229C13.8566 1.3941 14.04 1.375 14.208 1.375C14.7886 1.375 15.2584 1.59271 15.6174 2.02813C15.9764 2.46354 16.1559 2.94861 16.1559 3.48333V4.37708C16.2629 4.28542 16.4004 4.22049 16.5684 4.18229C16.7365 4.1441 16.9045 4.125 17.0726 4.125C17.6073 4.125 18.0656 4.31597 18.4476 4.69792C18.8295 5.07986 19.0205 5.53819 19.0205 6.07292V14.8958C19.0205 16.9889 18.3597 18.6962 17.0382 20.0177C15.7167 21.3392 14.0094 22 11.9163 22ZM11.9163 20.625C13.6275 20.625 15.0101 20.0941 16.0643 19.0323C17.1184 17.9705 17.6455 16.5917 17.6455 14.8958V6.07292C17.6455 5.90486 17.592 5.76736 17.4851 5.66042C17.3781 5.55347 17.2406 5.5 17.0726 5.5C16.9045 5.5 16.767 5.55347 16.6601 5.66042C16.5531 5.76736 16.4997 5.90486 16.4997 6.07292V11H14.7809V3.32292C14.7809 3.15486 14.7275 3.01736 14.6205 2.91042C14.5136 2.80347 14.3761 2.75 14.208 2.75C14.04 2.75 13.9025 2.80347 13.7955 2.91042C13.6886 3.01736 13.6351 3.15486 13.6351 3.32292V11H11.9163V1.94792C11.9163 1.77986 11.8629 1.64236 11.7559 1.53542C11.649 1.42847 11.5115 1.375 11.3434 1.375C11.1754 1.375 11.0379 1.42847 10.9309 1.53542C10.824 1.64236 10.7705 1.77986 10.7705 1.94792V11H9.05176V3.78125C9.05176 3.61319 8.99829 3.47569 8.89134 3.36875C8.7844 3.26181 8.6469 3.20833 8.47884 3.20833C8.31079 3.20833 8.17329 3.26181 8.06634 3.36875C7.9594 3.47569 7.90592 3.61319 7.90592 3.78125V13.5208H6.57676L5.72884 11.3667C5.57606 10.9694 5.38127 10.7135 5.14447 10.599C4.90766 10.4844 4.59829 10.3812 4.21634 10.2896C4.06356 10.259 3.96044 10.2743 3.90697 10.3354C3.85349 10.3965 3.85731 10.4958 3.91842 10.6333L6.30176 16.8208C6.74481 17.9667 7.43995 18.8872 8.38717 19.5823C9.3344 20.2774 10.5108 20.625 11.9163 20.625Z'
              fill='white'
            />
          </g>
          <defs>
            <clipPath id='clip0_23_9390'>
              <rect width='22' height='22' fill='white' />
            </clipPath>
          </defs>
        </svg>
      );
    case 'phone-red':
      return (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M2.17007 16.2229C1.95347 16.0064 1.779 15.7356 1.66468 15.4167C1.55037 15.0979 1.47817 14.7609 1.46012 14.3939C1.43004 13.7743 1.52029 13.2147 1.73688 12.6973C1.94746 12.1859 2.26031 11.7166 2.68146 11.2955C3.29514 10.6818 4.09533 10.1704 5.08202 9.77331C6.06872 9.37623 7.1577 9.08142 8.34294 8.89491C9.54021 8.7084 10.7555 8.61214 12.0009 8.60612C13.2463 8.61214 14.4617 8.7084 15.6469 8.89491C16.8261 9.08744 17.9091 9.37623 18.8777 9.7673C19.8524 10.1644 20.6526 10.6758 21.2783 11.3015C21.6874 11.7106 22.0063 12.1739 22.2229 12.6793C22.4455 13.1907 22.5538 13.7562 22.5357 14.3759C22.5297 15.14 22.2951 15.7476 21.8499 16.1929C21.6814 16.3613 21.4768 16.4937 21.2542 16.5719C21.0256 16.6561 20.7789 16.6862 20.5142 16.6381L17.151 16.0665C16.8923 16.0244 16.6757 15.9642 16.4892 15.886C16.3087 15.8138 16.1523 15.7176 16.038 15.6033C15.8936 15.4589 15.7913 15.2723 15.7372 15.0497C15.677 14.8331 15.6469 14.5744 15.6469 14.2856L15.6289 13.3531C15.6289 13.2207 15.5807 13.1124 15.4845 13.0162C15.4363 12.968 15.3882 12.9319 15.328 12.8959C15.2619 12.8658 15.2077 12.8477 15.1596 12.8237C14.8527 12.7334 14.4075 12.6612 13.8299 12.6131C13.2463 12.571 12.6387 12.5409 12.007 12.5349C11.3632 12.5409 10.7555 12.5589 10.1659 12.6071C9.58834 12.6552 9.14914 12.7334 8.83629 12.8297C8.79417 12.8477 8.74002 12.8658 8.67986 12.8898C8.61368 12.9199 8.55953 12.962 8.50538 13.0162C8.4031 13.1185 8.36099 13.2328 8.36099 13.3651L8.35497 14.2736C8.35497 14.5744 8.32489 14.8331 8.25871 15.0437C8.20456 15.2663 8.1083 15.4468 7.95789 15.5972C7.84357 15.7115 7.69918 15.8078 7.51267 15.886C7.32616 15.9642 7.10957 16.0244 6.85688 16.0725L3.45157 16.6501C3.18684 16.6982 2.9522 16.6802 2.73561 16.596C2.52504 16.5057 2.33853 16.3914 2.17007 16.2229Z'
            stroke='#EF4062'
            strokeWidth='1.5'
            stroke-miterlimit='10'
          />
        </svg>
      );
    case 'phone-red-all':
      return (
        <svg
          width='25'
          height='25'
          viewBox='0 0 25 25'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M22.8851 19.0937C22.8851 19.4687 22.8018 19.8541 22.6247 20.2291C22.4476 20.6041 22.2184 20.9583 21.9163 21.2916C21.4059 21.8541 20.8434 22.2603 20.208 22.5208C19.583 22.7812 18.9059 22.9166 18.1768 22.9166C17.1143 22.9166 15.9788 22.6666 14.7809 22.1562C13.583 21.6458 12.3851 20.9583 11.1976 20.0937C9.99967 19.2187 8.86426 18.2499 7.78092 17.177C6.70801 16.0937 5.73926 14.9583 4.87467 13.7708C4.02051 12.5833 3.33301 11.3958 2.83301 10.2187C2.33301 9.03117 2.08301 7.89575 2.08301 6.81242C2.08301 6.10409 2.20801 5.427 2.45801 4.802C2.70801 4.16659 3.10384 3.58325 3.65592 3.06242C4.32259 2.40617 5.05176 2.08325 5.82259 2.08325C6.11426 2.08325 6.40592 2.14575 6.66634 2.27075C6.93717 2.39575 7.17676 2.58325 7.36426 2.85409L9.78092 6.26034C9.96842 6.52075 10.1038 6.76034 10.1976 6.9895C10.2913 7.20825 10.3434 7.427 10.3434 7.62492C10.3434 7.87492 10.2705 8.12492 10.1247 8.3645C9.98926 8.60408 9.79134 8.85408 9.54134 9.10408L8.74967 9.927C8.63509 10.0416 8.58301 10.177 8.58301 10.3437C8.58301 10.427 8.59342 10.4999 8.61426 10.5833C8.64551 10.6666 8.67676 10.7291 8.69759 10.7916C8.88509 11.1353 9.20801 11.5833 9.66634 12.1249C10.1351 12.6666 10.6351 13.2187 11.1768 13.7708C11.7393 14.3228 12.2809 14.8333 12.833 15.302C13.3747 15.7603 13.8226 16.0728 14.1768 16.2603C14.2288 16.2812 14.2913 16.3124 14.3643 16.3437C14.4476 16.3749 14.5309 16.3853 14.6247 16.3853C14.8018 16.3853 14.9372 16.3228 15.0518 16.2083L15.8434 15.427C16.1038 15.1666 16.3538 14.9687 16.5934 14.8437C16.833 14.6978 17.0726 14.6249 17.333 14.6249C17.5309 14.6249 17.7393 14.6666 17.9684 14.7603C18.1976 14.8541 18.4372 14.9895 18.6976 15.1666L22.1455 17.6145C22.4163 17.802 22.6038 18.0208 22.7184 18.2812C22.8226 18.5416 22.8851 18.802 22.8851 19.0937Z'
            stroke='#EF4062'
            strokeWidth='1.5'
            stroke-miterlimit='10'
          />
          <path
            d='M16.9062 8.09375L20.5937 4.40625'
            stroke='#EF4062'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M20.5937 8.09375L16.9062 4.40625'
            stroke='#EF4062'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      );
    case 'microphone-close':
      return (
        <svg
          width={w || '18'}
          height={h || '18'}
          viewBox='0 0 18 18'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M12.3155 4.81498V5.68498L6.85555 11.145C6.13555 10.4925 5.68555 9.53248 5.68555 8.50498V4.81498C5.68555 3.26998 6.73555 1.98748 8.16055 1.61998C8.30305 1.58248 8.43805 1.70248 8.43805 1.84498V2.99998C8.43805 3.30748 8.69305 3.56248 9.00055 3.56248C9.30805 3.56248 9.56305 3.30748 9.56305 2.99998V1.84498C9.56305 1.70248 9.69805 1.58248 9.84055 1.61998C11.2655 1.98748 12.3155 3.26998 12.3155 4.81498Z'
            fill='white'
          />
          <path
            d='M14.8578 7.35759V8.55009C14.8578 11.6026 12.5103 14.1151 9.52531 14.3776V15.9751C9.52531 16.2676 9.29281 16.5001 9.00031 16.5001C8.70781 16.5001 8.47531 16.2676 8.47531 15.9751V14.3776C7.65781 14.3026 6.88531 14.0626 6.19531 13.6801L6.96781 12.9076C7.58281 13.1926 8.27281 13.3576 9.00031 13.3576C11.6553 13.3576 13.8153 11.1976 13.8153 8.55009V7.35759C13.8153 7.07259 14.0478 6.84009 14.3403 6.84009C14.6253 6.84009 14.8578 7.07259 14.8578 7.35759Z'
            fill='white'
          />
          <path
            d='M12.3147 7.56006V8.64756C12.3147 10.5826 10.6497 12.1351 8.66969 11.9476C8.45969 11.9251 8.24969 11.8876 8.05469 11.8201L12.3147 7.56006Z'
            fill='white'
          />
          <path
            d='M16.3273 1.67241C16.1023 1.44741 15.7348 1.44741 15.5098 1.67241L5.42234 11.7599C4.64984 10.9124 4.18484 9.78741 4.18484 8.54991V7.35741C4.18484 7.07241 3.95234 6.83991 3.65984 6.83991C3.37484 6.83991 3.14234 7.07241 3.14234 7.35741V8.54991C3.14234 10.0724 3.72734 11.4599 4.67984 12.5024L1.66484 15.5174C1.43984 15.7424 1.43984 16.1099 1.66484 16.3349C1.78484 16.4399 1.92734 16.4999 2.07734 16.4999C2.22734 16.4999 2.36984 16.4399 2.48234 16.3274L16.3273 2.48241C16.5598 2.25741 16.5598 1.89741 16.3273 1.67241Z'
            fill='white'
          />
        </svg>
      );
    case 'users-black':
      return (
        <svg
          width='44'
          height='44'
          viewBox='0 0 44 44'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <rect width='44' height='44' rx='22' fill='white' />
          <path
            d='M11.8711 29.3333V27.1791C11.8711 26.6444 12.0086 26.1593 12.2836 25.7239C12.5586 25.2885 12.9405 24.9639 13.4294 24.75C14.5447 24.2611 15.5492 23.9097 16.443 23.6958C17.3367 23.4819 18.2572 23.375 19.2044 23.375C20.1516 23.375 21.0683 23.4819 21.9544 23.6958C22.8405 23.9097 23.8412 24.2611 24.9565 24.75C25.4454 24.9639 25.8312 25.2885 26.1138 25.7239C26.3964 26.1593 26.5378 26.6444 26.5378 27.1791V29.3333H11.8711ZM27.9128 29.3333V27.1791C27.9128 26.2166 27.6683 25.426 27.1794 24.8073C26.6905 24.1885 26.0489 23.6882 25.2544 23.3062C26.3086 23.4284 27.3016 23.608 28.2336 23.8448C29.1655 24.0816 29.9218 24.3527 30.5023 24.6583C31.0065 24.9486 31.4037 25.3076 31.694 25.7354C31.9843 26.1632 32.1294 26.6444 32.1294 27.1791V29.3333H27.9128ZM19.2044 21.9771C18.1961 21.9771 17.3711 21.6562 16.7294 21.0146C16.0878 20.3729 15.7669 19.5479 15.7669 18.5396C15.7669 17.5312 16.0878 16.7062 16.7294 16.0646C17.3711 15.4229 18.1961 15.1021 19.2044 15.1021C20.2128 15.1021 21.0378 15.4229 21.6794 16.0646C22.3211 16.7062 22.6419 17.5312 22.6419 18.5396C22.6419 19.5479 22.3211 20.3729 21.6794 21.0146C21.0378 21.6562 20.2128 21.9771 19.2044 21.9771ZM27.4544 18.5396C27.4544 19.5479 27.1336 20.3729 26.4919 21.0146C25.8503 21.6562 25.0253 21.9771 24.0169 21.9771C23.8489 21.9771 23.6617 21.9656 23.4555 21.9427C23.2492 21.9198 23.0621 21.8777 22.894 21.8166C23.2607 21.4347 23.5395 20.9649 23.7305 20.4073C23.9214 19.8496 24.0169 19.2271 24.0169 18.5396C24.0169 17.8521 23.9214 17.2448 23.7305 16.7177C23.5395 16.1906 23.2607 15.7055 22.894 15.2625C23.0621 15.2166 23.2492 15.1784 23.4555 15.1479C23.6617 15.1173 23.8489 15.1021 24.0169 15.1021C25.0253 15.1021 25.8503 15.4229 26.4919 16.0646C27.1336 16.7062 27.4544 17.5312 27.4544 18.5396ZM13.2461 27.9583H25.1628V27.1791C25.1628 26.9347 25.0902 26.6979 24.9451 26.4687C24.7999 26.2396 24.6204 26.0791 24.4065 25.9875C23.3065 25.4986 22.3822 25.1701 21.6336 25.0021C20.885 24.834 20.0753 24.75 19.2044 24.75C18.3336 24.75 17.5201 24.834 16.7638 25.0021C16.0076 25.1701 15.0794 25.4986 13.9794 25.9875C13.7655 26.0791 13.5898 26.2396 13.4523 26.4687C13.3148 26.6979 13.2461 26.9347 13.2461 27.1791V27.9583ZM19.2044 20.6021C19.8003 20.6021 20.293 20.4073 20.6826 20.0177C21.0721 19.6281 21.2669 19.1354 21.2669 18.5396C21.2669 17.9437 21.0721 17.451 20.6826 17.0614C20.293 16.6718 19.8003 16.4771 19.2044 16.4771C18.6086 16.4771 18.1159 16.6718 17.7263 17.0614C17.3367 17.451 17.1419 17.9437 17.1419 18.5396C17.1419 19.1354 17.3367 19.6281 17.7263 20.0177C18.1159 20.4073 18.6086 20.6021 19.2044 20.6021Z'
            fill='#070708'
          />
        </svg>
      );
    case 'user-blue':
      return (
        <svg
          className={className}
          width='56'
          height='56'
          viewBox='0 0 56 56'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g filter='url(#filter0_d_188_4382)'>
            <rect x='3' y='2' width='50' height='50' rx='25' fill='#0A49A5' />
          </g>
          <path
            d='M35.4094 35.5496H30.8496'
            stroke='white'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M33.1289 37.8295V33.2698'
            stroke='white'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M28.1822 25.7118C28.0682 25.7004 27.9314 25.7004 27.8061 25.7118C25.093 25.6206 22.9385 23.3978 22.9385 20.6619C22.9271 17.8691 25.1956 15.6006 27.9884 15.6006C30.7813 15.6006 33.0498 17.8691 33.0498 20.6619C33.0498 23.3978 30.8839 25.6206 28.1822 25.7118Z'
            stroke='white'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M27.9881 38.1829C25.9134 38.1829 23.8501 37.6585 22.277 36.6098C19.5183 34.7631 19.5183 31.7536 22.277 29.9183C25.4118 27.8208 30.5529 27.8208 33.6878 29.9183'
            stroke='white'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <defs>
            <filter
              id='filter0_d_188_4382'
              x='0'
              y='0'
              width='56'
              height='56'
              filterUnits='userSpaceOnUse'
              color-interpolation-filters='sRGB'
            >
              <feFlood flood-opacity='0' result='BackgroundImageFix' />
              <feColorMatrix
                in='SourceAlpha'
                type='matrix'
                values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
                result='hardAlpha'
              />
              <feOffset dy='1' />
              <feGaussianBlur stdDeviation='1.5' />
              <feColorMatrix
                type='matrix'
                values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0'
              />
              <feBlend
                mode='normal'
                in2='BackgroundImageFix'
                result='effect1_dropShadow_188_4382'
              />
              <feBlend
                mode='normal'
                in='SourceGraphic'
                in2='effect1_dropShadow_188_4382'
                result='shape'
              />
            </filter>
          </defs>
        </svg>
      );
    case 'people':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '18'}
          height={h || '18'}
          fill='none'
          viewBox='0 0 18 18'
        >
          <g
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.2'
          >
            <path d='M13.5 5.37a.454.454 0 0 0-.142 0 1.93 1.93 0 0 1-1.86-1.935A1.935 1.935 0 1 1 13.5 5.37ZM12.728 10.83c1.027.173 2.16-.007 2.955-.54 1.057-.705 1.057-1.86 0-2.565-.803-.532-1.95-.712-2.978-.532M4.477 5.37a.454.454 0 0 1 .143 0 1.93 1.93 0 0 0 1.86-1.935A1.935 1.935 0 1 0 4.477 5.37ZM5.25 10.83c-1.027.173-2.16-.007-2.955-.54-1.057-.705-1.057-1.86 0-2.565.803-.532 1.95-.712 2.978-.532M9 10.973a.454.454 0 0 0-.142 0 1.93 1.93 0 0 1-1.86-1.935 1.935 1.935 0 1 1 3.87 0c-.008 1.05-.833 1.905-1.868 1.934ZM6.818 13.335c-1.058.705-1.058 1.86 0 2.565 1.2.803 3.165.803 4.364 0 1.058-.705 1.058-1.86 0-2.565-1.192-.795-3.164-.795-4.364 0Z' />
          </g>
        </svg>
      );
    case 'plus':
      return (
        <svg
          width='12'
          height='12'
          viewBox='0 0 12 12'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M1 6H11'
            stroke='white'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M6 11V1'
            stroke='#FBFBFB'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      );
    case 'minus':
      return (
        <svg
          width='12'
          height='2'
          viewBox='0 0 12 2'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M1 1H11'
            stroke='#625DDA'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      );
    case 'minus-outline':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          fill='none'
          viewBox='0 0 25 25'
        >
          <g
            stroke='#EF4062'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
          >
            <path d='M12.417 22.917c5.729 0 10.416-4.688 10.416-10.417 0-5.73-4.687-10.417-10.416-10.417C6.687 2.083 2 6.771 2 12.5c0 5.73 4.688 10.417 10.417 10.417ZM8.25 12.5h8.333' />
          </g>
        </svg>
      );
    case 'grouped':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          fill='none'
          viewBox='0 0 25 25'
        >
          <g fill='#0A49A5' fillRule='evenodd' clipRule='evenodd'>
            <path d='M21.705 2.083c.67 0 1.212.553 1.212 1.234v6.908c0 .681-.543 1.234-1.212 1.234h-4.36a.733.733 0 0 1-.727-.74c0-.41.325-.74.727-.74h4.118V3.563H3.537v6.414h4.118c.401 0 .727.332.727.74 0 .41-.326.74-.727.74h-4.36a1.223 1.223 0 0 1-1.212-1.233V3.317c0-.681.542-1.234 1.211-1.234h18.411ZM21.705 13.541c.67 0 1.212.553 1.212 1.234v6.908c0 .681-.543 1.233-1.212 1.233H3.295a1.223 1.223 0 0 1-1.212-1.233v-6.908c0-.681.542-1.234 1.211-1.234h4.36c.402 0 .728.332.728.74 0 .41-.326.74-.727.74H3.537v6.415h17.926v-6.414h-4.118a.734.734 0 0 1-.727-.74c0-.41.325-.74.727-.74h4.36Z' />
            <path d='M12.5 13.541c.575 0 1.041.332 1.041.74v7.895c0 .41-.466.74-1.041.74s-1.042-.33-1.042-.74v-7.894c0-.41.466-.74 1.042-.74ZM12.5 2.083c.575 0 1.041.35 1.041.782v7.812c0 .432-.466.782-1.041.782s-1.042-.35-1.042-.782V2.865c0-.432.466-.782 1.042-.782Z' />
            <path d='M15.406 17.473a.71.71 0 0 1-1.057 0l-.792-.853-1.057-1.137-1.85 1.99a.71.71 0 0 1-1.056 0 .848.848 0 0 1 0-1.137l.792-.853 1.586-1.706a.71.71 0 0 1 1.056 0l1.585 1.706.793.852a.848.848 0 0 1 0 1.138ZM15.406 7.527a.848.848 0 0 1 0 1.137l-2.378 2.559a.722.722 0 0 1-.528.235.721.721 0 0 1-.528-.235l-1.586-1.706-.792-.853a.848.848 0 0 1 0-1.137.71.71 0 0 1 1.057 0l.792.853L12.5 9.517l1.85-1.99a.71.71 0 0 1 1.056 0Z' />
          </g>
        </svg>
      );
    case 'ungrouped':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          fill='none'
          viewBox='0 0 25 25'
        >
          <g fill='#0A49A5' fillRule='evenodd' clipRule='evenodd'>
            <path d='M21.463 3.564h-4.118a.733.733 0 0 1-.727-.74c0-.41.325-.74.727-.74h4.36c.67 0 1.212.552 1.212 1.233v6.908c0 .681-.543 1.234-1.212 1.234H3.295a1.223 1.223 0 0 1-1.212-1.234V3.317c0-.681.542-1.234 1.211-1.234h4.36c.402 0 .728.332.728.74 0 .41-.326.74-.727.74H3.537v6.415h17.926V3.564ZM21.463 15.022H3.537v6.414h4.118c.401 0 .727.332.727.74 0 .41-.326.74-.727.74h-4.36a1.223 1.223 0 0 1-1.212-1.233v-6.908c0-.681.542-1.234 1.211-1.234h18.411c.67 0 1.212.553 1.212 1.234v6.908c0 .681-.543 1.233-1.212 1.233h-4.36a.733.733 0 0 1-.727-.74c0-.408.325-.74.727-.74h4.118v-6.414Z' />
            <path d='M12.505 13.541c.573 0 1.037.332 1.036.741l-.009 7.895c0 .409-.465.74-1.038.74-.572 0-1.036-.333-1.036-.741l.01-7.895c0-.409.464-.74 1.037-.74ZM12.505 11.459c-.573 0-1.037-.331-1.038-.74l-.009-7.895c0-.409.464-.74 1.036-.74.573 0 1.038.33 1.038.739l.01 7.895c0 .409-.464.74-1.037.74Z' />
            <path d='M15.406 18.985a.848.848 0 0 1 0 1.138l-.792.852-1.586 1.706a.71.71 0 0 1-1.056 0l-2.378-2.558a.848.848 0 0 1 0-1.138.71.71 0 0 1 1.057 0l.792.853 1.057 1.137 1.85-1.99a.71.71 0 0 1 1.056 0ZM15.406 6.015a.71.71 0 0 1-1.057 0L12.5 4.025l-1.85 1.99a.71.71 0 0 1-1.056 0 .848.848 0 0 1 0-1.137l2.378-2.559c.14-.15.33-.236.528-.236s.388.085.528.236l2.378 2.559a.848.848 0 0 1 0 1.137Z' />
          </g>
        </svg>
      );
    case 'previous':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          fill='none'
          viewBox='0 0 24 24'
        >
          <path
            fill='#0A49A5'
            d='M20.24 7.22v9.57c0 1.96-2.13 3.19-3.83 2.21l-4.15-2.39-4.15-2.4c-1.7-.98-1.7-3.43 0-4.41l4.15-2.4 4.15-2.39c1.7-.98 3.83.24 3.83 2.21ZM3.76 18.93c-.41 0-.75-.34-.75-.75V5.82c0-.41.34-.75.75-.75s.75.34.75.75v12.36c0 .41-.34.75-.75.75Z'
          />
        </svg>
      );
    case 'next':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          fill='none'
          viewBox='0 0 24 24'
        >
          <path
            fill='#0A49A5'
            d='M3.76 7.22v9.57c0 1.96 2.13 3.19 3.83 2.21l4.15-2.39 4.15-2.4c1.7-.98 1.7-3.43 0-4.41l-4.15-2.4-4.15-2.39c-1.7-.98-3.83.24-3.83 2.21ZM20.24 18.93c-.41 0-.75-.34-.75-.75V5.82c0-.41.34-.75.75-.75s.75.34.75.75v12.36c0 .41-.33.75-.75.75Z'
          />
        </svg>
      );
    case 'top_up':
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
            d='M9.5 13.75c0 .97.75 1.75 1.67 1.75h1.88c.8 0 1.45-.68 1.45-1.53 0-.91-.4-1.24-.99-1.45l-3.01-1.05c-.59-.21-.99-.53-.99-1.45 0-.84.65-1.53 1.45-1.53h1.88c.92 0 1.67.78 1.67 1.75M12 7.5v9'
          />
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2'
          />
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M17 3v4h4M22 2l-5 5'
          />
        </svg>
      );
    case 'transfer_out':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          fill='none'
        >
          <g
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
          >
            <path d='M9.5 13.75c0 .97.75 1.75 1.67 1.75h1.88c.8 0 1.45-.68 1.45-1.53 0-.91-.4-1.24-.99-1.45l-3.01-1.05c-.59-.21-.99-.53-.99-1.45 0-.84.65-1.53 1.45-1.53h1.88c.92 0 1.67.78 1.67 1.75M12 7.5v9' />
            <path d='M22 12c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2M22 6V2h-4M17 7l5-5' />
          </g>
        </svg>
      );
    case 'media_sale':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          fill='none'
          viewBox='0 0 24 24'
        >
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M12.615 18.38c0 2.368-1.928 4.287-4.307 4.287-2.38 0-4.308-1.92-4.308-4.286 0-2.367 1.929-4.286 4.308-4.286 2.379 0 4.307 1.919 4.307 4.286Zm0 0v-10m0 1.43V2.665l.862 1.143a11.507 11.507 0 0 0 9.19 4.572'
          />
        </svg>
      );
    case 'transfer':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='50'
          height='50'
          fill='none'
          viewBox='0 0 50 50'
        >
          <path
            fill='#000'
            d='M15.462 38.855h4.62l.803 2.576h2.84l-4.412-12.517h-3.015L11.84 41.432h2.753l.87-2.578Zm2.302-7.115h.035l1.55 4.95h-3.19l1.605-4.95Zm-6.684 5.983c0-1.239-.4-2.459-1.934-3.032.522-.26 1.534-.766 1.534-2.564 0-1.29-.784-3.21-3.854-3.21H.742v12.52h5.301c2.564 0 3.243-.436 3.957-1.137a3.637 3.637 0 0 0 1.08-2.577Zm-7.826-6.64h3c1.184 0 1.917.312 1.917 1.34 0 .996-.817 1.396-1.85 1.396H3.254v-2.737Zm3.206 8.19H3.254v-3.348h3.33c.943 0 1.882.424 1.882 1.517-.001 1.27-.734 1.831-2.006 1.831Zm37.394-5.23 5.404 7.388h-3.365l-3.87-5.492-1.22 1.256v4.236h-2.615V28.914h2.615v5.09l4.779-5.09h3.38l-5.108 5.129Zm-32.013 14.34c0-1.197-.288-1.394-.814-1.625.634-.214.992-.818.992-1.53 0-.552-.311-1.81-2.017-1.81H6.759v6.412h1.315v-2.508h1.383c.992 0 1.046.34 1.046 1.213 0 .659.052.993.141 1.293h1.483v-.167c-.286-.108-.286-.342-.286-1.278ZM9.64 46.244H8.073v-1.718H9.74c.784 0 .937.496.937.839-.001.63-.339.88-1.038.88Zm4.346-28.287c-.01-.287-.019-.634-.031-1.034-.025-.406.08-.847.121-1.345.052-.5.12-1.042.308-1.595.16-.558.299-1.17.605-1.74.134-.295.272-.596.415-.9.15-.297.358-.568.538-.86.355-.6.814-1.128 1.284-1.656.455-.551 1.016-.972 1.526-1.458.561-.396 1.096-.856 1.669-1.18.564-.355 1.12-.674 1.669-.937.54-.292 1.076-.489 1.565-.707a25.192 25.192 0 0 1 1.981-.685c-.231-.568-.43-1.16-.576-1.792-.155-.65-.286-1.313-.299-2.068.727.203 1.334.498 1.926.808.59.312 1.127.66 1.63 1.039 1.015.748 1.88 1.612 2.664 2.538.595.702.646 1.681.204 2.43l-.092.153a16.038 16.038 0 0 1-2.615 3.328 12.71 12.71 0 0 1-1.71 1.406 19.3 19.3 0 0 1-.988.617 9.195 9.195 0 0 1-1.13.525 8.684 8.684 0 0 1 .01-1.245c.039-.393.089-.777.15-1.157.134-.748.326-1.459.573-2.135.025-.074.055-.142.083-.214-.24.03-.49.062-.763.101-.423.09-.909.153-1.392.294-.497.112-1.004.27-1.52.458-.54.16-1.025.434-1.575.654-.482.299-1.04.544-1.498.908-.48.347-.964.697-1.36 1.13-.202.209-.437.401-.62.624l-.518.685c-.378.436-.61.94-.867 1.408-.281.459-.452.937-.598 1.385-.138.449-.336.855-.394 1.238l-.19.993c-.102.558-.163.878-.163.878s-.005-.325-.022-.892ZM.744 43.418h5.215v1.139H4.017v5.276H2.68v-5.276H.744v-1.139Zm14.073 0-2.286 6.412h1.413l.445-1.324h2.365l.413 1.324h1.456l-2.258-6.412h-1.548Zm-.069 3.982.824-2.534h.012l.8 2.534h-1.636ZM26.59 21.783c-.533.308-1.062.524-1.544.755-.748.315-1.409.562-1.959.742.25.56.464 1.148.631 1.775.168.645.32 1.304.36 2.056-.736-.18-1.352-.458-1.95-.749a11.79 11.79 0 0 1-1.662-.989c-1.035-.717-1.925-1.556-2.737-2.457a2.102 2.102 0 0 1-.279-2.423l.09-.153a16.03 16.03 0 0 1 2.513-3.405 12.75 12.75 0 0 1 1.663-1.457c.314-.222.634-.438.97-.646.345-.203.71-.392 1.114-.557.039.431.045.845.025 1.243-.028.394-.064.78-.113 1.161a13.126 13.126 0 0 1-.51 2.153c-.024.073-.054.142-.076.216.238-.036.49-.077.76-.125.421-.102.903-.178 1.38-.335.493-.126.997-.298 1.505-.503.536-.173 1.013-.464 1.553-.7.475-.314 1.028-.573 1.47-.951.47-.36.944-.727 1.325-1.169.202-.215.427-.415.606-.642.166-.237.333-.472.495-.701.366-.449.583-.958.824-1.433.269-.469.423-.95.553-1.403.125-.453.31-.864.358-1.248.06-.386.112-.722.157-.998.096-.561.141-.882.141-.882s.025.322.055.888c.015.287.034.636.06 1.034.035.405-.05.85-.084 1.348-.034.5-.09 1.046-.259 1.602-.144.56-.266 1.178-.553 1.756-.125.298-.256.603-.387.91-.144.304-.34.58-.511.879-.338.61-.778 1.15-1.233 1.692-.44.562-.988 1.003-1.483 1.5-.551.415-1.073.89-1.635 1.23a15.38 15.38 0 0 1-1.633.986Zm5.317 21.635h4.561v1.139h-3.221v1.447h2.822v1.134h-2.822v2.696h-1.34v-6.416Zm-8.506 0h1.252v6.412H23.31l-2.616-4.573h-.02v4.573h-1.248v-6.412h1.409l2.548 4.464h.016l.001-4.464Zm25.01 4.965c0-1.197-.29-1.394-.814-1.625.63-.214.995-.818.995-1.53 0-.552-.314-1.81-2.02-1.81h-3.24v6.412h1.315v-2.508h1.383c.989 0 1.046.34 1.046 1.213 0 .659.052.993.143 1.293h1.478v-.167c-.286-.108-.286-.342-.286-1.278Zm-2.197-2.139h-1.569v-1.718h1.666c.787 0 .94.496.94.839 0 .63-.339.88-1.037.88Zm-15.33 1.658c0 1.923-1.968 2.098-2.527 2.098-2.34 0-2.739-1.345-2.739-2.144h1.281c.01.358.19 1.036 1.361 1.036.63 0 1.337-.156 1.337-.826 0-.503-.484-.634-1.16-.799l-.686-.162c-1.038-.237-2.036-.473-2.036-1.886 0-.714.383-1.971 2.464-1.971 1.965 0 2.49 1.284 2.5 2.07h-1.282c-.036-.286-.143-.963-1.315-.963-.506 0-1.117.186-1.117.766 0 .5.412.608.681.672l1.56.384c.873.212 1.677.573 1.677 1.725Zm7.797.794h3.554v1.137h-4.867V43.42h4.717v1.138H38.68v1.346h3.124v1.134H38.68v1.657Zm-10.958-7.259h-2.44V28.918h2.754l4.97 8.716h.034v-8.716h2.44v12.52h-2.612l-5.11-8.925h-.033l-.003 8.924Z'
          />
        </svg>
      );
    case 'my_balance':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '79'}
          height={h || '24'}
          fill='none'
          viewBox='0 0 79 24'
        >
          <path
            fill='#070708'
            fillRule='evenodd'
            d='M35.473 0h1.254l3.398 9.85L43.523 0h3.562v13.415h-2.726V9.6l.271-6.23-3.578 10.045h-1.854L35.62 3.37l.27 6.23v3.815h-2.716V0H35.473Zm15.72 0 2.762 6.118L56.717 0h2.97l-4.351 8.532v4.883h-2.763V8.532L48.213 0h2.98Zm-17.12 20.53h-.066v2.349h1.434c.286 0 .524-.048.716-.143a.994.994 0 0 0 .43-.405c.097-.174.146-.377.146-.609 0-.242-.042-.452-.126-.63a.876.876 0 0 0-.4-.414c-.18-.099-.418-.148-.71-.148h-1.424Zm-.066-3.061v2.124h1.242c.276 0 .51-.041.701-.123a.974.974 0 0 0 .445-.363c.1-.16.151-.354.151-.579 0-.249-.047-.452-.141-.609a.81.81 0 0 0-.434-.343 2.134 2.134 0 0 0-.737-.107h-1.227Zm2.948 2.451a1.87 1.87 0 0 1-.2.099c.173.045.328.111.462.198.263.168.458.384.586.65.128.267.192.553.192.86 0 .475-.103.872-.308 1.193-.202.32-.493.565-.873.732-.38.164-.838.246-1.373.246H32.74v-7.453h2.494a4.5 4.5 0 0 1 1.08.118c.32.078.59.201.813.368.225.164.395.372.51.625.117.252.176.552.176.9 0 .308-.072.59-.217.845a1.662 1.662 0 0 1-.641.62Zm5.728-3.475h-1.151l-2.766 7.453h1.327l.594-1.746h2.845l.594 1.746h1.333l-2.776-7.453Zm.502 4.689h-2.152l1.075-3.162 1.077 3.162Zm7.855 1.745v1.019h-4.603v-7.453h1.267v6.434h3.337Zm4.492-6.434H54.38l-2.766 7.453h1.327l.593-1.746h2.846l.594 1.746h1.333l-2.776-7.453Zm.502 4.689h-2.152l1.074-3.162 1.078 3.162Zm9.082-4.689v7.453h-1.267l-3.296-5.34v5.34h-1.267v-7.453h1.267l3.306 5.349v-5.349h1.257Zm6.005 5.026h1.263c-.04.488-.175.924-.404 1.306-.23.378-.55.677-.965.895-.413.219-.916.328-1.509.328-.454 0-.863-.082-1.226-.246a2.692 2.692 0 0 1-.934-.706 3.208 3.208 0 0 1-.596-1.11 4.89 4.89 0 0 1-.202-1.454v-.62c0-.536.07-1.02.207-1.454.142-.433.343-.803.606-1.11.262-.31.577-.548.944-.712a3.05 3.05 0 0 1 1.247-.245c.585 0 1.08.109 1.484.327.403.219.716.52.939.906.225.386.363.828.413 1.326h-1.261a2.393 2.393 0 0 0-.222-.824 1.154 1.154 0 0 0-.495-.522c-.219-.123-.505-.185-.858-.185-.29 0-.542.055-.758.164-.215.11-.395.27-.54.481a2.337 2.337 0 0 0-.328.784c-.07.307-.106.658-.106 1.054v.63c0 .375.032.716.096 1.023.068.304.168.565.303.783.138.219.313.388.525.507.212.12.466.18.762.18.36 0 .651-.059.873-.175.226-.116.396-.285.51-.506.118-.226.196-.5.233-.825ZM78.5 22.88v1.019h-4.811v-7.453h4.786v1.024h-3.519v2.088h3.034v1.003h-3.034v2.319H78.5ZM22.985 8.254c.79 0 1.435-.623 1.435-1.383 0-2.64-2.225-4.784-4.963-4.784H5.45C2.713 2.087.5 4.219.5 6.859v.012c0 .76.646 1.383 1.435 1.383h21.05ZM.5 17.14v-5.775c0-.76.646-1.383 1.435-1.383h21.05c.79 0 1.435.622 1.435 1.383v5.763c0 2.64-2.225 4.784-4.963 4.784H5.45C2.713 21.913.5 19.781.5 17.141Zm4.784.91h2.392c.49 0 .897-.391.897-.864s-.407-.864-.897-.864H5.284c-.49 0-.897.392-.897.864 0 .473.407.865.897.865Zm5.382 0h4.784c.49 0 .897-.391.897-.864s-.407-.864-.897-.864h-4.784c-.49 0-.897.392-.897.864 0 .473.407.865.897.865Z'
            clipRule='evenodd'
          />
        </svg>
      );
    case 'withdraw':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='25'
          fill='none'
          viewBox='0 0 24 25'
        >
          <g
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
          >
            <path
              strokeMiterlimit='10'
              d='M3.93 16.7 15.88 4.75M11.102 19.1l1.2-1.2M13.797 16.409l2.39-2.39'
            />
            <path d='m3.601 11.06 6.64-6.64c2.12-2.12 3.18-2.13 5.28-.03l4.91 4.91c2.1 2.1 2.09 3.16-.03 5.28l-6.64 6.64c-2.12 2.12-3.18 2.13-5.28.03l-4.91-4.91c-2.1-2.1-2.1-3.15.03-5.28ZM2 22.819h20' />
          </g>
        </svg>
      );
    case 'fly-outline':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='26'
          height='25'
          fill='none'
          viewBox='0 0 26 25'
        >
          <path
            fill='#929298'
            fillRule='evenodd'
            d='M23.776 12.5c0 5.951-4.825 10.776-10.776 10.776S2.224 18.45 2.224 12.5 7.05 1.724 13 1.724 23.776 6.55 23.776 12.5Zm1.724 0C25.5 19.404 19.904 25 13 25S.5 19.404.5 12.5 6.096 0 13 0s12.5 5.596 12.5 12.5Zm-10.63 2.095-2.072 3.885c-.304.431-1.078 1.133-1.741-.81-.32-.938-1.005-2.795-1.685-4.64-.56-1.52-1.116-3.032-1.466-4.02-.248-.647.066-1.585 1.327-1.132 1.26.453 6.494 2.239 8.954 3.075 1.492.567 1.74 1.23.414 1.942-1.326.713-3.04 1.43-3.73 1.7Z'
            clipRule='evenodd'
          />
        </svg>
      );
    case 'fly-outline-empty':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          fill='none'
          viewBox='0 0 24 24'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='m16.15 12.83-1.73.58c-.48.16-.85.53-1.01 1.01l-.58 1.73c-.49 1.49-2.59 1.46-3.05-.03L7.83 9.84c-.38-1.25.77-2.4 2-2.02l6.29 1.95c1.49.47 1.51 2.57.03 3.06Z'
          />
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z'
          />
        </svg>
      );
    case 'fly-subscribe':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          fill='none'
        >
          <path
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='m9.906 4.406 8.917 4.459c4 2 4 5.27 0 7.27l-8.917 4.459c-6 3-8.448.541-5.448-5.448l.907-1.802c.229-.458.229-1.219 0-1.677l-.907-1.813c-3-5.99-.541-8.448 5.448-5.448ZM5.667 12.5h5.624'
          />
        </svg>
      );
    case 'logout':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          fill='none'
          viewBox='0 0 25 25'
        >
          <g
            stroke='#EF4062'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
          >
            <path d='M15.729 17.125c-.323 3.75-2.25 5.281-6.469 5.281h-.135c-4.656 0-6.521-1.864-6.521-6.52V9.093c0-4.656 1.865-6.521 6.52-6.521h.136c4.188 0 6.115 1.51 6.459 5.198M9.375 12.5h11.854M18.906 15.99l3.49-3.49-3.49-3.49' />
          </g>
        </svg>
      );
    case 'sticker':
      return (
        <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 25 25'>
          <g
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
          >
            <path d='M22.844 13.395c-.021.198-.052.386-.104.573a6.208 6.208 0 0 0-4.021-1.469 6.255 6.255 0 0 0-6.25 6.25c0 1.532.552 2.938 1.469 4.021a3.478 3.478 0 0 1-.573.105c-.886.083-1.792.041-2.73-.115-4.28-.73-7.729-4.198-8.437-8.49A10.427 10.427 0 0 1 14.24 2.23c4.291.708 7.76 4.156 8.49 8.437.155.938.197 1.844.114 2.73Z' />
            <path d='M22.74 13.969a3.11 3.11 0 0 1-.802 1.354l-6.646 6.646a3.11 3.11 0 0 1-1.354.802 6.208 6.208 0 0 1-1.47-4.021 6.255 6.255 0 0 1 6.25-6.25c1.532 0 2.938.552 4.022 1.469Z' />
          </g>
        </svg>
      );
    case 'location':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='25'
          fill='none'
        >
          <g stroke='#929298' strokeWidth='1.5'>
            <path d='M12 13.93a3.12 3.12 0 1 0 .001-6.24 3.12 3.12 0 0 0 0 6.24Z' />
            <path d='M3.62 8.99C5.59.33 18.42.34 20.38 9c1.15 5.08-2.01 9.38-4.78 12.04a5.193 5.193 0 0 1-7.21 0c-2.76-2.66-5.92-6.97-4.77-12.05Z' />
          </g>
        </svg>
      );
    case 'global':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='25'
          fill='none'
        >
          <g
            stroke='#929298'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
          >
            <path d='M12 22.5c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10Z' />
            <path d='M8 3.5h1a28.424 28.424 0 0 0 0 18H8M15 3.5a28.424 28.424 0 0 1 0 18' />
            <path d='M3 16.5v-1a28.424 28.424 0 0 0 18 0v1M3 9.5a28.424 28.424 0 0 1 18 0' />
          </g>
        </svg>
      );
    case 'medal-star':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '24'}
          height={h || '25'}
          fill='none'
          viewBox='0 0 24 25'
        >
          <g
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
          >
            <path d='M19 9.14c0 1.45-.43 2.78-1.17 3.89a6.985 6.985 0 0 1-4.78 3.02c-.34.06-.69.09-1.05.09-.36 0-.71-.03-1.05-.09a6.985 6.985 0 0 1-4.78-3.02A6.968 6.968 0 0 1 5 9.14c0-3.87 3.13-7 7-7s7 3.13 7 7Z' />
            <path d='M21.25 18.61 19.6 19c-.37.09-.66.37-.74.74l-.35 1.47a1 1 0 0 1-1.74.41L12 16.14l-4.77 5.49a1 1 0 0 1-1.74-.41l-.35-1.47a.996.996 0 0 0-.74-.74l-1.65-.39a1.003 1.003 0 0 1-.48-1.68l3.9-3.9a6.986 6.986 0 0 0 4.78 3.02c.34.06.69.09 1.05.09.36 0 .71-.03 1.05-.09 1.99-.29 3.7-1.42 4.78-3.02l3.9 3.9c.55.54.28 1.49-.48 1.67ZM12.58 6.12l.59 1.18c.08.16.29.32.48.35l1.07.18c.68.11.84.61.35 1.1l-.83.83c-.14.14-.22.41-.17.61l.24 1.03c.19.81-.24 1.13-.96.7l-1-.59a.701.701 0 0 0-.66 0l-1 .59c-.72.42-1.15.11-.96-.7l.24-1.03c.04-.19-.03-.47-.17-.61l-.83-.83c-.49-.49-.33-.98.35-1.1l1.07-.18c.18-.03.39-.19.47-.35l.59-1.18c.29-.64.81-.64 1.13 0Z' />
          </g>
        </svg>
      );
    case 'star':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='44'
          height='45'
          fill='none'
        >
          <path
            stroke='#929298'
            strokeLinecap='round'
            strokeLinejoin='round'
            d='m21.833 7.5 4.893 9.912 10.94 1.599-7.916 7.71 1.868 10.894-9.785-5.146-9.785 5.146 1.869-10.893L6 19.01l10.94-1.6L21.834 7.5Z'
          />
        </svg>
      );
    case 'security-safe':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '24'}
          height={h || '25'}
          fill='none'
          viewBox='0 0 24 25'
        >
          <g
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
          >
            <path d='M20.91 11.26c0 4.89-3.55 9.47-8.4 10.81-.33.09-.69.09-1.02 0-4.85-1.34-8.4-5.92-8.4-10.81V6.87c0-.82.62-1.75 1.39-2.06l5.57-2.28c1.25-.51 2.66-.51 3.91 0l5.57 2.28c.76.31 1.39 1.24 1.39 2.06l-.01 4.39Z' />
            <g strokeMiterlimit='10'>
              <path d='M12 12.64a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM12 12.64v3' />
            </g>
          </g>
        </svg>
      );
    case 'payment-plus':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '24'}
          height={h || '25'}
          fill='none'
          viewBox='0 0 24 25'
        >
          <g
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
          >
            <path strokeMiterlimit='10' d='M14.262 15.58h-5M11.762 13.139v5' />
            <path d='m12.66 2.659-.03.07-2.9 6.73H6.88c-.68 0-1.33.14-1.92.39l1.75-4.18.04-.1.07-.16c.02-.06.04-.12.07-.17 1.31-3.03 2.79-3.72 5.77-2.58ZM18.05 9.66c-.45-.14-.93-.2-1.41-.2H9.73l2.9-6.73.03-.07c.15.05.29.12.44.18l2.21.93c1.23.51 2.09 1.04 2.61 1.68.1.12.18.23.25.36.09.14.16.28.2.43.04.09.07.18.09.26.27.84.11 1.87-.41 3.16Z' />
            <path d='M21.522 14.339v1.95c0 .2-.01.4-.02.6-.19 3.49-2.14 5.25-5.84 5.25h-7.8c-.24 0-.48-.02-.71-.05-3.18-.21-4.88-1.91-5.09-5.09-.03-.23-.05-.47-.05-.71v-1.95c0-2.01 1.22-3.74 2.96-4.49.6-.25 1.24-.39 1.92-.39h9.76c.49 0 .97.07 1.41.2 1.99.61 3.46 2.47 3.46 4.68Z' />
            <path d='m6.71 5.669-1.75 4.18A4.894 4.894 0 0 0 2 14.339v-2.93c0-2.84 2.02-5.21 4.71-5.74ZM21.519 11.408v2.93c0-2.2-1.46-4.07-3.46-4.67.52-1.3.67-2.32.42-3.17-.02-.09-.05-.18-.09-.26 1.86.96 3.13 2.93 3.13 5.17Z' />
          </g>
        </svg>
      );
    case 'broom':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          fill='none'
        >
          <g
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
          >
            <path d='M10.281 5.906 6.72 8.073 5.094 5.406a2.093 2.093 0 0 1 .698-2.864 2.093 2.093 0 0 1 2.864.698l1.625 2.666ZM12.312 9.542l-3.291 2a4.144 4.144 0 0 0-1.573 5.396l2.135 4.354c.688 1.406 2.354 1.895 3.688 1.073l6.697-4.073c1.344-.813 1.667-2.51.74-3.771l-2.885-3.896c-1.25-1.687-3.594-2.25-5.51-1.083Z' />
            <path d='M11.205 5.31 5.867 8.561l2.167 3.559 5.338-3.25-2.167-3.56ZM14.906 17.51l1.719 2.823M12.24 19.135l1.719 2.823M17.572 15.885l1.719 2.823' />
          </g>
        </svg>
      );
    case 'ello-coin':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '24'}
          height={h || '25'}
          fill='none'
          viewBox='0 0 24 25'
        >
          <path
            fill='#fff'
            fillRule='evenodd'
            d='M12.387 20.782c3.114 0 5.84-1.613 7.334-4.024h4.25c-1.773 4.525-6.29 7.742-11.584 7.742C5.546 24.5 0 19.127 0 12.5S5.546.5 12.387.5C17.709.5 22.247 3.751 24 8.315h-4.234c-1.484-2.451-4.233-4.097-7.379-4.097-4.721 0-8.549 3.708-8.549 8.282s3.828 8.282 8.549 8.282Zm-5.193-3.164V7.368H8.22c.554.04 1.664.395 1.664 1.482v2.593h3.329v1.852H9.883v2.223h7.682v2.1H7.195Zm10.242-10.25H12.06c-.341 0-1.024.172-1.024.864v1.482h5.377c.342 0 1.024-.173 1.024-.864V7.368Z'
            clipRule='evenodd'
          />
        </svg>
      );
    case 'ello-credits':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width={w || '24'}
          height={h || '25'}
          fill='none'
          viewBox='0 0 24 25'
        >
          <circle cx='12' cy='12.5' r='11' fill='#FDF3AB' />
          <path
            fill='#F90'
            fillRule='evenodd'
            d='M12 22.5c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10Zm0 1c6.075 0 11-4.925 11-11s-4.925-11-11-11-11 4.925-11 11 4.925 11 11 11Z'
            clipRule='evenodd'
          />
          <path
            fill='#F90'
            fillRule='evenodd'
            d='M10.591 6.079c5.182-.146 7.171 4.98 7.171 4.98a7.203 7.203 0 0 0-14.407 0s1.537-4.82 7.236-4.98Zm2.816 12.842c-5.182.146-7.171-4.98-7.171-4.98a7.203 7.203 0 1 0 14.407 0s-1.537 4.82-7.236 4.98Zm.032-.658s5.126-1.99 4.98-7.171c-.16-5.7-4.98-7.236-4.98-7.236a7.203 7.203 0 1 1 0 14.407Zm-7.86-4.355c-.146-5.181 4.98-7.17 4.98-7.17a7.203 7.203 0 1 0 0 14.406s-4.82-1.537-4.98-7.236Z'
            clipRule='evenodd'
          />
          <path
            fill='#F90'
            fillRule='evenodd'
            d='M12 17.214a4.714 4.714 0 1 0 0-9.428 4.714 4.714 0 0 0 0 9.428Zm-2.357-7.071v4.714h4.714v-.965h-3.492v-1.023h1.513v-.852h-1.513v-1.193c0-.5-.505-.662-.757-.681h-.465Zm2.211 0H14.3v.681c0 .319-.31.398-.466.398H11.39v-.682c0-.318.31-.397.465-.397Z'
            clipRule='evenodd'
          />
        </svg>
      );
    case 'chart':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='25'
          fill='none'
        >
          <g
            stroke='#0A49A5'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
          >
            <path d='M9.375 22.917h6.25c5.208 0 7.292-2.084 7.292-7.292v-6.25c0-5.208-2.084-7.292-7.292-7.292h-6.25c-5.208 0-7.292 2.084-7.292 7.292v6.25c0 5.208 2.084 7.292 7.292 7.292Z' />
            <path d='M16.146 19.27a2.09 2.09 0 0 0 2.083-2.082V7.812a2.09 2.09 0 0 0-2.083-2.083 2.09 2.09 0 0 0-2.084 2.083v9.375c0 1.146.928 2.084 2.084 2.084ZM8.854 19.27a2.09 2.09 0 0 0 2.083-2.082v-3.646a2.09 2.09 0 0 0-2.083-2.084 2.09 2.09 0 0 0-2.083 2.084v3.646c0 1.145.927 2.083 2.083 2.083Z' />
          </g>
        </svg>
      );
    case 'lamp-charge':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='18'
          height='18'
          fill='none'
          viewBox='0 0 18 18'
        >
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.2'
            d='m9 5.917-.802 1.395c-.18.308-.03.563.322.563h.953c.36 0 .502.255.322.562L9 9.832'
          />
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.2'
            d='M6.225 13.53v-.87C4.5 11.617 3.083 9.585 3.083 7.425c0-3.713 3.412-6.623 7.267-5.783 1.695.375 3.18 1.5 3.953 3.053 1.567 3.15-.083 6.495-2.506 7.957v.87c0 .218.083.72-.72.72H6.946c-.825.008-.72-.315-.72-.712ZM6.375 16.5a9.606 9.606 0 0 1 5.25 0'
          />
        </svg>
      );
    default:
      return <></>;
  }
};

export default IconSvg;
