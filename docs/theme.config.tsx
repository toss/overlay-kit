import { motion } from 'motion/react';
import { useRouter } from 'nextra/hooks';
import { type DocsThemeConfig } from 'nextra-theme-docs';

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
  project: {
    link: 'https://github.com/toss/overlay-kit',
  },
  i18n: [
    { locale: 'en', name: 'English' },
    { locale: 'ko', name: '한국어' },
  ],
  main: function Main({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
      <motion.div key={router.asPath} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        {children}
      </motion.div>
    );
  },
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
