import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useEffect, type PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { OverlayProvider, overlay, useCurrentOverlay, useOverlayData } from './utils/create-overlay-context';

function wrapper({ children }: PropsWithChildren) {
  return <OverlayProvider>{children}</OverlayProvider>;
}

/**
 *
 * @description Utility functions to perform render and userEvent.setup
 */
function renderWithUser<T extends React.JSX.Element>(component: T, options?: Parameters<typeof render>[1]) {
  const user = userEvent.setup();

  return { ...render(component, { wrapper, ...options }), user };
}

describe('overlay object', () => {
  it('should be able to close an open overlay using overlay.unmount', async () => {
    const overlayDialogContent = 'context-modal-overlay-dialog-content';

    function Component() {
      useEffect(() => {
        overlay.open(({ isOpen, overlayId }) => {
          return isOpen && <button onClick={() => overlay.unmount(overlayId)}>{overlayDialogContent}</button>;
        });
      }, []);

      return <div>Empty</div>;
    }

    const { user } = renderWithUser(<Component />);
    await user.click(await screen.findByRole('button', { name: overlayDialogContent }));

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: overlayDialogContent })).not.toBeInTheDocument();
    });
  });

  it('should be able to open multiple overlays via overlay.open', async () => {
    const testContent1 = 'context-modal-test-content-1';
    const testContent2 = 'context-modal-test-content-2';
    const testContent3 = 'context-modal-test-content-3';
    const testContent4 = 'context-modal-test-content-4';

    function Component() {
      useEffect(() => {
        overlay.open(({ isOpen }) => {
          return isOpen && <p>{testContent1}</p>;
        });
        overlay.open(({ isOpen }) => {
          return isOpen && <p>{testContent2}</p>;
        });
        overlay.open(({ isOpen }) => {
          return isOpen && <p>{testContent3}</p>;
        });
        overlay.open(({ isOpen }) => {
          return isOpen && <p>{testContent4}</p>;
        });
      }, []);

      return <div>Empty</div>;
    }

    render(<Component />, { wrapper });

    await waitFor(() => {
      expect(screen.queryByText(testContent1)).toBeInTheDocument();
      expect(screen.queryByText(testContent2)).toBeInTheDocument();
      expect(screen.queryByText(testContent3)).toBeInTheDocument();
      expect(screen.queryByText(testContent4)).toBeInTheDocument();
    });
  });

  it('The value passed as an argument to close is passed to resolve. overlay.openAsync', async () => {
    const overlayDialogContent = 'context-modal-dialog-content';
    const overlayTriggerContent = 'context-modal-overlay-trigger-content';
    const mockFn = vi.fn();

    function Component() {
      return (
        <button
          onClick={async () => {
            const result = await overlay.openAsync<boolean>(
              ({ isOpen, close }) => isOpen && <button onClick={() => close(true)}>{overlayDialogContent}</button>
            );

            if (result) {
              mockFn(result);
            }
          }}
        >
          {overlayTriggerContent}
        </button>
      );
    }

    const { user } = renderWithUser(<Component />);
    await user.click(await screen.findByRole('button', { name: overlayTriggerContent }));
    await user.click(await screen.findByRole('button', { name: overlayDialogContent }));

    await waitFor(() => {
      expect(mockFn).toHaveBeenCalledWith(true);
    });
  });

  it('should be able to turn off overlay through close overlay.openAsync', async () => {
    const overlayTriggerContent = 'context-modal-test-content';
    const overlayDialogContent = 'context-modal-dialog-content';

    function Component() {
      return (
        <button
          onClick={async () => {
            overlay.openAsync<boolean>(
              ({ isOpen, close }) => isOpen && <button onClick={() => close(true)}>{overlayDialogContent}</button>
            );
          }}
        >
          {overlayTriggerContent}
        </button>
      );
    }

    const { user } = renderWithUser(<Component />, { wrapper });
    await user.click(await screen.findByRole('button', { name: overlayTriggerContent }));
    await user.click(await screen.findByRole('button', { name: overlayDialogContent }));

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: overlayDialogContent })).not.toBeInTheDocument();
    });
  });

  it('should handle current overlay correctly when unmounting overlays in different orders', async () => {
    const contents = {
      first: 'overlay-content-1',
      second: 'overlay-content-2',
      third: 'overlay-content-3',
      fourth: 'overlay-content-4',
    };

    let overlayIds: string[] = [];

    function Component() {
      useEffect(() => {
        // Open 4 overlays sequentially
        overlayIds = [
          overlay.open(({ isOpen }) => isOpen && <div data-testid="overlay-1">{contents.first}</div>),
          overlay.open(({ isOpen }) => isOpen && <div data-testid="overlay-2">{contents.second}</div>),
          overlay.open(({ isOpen }) => isOpen && <div data-testid="overlay-3">{contents.third}</div>),
          overlay.open(({ isOpen }) => isOpen && <div data-testid="overlay-4">{contents.fourth}</div>),
        ];
      }, []);

      return <div>Base Component</div>;
    }

    render(<Component />, { wrapper });

    // Wait for all overlays to be mounted
    await waitFor(() => {
      expect(screen.getByTestId('overlay-1')).toBeInTheDocument();
      expect(screen.getByTestId('overlay-2')).toBeInTheDocument();
      expect(screen.getByTestId('overlay-3')).toBeInTheDocument();
      expect(screen.getByTestId('overlay-4')).toBeInTheDocument();
    });

    // Remove middle overlay (2)
    overlay.unmount(overlayIds[1]);
    await waitFor(() => {
      expect(screen.queryByTestId('overlay-2')).not.toBeInTheDocument();
      expect(screen.getByTestId('overlay-1')).toBeVisible();
      expect(screen.getByTestId('overlay-3')).toBeVisible();
      expect(screen.getByTestId('overlay-4')).toBeVisible();
    });

    // Remove last overlay (4)
    overlay.unmount(overlayIds[3]);
    await waitFor(() => {
      expect(screen.queryByTestId('overlay-2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('overlay-4')).not.toBeInTheDocument();
      expect(screen.getByTestId('overlay-1')).toBeVisible();
      expect(screen.getByTestId('overlay-3')).toBeVisible();
    });

    // Remove overlay 3
    overlay.unmount(overlayIds[2]);
    await waitFor(() => {
      expect(screen.queryByTestId('overlay-2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('overlay-3')).not.toBeInTheDocument();
      expect(screen.queryByTestId('overlay-4')).not.toBeInTheDocument();
      expect(screen.getByTestId('overlay-1')).toBeVisible();
    });

    // Remove overlay 1
    overlay.unmount(overlayIds[0]);
    await waitFor(() => {
      expect(screen.queryByTestId(/^overlay-/)).not.toBeInTheDocument();
    });
  });

  it('should track current overlay state correctly', async () => {
    const overlayIdMap = {
      first: 'overlay-content-1',
      second: 'overlay-content-2',
    };

    function Component() {
      const current = useCurrentOverlay();

      useEffect(() => {
        overlay.open(({ isOpen }) => isOpen && <div data-testid="overlay-1">{overlayIdMap.first}</div>, {
          overlayId: overlayIdMap.first,
        });
      }, []);

      return <div data-testid="current-overlay">{current}</div>;
    }

    render(<Component />, { wrapper });

    // Test 1: Verify state after first overlay is opened
    await waitFor(() => {
      expect(screen.getByTestId('overlay-1')).toBeVisible();
      expect(screen.getByTestId('current-overlay')).toHaveTextContent(overlayIdMap.first);
    });

    // Test 2: Verify state is cleared after closing first overlay
    overlay.close(overlayIdMap.first);
    await waitFor(() => {
      expect(screen.queryByTestId('overlay-1')).not.toBeInTheDocument();
      expect(screen.getByTestId('current-overlay')).toHaveTextContent('');
    });

    // Test 3: Verify state after second overlay is opened
    overlay.open(({ isOpen }) => isOpen && <div data-testid="overlay-2">{overlayIdMap.second}</div>, {
      overlayId: overlayIdMap.second,
    });
    await waitFor(() => {
      expect(screen.getByTestId('overlay-2')).toBeVisible();
      expect(screen.getByTestId('current-overlay')).toHaveTextContent(overlayIdMap.second);
    });

    // Test 4: Verify state is cleared after unmounting second overlay
    overlay.unmount(overlayIdMap.second);
    await waitFor(() => {
      expect(screen.queryByTestId('overlay-2')).not.toBeInTheDocument();
      expect(screen.getByTestId('current-overlay')).toHaveTextContent('');
    });
  });

  it('should be able to close all overlays', async () => {
    const contents = {
      first: 'overlay-content-1',
      second: 'overlay-content-2',
    };

    function Component() {
      const data = useOverlayData();
      const overlays = Object.values(data);
      const hasOpenOverlay = overlays.some((overlay) => overlay.isOpen);

      useEffect(() => {
        // Open 2 overlays sequentially
        overlay.open(({ isOpen }) => isOpen && <div data-testid="overlay-1">{contents.first}</div>);
        overlay.open(({ isOpen }) => isOpen && <div data-testid="overlay-2">{contents.second}</div>);
      }, []);

      return <div>{hasOpenOverlay && 'has Open overlay'}</div>;
    }

    render(<Component />, { wrapper });

    // Wait for all overlays to be mounted
    await waitFor(() => {
      expect(screen.getByTestId('overlay-1')).toBeInTheDocument();
      expect(screen.getByTestId('overlay-2')).toBeInTheDocument();
    });

    // close all overlays
    overlay.closeAll();
    await waitFor(() => {
      expect(screen.queryByTestId(/^overlay-/)).not.toBeInTheDocument();
      expect(screen.queryByText('has Open overlay')).not.toBeInTheDocument();
    });
  });

  it('should not be able to get current overlay when all overlays are closed', async () => {
    const contents = {
      first: 'overlay-content-1',
      second: 'overlay-content-2',
    };

    function Component() {
      const current = useCurrentOverlay();

      useEffect(() => {
        // Open 2 overlays sequentially
        overlay.open(({ isOpen }) => isOpen && <div data-testid="overlay-1">{contents.first}</div>);
        overlay.open(({ isOpen }) => isOpen && <div data-testid="overlay-2">{contents.second}</div>);
      }, []);

      return <div data-testid="current-overlay">{current}</div>;
    }

    render(<Component />, { wrapper });

    // Wait for all overlays to be mounted
    await waitFor(() => {
      expect(screen.getByTestId('overlay-1')).toBeInTheDocument();
      expect(screen.getByTestId('overlay-2')).toBeInTheDocument();
    });

    // close all overlays
    overlay.closeAll();
    await waitFor(() => {
      expect(screen.getByTestId('current-overlay')).toHaveTextContent('');
    });
  });

  it('should be able to unmount all overlays', async () => {
    const contents = {
      first: 'overlay-content-1',
      second: 'overlay-content-2',
    };

    function Component() {
      const data = useOverlayData();
      const overlays = Object.values(data);
      const hasOverlay = overlays.length !== 0;

      useEffect(() => {
        // Open 2 overlays sequentially
        overlay.open(({ isOpen }) => isOpen && <div data-testid="overlay-1">{contents.first}</div>);
        overlay.open(({ isOpen }) => isOpen && <div data-testid="overlay-2">{contents.second}</div>);
      }, []);

      return <div>{hasOverlay && 'has overlay'}</div>;
    }

    render(<Component />, { wrapper });

    // Wait for all overlays to be mounted
    await waitFor(() => {
      expect(screen.getByTestId('overlay-1')).toBeInTheDocument();
      expect(screen.getByTestId('overlay-2')).toBeInTheDocument();
    });

    // Unmount all overlays
    overlay.unmountAll();
    await waitFor(() => {
      expect(screen.queryByTestId(/^overlay-/)).not.toBeInTheDocument();
      expect(screen.queryByText('has overlay')).not.toBeInTheDocument();
    });
  });

  it("Can't create overlay with the same overlayId", async () => {
    const sameOverlayId = 'same-overlay-id';

    function Component() {
      useEffect(() => {
        overlay.open(({ isOpen }) => isOpen && <div data-testid="overlay-1" />, { overlayId: sameOverlayId });
      }, []);

      return <div>Base Component</div>;
    }

    render(<Component />, { wrapper });

    // Wait for overlay to be mounted
    await waitFor(() => {
      expect(screen.getByTestId('overlay-1')).toBeInTheDocument();
    });

    // Using the same overlayId causes an error
    expect(() => {
      act(() => {
        overlay.open(({ isOpen }) => isOpen && <div data-testid="overlay-2" />, { overlayId: sameOverlayId });
      });
    }).toThrowError("You can't open the multiple overlays with the same overlayId. Please set a different id.");
  });

  it('unmount function requires the exact id to be provided', async () => {
    const overlayIdMap = {
      first: 'overlay-content-1',
      second: 'overlay-content-2',
    };

    function Component() {
      useEffect(() => {
        overlay.open(({ isOpen }) => isOpen && <div data-testid="overlay-1">{overlayIdMap.first}</div>, {
          overlayId: overlayIdMap.first,
        });
      }, []);

      return <div>Base Component</div>;
    }

    render(<Component />, { wrapper });

    // Wait for overlay to be mounted
    await waitFor(() => {
      expect(screen.getByTestId('overlay-1')).toBeInTheDocument();
    });

    // Unmount second overlay
    overlay.unmount(overlayIdMap.second);
    await waitFor(() => {
      expect(screen.getByTestId('overlay-1')).toBeInTheDocument();
    });
  });
});

describe('overlay state change events', () => {
  it('should call onStateChange callback when overlay opens', async () => {
    const callback = vi.fn();
    const cleanup = overlay.onStateChange(callback);

    function TestComponent() {
      useEffect(() => {
        overlay.open(({ isOpen }) => isOpen && <div data-testid="test-overlay">Test Overlay</div>);
      }, []);

      return <div>Test</div>;
    }

    render(<TestComponent />, { wrapper: OverlayProvider });

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(callback).toHaveBeenCalledWith(expect.any(String), 'open');

    cleanup();
  });

  it('should call onStateChange callback when overlay closes', async () => {
    const callback = vi.fn();
    let overlayId: string;

    function TestComponent() {
      useEffect(() => {
        overlayId = overlay.open(({ isOpen }) => isOpen && <div data-testid="test-overlay">Test Overlay</div>);

        return overlay.onStateChange(callback);
      }, []);

      return (
        <button data-testid="close-button" onClick={() => overlay.close(overlayId)}>
          Close Overlay
        </button>
      );
    }

    const { user } = { user: userEvent.setup() };
    render(<TestComponent />, { wrapper: OverlayProvider });

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(callback).toHaveBeenCalledWith(expect.any(String), 'open');

    await user.click(screen.getByTestId('close-button'));

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(callback).toHaveBeenCalledWith(expect.any(String), 'close');
  });

  it('should call onStateChange callback when overlay unmounts', async () => {
    const callback = vi.fn();
    let overlayId: string;

    function TestComponent() {
      useEffect(() => {
        overlayId = overlay.open(({ isOpen }) => isOpen && <div data-testid="test-overlay">Test Overlay</div>);

        return overlay.onStateChange(callback);
      }, []);

      return (
        <button data-testid="unmount-button" onClick={() => overlay.unmount(overlayId)}>
          Unmount Overlay
        </button>
      );
    }

    const { user } = { user: userEvent.setup() };
    render(<TestComponent />, { wrapper: OverlayProvider });

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(callback).toHaveBeenCalledWith(expect.any(String), 'open');

    await user.click(screen.getByTestId('unmount-button'));

    expect(callback).toHaveBeenCalledWith(expect.any(String), 'unmount');
  });

  it('should remove callback when cleanup function is called', async () => {
    const callback = vi.fn();
    let overlayId: string;
    let cleanupFn: () => void;

    function TestComponent() {
      useEffect(() => {
        cleanupFn = overlay.onStateChange(callback);

        overlayId = overlay.open(({ isOpen }) => isOpen && <div data-testid="test-overlay">Test Overlay</div>);
      }, []);

      return (
        <>
          <button data-testid="cleanup-button" onClick={() => cleanupFn()}>
            Remove Callback
          </button>
          <button data-testid="close-button" onClick={() => overlay.close(overlayId)}>
            Close Overlay
          </button>
        </>
      );
    }

    const { user } = { user: userEvent.setup() };
    render(<TestComponent />, { wrapper: OverlayProvider });

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(callback).toHaveBeenCalledWith(expect.any(String), 'open');

    callback.mockReset();
    await user.click(screen.getByTestId('cleanup-button'));

    await user.click(screen.getByTestId('close-button'));

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle errors in callbacks gracefully', async () => {
    const originalConsoleError = console.error;
    console.error = vi.fn();

    const errorCallback = vi.fn().mockImplementation(() => {
      throw new Error('Test error');
    });

    const normalCallback = vi.fn();

    function TestComponent() {
      useEffect(() => {
        overlay.onStateChange(errorCallback);
        overlay.onStateChange(normalCallback);
        overlay.open(({ isOpen }) => isOpen && <div data-testid="test-overlay">Test Overlay</div>);
      }, []);

      return <div>Test</div>;
    }

    render(<TestComponent />, { wrapper: OverlayProvider });

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(errorCallback).toHaveBeenCalled();

    expect(normalCallback).toHaveBeenCalled();

    expect(console.error).toHaveBeenCalled();

    console.error = originalConsoleError;
  });
});
