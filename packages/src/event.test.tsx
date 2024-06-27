import { act, render, screen } from '@testing-library/react';
import { useEffect, type PropsWithChildren } from 'react';
import { describe, expect, it } from 'vitest';
import { OverlayProvider } from './context/provider';
import { overlay } from './event';

describe('useOverlayContext는', () => {
  it('overlay.open을 통해 overlay를 그릴 수 있어야 한다.', () => {
    const wrapper = ({ children }: PropsWithChildren) => <OverlayProvider>{children}</OverlayProvider>;

    const testContent = 'context-modal-test-content';
    const Component = () => {
      useEffect(() => {
        overlay.open(() => {
          return <p>{testContent}</p>;
        });
      }, []);

      return <div>Empty</div>;
    };

    render(<Component />, { wrapper });
    expect(screen.queryByText(testContent)).toBeInTheDocument();
  });

  it('overlay.exit를 통해 열려있는 overlay를 닫을 수 있어야 한다.', async () => {
    const wrapper = ({ children }: PropsWithChildren) => <OverlayProvider>{children}</OverlayProvider>;

    const testContent = 'context-modal-test-content';
    const Component = () => {
      useEffect(() => {
        overlay.open(({ overlayId }) => {
          return (
            <p
              onClick={() => {
                overlay.unmount(overlayId);
              }}
            >
              {testContent}
            </p>
          );
        });
      }, []);

      return <div>Empty</div>;
    };

    const renderComponent = render(<Component />, { wrapper });

    const testContentElement = await renderComponent.findByText(testContent);
    act(() => {
      testContentElement.click();
    });

    expect(screen.queryByText(testContent)).not.toBeInTheDocument();
  });

  it('overlay.open을 통해 여러 개의 overlay를 열 수 있어야 한다', async () => {
    const wrapper = ({ children }: PropsWithChildren) => <OverlayProvider>{children}</OverlayProvider>;

    const testContent1 = 'context-modal-test-content-1';
    const testContent2 = 'context-modal-test-content-2';
    const testContent3 = 'context-modal-test-content-3';
    const testContent4 = 'context-modal-test-content-4';

    const Component = () => {
      useEffect(() => {
        overlay.open(() => {
          return <p>{testContent1}</p>;
        });
        overlay.open(() => {
          return <p>{testContent2}</p>;
        });
        overlay.open(() => {
          return <p>{testContent3}</p>;
        });
        overlay.open(() => {
          return <p>{testContent4}</p>;
        });
      }, []);

      return <div>Empty</div>;
    };

    render(<Component />, { wrapper });
    expect(screen.queryByText(testContent1)).toBeInTheDocument();
    expect(screen.queryByText(testContent2)).toBeInTheDocument();
    expect(screen.queryByText(testContent3)).toBeInTheDocument();
    expect(screen.queryByText(testContent4)).toBeInTheDocument();
  });
});
