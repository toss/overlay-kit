import stylexPlugin from '@stylexswc/nextjs-plugin';
import nextra from 'nextra';
import { remarkSandpack } from 'remark-sandpack';

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  mdxOptions: {
    remarkPlugins: [remarkSandpack],
  },
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
