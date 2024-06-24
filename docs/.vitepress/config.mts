import { defineConfig } from 'vitepress';
import { createRequire } from 'module';
import path from 'path';
import { en } from './en.mts';
import { ko } from './ko.mts';

const require = createRequire(import.meta.url);

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'overlay-kit',
  vite: {
    resolve: {
      alias: {
        vue: path.dirname(
          require.resolve('vue/package.json', {
            paths: [require.resolve('vitepress')],
          })
        ),
        'vue/server-renderer': path.dirname(
          require.resolve('vue/server-renderer', {
            paths: [require.resolve('vitepress')],
          })
        ),
      },
    },
  },
  locales: {
    root: { label: 'English', ...en },
    ko: { label: '한국어', ...ko },
  },
});
