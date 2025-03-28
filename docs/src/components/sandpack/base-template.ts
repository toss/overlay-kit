export const baseTemplate = {
  files: {
    '/hideReactErrorOverlay.css': {
      code: `
        body > iframe {
        display: none;
      }`,
      hidden: true,
    },
    '/index.tsx': {
      code: `
        import React from "react";
        import { createRoot } from "react-dom/client";
        import "./styles.css";
        import App from "./App";

        const root = createRoot(document.getElementById("root"));
        root.render(<App />);
      `,
      hidden: true,
    },
    '/App.tsx': {
      code: `
        import { Example } from './Example'
        import './hideReactErrorOverlay.css'

        export default function App() {
          return (
            <Example />
          )
        }
      `,
      hidden: true,
    },
  },
  dependencies: {
    '@emotion/react': 'latest',
    '@emotion/styled': 'latest',
    '@mui/material': '^6.4.8',
    'overlay-kit': 'latest',
  },
  devDependencies: {},
};
