import { useEffect } from 'react';
import usePrevious from './usePrevious';

const useEffectWithPrevDeps = <const T extends readonly any[]>(
  cb: (args: T | readonly []) => void,
  dependencies: T,
  debugKey?: string
) => {
  const prevDeps = usePrevious<T>(dependencies);
  return useEffect(() => {
    return cb(prevDeps || []);
  }, [dependencies, debugKey]);
};

export default useEffectWithPrevDeps;
