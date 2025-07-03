import { type FC, useEffect, useRef, ActionDispatch, useCallback, memo } from 'react';
import { OverlayReducerAction } from '../reducer';

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
  overlayId: string;
  overlayDispatch: ActionDispatch<[action: OverlayReducerAction]>;
  controller: OverlayControllerComponent;
};

export const ContentOverlayController = memo(
  ({ isOpen, overlayId, overlayDispatch, controller: Controller }: ContentOverlayControllerProps) => {
    useEffect(() => {
      requestAnimationFrame(() => {
        overlayDispatch({ type: 'OPEN', overlayId });
      });
    }, [overlayDispatch, overlayId]);

    return (
      <Controller
        overlayId={overlayId}
        isOpen={isOpen}
        close={() => overlayDispatch({ type: 'CLOSE', overlayId })}
        unmount={() => overlayDispatch({ type: 'REMOVE', overlayId })}
      />
    );
  }
);
