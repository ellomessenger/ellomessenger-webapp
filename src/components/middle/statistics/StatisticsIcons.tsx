import React, { FC } from 'react';
import { IIconSvg } from '../../ui/IconSvg/types';

const StatisticsIcons: FC<IIconSvg> = ({ name, w, h, color }) => {
  switch (name) {
    case 'growthGraph':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          fill='none'
        >
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='m7.517 2.367-4.492 3.5c-.75.583-1.358 1.825-1.358 2.766v6.175a3.521 3.521 0 0 0 3.508 3.517h9.65a3.52 3.52 0 0 0 3.508-3.508V8.75c0-1.008-.675-2.3-1.5-2.875l-5.15-3.608c-1.166-.817-3.041-.775-4.166.1Z'
          />
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='m13.75 9.583-3.5 3.5-1.333-2L6.25 13.75'
          />
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
            d='M12.083 9.583h1.667v1.667'
          />
        </svg>
      );
    case 'followersGraph':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          fill='none'
        >
          <g
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
          >
            <path d='m13.458 10.692-1.441.483c-.4.133-.709.442-.842.842l-.483 1.441c-.409 1.242-2.159 1.217-2.542-.025L6.525 8.2c-.317-1.042.642-2 1.667-1.683l5.241 1.625c1.242.391 1.259 2.141.025 2.55Z' />
            <path d='M10 18.333a8.333 8.333 0 1 0 0-16.666 8.333 8.333 0 0 0 0 16.666Z' />
          </g>
        </svg>
      );
    case 'muteGraph':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='18'
          height='18'
          fill='none'
        >
          <g stroke='#fff' strokeWidth='1.5'>
            <path d='M1.17 6.14v1.292c0 1.67.825 2.506 2.473 2.506h2.38c.306 0 .61.091.875.25L12.36 13.8c2.077 1.32 3.783.359 3.783-2.122v-7.7c0-2.49-1.706-3.441-3.783-2.122L9.954 3.384a1.71 1.71 0 0 1-.874.25H3.643c-1.648 0-2.472.836-2.472 2.506Z' />
            <rect width='2.976' height='4.96' x='3.048' y='11.976' rx='1.488' />
          </g>
        </svg>
      );
    case 'topHoursGraph':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          fill='none'
        >
          <g
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
          >
            <path d='M18.333 10c0 4.6-3.733 8.333-8.333 8.333A8.336 8.336 0 0 1 1.667 10C1.667 5.4 5.4 1.667 10 1.667S18.333 5.4 18.333 10Z' />
            <path d='m13.092 12.65-2.584-1.542c-.45-.266-.816-.908-.816-1.433V6.258' />
          </g>
        </svg>
      );
    case 'viewsBySourceGraph':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          fill='none'
        >
          <g
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
          >
            <path d='M14.167 4.167H5.833c-2.5 0-4.166 1.666-4.166 4.166v5.834c0 2.5 1.666 4.166 4.166 4.166h8.334c2.5 0 4.166-1.666 4.166-4.166V8.333c0-2.5-1.666-4.166-4.166-4.166ZM5.833 1.667v2.5' />
            <path d='M7.083 13.333a2.083 2.083 0 1 0 0-4.166 2.083 2.083 0 0 0 0 4.166ZM12.083 9.167h3.334M12.083 12.5h.417M15 12.5h.417' />
          </g>
        </svg>
      );
    case 'newFollowersBySourceGraph':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          fill='none'
        >
          <g
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
          >
            <path d='m10.842 2.433 4.916 2.184c1.417.625 1.417 1.658 0 2.283l-4.916 2.183c-.559.25-1.475.25-2.034 0L3.892 6.9c-1.417-.625-1.417-1.658 0-2.283l4.916-2.184c.559-.25 1.475-.25 2.034 0Z' />
            <path d='M2.5 9.167c0 .7.525 1.508 1.167 1.791l5.658 2.517c.433.192.925.192 1.35 0l5.658-2.517c.642-.283 1.167-1.091 1.167-1.791' />
            <path d='M2.5 13.333c0 .775.458 1.475 1.167 1.792l5.658 2.517c.433.191.925.191 1.35 0l5.658-2.517a1.964 1.964 0 0 0 1.167-1.792' />
          </g>
        </svg>
      );
    case 'interactionsGraph':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          fill='none'
        >
          <path
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeMiterlimit='10'
            strokeWidth='1.5'
            d='M5.075 11.067H7.65v6c0 1.4.758 1.683 1.683.633l6.309-7.167c.775-.875.45-1.6-.725-1.6h-2.575v-6c0-1.4-.759-1.683-1.684-.633L4.35 9.467c-.767.883-.442 1.6.725 1.6Z'
          />
        </svg>
      );
    case 'recent-messages':
      return (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          fill='none'
        >
          <g
            stroke='#fff'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1.5'
          >
            <path d='M6.25 4.167h7.5c.517 0 .975.016 1.383.075 2.192.241 2.784 1.275 2.784 4.091v3.334c0 2.816-.592 3.85-2.784 4.091a9.965 9.965 0 0 1-1.383.075h-7.5c-.517 0-.975-.016-1.383-.075-2.192-.241-2.784-1.275-2.784-4.091V8.333c0-2.816.592-3.85 2.784-4.091a9.957 9.957 0 0 1 1.383-.075ZM3.75 1.667h12.5M4.167 18.333h12.5' />
          </g>
        </svg>
      );
    default:
      return <></>;
  }
};

export default StatisticsIcons;
