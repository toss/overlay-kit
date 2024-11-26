import { type OverlayControllerComponent } from './provider';
import { type OverlayReducerAction, overlayReducer } from './reducer';

type OverlayItemId = string;
export type OverlayItem = {
  id: OverlayItemId;
  isOpen: boolean;
  controller: OverlayControllerComponent;
};
export type OverlayState = {
  currentId: OverlayItemId | null;
  orderIds: OverlayItemId[];
  data: Record<OverlayItemId, OverlayItem>;
};

let overlays: OverlayState = {
  currentId: null,
  orderIds: [],
  data: {},
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
export const registerOverlayStore = {
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
