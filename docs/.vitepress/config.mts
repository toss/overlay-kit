import { defineConfig } from 'vitepress';
import { createRequire } from 'module';
import path from 'path';
import { en } from './en.mts';
import { ko } from './ko.mts';

const require = createRequire(import.meta.url);

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'overlay-kit',
  head: [
    ['link', { rel: 'icon', type: 'image/png', sizes: '100x100', href: '/favicon-100x100.png' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://static.toss.im/tps/main.css',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://static.toss.im/tps/others.css',
      },
    ],
    ['meta', { property: 'og:image', content: '/og.png' }],
  ],
  themeConfig: {
    logo: { dark: '/logo-white.png', light: '/logo-black.png' },
    siteTitle: false,
    search: {
      provider: 'local',
      options: {
        locales: {
          ko: {
            translations: {
              button: {
                buttonText: '검색',
                buttonAriaLabel: '검색',
              },
              modal: {
                backButtonTitle: '뒤로가기',
                displayDetails: '더보기',
                footer: {
                  closeKeyAriaLabel: '닫기',
                  closeText: '닫기',
                  navigateDownKeyAriaLabel: '아래로',
                  navigateText: '이동',
                  navigateUpKeyAriaLabel: '위로',
                  selectKeyAriaLabel: '선택',
                  selectText: '선택',
                },
                noResultsText: '검색 결과를 찾지 못했어요.',
                resetButtonTitle: '모두 지우기',
              },
            },
          },
        },
      },
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/toss/overlay-kit' }],
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
  locales: {
    root: { label: 'English', ...en },
    ko: { label: '한국어', ...ko },
  },
});
