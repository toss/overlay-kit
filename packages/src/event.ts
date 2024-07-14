import { type OverlayAsyncControllerComponent, type OverlayControllerComponent } from './context/provider';
import { dispatchOverlay } from './context/store';
import { randomId } from './utils';

type OpenOverlayOptions = {
  overlayId?: string;
};

function open(controller: OverlayControllerComponent, options?: OpenOverlayOptions) {
  const overlayId = options?.overlayId ?? randomId();

  dispatchOverlay({
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
  dispatchOverlay({ type: 'CLOSE', overlayId });
}
function unmount(overlayId: string) {
  dispatchOverlay({ type: 'REMOVE', overlayId });
}
function closeAll() {
  dispatchOverlay({ type: 'CLOSE_ALL' });
}
function unmountAll() {
  dispatchOverlay({ type: 'REMOVE_ALL' });
}

export const overlay = { open, close, unmount, closeAll, unmountAll, openAsync };
