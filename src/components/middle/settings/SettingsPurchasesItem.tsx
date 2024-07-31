import React from 'react';
import ListItem from '../../ui/ListItem';
import Button from '../../ui/Button';
import IconSvg from '../../ui/IconSvg';

const SettingsPurchasesItem = () => {
  return (
    <ListItem>
      <div className='thumbnail audio'>
        <img src='https://cdn.pixabay.com/photo/2023/05/16/22/11/wood-duck-7998725__340.jpg' />
        <i className='icon-svg'>
          <IconSvg name='play-music' />
        </i>
      </div>
      <div className='info'>
        <h4>Nature.avi</h4>
        <div className='subtitle'>
          <span className='duration'>
            <IconSvg name='play' /> 15:17
          </span>
          <span>Gunna • 2022</span>
          <i className='icon-svg'>
            <IconSvg name='download' w='16' h='16' />
          </i>
          <span className='size'>94,7 Mb</span>
        </div>
      </div>
      <div className='action'>
        <Button round color='translucent' onClick={() => true}>
          <i className='icon-svg'>
            <IconSvg name='delete' />
          </i>
        </Button>
      </div>
    </ListItem>
  );
};

export default SettingsPurchasesItem;
