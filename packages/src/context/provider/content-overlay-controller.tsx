import { type FC, type ActionDispatch, memo, useEffect } from 'react';
import { type OverlayReducerAction } from '../reducer';

export type OverlayControllerProps = {
  overlayId: string;
  isOpen: boolean;
  close: () => void;
  unmount: () => void;
};

export type OverlayAsyncControllerProps<T> = Omit<OverlayControllerProps, 'close'> & {
  close: (param: T) => void;
  reject: (reason?: unknown) => void;
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
        isOpen={isOpen}
        overlayId={overlayId}
        close={() => overlayDispatch({ type: 'CLOSE', overlayId })}
        unmount={() => overlayDispatch({ type: 'REMOVE', overlayId })}
      />
    );
  }
);
