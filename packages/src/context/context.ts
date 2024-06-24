import { type FC } from 'react';
import { createSafeContext } from '../utils';

export type OverlayControllerComponent = FC<OverlayControllerProps>;

export type OverlayControllerProps = {
  overlayId: string;
  isOpen: boolean;
  close: () => void;
  exit: () => void;
  delayedExit: (ms?: number) => void;
};

export type OverlayContextValue = {
  overlayList: string[];
  open: (value: FC<OverlayControllerProps>) => void;
  close: (id: string) => void;
  exit: (id: string) => void;
  closeAll: () => void;
  exitAll: () => void;
  delayedExit: (options: { id: string; ms?: number }) => void;
  delayedExitAll: (ms?: number) => void;
};

export const [OverlayContextProvider, useOverlayContext] =
  createSafeContext<OverlayContextValue>('overlay-kit/OverlayContext');

export function useOverlayList() {
  return useOverlayContext().overlayList;
}
