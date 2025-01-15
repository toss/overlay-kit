import { motion } from 'motion/react';
import { useRouter } from 'nextra/hooks';
import { useConfig, type DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: () => {
    const router = useRouter();
    if (router.pathname === '/ko' || router.pathname === '/en') {
      return <></>;
    }
    return (
      <motion.strong initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        overlay-kit
      </motion.strong>
    );
  },
  head: function Head() {
    const config = useConfig<{ description?: string }>();
    const { asPath, defaultLocale, locale } = useRouter();

    const title = config.title !== 'Index' ? `${config.title} - overlay-kit` : 'overlay-kit';
    const description = config.frontMatter.description ?? 'Packages to use React Suspense easily';
    const url = 'https://overlay-kit.slash.page' + (defaultLocale === locale ? asPath : `/${locale}${asPath}`);

    return (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="alternate" hrefLang="ko" href="https://overlay-kit.slash.page/ko" />
        <link rel="alternate" hrefLang="en" href="https://overlay-kit.slash.page/en" />
        <meta
          property="keywords"
          content="overlay-kit, overlay, 오버레이 관리, 모달 관리, 다이얼로그 관리, overlay state, state management, react, react-native, rn"
        />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title ?? 'overlay-kit'} />
        <meta property="og:url" content={url} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="/logo-dark.png" />
        <link rel="icon" href="/favicon-100x100.ico" type="image/ico" />
      </>
    );
  },
  main: function Main({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
      <motion.div key={router.asPath} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        {children}
      </motion.div>
    );
  },
  project: {
    link: 'https://github.com/toss/overlay-kit',
  },
  docsRepositoryBase: 'https://github.com/toss/overlay-kit/tree/main/docs',
  i18n: [
    { locale: 'en', name: 'English' },
    { locale: 'ko', name: '한국어' },
  ],
  search: {
    placeholder: function Placeholder() {
      const router = useRouter();

      if (router.locale === 'ko') {
        return '검색어를 입력하세요...';
      }

      return 'Search documentation...';
    },
  },
};

export default config;
