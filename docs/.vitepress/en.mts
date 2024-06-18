import { defineConfig, type DefaultTheme } from 'vitepress';

export const en = defineConfig({
  lang: 'en',
  description: 'Management tools to help you manage overlays in a declarative way.',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/intro' },
      { text: 'API', link: '/api/overlay/intro' },
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
    editLink: {
      pattern: 'https://github.com/toss/es-toolkit/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © ${new Date().getFullYear()} Viva Republica, Inc.`,
    },
  },
});
