import React, { FC, memo, useCallback, useState } from 'react';
import Switcher from '../../ui/Switcher';
import { useTranslation } from 'react-i18next';
import TabList from '../../ui/TabList';

import { GlobalState } from '../../../global/types';
import { getActions, withGlobal } from '../../../global';
import { pick } from '../../../util/iteratees';
import useLastCallback from '../../../hooks/useLastCallback';
import FeedItem from '../../left/feed/FeedItem';
import { FEED_BG_COLOR } from '../../../config';
import classNames from 'classnames';

const TABS = [
  { type: 'hidden', title: 'Channel.Hidden' },
  { type: 'pinned', title: 'Channel.Pinned' },
];

export interface IActionSwitch {
  show_recommended?: boolean;
  show_only_subs?: boolean;
  show_adult?: boolean;
}

type StateProps = Pick<GlobalState, 'feedFilter'>;

const FeedSettings: FC<StateProps> = ({ feedFilter }) => {
  const { setFeedFilter, setFeedBackground } = getActions();
  const { t } = useTranslation();
  const {
    all,
    show_recommended,
    show_only_subs,
    show_adult,
    hidden,
    pinned,
    customBg,
  } = feedFilter || {};
  const [activeTab, setActiveTab] = useState(0);

  const handleSwitchTab = useCallback((index: number) => {
    setActiveTab(index);
  }, []);

  const handleChangeSwitch = useLastCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name } = e.currentTarget;
      setFeedFilter({
        ...feedFilter,
        [name]: feedFilter && !feedFilter[name as keyof typeof feedFilter],
      });
    }
  );

  const handleSelectBg = useCallback((bg: string) => {
    setFeedBackground({ defaultBg: bg });
  }, []);

  return (
    <div className='feed-settings-content custom-scroll'>
      <div className='settings-container'>
        <div className='what-show-list'>
          {/* <div className='row row-not-wrap'>
            <span className='label'>{t('Feed.ShowRecommended')}</span>
            <div className='switcher-wrap' role='button'>
              <Switcher
                name='show_recommended'
                label={t('Feed.ShowRecommended')}
                color='reverse'
                has_icon
                checked={show_recommended}
                onChange={handleChangeSwitch}
              />
            </div>
          </div> */}
          <div className='row row-not-wrap'>
            <span className='label'>{t('Feed.ShowSubscription')}</span>
            <div className='switcher-wrap' role='button'>
              <Switcher
                name='show_only_subs'
                label={t('Feed.ShowSubscription')}
                color='reverse'
                has_icon
                checked={show_only_subs}
                onChange={handleChangeSwitch}
              />
            </div>
          </div>
          <div className='row row-not-wrap'>
            <span className='label'>{t('Feed.Show18')}</span>
            <div className='switcher-wrap' role='button'>
              <Switcher
                name='show_adult'
                label={t('Feed.Show18')}
                color='reverse'
                has_icon
                checked={show_adult}
                onChange={handleChangeSwitch}
              />
            </div>
          </div>
        </div>
        <div className='select-channel'>
          <h4>{t('Channel.Title')}</h4>
          <TabList
            activeTab={activeTab}
            tabs={TABS}
            onSwitchTab={handleSwitchTab}
          />
          {all?.map((id) => (
            <FeedItem chatId={id} tab={TABS[activeTab].type} />
          ))}
        </div>
        <div className='select-feed-background'>
          <h4>{t('Feed.SelectBackground')}</h4>
          <div className='bg-list'>
            {FEED_BG_COLOR.map((el, idx, arr) => (
              <div
                key={el}
                role='button'
                onClick={() => handleSelectBg(el)}
                className={classNames('list-item', el, {
                  active: customBg?.default === el || idx === arr.length,
                })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(
  withGlobal((global): StateProps => pick(global, ['feedFilter']))(FeedSettings)
);
