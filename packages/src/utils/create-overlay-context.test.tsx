import { describe, it, expect } from 'vitest';
import { experimental_createOverlayContext } from './create-overlay-context';

describe('experimental_createOverlayContext', () => {
  it('should return an object with overlay, OverlayProvider, useCurrentOverlay, and useOverlayData', () => {
    const context = experimental_createOverlayContext();

    expect(context).toBeTypeOf('object');
    expect(context.overlay).toBeDefined();
    expect(context.overlay).toBeTypeOf('object');

    expect(context.OverlayProvider).toBeDefined();
    expect(context.OverlayProvider).toBeTypeOf('function');

    expect(context.useCurrentOverlay).toBeDefined();
    expect(context.useCurrentOverlay).toBeTypeOf('function');

    expect(context.useOverlayData).toBeDefined();
    expect(context.useOverlayData).toBeTypeOf('function');
  });

  it('should return a new context provider instance each time it is called', () => {
    const context1 = experimental_createOverlayContext();
    const context2 = experimental_createOverlayContext();

    expect(context1).not.toBe(context2);
    expect(context1.overlay).not.toBe(context2.overlay);
    expect(context1.OverlayProvider).not.toBe(context2.OverlayProvider);
    expect(context1.useCurrentOverlay).not.toBe(context2.useCurrentOverlay);
    expect(context1.useOverlayData).not.toBe(context2.useOverlayData);
  });
});
