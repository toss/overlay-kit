import { createOverlayProvider } from '../context/provider';

export const { overlay, OverlayProvider, useCurrentOverlay, useOverlayData } = experimental_createOverlayContext();

// eslint-disable-next-line @typescript-eslint/naming-convention
export function experimental_createOverlayContext() {
  return createOverlayProvider();
}
