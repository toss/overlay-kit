import { useCallback, useEffect, useReducer, type PropsWithChildren } from 'react';
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

    useEffect(() => {
      return () => {
        overlayDispatch({ type: 'REMOVE_ALL' });
      };
    }, []);

    return (
      <OverlayContextProvider value={overlayState}>
        {children}
        {overlayState.overlayOrderList.map((item) => {
          const {
            id: currentOverlayId,
            componentKey,
            isOpen,
            controller: currentController,
          } = overlayState.overlayData[item];

          return (
            <ContentOverlayController
              key={componentKey}
              isOpen={isOpen}
              overlayId={currentOverlayId}
              overlayDispatch={overlayDispatch}
              controller={currentController}
            />
          );
        })}
      </OverlayContextProvider>
    );
  }

  return { overlay, OverlayProvider, useCurrentOverlay, useOverlayData };
}
