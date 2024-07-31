import React, { FC, memo } from 'react';
import { getActions, withGlobal } from '../../global';

import type { MessageList as GlobalMessageList } from '../../global/types';

import { createLocationHash } from '../../util/routing';
import { selectTabState } from '../../global/selectors';
import useHistoryBack from '../../hooks/useHistoryBack';

type StateProps = {
  messageLists?: GlobalMessageList[];
};

// Actual `MessageList` components are unmounted when deep in the history,
// so we need a separate component just for handling history
const MessageListHistoryHandler: FC<StateProps> = ({ messageLists }) => {
  const { openChat } = getActions();

  const closeChat = () => {
    openChat({ id: undefined }, { forceSyncOnIOs: true });
  };

  const MessageHistoryRecord: FC<GlobalMessageList> = ({
    chatId,
    type,
    threadId,
  }) => {
    useHistoryBack({
      isActive: true,
      hash: createLocationHash(chatId, type, threadId),
      page: 'MessageHistoryRecord',
      onBack: closeChat,
    });
  };

  return (
    <div>
      {messageLists?.map((messageList, i) => (
        <MessageHistoryRecord
          key={`${messageList.chatId}_${messageList.threadId}_${messageList.type}_${i}`}
          {...messageList}
        />
      ))}
    </div>
  );
};

export default memo(
  withGlobal((global): StateProps => {
    return {
      messageLists: selectTabState(global).messageLists,
    };
  })(MessageListHistoryHandler)
);
