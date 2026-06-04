import { motion } from 'motion/react';
import { useRouter } from 'nextra/hooks';
import { useConfig, type DocsThemeConfig } from 'nextra-theme-docs';
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react';

const SITE = 'https://overlay-kit.slash.page';
const RAW_BASE = 'https://raw.githubusercontent.com/toss/overlay-kit/main/docs/src/pages';

type Locale = 'en' | 'ko';
type CopyState = 'idle' | 'copying' | 'copied' | 'error';

const ASK_AI_COPY: Record<
  Locale,
  {
    trigger: string;
    copying: string;
    copied: string;
    failed: string;
    caretAria: string;
    items: {
      chatgpt: { title: string; desc: string };
      claude: { title: string; desc: string };
    };
  }
> = {
  en: {
    trigger: 'Copy Markdown',
    copying: 'Copying…',
    copied: 'Copied!',
    failed: 'Copy failed',
    caretAria: 'Open AI menu',
    items: {
      chatgpt: { title: 'Open in ChatGPT', desc: 'Ask questions about this page' },
      claude: { title: 'Open in Claude', desc: 'Ask questions about this page' },
    },
  },
  ko: {
    trigger: '마크다운 복사',
    copying: '복사 중…',
    copied: '복사됨',
    failed: '복사 실패',
    caretAria: 'AI 메뉴 열기',
    items: {
      chatgpt: { title: 'ChatGPT에서 열기', desc: '이 페이지에 대해 질문하기' },
      claude: { title: 'Claude에서 열기', desc: '이 페이지에 대해 질문하기' },
    },
  },
};

function buildPageUrl(asPath: string, locale: Locale): string {
  const cleanPath = asPath.replace(/[#?].*$/, '');
  const withLocale = cleanPath.startsWith(`/${locale}/`) ? cleanPath : `/${locale}${cleanPath}`;
  return `${SITE}${withLocale}`;
}

function buildRawMdxUrl(asPath: string, locale: Locale): string {
  const cleanPath = asPath.replace(/[#?].*$/, '');
  const withoutLocale = cleanPath.startsWith(`/${locale}/`) ? cleanPath.slice(locale.length + 1) : cleanPath;
  return `${RAW_BASE}/${locale}${withoutLocale}.mdx`;
}

function buildAskAiUrls(asPath: string, locale: Locale) {
  const pageUrl = buildPageUrl(asPath, locale);
  const prompt = `Read ${pageUrl}, I want to ask questions about it.`;
  return {
    chatgpt: `https://chatgpt.com/?hints=search&q=${encodeURIComponent(prompt)}`,
    claude: `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
  };
}

function AskAi() {
  const router = useRouter();
  const locale: Locale = router.locale === 'ko' ? 'ko' : 'en';
  const asPath = router.asPath ?? '/';

  const [open, setOpen] = useState(false);
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
    setCopyState('idle');
  }, [asPath]);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pathOnly = asPath.replace(/^\/(?:en|ko)(?=\/|$)/, '') || '/';
  if (!/^\/(docs|api)(\/|$)/.test(pathOnly)) {
    return null;
  }

  const urls = buildAskAiUrls(asPath, locale);
  const labels = ASK_AI_COPY[locale];

  const triggerLabel =
    copyState === 'copying'
      ? labels.copying
      : copyState === 'copied'
        ? labels.copied
        : copyState === 'error'
          ? labels.failed
          : labels.trigger;

  const handleCopy = async () => {
    if (copyState === 'copying') return;
    setCopyState('copying');
    try {
      const res = await fetch(buildRawMdxUrl(asPath, locale));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1600);
    } catch {
      setCopyState('error');
      window.setTimeout(() => setCopyState('idle'), 2000);
    }
  };

  return (
    <div ref={wrapRef} style={askAiStyles.wrap}>
      <div style={askAiStyles.chip}>
        <button type="button" onClick={handleCopy} style={askAiStyles.chipLeft} disabled={copyState === 'copying'}>
          <CopyIcon />
          <span>{triggerLabel}</span>
        </button>
        <div style={askAiStyles.divider} aria-hidden="true" />
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={labels.caretAria}
          style={askAiStyles.chipRight}
        >
          <CaretIcon open={open} />
        </button>
      </div>
      {open && (
        <div role="menu" style={askAiStyles.menu}>
          <AskAiItem
            href={urls.chatgpt}
            icon={<ChatGPTIcon />}
            title={labels.items.chatgpt.title}
            desc={labels.items.chatgpt.desc}
            onSelect={() => setOpen(false)}
          />
          <AskAiItem
            href={urls.claude}
            icon={<ClaudeIcon />}
            title={labels.items.claude.title}
            desc={labels.items.claude.desc}
            onSelect={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

function AskAiItem({
  href,
  icon,
  title,
  desc,
  onSelect,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  desc: string;
  onSelect: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={onSelect}
      role="menuitem"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...askAiStyles.item, ...(hover ? askAiStyles.itemHover : null) }}
    >
      <span style={askAiStyles.itemIcon}>{icon}</span>
      <span style={askAiStyles.itemBody}>
        <span style={askAiStyles.itemTitle}>{title}</span>
        <span style={askAiStyles.itemDesc}>{desc}</span>
      </span>
      <span style={askAiStyles.itemExternal} aria-hidden="true">
        <ExternalIcon />
      </span>
    </a>
  );
}

function CopyIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
      <path d="M3.5 10.5h-.25A.75.75 0 0 1 2.5 9.75V3.25a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 .75.75v.25" />
    </svg>
  );
}

function CaretIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
      aria-hidden="true"
    >
      <path d="M3 4.5 6 7.5l3-3" />
    </svg>
  );
}

function ChatGPTIcon() {
  return (
    <svg width="20" height="20" viewBox="118.557 119.958 484.139 479.818" fill="currentColor" aria-hidden="true">
      <path d="M304.246 294.611V249.028C304.246 245.189 305.687 242.309 309.044 240.392L400.692 187.612C413.167 180.415 428.042 177.058 443.394 177.058C500.971 177.058 537.44 221.682 537.44 269.182C537.44 272.54 537.44 276.379 536.959 280.218L441.954 224.558C436.197 221.201 430.437 221.201 424.68 224.558L304.246 294.611ZM518.245 472.145V363.224C518.245 356.505 515.364 351.707 509.608 348.349L389.174 278.296L428.519 255.743C431.877 253.826 434.757 253.826 438.115 255.743L529.762 308.523C556.154 323.879 573.905 356.505 573.905 388.171C573.905 424.636 552.315 458.225 518.245 472.141V472.145ZM275.937 376.182L236.592 353.152C233.235 351.235 231.794 348.354 231.794 344.515V238.956C231.794 187.617 271.139 148.749 324.4 148.749C344.555 148.749 363.264 155.468 379.102 167.463L284.578 222.164C278.822 225.521 275.942 230.319 275.942 237.039V376.186L275.937 376.182ZM360.626 425.122L304.246 393.455V326.283L360.626 294.616L417.002 326.283V393.455L360.626 425.122ZM396.852 570.989C376.698 570.989 357.989 564.27 342.151 552.276L436.674 497.574C442.431 494.217 445.311 489.419 445.311 482.699V343.552L485.138 366.582C488.495 368.499 489.936 371.379 489.936 375.219V480.778C489.936 532.117 450.109 570.985 396.852 570.985V570.989ZM283.134 463.99L191.486 411.211C165.094 395.854 147.343 363.229 147.343 331.562C147.343 294.616 169.415 261.509 203.48 247.593V356.991C203.48 363.71 206.361 368.508 212.117 371.866L332.074 441.437L292.729 463.99C289.372 465.907 286.491 465.907 283.134 463.99ZM277.859 542.68C223.639 542.68 183.813 501.895 183.813 451.514C183.813 447.675 184.294 443.836 184.771 439.997L279.295 494.698C285.051 498.056 290.812 498.056 296.568 494.698L417.002 425.127V470.71C417.002 474.549 415.562 477.429 412.204 479.346L320.557 532.126C308.081 539.323 293.206 542.68 277.854 542.68H277.859ZM396.852 599.776C454.911 599.776 503.37 558.513 514.41 503.812C568.149 489.896 602.696 439.515 602.696 388.176C602.696 354.587 588.303 321.962 562.392 298.45C564.791 288.373 566.231 278.296 566.231 268.224C566.231 199.611 510.571 148.267 446.274 148.267C433.322 148.267 420.846 150.184 408.37 154.505C386.775 133.392 357.026 119.958 324.4 119.958C266.342 119.958 217.883 161.22 206.843 215.921C153.104 229.837 118.557 280.218 118.557 331.557C118.557 365.146 132.95 397.771 158.861 421.283C156.462 431.36 155.022 441.437 155.022 451.51C155.022 520.123 210.682 571.466 274.978 571.466C287.931 571.466 300.407 569.549 312.883 565.228C334.473 586.341 364.222 599.776 396.852 599.776Z" />
    </svg>
  );
}

function ClaudeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden="true">
      <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 3.5h3.5V7" />
      <path d="M12.5 3.5 7 9" />
      <path d="M11.5 9v3a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V5a.5.5 0 0 1 .5-.5h3" />
    </svg>
  );
}

const askAiStyles: Record<string, CSSProperties> = {
  wrap: {
    position: 'relative',
    display: 'inline-flex',
    marginBlockEnd: 16,
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'stretch',
    height: 32,
    borderRadius: 999,
    background: 'rgba(127, 127, 127, 0.08)',
    border: '1px solid rgba(127, 127, 127, 0.18)',
    overflow: 'hidden',
    color: 'currentColor',
  },
  chipLeft: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    paddingInline: 12,
    fontSize: 13,
    fontWeight: 500,
    color: 'inherit',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  divider: {
    width: 1,
    background: 'rgba(127, 127, 127, 0.18)',
  },
  chipRight: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingInline: 8,
    color: 'inherit',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  menu: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    right: 0,
    minWidth: 280,
    padding: 6,
    borderRadius: 12,
    background: 'var(--ask-ai-menu-bg, #ffffff)',
    color: 'var(--ask-ai-menu-fg, #111111)',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.05)',
    zIndex: 50,
  },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '8px 10px',
    borderRadius: 8,
    color: 'inherit',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  itemHover: {
    background: 'rgba(127, 127, 127, 0.12)',
  },
  itemIcon: {
    flex: '0 0 auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    marginTop: 1,
  },
  itemBody: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    minWidth: 0,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.3,
  },
  itemDesc: {
    fontSize: 12,
    color: 'rgba(127, 127, 127, 1)',
    lineHeight: 1.4,
  },
  itemExternal: {
    flex: '0 0 auto',
    display: 'inline-flex',
    alignItems: 'center',
    color: 'rgba(127, 127, 127, 1)',
    marginTop: 4,
  },
};

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
    const description = config.frontMatter.description ?? 'A library for handling overlays more easily in React';
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
        <link rel="icon" href="/favicon.ico" type="image/ico" />
      </>
    );
  },
  main: function Main({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
      <motion.div key={router.asPath} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <AskAi />
        </div>
        {children}
      </motion.div>
    );
  },
  footer: {
    content: `MIT ${new Date().getFullYear()} © Viva Republica, Inc.`,
  },
  project: {
    link: 'https://github.com/toss/overlay-kit',
  },
  chat: {
    link: 'https://discord.gg/vGXbVjP2nY',
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
