import { useEffect, RefObject } from 'react';

import { IS_TOUCH_ENV } from '../util/windowEnvironment';
import { fastRaf } from '../util/schedulers';

const DEFAULT_DURATION = 400;

export default function useFocusAfterAnimation(
  ref: RefObject<HTMLInputElement>,
  animationDuration = DEFAULT_DURATION
) {
  useEffect(() => {
    if (IS_TOUCH_ENV) {
      return;
    }

    setTimeout(() => {
      fastRaf(() => {
        if (ref.current) {
          ref.current.focus();
        }
      });
    }, animationDuration);
  }, [ref, animationDuration]);
}
