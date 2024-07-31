import type { ApiChat, ApiMessage } from '../../../api/types';
import type { IAlbum, ThreadId } from '../../../types';

import { getDayStartAt } from '../../../util/dateFormat';
import { isActionMessage } from '../../../global/helpers';

type SenderGroup = (ApiMessage | IAlbum)[];

const GROUP_INTERVAL_SECONDS = 600; // 10 minutes

export type MessageDateGroup = {
  originalDate: number;
  datetime: number;
  senderGroups: SenderGroup[];
};

export function isAlbum(
  messageOrAlbum: ApiMessage | IAlbum
): messageOrAlbum is IAlbum {
  return 'albumId' in messageOrAlbum;
}

export function groupMessages(
  messages: ApiMessage[],
  firstUnreadId?: number,
  topMessageId?: ThreadId,
  isChatWithSelf?: boolean
) {
  let currentSenderGroup: SenderGroup = [];
  let currentDateGroup = {
    originalDate: messages[0].date,
    datetime: getDayStartAt(messages[0].date * 1000),
    senderGroups: [currentSenderGroup],
  };
  let currentAlbum: IAlbum | undefined;

  const dateGroups: MessageDateGroup[] = [currentDateGroup];

  messages.forEach((message, index) => {
    if (message.isInAlbum) {
      if (!currentAlbum) {
        currentAlbum = {
          albumId: message.groupedId!,
          messages: [message],
          mainMessage: message,
        };
      } else {
        currentAlbum.messages.push(message);
        if (message.content.text) {
          currentAlbum.mainMessage = message;
        }
      }
    } else {
      currentSenderGroup.push(message);
    }

    const nextMessage = messages[index + 1];

    if (
      currentAlbum &&
      (!nextMessage ||
        !nextMessage.groupedId ||
        nextMessage.groupedId !== currentAlbum.albumId)
    ) {
      currentSenderGroup.push(currentAlbum);
      currentAlbum = undefined;
    }
    const lastSenderGroupItem =
      currentSenderGroup[currentSenderGroup.length - 1];

    if (nextMessage) {
      const nextMessageDayStartsAt = getDayStartAt(nextMessage.date * 1000);
      if (currentDateGroup.datetime !== nextMessageDayStartsAt) {
        currentDateGroup = {
          originalDate: nextMessage.date,
          datetime: nextMessageDayStartsAt,
          senderGroups: [],
        };
        dateGroups.push(currentDateGroup);

        currentSenderGroup = [];
        currentDateGroup.senderGroups.push(currentSenderGroup);
      } else if (
        nextMessage.id === firstUnreadId ||
        message.senderId !== nextMessage.senderId ||
        message.isOutgoing !== nextMessage.isOutgoing ||
        (isActionMessage(message) && !message.content.action?.phoneCall) ||
        (isActionMessage(nextMessage) &&
          !nextMessage.content.action?.phoneCall) ||
        message.inlineButtons ||
        nextMessage.inlineButtons ||
        nextMessage.date - message.date > GROUP_INTERVAL_SECONDS ||
        (topMessageId &&
          (message.id === topMessageId ||
            (lastSenderGroupItem &&
              'mainMessage' in lastSenderGroupItem &&
              lastSenderGroupItem.mainMessage?.id === topMessageId)) &&
          nextMessage.id !== topMessageId) ||
        (!isChatWithSelf &&
          message.forwardInfo?.fromChatId !==
            nextMessage.forwardInfo?.fromChatId)
      ) {
        currentSenderGroup = [];
        currentDateGroup.senderGroups.push(currentSenderGroup);
      }
    }
  });

  return dateGroups;
}

export function groupMessagesForFeed(
  messages: ApiMessage[],
  firstUnreadId?: number
) {
  let currentSenderGroup: SenderGroup = [];
  let senderGroups = [currentSenderGroup];
  let currentAlbum: IAlbum | undefined;

  messages.forEach((message, index) => {
    if (isActionMessage(message)) {
      return;
    }
    if (message.isInAlbum) {
      if (!currentAlbum) {
        currentAlbum = {
          albumId: message.groupedId!,
          messages: [message],
          mainMessage: message,
        };
      } else {
        currentAlbum.messages.push(message);
        if (message.content.text) {
          currentAlbum.mainMessage = message;
        }
      }
    } else {
      currentSenderGroup.push(message);
    }

    const nextMessage = messages[index + 1];

    if (
      currentAlbum &&
      (!nextMessage ||
        !nextMessage.groupedId ||
        nextMessage.groupedId !== currentAlbum.albumId)
    ) {
      currentSenderGroup.push(currentAlbum);
      currentAlbum = undefined;
    }

    if (nextMessage) {
      if (
        nextMessage.id === firstUnreadId ||
        message.senderId !== nextMessage.senderId ||
        message.isOutgoing !== nextMessage.isOutgoing ||
        isActionMessage(nextMessage) ||
        (message.forwardInfo &&
          nextMessage.forwardInfo &&
          (message.forwardInfo.senderUserId !==
            nextMessage.forwardInfo.senderUserId ||
            message.forwardInfo.fromChatId !==
              nextMessage.forwardInfo.fromChatId ||
            message.forwardInfo.hiddenUserName !==
              nextMessage.forwardInfo.hiddenUserName)) ||
        message.inlineButtons ||
        nextMessage.inlineButtons ||
        nextMessage.date - message.date > GROUP_INTERVAL_SECONDS
      ) {
        currentSenderGroup = [];
        senderGroups.push(currentSenderGroup);
      }
    }
  });

  return senderGroups;
}
