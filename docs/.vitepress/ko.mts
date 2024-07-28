import { defineConfig, type DefaultTheme } from 'vitepress';

export const ko = defineConfig({
  lang: 'ko',
  description: 'React에서 선언적으로 오버레이를 다루는 방법',

  themeConfig: {
    nav: [
      { text: '홈', link: '/ko/' },
      { text: '가이드', link: '/ko/introduction' },
      { text: '레퍼런스', link: '/ko/reference/overlay' },
    ],
    sidebar: [
      {
        text: '가이드',
        items: [
          { text: '소개', link: '/ko/introduction' },
          { text: '코드 비교', link: '/ko/code-comparison' },
          { text: '설치', link: '/ko/installation' },
          { text: '튜토리얼', link: '/ko/quickstart' },
        ],
      },
      {
        text: '레퍼런스',
        items: [
          { text: 'overlay 객체', link: '/ko/reference/overlay' },
          { text: 'OverlayProvider 컴포넌트', link: '/ko/reference/overlay-provider' },
        ],
      },
      {
        text: '더 알아보기',
        items: [
          { text: 'React 바깥에서 열기', link: '/ko/advanced/outside-react-overlay' },
          { text: 'Custom ID 지정하기', link: '/ko/advanced/custom-id' },
          { text: 'Promise와 함께 사용하기', link: '/ko/advanced/promise' },
          { text: '오버레이 애니메이션과 Unmount 처리하기', link: '/ko/advanced/unmount-with-animation' },
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
