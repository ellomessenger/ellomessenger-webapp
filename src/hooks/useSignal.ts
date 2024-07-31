import { useRef } from 'react';
import { createSignal } from '../util/signals';

export default function useSignal<T>(initial?: T) {
  const signalRef = useRef<ReturnType<typeof createSignal<T>>>();
  signalRef.current ??= createSignal<T>(initial);
  return signalRef.current;
}
