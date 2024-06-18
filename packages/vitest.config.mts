import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import packageJson from './package.json';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    setupFiles: 'setup.test.ts',
    environment: 'jsdom',
    name: packageJson.name,
    dir: './src',
  },
});
