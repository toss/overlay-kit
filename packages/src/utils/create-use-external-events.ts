import { useLayoutEffect } from 'react';
import { createEmitter } from './emitter';

const emitter = createEmitter();

export function isClientEnvironment() {
  const isBrowser = typeof document !== 'undefined';
  const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';

  return isBrowser || isReactNative;
}

function useClientLayoutEffect(...args: Parameters<typeof useLayoutEffect>) {
  if (!isClientEnvironment()) return;
  useLayoutEffect(...args);
}

function dispatchEvent<Detail>(type: string, detail?: Detail) {
  emitter.emit(type, detail);
}

// When creating an event, params can be of any type, so specify the type as any.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createUseExternalEvents<EventHandlers extends Record<string, (params: any) => void>>(prefix: string) {
  function useExternalEvents(events: EventHandlers) {
    const handlers = Object.entries(events).reduce<Record<string, (event: unknown) => void>>(
      (prev, [eventKey, eventFn]) => {
        const currentEventKeys = `${prefix}:${eventKey}`;

        return {
          ...prev,
          [currentEventKeys]: function (event: unknown) {
            eventFn(event);
          },
        };
      },
      {}
    );

    useClientLayoutEffect(() => {
      Object.entries(handlers).forEach(([eventKey, eventFn]) => {
        emitter.off(eventKey, eventFn);
        emitter.on(eventKey, eventFn);
      });

      return () =>
        Object.entries(handlers).forEach(([eventKey, eventFn]) => {
          emitter.off(eventKey, eventFn);
        });
    }, [handlers]);
  }

  function createEvent<EventKey extends keyof EventHandlers>(event: EventKey) {
    return (...payload: Parameters<EventHandlers[EventKey]>) => dispatchEvent(`${prefix}:${String(event)}`, payload[0]);
  }

  return [useExternalEvents, createEvent] as const;
}
