import {
  type OverlayAsyncResult,
  type OverlayAsyncControllerProps,
  type OverlayAsyncControllerComponent,
  type OverlayControllerComponent,
  type OverlayControllerProps,
} from './context/provider/content-overlay-controller';
import { createUseExternalEvents } from './utils';
import { randomId } from './utils/random-id';

export type OverlayEvent = {
  open: (args: {
    controller: OverlayControllerComponent;
    overlayId: string;
    componentKey: string;
    asyncResult?: OverlayAsyncResult;
  }) => void;
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
    return new Promise<T>((resolve, reject) => {
      createEvent('open')({
        controller: (props, ...deprecatedLegacyContext) =>
          controller(props as OverlayControllerProps & OverlayAsyncControllerProps<T>, ...deprecatedLegacyContext),
        overlayId: options?.overlayId ?? randomId(),
        componentKey: randomId(),
        asyncResult: { resolve: (value) => resolve(value as T), reject },
      });
    });
  };

  const close = createEvent('close');
  const unmount = createEvent('unmount');
  const closeAll = createEvent('closeAll');
  const unmountAll = createEvent('unmountAll');

  return { open, openAsync, close, unmount, closeAll, unmountAll, useOverlayEvent };
}
