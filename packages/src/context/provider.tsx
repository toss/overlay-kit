import { useCallback, useEffect, useReducer, useRef, type PropsWithChildren } from 'react';
import { OverlayContextProvider, type OverlayContextValue, type OverlayControllerComponent } from './context';
import { overlayReducer } from './reducer';
import { type OverlayData } from './store';
import { useOverlayEvent } from '../event';

export function OverlayProvider({ children }: PropsWithChildren) {
  const [overlayState, overlayDispatch] = useReducer(overlayReducer, {
    current: null,
    overlayOrderList: [],
    overlayData: {},
  } satisfies OverlayData);

  const open: OverlayContextValue['open'] = useCallback(({ controller, overlayId }) => {
    overlayDispatch({
      type: 'ADD',
      overlay: {
        id: overlayId,
        isOpen: false,
        controller: controller,
      },
    });

    return overlayId;
  }, []);
  const close: OverlayContextValue['close'] = useCallback((id: string) => {
    overlayDispatch({ type: 'CLOSE', overlayId: id });
  }, []);
  const unmount: OverlayContextValue['unmount'] = useCallback((id: string) => {
    overlayDispatch({ type: 'REMOVE', overlayId: id });
  }, []);
  const closeAll: OverlayContextValue['closeAll'] = useCallback(() => {
    overlayDispatch({ type: 'CLOSE_ALL' });
  }, []);
  const unmountAll: OverlayContextValue['unmountAll'] = useCallback(() => {
    overlayDispatch({ type: 'REMOVE_ALL' });
  }, []);
  /**
   * @description Map the above function to be executed when the customEvent function is executed.
   */
  useOverlayEvent({ open, close, unmount, closeAll, unmountAll });

  const contextValue: OverlayContextValue = {
    overlayList: overlayState.overlayOrderList,
    open,
    close,
    unmount,
    closeAll,
    unmountAll,
  };

  return (
    <OverlayContextProvider value={contextValue}>
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
                overlayDispatch({ type: 'OPEN', overlayId: currentOverlayId });
              });
            }}
            onCloseModal={() => close(currentOverlayId)}
            onExitModal={() => unmount(currentOverlayId)}
            controller={currentController}
          />
        );
      })}
    </OverlayContextProvider>
  );
}

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
