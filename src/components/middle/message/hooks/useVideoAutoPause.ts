import { useCallback, useEffect, useRef } from 'react';

import { fastRaf } from '../../../../util/schedulers';
import useBackgroundMode from '../../../../hooks/useBackgroundMode';
import useHeavyAnimationCheck from '../../../../hooks/useHeavyAnimationCheck';
import usePlayPause from '../../../../hooks/usePlayPause';

export default function useVideoAutoPause(
  playerRef: { current: HTMLVideoElement | null },
  canPlay: boolean
) {
  const canPlayRef = useRef(false);
  canPlayRef.current = canPlay;

  const { play, pause } = usePlayPause(playerRef);

  const isFrozenRef = useRef(false);

  const freezePlaying = useCallback(() => {
    isFrozenRef.current = true;

    pause();
  }, [pause]);

  const unfreezePlaying = useCallback(() => {
    isFrozenRef.current = false;

    if (canPlayRef.current) {
      play();
    }
  }, [play]);

  const unfreezePlayingOnRaf = useCallback(() => {
    fastRaf(unfreezePlaying);
  }, [unfreezePlaying]);

  useBackgroundMode(freezePlaying, unfreezePlayingOnRaf, !canPlay);
  useHeavyAnimationCheck(freezePlaying, unfreezePlaying, !canPlay);

  const handlePlaying = useCallback(() => {
    if (!canPlayRef.current || isFrozenRef.current) {
      pause();
    }
  }, [pause]);

  useEffect(() => {
    if (canPlay) {
      if (!isFrozenRef.current) {
        play();
      }
    } else {
      pause();
    }
  }, [canPlay, play, pause]);

  return { handlePlaying };
}
