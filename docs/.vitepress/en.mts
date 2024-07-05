import { defineConfig, type DefaultTheme } from 'vitepress';

export const en = defineConfig({
  lang: 'en',
  description: 'A declarative way to manage overlays in React',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/motivation' },
      { text: 'Usage', link: '/usage/overlay' },
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
        text: 'Usage',
        items: [
          { text: 'Assignment Custom id', link: '/usage/custom-id' },
          { text: 'OverlayProvider', link: '/usage/overlay-provider' },
          { text: 'The overlay object', link: '/usage/overlay' },
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
