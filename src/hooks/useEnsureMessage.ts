import { useEffect, useMemo } from 'react';
import { getActions } from '../global';

import type { ApiMessage } from '../api/types';

import { throttle } from '../util/schedulers';

export default function useEnsureMessage(
  chatId: string,
  messageId?: number,
  message?: ApiMessage,
  replyOriginForId?: number,
  isDisabled?: boolean
) {
  const { loadMessage } = getActions();

  useEffect(() => {
    if (isDisabled) return;
    if (messageId && !message) {
      loadMessage({
        chatId,
        messageId: messageId!,
        replyOriginForId: replyOriginForId!,
      });
    }
  }, [isDisabled, chatId, message, messageId, replyOriginForId]);
}
