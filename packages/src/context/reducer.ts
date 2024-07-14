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
      const isExisted = state.overlayOrderList.includes(action.overlay.id);

      if (isExisted && state.overlayData[action.overlay.id].isOpen === true) {
        throw new Error("You can't open the multiple overlays with the same overlayId. Please set a different id.");
      }

      return {
        current: action.overlay.id,
        /**
         * @description Brings the overlay to the front when reopened after closing without unmounting.
         */
        overlayOrderList: [...state.overlayOrderList.filter((item) => item !== action.overlay.id), action.overlay.id],
        overlayData: isExisted
          ? state.overlayData
          : {
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
      const openedOverlayOrderList = state.overlayOrderList.filter(
        (orderedOverlayId) => state.overlayData[orderedOverlayId].isOpen === true
      );
      const targetIndexInOpenedList = openedOverlayOrderList.findIndex((item) => item === action.overlayId);

      /**
       * @description If closing the last overlay, specify the overlay before it.
       * @description If closing intermediate overlays, specifies the last overlay.
       *
       * @example open - [1, 2, 3, 4]
       * close 2 => current: 4
       * close 4 => current: 3
       * close 3 => current: 1
       * close 1 => current: null
       */
      const currentOverlayId =
        targetIndexInOpenedList === openedOverlayOrderList.length - 1
          ? openedOverlayOrderList[targetIndexInOpenedList - 1] ?? null
          : openedOverlayOrderList.at(-1) ?? null;

      return {
        ...state,
        current: currentOverlayId,
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

      const current = state.current
        ? remainingOverlays.includes(state.current)
          ? /**
             * @description If `unmount` was executed after `close`
             */
            state.current
          : /**
             * @description If you only run `unmount`, there is no `current` in `remainingOverlays`
             */
            remainingOverlays.at(-1) ?? null
        : /**
           * @description The case where `current` is `null`
           */
          null;

      return {
        current,
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
      return { current: null, overlayOrderList: [], overlayData: {} };
    }
  }
}
