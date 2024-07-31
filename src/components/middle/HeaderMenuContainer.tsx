import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getActions, withGlobal } from '../../global';

import type { ApiBotCommand, ApiChat, ApiUser } from '../../api/types';
import {
  MiddleColumnContent,
  type IAnchorPosition,
  ThreadId,
} from '../../types';
import { MAIN_THREAD_ID } from '../../api/types';

import { AI_BOT_ID, REPLIES_USER_ID } from '../../config';
import { disableScrolling, enableScrolling } from '../../util/scrollLock';
import {
  selectChat,
  selectNotifySettings,
  selectNotifyExceptions,
  selectUser,
  selectChatBot,
  selectIsPremiumPurchaseBlocked,
  selectCurrentMessageList,
  selectTabState,
  selectIsRightColumnShown,
  selectIsChatWithSelf,
  selectUserFullInfo,
} from '../../global/selectors';
import {
  isUserId,
  getCanDeleteChat,
  selectIsChatMuted,
  getCanAddContact,
  isChatChannel,
  isChatGroup,
  getCanManageTopic,
  isUserRightBanned,
  getHasAdminRight,
  isUserBot,
  isChatPublic,
  isUserPrivate,
} from '../../global/helpers';
import useShowTransition from '../../hooks/useShowTransition';
import usePrevDuringAnimation from '../../hooks/usePrevDuringAnimation';
import useAppLayout from '../../hooks/useAppLayout';

import Portal from '../ui/Portal';
import Menu from '../ui/Menu';
import MenuItem from '../ui/MenuItem';
import MenuSeparator from '../ui/MenuSeparator';
import DeleteChatModal from '../common/DeleteChatModal';
import ReportModal from '../common/ReportModal';

import './HeaderMenuContainer.scss';
import { useTranslation } from 'react-i18next';
import IconSvg from '../ui/IconSvg';
import useLastCallback from '../../hooks/useLastCallback';
import ConfirmDialog from '../ui/ConfirmDialog';
import useFlag from '../../hooks/useFlag';
import ClearChatHistoryModal from '../common/ClearChatHistoryModal';

const BOT_BUTTONS: Record<string, { icon: string; label: string }> = {
  settings: {
    icon: 'bots',
    label: 'BotSettings',
  },
  privacy: {
    icon: 'info',
    label: 'Privacy',
  },
  help: {
    icon: 'help',
    label: 'BotHelp',
  },
};

export type OwnProps = {
  chatId: string;
  threadId: ThreadId;
  isOpen: boolean;
  withExtraActions: boolean;
  anchor: IAnchorPosition;
  isChannel?: boolean;
  canStartBot?: boolean;
  canRestartBot?: boolean;
  canSubscribe?: boolean;
  canSearch?: boolean;
  canCall?: boolean;
  canMute?: boolean;
  canViewStatistics?: boolean;
  withForumActions?: boolean;
  canLeave?: boolean;
  canEnterVoiceChat?: boolean;
  canCreateVoiceChat?: boolean;
  pendingJoinRequests?: number;
  onSubscribeChannel: () => void;
  onSearchClick: () => void;
  onAsMessagesClick: () => void;
  onClose: () => void;
  onCloseAnimationEnd: () => void;
  onJoinRequestsClick?: () => void;
};

type StateProps = {
  chat?: ApiChat;
  isChatBot?: boolean;
  botCommands?: ApiBotCommand[];
  isPrivate?: boolean;
  isChatPrivate?: boolean;
  isMuted?: boolean;
  isTopic?: boolean;
  isForum?: boolean;
  canAddContact?: boolean;
  canShareContact?: boolean;
  canReportChat?: boolean;
  canDeleteChat?: boolean;
  canGiftPremium?: boolean;
  canCreateTopic?: boolean;
  canEditTopic?: boolean;
  hasLinkedChat?: boolean;
  isChatInfoShown?: boolean;
  isRightColumnShown?: boolean;
  canManage?: boolean;
  currentUserId?: string;
  isBlocked?: boolean;
  isChatWithSelf?: boolean;
};

const CLOSE_MENU_ANIMATION_DURATION = 200;

const HeaderMenuContainer: FC<OwnProps & StateProps> = ({
  chatId,
  isChatBot,
  threadId,
  isOpen,
  withExtraActions,
  anchor,
  isChannel,
  botCommands,
  withForumActions,
  isTopic,
  isForum,
  isChatInfoShown,
  canStartBot,
  canRestartBot,
  canSubscribe,
  canSearch,
  canCall,
  canMute,
  canViewStatistics,
  pendingJoinRequests,
  canLeave,
  canEnterVoiceChat,
  canCreateVoiceChat,
  chat,
  isPrivate,
  isChatPrivate,
  isMuted,
  canReportChat,
  canDeleteChat,
  canManage,
  canGiftPremium,
  hasLinkedChat,
  canAddContact,
  canShareContact,
  canCreateTopic,
  canEditTopic,
  isRightColumnShown,
  currentUserId,
  isBlocked,
  isChatWithSelf,
  onJoinRequestsClick,
  onSubscribeChannel,
  onSearchClick,
  onAsMessagesClick,
  onClose,
  onCloseAnimationEnd,
}) => {
  const {
    updateChatMutedState,
    enterMessageSelectMode,
    sendBotCommand,
    restartBot,
    requestMasterAndJoinGroupCall,
    createGroupCall,
    openLinkedChat,
    openAddContactDialog,
    requestMasterAndRequestCall,
    toggleStatistics,
    deleteHistory,
    openChatWithInfo,
    openCreateTopicPanel,
    openEditTopicPanel,
    openChat,
    toggleManagement,
    openForwardMenu,
    setMiddleScreen,
    blockContact,
    unblockContact,
    showNotification,
  } = getActions();

  const { isMobile } = useAppLayout();
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [shouldCloseFast, setShouldCloseFast] = useState(false);
  const [isMuteModalOpen, setIsMuteModalOpen] = useState(false);
  const [isOpenClearHistory, setIsOpenClearHistory] = useState(false);

  const { x, y } = anchor;

  useShowTransition(isOpen, onCloseAnimationEnd, undefined, false);
  const isViewGroupInfoShown = usePrevDuringAnimation(
    !isChatInfoShown && isForum ? true : undefined,
    CLOSE_MENU_ANIMATION_DURATION
  );

  const handleReport = useCallback(() => {
    setIsMenuOpen(false);
    setIsReportModalOpen(true);
  }, []);

  const closeReportModal = useLastCallback(() => {
    setIsReportModalOpen(false);
    onClose();
  });

  const closeMuteModal = useLastCallback(() => {
    setIsMuteModalOpen(false);
    onClose();
  });

  const handleDelete = useCallback(() => {
    setIsMenuOpen(false);
    setIsDeleteModalOpen(true);
  }, []);

  const closeMenu = useLastCallback(() => {
    setIsMenuOpen(false);
    onClose();
  });

  const handleClearHistory = useLastCallback(() => {
    setIsOpenClearHistory(true);
    setIsMenuOpen(false);
  });

  const closeClearHistoryModal = useLastCallback(() => {
    setIsOpenClearHistory(false);
    closeMenu();
  });

  const handleViewGroupInfo = useLastCallback(() => {
    openChatWithInfo({ id: chatId, threadId });
    setShouldCloseFast(!isRightColumnShown);
    closeMenu();
  });

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    onClose();
  }, [onClose]);

  const handleStartBot = useCallback(() => {
    sendBotCommand({ command: '/start' });
  }, [sendBotCommand]);

  const handleRestartBot = useCallback(() => {
    restartBot({ chatId });
  }, [chatId, restartBot]);

  const handleToggleMuteClick = useCallback(() => {
    updateChatMutedState({ chatId, isMuted: !isMuted });
    closeMenu();
  }, [chatId, closeMenu, isMuted, updateChatMutedState]);

  const handleCreateTopicClick = useLastCallback(() => {
    openCreateTopicPanel({ chatId });
    setShouldCloseFast(!isRightColumnShown);
    closeMenu();
  });

  const handleEditTopicClick = useLastCallback(() => {
    openEditTopicPanel({ chatId, topicId: Number(threadId) });
  });

  const handleViewAsTopicsClick = useCallback(() => {
    openChat({ id: undefined });
    closeMenu();
  }, [closeMenu, openChat]);

  const handleEnterVoiceChatClick = useCallback(() => {
    if (canCreateVoiceChat) {
      // TODO Show popup to schedule
      createGroupCall({
        chatId,
      });
    } else {
      requestMasterAndJoinGroupCall({
        chatId,
      });
    }
    closeMenu();
  }, [
    closeMenu,
    canCreateVoiceChat,
    chatId,
    requestMasterAndJoinGroupCall,
    createGroupCall,
  ]);

  const handleLinkedChatClick = useCallback(() => {
    openLinkedChat({ id: chatId });
    closeMenu();
  }, [chatId, closeMenu, openLinkedChat]);

  const handleAddContactClick = useCallback(() => {
    openAddContactDialog({ userId: chatId });
    closeMenu();
  }, [openAddContactDialog, chatId, closeMenu]);

  const handleShareContactClick = useCallback(() => {
    if (isChatPrivate) {
      showNotification({
        message: t('UserProfileIsPrivate'),
      });
    } else {
      openForwardMenu({ fromChatId: currentUserId!, contactId: chatId });
    }
    closeMenu();
  }, [openForwardMenu, chatId, closeMenu]);

  const handleSubscribe = useCallback(() => {
    onSubscribeChannel();
    closeMenu();
  }, [closeMenu, onSubscribeChannel]);

  const handleVideoCall = useCallback(() => {
    requestMasterAndRequestCall({ userId: chatId, isVideo: true });
    closeMenu();
  }, [chatId, closeMenu, requestMasterAndRequestCall]);

  const handleCall = useCallback(() => {
    requestMasterAndRequestCall({ userId: chatId });
    closeMenu();
  }, [chatId, closeMenu, requestMasterAndRequestCall]);

  const handleSearch = useCallback(() => {
    onSearchClick();
    closeMenu();
  }, [closeMenu, onSearchClick]);

  const handleStatisticsClick = useLastCallback(() => {
    toggleStatistics();
    setMiddleScreen({ screen: MiddleColumnContent.Statistics });
    closeMenu();
  });

  const handleSelectMessages = useCallback(() => {
    enterMessageSelectMode();
    closeMenu();
  }, [closeMenu, enterMessageSelectMode]);

  const handleOpenAsMessages = useCallback(() => {
    onAsMessagesClick();
    closeMenu();
  }, [closeMenu, onAsMessagesClick]);

  const handleToggleManagement = useLastCallback(() => {
    toggleManagement();
    closeMenu();
  });

  const handleBlock = useLastCallback(() => {
    blockContact({ contactId: chatId, accessHash: chat?.accessHash! });
    closeMenu();
  });

  const handleUnblock = useLastCallback(() => {
    unblockContact({ contactId: chatId });
    closeMenu();
  });

  // useEffect(() => {
  //   disableScrolling();
  //   return enableScrolling;
  // }, []);

  const { t } = useTranslation();

  const botButtons = useMemo(() => {
    return botCommands?.map(({ command }) => {
      const cmd = BOT_BUTTONS[command];
      if (!cmd) return undefined;
      const handleClick = () => {
        sendBotCommand({ command: `/${command}` });
        closeMenu();
      };

      return (
        <MenuItem key={command} icon={cmd.icon} onClick={handleClick}>
          {t(cmd.label)}
        </MenuItem>
      );
    });
  }, [botCommands, closeMenu, t, sendBotCommand]);

  return (
    <Portal>
      <div className='HeaderMenuContainer'>
        <Menu
          isOpen={isMenuOpen}
          positionX='right'
          style={{ left: `${x}px`, top: `${y}px` }}
          onClose={closeMenu}
          shouldCloseFast={shouldCloseFast}
          backdropExcludedSelector='Button'
        >
          {isMobile && canSearch && (
            <MenuItem
              customIcon={<IconSvg name='search' />}
              onClick={handleSearch}
            >
              {t('Search')}
            </MenuItem>
          )}
          {/* {isMobile && canCall && (
            <MenuItem
              customIcon={<IconSvg name='calls' />}
              onClick={handleCall}
            >
              Call
            </MenuItem>
          )} */}
          {/* {canCall && (
            <MenuItem
              customIcon={<IconSvg name='video-call' />}
              onClick={handleVideoCall}
            >
              {t('VideoCall')}
            </MenuItem>
          )} */}
          {withForumActions && canCreateTopic && (
            <>
              <MenuItem icon='comments' onClick={handleCreateTopicClick}>
                {t('lng_forum_create_topic')}
              </MenuItem>
              <MenuSeparator />
            </>
          )}
          {isViewGroupInfoShown && (
            <MenuItem icon='info' onClick={handleViewGroupInfo}>
              {isTopic
                ? t('lng_context_view_topic')
                : t('lng_context_view_group')}
            </MenuItem>
          )}
          {canEditTopic && (
            <MenuItem icon='edit' onClick={handleEditTopicClick}>
              {t('lng_forum_topic_edit')}
            </MenuItem>
          )}
          {isMobile && !withForumActions && isForum && !isTopic && (
            <MenuItem icon='forums' onClick={handleViewAsTopicsClick}>
              {t('Chat.ContextViewAsTopics')}
            </MenuItem>
          )}
          {withForumActions && Boolean(pendingJoinRequests) && (
            <MenuItem icon='user' onClick={onJoinRequestsClick}>
              {isChannel ? t('SubscribeRequests') : t('MemberRequests')}
              <div className='right-badge'>{pendingJoinRequests}</div>
            </MenuItem>
          )}
          {withForumActions && !isTopic && (
            <MenuItem icon='message' onClick={handleOpenAsMessages}>
              {t('lng_forum_view_as_messages')}
            </MenuItem>
          )}
          {withExtraActions && canStartBot && (
            <MenuItem icon='bots' onClick={handleStartBot}>
              {t('BotStart')}
            </MenuItem>
          )}
          {withExtraActions && canRestartBot && (
            <MenuItem icon='bots' onClick={handleRestartBot}>
              {t('BotRestart')}
            </MenuItem>
          )}
          {withExtraActions && canSubscribe && (
            <MenuItem
              icon={isChannel ? 'channel' : 'group'}
              onClick={handleSubscribe}
            >
              {t(isChannel ? 'ProfileJoinChannel' : 'ProfileJoinGroup')}
            </MenuItem>
          )}
          {canAddContact && (
            <MenuItem
              customIcon={<IconSvg name='user-plus' />}
              onClick={handleAddContactClick}
            >
              {t('AddContact')}
            </MenuItem>
          )}

          {canManage && !isChatBot && (
            <MenuItem
              customIcon={<IconSvg name='edit' />}
              onClick={handleToggleManagement}
            >
              {t('Edit')}
            </MenuItem>
          )}
          {canShareContact && (
            <MenuItem
              customIcon={<IconSvg name='forward' />}
              onClick={handleShareContactClick}
            >
              {t('Share')}
            </MenuItem>
          )}

          {canMute && !isChatBot && (
            <MenuItem
              customIcon={<IconSvg name={isMuted ? 'unmute' : 'mute'} />}
              onClick={handleToggleMuteClick}
            >
              {t(isMuted ? 'Unmute' : 'Mute')}
            </MenuItem>
          )}
          {/* {(canEnterVoiceChat || canCreateVoiceChat) && (
            <MenuItem icon='voice-chat' onClick={handleEnterVoiceChatClick}>
              {t(canCreateVoiceChat ? 'StartVoipChat' : 'VoipGroupJoinCall')}
            </MenuItem>
          )} */}
          {hasLinkedChat && (
            <MenuItem
              icon={isChannel ? 'comments' : 'channel'}
              onClick={handleLinkedChatClick}
            >
              {t(isChannel ? 'ViewDiscussion' : 'lng_profile_view_channel')}
            </MenuItem>
          )}
          {!withForumActions && !isChannel && !isChatBot && (
            <MenuItem
              customIcon={<IconSvg name='select' />}
              onClick={handleSelectMessages}
            >
              {t('ReportPeer.SelectMessages')}
            </MenuItem>
          )}
          {canViewStatistics && (
            <MenuItem
              customIcon={<IconSvg name='chart' />}
              onClick={handleStatisticsClick}
            >
              {t('Chat.Statistics')}
            </MenuItem>
          )}
          {canReportChat && !isChatBot && (
            <MenuItem
              customIcon={<IconSvg name='error' />}
              onClick={handleReport}
            >
              {t('ReportPeer.Report')}
            </MenuItem>
          )}
          {botButtons}
          {/* {canGiftPremium && (
            <MenuItem icon='gift' onClick={handleGiftPremiumClick}>
              {t('GiftPremium')}
            </MenuItem>
          )} */}
          {isPrivate && !isChatBot && (
            <MenuItem
              customIcon={<IconSvg name='broom' />}
              onClick={handleClearHistory}
            >
              {t('Chat.ClearHistory')}
            </MenuItem>
          )}
          {canLeave && (
            <MenuItem
              customIcon={<IconSvg name='delete' />}
              onClick={handleDelete}
            >
              {t(
                isPrivate
                  ? 'DeleteChat'
                  : canDeleteChat
                  ? 'GroupInfo.DeleteAndExit'
                  : isChannel
                  ? 'Channel.Leave'
                  : 'Group.Leave'
              )}
            </MenuItem>
          )}
          {isPrivate && !isChatWithSelf && !isChatBot && (
            <MenuItem
              customIcon={<IconSvg name={isBlocked ? 'unblock' : 'block'} />}
              onClick={isBlocked ? handleUnblock : handleBlock}
            >
              {isBlocked ? t('UnblockUser') : t('BlockUser')}
            </MenuItem>
          )}
        </Menu>
        {chat && (
          <ClearChatHistoryModal
            isOpen={isOpenClearHistory}
            onClose={closeClearHistoryModal}
            chat={chat!}
          />
        )}

        {chat && (
          <DeleteChatModal
            isOpen={isDeleteModalOpen}
            onClose={closeDeleteModal}
            chat={chat}
          />
        )}
        {canReportChat && chat?.id && (
          <ReportModal
            isOpen={isReportModalOpen}
            onClose={closeReportModal}
            subject='peer'
            chatId={chat.id}
          />
        )}
      </div>
    </Portal>
  );
};

export default memo(
  withGlobal<OwnProps>((global, { chatId, threadId }): StateProps => {
    const chat = selectChat(global, chatId);
    if (!chat || chat.isRestricted) {
      return {};
    }
    const isPrivate = isUserId(chat.id);

    const user = isPrivate ? selectUser(global, chatId) : undefined;
    const isChatPrivate = user && isUserPrivate(user);
    const canAddContact = user && getCanAddContact(user);
    const isMainThread = threadId === MAIN_THREAD_ID;

    const canReportChat =
      isMainThread &&
      (isChatChannel(chat) || isChatGroup(chat) || (user && !user.isSelf));
    const { chatId: currentChatId, threadId: currentThreadId } =
      selectCurrentMessageList(global) || {};

    const chatBot =
      chatId !== REPLIES_USER_ID ? selectChatBot(global, chatId) : undefined;
    const userFullInfo = isPrivate
      ? selectUserFullInfo(global, chatId)
      : undefined;
    const canGiftPremium = Boolean(
      global.lastSyncTime &&
        user?.fullInfo?.premiumGifts?.length &&
        !selectIsPremiumPurchaseBlocked(global)
    );

    const isChatWithSelf = selectIsChatWithSelf(global, chatId);

    const topic = chat?.topics?.[threadId];
    const canCreateTopic =
      chat.isForum &&
      (chat.isCreator ||
        !isUserRightBanned(chat, 'manageTopics') ||
        getHasAdminRight(chat, 'manageTopics'));
    const canEditTopic = topic && getCanManageTopic(chat, topic);
    const canManage = Boolean(
      !canAddContact &&
        chat &&
        !selectIsChatWithSelf(global, chat.id) &&
        isUserId(chat.id)
    );

    return {
      chat,
      isMuted: selectIsChatMuted(
        chat,
        selectNotifySettings(global),
        selectNotifyExceptions(global)
      ),
      isPrivate,
      isChatPrivate,
      isChatBot: Boolean(chatBot),
      isTopic: chat?.isForum && !isMainThread,
      isForum: chat?.isForum,
      canAddContact,
      canShareContact: Boolean(user),
      canReportChat,
      canDeleteChat: getCanDeleteChat(chat),
      canGiftPremium,
      hasLinkedChat: Boolean(chat?.fullInfo?.linkedChatId),
      botCommands: chatBot?.fullInfo?.botInfo?.commands,
      isChatInfoShown:
        selectTabState(global).isChatInfoShown &&
        currentChatId === chatId &&
        currentThreadId === threadId,
      canCreateTopic,
      canEditTopic,
      canManage,
      currentUserId: global.currentUserId,
      isRightColumnShown: selectIsRightColumnShown(global),
      isBlocked: userFullInfo?.isBlocked,
      isChatWithSelf,
    };
  })(HeaderMenuContainer)
);
