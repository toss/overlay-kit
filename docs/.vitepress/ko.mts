import { defineConfig, type DefaultTheme } from 'vitepress';

export const ko = defineConfig({
  lang: 'ko',
  description: 'React에서 선언적으로 오버레이를 다루는 방법',

  themeConfig: {
    nav: [
      { text: '홈', link: '/ko/' },
      { text: '소개', link: '/ko/introduction' },
      { text: '가이드', link: '/ko/usage/overlay' },
      { text: '레퍼런스', link: '/ko/usage/overlay' },
    ],
    sidebar: [
      {
        text: '이해하기',
        items: [
          { text: '소개', link: '/ko/introduction' },
          { text: '기능', link: '/ko/features' }
        ],
      },
      {
        text: '가이드',
        items: [
          { text: '설치', link: '/ko/installation' },
          { text: '튜토리얼', link: '/ko/quickstart' },
        ],
      },
      {
        text: '레퍼런스',
        items: [
          { text: 'Custom id 지정하기', link: '/ko/usage/custom-id' },
          { text: 'OverlayProvider', link: '/ko/usage/overlay-provider' },
          { text: 'overlay 객체', link: '/ko/usage/overlay' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/toss/overlay-kit' }],
    editLink: {
      pattern: 'https://github.com/toss/overlay-kit/edit/main/docs/:path',
      text: '깃허브에서 수정하기',
    },
    footer: {
      message: 'MIT 라이선스에 따라 배포됩니다.',
      copyright: `Copyright © ${new Date().getFullYear()} Viva Republica, Inc.`,
    },
  },
});
