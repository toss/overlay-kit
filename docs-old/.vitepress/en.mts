import { defineConfig, type DefaultTheme } from 'vitepress';

export const en = defineConfig({
  lang: 'en',
  description: 'A declarative way to manage overlays in React',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/introduction' },
      { text: 'Reference', link: '/reference/overlay' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/introduction' },
          { text: 'Code Comparison', link: '/code-comparison' },
          { text: 'Installation', link: '/installation' },
          { text: 'Quick Start', link: '/quickstart' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'The overlay object', link: '/reference/overlay' },
          { text: 'OverlayProvider', link: '/reference/overlay-provider' },
        ],
      },
      {
        text: 'Advanced',
        items: [
          { text: 'Open outside of react', link: '/advanced/outside-react-overlay' },
          { text: 'Assign custom id', link: '/advanced/custom-id' },
          { text: 'Using with Promise', link: '/advanced/promise' },
          { text: 'Unmount with animation', link: '/advanced/unmount-with-animation' },
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
