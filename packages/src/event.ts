import { type OverlayContextValue, type OverlayControllerComponent } from './context/context';
import { randomId } from './utils';
import { createUseExternalEvents } from './utils/create-use-external-events';

type OverlayEvent = Omit<OverlayContextValue, 'overlayList'>;

type OverlayOpenOptions = {
  overlayId?: string;
};

export const [useOverlayEvent, createEvent] = createUseExternalEvents<OverlayEvent>('overlay-kit');

const open = (controller: OverlayControllerComponent, options?: OverlayOpenOptions) => {
  const overlayId = options?.overlayId ?? randomId();
  const dispatchOpenEvent = createEvent('open');

  dispatchOpenEvent({ controller, overlayId });
  return overlayId;
};
const close = createEvent('close');
const unmount = createEvent('unmount');
const closeAll = createEvent('closeAll');
const unmountAll = createEvent('unmountAll');

export const overlay = { open, close, unmount, closeAll, unmountAll };
