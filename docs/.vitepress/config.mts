import { defineConfig } from 'vitepress';
import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'es-overlay',
  description: 'Management tools to help you manage overlays in a declarative way.',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/intro' },
      { text: 'API', link: '/api/overlay/open' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/intro' },
          { text: 'Installation', link: '/installation' },
        ],
      },
      {
        text: 'API',
        items: [
          {
            text: 'overlay',
            items: [{ text: 'Introduction', link: '/api/overlay/intro' }],
          },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/toss/es-overlay' }],
  },
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
});
