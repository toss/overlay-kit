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

    if (prevOverlayState.current !== overlayState) {
      prevOverlayState.current = overlayState;

      if (overlayState.current != null && overlayState.overlayData[overlayState.current].isOpen === false) {
        overlayDispatch({ type: 'OPEN', overlayId: overlayState.current });
      }
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
