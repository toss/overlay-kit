import { useEffect, useLayoutEffect } from 'react';
import { createEmitter } from './emitter';


const emitter = createEmitter();
const useIsomorphicEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function dispatchEvent<Detail>(type: string, detail?: Detail) {
  emitter.emit(type, detail);
}

// event를 생성할 때 params는 어떤 타입이든 올 수 있기 때문에 any로 지정합니다.
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

    useIsomorphicEffect(() => {
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
