// Updated type definition using Map
export type OverlayData = {
  current: OverlayId | null;
  overlayOrderList: OverlayId[];
  overlayData: Map<OverlayId, OverlayItem>;
};

// Create a helper type for the external API return type
export type ReadonlyOverlayData = {
  current: OverlayId | null;
  overlayOrderList: OverlayId[];
  overlayData: ReadonlyMap<OverlayId, OverlayItem>;
};

// Helper function to convert internal state to readonly for external consumption
export function toReadonlyOverlayData(overlayData: OverlayData): ReadonlyOverlayData {
  return {
    current: overlayData.current,
    overlayOrderList: overlayData.overlayOrderList,
    overlayData: overlayData.overlayData as ReadonlyMap<OverlayId, OverlayItem>,
  };
}

// Common operations refactoring examples:

// Instead of: state.overlayData[id] 
// Use: state.overlayData.get(id) - returns OverlayItem | undefined (properly typed!)

// Setting values:
// Instead of: state.overlayData[id] = item
// Use: new Map(state.overlayData).set(id, item)

// Deleting values:
// Instead of: delete state.overlayData[id]
// Use: new Map(state.overlayData).delete(id) - Note: Map.prototype.delete() returns boolean, so for immutability:
// const newMap = new Map(state.overlayData);
// newMap.delete(id);

// Checking existence:
// Instead of: id in state.overlayData
// Use: state.overlayData.has(id)

// Getting size:
// Instead of: Object.keys(state.overlayData).length
// Use: state.overlayData.size

// Iterating:
// Instead of: Object.entries(state.overlayData)
// Use: state.overlayData.entries() or [...state.overlayData.entries()]

// Example reducer operations:

// Getting an item (properly typed as OverlayItem | undefined)
function getItem(state: OverlayData, id: OverlayId): OverlayItem | undefined {
  return state.overlayData.get(id);
}

// Setting an item (immutable update)
function setItem(state: OverlayData, id: OverlayId, item: OverlayItem): OverlayData {
  const newOverlayData = new Map(state.overlayData);
  newOverlayData.set(id, item);
  return {
    ...state,
    overlayData: newOverlayData,
  };
}

// Deleting an item (immutable update)
function deleteItem(state: OverlayData, id: OverlayId): OverlayData {
  const newOverlayData = new Map(state.overlayData);
  newOverlayData.delete(id);
  return {
    ...state,
    overlayData: newOverlayData,
  };
}

// Checking if item exists
function hasItem(state: OverlayData, id: OverlayId): boolean {
  return state.overlayData.has(id);
}

// Getting all entries
function getAllEntries(state: OverlayData): [OverlayId, OverlayItem][] {
  return Array.from(state.overlayData.entries());
}

// Converting back to Record if needed (rare case)
function toRecord(overlayData: Map<OverlayId, OverlayItem>): Record<OverlayId, OverlayItem> {
  const record: Record<OverlayId, OverlayItem> = {} as Record<OverlayId, OverlayItem>;
  for (const [key, value] of overlayData.entries()) {
    record[key] = value;
  }
  return record;
}

// Example reducer case
const overlayReducer = (state: OverlayData, action: any): OverlayData => {
  switch (action.type) {
    case 'SET_OVERLAY_ITEM':
      const newOverlayData = new Map(state.overlayData);
      newOverlayData.set(action.id, action.item);
      return {
        ...state,
        overlayData: newOverlayData,
      };
    
    case 'DELETE_OVERLAY_ITEM':
      const deleteOverlayData = new Map(state.overlayData);
      deleteOverlayData.delete(action.id);
      return {
        ...state,
        overlayData: deleteOverlayData,
      };
    
    case 'CLEAR_OVERLAY_DATA':
      return {
        ...state,
        overlayData: new Map<OverlayId, OverlayItem>(),
      };
    
    default:
      return state;
  }
};
