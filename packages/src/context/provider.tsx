import { type FC, useEffect, useRef, type PropsWithChildren } from 'react';
import { OverlayContextProvider } from './context';
import { dispatchOverlay } from './store';
import { useSyncOverlayStore } from './use-sync-overlay-store';
import { overlay } from '../event';

export function OverlayProvider({ children }: PropsWithChildren) {
  const overlayState = useSyncOverlayStore();

  if (overlayState == null) {
    dispatchOverlay({ type: 'INIT' });
  }

  useEffect(() => {
    return () => {
      dispatchOverlay({ type: 'REMOVE_ALL' });
    };
  }, []);

  return (
    <OverlayContextProvider value={overlayState}>
      {children}
      {overlayState != null &&
        overlayState.overlayOrderList.map((item) => {
          const { id: currentOverlayId, isOpen, controller: currentController } = overlayState.overlayData[item];

          return (
            <ContentOverlayController
              key={currentOverlayId}
              isOpen={isOpen}
              current={overlayState.current}
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
  current: string | null;
  overlayId: string;
  onMounted: () => void;
  onCloseModal: () => void;
  onExitModal: () => void;
  controller: OverlayControllerComponent;
};

function ContentOverlayController({
  isOpen,
  current,
  overlayId,
  onMounted,
  onCloseModal,
  onExitModal,
  controller: Controller,
}: ContentOverlayControllerProps) {
  const prevCurrent = useRef(current);
  const onMountedRef = useRef(onMounted);

  /**
   * @description Executes when closing and reopening an overlay without unmounting.
   */
  if (prevCurrent.current !== current) {
    prevCurrent.current = current;

    if (current === overlayId) {
      onMountedRef.current();
    }
  }

  useEffect(() => {
    onMountedRef.current();
  }, []);

  return <Controller overlayId={overlayId} isOpen={isOpen} close={onCloseModal} unmount={onExitModal} />;
}
