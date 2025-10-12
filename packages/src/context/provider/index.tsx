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
          isMounted: false,
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

    if (prevOverlayState.current !== overlayState) {
      overlayState.overlayOrderList.forEach((overlayId) => {
        const prevOverlayData = prevOverlayState.current.overlayData;
        const currOverlayData = overlayState.overlayData;

        if (prevOverlayData[overlayId] != null && prevOverlayData[overlayId].isMounted === true) {
          const isPrevOverlayClosed = prevOverlayData[overlayId].isOpen === false;
          const isCurrOverlayOpened = currOverlayData[overlayId].isOpen === true;

          if (isPrevOverlayClosed && isCurrOverlayOpened) {
            requestAnimationFrame(() => {
              overlayDispatch({ type: 'OPEN', overlayId });
            });
          }
        }
      });

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
