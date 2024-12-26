import { OverlayProvider } from 'overlay-kit';
import React from 'react';
import ReactDOM from 'react-dom';
import { Demo } from './demo.tsx';

ReactDOM.render(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  <React.StrictMode>
    <OverlayProvider>
      <Demo />
    </OverlayProvider>
  </React.StrictMode>,
  document.getElementById('root')!
);
