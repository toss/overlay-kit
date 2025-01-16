import { SandpackCodeEditor, SandpackLayout, SandpackPreview } from '@codesandbox/sandpack-react';
import stylex from '@stylexjs/stylex';
import { type ComponentProps, useEffect, useRef, useState } from 'react';
import type { Sandpack } from '.';

export const CustomPreset = (
  props: Pick<ComponentProps<typeof Sandpack>, 'layoutOptions' | 'editorOptions' | 'previewOptions'>
) => {
  const [horizontalSize, setHorizontalSize] = useState(50);
  const dragEventTargetRef = useRef<(EventTarget & HTMLDivElement) | null>(null);

  useEffect(() => {
    document.body.addEventListener('mousemove', onDragMove);
    document.body.addEventListener('mouseup', stopDragging);

    return () => {
      document.body.removeEventListener('mousemove', onDragMove);
      document.body.removeEventListener('mouseup', stopDragging);
    };

    function onDragMove(event: MouseEvent) {
      if (!dragEventTargetRef.current) return;

      const container = dragEventTargetRef.current.parentElement;

      if (!container) return;

      const direction = dragEventTargetRef.current.dataset.direction as 'horizontal' | 'vertical';
      const isHorizontal = direction === 'horizontal';

      const { left, top, height, width } = container.getBoundingClientRect();
      const offset = isHorizontal ? ((event.clientX - left) / width) * 100 : ((event.clientY - top) / height) * 100;
      const boundaries = Math.min(Math.max(offset, 25), 75);

      setHorizontalSize(boundaries);
      container.querySelectorAll<HTMLElement>(`.sp-stack`).forEach((item) => {
        item.style.pointerEvents = 'none';
      });
    }

    function stopDragging() {
      const container = dragEventTargetRef.current?.parentElement;

      if (!container) return;

      container.querySelectorAll<HTMLElement>(`.sp-stack`).forEach((item) => {
        item.style.pointerEvents = '';
      });

      dragEventTargetRef.current = null;
    }
  }, []);

  return (
    <SandpackLayout {...props.layoutOptions}>
      <SandpackCodeEditor
        showLineNumbers
        showInlineErrors
        showTabs
        showRunButton={false}
        style={{
          flexGrow: horizontalSize,
          flexShrink: horizontalSize,
        }}
        {...stylex.props(styles.codeEditor)}
        {...props.editorOptions}
      />
      <div
        data-direction="horizontal"
        onMouseDown={(event) => {
          dragEventTargetRef.current = event.currentTarget;
        }}
        style={{
          left: `calc(${horizontalSize}% - 5px)`,
        }}
        {...stylex.props(styles.resizeHandler)}
      />
      <SandpackPreview
        style={{
          flexGrow: 100 - horizontalSize,
          flexShrink: 100 - horizontalSize,
          width: `${100 - horizontalSize}%`,
        }}
        {...stylex.props(styles.preview)}
        {...props.previewOptions}
      />
    </SandpackLayout>
  );
};

const styles = stylex.create({
  codeEditor: {
    flexBasis: 0,
    overflow: 'hidden',
    height: 400,
  },
  resizeHandler: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 10,
    cursor: 'ew-resize',
  },
  preview: {
    flexBasis: 0,
    height: 400,
  },
});
