import { overlay } from 'overlay-kit';
import { useState } from 'react';
import { Modal } from './components/modal.tsx';

export function Demo() {
  return (
    <div>
      <DemoWithState />
      <DemoWithEsOverlay />
    </div>
  );
}

function DemoWithState() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <p>Demo with useState</p>
      <button onClick={() => setIsOpen(true)}>open modal</button>
      <Modal isOpen={isOpen}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <p>MODAL CONTENT</p>
          <button onClick={() => setIsOpen(false)}>close modal</button>
        </div>
      </Modal>
    </div>
  );
}

function DemoWithEsOverlay() {
  return (
    <div>
      <p>Demo with overlay-kit</p>
      <button
        onClick={() => {
          overlay.open(({ isOpen, close, unmount }) => {
            return (
              <Modal isOpen={isOpen} onExit={unmount}>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                >
                  <p>MODAL CONTENT</p>
                  <button onClick={close}>close modal</button>
                </div>
              </Modal>
            );
          });
        }}
      >
        open modal
      </button>
    </div>
  );
}
