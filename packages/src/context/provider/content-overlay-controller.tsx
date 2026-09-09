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

export type OverlayAsyncResult = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
};

type ContentOverlayControllerProps = {
  isOpen: boolean;
  overlayId: string;
  overlayDispatch: ActionDispatch<[action: OverlayReducerAction]>;
  controller: OverlayControllerComponent;
  isAsyncController?: boolean;
  asyncResult?: OverlayAsyncResult;
};

export const ContentOverlayController = memo(
  ({
    isOpen,
    overlayId,
    overlayDispatch,
    controller: Controller,
    isAsyncController,
    asyncResult,
  }: ContentOverlayControllerProps) => {
    useEffect(() => {
      requestAnimationFrame(() => {
        overlayDispatch({ type: 'OPEN', overlayId });
      });
    }, [overlayDispatch, overlayId]);

    const props = {
      isOpen,
      overlayId,
      close: (value?: unknown) => {
        asyncResult?.resolve(value);
        overlayDispatch({ type: 'CLOSE', overlayId, asyncResult });
      },
      unmount: () => overlayDispatch({ type: 'REMOVE', overlayId }),
      ...(isAsyncController
        ? {
            reject: (reason?: unknown) => {
              asyncResult?.reject(reason);
              overlayDispatch({ type: 'CLOSE', overlayId, asyncResult });
            },
          }
        : {}),
    };

    return <Controller {...props} />;
  }
);
