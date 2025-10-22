import { defineConfig } from 'vitest/config';
import packageJson from './package.json';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: 'setup.test.ts',
    environment: 'jsdom',
    name: packageJson.name,
    dir: './src',
    coverage: {
      provider: 'v8',
      exclude: ['**/index.ts', '**/index.tsx', 'dist/**/*', '**/*.config.ts', '**/*.config.mts', '**/*.d.ts'],
    },
  },
});
