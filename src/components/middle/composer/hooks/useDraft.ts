import { useCallback, useEffect } from 'react';
import { getActions } from '../../../../global';

import type { ApiDraft } from '../../../../global/types';
import type { ApiMessage } from '../../../../api/types';
import type { Signal } from '../../../../util/signals';

import { ApiMessageEntityTypes } from '../../../../api/types';
import {
  DRAFT_DEBOUNCE,
  EDITABLE_INPUT_CSS_SELECTOR,
} from '../../../../config';
import { IS_TOUCH_ENV } from '../../../../util/windowEnvironment';
import focusEditableElement from '../../../../util/focusEditableElement';
import parseMessageInput from '../../../../util/parseMessageInput';
import { getTextWithEntitiesAsHtml } from '../../../common/helpers/renderTextWithEntities';
import useBackgroundMode from '../../../../hooks/useBackgroundMode';
import useBeforeUnload from '../../../../hooks/useBeforeUnload';
import { useStateRef } from '../../../../hooks/useStateRef';
import useEffectWithPrevDeps from '../../../../hooks/useEffectWithPrevDeps';
import useRunDebounced from '../../../../hooks/useRunDebounced';
import { ThreadId } from '../../../../types';

let isFrozen = false;

function freeze() {
  isFrozen = true;
  requestAnimationFrame(() => {
    isFrozen = false;
  });
}

const useDraft = ({
  draft,
  chatId,
  threadId,
  getHtml,
  setHtml,
  editedMessage,
  isDisabled,
}: {
  draft?: ApiDraft | undefined;
  chatId: string;
  threadId: ThreadId;
  getHtml: Signal<string>;
  setHtml: (html: string) => void;
  editedMessage?: ApiMessage;
  isDisabled?: boolean;
}) => {
  const { saveDraft, clearDraft, loadCustomEmojis } = getActions();

  const isEditing = Boolean(editedMessage);

  const updateDraft = useCallback(
    (
      prevState: { chatId?: string; threadId?: number } = {},
      shouldForce = false
    ) => {
      if (isDisabled || isEditing) return;

      if (getHtml()) {
        saveDraft({
          chatId: prevState.chatId ?? chatId,
          threadId: prevState.threadId ?? threadId,
          draft: parseMessageInput(getHtml()),
          shouldForce,
        });
      } else {
        clearDraft({
          chatId: prevState.chatId ?? chatId,
          threadId: Number(prevState.threadId ?? threadId),
          shouldForce,
        });
      }
    },
    [chatId, threadId, isEditing, getHtml(), saveDraft, clearDraft]
  );

  const forceUpdateDraft = useCallback(() => {
    updateDraft(undefined, true);
  }, [updateDraft]);

  const updateDraftRef = useStateRef(updateDraft);
  const runDebouncedForSaveDraft = useRunDebounced(
    DRAFT_DEBOUNCE,
    true,
    undefined,
    [chatId, threadId]
  );

  // Restore draft on chat change
  useEffectWithPrevDeps(
    ([prevChatId, prevThreadId, prevDraft]) => {
      if (chatId === prevChatId && threadId === prevThreadId) {
        if (!draft && prevDraft) {
          setHtml('');
        }

        if (!draft?.shouldForce) {
          return;
        }
      }

      if (editedMessage || !draft) {
        return;
      }

      setHtml(getTextWithEntitiesAsHtml(draft));

      const customEmojiIds =
        draft.entities
          ?.map(
            (entity) =>
              entity.type === ApiMessageEntityTypes.CustomEmoji &&
              entity.documentId
          )
          .filter(Boolean) || [];
      if (customEmojiIds.length) loadCustomEmojis({ ids: customEmojiIds });

      if (!IS_TOUCH_ENV) {
        requestAnimationFrame(() => {
          const messageInput = document.querySelector<HTMLDivElement>(
            EDITABLE_INPUT_CSS_SELECTOR
          );
          if (messageInput) {
            focusEditableElement(messageInput, true);
          }
        });
      }
    },
    [chatId, threadId, draft, setHtml, editedMessage, loadCustomEmojis]
  );

  // Save draft on chat change
  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks-static-deps/exhaustive-deps
      if (!isEditing) {
        // eslint-disable-next-line react-hooks-static-deps/exhaustive-deps
        updateDraftRef.current({ chatId, threadId: Number(threadId) });
      }

      freeze();
    };
  }, [chatId, threadId, isEditing, updateDraftRef]);

  const chatIdRef = useStateRef(chatId);
  const threadIdRef = useStateRef(threadId);
  useEffect(() => {
    if (isFrozen && getHtml()) {
      return;
    }

    if (!getHtml()) {
      updateDraftRef.current();
      return;
    }

    const scopedShatId = chatIdRef.current;
    const scopedThreadId = threadIdRef.current;

    runDebouncedForSaveDraft(() => {
      if (
        chatIdRef.current === scopedShatId &&
        threadIdRef.current === scopedThreadId
      ) {
        updateDraftRef.current();
      }
    });
  }, [
    chatIdRef,
    getHtml(),
    runDebouncedForSaveDraft,
    threadIdRef,
    updateDraftRef,
  ]);

  useBackgroundMode(forceUpdateDraft);
  useBeforeUnload(forceUpdateDraft);
};

export default useDraft;
