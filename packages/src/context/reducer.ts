import { type OverlayState, type OverlayItem } from './store';

export type OverlayReducerAction =
  | { type: 'ADD'; overlay: OverlayItem }
  | { type: 'OPEN'; overlayId: OverlayItem['id'] }
  | { type: 'CLOSE'; overlayId: OverlayItem['id'] }
  | { type: 'REMOVE'; overlayId: OverlayItem['id'] }
  | { type: 'CLOSE_ALL' }
  | { type: 'REMOVE_ALL' };

export function overlayReducer(state: OverlayState, action: OverlayReducerAction): OverlayState {
  switch (action.type) {
    case 'ADD': {
      const isExisted = state.orderIds.includes(action.overlay.id);

      if (isExisted && state.data[action.overlay.id].isOpen === true) {
        throw new Error("You can't open the multiple overlays with the same overlayId. Please set a different id.");
      }

      return {
        currentId: action.overlay.id,
        /**
         * @description Brings the overlay to the front when reopened after closing without unmounting.
         */
        orderIds: [...state.orderIds.filter((orderId) => orderId !== action.overlay.id), action.overlay.id],
        data: isExisted
          ? state.data
          : {
              ...state.data,
              [action.overlay.id]: action.overlay,
            },
      };
    }
    case 'OPEN': {
      return {
        ...state,
        data: {
          ...state.data,
          [action.overlayId]: {
            ...state.data[action.overlayId],
            isOpen: true,
          },
        },
      };
    }
    case 'CLOSE': {
      const openedOrderIds = state.orderIds.filter((orderId) => state.data[orderId].isOpen === true);
      const targetOpenedOrderIdIndex = openedOrderIds.findIndex((openedOrderId) => openedOrderId === action.overlayId);

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
        targetOpenedOrderIdIndex === openedOrderIds.length - 1
          ? openedOrderIds[targetOpenedOrderIdIndex - 1] ?? null
          : openedOrderIds.at(-1) ?? null;

      return {
        ...state,
        currentId: currentOverlayId,
        data: {
          ...state.data,
          [action.overlayId]: {
            ...state.data[action.overlayId],
            isOpen: false,
          },
        },
      };
    }
    case 'REMOVE': {
      const remainingOrderIds = state.orderIds.filter((orderId) => orderId !== action.overlayId);
      if (state.orderIds.length === remainingOrderIds.length) {
        return state;
      }

      const copiedData = { ...state.data };
      delete copiedData[action.overlayId];

      const currentId = state.currentId
        ? remainingOrderIds.includes(state.currentId)
          ? /**
             * @description If `unmount` was executed after `close`
             */
            state.currentId
          : /**
             * @description If you only run `unmount`, there is no `currentId` in `remainingOrderIds`
             */
            remainingOrderIds.at(-1) ?? null
        : /**
           * @description The case where `currentId` is `null`
           */
          null;

      return {
        currentId,
        orderIds: remainingOrderIds,
        data: copiedData,
      };
    }
    case 'CLOSE_ALL': {
      return {
        ...state,
        data: Object.keys(state.data).reduce(
          (prev, curr) => ({
            ...prev,
            [curr]: {
              ...state.data[curr],
              isOpen: false,
            } satisfies OverlayItem,
          }),
          {} satisfies Record<string, OverlayItem>
        ),
      };
    }
    case 'REMOVE_ALL': {
      return { currentId: null, orderIds: [], data: {} };
    }
  }
}
