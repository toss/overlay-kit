import { useLayoutEffect, useRef } from 'react';
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
    const eventsRef = useRef(events);
    eventsRef.current = events;

    useClientLayoutEffect(() => {
      const eventKeys = Object.keys(eventsRef.current).map((eventKey) => `${prefix}:${eventKey}`);

      const stableHandlers = eventKeys.map((key, i) => {
        const handler = (event: unknown) => {
          const eventFn = Object.values(eventsRef.current)[i];
          eventFn(event);
        };
        emitter.on(key, handler);
        return [key, handler] as const;
      });

      return () => {
        stableHandlers.forEach(([key, handler]) => {
          emitter.off(key, handler);
        });
      };
    }, []);
  }

  function createEvent<EventKey extends keyof EventHandlers>(event: EventKey) {
    return (...payload: Parameters<EventHandlers[EventKey]>) => dispatchEvent(`${prefix}:${String(event)}`, payload[0]);
  }

  return [useExternalEvents, createEvent] as const;
}
