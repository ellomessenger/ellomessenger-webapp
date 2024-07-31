import React, {
  FC,
  useEffect,
  memo,
  useCallback,
  useState,
  useRef,
} from 'react';
import { getActions, getGlobal, withGlobal } from '../../global';

import {
  AnimationLevel,
  LangCode,
  LeftColumnContent,
  MiddleColumnContent,
  SettingsScreens,
} from '../../types';
import type { ApiAttachBot, ApiMessage, ApiUser } from '../../api/types';
import type { ApiLimitTypeWithModal, TabState } from '../../global/types';

import '../../global/actions/all';
import { BASE_EMOJI_KEYWORD_LANG, DEBUG, INACTIVE_MARKER } from '../../config';
import { IS_ANDROID, IS_ELECTRON } from '../../util/windowEnvironment';
import {
  selectChatMessage,
  selectTabState,
  selectCurrentMessageList,
  selectIsCurrentUserPremium,
  selectIsForwardModalOpen,
  selectIsMediaViewerOpen,
  selectIsRightColumnShown,
  selectIsServiceChatReady,
  selectUser,
} from '../../global/selectors';
import { waitForTransitionEnd } from '../../util/cssAnimationEndListeners';
import { processDeepLink } from '../../util/deeplink';
import {
  parseInitialLocationHash,
  parseLocationHash,
} from '../../util/routing';
import { fastRaf } from '../../util/schedulers';
import { Bundles, loadBundle } from '../../util/moduleLoader';
import updateIcon from '../../util/updateIcon';

import useEffectWithPrevDeps from '../../hooks/useEffectWithPrevDeps';
import useBackgroundMode from '../../hooks/useBackgroundMode';
import useBeforeUnload from '../../hooks/useBeforeUnload';
import useSyncEffect from '../../hooks/useSyncEffect';
import usePreventPinchZoomGesture from '../../hooks/usePreventPinchZoomGesture';
import useForceUpdate from '../../hooks/useForceUpdate';
import { dispatchHeavyAnimationEvent } from '../../hooks/useHeavyAnimationCheck';
import useInterval from '../../hooks/useInterval';
import useAppLayout from '../../hooks/useAppLayout';
import useTimeout from '../../hooks/useTimeout';

import LeftColumn from '../left/LeftColumn';
import useShowTransition from '../../hooks/useShowTransition';
import MiddleColumn from '../middle/MiddleColumn';
import RightColumn from '../right/RightColumn';
import ForwardRecipientPicker from './ForwardRecipientPicker';
import HistoryCalendar from './HistoryCalendar';
import UnreadCount from '../common/UnreadCounter';

import MediaViewer from '../mediaViewer/MediaViewer';
import NewContactModal from './NewContactModal';
import useLastCallback from '../../hooks/useLastCallback';
import ConfettiContainer from './ConfettiContainer';
import ActiveCallHeader from '../calls/ActiveCallHeader';
import PhoneCall from '../calls/phone/PhoneCall';
import GroupCall from '../calls/group/GroupCall';
import RatePhoneCallModal from '../calls/phone/RatePhoneCallModal';
import MessageListHistoryHandler from '../middle/MessageListHistoryHandler';
import TwoFaEmailCodeModal from '../middle/settings/twoFa/TwoFaEmailCodeModal';
import Dialogs from './Dialogs';
import classNames from 'classnames';
import './Main.scss';
import DownloadManager from './DownloadManager';
import DraftRecipientPicker from './DraftRecipientPicker';
import AudioPlayer from '../middle/AudioPlayer';
import PremiumLimitReachedModal from './premium/common/PremiumLimitReachedModal';
import { ElectronEvent } from '../../types/electron';

export enum FeedLeftList {
  ForYou,
  Following,
  Explore,
}

export enum FeedMiddleList {
  Main,
  Settings,
}

type OwnProps = {
  isMobile: boolean;
};

type StateProps = {
  isMasterTab?: boolean;
  lastSyncTime?: number;
  isMiddleColumnOpen: boolean;
  isRightColumnOpen: boolean;
  isMediaViewerOpen: boolean;
  isForwardModalOpen: boolean;
  hasNotifications: boolean;
  hasDialogs: boolean;
  audioMessage?: ApiMessage;
  safeLinkModalUrl?: string;
  isHistoryCalendarOpen: boolean;
  shouldSkipHistoryAnimations?: boolean;
  openedStickerSetShortName?: string;
  openedCustomEmojiSetIds?: string[];
  activeGroupCallId?: string;
  isServiceChatReady?: boolean;
  animationLevel: AnimationLevel;
  language?: LangCode;
  wasTimeFormatSetManually?: boolean;
  isPhoneCallActive?: boolean;
  addedSetIds?: string[];
  addedCustomEmojiIds?: string[];
  newContactUserId?: string;
  newContactByPhoneNumber?: boolean;
  openedGame?: TabState['openedGame'];
  gameTitle?: string;
  isRatePhoneCallModalOpen?: boolean;
  webApp?: TabState['webApp'];
  isPremiumModalOpen?: boolean;
  botTrustRequest?: TabState['botTrustRequest'];
  botTrustRequestBot?: ApiUser;
  attachBotToInstall?: ApiAttachBot;
  requestedAttachBotInChat?: TabState['requestedAttachBotInChat'];
  requestedDraft?: TabState['requestedDraft'];
  currentUser?: ApiUser;
  urlAuth?: TabState['urlAuth'];
  limitReached?: ApiLimitTypeWithModal;
  deleteFolderDialogId?: number;
  isPaymentModalOpen?: boolean;
  isReceiptModalOpen?: boolean;
  isCurrentUserPremium?: boolean;
  middleScreen: MiddleColumnContent;
  leftScreen: LeftColumnContent;
  isLeftColumnOpen?: boolean;
};

const APP_OUTDATED_TIMEOUT_MS = 5 * 60 * 1000; // 5 min
const CALL_BUNDLE_LOADING_DELAY_MS = 5000; // 5 sec

// eslint-disable-next-line @typescript-eslint/naming-convention
let DEBUG_isLogged = false;

const Main: FC<OwnProps & StateProps> = ({
  lastSyncTime,
  isLeftColumnOpen,
  isMiddleColumnOpen,
  isRightColumnOpen,
  isMediaViewerOpen,
  isForwardModalOpen,
  hasDialogs,
  isHistoryCalendarOpen,
  shouldSkipHistoryAnimations,
  isServiceChatReady,
  animationLevel,
  language,
  wasTimeFormatSetManually,
  addedSetIds,
  addedCustomEmojiIds,
  newContactUserId,
  newContactByPhoneNumber,
  isCurrentUserPremium,
  isMasterTab,
  activeGroupCallId,
  isPhoneCallActive,
  isRatePhoneCallModalOpen,
  requestedDraft,
  audioMessage,
  leftScreen,
  limitReached,
  isMobile,
}) => {
  const {
    initMain,
    loadAnimatedEmojis,
    loadNotificationSettings,
    loadNotificationExceptions,
    updateIsOnline,
    onTabFocusChange,
    loadTopInlineBots,
    loadEmojiKeywords,
    loadCountryList,
    loadAvailableReactions,
    loadStickerSets,
    loadPremiumGifts,
    loadDefaultTopicIcons,
    loadAddedStickers,
    loadFavoriteStickers,
    loadDefaultStatusIcons,
    ensureTimeFormat,
    closeStickerSetModal,
    closeCustomEmojiSets,
    checkVersionNotification,
    loadConfig,
    loadAppConfig,
    loadAttachBots,
    loadContactList,
    loadCustomEmojis,
    loadGenericEmojiEffects,
    checkAppVersion,
    openChat,
    toggleLeftColumn,
    loadRecentEmojiStatuses,
    updatePageTitle,
    setMiddleScreen,
    setLeftScreen,
    loadAuthorizations,
    getBotList,
    setIsElectronUpdateAvailable,
  } = getActions();

  if (DEBUG && !DEBUG_isLogged) {
    DEBUG_isLogged = true;
    console.log('>>> RENDER MAIN');
  }
  const { isTablet } = useAppLayout();
  const [settingsScreen, setSettingsScreen] = useState(SettingsScreens.Main);
  const [feedLeftScreen, setFeedLeftScreen] = useState(FeedLeftList.Following);
  const [feedMiddleScreen, setFeedMiddleScreen] = useState(FeedMiddleList.Main);

  const [support, setsupport] = useState<SettingsScreens | null>(null);
  const [openCall, setOpenCall] = useState<string>('');

  const handleCalls = (name: string) => {
    setOpenCall(name);
  };

  // Preload Calls bundle to initialize sounds for iOS
  useTimeout(() => {
    void loadBundle(Bundles.Calls);
  }, CALL_BUNDLE_LOADING_DELAY_MS);

  const { isDesktop } = useAppLayout();

  useEffect(() => {
    if (!isLeftColumnOpen && !isMiddleColumnOpen && !isDesktop) {
      // Always display at least one column
      //toggleLeftColumn();
    } else if (isLeftColumnOpen && isMiddleColumnOpen && isMobile) {
      // Can't have two active columns at the same time
      //toggleLeftColumn();
    }
  }, [
    isDesktop,
    isLeftColumnOpen,
    isMiddleColumnOpen,
    isMobile,
    toggleLeftColumn,
  ]);

  useInterval(
    checkAppVersion,
    isMasterTab ? APP_OUTDATED_TIMEOUT_MS : undefined,
    true
  );

  useEffect(() => {
    if (!IS_ELECTRON) {
      return undefined;
    }

    const removeUpdateAvailableListener = window.electron!.on(
      ElectronEvent.UPDATE_AVAILABLE,
      () => {
        setIsElectronUpdateAvailable(true);
      }
    );

    const removeUpdateErrorListener = window.electron!.on(
      ElectronEvent.UPDATE_ERROR,
      () => {
        setIsElectronUpdateAvailable(false);
        removeUpdateAvailableListener?.();
      }
    );

    return () => {
      removeUpdateErrorListener?.();
      removeUpdateAvailableListener?.();
    };
  }, []);

  // Initial API calls
  useEffect(() => {
    if (lastSyncTime && isMasterTab) {
      updateIsOnline(true);
      loadConfig();
      loadAppConfig();
      initMain();
      loadAvailableReactions();
      loadAnimatedEmojis();
      loadGenericEmojiEffects();
      loadNotificationSettings();
      loadNotificationExceptions();
      loadTopInlineBots();
      loadEmojiKeywords({ language: BASE_EMOJI_KEYWORD_LANG });
      loadAttachBots();
      loadContactList();
      loadPremiumGifts();
      loadDefaultTopicIcons();
      loadDefaultStatusIcons();
      checkAppVersion();
      loadAuthorizations();
      getBotList();

      if (isCurrentUserPremium) {
        loadRecentEmojiStatuses();
      }
    }
  }, [
    lastSyncTime,
    loadAnimatedEmojis,
    loadEmojiKeywords,
    loadNotificationExceptions,
    loadNotificationSettings,
    loadTopInlineBots,
    updateIsOnline,
    loadAvailableReactions,
    loadAppConfig,
    loadAttachBots,
    loadContactList,
    loadPremiumGifts,
    checkAppVersion,
    loadConfig,
    loadGenericEmojiEffects,
    loadDefaultTopicIcons,
    loadDefaultStatusIcons,
    loadRecentEmojiStatuses,
    loadAuthorizations,
    isCurrentUserPremium,
    isMasterTab,
    initMain,
  ]);

  // Language-based API calls
  useEffect(() => {
    if (lastSyncTime && isMasterTab) {
      if (language !== BASE_EMOJI_KEYWORD_LANG) {
        loadEmojiKeywords({ language: language! });
      }

      loadCountryList({ langCode: language });
    }
  }, [language, lastSyncTime, loadCountryList, loadEmojiKeywords, isMasterTab]);

  // Re-fetch cached saved emoji for `localDb`
  useEffectWithPrevDeps(
    ([prevLastSyncTime]) => {
      if (!prevLastSyncTime && lastSyncTime && isMasterTab) {
        loadCustomEmojis({
          ids: Object.keys(getGlobal().customEmojis.byId),
          ignoreCache: true,
        });
      }
    },
    [lastSyncTime, isMasterTab, loadCustomEmojis]
  );

  // Sticker sets
  useEffect(() => {
    if (lastSyncTime && isMasterTab) {
      if (!addedSetIds || !addedCustomEmojiIds) {
        loadStickerSets();
        loadFavoriteStickers();
      }

      if (addedSetIds && addedCustomEmojiIds) {
        loadAddedStickers();
      }
    }
  }, [
    lastSyncTime,
    addedSetIds,
    loadStickerSets,
    loadFavoriteStickers,
    loadAddedStickers,
    addedCustomEmojiIds,
    isMasterTab,
  ]);

  // Check version when service chat is ready
  // useEffect(() => {
  //   if (lastSyncTime && isServiceChatReady && isMasterTab) {
  //     checkVersionNotification();
  //   }
  // }, [lastSyncTime, isServiceChatReady, checkVersionNotification, isMasterTab]);

  // Ensure time format
  useEffect(() => {
    if (lastSyncTime && !wasTimeFormatSetManually) {
      ensureTimeFormat();
    }
  }, [lastSyncTime, wasTimeFormatSetManually, ensureTimeFormat]);

  // Parse deep link
  useEffect(() => {
    const parsedInitialLocationHash = parseInitialLocationHash();

    if (parsedInitialLocationHash?.elloaddr) {
      processDeepLink(
        decodeURIComponent(parsedInitialLocationHash.elloaddr),
        true
      );
    }
  }, []);

  const parsedLocationHash = parseLocationHash();

  useEffectWithPrevDeps(
    ([prevLastSyncTime, prevParsedLocationHash]) => {
      updatePageTitle();
      if (!parsedLocationHash) return;

      if (!prevLastSyncTime && lastSyncTime && !parsedLocationHash.hash) {
        openChat({
          id: parsedLocationHash.chatId,
          threadId: parsedLocationHash.threadId,
          type: parsedLocationHash.type,
        });
      } else if (!prevParsedLocationHash && parsedLocationHash.hash) {
        switch (parsedLocationHash.hash) {
          case 'ello-pay':
            setLeftScreen({ screen: LeftColumnContent.Settings });
            setMiddleScreen({ screen: MiddleColumnContent.Settings });
            setSettingsScreen(SettingsScreens.Wallet);
            break;
          case 'feed':
            setLeftScreen({ screen: LeftColumnContent.Feed });
            setMiddleScreen({ screen: MiddleColumnContent.Feed });
            setIsNarrowMessageList(false);
        }
      }
    },
    [lastSyncTime, parsedLocationHash, openChat]
  );

  const willAnimateLeftColumnRef = useRef(false);
  const forceUpdate = useForceUpdate();

  const leftColumnTransition = useShowTransition(
    isLeftColumnOpen,
    undefined,
    true,
    undefined,
    shouldSkipHistoryAnimations,
    undefined,
    true
  );
  // Handle opening middle column
  useSyncEffect(
    ([prevIsLeftColumnOpen]) => {
      if (
        prevIsLeftColumnOpen === undefined ||
        isLeftColumnOpen === prevIsLeftColumnOpen ||
        animationLevel === 0
      ) {
        return;
      }

      willAnimateLeftColumnRef.current = true;

      if (IS_ANDROID) {
        fastRaf(() => {
          document.body.classList.toggle(
            'android-left-blackout-open',
            !isLeftColumnOpen
          );
        });
      }

      const dispatchHeavyAnimationEnd = dispatchHeavyAnimationEvent();

      waitForTransitionEnd(document.getElementById('MiddleColumn')!, () => {
        dispatchHeavyAnimationEnd();
        willAnimateLeftColumnRef.current = false;
        forceUpdate();
      });
    },
    [isLeftColumnOpen, animationLevel, forceUpdate]
  );

  const rightColumnTransition = useShowTransition(
    isRightColumnOpen,
    undefined,
    true,
    undefined,
    shouldSkipHistoryAnimations,
    undefined,
    true
  );
  const willAnimateRightColumnRef = useRef(false);
  const [isNarrowMessageList, setIsNarrowMessageList] =
    useState(isRightColumnOpen);

  // Handle opening right column
  useSyncEffect(
    ([prevIsRightColumnOpen]) => {
      if (
        prevIsRightColumnOpen === undefined ||
        isRightColumnOpen === prevIsRightColumnOpen
      ) {
        return;
      }

      if (animationLevel === 0) {
        setIsNarrowMessageList(isRightColumnOpen);
        return;
      }

      willAnimateRightColumnRef.current = true;

      const dispatchHeavyAnimationEnd = dispatchHeavyAnimationEvent();

      waitForTransitionEnd(document.getElementById('RightColumn')!, () => {
        dispatchHeavyAnimationEnd();
        willAnimateRightColumnRef.current = false;
        forceUpdate();
        setIsNarrowMessageList(isRightColumnOpen);
      });
    },
    [isRightColumnOpen, animationLevel, forceUpdate]
  );

  const className = classNames({
    'left-column-shown': leftColumnTransition.hasShownClass,
    'left-column-open': leftColumnTransition.hasOpenClass,
    'left-column-animating': willAnimateLeftColumnRef.current,
    'right-column-shown': rightColumnTransition.hasShownClass,
    'right-column-open': rightColumnTransition.hasOpenClass,
    'right-column-animating': willAnimateRightColumnRef.current,
    'narrow-message-list': isNarrowMessageList,
    'history-animation-disabled': shouldSkipHistoryAnimations,
    'suport-content': support === SettingsScreens.Support,
  });

  const handleBlur = useCallback(() => {
    onTabFocusChange({ isBlurred: true });
  }, [onTabFocusChange]);

  const handleFocus = useCallback(() => {
    onTabFocusChange({ isBlurred: false });

    if (!document.title.includes(INACTIVE_MARKER)) {
      updatePageTitle();
    }

    updateIcon(false);
  }, [onTabFocusChange, updatePageTitle]);

  const handleStickerSetModalClose = useCallback(() => {
    closeStickerSetModal();
  }, [closeStickerSetModal]);

  const handleCustomEmojiSetsModalClose = useCallback(() => {
    closeCustomEmojiSets();
  }, [closeCustomEmojiSets]);

  const onSelectChatMenu = useLastCallback(() => {
    setLeftScreen({ screen: LeftColumnContent.ChatList });
    setMiddleScreen({ screen: MiddleColumnContent.Messages });
    setSettingsScreen(SettingsScreens.Main);
  });

  // Online status and browser tab indicators
  useBackgroundMode(handleBlur, handleFocus);
  useBeforeUnload(handleBlur);
  usePreventPinchZoomGesture(isMediaViewerOpen);

  return (
    <div id='Main' className={className}>
      <>
        <LeftColumn
          settingsScreen={settingsScreen}
          setSettingsScreen={setSettingsScreen}
          handleCalls={handleCalls}
          openCall={openCall}
          setsupport={setsupport}
          isLeftShown={isLeftColumnOpen!}
          feedLeftScreen={feedLeftScreen}
          feedMiddleScreen={feedMiddleScreen}
          setFeedLeftScreen={setFeedLeftScreen}
          setFeedMiddleScreen={setFeedMiddleScreen}
        />
        <MiddleColumn
          settingsScreen={settingsScreen}
          setSettingsScreen={setSettingsScreen}
          isMobile={isMobile}
          handleCalls={handleCalls}
          onSelectChatMenu={onSelectChatMenu}
          feedMiddleScreen={feedMiddleScreen}
          setFeedMiddleScreen={setFeedMiddleScreen}
        />
        <RightColumn
          isMobile={isMobile!}
          isTablet={isTablet!}
          isLeftShown={isLeftColumnOpen!}
          lastSyncTime={lastSyncTime}
        />
        <MediaViewer isOpen={isMediaViewerOpen} />
        <ForwardRecipientPicker isOpen={isForwardModalOpen} />
        <Dialogs isOpen={hasDialogs} setSettingsScreen={setSettingsScreen} />
        <HistoryCalendar isOpen={isHistoryCalendarOpen} />

        <NewContactModal
          isOpen={Boolean(newContactUserId || newContactByPhoneNumber)}
          userId={newContactUserId}
          isByPhoneNumber={newContactByPhoneNumber}
        />
        <ConfettiContainer />
        {activeGroupCallId && <GroupCall groupCallId={activeGroupCallId} />}
        <ActiveCallHeader
          isActive={Boolean(activeGroupCallId || isPhoneCallActive)}
        />
        <PhoneCall isActive={isPhoneCallActive} />
        <RatePhoneCallModal isOpen={isRatePhoneCallModalOpen} />
        <MessageListHistoryHandler />
        <TwoFaEmailCodeModal />
        <DownloadManager />
        <DraftRecipientPicker requestedDraft={requestedDraft} />
        {audioMessage && (
          <AudioPlayer key={audioMessage.id} message={audioMessage} noUi />
        )}
        <PremiumLimitReachedModal limit={limitReached} />
        <UnreadCount isForAppBadge />
        {/* <Notifications isOpen={hasNotifications} /> */}
        {/*
      <SafeLinkModal url={safeLinkModalUrl} />
      <UrlAuthModal urlAuth={urlAuth} currentUser={currentUser} />*/}

        {/*<StickerSetModal
        isOpen={Boolean(openedStickerSetShortName)}
        onClose={handleStickerSetModalClose}
        stickerSetShortName={openedStickerSetShortName}
      />
      <CustomEmojiSetsModal
        customEmojiSetIds={openedCustomEmojiSetIds}
        onClose={handleCustomEmojiSetsModalClose}
      />
        
    
      <GameModal openedGame={openedGame} gameTitle={gameTitle} />
      <WebAppModal webApp={webApp} />
            
      
      <BotTrustModal bot={botTrustRequestBot} type={botTrustRequest?.type} />
      <AttachBotInstallModal bot={attachBotToInstall} />
      <AttachBotRecipientPicker
        requestedAttachBotInChat={requestedAttachBotInChat}
      />
      
      {isPremiumModalOpen && <PremiumMainModal isOpen={isPremiumModalOpen} />}
      
      <PaymentModal isOpen={isPaymentModalOpen} onClose={closePaymentModal} />
      <ReceiptModal isOpen={isReceiptModalOpen} onClose={clearReceipt} />
      <DeleteFolderDialog deleteFolderDialogId={deleteFolderDialogId} /> */}
      </>
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { isMobile }): StateProps => {
    const {
      settings: {
        byKey: { animationLevel, language, wasTimeFormatSetManually },
      },
      lastSyncTime,
    } = global;

    const {
      botTrustRequest,
      requestedAttachBotInstall,
      requestedAttachBotInChat,
      requestedDraft,
      urlAuth,
      webApp,
      safeLinkModalUrl,
      openedStickerSetShortName,
      openedCustomEmojiSetIds,
      shouldSkipHistoryAnimations,
      openedGame,
      audioPlayer,
      historyCalendarSelectedAt,
      notifications,
      dialogs,
      newContact,
      ratingPhoneCall,
      premiumModal,
      isMasterTab,
      payment,
      limitReachedModal,
      deleteFolderDialogModal,
      middleScreen,
      leftScreen,
    } = selectTabState(global);

    const { chatId: audioChatId, messageId: audioMessageId } = audioPlayer;
    const audioMessage =
      audioChatId && audioMessageId
        ? selectChatMessage(global, audioChatId, audioMessageId)
        : undefined;
    const gameMessage =
      openedGame &&
      selectChatMessage(global, openedGame.chatId, openedGame.messageId);
    const gameTitle = gameMessage?.content.game?.title;
    const currentUser = global.currentUserId
      ? selectUser(global, global.currentUserId)
      : undefined;
    const { chatId } = selectCurrentMessageList(global) || {};

    return {
      lastSyncTime,
      isMiddleColumnOpen: Boolean(
        chatId ||
          middleScreen === MiddleColumnContent.QuickLinks ||
          [LeftColumnContent.Feed, LeftColumnContent.Settings].includes(
            leftScreen
          )
      ),
      isRightColumnOpen: selectIsRightColumnShown(global, isMobile),
      isMediaViewerOpen: selectIsMediaViewerOpen(global),
      isForwardModalOpen: selectIsForwardModalOpen(global),
      hasNotifications: Boolean(notifications.length),
      hasDialogs: Boolean(dialogs.length),
      audioMessage,
      safeLinkModalUrl,
      isHistoryCalendarOpen: Boolean(historyCalendarSelectedAt),
      shouldSkipHistoryAnimations,
      openedStickerSetShortName,
      openedCustomEmojiSetIds,
      isServiceChatReady: selectIsServiceChatReady(global),
      activeGroupCallId: isMasterTab
        ? global.groupCalls.activeGroupCallId
        : undefined,
      animationLevel,
      language,
      wasTimeFormatSetManually,
      isPhoneCallActive: isMasterTab ? Boolean(global.phoneCall) : undefined,
      addedSetIds: global.stickers.added.setIds,
      addedCustomEmojiIds: global.customEmojis.added.setIds,
      newContactUserId: newContact?.userId,
      newContactByPhoneNumber: newContact?.isByPhoneNumber,
      openedGame,
      gameTitle,
      isRatePhoneCallModalOpen: Boolean(ratingPhoneCall),
      botTrustRequest,
      botTrustRequestBot:
        botTrustRequest && selectUser(global, botTrustRequest.botId),
      attachBotToInstall: requestedAttachBotInstall?.bot,
      requestedAttachBotInChat,
      webApp,
      currentUser,
      urlAuth,
      isCurrentUserPremium: selectIsCurrentUserPremium(global),
      isPremiumModalOpen: premiumModal?.isOpen,
      limitReached: limitReachedModal?.limit,
      isPaymentModalOpen: payment.isPaymentModalOpen,
      isReceiptModalOpen: Boolean(payment.receipt),
      deleteFolderDialogId: deleteFolderDialogModal,
      isMasterTab,
      requestedDraft,
      middleScreen,
      leftScreen,
      isLeftColumnOpen: selectTabState(global).isLeftColumnShown,
    };
  })(Main)
);
