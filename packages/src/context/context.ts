import { type OverlayData } from './store';
import { createSafeContext } from '../utils/create-safe-context';

export const [OverlayContextProvider, useOverlayContext] = createSafeContext<OverlayData>('overlay-kit/OverlayContext');

export function useCurrentOverlay() {
  return useOverlayContext().current;
}

export function useOverlayData() {
  return useOverlayContext().overlayData;
}
