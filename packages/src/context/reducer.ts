import { produce, type Draft } from 'immer';
import type { OverlayControllerComponent } from './context';

export type OverlayItem = {
  id: string;
  isOpen: boolean;
  controller: OverlayControllerComponent;
};

export type OverlayReducerState = {
  current: string | null;
  overlayOrderList: string[];
  overlayData: Record<string, OverlayItem>;
};

export type OverlayReducerAction =
  | { type: 'ADD'; overlay: OverlayItem }
  | { type: 'OPEN'; overlayId: string }
  | { type: 'CLOSE'; overlayId: string }
  | { type: 'REMOVE'; overlayId: string }
  | { type: 'CLOSE_ALL' }
  | { type: 'REMOVE_ALL' };

export function overlayReducer(state: OverlayReducerState, action: OverlayReducerAction): OverlayReducerState {
  return produce(state, (draft: Draft<OverlayReducerState>) => {
    switch (action.type) {
      case 'ADD': {
        draft.current = action.overlay.id;
        draft.overlayOrderList.push(action.overlay.id);
        draft.overlayData[action.overlay.id] = action.overlay;
        break;
      }
      case 'OPEN': {
        draft.overlayData[action.overlayId].isOpen = true;
        break;
      }
      case 'CLOSE': {
        draft.overlayData[action.overlayId].isOpen = false;
        break;
      }
      case 'REMOVE': {
        const remainingOverlays = draft.overlayOrderList.filter((item) => item !== action.overlayId);

        if (state.overlayOrderList.length === remainingOverlays.length) {
          break;
        }

        draft.overlayOrderList = remainingOverlays;
        delete draft.overlayData[action.overlayId];
        draft.current = remainingOverlays.at(-1) || state.current;
        break;
      }
      case 'CLOSE_ALL': {
        Object.keys(draft.overlayData).forEach((key) => (draft.overlayData[key].isOpen = false));
        break;
      }
      case 'REMOVE_ALL': {
        draft.overlayOrderList = [];
        draft.overlayData = {};
        draft.current = state.current;
        break;
      }
    }
  });
}
