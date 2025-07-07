import { useCallback, useEffect, useReducer, useRef, type PropsWithChildren } from 'react';
import { ContentOverlayController } from './content-overlay-controller';
import { type OverlayEvent, createOverlay } from '../../event';
import { randomId } from '../../utils/random-id';
import { createOverlaySafeContext } from '../context';
import { overlayReducer } from '../reducer';

export function createOverlayProvider() {
  const overlayId = randomId();
  const { useOverlayEvent, ...overlay } = createOverlay(overlayId);
  const { OverlayContextProvider, useCurrentOverlay, useOverlayData } = createOverlaySafeContext();

  function OverlayProvider({ children }: PropsWithChildren) {
    const [overlayState, overlayDispatch] = useReducer(overlayReducer, {
      current: null,
      overlayOrderList: [],
      overlayData: {},
    });
    const prevOverlayState = useRef(overlayState);

    const open: OverlayEvent['open'] = useCallback(({ controller, overlayId, componentKey }) => {
      overlayDispatch({
        type: 'ADD',
        overlay: {
          id: overlayId,
          componentKey,
          isOpen: false,
          controller: controller,
        },
      });
    }, []);
    const close: OverlayEvent['close'] = useCallback((overlayId: string) => {
      overlayDispatch({ type: 'CLOSE', overlayId });
    }, []);
    const unmount: OverlayEvent['unmount'] = useCallback((overlayId: string) => {
      overlayDispatch({ type: 'REMOVE', overlayId });
    }, []);
    const closeAll: OverlayEvent['closeAll'] = useCallback(() => {
      overlayDispatch({ type: 'CLOSE_ALL' });
    }, []);
    const unmountAll: OverlayEvent['unmountAll'] = useCallback(() => {
      overlayDispatch({ type: 'REMOVE_ALL' });
    }, []);

    useOverlayEvent({ open, close, unmount, closeAll, unmountAll });

    /**
     * @TODO
     * Due to React batching, only the current of the last modal can be recognized,
     * so when n modals closed by close are opened at once with overlay.open,
     * some modals may not open.
     *
     * To solve this, prevOverlayState.current.overlayData's isOpen should be false,
     * and overlayState.overlayData's isOpen should be true.
     * Reducer modification is needed to handle this part, and since this issue
     * has existed from before, we'll skip it for now.
     */
    if (prevOverlayState.current !== overlayState) {
      // mounted overlay open
      overlayState.overlayOrderList.forEach((overlayId) => {
        if (prevOverlayState.current.overlayData[overlayId] == null) {
          requestAnimationFrame(() => {
            overlayDispatch({ type: 'OPEN', overlayId });
          });
        }
      });

      // reopened overlay open
      if (overlayState.current != null && prevOverlayState.current.overlayData[overlayState.current] != null) {
        const isPrevOverlayClosed = prevOverlayState.current.overlayData[overlayState.current].isOpen === false;

        if (isPrevOverlayClosed) {
          requestAnimationFrame(() => {
            overlayDispatch({ type: 'OPEN', overlayId: overlayState.current! });
          });
        }
      }

      prevOverlayState.current = overlayState;
    }

    useEffect(() => {
      return () => {
        overlayDispatch({ type: 'REMOVE_ALL' });
      };
    }, []);

    return (
      <OverlayContextProvider value={overlayState}>
        {children}
        {overlayState.overlayOrderList.map((item) => {
          const { id: currentOverlayId, componentKey, isOpen, controller: Controller } = overlayState.overlayData[item];

          return (
            <ContentOverlayController
              key={componentKey}
              isOpen={isOpen}
              controller={Controller}
              overlayId={currentOverlayId}
              overlayDispatch={overlayDispatch}
            />
          );
        })}
      </OverlayContextProvider>
    );
  }

  return { overlay, OverlayProvider, useCurrentOverlay, useOverlayData };
}
