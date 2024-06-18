import { useEffect, useLayoutEffect } from 'react';

const useIsomorphicEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function dispatchEvent<Detail>(type: string, detail?: Detail) {
  window.dispatchEvent(new CustomEvent(type, { detail }));
}

// event를 생성할 때 params는 어떤 타입이든 올 수 있기 때문에 any로 지정합니다.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createUseExternalEvents<EventHandlers extends Record<string, (params: any) => void>>(prefix: string) {
  function useExternalEvents(events: EventHandlers) {
    const handlers = Object.keys(events).reduce<Record<string, EventListener>>((prev, eventKey) => {
      const currentEventKeys = `${prefix}:${eventKey}`;

      return {
        ...prev,
        [currentEventKeys]: function (event: CustomEvent) {
          events[eventKey](event.detail);
        } as EventListener,
      };
    }, {});

    useIsomorphicEffect(() => {
      Object.keys(handlers).forEach((eventKey) => {
        window.removeEventListener(eventKey, handlers[eventKey]);
        window.addEventListener(eventKey, handlers[eventKey]);
      });

      return () =>
        Object.keys(handlers).forEach((eventKey) => {
          window.removeEventListener(eventKey, handlers[eventKey]);
        });
    }, [handlers]);
  }

  function createEvent<EventKey extends keyof EventHandlers>(event: EventKey) {
    type Parameter = Parameters<EventHandlers[EventKey]>[0];

    /**
     * @description `undefined`타입을 갖고 있다면 optional하게 타입을 변경하는 Hacky한 코드
     */
    return (...payload: Parameter extends undefined ? [undefined?] : [Parameter]) =>
      dispatchEvent(`${prefix}:${String(event)}`, payload[0]);
  }

  return [useExternalEvents, createEvent] as const;
}
