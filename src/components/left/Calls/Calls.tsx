import React, { FC } from 'react';
import IconSvg from '../../ui/IconSvg';
import ava from '../../../assets/images/Avatar.svg';

interface IProps {
  handleCalls: (name: string) => void;
}

export const Calls: FC<IProps> = ({ handleCalls }) => {
  return (
    <div className='calls-wrap__call-background'>
      <div onClick={() => handleCalls('')} className='calls-wrap__close'>
        <IconSvg name='close-white' />
      </div>
      <div className='calls-wrap__call-content-wrap'>
        <div className='calls-wrap__call-content-header'>
          <div className='calls-wrap__call-title'>Corey Mango</div>
          <div className='calls-wrap__call-subtitle'>Calling</div>
          <img src={ava} alt='' />
        </div>
        <div className='calls-wrap__call-content-body'>
          <div className='calls-wrap__call-btn'>
            <span className='calls-wrap__call-name'>Video call</span>
            <IconSvg name='video-camera' />
          </div>
          <div className='calls-wrap__call-btn'>
            <span className='calls-wrap__call-name'>Speaker</span>
            <IconSvg name='microphone' w='36' h='36' />
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
