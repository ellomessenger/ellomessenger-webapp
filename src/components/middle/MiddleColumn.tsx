import React, { FC, memo, useEffect } from 'react';

import { MiddleColumnContent, SettingsScreens } from '../../types';
import MessagesLayout from './MessagesLayout';
import Settings from './settings/Settings';
import useFoldersReducer from '../../hooks/reducers/useFoldersReducer';

import './MiddleColumn.scss';

import PaymentAi from '../payment/PaymentAi';
import Transition from '../ui/Transition';
import CreateMediaSale from './mediasale/CreateMediaSale';
import CallsChat from '../left/Calls/CallsChat';
import FeedLayout from './feed/FeedLayout';
import { getActions, withGlobal } from '../../global';
import {
  selectCurrentMessageList,
  selectTabState,
} from '../../global/selectors';
import usePrevious from '../../hooks/usePrevious';
import { IPayment, IWallet, IWithdrawTemplate } from '../../global/types';
import Statistics from './statistics/Statistics';
import MessageStatistics from './statistics/MessageStatistics';
import QuickLinks from './QuickLinks';
import { FeedLeftList, FeedMiddleList } from '../main/Main';

interface OwnProps {
  isMobile?: boolean;
  setSettingsScreen: (val: SettingsScreens) => void;
  settingsScreen: SettingsScreens;
  handleCalls: (name: string) => void;
  onSelectChatMenu: () => void;
  feedMiddleScreen: FeedMiddleList;
  setFeedMiddleScreen: (screen: FeedMiddleList) => void;
}

type StateProps = {
  middleScreen: MiddleColumnContent;
  withdrawTemplate?: IWithdrawTemplate;
  wallet?: IWallet;
  chatId?: string;
  payment?: IPayment | undefined;
};

const TRANSITION_RENDER_COUNT = Object.keys(MiddleColumnContent).length / 2;

const MiddleColumn: FC<OwnProps & StateProps> = ({
  setSettingsScreen,
  settingsScreen,
  handleCalls,
  onSelectChatMenu,
  middleScreen,
  withdrawTemplate,
  wallet,
  chatId,
  payment,
  isMobile,
  feedMiddleScreen,
  setFeedMiddleScreen,
}) => {
  const { clearWithdrawTemplate } = getActions();
  const [foldersState, foldersDispatch] = useFoldersReducer();
  const prevScreen = usePrevious(middleScreen);

  useEffect(() => {
    if (prevScreen === MiddleColumnContent.Settings) {
      setSettingsScreen(SettingsScreens.Main);
      if (withdrawTemplate && wallet) {
        clearWithdrawTemplate({
          wallet_id: wallet.id,
          payment_id: withdrawTemplate.payment_id!,
        });
      }
    }
  }, [middleScreen]);

  function renderContent() {
    switch (middleScreen) {
      case MiddleColumnContent.Settings:
        return (
          <Settings
            isActive={true}
            currentScreen={settingsScreen}
            foldersState={foldersState}
            foldersDispatch={foldersDispatch}
            onScreenSelect={setSettingsScreen}
            onSelectChatMenu={onSelectChatMenu}
            payment={payment}
          />
        );

      case MiddleColumnContent.Calls:
        return <CallsChat handleCalls={handleCalls} />;
      case MiddleColumnContent.PaymentAi:
        return <PaymentAi onScreenSettingSelect={setSettingsScreen} />;
      case MiddleColumnContent.MediaSale:
        return <CreateMediaSale chatId='' />;
      case MiddleColumnContent.Feed:
        return (
          <FeedLayout
            isMobile={isMobile}
            feedScreen={feedMiddleScreen}
            setFeedScreen={setFeedMiddleScreen}
          />
        );
      case MiddleColumnContent.Statistics:
        return <Statistics chatId={chatId!} />;
      case MiddleColumnContent.MessageStatistics:
      // return (
      //   <MessageStatistics chatId={chatId!} isActive={isOpen && isActive} />
      // );
      case MiddleColumnContent.QuickLinks:
        return <QuickLinks setSettingsScreen={setSettingsScreen} />;
      default:
        return <MessagesLayout isMobile={isMobile} />;
    }
  }

  return (
    <div id='MiddleColumn'>
      <Transition
        name='fade'
        activeKey={middleScreen}
        renderCount={TRANSITION_RENDER_COUNT}
        shouldCleanup
      >
        {renderContent()}
      </Transition>
    </div>
  );
};

export default memo(
  withGlobal((global): StateProps => {
    const { withdrawTemplate, wallets, payment } = global;

    const tabState = selectTabState(global);
    const { chatId } = selectCurrentMessageList(global) || {};

    const { middleScreen } = tabState;
    return {
      middleScreen,
      withdrawTemplate,
      wallet: wallets && wallets.find((el) => el.type === 'main'),
      chatId,
      payment,
    };
  })(MiddleColumn)
);
