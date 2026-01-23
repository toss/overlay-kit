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

/**
 * Creates a set of utilities for managing external events in overlay-kit.
 *
 * This factory function returns three utilities:
 * 1. `useExternalEvents` - React Hook for subscribing to events within components
 * 2. `createEvent` - Factory for creating event dispatchers
 * 3. `subscribeEvent` - Function for subscribing to events outside of React components
 *
 * @remarks
 * EventHandlers uses `any` for params because event payloads can be of any type.
 *
 * @param prefix - Namespace prefix to avoid event name collisions (e.g., 'overlay-kit')
 *
 * @example
 * ```typescript
 * const [useOverlayEvent, createEvent, subscribeEvent] = createUseExternalEvents<OverlayEvent>('my-app/overlay');
 *
 * // In React component
 * useOverlayEvent({ open: (payload) => console.log('opened', payload) });
 *
 * // Dispatching events
 * const dispatchOpen = createEvent('open');
 * dispatchOpen({ overlayId: '123' });
 *
 * // Outside React (e.g., in Promise)
 * const unsubscribe = subscribeEvent('close', (id) => console.log('closed', id));
 * // IMPORTANT: Always call unsubscribe when done
 * unsubscribe();
 * ```
 */
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

  /**
   * Subscribes to an event outside of React's lifecycle (e.g., inside a Promise).
   *
   * Unlike `useExternalEvents` which automatically cleans up on unmount,
   * this function requires MANUAL cleanup by calling the returned unsubscribe function.
   *
   * @warning Memory Leak Risk - Always call the returned unsubscribe function when done.
   *
   * @param event - Event type to subscribe to
   * @param handler - Callback function to handle the event
   * @returns Unsubscribe function that MUST be called to prevent memory leaks
   *
   * @example
   * ```typescript
   * // Inside openAsync Promise
   * const unsubscribe = subscribeEvent('close', (overlayId) => {
   *   if (overlayId === currentId) {
   *     resolve(defaultValue);
   *   }
   * });
   *
   * // Cleanup when Promise resolves
   * const cleanup = () => {
   *   unsubscribe();
   * };
   * ```
   */
  function subscribeEvent<EventKey extends keyof EventHandlers>(
    event: EventKey,
    handler: EventHandlers[EventKey]
  ): () => void {
    const eventKey = `${prefix}:${String(event)}`;
    const wrappedHandler = (payload: Parameters<EventHandlers[EventKey]>[0]) => {
      handler(payload);
    };
    emitter.on(eventKey, wrappedHandler);
    return () => {
      emitter.off(eventKey, wrappedHandler);
    };
  }

  return [useExternalEvents, createEvent, subscribeEvent] as const;
}
