import { render, screen, waitFor } from '@testing-library/react';
import { act, useEffect, type PropsWithChildren } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OverlayProvider } from './context/provider';
import { overlay } from './event';

afterEach(() => {
  overlay.unmountAll();
});

describe('overlay object', () => {
  it('should be able to close an open overlay using overlay.unmount', async () => {
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

  it('should be able to open multiple overlays via overlay.open', async () => {
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

  it('The value passed as an argument to close is passed to resolve. overlay.openAsync', async () => {
    const wrapper = ({ children }: PropsWithChildren) => <OverlayProvider>{children}</OverlayProvider>;
    const testContent = 'context-modal-test-content';
    const dialogContent = 'context-modal-dialog-content';
    const mockFn = vi.fn();
    const Component = () => {
      const handleClick = async () => {
        const result = await overlay.openAsync<boolean>(({ close }) => (
          <button onClick={() => close(true)}>{dialogContent}</button>
        ));

        if (result) {
          mockFn(result);
        }
      };

      return <button onClick={handleClick}>{testContent}</button>;
    };

    const renderComponent = render(<Component />, { wrapper });
    const testContentElement = await renderComponent.findByText(testContent);

    act(() => {
      testContentElement.click();
    });

    const dialogContentElement = await renderComponent.findByText(dialogContent);

    act(() => {
      dialogContentElement.click();
    });
    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledWith(true);
    });
  });

  it('should be able to turn off overlay through close overlay.openAsync', async () => {
    const wrapper = ({ children }: PropsWithChildren) => <OverlayProvider>{children}</OverlayProvider>;
    const testContent = 'context-modal-test-content';
    const dialogContent = 'context-modal-dialog-content';

    const Component = () => {
      const handleClick = async () => {
        overlay.openAsync<boolean>(({ isOpen, close }) =>
          isOpen ? <button onClick={() => close(true)}>{dialogContent}</button> : null
        );
      };
      return <button onClick={handleClick}>{testContent}</button>;
    };

    const renderComponent = render(<Component />, { wrapper });
    const testContentElement = await renderComponent.findByText(testContent);

    act(() => {
      testContentElement.click();
    });

    const dialogContentElement = await renderComponent.findByText(dialogContent);

    act(() => {
      dialogContentElement.click();
    });

    await waitFor(() => {
      expect(dialogContentElement).not.toBeInTheDocument();
    });
  });
});
