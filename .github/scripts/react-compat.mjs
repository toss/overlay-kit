import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { buildSync } from 'esbuild';

const require = createRequire(import.meta.url);
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

// React 16's CommonJS exports need bundler interop when consuming the ESM entry.
buildSync({
  stdin: { contents: "export * from 'overlay-kit';", resolveDir: process.cwd() },
  bundle: true,
  platform: 'node',
  format: 'cjs',
  external: ['react'],
  outfile: 'overlay-kit-bundled.cjs',
});

for (const kit of [require('overlay-kit'), require('./overlay-kit-bundled.cjs')]) {
  for (const { OverlayProvider, useCurrentOverlay } of [kit, kit.experimental_createOverlayContext()]) {
    function Child() {
      assert.equal(useCurrentOverlay(), null);
      return React.createElement('span', null, 'ready');
    }

    assert.equal(
      renderToStaticMarkup(React.createElement(OverlayProvider, null, React.createElement(Child))),
      '<span>ready</span>'
    );
  }
}
