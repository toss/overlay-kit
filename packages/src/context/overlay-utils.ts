import { type OverlayId, type OverlayItem } from './reducer';

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
