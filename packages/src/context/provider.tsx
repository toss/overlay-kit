import { type PropsWithChildren, useCallback, useReducer, useEffect, useRef } from 'react';
import { type OverlayContextValue, OverlayContextProvider, OverlayControllerComponent } from './context';
import { type OverlayReducerState, overlayReducer } from './reducer';
import { useOverlayEvent } from '../event';

export function OverlayProvider({ children }: PropsWithChildren) {
  const [overlayState, overlayDispatch] = useReducer(overlayReducer, {
    current: null,
    overlayOrderList: [],
    overlayData: {},
  } satisfies OverlayReducerState);

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
  const delayedUnmount: OverlayContextValue['delayedUnmount'] = useCallback(
    (options: { id: string; ms?: number }) => {
      close(options.id);
      setTimeout(() => unmount(options.id), options.ms ?? 100);
    },
    [close, unmount]
  );
  const delayedUnmountAll: OverlayContextValue['delayedUnmountAll'] = useCallback(
    (ms?: number) => {
      closeAll();
      setTimeout(() => unmountAll(), ms ?? 100);
    },
    [closeAll, unmountAll]
  );
  /**
   * @description customEvent 함수를 실행시켰을 때 위 함수가 실행되도록 매핑합니다.
   */
  useOverlayEvent({ open, close, unmount, closeAll, unmountAll, delayedUnmount, delayedUnmountAll });

  const contextValue: OverlayContextValue = {
    overlayList: overlayState.overlayOrderList,
    open,
    close,
    unmount,
    closeAll,
    unmountAll,
    delayedUnmount,
    delayedUnmountAll,
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
            onDelayedExit={(ms) => delayedUnmount({ id: currentOverlayId, ms })}
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
  onDelayedExit: (ms?: number) => void;
  controller: OverlayControllerComponent;
};

function ContentOverlayController({
  isOpen,
  overlayId,
  onMounted,
  onCloseModal,
  onExitModal,
  onDelayedExit,
  controller: Controller,
}: ContentOverlayControllerProps) {
  const onMountedRef = useRef(onMounted);

  useEffect(() => {
    onMountedRef.current();
  }, []);

  return (
    <Controller
      overlayId={overlayId}
      isOpen={isOpen}
      close={onCloseModal}
      unmount={onExitModal}
      delayedUnmount={onDelayedExit}
    />
  );
}
