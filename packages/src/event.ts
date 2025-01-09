import {
  type OverlayAsyncControllerComponent,
  type OverlayControllerComponent,
} from './context/provider/content-overlay-controller';
import { type OverlayStore, globalOverlayStore } from './context/store';
import { randomId } from './utils';

type OpenOverlayOptions = {
  overlayId?: string;
};

export function createOverlay(overlayStore: OverlayStore) {
  function open(controller: OverlayControllerComponent, options?: OpenOverlayOptions) {
    const overlayId = options?.overlayId ?? randomId();

    overlayStore.dispatchOverlay({
      type: 'ADD',
      overlay: {
        id: overlayId,
        isOpen: false,
        controller: controller,
      },
    });

    return overlayId;
  }

  async function openAsync<T>(controller: OverlayAsyncControllerComponent<T>, options?: OpenOverlayOptions) {
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

  return {
    open,
    close,
    unmount,
    closeAll,
    unmountAll,
    openAsync,
  };
}

export const overlay = createOverlay(globalOverlayStore);
