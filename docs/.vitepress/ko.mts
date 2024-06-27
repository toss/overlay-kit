import { defineConfig, type DefaultTheme } from 'vitepress';

export const ko = defineConfig({
  lang: 'ko',
  description: '선언형으로 오버레이를 관리하기 위한 도구.',

  themeConfig: {
    nav: [
      { text: '홈', link: '/ko/' },
      { text: '가이드', link: '/ko/intro' },
      { text: 'API', link: '/ko/api/overlay/intro' },
    ],
    sidebar: [
      {
        text: '가이드',
        items: [
          { text: '오버레이 문제', link: '/ko/motivation' },
          { text: '기능', link: '/ko/features' },
          { text: '설치', link: '/ko/installation' },
          { text: '튜토리얼', link: '/ko/quickstart' },
        ],
      },
      {
        text: 'API',
        items: [
          { text: 'OverlayProvider', link: '/ko/api/OverlayProvider' },
          { text: 'overlay 객체', link: '/ko/api/overlay' },
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
