import { useEffect, useRef } from 'react';
import { useOverlayContext } from './context';

/**
 * @description 해당 컴포넌트가 unmount될 때 열려있는 모든 modal을 닫습니다.
 */
export function useRemoveAllOnUnmount(delay = 0) {
  const overlayContext = useOverlayContext();
  const closeAllOverlayRef = useRef(overlayContext.closeAll);
  const unmountAllOverlayRef = useRef(overlayContext.unmountAll);

  closeAllOverlayRef.current = overlayContext.closeAll;
  unmountAllOverlayRef.current = overlayContext.unmountAll;

  useEffect(() => {
    return () => {
      closeAllOverlayRef.current();

      setTimeout(() => {
        unmountAllOverlayRef.current();
      }, delay);
    };
  }, []);
}
