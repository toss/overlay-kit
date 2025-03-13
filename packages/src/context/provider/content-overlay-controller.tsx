import { type FC, useEffect, useRef } from 'react';
import { type OverlayItemContext } from '../store';

type OverlayControllerProps<C extends OverlayItemContext> = {
  overlayId: string;
  isOpen: boolean;
  close: () => void;
  unmount: () => void;
  context: C;
};

type OverlayAsyncControllerProps<T, C extends OverlayItemContext> = Omit<OverlayControllerProps<C>, 'close'> & {
  close: (param: T) => void;
};

export type OverlayControllerComponent<C extends OverlayItemContext> = FC<OverlayControllerProps<C>>;
export type OverlayAsyncControllerComponent<T, C extends OverlayItemContext> = FC<OverlayAsyncControllerProps<T, C>>;

type ContentOverlayControllerProps<C extends OverlayItemContext> = {
  isOpen: boolean;
  current: string | null;
  overlayId: string;
  onMounted: () => void;
  onCloseModal: () => void;
  onExitModal: () => void;
  controller: OverlayControllerComponent<C>;
  context: C;
};

export function ContentOverlayController<C extends OverlayItemContext>({
  isOpen,
  current,
  overlayId,
  onMounted,
  onCloseModal,
  onExitModal,
  controller: Controller,
  context,
}: ContentOverlayControllerProps<C>) {
  const prevCurrent = useRef(current);
  const onMountedRef = useRef(onMounted);

  /**
   * @description Executes when closing and reopening an overlay without unmounting.
   */
  if (prevCurrent.current !== current) {
    prevCurrent.current = current;

    if (current === overlayId) {
      onMountedRef.current();
    }
  }

  useEffect(() => {
    onMountedRef.current();
  }, []);

  return (
    <Controller overlayId={overlayId} isOpen={isOpen} close={onCloseModal} unmount={onExitModal} context={context} />
  );
}
