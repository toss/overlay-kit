import { type OverlayData, type OverlayItem } from './store';

export type OverlayReducerAction =
  | { type: 'ADD'; overlay: OverlayItem }
  | { type: 'OPEN'; overlayId: string }
  | { type: 'CLOSE'; overlayId: string }
  | { type: 'REMOVE'; overlayId: string }
  | { type: 'CLOSE_ALL' }
  | { type: 'REMOVE_ALL' };

export function overlayReducer(state: OverlayData, action: OverlayReducerAction): OverlayData {
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
      const remainingOverlays = state.overlayOrderList.filter((item) => item !== action.overlayId);
      /**
       * @description When close a non-existent overlayId
       */
      if (state.overlayOrderList.length === remainingOverlays.length) {
        return state;
      }

      return {
        ...state,
        current: remainingOverlays.at(-1) ?? null,
        /**
         * @description Empty the overlayOrderList to adjust the order when you reopen the overlay
         */
        overlayOrderList: remainingOverlays,
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
      /**
       * @description When unmount a non-existent overlayId
       */
      if (state.overlayOrderList.length === remainingOverlays.length) {
        return state;
      }

      const copiedOverlayData = { ...state.overlayData };
      delete copiedOverlayData[action.overlayId];

      return {
        current: remainingOverlays.at(-1) ?? null,
        /**
         * @description Handles unmount without close.
         */
        overlayOrderList: remainingOverlays,
        overlayData: copiedOverlayData,
      };
    }
    case 'CLOSE_ALL': {
      return {
        current: null,
        overlayOrderList: [],
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
      return { current: null, overlayOrderList: [], overlayData: {} };
    }
  }
}
