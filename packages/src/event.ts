import { OverlayControllerComponent, type OverlayContextValue } from './context/context';
import { randomId } from './utils';
import { createUseExternalEvents } from './utils/create-use-external-events';

type OverlayEvent = Omit<OverlayContextValue, 'overlayList'>;

export const [useOverlayEvent, createEvent] = createUseExternalEvents<OverlayEvent>('overlay-kit');

const open = (controller: OverlayControllerComponent) => {
  const overlayId = randomId();
  const dispatchOpenEvent = createEvent('open');

  dispatchOpenEvent({ controller, overlayId });
  return overlayId;
};
const close = createEvent('close');
const unmount = createEvent('unmount');
const closeAll = createEvent('closeAll');
const unmountAll = createEvent('unmountAll');
const delayedUnmount = createEvent('delayedUnmount');
const delayedUnmountAll = createEvent('delayedUnmountAll');

export const overlay = { open, close, unmount, closeAll, unmountAll, delayedUnmount, delayedUnmountAll };
