import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { useRef, type PropsWithChildren } from 'react';

type ModalProps = {
  isOpen?: boolean;
  onExit?: () => void;
};

export function Modal({ children, isOpen = false, onExit }: PropsWithChildren<ModalProps>) {
  const prevIsOpenRef = useRef(isOpen);

  if (isOpen !== prevIsOpenRef.current) {
    prevIsOpenRef.current = isOpen;

    if (prevIsOpenRef.current === false) {
      setTimeout(() => onExit?.(), 300);
    }
  }

  return (
    <AnimatePresence>{isOpen === true && <ModalContent isOpen={isOpen}>{children}</ModalContent>}</AnimatePresence>
  );
}

const MODAL_CONTENT_VARIANTS: Variants = {
  hidden: { opacity: 0, scale: 0.75 },
  show: { opacity: 1, scale: 1 },
};

function ModalContent({ children, isOpen }: PropsWithChildren<ModalProps>) {
  return (
    <div
      style={{
        zIndex: 100,
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/** @ts-expect-error */}
      <motion.section
        variants={MODAL_CONTENT_VARIANTS}
        initial="hidden"
        exit="hidden"
        animate={isOpen ? 'show' : 'hidden'}
        style={{
          padding: 120,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: 'gray',
          borderRadius: 12,
        }}
      >
        {children}
      </motion.section>
    </div>
  );
}
