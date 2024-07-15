import { defineConfig } from 'vitepress';

export const ko = defineConfig({
  lang: 'ko',
  description: 'React에서 선언적으로 오버레이를 다루는 방법',

  themeConfig: {
    nav: [
      { text: '홈', link: '/ko/' },
      { text: '가이드', link: '/ko/motivation' },
      { text: '사용법', link: '/ko/usage/custom-id' },
    ],
    sidebar: [
      {
        text: '가이드',
        items: [
          { text: '왜 사용하나요?', link: '/ko/motivation' },
          { text: 'overlay-kit의 기능', link: '/ko/features' },
          { text: '설치', link: '/ko/installation' },
        ],
      },
      {
        text: '튜토리얼',
        items: [{ text: 'mui와 함께 사용하기', link: '/ko/quick-start/mui' }],
      },
      {
        text: '사용법',
        items: [
          { text: 'overlay 열기', link: '/ko/usage/open-overlay' },
          { text: 'promise overlay 열기', link: '/ko/usage/open-promise-overlay' },
          { text: 'custom id 지정하기', link: '/ko/usage/custom-id' },
          { text: '오버레이 조작하기', link: '/ko/usage/handle-overlay' },
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
