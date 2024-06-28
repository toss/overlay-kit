import { renderHook } from '@testing-library/react';
import { describe, expect, it, vitest } from 'vitest';
import { createUseExternalEvents } from './create-use-external-events';

describe('createUseExternalEvents는', () => {
  it('이벤트를 생성할 수 있어야 합니다.', () => {
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
