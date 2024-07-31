import React, { FC, memo, useRef, useCallback, useState } from 'react';
import { getActions, withGlobal } from '../../global';

import type { MessageListType } from '../../global/types';
import { MAIN_THREAD_ID } from '../../api/types';
import type { IAnchorPosition, ThreadId } from '../../types';
import { ManagementScreens } from '../../types';

import { AI_BOT_ID, ANIMATION_LEVEL_MIN } from '../../config';
import { ARE_CALLS_SUPPORTED, IS_PWA } from '../../util/windowEnvironment';
import {
  isBotSpace,
  isChatAdmin,
  isChatBasicGroup,
  isChatChannel,
  isChatSuperGroup,
  isUserId,
} from '../../global/helpers';
import {
  selectChat,
  selectChatBot,
  selectIsUserBlocked,
  selectIsChatBotNotStarted,
  selectIsChatWithSelf,
  selectIsInSelectMode,
  selectIsRightColumnShown,
} from '../../global/selectors';
import { useHotkeys } from '../../hooks/useHotkeys';

import Button from '../ui/Button';
import HeaderMenuContainer from './HeaderMenuContainer.async';
import { useTranslation } from 'react-i18next';
import IconSvg from '../ui/IconSvg';

import useLastCallback from '../../hooks/useLastCallback';

interface OwnProps {
  chatId: string;
  threadId: ThreadId;
  messageListType: MessageListType;
  canExpandActions: boolean;
  withForumActions?: boolean;
  isMobile?: boolean;
  onTopicSearch?: NoneToVoidFunction;
}

interface StateProps {
  noMenu?: boolean;
  isChannel?: boolean;
  isRightColumnShown?: boolean;
  canStartBot?: boolean;
  canRestartBot?: boolean;
  canSubscribe?: boolean;
  canSearch?: boolean;
  canCall?: boolean;
  canMute?: boolean;
  canViewStatistics?: boolean;
  canLeave?: boolean;
  canEnterVoiceChat?: boolean;
  canCreateVoiceChat?: boolean;
  pendingJoinRequests?: number;
  shouldJoinToSend?: boolean;
  shouldSendJoinRequest?: boolean;
  noAnimation?: boolean;
  canUnblock?: boolean;
}

// Chrome breaks layout when focusing input during transition
const SEARCH_FOCUS_DELAY_MS = 320;

const HeaderActions: FC<OwnProps & StateProps> = ({
  chatId,
  threadId,
  noMenu,
  isMobile,
  isChannel,
  canStartBot,
  canRestartBot,
  canSubscribe,
  canSearch,
  canCall,
  canMute,
  canViewStatistics,
  canLeave,
  canEnterVoiceChat,
  canCreateVoiceChat,
  pendingJoinRequests,
  isRightColumnShown,
  withForumActions,
  canExpandActions,
  shouldJoinToSend,
  shouldSendJoinRequest,
  noAnimation,
  canUnblock,
  onTopicSearch,
}) => {
  const {
    joinChannel,
    sendBotCommand,
    openLocalTextSearch,
    restartBot,
    requestMasterAndRequestCall,
    requestNextManagementScreen,
    showNotification,
    openChat,
    unblockContact,
  } = getActions();
  // eslint-disable-next-line no-null/no-null
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<IAnchorPosition | undefined>(
    undefined
  );
  const isAiBot = chatId === AI_BOT_ID;
  const handleHeaderMenuOpen = useLastCallback(() => {
    setIsMenuOpen(true);
    const rect = menuButtonRef.current!.getBoundingClientRect();
    setMenuPosition({ x: rect.right, y: rect.bottom });
  });

  const handleHeaderMenuClose = useLastCallback(() => {
    setIsMenuOpen(false);
  });

  const handleHeaderMenuHide = useCallback(() => {
    setMenuPosition(undefined);
  }, []);

  const handleSubscribeClick = useCallback(() => {
    joinChannel({ chatId });
    if (shouldSendJoinRequest) {
      showNotification({
        message: isChannel
          ? t('RequestToJoinChannelSentDescription')
          : t('RequestToJoinGroupSentDescription'),
      });
    }
  }, [joinChannel, chatId, shouldSendJoinRequest, showNotification, isChannel]);

  const handleStartBot = useCallback(() => {
    sendBotCommand({ command: '/start' });
  }, [sendBotCommand]);

  const handleRestartBot = useCallback(() => {
    restartBot({ chatId });
  }, [chatId, restartBot]);

  const handleJoinRequestsClick = useCallback(() => {
    requestNextManagementScreen({ screen: ManagementScreens.JoinRequests });
  }, [requestNextManagementScreen]);

  const handleSearchClick = useCallback(() => {
    if (withForumActions) {
      onTopicSearch?.();
      return;
    }

    openLocalTextSearch();

    if (isMobile) {
      // iOS requires synchronous focus on user event.
      const searchInput = document.querySelector<HTMLInputElement>(
        '#MobileSearch input'
      )!;
      searchInput.focus();
    } else if (noAnimation) {
      // The second RAF is necessary because teact must update the state and render the async component
      requestAnimationFrame(() => {
        requestAnimationFrame(setFocusInSearchInput);
      });
    } else {
      setTimeout(setFocusInSearchInput, SEARCH_FOCUS_DELAY_MS);
    }
  }, [
    isMobile,
    noAnimation,
    onTopicSearch,
    openLocalTextSearch,
    withForumActions,
  ]);

  const handleAsMessagesClick = useCallback(() => {
    openChat({ id: chatId, threadId: MAIN_THREAD_ID });
  }, [chatId, openChat]);

  function handleRequestCall() {
    requestMasterAndRequestCall({ userId: chatId });
  }

  const handleVideoCall = useCallback(() => {
    requestMasterAndRequestCall({ userId: chatId, isVideo: true });
  }, [chatId, requestMasterAndRequestCall]);

  const handleUnblock = useLastCallback(() => {
    unblockContact({ contactId: chatId });
  });

  const handleHotkeySearchClick = useCallback(
    (e: KeyboardEvent) => {
      if (!canSearch || !IS_PWA || e.shiftKey) {
        return;
      }

      e.preventDefault();
      handleSearchClick();
    },
    [canSearch, handleSearchClick]
  );

  useHotkeys({
    'Mod+F': handleHotkeySearchClick,
  });

  return (
    <div className='HeaderActions'>
      {!isMobile && (
        <>
          {/* {canExpandActions &&
            !shouldSendJoinRequest &&
            (canSubscribe || shouldJoinToSend) && (
              <Button size='tiny' ripple fluid onClick={handleSubscribeClick}>
                {t(isChannel ? 'ProfileJoinChannel' : 'ProfileJoinGroup')}
              </Button>
            )}
          {canExpandActions && shouldSendJoinRequest && (
            <Button size='tiny' ripple fluid onClick={handleSubscribeClick}>
              {t(isChannel ? 'Channel.Subscribe' : 'Group.Join')}
            </Button>
          )} */}
          {canExpandActions && canStartBot && (
            <Button size='smaller' ripple fluid onClick={handleStartBot}>
              {t('BotStart')}
            </Button>
          )}
          {canExpandActions && canRestartBot && (
            <Button size='tiny' ripple fluid onClick={handleRestartBot}>
              {t('Restart')}
            </Button>
          )}
          {canExpandActions && canUnblock && (
            <Button size='tiny' ripple fluid onClick={handleUnblock}>
              {t('UnblockUser')}
            </Button>
          )}
          {canSearch && (
            <Button
              round
              ripple={isRightColumnShown}
              color='translucent'
              onClick={handleSearchClick}
              ariaLabel='Search in this chat'
            >
              <i className='icon-svg'>
                <IconSvg name='search' />
              </i>
            </Button>
          )}
          {/* {canCall && (
            <Button
              round
              color='translucent'
              className='activated'
              ariaLabel={t('VideoCall')}
              onClick={handleVideoCall}
            >
              <i className='icon-svg'>
                <IconSvg name='video-call' w='24' h='24' />
              </i>
            </Button>
          )} */}
          {/* {canCall && (
            <Button
              round
              color='translucent'
              className='activated'
              onClick={handleRequestCall}
              ariaLabel='Call'
            >
              <i className='icon-svg'>
                <IconSvg name='calls' w='24' h='24' />
              </i>
            </Button>
          )} */}
        </>
      )}
      {!withForumActions && Boolean(pendingJoinRequests) && (
        <Button
          round
          className='badge-button'
          ripple={isRightColumnShown}
          color='translucent'
          onClick={handleJoinRequestsClick}
          ariaLabel={String(
            isChannel ? t('SubscribeRequests') : t('MemberRequests')
          )}
        >
          <i className='icon-user' />
          <div className='badge'>{pendingJoinRequests}</div>
        </Button>
      )}
      <Button
        elRef={menuButtonRef}
        className={isMenuOpen ? 'active' : ''}
        round
        ripple={!isMobile}
        color='translucent'
        disabled={noMenu}
        ariaLabel='More actions'
        onClick={handleHeaderMenuOpen}
      >
        <i className='icon-svg'>
          <IconSvg name='filled' />
        </i>
      </Button>
      {menuPosition && (
        <HeaderMenuContainer
          chatId={chatId}
          threadId={threadId}
          isOpen={isMenuOpen}
          anchor={menuPosition}
          withExtraActions={isMobile || !canExpandActions}
          isChannel={isChannel}
          canStartBot={canStartBot}
          canRestartBot={canRestartBot}
          canSubscribe={canSubscribe}
          canSearch={canSearch}
          canCall={canCall}
          canMute={canMute}
          canViewStatistics={canViewStatistics}
          canLeave={canLeave}
          canEnterVoiceChat={canEnterVoiceChat}
          canCreateVoiceChat={canCreateVoiceChat}
          pendingJoinRequests={pendingJoinRequests}
          onJoinRequestsClick={handleJoinRequestsClick}
          withForumActions={withForumActions}
          onSubscribeChannel={handleSubscribeClick}
          onSearchClick={handleSearchClick}
          onAsMessagesClick={handleAsMessagesClick}
          onClose={handleHeaderMenuClose}
          onCloseAnimationEnd={handleHeaderMenuHide}
        />
      )}
    </div>
  );
};

export default memo(
  withGlobal<OwnProps>(
    (global, { chatId, threadId, messageListType, isMobile }): StateProps => {
      const chat = selectChat(global, chatId);
      const isChannel = Boolean(chat && isChatChannel(chat));
      const isPrivate = isUserId(chatId);
      if (!chat || chat.isRestricted || selectIsInSelectMode(global)) {
        return {
          noMenu: true,
        };
      }

      const bot = selectChatBot(global, chatId);
      const isChatWithSelf = selectIsChatWithSelf(global, chatId);
      const isMainThread =
        messageListType === 'thread' && threadId === MAIN_THREAD_ID;
      const isDiscussionThread =
        messageListType === 'thread' && threadId !== MAIN_THREAD_ID;
      const isRightColumnShown = selectIsRightColumnShown(global, isMobile);

      const canRestartBot = Boolean(bot && selectIsUserBlocked(global, bot.id));
      const canStartBot =
        !canRestartBot && Boolean(selectIsChatBotNotStarted(global, chatId));

      const canSubscribe = Boolean(
        (isMainThread || chat.isForum) &&
          (isChannel || isChatSuperGroup(chat)) &&
          chat.isNotJoined
      );
      const isUserBlocked = isPrivate
        ? selectIsUserBlocked(global, chatId)
        : false;
      const canUnblock = isUserBlocked && !bot;

      const isCreator = chat?.isCreator;
      const isAdmin = chat && isChatAdmin(chat);
      const canSearch = isMainThread || isDiscussionThread;
      //TODO ARE_CALLS_SUPPORTED
      const canCall = isUserId(chat.id) && !isChatWithSelf && !bot;

      const canMute =
        Boolean(
          isMainThread &&
            !isChatWithSelf &&
            !canSubscribe &&
            !isChatChannel(chat)
        ) ||
        isCreator ||
        isAdmin;
      const canLeave =
        isMainThread && !canSubscribe && !isBotSpace(global, chat.id);
      const canEnterVoiceChat =
        ARE_CALLS_SUPPORTED && isMainThread && chat.isCallActive;
      const canCreateVoiceChat =
        ARE_CALLS_SUPPORTED &&
        isMainThread &&
        !chat.isCallActive &&
        (chat.adminRights?.manageCall ||
          (chat.isCreator && isChatBasicGroup(chat)));
      const canViewStatistics =
        isMainThread && chat.fullInfo?.canViewStatistics;
      const pendingJoinRequests = isMainThread
        ? chat.fullInfo?.requestsPending
        : undefined;

      const shouldJoinToSend = Boolean(chat?.isNotJoined && chat.isJoinToSend);
      const shouldSendJoinRequest = Boolean(
        chat?.isNotJoined && chat.isJoinRequest
      );
      const noAnimation =
        global.settings.byKey.animationLevel === ANIMATION_LEVEL_MIN;

      return {
        noMenu: false,
        isChannel,
        isRightColumnShown,
        canStartBot,
        canRestartBot,
        canSubscribe,
        canSearch,
        canCall,
        canMute,
        canViewStatistics,
        canLeave,
        canEnterVoiceChat,
        canCreateVoiceChat,
        pendingJoinRequests,
        shouldJoinToSend,
        shouldSendJoinRequest,
        noAnimation,
        canUnblock,
      };
    }
  )(HeaderActions)
);

function setFocusInSearchInput() {
  const searchInput = document.querySelector<HTMLInputElement>(
    '.RightHeader .SearchInput input'
  );
  searchInput?.focus();
}
