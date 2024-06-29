import { type FC } from 'react';
import { createSafeContext } from '../utils';

export type OverlayControllerComponent = FC<OverlayControllerProps>;

export type OverlayControllerProps = {
  overlayId: string;
  isOpen: boolean;
  close: () => void;
  unmount: () => void;
};

export type OverlayContextValue = {
  overlayList: string[];
  open: (value: { controller: OverlayControllerComponent; overlayId: string }) => void;
  close: (overlayId: string) => void;
  unmount: (overlayId: string) => void;
  closeAll: () => void;
  unmountAll: () => void;
};

export const [OverlayContextProvider, useOverlayContext] =
  createSafeContext<OverlayContextValue>('overlay-kit/OverlayContext');

export function useOverlayList() {
  return useOverlayContext().overlayList;
}
