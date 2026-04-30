import {
  type OverlayAsyncControllerProps,
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

type OpenAsyncOverlayOptions<T> = OpenOverlayOptions & {
  defaultValue?: T;
};

export function createOverlay(overlayId: string) {
  const [useOverlayEvent, createEvent, subscribeEvent] = createUseExternalEvents<OverlayEvent>(
    `${overlayId}/overlay-kit`
  );

  const open = (controller: OverlayControllerComponent, options?: OpenOverlayOptions) => {
    const overlayId = options?.overlayId ?? randomId();
    const componentKey = randomId();
    const dispatchOpenEvent = createEvent('open');

    dispatchOpenEvent({ controller, overlayId, componentKey });
    return overlayId;
  };

  /**
   * Opens an overlay and returns a Promise that resolves when the overlay is closed.
   *
   * ## External Event Subscription Pattern
   *
   * When `defaultValue` is provided, this function subscribes to external close/unmount events
   * using `subscribeEvent` (outside React's lifecycle). This enables the Promise to resolve
   * even when closed externally via `overlay.close(id)` or `overlay.closeAll()`.
   *
   * ### Why subscribe outside React hooks?
   * - Promise executor runs outside React component lifecycle
   * - Cannot use `useEffect` for cleanup - must manage manually
   * - `subscribeEvent` returns unsubscribe function for manual cleanup
   *
   * ### Memory safety guarantees:
   * 1. `resolved` flag prevents double-resolution
   * 2. `cleanup()` unsubscribes ALL event listeners on resolution
   * 3. Conditional subscription - no listeners if `defaultValue` not provided
   *
   * @param controller - Render function receiving overlay props (isOpen, close, reject)
   * @param options - Optional config: `overlayId` and `defaultValue`
   * @param options.defaultValue - Value to resolve with when closed externally.
   *                               If not provided, Promise stays pending on external close (backward compatible)
   */
  const openAsync = async <T>(controller: OverlayAsyncControllerComponent<T>, options?: OpenAsyncOverlayOptions<T>) => {
    return new Promise<T>((_resolve, _reject) => {
      /**
       * Prevents double-resolution of the Promise.
       * Once resolved/rejected, subsequent calls to resolve() are no-ops.
       */
      let resolved = false;
      const hasDefaultValue = options !== undefined && 'defaultValue' in options;

      /**
       * Unsubscribes all external event listeners.
       * MUST be called when Promise settles to prevent memory leaks.
       */
      const cleanup = () => {
        unsubscribeClose();
        unsubscribeCloseAll();
        unsubscribeUnmount();
        unsubscribeUnmountAll();
      };

      /**
       * Resolves the Promise with given value.
       * Idempotent - only the first call takes effect.
       */
      const resolve = (value: T) => {
        if (resolved) return;
        resolved = true;
        cleanup();
        _resolve(value);
      };

      const currentOverlayId = options?.overlayId ?? randomId();

      /*
       * External Event Subscriptions (only when defaultValue is provided)
       *
       * These subscriptions allow the Promise to resolve when the overlay is closed
       * from outside (e.g., overlay.close(id), overlay.closeAll()).
       *
       * Without defaultValue: subscriptions are no-op functions (backward compatible)
       */
      const unsubscribeClose = hasDefaultValue
        ? subscribeEvent('close', (closedOverlayId: string) => {
            if (closedOverlayId === currentOverlayId) {
              resolve(options!.defaultValue as T);
            }
          })
        : () => {};

      const unsubscribeCloseAll = hasDefaultValue
        ? subscribeEvent('closeAll', () => {
            resolve(options!.defaultValue as T);
          })
        : () => {};

      const unsubscribeUnmount = hasDefaultValue
        ? subscribeEvent('unmount', (unmountedOverlayId: string) => {
            if (unmountedOverlayId === currentOverlayId) {
              resolve(options!.defaultValue as T);
            }
          })
        : () => {};

      const unsubscribeUnmountAll = hasDefaultValue
        ? subscribeEvent('unmountAll', () => {
            resolve(options!.defaultValue as T);
          })
        : () => {};

      open(
        (overlayProps, ...deprecatedLegacyContext) => {
          const close = (param: T) => {
            resolve(param);
            overlayProps.close();
          };

          const reject = (reason?: unknown) => {
            if (resolved) return;
            resolved = true;
            cleanup();
            _reject(reason);
            overlayProps.close();
          };

          const props: OverlayAsyncControllerProps<T> = { ...overlayProps, close, reject };
          return controller(props, ...deprecatedLegacyContext);
        },
        { overlayId: currentOverlayId }
      );
    });
  };

  const close = createEvent('close');
  const unmount = createEvent('unmount');
  const closeAll = createEvent('closeAll');
  const unmountAll = createEvent('unmountAll');

  return { open, openAsync, close, unmount, closeAll, unmountAll, useOverlayEvent };
}
