import React, { FC } from 'react';
import IconSvg from '../../ui/IconSvg';
import ava from '../../../assets/images/Avatar.svg';
import ava2 from '../../../assets/images/ava2.jpg';

interface IProps {
  handleCalls: (name: string) => void;
}

export const VideoCalls: FC<IProps> = ({ handleCalls }) => {
  return (
    <div className='calls-wrap__call-background'>
      <div className='calls-wrap__ava-wrap'>
        <img src={ava2} alt='' />
      </div>
      <div onClick={() => handleCalls('')} className='calls-wrap__close'>
        <IconSvg name='close-white' />
      </div>
      <div className='calls-wrap__call-video-content-wrap'>
        <div className='calls-wrap__call-content-header'></div>
        <div className='calls-wrap__call-content-body'>
          <div className='calls-wrap__call-btn'>
            <span className='calls-wrap__call-name'>Video call</span>
            <IconSvg name='video-camera' />
          </div>
          <div className='calls-wrap__call-btn'>
            <span className='calls-wrap__call-name'>Speaker</span>
            <IconSvg name='microphone' />
          </div>
          <div className='calls-wrap__call-btn'>
            <span className='calls-wrap__call-name'>Mute</span>
            <IconSvg name='mute-large' />
          </div>
          <div className='calls-wrap__call-btn'>
            <span className='calls-wrap__call-name'>End call</span>
            <IconSvg name='large-phone' />
          </div>
        </div>
      </div>
    </div>
  );
};
