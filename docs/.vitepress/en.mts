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
            items: [
              { text: 'Introduction', link: '/api/overlay/intro' },
              { text: 'open', link: '/api/overlay/open' },
              { text: 'close', link: '/api/overlay/close' },
            ],
          },
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
