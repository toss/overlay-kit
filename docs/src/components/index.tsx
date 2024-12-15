import * as stylex from '@stylexjs/stylex';

export function Component() {
  return <div {...stylex.props(style.aa)}>Hello World</div>;
}

const style = stylex.create({
  aa: {
    color: 'red',
  },
});
