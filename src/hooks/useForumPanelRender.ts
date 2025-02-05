import { useCallback, useRef } from 'react';

import useForceUpdate from './useForceUpdate';
import useSyncEffect from './useSyncEffect';

export default function useForumPanelRender(isForumPanelOpen = false) {
  const shouldRenderForumPanelRef = useRef(isForumPanelOpen);
  const isAnimationStartedRef = useRef(false);
  const forceUpdate = useForceUpdate();

  useSyncEffect(() => {
    if (isForumPanelOpen) {
      shouldRenderForumPanelRef.current = true;
    }
  }, [isForumPanelOpen]);

  const handleForumPanelAnimationEnd = useCallback(() => {
    shouldRenderForumPanelRef.current = false;
    isAnimationStartedRef.current = false;
    forceUpdate();
  }, [forceUpdate]);

  const handleForumPanelAnimationStart = useCallback(() => {
    isAnimationStartedRef.current = true;
    forceUpdate();
  }, []);

  return {
    shouldRenderForumPanel: shouldRenderForumPanelRef.current,
    isAnimationStarted: isAnimationStartedRef.current,
    handleForumPanelAnimationEnd,
    handleForumPanelAnimationStart,
  };
}
