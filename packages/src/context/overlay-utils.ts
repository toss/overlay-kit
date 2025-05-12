import { type OverlayId, type OverlayItem } from './reducer';

/**
 * Determines which overlay should become the current one when closing or removing an overlay.
 *
 * @description If closing the last overlay, specify the overlay before it.
 * @description If closing intermediate overlays, specifies the last overlay.
 *
 * @example open - [1, 2, 3, 4]
 * close 2 => current: 4
 * close 4 => current: 3
 * close 3 => current: 1
 * close 1 => current: null
 *
 * @param overlayOrderList The ordered list of overlay IDs
 * @param overlayData The map of overlay data
 * @param targetOverlayId The ID of the overlay being closed or removed
 * @returns The ID of the overlay that should become current, or null if none
 */
export function determineCurrentOverlayId(
  overlayOrderList: OverlayId[],
  overlayData: Record<OverlayId, OverlayItem>,
  targetOverlayId: OverlayId
): OverlayId | null {
  const openedOverlayOrderList = overlayOrderList.filter(
    (orderedOverlayId) => overlayData[orderedOverlayId].isOpen === true
  );
  const targetIndexInOpenedList = openedOverlayOrderList.findIndex((item) => item === targetOverlayId);

  return targetIndexInOpenedList === openedOverlayOrderList.length - 1
    ? openedOverlayOrderList[targetIndexInOpenedList - 1] ?? null
    : openedOverlayOrderList.at(-1) ?? null;
}
