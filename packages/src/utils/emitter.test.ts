import { describe, expect, it, beforeEach, vi } from 'vitest';
import { createEmitter, type Emitter } from './emitter';

describe('createEmitter', () => {
  type Events = {
    foo: string;
    bar: number;
    baz: { data: boolean };
  };

  let emitter: Emitter<Events>;

  beforeEach(() => {
    emitter = createEmitter<Events>();
  });

  it('should register and emit events to a specific handler', () => {
    const handler = vi.fn();
    emitter.on('foo', handler);
    emitter.emit('foo', 'test');
    expect(handler).toHaveBeenCalledWith('test');
  });

  it('should allow registering multiple handlers for the same event', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    emitter.on('bar', handler1);
    emitter.on('bar', handler2);
    emitter.emit('bar', 123);
    expect(handler1).toHaveBeenCalledWith(123);
    expect(handler2).toHaveBeenCalledWith(123);
  });

  describe('off method', () => {
    it('should unregister a specific handler', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      emitter.on('foo', handler1);
      emitter.on('foo', handler2);
      emitter.off('foo', handler1);
      emitter.emit('foo', 'test');
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledWith('test');
    });

    it('should do nothing if trying to unregister a non-existent handler', () => {
      const handler1 = vi.fn();
      const nonExistentHandler = vi.fn();
      emitter.on('foo', handler1);

      emitter.off('foo', nonExistentHandler);
      emitter.emit('foo', 'test');
      expect(handler1).toHaveBeenCalledWith('test');
    });

    it('should unregister all handlers for an event type if no specific handler is provided', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      emitter.on('foo', handler1);
      emitter.on('foo', handler2);
      emitter.off('foo');
      emitter.emit('foo', 'test');
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
      expect(emitter.all.get('foo')).toEqual([]);
    });

    it('should do nothing if trying to unregister handlers for an event type with no handlers', () => {
      emitter.off('baz');
      expect(emitter.all.get('baz')).toBeUndefined();
    });
  });

  describe('emit method with wildcard handlers', () => {
    it('should emit events to wildcard handlers', () => {
      const specificHandler = vi.fn();
      const wildcardHandler = vi.fn();
      emitter.on('foo', specificHandler);
      emitter.on('*', wildcardHandler);
      emitter.emit('foo', 'test data');

      expect(specificHandler).toHaveBeenCalledWith('test data');
      expect(wildcardHandler).toHaveBeenCalledWith('foo', 'test data');
    });

    it('should emit events to multiple wildcard handlers', () => {
      const wildcardHandler1 = vi.fn();
      const wildcardHandler2 = vi.fn();
      emitter.on('*', wildcardHandler1);
      emitter.on('*', wildcardHandler2);
      emitter.emit('bar', 123);
      expect(wildcardHandler1).toHaveBeenCalledWith('bar', 123);
      expect(wildcardHandler2).toHaveBeenCalledWith('bar', 123);
    });

    it('should not fail if no wildcard handlers are registered', () => {
      const specificHandler = vi.fn();
      emitter.on('foo', specificHandler);
      emitter.emit('foo', 'test');
      expect(specificHandler).toHaveBeenCalledWith('test');
    });

    it('should call specific handlers even if wildcard handlers exist', () => {
      const specificHandlerBaz = vi.fn();
      const wildcardHandler = vi.fn();
      emitter.on('baz', specificHandlerBaz);
      emitter.on('*', wildcardHandler);
      const eventData = { data: true };
      emitter.emit('baz', eventData);
      expect(specificHandlerBaz).toHaveBeenCalledWith(eventData);
      expect(wildcardHandler).toHaveBeenCalledWith('baz', eventData);
    });

    it('should handle emitting events when no specific handlers are registered but wildcard handlers are', () => {
      const wildcardHandler = vi.fn();
      emitter.on('*', wildcardHandler);
      emitter.emit('foo', 'hello');
      expect(wildcardHandler).toHaveBeenCalledWith('foo', 'hello');
    });
  });

  it('should handle emitting events with no handlers registered for that type', () => {
    expect(() => {
      emitter.emit('baz', { data: false });
    }).not.toThrow();
  });

  it('should correctly use initial event map if provided', () => {
    const initialHandler = vi.fn();
    const initialWildcardHandler = vi.fn();
    const initialMap = new Map([
      ['foo', [initialHandler]],
      ['*', [initialWildcardHandler]],
    ]);
    const customEmitter = createEmitter<Events>(initialMap as Emitter<Events>['all']);
    customEmitter.emit('foo', 'initial');
    expect(initialHandler).toHaveBeenCalledWith('initial');
    expect(initialWildcardHandler).toHaveBeenCalledWith('foo', 'initial');

    const newHandler = vi.fn();
    customEmitter.on('bar', newHandler);
    customEmitter.emit('bar', 99);
    expect(newHandler).toHaveBeenCalledWith(99);
    expect(initialWildcardHandler).toHaveBeenCalledWith('bar', 99);
  });

  it('should emit events correctly when handler is removed during emit cycle (due to slice)', () => {
    const handler1 = vi.fn(() => {
      emitter.off('foo', handler2);
    });
    const handler2 = vi.fn();
    const handler3 = vi.fn();

    emitter.on('foo', handler1);
    emitter.on('foo', handler2);
    emitter.on('foo', handler3);

    emitter.emit('foo', 'cycle test');

    expect(handler1).toHaveBeenCalledWith('cycle test');
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledWith('cycle test');
    expect(handler2).toHaveBeenCalledTimes(1);
    expect(handler3).toHaveBeenCalledWith('cycle test');
    expect(handler3).toHaveBeenCalledTimes(1);

    emitter.emit('foo', 'after cycle');
    expect(handler1).toHaveBeenCalledWith('after cycle');
    expect(handler1).toHaveBeenCalledTimes(2);
    expect(handler2).toHaveBeenCalledTimes(1);
    expect(handler3).toHaveBeenCalledWith('after cycle');
    expect(handler3).toHaveBeenCalledTimes(2);
  });

  it('should emit wildcard events correctly when handler is removed during emit cycle', () => {
    const wildcardHandler1 = vi.fn(() => {
      emitter.off('*', wildcardHandler2);
    });
    const wildcardHandler2 = vi.fn();

    emitter.on('*', wildcardHandler1);
    emitter.on('*', wildcardHandler2);

    emitter.emit('foo', 'wild cycle');

    expect(wildcardHandler1).toHaveBeenCalledWith('foo', 'wild cycle');
    expect(wildcardHandler1).toHaveBeenCalledTimes(1);
    expect(wildcardHandler2).toHaveBeenCalledWith('foo', 'wild cycle');
    expect(wildcardHandler2).toHaveBeenCalledTimes(1);

    emitter.emit('bar', 123);
    expect(wildcardHandler1).toHaveBeenCalledWith('bar', 123);
    expect(wildcardHandler1).toHaveBeenCalledTimes(2);
    expect(wildcardHandler2).toHaveBeenCalledTimes(1);
  });
});
