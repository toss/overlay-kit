import { OverlayProvider } from 'es-overlay';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Demo } from './demo';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <OverlayProvider>
      <Demo />
    </OverlayProvider>
  </React.StrictMode>
);
