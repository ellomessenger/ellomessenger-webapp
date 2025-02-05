import React, { useCallback, useMemo, useState } from 'react';

import { debounce } from '../util/schedulers';
import { isSafariPatchInProgress } from '../util/patchSafariProgressiveAudio';
import { areDeepEqual } from '../util/areDeepEqual';

type BufferingEvent = (
  e: Event | React.SyntheticEvent<HTMLMediaElement>
) => void;

const MIN_READY_STATE = 3;
// Avoid flickering when re-mounting previously buffered video
const DEBOUNCE = 200;

/**
 * Time range relative to the duration [0, 1]
 */
export type BufferedRange = { start: number; end: number };

const useBuffering = (
  noInitiallyBuffered = false,
  onTimeUpdate?: AnyToVoidFunction
) => {
  const [isBuffered, setIsBuffered] = useState(!noInitiallyBuffered);
  const [bufferedProgress, setBufferedProgress] = useState(0);
  const [bufferedRanges, setBufferedRanges] = useState<BufferedRange[]>([]);

  const setIsBufferedDebounced = useMemo(() => {
    return debounce(setIsBuffered, DEBOUNCE, false, true);
  }, []);

  const handleBuffering = useCallback<BufferingEvent>(
    (e) => {
      if (e.type === 'timeupdate') {
        onTimeUpdate?.(e);
      }

      const media = e.currentTarget as HTMLMediaElement;

      if (!isSafariPatchInProgress(media)) {
        if (media.buffered.length) {
          const ranges = getTimeRanges(media.buffered, media.duration);
          const bufferedLength = ranges.reduce(
            (acc, { start, end }) => acc + end - start,
            0
          );
          setBufferedProgress(bufferedLength / media.duration);
          setBufferedRanges((currentRanges) => {
            return areDeepEqual(currentRanges, ranges) ? currentRanges : ranges;
          });
        }

        setIsBufferedDebounced(
          media.readyState >= MIN_READY_STATE || media.currentTime > 0
        );
      }
    },
    [onTimeUpdate, setIsBufferedDebounced]
  );

  const bufferingHandlers = {
    onLoadedData: handleBuffering,
    onPlaying: handleBuffering,
    onLoadStart: handleBuffering, // Needed for Safari to start
    onPause: handleBuffering, // Needed for Chrome when seeking
    onTimeUpdate: handleBuffering, // Needed for audio buffering progress
    onProgress: handleBuffering, // Needed for video buffering progress
  };

  return {
    isBuffered,
    bufferedProgress,
    bufferedRanges,
    bufferingHandlers,
    checkBuffering(element: HTMLMediaElement) {
      setIsBufferedDebounced(element.readyState >= MIN_READY_STATE);
    },
  };
};

function getTimeRanges(ranges: TimeRanges, duration: number) {
  const result: BufferedRange[] = [];
  for (let i = 0; i < ranges.length; i++) {
    result.push({
      start: ranges.start(i) / duration,
      end: ranges.end(i) / duration,
    });
  }
  return result;
}

export default useBuffering;
