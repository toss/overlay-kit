import { type OverlayContextValue } from './context/context';
import { createUseExternalEvents } from './utils/create-use-external-events';

type OverlayEvent = Omit<OverlayContextValue, 'overlayList'>;

export const [useOverlayEvent, createEvent] = createUseExternalEvents<OverlayEvent>('overlay-kit');

const open = createEvent('open');
const close = createEvent('close');
const exit = createEvent('exit');
const closeAll = createEvent('closeAll');
const exitAll = createEvent('exitAll');
const delayedExit = createEvent('delayedExit');
const delayedExitAll = createEvent('delayedExitAll');

export const overlay = { open, close, exit, closeAll, exitAll, delayedExit, delayedExitAll };
