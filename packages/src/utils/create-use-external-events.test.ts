import { renderHook } from '@testing-library/react';
import { describe, expect, it, vitest } from 'vitest';
import { createUseExternalEvents } from './create-use-external-events';

describe('createUseExternalEvents는', () => {
  it('should be able to generate events.', () => {
    type TestEvent = {
      event: () => void;
    };

    const [useEvent, createEvent] = createUseExternalEvents<TestEvent>('eventPrefix');
    const mockedEvent = vitest.fn();

    renderHook(() => {
      useEvent({ event: mockedEvent });
    });

    const emitEvent = createEvent('event');
    emitEvent();

    expect(mockedEvent).toBeCalledTimes(1);
  });
});
