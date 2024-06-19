import { type FC, type PropsWithChildren, useCallback, useReducer, useEffect, useRef } from 'react';
import { type OverlayContextValue, type OverlayControllerProps, OverlayContextProvider } from './context';
import { type OverlayReducerState, overlayReducer } from './reducer';
import { useOverlayEvent } from '../event';
import { randomId } from '../utils';

export function OverlayProvider({ children }: PropsWithChildren) {
  const [overlayState, overlayDispatch] = useReducer(overlayReducer, {
    current: null,
    overlayOrderList: [],
    overlayData: {},
  } satisfies OverlayReducerState);

  const open: OverlayContextValue['open'] = useCallback((controller) => {
    const overlayId = randomId();

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
  const exit: OverlayContextValue['exit'] = useCallback((id: string) => {
    overlayDispatch({ type: 'REMOVE', overlayId: id });
  }, []);
  const closeAll: OverlayContextValue['closeAll'] = useCallback(() => {
    overlayDispatch({ type: 'CLOSE_ALL' });
  }, []);
  const exitAll: OverlayContextValue['exitAll'] = useCallback(() => {
    overlayDispatch({ type: 'REMOVE_ALL' });
  }, []);
  const delayedExit: OverlayContextValue['delayedExit'] = useCallback(
    (options: { id: string; ms?: number }) => {
      close(options.id);
      setTimeout(() => exit(options.id), options.ms ?? 100);
    },
    [close, exit]
  );
  const delayedExitAll: OverlayContextValue['delayedExitAll'] = useCallback(
    (ms?: number) => {
      closeAll();
      setTimeout(() => exitAll(), ms ?? 100);
    },
    [closeAll, exitAll]
  );
  /**
   * @description customEvent 함수를 실행시켰을 때 위 함수가 실행되도록 매핑합니다.
   */
  useOverlayEvent({ open, close, exit, closeAll, exitAll, delayedExit, delayedExitAll });

  const contextValue: OverlayContextValue = {
    overlayList: overlayState.overlayOrderList,
    open,
    close,
    exit,
    closeAll,
    exitAll,
    delayedExit,
    delayedExitAll,
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
            onExitModal={() => exit(currentOverlayId)}
            onDelayedExit={(ms) => delayedExit({ id: currentOverlayId, ms })}
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
  controller: FC<OverlayControllerProps>;
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
      exit={onExitModal}
      delayedExit={onDelayedExit}
    />
  );
}
