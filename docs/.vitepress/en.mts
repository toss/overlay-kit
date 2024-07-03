import { defineConfig, type DefaultTheme } from 'vitepress';

export const en = defineConfig({
  lang: 'en',
  description: 'A declarative way to manage overlays in React',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/motivation' },
      { text: 'API', link: '/api/overlay' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'The Overlay Problem', link: '/motivation' },
          { text: 'Features', link: '/features' },
          { text: 'Installation', link: '/installation' },
          { text: 'Quick Start', link: '/quickstart' },
        ],
      },
      {
        text: 'API',
        items: [
          { text: 'OverlayProvider', link: '/api/overlay-provider' },
          { text: 'The overlay object', link: '/api/overlay' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/toss/overlay-kit' }],
    editLink: {
      pattern: 'https://github.com/toss/overlay-kit/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © ${new Date().getFullYear()} Viva Republica, Inc.`,
    },
  },
});
