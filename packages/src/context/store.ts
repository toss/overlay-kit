import { type OverlayControllerComponent } from './provider/content-overlay-controller';
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

  function dispatchOverlay(action: OverlayReducerAction) {
    overlays = overlayReducer(overlays, action);
    console.log('test:: dispatchOverlay After', action, overlays);
    emitChangeListener();
  }

  return { registerOverlaysStore, dispatchOverlay };
}
