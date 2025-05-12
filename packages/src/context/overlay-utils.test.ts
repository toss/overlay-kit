import { describe, expect, it } from 'vitest';
import { determineCurrentOverlayId } from './overlay-utils';

describe('determineCurrentOverlayId', () => {
  it('should return the previous overlay when closing the last overlay', () => {
    const overlayOrderList = ['id1', 'id2', 'id3'];
    const overlayData = {
      id1: { id: 'id1', componentKey: 'key1', isOpen: true, controller: () => null },
      id2: { id: 'id2', componentKey: 'key2', isOpen: true, controller: () => null },
      id3: { id: 'id3', componentKey: 'key3', isOpen: true, controller: () => null },
    };

    const result = determineCurrentOverlayId(overlayOrderList, overlayData, 'id3');

    expect(result).toBe('id2');
  });

  it('should return the last overlay when closing an intermediate overlay', () => {
    const overlayOrderList = ['id1', 'id2', 'id3'];
    const overlayData = {
      id1: { id: 'id1', componentKey: 'key1', isOpen: true, controller: () => null },
      id2: { id: 'id2', componentKey: 'key2', isOpen: true, controller: () => null },
      id3: { id: 'id3', componentKey: 'key3', isOpen: true, controller: () => null },
    };

    const result = determineCurrentOverlayId(overlayOrderList, overlayData, 'id2');

    expect(result).toBe('id3');
  });

  it('should skip closed overlays when determining the current overlay', () => {
    const overlayOrderList = ['id1', 'id2', 'id3'];
    const overlayData = {
      id1: { id: 'id1', componentKey: 'key1', isOpen: true, controller: () => null },
      id2: { id: 'id2', componentKey: 'key2', isOpen: false, controller: () => null },
      id3: { id: 'id3', componentKey: 'key3', isOpen: true, controller: () => null },
    };

    const result = determineCurrentOverlayId(overlayOrderList, overlayData, 'id3');

    expect(result).toBe('id1');
  });

  it('should return null when closing the only open overlay', () => {
    const overlayOrderList = ['id1'];
    const overlayData = {
      id1: { id: 'id1', componentKey: 'key1', isOpen: true, controller: () => null },
    };

    const result = determineCurrentOverlayId(overlayOrderList, overlayData, 'id1');

    expect(result).toBe(null);
  });
});
