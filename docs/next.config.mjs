import stylexPlugin from '@stylexswc/nextjs-plugin';
import nextra from 'nextra';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

export default stylexPlugin({
  useCSSLayers: true,
})(
  withNextra({
    i18n: {
      locales: ['en', 'ko'],
      defaultLocale: 'en',
    },
  })
);
