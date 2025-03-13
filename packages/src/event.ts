import {
  type OverlayAsyncControllerComponent,
  type OverlayControllerComponent,
} from './context/provider/content-overlay-controller';
import { type OverlayItemContext, type OverlayStore } from './context/store';
import { randomId } from './utils/random-id';

type OpenOverlayOptions<C extends OverlayItemContext> = {
  overlayId?: string;
  context?: C;
};

export function createOverlay(overlayStore: OverlayStore) {
  function open<C extends OverlayItemContext>(
    controller: OverlayControllerComponent<C>,
    options?: OpenOverlayOptions<C>
  ) {
    const overlayId = options?.overlayId ?? randomId();
    const context = options?.context;

    overlayStore.dispatchOverlay({
      type: 'ADD',
      overlay: {
        id: overlayId,
        isOpen: false,
        controller: controller as OverlayControllerComponent<OverlayItemContext>,
        context: context ?? ({} as C),
      },
    });

    return overlayId;
  }

  async function openAsync<T, C extends OverlayItemContext>(
    controller: OverlayAsyncControllerComponent<T, C>,
    options?: OpenOverlayOptions<C>
  ) {
    return new Promise<T>((resolve) => {
      open((overlayProps, ...deprecatedLegacyContext) => {
        /**
         * @description close the overlay with resolve
         */
        const close = (param: T) => {
          resolve(param as T);
          overlayProps.close();
        };
        /**
         * @description Passing overridden methods
         */
        const props = { ...overlayProps, close };
        return controller(props, ...deprecatedLegacyContext);
      }, options);
    });
  }

  function close(overlayId: string) {
    overlayStore.dispatchOverlay({ type: 'CLOSE', overlayId });
  }
  function unmount(overlayId: string) {
    overlayStore.dispatchOverlay({ type: 'REMOVE', overlayId });
  }
  function closeAll() {
    overlayStore.dispatchOverlay({ type: 'CLOSE_ALL' });
  }
  function unmountAll() {
    overlayStore.dispatchOverlay({ type: 'REMOVE_ALL' });
  }
  function updateContext<C extends OverlayItemContext>(overlayId: string, context: C) {
    overlayStore.dispatchOverlay({ type: 'UPDATE_CONTEXT', overlayId, context });
  }

  return {
    open,
    close,
    unmount,
    closeAll,
    unmountAll,
    openAsync,
    updateContext,
  };
}
