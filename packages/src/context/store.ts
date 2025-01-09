import { type OverlayControllerComponent } from './provider';
import { type OverlayReducerAction, overlayReducer } from './reducer';

type OverlayId = string;
export type OverlayItem = {
  id: OverlayId;
  isOpen: boolean;
  controller: OverlayControllerComponent;
};
export type OverlayData = {
  current: OverlayId | null;
  overlayOrderList: OverlayId[];
  overlayData: Record<OverlayId, OverlayItem>;
};

export type OverlayStore = ReturnType<typeof createRegisterOverlaysStore>;

/**
 * @description default overlay store
 */
export const globalOverlayStore = createRegisterOverlaysStore();

/**
 * @description for useSyncExternalStorage
 */
export function createRegisterOverlaysStore() {
  let overlays: OverlayData = {
    current: null,
    overlayOrderList: [],
    overlayData: {},
  };
  let listeners: Array<() => void> = [];

  function emitChangeListener() {
    for (const listener of listeners) {
      listener();
    }
  }

  function dispatchOverlay(action: OverlayReducerAction) {
    overlays = overlayReducer(overlays, action);
    emitChangeListener();
  }

  const registerOverlaysStore = {
    subscribe(listener: () => void) {
      listeners = [...listeners, listener];

      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
    getSnapshot() {
      return overlays;
    },
  };

  return {
    registerOverlaysStore,
    dispatchOverlay,
  };
}
