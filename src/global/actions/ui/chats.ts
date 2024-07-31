import { addActionHandler, setGlobal } from '../../index';

import { ApiChat, MAIN_THREAD_ID } from '../../../api/types';

import {
  exitMessageSelectMode,
  replaceTabThreadParam,
  updateCurrentMessageList,
} from '../../reducers';
import {
  selectChat,
  selectCurrentMessageList,
  selectTabState,
  selectUser,
} from '../../selectors';
import { closeLocalTextSearch } from './localSearch';
import type { ActionReturnType } from '../../types';
import { updateTabState } from '../../reducers/tabs';
import { createMessageHashUrl } from '../../../util/routing';
import { getCurrentTabId } from '../../../util/establishMultitabRole';
import { LeftColumnContent, MiddleColumnContent } from '../../../types';
import { t } from 'i18next';
import { IS_ELECTRON } from '../../../util/windowEnvironment';

addActionHandler(
  'processOpenChatOrThread',
  (global, actions, payload): ActionReturnType => {
    const {
      chatId,
      threadId = MAIN_THREAD_ID,
      type = 'thread',
      shouldReplaceHistory = false,
      shouldReplaceLast = false,
      noForumTopicPanel,
      tabId = getCurrentTabId(),
    } = payload;

    const currentMessageList = selectCurrentMessageList(global, tabId);

    const tabState = selectTabState(global, tabId);
    if (tabState.premiumModal?.promo && tabState.premiumModal?.isOpen) {
      global = updateTabState(
        global,
        {
          premiumModal: {
            ...tabState.premiumModal,
            isOpen: false,
          },
        },
        tabId
      );
    }

    if (
      !currentMessageList ||
      currentMessageList.chatId !== chatId ||
      currentMessageList.threadId !== threadId ||
      currentMessageList.type !== type
    ) {
      if (chatId) {
        global = replaceTabThreadParam(
          global,
          chatId,
          threadId,
          'replyStack',
          [],
          tabId
        );

        global = updateTabState(
          global,
          {
            activeReactions: {},
          },
          tabId
        );
      }

      global = exitMessageSelectMode(global, tabId);
      global = closeLocalTextSearch(global, tabId);

      global = updateTabState(
        global,
        {
          isStatisticsShown: false,
          boostStatistics: undefined,
          contentToBeScheduled: undefined,
          ...(chatId !==
            selectTabState(global, tabId).forwardMessages.toChatId && {
            forwardMessages: {},
          }),
        },
        tabId
      );
    }

    if (chatId) {
      const chat = selectChat(global, chatId);
      const user = selectUser(global, chatId);
      if (user && !user?.isPublic && !chat) {
        actions.showDialog({
          data: { message: t('Errors.userIsPrivate') },
          tabId,
        });
        return;
      }
      if (chat?.isForum && !noForumTopicPanel) {
        actions.openForumPanel({ chatId, tabId });
      } else if (chatId !== selectTabState(global, tabId).forumPanelChatId) {
        actions.closeForumPanel({ tabId });
      }

      const { isLeftColumnShown, middleScreen, leftScreen } = tabState;

      global = updateTabState(
        global,
        {
          ...(middleScreen !== MiddleColumnContent.Messages && {
            middleScreen: MiddleColumnContent.Messages,
          }),
          ...(leftScreen !== LeftColumnContent.ChatList && {
            leftScreen: LeftColumnContent.ChatList,
          }),
          ...(isLeftColumnShown &&
            currentMessageList &&
            currentMessageList.chatId !== chatId && {
              isLeftColumnShown:
                selectTabState(global, tabId).messageLists.length === 0,
            }),
        },
        tabId
      );
    }

    actions.updatePageTitle({ tabId });

    return updateCurrentMessageList(
      global,
      chatId,
      threadId,
      type,
      shouldReplaceHistory,
      shouldReplaceLast,
      tabId
    );
  }
);

// addActionHandler('openChat', (global, actions, payload): ActionReturnType => {
//   const {
//     id,
//     threadId = MAIN_THREAD_ID,
//     type = 'thread',
//     shouldReplaceHistory = false,
//     shouldReplaceLast = false,
//     noForumTopicPanel,
//     tabId = getCurrentTabId(),
//   } = payload;

//   const currentMessageList = selectCurrentMessageList(global, tabId);

//   const tabState = selectTabState(global, tabId);

//   if (tabState.premiumModal?.promo && tabState.premiumModal?.isOpen) {
//     global = updateTabState(
//       global,
//       {
//         premiumModal: {
//           ...tabState.premiumModal,
//           isOpen: false,
//         },
//       },
//       tabId
//     );
//   }

//   if (
//     !currentMessageList ||
//     currentMessageList.chatId !== id ||
//     currentMessageList.threadId !== threadId ||
//     currentMessageList.type !== type
//   ) {
//     if (id) {
//       global = replaceTabThreadParam(
//         global,
//         id,
//         threadId,
//         'replyStack',
//         [],
//         tabId
//       );

//       global = updateTabState(
//         global,
//         {
//           activeReactions: {},
//         },
//         tabId
//       );
//     }

//     global = exitMessageSelectMode(global, tabId);
//     global = closeLocalTextSearch(global, tabId);

//     global = updateTabState(
//       global,
//       {
//         isStatisticsShown: false,
//         contentToBeScheduled: undefined,
//         ...(id !== selectTabState(global, tabId).forwardMessages.toChatId && {
//           forwardMessages: {},
//         }),
//       },
//       tabId
//     );
//   }

//   let chat: ApiChat | undefined;

//   if (id) {
//     chat = selectChat(global, id);
//     if (chat?.isForum && !noForumTopicPanel) {
//       actions.openForumPanel({ chatId: id!, tabId });
//     } else if (id !== selectTabState(global, tabId).forumPanelChatId) {
//       actions.closeForumPanel({ tabId });
//     }
//   }

//   actions.updatePageTitle({ tabId });
//   if (chat) {
//     global = updateTabState(
//       global,
//       {
//         middleScreen: MiddleColumnContent.Messages,
//         leftScreen: LeftColumnContent.ChatList,
//       },
//       tabId
//     );
//     return updateCurrentMessageList(
//       global,
//       id,
//       threadId,
//       type,
//       shouldReplaceHistory,
//       shouldReplaceLast,
//       tabId
//     );
//   }
// });

addActionHandler(
  'openChatInNewTab',
  (global, actions, payload): ActionReturnType => {
    const { chatId, threadId = MAIN_THREAD_ID } = payload;

    const hashUrl = createMessageHashUrl(chatId, 'thread', threadId);

    if (IS_ELECTRON) {
      window.electron!.openNewWindow(hashUrl);
    } else {
      window.open(hashUrl, '_blank');
    }
  }
);

addActionHandler(
  'openPreviousChat',
  (global, actions, payload): ActionReturnType => {
    const { tabId = getCurrentTabId() } = payload || {};
    actions.updatePageTitle({ tabId });
    return updateCurrentMessageList(
      global,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      tabId
    );
  }
);

addActionHandler(
  'openChatWithInfo',
  (global, actions, payload): ActionReturnType => {
    const { tabId = getCurrentTabId() } = payload;

    global = updateTabState(
      global,
      {
        ...selectTabState(global, tabId),
        isChatInfoShown: true,
      },
      tabId
    );
    global = { ...global, lastIsChatInfoShown: true };
    setGlobal(global);

    actions.openChat({ ...payload, tabId });
  }
);

addActionHandler(
  'openCertificateInfo',
  (global, actions, payload): ActionReturnType => {
    const { tabId = getCurrentTabId() } = payload;

    global = updateTabState(
      global,
      {
        ...selectTabState(global, tabId),
        isCertificateShown: true,
      },
      tabId
    );
    setGlobal(global);
  }
);

addActionHandler(
  'closeCertificateInfo',
  (global, actions, payload): ActionReturnType => {
    const { tabId = getCurrentTabId() } = payload || {};
    return updateTabState(global, { isCertificateShown: false }, tabId);
  }
);

addActionHandler(
  'openCreateSale',
  (global, actions, payload): ActionReturnType => {
    const { tabId = getCurrentTabId() } = payload || {};
    return updateTabState(global, { isCreateSaleShown: true }, tabId);
  }
);

addActionHandler(
  'closeCreateSale',
  (global, actions, payload): ActionReturnType => {
    const { tabId = getCurrentTabId() } = payload || {};
    return updateTabState(global, { isCreateSaleShown: false }, tabId);
  }
);

addActionHandler(
  'openChatWithDraft',
  (global, actions, payload): ActionReturnType => {
    const {
      chatId,
      text,
      threadId,
      files,
      tabId = getCurrentTabId(),
    } = payload;

    if (chatId) {
      actions.openChat({ id: chatId, threadId, tabId });
    }

    return updateTabState(
      global,
      {
        requestedDraft: {
          chatId,
          text,
          files,
        },
      },
      tabId
    );
  }
);

addActionHandler(
  'resetChatCreation',
  (global, actions, payload): ActionReturnType => {
    const { tabId = getCurrentTabId() } = payload || {};
    return updateTabState(
      global,
      {
        chatCreation: undefined,
      },
      tabId
    );
  }
);

addActionHandler(
  'setNewChatMembersDialogState',
  (global, actions, payload): ActionReturnType => {
    const { newChatMembersProgress, tabId = getCurrentTabId() } = payload;
    return updateTabState(
      global,
      {
        newChatMembersProgress,
      },
      tabId
    );
  }
);

addActionHandler(
  'openNextChat',
  (global, actions, payload): ActionReturnType => {
    const { targetIndexDelta, orderedIds, tabId = getCurrentTabId() } = payload;

    const { chatId } = selectCurrentMessageList(global, tabId) || {};

    if (!chatId) {
      actions.openChat({ id: orderedIds[0], tabId });
      return;
    }

    const position = orderedIds.indexOf(chatId);

    if (position === -1) {
      return;
    }
    const nextId = orderedIds[position + targetIndexDelta];

    actions.openChat({ id: nextId, shouldReplaceHistory: true, tabId });
  }
);

addActionHandler(
  'openDeleteChatFolderModal',
  (global, actions, payload): ActionReturnType => {
    const { folderId, tabId = getCurrentTabId() } = payload;
    return updateTabState(
      global,
      {
        deleteFolderDialogModal: folderId,
      },
      tabId
    );
  }
);

addActionHandler(
  'closeDeleteChatFolderModal',
  (global, actions, payload): ActionReturnType => {
    const { tabId = getCurrentTabId() } = payload || {};
    return updateTabState(
      global,
      {
        deleteFolderDialogModal: undefined,
      },
      tabId
    );
  }
);
