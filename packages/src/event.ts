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
  onDismiss?: T;
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

  const openAsync = async <T>(controller: OverlayAsyncControllerComponent<T>, options?: OpenAsyncOverlayOptions<T>) => {
    return new Promise<T>((_resolve, _reject) => {
      let resolved = false;

      const resolve = (value: T) => {
        if (resolved) return;
        resolved = true;
        unsubscribeClose();
        unsubscribeCloseAll();
        _resolve(value);
      };

      const currentOverlayId = options?.overlayId ?? randomId();

      const unsubscribeClose = subscribeEvent('close', (closedOverlayId: string) => {
        if (closedOverlayId === currentOverlayId && 'onDismiss' in (options ?? {})) {
          resolve(options!.onDismiss as T);
        }
      });

      const unsubscribeCloseAll = subscribeEvent('closeAll', () => {
        if ('onDismiss' in (options ?? {})) {
          resolve(options!.onDismiss as T);
        }
      });

      open(
        (overlayProps, ...deprecatedLegacyContext) => {
          const close = (param: T) => {
            resolve(param);
            overlayProps.close();
          };

          const reject = (reason?: unknown) => {
            if (resolved) return;
            resolved = true;
            unsubscribeClose();
            unsubscribeCloseAll();
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
