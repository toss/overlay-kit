import { type FC, useEffect, useRef, type PropsWithChildren } from 'react';
import { OverlayContextProvider } from './context';
import { dispatchOverlay } from './store';
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

export type OverlayAsyncControllerProps<T> = Omit<OverlayControllerProps, 'close'> & {
  /**
   * @description The close and unmount methods are conditionally typed based on the type parameter T.
   * If T is void, the methods are simple functions that take no parameters.
   * If T is boolean, the methods take a boolean parameter.
   * For any other type T, the methods take a parameter of type T.
   * The boolean condition is necessary because void extends boolean, which would otherwise cause issues.
   */
  close: T extends void ? () => void : T extends boolean ? (param: boolean) => void : (param: T) => void;
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
