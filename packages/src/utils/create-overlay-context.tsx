import { createOverlayProvider } from '../context/provider';
import { createRegisterOverlaysStore } from '../context/store';

export const { overlay, OverlayProvider, useCurrentOverlay, useOverlayData } = experimental_createOverlayContext();

// eslint-disable-next-line @typescript-eslint/naming-convention
export function experimental_createOverlayContext() {
  const localOverlayStore = createRegisterOverlaysStore();

  return createOverlayProvider(localOverlayStore);
}
