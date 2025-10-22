import { type OverlayControllerComponent } from './provider/content-overlay-controller';

type OverlayId = string;
type OverlayItem = {
  /**
   * @description The unique identifier for the overlay.
   */
  id: OverlayId;
  /**
   * @description The key for the overlay component.
   * This is used to identify the overlay component when it is unmounted.
   */
  componentKey: string;
  isOpen: boolean;
  isMounted: boolean;
  controller: OverlayControllerComponent;
};
export type OverlayData = {
  current: OverlayId | null;
  overlayOrderList: OverlayId[];
  overlayData: Record<OverlayId, OverlayItem>;
};

export type OverlayReducerAction =
  | { type: 'ADD'; overlay: OverlayItem }
  | { type: 'OPEN'; overlayId: string }
  | { type: 'CLOSE'; overlayId: string }
  | { type: 'REMOVE'; overlayId: string }
  | { type: 'CLOSE_ALL' }
  | { type: 'REMOVE_ALL' };

/**
 * Determines which overlay should become the current one when closing or removing an overlay.
 *
 * @description If closing the last overlay, specify the overlay before it.
 * @description If closing intermediate overlays, specifies the last overlay.
 *
 * @example open - [1, 2, 3, 4]
 * close 2 => current: 4
 * close 4 => current: 3
 * close 3 => current: 1
 * close 1 => current: null
 *
 * @param overlayOrderList The ordered list of overlay IDs
 * @param overlayData The map of overlay data
 * @param targetOverlayId The ID of the overlay being closed or removed
 * @returns The ID of the overlay that should become current, or null if none
 */
export const determineCurrentOverlayId = (
  overlayOrderList: OverlayId[],
  overlayData: Record<OverlayId, OverlayItem>,
  targetOverlayId: OverlayId
): OverlayId | null => {
  const openedOverlayOrderList = overlayOrderList.filter(
    (orderedOverlayId) => overlayData[orderedOverlayId].isOpen === true
  );
  const targetIndexInOpenedList = openedOverlayOrderList.findIndex((item) => item === targetOverlayId);

  return targetIndexInOpenedList === openedOverlayOrderList.length - 1
    ? openedOverlayOrderList[targetIndexInOpenedList - 1] ?? null
    : openedOverlayOrderList[openedOverlayOrderList.length - 1];
};

export function overlayReducer(state: OverlayData, action: OverlayReducerAction): OverlayData {
  switch (action.type) {
    case 'ADD': {
      if (state.overlayData[action.overlay.id] != null && state.overlayData[action.overlay.id].isOpen === false) {
        const overlay = state.overlayData[action.overlay.id];

        // ignore if the overlay don't exist or already open
        if (overlay == null || overlay.isOpen) {
          return state;
        }

        return {
          ...state,
          current: action.overlay.id,
          overlayData: {
            ...state.overlayData,
            [action.overlay.id]: { ...overlay, isOpen: true },
          },
        };
      }

      const isExisted = state.overlayOrderList.includes(action.overlay.id);

      if (isExisted && state.overlayData[action.overlay.id].isOpen === true) {
        throw new Error(
          `You can't open the multiple overlays with the same overlayId(${action.overlay.id}). Please set a different id.`
        );
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
      const overlay = state.overlayData[action.overlayId];

      // ignore if the overlay don't exist or already open
      if (overlay == null || overlay.isOpen) {
        return state;
      }

      return {
        ...state,
        overlayData: {
          ...state.overlayData,
          [action.overlayId]: { ...overlay, isOpen: true, isMounted: true },
        },
      };
    }
    case 'CLOSE': {
      const overlay = state.overlayData[action.overlayId];

      // ignore if the overlay don't exist or already closed
      if (overlay == null || !overlay.isOpen) {
        return state;
      }

      const currentOverlayId = determineCurrentOverlayId(state.overlayOrderList, state.overlayData, action.overlayId);

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
      const overlay = state.overlayData[action.overlayId];

      // ignore if the overlay don't exist
      if (overlay == null) {
        return state;
      }

      const remainingOverlays = state.overlayOrderList.filter((item) => item !== action.overlayId);
      if (state.overlayOrderList.length === remainingOverlays.length) {
        return state;
      }

      const copiedOverlayData = { ...state.overlayData };
      delete copiedOverlayData[action.overlayId];

      const currentOverlayId = determineCurrentOverlayId(state.overlayOrderList, state.overlayData, action.overlayId);

      return {
        current: currentOverlayId,
        overlayOrderList: remainingOverlays,
        overlayData: copiedOverlayData,
      };
    }
    case 'CLOSE_ALL': {
      // ignore if there is no overlay
      if (Object.keys(state.overlayData).length === 0) {
        return state;
      }

      return {
        ...state,
        current: null,
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
