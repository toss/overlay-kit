import { overlay } from 'overlay-kit';
import { useState } from 'react';
import { Modal } from './components/modal.tsx';

export function Demo() {
  return (
    <div style={{ padding: 20, fontFamily: 'system-ui, sans-serif' }}>
      <h1>overlay-kit Examples</h1>
      <hr style={{ margin: '20px 0' }} />
      <DemoWithState />
      <hr style={{ margin: '20px 0' }} />
      <DemoWithEsOverlay />
      <hr style={{ margin: '20px 0' }} />
      <DemoOpenAsyncBasic />
      <hr style={{ margin: '20px 0' }} />
      <DemoOpenAsyncWithOnDismiss />
      <hr style={{ margin: '20px 0' }} />
      <DemoExternalClose />
    </div>
  );
}

function DemoWithState() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <h2>1. Demo with useState</h2>
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
      <h2>2. Demo with overlay.open</h2>
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

function DemoOpenAsyncBasic() {
  const [result, setResult] = useState<string>('(no result yet)');

  return (
    <div>
      <h2>3. Demo with overlay.openAsync (basic)</h2>
      <p>
        Result: <strong>{result}</strong>
      </p>
      <button
        onClick={async () => {
          setResult('(waiting...)');
          const value = await overlay.openAsync<boolean>(({ isOpen, close, unmount }) => {
            return (
              <Modal isOpen={isOpen} onExit={unmount}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                  }}
                >
                  <p>Do you confirm?</p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => close(true)}>Confirm (true)</button>
                    <button onClick={() => close(false)}>Cancel (false)</button>
                  </div>
                </div>
              </Modal>
            );
          });
          setResult(String(value));
        }}
      >
        open confirm dialog
      </button>
    </div>
  );
}

function DemoOpenAsyncWithOnDismiss() {
  const [result, setResult] = useState<string>('(no result yet)');
  const [overlayId] = useState('ondismiss-demo-overlay');

  return (
    <div>
      <h2>4. Demo with overlay.openAsync + defaultValue option</h2>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 10 }}>
        With <code>defaultValue</code>, the Promise resolves even when closed externally.
      </p>
      <p>
        Result: <strong>{result}</strong>
      </p>
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <button
          onClick={async () => {
            setResult('(waiting...)');
            const value = await overlay.openAsync<boolean | 'dismissed'>(
              ({ isOpen, close, unmount }) => {
                return (
                  <Modal isOpen={isOpen} onExit={unmount}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                      }}
                    >
                      <p>Do you confirm?</p>
                      <p style={{ fontSize: 12, color: '#666' }}>(Try clicking "Close Externally" button below)</p>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={() => close(true)}>Confirm (true)</button>
                        <button onClick={() => close(false)}>Cancel (false)</button>
                      </div>
                    </div>
                  </Modal>
                );
              },
              { overlayId, defaultValue: 'dismissed' }
            );
            setResult(String(value));
          }}
        >
          open dialog
        </button>
        <button
          onClick={() => overlay.close(overlayId)}
          style={{ backgroundColor: '#ff6b6b', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 4 }}
        >
          Close Externally
        </button>
        <button
          onClick={() => overlay.closeAll()}
          style={{ backgroundColor: '#ffa94d', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 4 }}
        >
          Close All
        </button>
      </div>
    </div>
  );
}

function DemoExternalClose() {
  const [result, setResult] = useState<string>('(no result yet)');
  const [status, setStatus] = useState<'idle' | 'waiting'>('idle');
  const [overlayId] = useState('external-close-demo-overlay');

  return (
    <div>
      <h2>5. Demo: External Close WITHOUT defaultValue (Promise stays pending)</h2>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 10 }}>
        Without <code>defaultValue</code>, the Promise never resolves when closed externally.
      </p>
      <p>
        Result: <strong>{result}</strong>
      </p>
      <p>
        Status: <strong style={{ color: status === 'waiting' ? 'orange' : 'green' }}>{status}</strong>
      </p>
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <button
          onClick={async () => {
            setResult('(no result yet)');
            setStatus('waiting');
            const value = await overlay.openAsync<boolean>(
              ({ isOpen, close, unmount }) => {
                return (
                  <Modal isOpen={isOpen} onExit={unmount}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                      }}
                    >
                      <p>Click "Close Externally" - Promise will stay pending!</p>
                      <button onClick={() => close(true)}>Close Internally (resolves)</button>
                    </div>
                  </Modal>
                );
              },
              { overlayId }
            );
            setResult(String(value));
            setStatus('idle');
          }}
        >
          open dialog
        </button>
        <button
          onClick={() => overlay.close(overlayId)}
          style={{ backgroundColor: '#ff6b6b', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 4 }}
        >
          Close Externally (Promise stays pending)
        </button>
      </div>
    </div>
  );
}
