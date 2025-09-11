import {
  type CodeEditorProps,
  type PreviewProps,
  type SandpackLayoutProps,
  SandpackProvider,
  type SandpackProviderProps,
} from '@codesandbox/sandpack-react';
import { baseTemplate } from './base-template';
import { CustomPreset } from './custom-preset';

interface SandpackProps extends Omit<SandpackProviderProps, 'template' | 'customSetup' | 'options'> {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  providerOptions?: SandpackProviderProps;
  layoutOptions?: SandpackLayoutProps;
  editorOptions?: CodeEditorProps;
  previewOptions?: PreviewProps & {
    showConsole?: boolean;
    showConsoleButton?: boolean;
    layout?: 'preview' | 'tests' | 'console';
  };
}

export const Sandpack = (props: SandpackProps) => {
  return (
    <SandpackProvider
      template="react-ts"
      theme="auto"
      {...props}
      files={{
        ...baseTemplate.files,
        ...(props.files || {}),
      }}
      customSetup={{
        dependencies: {
          ...baseTemplate.dependencies,
          ...props.dependencies,
        },
        devDependencies: {
          ...baseTemplate.devDependencies,
          ...props.devDependencies,
        },
      }}
      options={{
        initMode: 'user-visible',
        initModeObserverOptions: { rootMargin: '1400px 0px' },
        ...props.providerOptions,
      }}
    >
      <CustomPreset
        layoutOptions={props.layoutOptions}
        editorOptions={props.editorOptions}
        previewOptions={{
          ...props.previewOptions,
          showNavigator: true,
        }}
      />
    </SandpackProvider>
  );
};
