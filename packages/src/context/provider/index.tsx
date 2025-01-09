import { useEffect, type PropsWithChildren } from 'react';
import { ContentOverlayController } from './content-overlay-controller';
import { useSyncOverlayStore } from './use-sync-overlay-store';
import { createOverlay } from '../../event';
import { createOverlaySafeContext } from '../context';
import { type OverlayStore } from '../store';

export function createOverlayProvider(overlayStore: OverlayStore) {
  const overlay = createOverlay(overlayStore);
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

  return { overlay, OverlayProvider, useCurrentOverlay, useOverlayData };
}
