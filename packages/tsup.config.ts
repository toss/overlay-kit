import { defineConfig } from 'tsup';

export default defineConfig({
  format: ['cjs', 'esm'],
  entry: ['src/index.ts'],
  splitting: false,
  minify: true,
  dts: true,
  clean: true,
  banner: {
    js: '"use client";',
  },
});
