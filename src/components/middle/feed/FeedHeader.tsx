import React, { FC, memo } from 'react';

import { useTranslation } from 'react-i18next';
import Transition from '../../ui/Transition';

import Button from '../../ui/Button';
import IconSvg from '../../ui/IconSvg';
import { FeedMiddleList } from '../../main/Main';

type OwnProps = {
  isDesctop?: boolean;
  currentScreen: FeedMiddleList;
  selectScreen: (screen: FeedMiddleList) => void;
};

const FeedHeader: FC<OwnProps> = ({
  isDesctop,
  currentScreen,
  selectScreen,
}) => {
  const { t } = useTranslation();

  function renderInfo() {
    return (
      <>
        {currentScreen === FeedMiddleList.Settings && (
          <div className='back-button'>
            <Button
              round
              size='smaller'
              color='translucent'
              onClick={() => selectScreen(FeedMiddleList.Main)}
              ariaLabel='Back'
            >
              <IconSvg name='arrow-left' />
            </Button>
          </div>
        )}
        <h4>
          {t(
            currentScreen === FeedMiddleList.Settings
              ? 'Feed.Settings'
              : 'Content.6'
          )}
        </h4>
      </>
    );
  }

  return (
    <div className='MiddleHeader feed-header'>
      <Transition name='slide-fade' activeKey={currentScreen} shouldCleanup>
        {renderInfo()}
      </Transition>
      <div className='header-tools'>
        <div className='HeaderActions'>
          {currentScreen !== FeedMiddleList.Settings && (
            <Button
              round
              ripple={isDesctop}
              color='translucent'
              ariaLabel='Settimgs'
              size='smaller'
              onClick={() => selectScreen(FeedMiddleList.Settings)}
            >
              <i className='icon-svg'>
                <IconSvg name='settings' />
              </i>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(FeedHeader);
