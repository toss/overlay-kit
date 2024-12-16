import { type FC, useEffect, useRef, type PropsWithChildren } from 'react';
import { OverlayContextProvider } from './context';
import { type OverlayItem, dispatchOverlay } from './store';
import { useSyncOverlayStore } from './use-sync-overlay-store';
import { overlay } from '../event';

export function OverlayProvider({ children }: PropsWithChildren) {
  const overlayState = useSyncOverlayStore();

  useEffect(() => {
    return () => {
      dispatchOverlay({ type: 'REMOVE_ALL' });
    };
  }, []);

  return (
    <OverlayContextProvider value={overlayState}>
      {children}
      {overlayState.orderIds.map((orderId) => {
        const { id: currentId, isOpen, controller: currentController } = overlayState.data[orderId];

        return (
          <ContentOverlayController
            key={currentId}
            isOpen={isOpen}
            currentId={overlayState.currentId}
            overlayId={currentId}
            onMounted={() => {
              requestAnimationFrame(() => {
                dispatchOverlay({ type: 'OPEN', overlayId: currentId });
              });
            }}
            onCloseModal={() => overlay.close(currentId)}
            onExitModal={() => overlay.unmount(currentId)}
            controller={currentController}
          />
        );
      })}
    </OverlayContextProvider>
  );
}

type OverlayControllerProps = {
  overlayId: string;
  isOpen: boolean;
  close: () => void;
  unmount: () => void;
};

type OverlayAsyncControllerProps<T> = Omit<OverlayControllerProps, 'close'> & {
  close: (param: T) => void;
};

export type OverlayControllerComponent = FC<OverlayControllerProps>;
export type OverlayAsyncControllerComponent<T> = FC<OverlayAsyncControllerProps<T>>;

type ContentOverlayControllerProps = {
  isOpen: boolean;
  currentId: OverlayItem['id'] | null;
  overlayId: OverlayItem['id'];
  onMounted: () => void;
  onCloseModal: () => void;
  onExitModal: () => void;
  controller: OverlayControllerComponent;
};

function ContentOverlayController({
  isOpen,
  currentId,
  overlayId,
  onMounted,
  onCloseModal,
  onExitModal,
  controller: Controller,
}: ContentOverlayControllerProps) {
  const prevCurrentId = useRef(currentId);
  const onMountedRef = useRef(onMounted);

  /**
   * @description Executes when closing and reopening an overlay without unmounting.
   */
  if (prevCurrentId.current !== currentId) {
    prevCurrentId.current = currentId;

    if (currentId === overlayId) {
      onMountedRef.current();
    }
  }

  useEffect(() => {
    onMountedRef.current();
  }, []);

  return <Controller overlayId={overlayId} isOpen={isOpen} close={onCloseModal} unmount={onExitModal} />;
}
