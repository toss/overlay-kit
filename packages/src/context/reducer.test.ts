import { describe, expect, it } from 'vitest';
import type { OverlayControllerComponent } from './provider/content-overlay-controller';
import { determineCurrentOverlayId, overlayReducer, type OverlayData } from './reducer';

describe('overlayReducer', () => {
  const initialState: OverlayData = {
    current: null,
    overlayOrderList: [],
    overlayData: {},
  };

  const mockController = (() => {}) as unknown as OverlayControllerComponent;

  describe('ADD action', () => {
    it('should add a new overlay', () => {
      const overlay = {
        id: 'test-id',
        componentKey: 'test-key',
        isOpen: true,
        isMounted: false,
        controller: mockController,
      };

      const result = overlayReducer(initialState, { type: 'ADD', overlay });

      expect(result).toEqual({
        current: 'test-id',
        overlayOrderList: ['test-id'],
        overlayData: {
          'test-id': overlay,
        },
      });
    });

    it('should throw an error when trying to add an overlay with the same id that is already open', () => {
      const existingOverlay = {
        id: 'test-id',
        componentKey: 'test-key',
        isOpen: true,
        isMounted: false,
        controller: mockController,
      };

      const stateWithOpenOverlay: OverlayData = {
        current: 'test-id',
        overlayOrderList: ['test-id'],
        overlayData: {
          'test-id': existingOverlay,
        },
      };

      expect(() => {
        overlayReducer(stateWithOpenOverlay, { type: 'ADD', overlay: existingOverlay });
      }).toThrow("You can't open the multiple overlays with the same overlayId");
    });

    it('should reorder overlay when an existing but closed overlay is added again', () => {
      const existingOverlay = {
        id: 'test-id',
        componentKey: 'test-key',
        isOpen: false,
        isMounted: false,
        controller: mockController,
      };

      const stateWithClosedOverlay: OverlayData = {
        current: null,
        overlayOrderList: ['test-id'],
        overlayData: {
          'test-id': existingOverlay,
        },
      };

      const result = overlayReducer(stateWithClosedOverlay, {
        type: 'ADD',
        overlay: { ...existingOverlay, isOpen: true },
      });

      expect(result.current).toBe('test-id');
      expect(result.overlayOrderList).toEqual(['test-id']);
      expect(result.overlayData).toEqual({
        'test-id': { ...existingOverlay, isOpen: true },
      });
    });
  });

  describe('OPEN action', () => {
    it('should open an existing closed overlay', () => {
      const stateWithClosedOverlay: OverlayData = {
        current: null,
        overlayOrderList: ['test-id'],
        overlayData: {
          'test-id': {
            id: 'test-id',
            componentKey: 'test-key',
            isOpen: false,
            isMounted: false,
            controller: mockController,
          },
        },
      };

      const result = overlayReducer(stateWithClosedOverlay, { type: 'OPEN', overlayId: 'test-id' });

      expect(result.overlayData['test-id'].isOpen).toBe(true);
    });

    it('should return the same state when trying to open a non-existent overlay', () => {
      const result = overlayReducer(initialState, { type: 'OPEN', overlayId: 'non-existent-id' });
      expect(result).toBe(initialState);
    });

    it('should return the same state when trying to open an already open overlay', () => {
      const stateWithOpenOverlay: OverlayData = {
        current: 'test-id',
        overlayOrderList: ['test-id'],
        overlayData: {
          'test-id': {
            id: 'test-id',
            componentKey: 'test-key',
            isOpen: true,
            isMounted: false,
            controller: mockController,
          },
        },
      };

      const result = overlayReducer(stateWithOpenOverlay, { type: 'OPEN', overlayId: 'test-id' });
      expect(result).toBe(stateWithOpenOverlay);
    });
  });

  describe('CLOSE action', () => {
    it('should cover both branches of currentOverlayId assignment in CLOSE', () => {
      const threeOverlaysState: OverlayData = {
        current: 'test-id-3',
        overlayOrderList: ['test-id-1', 'test-id-2', 'test-id-3'],
        overlayData: {
          'test-id-1': {
            id: 'test-id-1',
            componentKey: 'test-key-1',
            isOpen: true,
            isMounted: false,
            controller: mockController,
          },
          'test-id-2': {
            id: 'test-id-2',
            componentKey: 'test-key-2',
            isOpen: true,
            isMounted: false,
            controller: mockController,
          },
          'test-id-3': {
            id: 'test-id-3',
            componentKey: 'test-key-3',
            isOpen: true,
            isMounted: false,
            controller: mockController,
          },
        },
      };

      const result1 = overlayReducer(threeOverlaysState, { type: 'CLOSE', overlayId: 'test-id-3' });
      expect(result1.current).toBe('test-id-2');
      expect(result1.overlayData['test-id-3'].isOpen).toBe(false);

      const result2 = overlayReducer(threeOverlaysState, { type: 'CLOSE', overlayId: 'test-id-2' });
      expect(result2.current).toBe('test-id-3');
      expect(result2.overlayData['test-id-2'].isOpen).toBe(false);

      const allClosedState: OverlayData = {
        current: null,
        overlayOrderList: ['test-id-1', 'test-id-2'],
        overlayData: {
          'test-id-1': {
            id: 'test-id-1',
            componentKey: 'test-key-1',
            isOpen: false,
            isMounted: false,
            controller: mockController,
          },
          'test-id-2': {
            id: 'test-id-2',
            componentKey: 'test-key-2',
            isOpen: false,
            isMounted: false,
            controller: mockController,
          },
        },
      };
      const result3 = overlayReducer(allClosedState, { type: 'CLOSE', overlayId: 'test-id-1' });
      expect(result3).toBe(allClosedState);
    });

    it('should close an open overlay', () => {
      const stateWithOpenOverlay: OverlayData = {
        current: 'test-id',
        overlayOrderList: ['test-id'],
        overlayData: {
          'test-id': {
            id: 'test-id',
            componentKey: 'test-key',
            isOpen: true,
            isMounted: false,
            controller: mockController,
          },
        },
      };

      const result = overlayReducer(stateWithOpenOverlay, { type: 'CLOSE', overlayId: 'test-id' });

      expect(result.overlayData['test-id'].isOpen).toBe(false);
      expect(result.current).toBe(null);
    });

    it('should return the same state when trying to close a non-existent overlay', () => {
      const result = overlayReducer(initialState, { type: 'CLOSE', overlayId: 'non-existent-id' });
      expect(result).toBe(initialState);
    });

    it('should return the same state when trying to close an already closed overlay', () => {
      const stateWithClosedOverlay: OverlayData = {
        current: null,
        overlayOrderList: ['test-id'],
        overlayData: {
          'test-id': {
            id: 'test-id',
            componentKey: 'test-key',
            isOpen: false,
            isMounted: false,
            controller: mockController,
          },
        },
      };

      const result = overlayReducer(stateWithClosedOverlay, { type: 'CLOSE', overlayId: 'test-id' });
      expect(result).toBe(stateWithClosedOverlay);
    });
  });

  describe('REMOVE action', () => {
    it('should cover both branches of currentOverlayId assignment in REMOVE', () => {
      const threeOverlaysState: OverlayData = {
        current: 'test-id-3',
        overlayOrderList: ['test-id-1', 'test-id-2', 'test-id-3'],
        overlayData: {
          'test-id-1': {
            id: 'test-id-1',
            componentKey: 'test-key-1',
            isOpen: true,
            isMounted: false,
            controller: mockController,
          },
          'test-id-2': {
            id: 'test-id-2',
            componentKey: 'test-key-2',
            isOpen: true,
            isMounted: false,
            controller: mockController,
          },
          'test-id-3': {
            id: 'test-id-3',
            componentKey: 'test-key-3',
            isOpen: true,
            isMounted: false,
            controller: mockController,
          },
        },
      };

      const result1 = overlayReducer(threeOverlaysState, { type: 'REMOVE', overlayId: 'test-id-3' });
      expect(result1.current).toBe('test-id-2');
      expect(Object.keys(result1.overlayData)).not.toContain('test-id-3');

      const result2 = overlayReducer(threeOverlaysState, { type: 'REMOVE', overlayId: 'test-id-2' });
      expect(result2.current).toBe('test-id-3');
      expect(Object.keys(result2.overlayData)).not.toContain('test-id-2');

      const mixedState: OverlayData = {
        current: 'test-id-3',
        overlayOrderList: ['test-id-1', 'test-id-2', 'test-id-3'],
        overlayData: {
          'test-id-1': {
            id: 'test-id-1',
            componentKey: 'test-key-1',
            isOpen: true,
            isMounted: false,
            controller: mockController,
          },
          'test-id-2': {
            id: 'test-id-2',
            componentKey: 'test-key-2',
            isOpen: false,
            isMounted: false,
            controller: mockController,
          },
          'test-id-3': {
            id: 'test-id-3',
            componentKey: 'test-key-3',
            isOpen: true,
            isMounted: false,
            controller: mockController,
          },
        },
      };
      const result3 = overlayReducer(mixedState, { type: 'REMOVE', overlayId: 'test-id-2' });
      expect(result3.current).toBe('test-id-3');
      expect(Object.keys(result3.overlayData)).not.toContain('test-id-2');
    });

    it('should remove an overlay', () => {
      const stateWithOverlay: OverlayData = {
        current: 'test-id',
        overlayOrderList: ['test-id'],
        overlayData: {
          'test-id': {
            id: 'test-id',
            componentKey: 'test-key',
            isOpen: true,
            isMounted: false,
            controller: mockController,
          },
        },
      };

      const result = overlayReducer(stateWithOverlay, { type: 'REMOVE', overlayId: 'test-id' });

      expect(result.overlayOrderList).toEqual([]);
      expect(result.overlayData).toEqual({});
      expect(result.current).toBe(null);
    });

    it('should return the same state when trying to remove a non-existent overlay', () => {
      const result = overlayReducer(initialState, { type: 'REMOVE', overlayId: 'non-existent-id' });
      expect(result).toBe(initialState);
    });

    it('should return the same state when overlayId is not in overlayOrderList', () => {
      const inconsistentState: OverlayData = {
        current: null,
        overlayOrderList: [],
        overlayData: {
          'test-id': {
            id: 'test-id',
            componentKey: 'test-key',
            isOpen: false,
            isMounted: false,
            controller: mockController,
          },
        },
      };

      const result = overlayReducer(inconsistentState, { type: 'REMOVE', overlayId: 'test-id' });
      expect(result).toBe(inconsistentState);
    });
  });

  describe('CLOSE_ALL action', () => {
    it('should close all overlays', () => {
      const stateWithMultipleOverlays: OverlayData = {
        current: 'test-id-2',
        overlayOrderList: ['test-id-1', 'test-id-2'],
        overlayData: {
          'test-id-1': {
            id: 'test-id-1',
            componentKey: 'test-key-1',
            isOpen: true,
            isMounted: false,
            controller: mockController,
          },
          'test-id-2': {
            id: 'test-id-2',
            componentKey: 'test-key-2',
            isOpen: true,
            isMounted: false,
            controller: mockController,
          },
        },
      };

      const result = overlayReducer(stateWithMultipleOverlays, { type: 'CLOSE_ALL' });

      expect(result.current).toBe(null);
      expect(result.overlayData['test-id-1'].isOpen).toBe(false);
      expect(result.overlayData['test-id-2'].isOpen).toBe(false);
    });

    it('should return the same state when there are no overlays to close', () => {
      const result = overlayReducer(initialState, { type: 'CLOSE_ALL' });
      expect(result).toBe(initialState);
    });
  });

  describe('REMOVE_ALL action', () => {
    it('should remove all overlays', () => {
      const stateWithMultipleOverlays: OverlayData = {
        current: 'test-id-2',
        overlayOrderList: ['test-id-1', 'test-id-2'],
        overlayData: {
          'test-id-1': {
            id: 'test-id-1',
            componentKey: 'test-key-1',
            isOpen: true,
            isMounted: false,
            controller: mockController,
          },
          'test-id-2': {
            id: 'test-id-2',
            componentKey: 'test-key-2',
            isOpen: true,
            isMounted: false,
            controller: mockController,
          },
        },
      };

      const result = overlayReducer(stateWithMultipleOverlays, { type: 'REMOVE_ALL' });

      expect(result).toEqual({
        current: null,
        overlayOrderList: [],
        overlayData: {},
      });
    });
  });
});

describe('determineCurrentOverlayId', () => {
  it('should return the previous overlay when closing the last overlay', () => {
    const overlayOrderList = ['id1', 'id2', 'id3'];
    const overlayData = {
      id1: { id: 'id1', componentKey: 'key1', isOpen: true, isMounted: false, controller: () => null },
      id2: { id: 'id2', componentKey: 'key2', isOpen: true, isMounted: false, controller: () => null },
      id3: { id: 'id3', componentKey: 'key3', isOpen: true, isMounted: false, controller: () => null },
    };

    const result = determineCurrentOverlayId(overlayOrderList, overlayData, 'id3');

    expect(result).toBe('id2');
  });

  it('should return the last overlay when closing an intermediate overlay', () => {
    const overlayOrderList = ['id1', 'id2', 'id3'];
    const overlayData = {
      id1: { id: 'id1', componentKey: 'key1', isOpen: true, isMounted: false, controller: () => null },
      id2: { id: 'id2', componentKey: 'key2', isOpen: true, isMounted: false, controller: () => null },
      id3: { id: 'id3', componentKey: 'key3', isOpen: true, isMounted: false, controller: () => null },
    };

    const result = determineCurrentOverlayId(overlayOrderList, overlayData, 'id2');

    expect(result).toBe('id3');
  });

  it('should skip closed overlays when determining the current overlay', () => {
    const overlayOrderList = ['id1', 'id2', 'id3'];
    const overlayData = {
      id1: { id: 'id1', componentKey: 'key1', isOpen: true, isMounted: false, controller: () => null },
      id2: { id: 'id2', componentKey: 'key2', isOpen: false, isMounted: false, controller: () => null },
      id3: { id: 'id3', componentKey: 'key3', isOpen: true, isMounted: false, controller: () => null },
    };

    const result = determineCurrentOverlayId(overlayOrderList, overlayData, 'id3');

    expect(result).toBe('id1');
  });

  it('should return null when closing the only open overlay', () => {
    const overlayOrderList = ['id1'];
    const overlayData = {
      id1: { id: 'id1', componentKey: 'key1', isOpen: true, isMounted: false, controller: () => null },
    };

    const result = determineCurrentOverlayId(overlayOrderList, overlayData, 'id1');

    expect(result).toBe(null);
  });
});
