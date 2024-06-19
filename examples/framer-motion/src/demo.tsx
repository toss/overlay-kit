import { overlay } from 'es-overlay';
import { useState } from 'react';
import { Modal } from './components/modal';

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
      <p>Demo with es-overlay</p>
      <button
        onClick={() => {
          overlay.open(({ isOpen, onClose, onExit }) => {
            return (
              <Modal isOpen={isOpen} onExit={onExit}>
                <div
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                >
                  <p>MODAL CONTENT</p>
                  <button onClick={() => onClose()}>close modal</button>
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
