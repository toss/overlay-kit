import { createOverlayProvider } from '../context/provider';
import { createRegisterOverlaysStore } from '../context/store';
import { createOverlay } from '../event';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function experimental_createOverlayContext() {
  const localOverlayStore = createRegisterOverlaysStore();
  const overlay = createOverlay(localOverlayStore);
  const OverlayProvider = createOverlayProvider(localOverlayStore);

  return { overlay, OverlayProvider };
}
