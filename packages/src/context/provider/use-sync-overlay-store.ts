import { useSyncExternalStore } from 'use-sync-external-store/shim/index.js';
import { type OverlayStore } from '../store';

export function useSyncOverlayStore(overlayStore: OverlayStore) {
  const {
    registerOverlaysStore: { subscribe, getSnapshot },
  } = overlayStore;

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
