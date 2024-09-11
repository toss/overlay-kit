import { useSyncExternalStore } from 'use-sync-external-store/shim/index.js';
import { registerOverlaysStore } from './store';

export function useSyncOverlayStore() {
  const { subscribe, getSnapshot } = registerOverlaysStore;
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
