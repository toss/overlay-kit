import { OverlayProvider } from 'overlay-kit';
import React from 'react';
import ReactDOM from 'react-dom';
import { Demo } from './demo';

ReactDOM.render(
  <React.StrictMode>
    <OverlayProvider>
      <Demo />
    </OverlayProvider>
  </React.StrictMode>,
  document.getElementById('root')!
);
