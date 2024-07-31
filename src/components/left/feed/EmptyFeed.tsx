import React, { FC, memo } from 'react';

import { useTranslation } from 'react-i18next';
import AnimatedIcon from '../../common/AnimatedIcon';
import { LOCAL_TGS_URLS } from '../../common/helpers/animatedAssets';
import image from '../../../assets/images/Recommend.png';
import { FeedLeftList } from '../../main/Main';

const ICON_SIZE = 200;
type OwnProps = {
  feedLeftScreen: FeedLeftList;
};

const EmptyFeed: FC<OwnProps> = ({ feedLeftScreen }) => {
  const { t } = useTranslation();

  return (
    <div className='empty-root'>
      <div className='sticker-wrap'>
        {feedLeftScreen === FeedLeftList.Following ? (
          <AnimatedIcon tgsUrl={LOCAL_TGS_URLS.FeedEmpty} size={ICON_SIZE} />
        ) : (
          <img src={image} alt='feed empty' />
        )}

        <p className='description' dir='auto'>
          {t(
            `ChatList.${
              feedLeftScreen === FeedLeftList.Following
                ? 'EmptyFeed'
                : 'EmptyRecomendedFeed'
            }`
          )}
        </p>
      </div>
    </div>
  );
};

export default memo(EmptyFeed);
