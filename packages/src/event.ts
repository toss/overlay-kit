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
const exit = createEvent('exit');
const closeAll = createEvent('closeAll');
const exitAll = createEvent('exitAll');
const delayedExit = createEvent('delayedExit');
const delayedExitAll = createEvent('delayedExitAll');

export const overlay = { open, close, exit, closeAll, exitAll, delayedExit, delayedExitAll };
