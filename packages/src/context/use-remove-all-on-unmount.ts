import { useEffect, useRef } from 'react';
import { useOverlayContext } from './context';

/**
 * @description 해당 컴포넌트가 unmount될 때 열려있는 모든 modal을 닫습니다.
 */
export function useRemoveAllOnUnmount(delay = 0) {
  const overlayContext = useOverlayContext();
  const closeAllOverlayRef = useRef(overlayContext.closeAll);
  const exitAllOverlayRef = useRef(overlayContext.exitAll);

  closeAllOverlayRef.current = overlayContext.closeAll;
  exitAllOverlayRef.current = overlayContext.exitAll;

  useEffect(() => {
    return () => {
      closeAllOverlayRef.current();

      setTimeout(() => {
        exitAllOverlayRef.current();
      }, delay);
    };
  }, []);
}
