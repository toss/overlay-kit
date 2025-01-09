import { useSyncExternalStore } from 'use-sync-external-store/shim/index.js';
import { globalOverlayStore } from './store';

export function useSyncOverlayStore() {
  const {
    registerOverlaysStore: { subscribe, getSnapshot },
  } = globalOverlayStore;

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
