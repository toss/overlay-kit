import { renderHook } from '@testing-library/react';
import type React from 'react';
import { describe, expect, it } from 'vitest';
import { createSafeContext } from './create-safe-context';

describe('createSafeContext', () => {
  it('should return Provider and hook', () => {
    const [Provider, useContext] = createSafeContext<string>();
    expect(Provider).toBeDefined();
    expect(useContext).toBeDefined();
  });

  it('should use the provided displayName', () => {
    const testName = 'TestContext';
    const [, useContext] = createSafeContext<string>(testName);

    try {
      renderHook(() => useContext());
    } catch (error) {
      expect((error as Error).message).toContain(`[${testName}]`);
    }
  });

  it('should throw an error when Provider is not found', () => {
    const [, useContext] = createSafeContext<string>('TestContext');

    expect(() => {
      renderHook(() => useContext());
    }).toThrow('[TestContext]: Provider not found.');
  });

  it('should return correct context value when Provider is available', () => {
    const testValue = 'test-value';

    const [Provider, useContext] = createSafeContext<string>();

    const wrapper = ({ children }: { children: React.ReactNode }) => <Provider value={testValue}>{children}</Provider>;

    const { result } = renderHook(() => useContext(), { wrapper });
    expect(result.current).toBe(testValue);
  });
});
