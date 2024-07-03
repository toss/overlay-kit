import { type FC, useEffect, useRef, type PropsWithChildren } from 'react';
import { dispatchOverlay } from './store';
import { useSyncOverlayStore } from './use-sync-overlay-store';
import { overlay } from '../event';

export function OverlayProvider({ children }: PropsWithChildren) {
  const overlayState = useSyncOverlayStore();

  return (
    <>
      {children}
      {overlayState.overlayOrderList.map((item) => {
        const { id: currentOverlayId, isOpen, controller: currentController } = overlayState.overlayData[item];

        return (
          <ContentOverlayController
            key={currentOverlayId}
            isOpen={isOpen}
            overlayId={currentOverlayId}
            onMounted={() => {
              requestAnimationFrame(() => {
                dispatchOverlay({ type: 'OPEN', overlayId: currentOverlayId });
              });
            }}
            onCloseModal={() => overlay.close(currentOverlayId)}
            onExitModal={() => overlay.unmount(currentOverlayId)}
            controller={currentController}
          />
        );
      })}
    </>
  );
}

type OverlayControllerProps = {
  overlayId: string;
  isOpen: boolean;
  close: () => void;
  unmount: () => void;
};

export type OverlayControllerComponent = FC<OverlayControllerProps>;

type ContentOverlayControllerProps = {
  isOpen: boolean;
  overlayId: string;
  onMounted: () => void;
  onCloseModal: () => void;
  onExitModal: () => void;
  controller: OverlayControllerComponent;
};

function ContentOverlayController({
  isOpen,
  overlayId,
  onMounted,
  onCloseModal,
  onExitModal,
  controller: Controller,
}: ContentOverlayControllerProps) {
  const onMountedRef = useRef(onMounted);

  useEffect(() => {
    onMountedRef.current();
  }, []);

  return <Controller overlayId={overlayId} isOpen={isOpen} close={onCloseModal} unmount={onExitModal} />;
}
