import React from 'react';

import AppStore from '../../assets/images/app-store.svg';
import GooglePlay from '../../assets/images/google-play.svg';

const ComingSoonPage = () => {
  return (
    <div className='comingSoon-main'>
      <div className='heading'>Something great is on the way</div>
      <h1>Ello WEB is Coming Soon</h1>
      <div className='buttons-row'>
        <a
          className='Button'
          target='_blank'
          href='https://apps.apple.com/us/app/ello-messenger/id6469151194'
          rel='noreferrer'
          type='button'
          aria-label='apple app store'
        >
          <img src={AppStore} alt='apple app store' />
        </a>
        <a
          className='Button'
          target='_blank'
          href='https://play.google.com/store/apps/details?id=com.beint.elloapp'
          rel='noreferrer'
          aria-label='google app store'
        >
          <img src={GooglePlay} alt='google app store' />
        </a>
      </div>
    </div>
  );
};

export default ComingSoonPage;
