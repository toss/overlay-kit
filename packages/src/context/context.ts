import { type OverlayState } from './store';
import { createSafeContext } from '../utils/create-safe-context';

export const [OverlayContextProvider, useOverlayContext] =
  createSafeContext<OverlayState>('overlay-kit/OverlayContext');

export function useOverlayCurrentId() {
  return useOverlayContext().currentId;
}

export function useOverlayData() {
  return useOverlayContext().data;
}
