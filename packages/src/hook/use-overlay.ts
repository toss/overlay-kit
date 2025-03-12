import { useEffect, useState } from 'react';
import {
  type OverlayAsyncControllerComponent,
  type OverlayControllerComponent,
} from '../context/provider/content-overlay-controller';
import { type OverlayItemContext } from '../context/store';
import { overlay } from '../utils';
import { randomId } from '../utils/random-id';

export interface UseOverlayProps<C extends OverlayItemContext> {
  context?: C;
  overlayId?: string;
}

export function useOverlay<C extends OverlayItemContext>({ context, overlayId }: UseOverlayProps<C>) {
  const [id] = useState(() => overlayId ?? randomId());

  useEffect(() => {
    overlay.updateContext(id, context ?? ({} as C));
  }, [context, id]);

  return {
    open: (controller: OverlayControllerComponent<C>) => overlay.open(controller, { overlayId: id, context }),
    openAsync: <T>(controller: OverlayAsyncControllerComponent<T, C>) =>
      overlay.openAsync(controller, { overlayId: id, context }),
    close: () => overlay.close(id),
    unmount: () => overlay.unmount(id),
  };
}
