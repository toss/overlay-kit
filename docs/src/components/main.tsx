import * as stylex from '@stylexjs/stylex';
import { useRouter } from 'nextra/hooks';
import { Link } from 'nextra-theme-docs';

type MainProps = {
  title: string;
  description: string;
  navButtonText: string;
  items: Array<{ title: string; description: string }>;
};

export function Main({ title, description, navButtonText, items }: MainProps) {
  const router = useRouter();

  return (
    <section {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.mainRoot)}>
        <h1 {...stylex.props(styles.title)}>{title}</h1>
        <h2 {...stylex.props(styles.description)}>{description}</h2>
        <nav {...stylex.props(styles.navigationRoot)}>
          <Link href={`/${router.locale}/docs/guides/introduction`} {...stylex.props(styles.navigation)}>
            {navButtonText}
          </Link>
        </nav>
      </div>
      <section {...stylex.props(styles.cardRoot)}>
        {items.map(({ title, description }) => (
          <article {...stylex.props(styles.card)} key={title}>
            <div {...stylex.props(styles.cardTitle)}>{title}</div>
            <p
              {...stylex.props(styles.cardDescription)}
              dangerouslySetInnerHTML={{ __html: formatCodeBlocks(description) }}
            ></p>
          </article>
        ))}
      </section>
    </section>
  );
}

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 120,
    paddingTop: 98,
  },
  mainRoot: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: 48,
    fontWeight: 600,
  },
  description: {
    fontSize: 28,
    fontWeight: 500,
    whiteSpace: 'pre-line',
  },
  navigationRoot: {
    display: 'flex',
    paddingTop: 64,
    gap: 24,
  },
  navigation: {
    padding: '12px 28px',
    borderRadius: 8,
    backgroundColor: 'rgb(0, 162, 255)',
    fontSize: 16,
    fontWeight: 700,
    textDecoration: 'none',
    color: 'white',
  },
  cardRoot: {
    display: 'flex',
    gap: 32,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 700,
  },
  cardDescription: {
    fontSize: 16,
    fontWeight: 500,
    whiteSpace: 'pre-line',
  },
});

const CodeBlockClassName = 'nextra-code';

const escapeHtml = (text: string) => text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

const backtickToCodeBlock = (text: string) =>
  text.replace(/`([^`]+)`/g, `<code class="${CodeBlockClassName}">$1</code>`);

const formatCodeBlocks = (desc: string) => backtickToCodeBlock(escapeHtml(desc));
