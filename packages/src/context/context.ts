import { type OverlayData } from './reducer';
import { createSafeContext } from '../utils/create-safe-context';

export function createOverlaySafeContext() {
  const [OverlayContextProvider, useOverlayContext] = createSafeContext<OverlayData>('overlay-kit/OverlayContext');

  function useCurrentOverlay() {
    return useOverlayContext().current;
  }

  function useOverlayData() {
    return useOverlayContext().overlayData;
  }

  return { OverlayContextProvider, useCurrentOverlay, useOverlayData };
}
