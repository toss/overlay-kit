import { useSyncExternalStore } from 'use-sync-external-store/shim/index.js';
import { registerOverlayStore } from './store';

export function useSyncOverlayStore() {
  const { subscribe, getSnapshot } = registerOverlayStore;
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
