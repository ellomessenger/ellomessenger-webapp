import { useEffect } from 'react';

import { onBeforeUnload } from '../util/schedulers';

export default function useBeforeUnload(callback: AnyToVoidFunction) {
  useEffect(() => {
    return onBeforeUnload(callback);
  }, [callback]);
}
