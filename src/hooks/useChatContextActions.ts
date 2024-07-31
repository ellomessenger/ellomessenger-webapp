import { useCallback, useMemo } from 'react';
import { getActions } from '../global';

import type { ApiChat, ApiUser } from '../api/types';
import type { MenuItemContextAction } from '../components/ui/ListItem';

import {
  IS_ELECTRON,
  IS_OPEN_IN_NEW_TAB_SUPPORTED,
} from '../util/windowEnvironment';
import { SERVICE_NOTIFICATIONS_USER_ID } from '../config';
import {
  isChatArchived,
  getCanDeleteChat,
  isUserId,
  isChatChannel,
  isChatGroup,
} from '../global/helpers';
import { compact } from '../util/iteratees';
import { useTranslation } from 'react-i18next';

const useChatContextActions = (
  {
    chat,
    user,
    folderId,
    isPinned,
    isMuted,
    isFeed,
    canChangeFolder,
    handleDelete,
    handleChatFolderChange,
    handleReport,
    handleClearHistory,
  }: {
    chat: ApiChat | undefined;
    user: ApiUser | undefined;
    folderId?: number;
    isPinned?: boolean;
    isMuted?: boolean;
    isFeed?: boolean;
    canChangeFolder?: boolean;
    handleDelete: () => void;
    handleChatFolderChange: () => void;
    handleReport?: () => void;
    handleClearHistory?: () => void;
  },
  isInSearch = false
) => {
  const { t } = useTranslation();

  const { isSelf } = user || {};
  const isServiceNotifications = user?.id === SERVICE_NOTIFICATIONS_USER_ID;

  return useMemo(() => {
    if (!chat) {
      return undefined;
    }

    const {
      toggleChatPinned,
      updateChatMutedState,
      toggleChatArchived,
      toggleChatUnread,
      openChatInNewTab,
      toggleFeedChatPinned,
    } = getActions();

    const handlePinned = isFeed
      ? () => toggleFeedChatPinned({ chatId: chat.id })
      : () => toggleChatPinned({ id: chat.id, folderId: folderId! });

    const actionOpenInNewTab = IS_OPEN_IN_NEW_TAB_SUPPORTED && {
      title: t(IS_ELECTRON ? 'Open_in_new_window' : 'Open_new_tab'),
      icon: 'open-in-new-tab',
      handler: () => {
        openChatInNewTab({ chatId: chat.id });
      },
    };

    const actionAddToFolder = canChangeFolder
      ? {
          title: t('ChatList.Filter.AddToFolder'),
          icon: 'folder',
          handler: handleChatFolderChange,
        }
      : undefined;

    const actionPin = isPinned
      ? {
          title: t('Unpin'),
          icon: 'unpin',
          handler: handlePinned,
        }
      : {
          title: t('Pin'),
          icon: 'pin',
          handler: handlePinned,
        };

    if (isInSearch) {
      return compact([actionOpenInNewTab, actionPin, actionAddToFolder]);
    }

    const actionMaskAsRead =
      chat.unreadCount || chat.hasUnreadMark
        ? {
            title: t('MarkAsRead'),
            icon: 'readchats',
            handler: () => toggleChatUnread({ id: chat.id }),
          }
        : undefined;
    const actionMarkAsUnread =
      !(chat.unreadCount || chat.hasUnreadMark) && !chat.isForum
        ? {
            title: t('MarkAsUnread'),
            icon: 'unread',
            handler: () => toggleChatUnread({ id: chat.id }),
          }
        : undefined;

    const actionMute = isMuted
      ? {
          title: t('ChatList.Unmute'),
          icon: 'unmute',
          handler: () =>
            updateChatMutedState({ chatId: chat.id, isMuted: false }),
        }
      : {
          title: t('ChatList.Mute'),
          icon: 'mute',
          handler: () =>
            updateChatMutedState({ chatId: chat.id, isMuted: true }),
        };

    const actionArchive = isChatArchived(chat)
      ? {
          title: t('Unarchive'),
          icon: 'unarchive',
          handler: () => toggleChatArchived({ id: chat.id }),
        }
      : {
          title: t('Archive'),
          icon: 'archive',
          handler: () => toggleChatArchived({ id: chat.id }),
        };

    const canReport =
      handleReport &&
      (isChatChannel(chat) || isChatGroup(chat) || (user && !user.isSelf));
    const actionReport = canReport
      ? {
          title: t('ReportPeer.Report'),
          icon: 'flag',
          handler: handleReport,
        }
      : undefined;

    const actionDelete = {
      title: isUserId(chat.id)
        ? t('Delete')
        : t(
            getCanDeleteChat(chat)
              ? isChatChannel(chat)
                ? 'Channel.Delete'
                : 'Group.Delete'
              : isChatChannel(chat)
              ? 'Channel.Leave'
              : 'Group.Leave'
          ),
      icon: 'delete',
      handler: handleDelete,
    };

    const actionClearHistory = {
      title: t('Chat.ClearHistory'),
      icon: 'broom',
      handler: handleClearHistory,
    };

    const isInFolder = folderId !== undefined;

    return compact([
      actionOpenInNewTab,
      actionAddToFolder,
      actionMaskAsRead,
      actionMarkAsUnread,
      actionPin,
      !isSelf && actionMute,
      //!isSelf && !isServiceNotifications && !isInFolder && actionArchive,
      !!user && actionClearHistory,
      actionReport,
      actionDelete,
    ]) as MenuItemContextAction[];
  }, [
    chat,
    user,
    canChangeFolder,
    handleChatFolderChange,
    isPinned,
    isInSearch,
    isMuted,
    handleDelete,
    handleReport,
    folderId,
    isSelf,
    isServiceNotifications,
  ]);
};

export default useChatContextActions;
