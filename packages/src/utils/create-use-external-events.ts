import { useLayoutEffect } from 'react';
import { createEmitter } from './emitter';

const emitter = createEmitter();
function useClientLayoutEffect(...args: Parameters<typeof useLayoutEffect>) {
  typeof document !== 'undefined' ? useLayoutEffect(...args) : () => {};
}

function dispatchEvent<Detail>(type: string, detail?: Detail) {
  emitter.emit(type, detail);
}

// When creating an event, params can be of any type, so specify the type as any.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createUseExternalEvents<EventHandlers extends Record<string, (params: any) => void>>(prefix: string) {
  function useExternalEvents(events: EventHandlers) {
    const handlers = Object.keys(events).reduce<Record<string, () => void>>((prev, eventKey) => {
      const currentEventKeys = `${prefix}:${eventKey}`;

      return {
        ...prev,
        [currentEventKeys]: function (event: unknown) {
          events[eventKey](event);
        } as () => void,
      };
    }, {});

    useClientLayoutEffect(() => {
      Object.keys(handlers).forEach((eventKey) => {
        emitter.off(eventKey, handlers[eventKey]);
        emitter.on(eventKey, handlers[eventKey]);
      });

      return () =>
        Object.keys(handlers).forEach((eventKey) => {
          emitter.off(eventKey, handlers[eventKey]);
        });
    }, [handlers]);
  }

  function createEvent<EventKey extends keyof EventHandlers>(event: EventKey) {
    return (...payload: Parameters<EventHandlers[EventKey]>) => dispatchEvent(`${prefix}:${String(event)}`, payload[0]);
  }

  return [useExternalEvents, createEvent] as const;
}
