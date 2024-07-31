import React, { FC } from 'react';
import Button from '../ui/Button';
import IconSvg from '../ui/IconSvg';
import { getActions } from '../../global';
import {
  LeftColumnContent,
  MiddleColumnContent,
  SettingsScreens,
} from '../../types';
import { useTranslation } from 'react-i18next';
import ListItem from '../ui/ListItem';
import IconSvgSettings from './settings/icons/IconSvgSettings';
import { historyPushState } from '../../util/routing';
import { INACTIVE_MARKER } from '../../config';
import useLastCallback from '../../hooks/useLastCallback';

type OwnProps = {
  setSettingsScreen: (screen: SettingsScreens) => void;
};

const QuickLinks: FC<OwnProps> = ({ setSettingsScreen }) => {
  const {
    setMiddleScreen,
    setLeftScreen,
    updatePageTitle,
    toggleLeftColumn,
    setMenuShow,
    openChatByUsername,
  } = getActions();
  const { t } = useTranslation();

  function selectLink({
    leftScreen,
    middleScreen,
    settingsScreen,
    hash,
    isToggleLeft,
  }: {
    leftScreen: LeftColumnContent;
    middleScreen?: MiddleColumnContent;
    settingsScreen?: SettingsScreens | undefined;
    hash?: string | undefined;
    isToggleLeft?: boolean;
  }) {
    leftScreen && setLeftScreen({ screen: leftScreen });
    middleScreen && setMiddleScreen({ screen: middleScreen });
    settingsScreen && setSettingsScreen(settingsScreen);
    historyPushState({
      data: {
        leftScreen: LeftColumnContent.ChatList,
        middleScreen: MiddleColumnContent.QuickLinks,
        ...(hash && { hash: `#${hash}` }),
      },
      hash: ' ',
    });

    if (!document.title.includes(INACTIVE_MARKER)) {
      updatePageTitle();
    }
    isToggleLeft && toggleLeftColumn();
  }

  const handleSelectContacts = useLastCallback(() => {
    selectLink({
      leftScreen: LeftColumnContent.Contacts,
      hash: 'contacts',
      isToggleLeft: true,
    });
  });

  const handleSelectBuyCredits = useLastCallback(() => {
    selectLink({
      leftScreen: LeftColumnContent.Settings,
      middleScreen: MiddleColumnContent.Settings,
      settingsScreen: SettingsScreens.Wallet,
      hash: 'profile',
    });
  });

  const handleSelectEarn = useLastCallback(() => {
    selectLink({
      leftScreen: LeftColumnContent.Settings,
      middleScreen: MiddleColumnContent.Settings,
      settingsScreen: SettingsScreens.LoyaltyProgram,
      hash: 'profile',
    });
  });

  const handleSelectAiSpace = useLastCallback(() => {
    selectLink({
      leftScreen: LeftColumnContent.Settings,
      middleScreen: MiddleColumnContent.Settings,
      settingsScreen: SettingsScreens.aiSpace,
      hash: 'profile',
    });
  });

  const handleSelectCreate = useLastCallback(() => {
    selectLink({
      leftScreen: LeftColumnContent.ChatList,
      isToggleLeft: true,
    });
    setMenuShow(true);
  });

  const handleSelectTips = useLastCallback(() => {
    openChatByUsername({ username: 'ellotips' });
  });

  const onReset = () => {
    setMiddleScreen({ screen: MiddleColumnContent.Messages });
  };

  return (
    <div id='QuickLinks' className='settings-layout'>
      <div className='MiddleHeader'>
        <div className='setting-info'>
          <Button
            round
            size='smaller'
            color='translucent'
            onClick={onReset}
            ariaLabel={String(t('GoBack'))}
          >
            <i className='icon-svg'>
              <IconSvg name='arrow-left' />
            </i>
          </Button>
          <h4>Quick links</h4>
        </div>
      </div>
      <div className='settings-content custom-scroll'>
        <div className='settings-container quick-links-container'>
          <div className='links-item-middle'>
            <ListItem
              leftElement={
                <div className='title-icon tips-bg mr-3'>
                  <IconSvg name='lamp-charge' />
                </div>
              }
              rightElement={<i className='css-icon-right'></i>}
              onClick={handleSelectTips}
            >
              <div className='info'>
                <div className='info-row'>Tips</div>
                <div className='sub'>
                  Elevate your Ello experience with proven tips and tricks for
                  channels, groups or AI bot.
                </div>
              </div>
            </ListItem>
            <ListItem
              leftElement={
                <div className='title-icon earn-bg mr-3'>
                  <IconSvg name='user-plus' w='20' h='20' />
                </div>
              }
              rightElement={<i className='css-icon-right'></i>}
              onClick={handleSelectEarn}
            >
              <div className='info'>
                <div className='info-row'>Earn Instantly</div>
                <div className='sub'>
                  Invite friends to join and both of you will receive $5 for
                  channel subscriptions community groups, online courses, and
                  engaging with AI.
                </div>
              </div>
            </ListItem>

            <ListItem
              leftElement={
                <div className='title-icon contacts-bg mr-3'>
                  <IconSvg name='search' w='18' h='18' />
                </div>
              }
              rightElement={<i className='css-icon-right'></i>}
              onClick={handleSelectContacts}
            >
              <div className='info'>
                <div className='info-row'>Contacts</div>
                <div className='sub'>
                  View all your contacts or use the search function to find any
                  user, channel, group or AI bot.
                </div>
              </div>
            </ListItem>
            <ListItem
              leftElement={
                <div className='title-icon broadcast-bg mr-3'>
                  <IconSvg name='people' />
                </div>
              }
              rightElement={<i className='css-icon-right'></i>}
              onClick={handleSelectCreate}
            >
              <div className='info'>
                <div className='info-row'>Broadcast</div>
                <div className='sub'>
                  Instantly create channels, online courses and community
                  groups.
                </div>
              </div>
            </ListItem>
            <ListItem
              leftElement={
                <div className='title-icon pay-bg mr-3'>
                  <IconSvg name='dollar' w='18' h='18' />
                </div>
              }
              rightElement={<i className='css-icon-right'></i>}
              onClick={handleSelectBuyCredits}
            >
              <div className='info'>
                <div className='info-row'>Ello Pay</div>
                <div className='sub'>
                  All your financial transactions in one secure location.
                </div>
              </div>
            </ListItem>

            <ListItem
              leftElement={
                <div className='title-icon mr-3'>
                  <IconSvgSettings name='ai-bot' w='16' h='16' />
                </div>
              }
              rightElement={<i className='css-icon-right'></i>}
              onClick={handleSelectAiSpace}
            >
              <div className='info'>
                <div className='info-row'>AI Space</div>
                <div className='sub'>Discover the exciting world of AI.</div>
              </div>
            </ListItem>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickLinks;
