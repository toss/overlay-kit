import { type OverlayContextValue } from './context/context';
import { createUseExternalEvents } from './utils/create-use-external-events';

type OverlayEvent = Omit<OverlayContextValue, 'overlayList'>;

export const [useOverlayEvent, createEvent] = createUseExternalEvents<OverlayEvent>('es-overlay');

const open = createEvent('open');
const close = createEvent('close');
const exit = createEvent('exit');
const closeAll = createEvent('closeAll');
const exitAll = createEvent('exitAll');
const delayedExit = createEvent('delayedExit');

export const overlays = { open, close, exit, closeAll, exitAll, delayedExit };
