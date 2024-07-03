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

export function dispatchOverlay(action: OverlayReducerAction) {
  overlays = overlayReducer(overlays, action);
  emitChangeListener();
}

/**
 * @description for useSyncExternalStorage
 */
export const registerOverlaysStore = {
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
