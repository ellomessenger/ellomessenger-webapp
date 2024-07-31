import React, { memo, useCallback, useRef } from 'react';

import useVideoAutoPause from '../middle/message/hooks/useVideoAutoPause';
import useVideoCleanup from '../../hooks/useVideoCleanup';
import useBuffering from '../../hooks/useBuffering';
import useSyncEffect from '../../hooks/useSyncEffect';

type OwnProps = {
  elRef?: React.RefObject<HTMLVideoElement>;
  canPlay: boolean;
  onReady?: NoneToVoidFunction;
} & React.DetailedHTMLProps<
  React.VideoHTMLAttributes<HTMLVideoElement>,
  HTMLVideoElement
>;

function OptimizedVideo({
  elRef,
  canPlay,
  onReady,
  onTimeUpdate,
  ...restProps
}: OwnProps) {
  // eslint-disable-next-line no-null/no-null
  const localRef = useRef<HTMLVideoElement>(null);
  if (!elRef) {
    elRef = localRef;
  }

  const { handlePlaying: handlePlayingForAutoPause } = useVideoAutoPause(
    elRef,
    canPlay
  );
  useVideoCleanup(elRef, []);

  const isReadyRef = useRef(false);
  const handleReady = useCallback(() => {
    if (!isReadyRef.current) {
      onReady?.();
      isReadyRef.current = true;
    }
  }, [onReady]);

  // This is only needed for browsers not allowing autoplay
  const { isBuffered, bufferingHandlers } = useBuffering(true, onTimeUpdate);
  const { onPlaying: handlePlayingForBuffering, ...otherBufferingHandlers } =
    bufferingHandlers;
  useSyncEffect(
    ([prevIsBuffered]) => {
      if (prevIsBuffered === undefined) {
        return;
      }

      handleReady();
    },
    [isBuffered, handleReady]
  );

  const handlePlaying = useCallback(
    (e: Event | React.SyntheticEvent<HTMLMediaElement, Event>) => {
      handlePlayingForAutoPause();
      handlePlayingForBuffering(e);
      handleReady();
    },
    [handlePlayingForAutoPause, handlePlayingForBuffering, handleReady]
  );

  return (
    <video
      ref={elRef}
      autoPlay
      {...restProps}
      {...otherBufferingHandlers}
      onPlaying={handlePlaying}
    />
  );
}

export default memo(OptimizedVideo);
