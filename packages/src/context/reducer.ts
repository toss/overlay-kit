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
  switch (action.type) {
    case 'ADD': {
      return {
        current: action.overlay.id,
        overlayOrderList: [...state.overlayOrderList, action.overlay.id],
        overlayData: {
          ...state.overlayData,
          [action.overlay.id]: action.overlay,
        },
      };
    }
    case 'OPEN': {
      return {
        ...state,
        overlayData: {
          ...state.overlayData,
          [action.overlayId]: {
            ...state.overlayData[action.overlayId],
            isOpen: true,
          },
        },
      };
    }
    case 'CLOSE': {
      return {
        ...state,
        overlayData: {
          ...state.overlayData,
          [action.overlayId]: {
            ...state.overlayData[action.overlayId],
            isOpen: false,
          },
        },
      };
    }
    case 'REMOVE': {
      const remainingOverlays = state.overlayOrderList.filter((item) => item !== action.overlayId);
      if (state.overlayOrderList.length === remainingOverlays.length) {
        return state;
      }

      const copiedOverlayData = { ...state.overlayData };
      delete copiedOverlayData[action.overlayId];

      return {
        current: remainingOverlays.at(-1) || state.current,
        overlayOrderList: remainingOverlays,
        overlayData: copiedOverlayData,
      };
    }
    case 'CLOSE_ALL': {
      return {
        ...state,
        overlayData: Object.keys(state.overlayData).reduce(
          (prev, curr) => ({
            ...prev,
            [curr]: {
              ...state.overlayData[curr],
              isOpen: false,
            } satisfies OverlayItem,
          }),
          {} satisfies Record<string, OverlayItem>
        ),
      };
    }
    case 'REMOVE_ALL': {
      return { current: state.current, overlayOrderList: [], overlayData: {} };
    }
  }
}
