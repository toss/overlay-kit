import {
  type OverlayAsyncControllerComponent,
  type OverlayControllerComponent,
} from './context/provider/content-overlay-controller';
import { createUseExternalEvents } from './utils';
import { randomId } from './utils/random-id';

export type OverlayEvent = {
  open: (args: { controller: OverlayControllerComponent; overlayId: string; componentKey: string }) => void;
  close: (overlayId: string) => void;
  unmount: (overlayId: string) => void;
  closeAll: () => void;
  unmountAll: () => void;
};

type OpenOverlayOptions = {
  overlayId?: string;
};

type OverlayAction = 'open' | 'close' | 'unmount';
type StateChangeCallback = (overlayId: string, action: OverlayAction) => void;

export function createOverlay(contextId: string = 'overlay-kit') {
  const [useOverlayEvent, createEvent] = createUseExternalEvents<OverlayEvent>(`${contextId}`);

  const stateChangeCallbacks = new Set<StateChangeCallback>();

  function onStateChange(callback: StateChangeCallback): () => void {
    stateChangeCallbacks.add(callback);
    return () => {
      stateChangeCallbacks.delete(callback);
    };
  }

  function emitStateChange(overlayId: string, action: OverlayAction): void {
    if (stateChangeCallbacks.size === 0) return;

    for (const callback of stateChangeCallbacks) {
      try {
        callback(overlayId, action);
      } catch (error) {
        console.error('Error in overlay state change callback:', error);
      }
    }
  }

  const open = (controller: OverlayControllerComponent, options?: OpenOverlayOptions) => {
    const overlayId = options?.overlayId ?? randomId();
    const componentKey = randomId();
    const dispatchOpenEvent = createEvent('open');

    dispatchOpenEvent({ controller, overlayId, componentKey });

    requestAnimationFrame(() => {
      emitStateChange(overlayId, 'open');
    });

    return overlayId;
  };

  const openAsync = async <T>(controller: OverlayAsyncControllerComponent<T>, options?: OpenOverlayOptions) => {
    return new Promise<T>((resolve) => {
      open((overlayProps, ...deprecatedLegacyContext) => {
        /**
         * @description close the overlay with resolve
         */
        const close = (param: T) => {
          resolve(param);
          overlayProps.close();

          requestAnimationFrame(() => {
            emitStateChange(overlayProps.overlayId, 'close');
          });
        };

        /**
         * @description Passing overridden methods
         */
        const props = { ...overlayProps, close };
        return controller(props, ...deprecatedLegacyContext);
      }, options);
    });
  };

  const close = createEvent('close');
  const unmount = createEvent('unmount');
  const closeAll = createEvent('closeAll');
  const unmountAll = createEvent('unmountAll');

  const closeWithEvent = (overlayId: string) => {
    close(overlayId);
    requestAnimationFrame(() => {
      emitStateChange(overlayId, 'close');
    });
  };

  const unmountWithEvent = (overlayId: string) => {
    emitStateChange(overlayId, 'unmount');
    unmount(overlayId);
  };

  const closeAllWithEvent = () => {
    closeAll();
  };

  const unmountAllWithEvent = () => {
    unmountAll();
  };

  return {
    open,
    openAsync,
    close: closeWithEvent,
    unmount: unmountWithEvent,
    closeAll: closeAllWithEvent,
    unmountAll: unmountAllWithEvent,
    useOverlayEvent,
    onStateChange,
  };
}
