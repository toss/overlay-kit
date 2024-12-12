import { OverlayProvider } from 'overlay-kit';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Demo } from './demo.jsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <OverlayProvider>
      <Demo />
    </OverlayProvider>
  </React.StrictMode>
);
