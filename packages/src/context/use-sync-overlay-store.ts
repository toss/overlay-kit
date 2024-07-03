import { useSyncExternalStore } from 'react';
import { registerOverlaysStore } from './store';

export function useSyncOverlayStore() {
  const { subscribe, getSnapshot } = registerOverlaysStore;
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
