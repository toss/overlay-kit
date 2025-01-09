import { useEffect, type PropsWithChildren } from 'react';
import { ContentOverlayController } from './content-overlay-controller';
import { useSyncOverlayStore } from './use-sync-overlay-store';
import { overlay } from '../../event';
import { createOverlaySafeContext } from '../context';
import { type OverlayStore, globalOverlayStore } from '../store';

export const { OverlayProvider, useCurrentOverlay, useOverlayData } = createOverlayProvider(globalOverlayStore);

export function createOverlayProvider(overlayStore: OverlayStore) {
  const { OverlayContextProvider, useCurrentOverlay, useOverlayData } = createOverlaySafeContext();

  function OverlayProvider({ children }: PropsWithChildren) {
    const overlayState = useSyncOverlayStore(overlayStore);

    useEffect(() => {
      return () => {
        overlayStore.dispatchOverlay({ type: 'REMOVE_ALL' });
      };
    }, []);

    return (
      <OverlayContextProvider value={overlayState}>
        {children}
        {overlayState.overlayOrderList.map((item) => {
          const { id: currentOverlayId, isOpen, controller: currentController } = overlayState.overlayData[item];

          return (
            <ContentOverlayController
              key={currentOverlayId}
              isOpen={isOpen}
              current={overlayState.current}
              overlayId={currentOverlayId}
              onMounted={() => {
                requestAnimationFrame(() => {
                  overlayStore.dispatchOverlay({ type: 'OPEN', overlayId: currentOverlayId });
                });
              }}
              onCloseModal={() => overlay.close(currentOverlayId)}
              onExitModal={() => overlay.unmount(currentOverlayId)}
              controller={currentController}
            />
          );
        })}
      </OverlayContextProvider>
    );
  }

  return { OverlayProvider, useCurrentOverlay, useOverlayData };
}
