import { type FC } from 'react';
import { createSafeContext } from '../utils';

export type OverlayControllerComponent = FC<OverlayControllerProps>;

export type OverlayControllerProps = {
  overlayId: string;
  isOpen: boolean;
  close: () => void;
  unmount: () => void;
  delayedUnmount: (ms?: number) => void;
};

export type OverlayContextValue = {
  overlayList: string[];
  open: (value: { controller: OverlayControllerComponent; overlayId: string }) => void;
  close: (id: string) => void;
  unmount: (id: string) => void;
  closeAll: () => void;
  unmountAll: () => void;
  delayedUnmount: (options: { id: string; ms?: number }) => void;
  delayedUnmountAll: (ms?: number) => void;
};

export const [OverlayContextProvider, useOverlayContext] =
  createSafeContext<OverlayContextValue>('overlay-kit/OverlayContext');

export function useOverlayList() {
  return useOverlayContext().overlayList;
}
