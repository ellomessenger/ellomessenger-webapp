import { RefObject, useMemo, useRef, useState } from 'react';

import { getActions } from '../../../../global';
import { debounce } from '../../../../util/schedulers';
import {
  useIntersectionObserver,
  useOnIntersect,
} from '../../../../hooks/useIntersectionObserver';
import { MESSAGE_LIST_SENSITIVE_AREA } from '../../../../util/windowEnvironment';
import useSyncEffect from '../../../../hooks/useSyncEffect';

export default function useScrollFeeds(
  containerRef: RefObject<HTMLDivElement>,
  isReady: boolean,
  isExplore: true | undefined = undefined
) {
  const { loadFeedMessages } = getActions();

  const loadMoreForwards = useMemo(
    () => debounce(() => loadFeedMessages({ isExplore }), 1000, true, false),

    [loadFeedMessages, isExplore]
  );

  const forwardsTriggerRef = useRef<HTMLDivElement>(null);

  function toggleScrollTools() {
    if (!isReady) return;

    if (!containerRef.current) {
      return;
    }

    const { offsetHeight, scrollHeight, scrollTop } = containerRef.current;
    const scrollBottom = Math.round(scrollHeight - scrollTop - offsetHeight);
    if (scrollHeight === 0) return;
  }

  const { observe: observeIntersection } = useIntersectionObserver(
    {
      rootRef: containerRef,
      margin: MESSAGE_LIST_SENSITIVE_AREA,
    },
    (entries) => {
      if (!loadMoreForwards) {
        return;
      }

      // Loading history while sending a message can return the same message and cause ambiguity
      // const isFirstMessageLocal =
      //   messageIds && messageIds[0] > LOCAL_MESSAGE_MIN_ID;
      // if (isFirstMessageLocal) {
      //   return;
      // }

      const triggerEntry = entries.find(({ isIntersecting }) => isIntersecting);
      if (!triggerEntry) {
        return;
      }

      const { target } = triggerEntry;

      if (target.className === 'forwards-trigger') {
        loadMoreForwards();
      }
    }
  );

  useOnIntersect(forwardsTriggerRef, observeIntersection);

  const toggleScrollToolsRef = useRef<typeof toggleScrollTools>();
  toggleScrollToolsRef.current = toggleScrollTools;
  useSyncEffect(() => {
    if (isReady) {
      toggleScrollToolsRef.current!();
    }
  }, [isReady]);

  return { forwardsTriggerRef };
}
