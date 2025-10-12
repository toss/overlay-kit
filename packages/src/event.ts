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

export function createOverlay(overlayId: string) {
  const [useOverlayEvent, createEvent] = createUseExternalEvents<OverlayEvent>(`${overlayId}/overlay-kit`);

  const open = (controller: OverlayControllerComponent, options?: OpenOverlayOptions) => {
    const overlayId = options?.overlayId ?? randomId();
    const componentKey = randomId();
    const dispatchOpenEvent = createEvent('open');

    dispatchOpenEvent({ controller, overlayId, componentKey });
    return overlayId;
  };

  const openAsync = async <T>(controller: OverlayAsyncControllerComponent<T>, options?: OpenOverlayOptions) => {
    return new Promise<T>((_resolve, _reject) => {
      open((overlayProps, ...deprecatedLegacyContext) => {
        /**
         * @description close the overlay with resolve
         */
        const close = (param: T) => {
          _resolve(param);
          overlayProps.close();
        };

        /**
         * @description close the overlay with reject
         */
        const reject = (reason?: unknown) => {
          _reject(reason);
          overlayProps.close();
        };

        /**
         * @description Passing overridden methods
         */
        const props: OverlayAsyncControllerProps<T> = { ...overlayProps, close, reject };
        return controller(props, ...deprecatedLegacyContext);
      }, options);
    });
  };

  const close = createEvent('close');
  const unmount = createEvent('unmount');
  const closeAll = createEvent('closeAll');
  const unmountAll = createEvent('unmountAll');

  return { open, openAsync, close, unmount, closeAll, unmountAll, useOverlayEvent };
}
