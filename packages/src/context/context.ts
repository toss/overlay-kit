import { type OverlayData } from './store';
import { createSafeContext } from '../utils/create-safe-context';

export const [OverlayContextProvider, useOverlayContext] = createSafeContext<OverlayData>('overlay-kit/OverlayContext');

function useSafeOverlayContext() {
  const overlayContext = useOverlayContext();

  if (overlayContext == null) {
    throw new Error('This component must be used inside a <OverlayProvider> component.');
  }

  return overlayContext;
}

export function useCurrentOverlay() {
  return useSafeOverlayContext().current;
}

export function useOverlayData() {
  return useSafeOverlayContext().overlayData;
}
