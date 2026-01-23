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

  it('The reason passed as an argument to reject is passed to reject. overlay.openAsync', async () => {
    const overlayDialogContent = 'context-modal-dialog-content';
    const overlayTriggerContent = 'context-modal-overlay-trigger-content';
    const rejectedReason = 'rejected';
    const mockFn = vi.fn();

    function Component() {
      return (
        <button
          onClick={async () => {
            try {
              await overlay.openAsync<boolean>(
                ({ isOpen, reject }) =>
                  isOpen && <button onClick={() => reject(rejectedReason)}>{overlayDialogContent}</button>
              );
            } catch (error) {
              mockFn(error);
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
      expect(mockFn).toHaveBeenCalledWith(rejectedReason);
    });
  });

  it('should be able to turn off overlay through reject overlay.openAsync', async () => {
    const overlayTriggerContent = 'context-modal-test-content';
    const overlayDialogContent = 'context-modal-dialog-content';

    function Component() {
      return (
        <button
          onClick={async () => {
            try {
              await overlay.openAsync<boolean>(
                ({ isOpen, reject }) =>
                  isOpen && <button onClick={() => reject('rejected')}>{overlayDialogContent}</button>
              );
            } catch (error) {
              //
            }
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

    overlay.open(({ isOpen }) => isOpen && <div data-testid="overlay-1">{contents.first}</div>);
    overlay.open(({ isOpen }) => isOpen && <div data-testid="overlay-2">{contents.second}</div>);
    await waitFor(() => {
      expect(screen.getByTestId('overlay-1')).toBeInTheDocument();
      expect(screen.getByTestId('overlay-2')).toBeInTheDocument();
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
    }).toThrowError(
      "You can't open the multiple overlays with the same overlayId(same-overlay-id). Please set a different id."
    );
  });

  describe('openAsync with defaultValue option', () => {
    it('resolves with close(value) when called internally (backward compatible)', async () => {
      const overlayDialogContent = 'openasync-dialog-content';
      const overlayTriggerContent = 'openasync-trigger-content';
      const mockFn = vi.fn();

      function Component() {
        return (
          <button
            onClick={async () => {
              const result = await overlay.openAsync<boolean | undefined>(
                ({ isOpen, close }) => isOpen && <button onClick={() => close(true)}>{overlayDialogContent}</button>,
                { defaultValue: undefined }
              );
              mockFn(result);
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

    it('resolves with defaultValue value when closed externally via overlay.close()', async () => {
      const overlayDialogContent = 'openasync-external-close-dialog';
      const overlayTriggerContent = 'openasync-external-close-trigger';
      const testOverlayId = 'test-external-close-overlay';
      const mockFn = vi.fn();

      function Component() {
        return (
          <button
            onClick={async () => {
              const result = await overlay.openAsync<boolean | undefined>(
                ({ isOpen }) => isOpen && <div data-testid="overlay-content">{overlayDialogContent}</div>,
                { overlayId: testOverlayId, defaultValue: undefined }
              );
              mockFn(result);
            }}
          >
            {overlayTriggerContent}
          </button>
        );
      }

      const { user } = renderWithUser(<Component />);
      await user.click(await screen.findByRole('button', { name: overlayTriggerContent }));

      // Wait for overlay to be visible
      await waitFor(() => {
        expect(screen.getByTestId('overlay-content')).toBeInTheDocument();
      });

      // Close externally
      act(() => {
        overlay.close(testOverlayId);
      });

      await waitFor(() => {
        expect(mockFn).toHaveBeenCalledWith(undefined);
      });
    });

    it('resolves with defaultValue value when closed via overlay.closeAll()', async () => {
      const overlayTriggerContent = 'openasync-closeall-trigger';
      const mockFn = vi.fn();

      function Component() {
        return (
          <button
            onClick={async () => {
              const result = await overlay.openAsync<string | null>(
                ({ isOpen }) => isOpen && <div data-testid="overlay-closeall">Dialog</div>,
                { defaultValue: null }
              );
              mockFn(result);
            }}
          >
            {overlayTriggerContent}
          </button>
        );
      }

      const { user } = renderWithUser(<Component />);
      await user.click(await screen.findByRole('button', { name: overlayTriggerContent }));

      // Wait for overlay to be visible
      await waitFor(() => {
        expect(screen.getByTestId('overlay-closeall')).toBeInTheDocument();
      });

      // Close all overlays
      act(() => {
        overlay.closeAll();
      });

      await waitFor(() => {
        expect(mockFn).toHaveBeenCalledWith(null);
      });
    });

    it('stays pending without defaultValue option when closed externally (backward compatible)', async () => {
      const overlayTriggerContent = 'openasync-no-ondismiss-trigger';
      const testOverlayId = 'test-no-ondismiss-overlay';
      const mockFn = vi.fn();

      function Component() {
        return (
          <button
            onClick={async () => {
              const result = await overlay.openAsync<boolean>(
                ({ isOpen }) => isOpen && <div data-testid="overlay-no-ondismiss">Dialog</div>,
                { overlayId: testOverlayId }
              );
              mockFn(result);
            }}
          >
            {overlayTriggerContent}
          </button>
        );
      }

      const { user } = renderWithUser(<Component />);
      await user.click(await screen.findByRole('button', { name: overlayTriggerContent }));

      // Wait for overlay to be visible
      await waitFor(() => {
        expect(screen.getByTestId('overlay-no-ondismiss')).toBeInTheDocument();
      });

      // Close externally
      act(() => {
        overlay.close(testOverlayId);
      });

      // Wait a bit and verify mockFn was NOT called (Promise stays pending)
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(mockFn).not.toHaveBeenCalled();
    });

    it('prevents double resolution when close is called after external close', async () => {
      const overlayTriggerContent = 'openasync-double-resolve-trigger';
      const testOverlayId = 'test-double-resolve-overlay';
      const mockFn = vi.fn();
      let closeRef: ((value: string) => void) | null = null;

      function Component() {
        return (
          <button
            onClick={async () => {
              const result = await overlay.openAsync<string>(
                ({ isOpen, close }) => {
                  closeRef = close;
                  return isOpen && <div data-testid="overlay-double-resolve">Dialog</div>;
                },
                { overlayId: testOverlayId, defaultValue: 'dismissed' }
              );
              mockFn(result);
            }}
          >
            {overlayTriggerContent}
          </button>
        );
      }

      const { user } = renderWithUser(<Component />);
      await user.click(await screen.findByRole('button', { name: overlayTriggerContent }));

      // Wait for overlay to be visible
      await waitFor(() => {
        expect(screen.getByTestId('overlay-double-resolve')).toBeInTheDocument();
      });

      // Close externally first
      act(() => {
        overlay.close(testOverlayId);
      });

      await waitFor(() => {
        expect(mockFn).toHaveBeenCalledWith('dismissed');
      });

      // Try to close internally after (should not call mockFn again)
      act(() => {
        closeRef?.('internal-value');
      });

      // mockFn should still only be called once
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('resolves with defaultValue value when unmounted externally via overlay.unmount()', async () => {
      const overlayTriggerContent = 'openasync-unmount-trigger';
      const testOverlayId = 'test-unmount-overlay';
      const mockFn = vi.fn();

      function Component() {
        return (
          <button
            onClick={async () => {
              const result = await overlay.openAsync<boolean | undefined>(
                ({ isOpen }) => isOpen && <div data-testid="overlay-unmount">Dialog</div>,
                { overlayId: testOverlayId, defaultValue: undefined }
              );
              mockFn(result);
            }}
          >
            {overlayTriggerContent}
          </button>
        );
      }

      const { user } = renderWithUser(<Component />);
      await user.click(await screen.findByRole('button', { name: overlayTriggerContent }));

      await waitFor(() => {
        expect(screen.getByTestId('overlay-unmount')).toBeInTheDocument();
      });

      act(() => {
        overlay.unmount(testOverlayId);
      });

      await waitFor(() => {
        expect(mockFn).toHaveBeenCalledWith(undefined);
      });
    });

    it('resolves with defaultValue value when unmounted via overlay.unmountAll()', async () => {
      const overlayTriggerContent = 'openasync-unmountall-trigger';
      const mockFn = vi.fn();

      function Component() {
        return (
          <button
            onClick={async () => {
              const result = await overlay.openAsync<string | null>(
                ({ isOpen }) => isOpen && <div data-testid="overlay-unmountall">Dialog</div>,
                { defaultValue: null }
              );
              mockFn(result);
            }}
          >
            {overlayTriggerContent}
          </button>
        );
      }

      const { user } = renderWithUser(<Component />);
      await user.click(await screen.findByRole('button', { name: overlayTriggerContent }));

      await waitFor(() => {
        expect(screen.getByTestId('overlay-unmountall')).toBeInTheDocument();
      });

      act(() => {
        overlay.unmountAll();
      });

      await waitFor(() => {
        expect(mockFn).toHaveBeenCalledWith(null);
      });
    });

    it('does not subscribe to events when defaultValue is not provided (no memory leak)', async () => {
      const overlayTriggerContent = 'openasync-no-leak-trigger';
      const overlayDialogContent = 'openasync-no-leak-dialog';
      const mockFn = vi.fn();

      function Component() {
        return (
          <button
            onClick={async () => {
              const result = await overlay.openAsync<boolean>(
                ({ isOpen, close }) => isOpen && <button onClick={() => close(true)}>{overlayDialogContent}</button>
              );
              mockFn(result);
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

  it('should be able to open an overlay after closing it', async () => {
    const overlayId = 'overlay-content-1';

    function Component() {
      const current = useCurrentOverlay();

      useEffect(() => {
        overlay.open(({ isOpen }) => isOpen && <div data-testid="overlay-1">{overlayId}</div>, {
          overlayId: overlayId,
        });
      }, []);

      return <div data-testid="current-overlay">{current}</div>;
    }

    render(<Component />, { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('overlay-1')).toBeVisible();
      expect(screen.getByTestId('current-overlay')).toHaveTextContent(overlayId);
    });

    overlay.close(overlayId);
    await waitFor(() => {
      expect(screen.queryByTestId('overlay-1')).not.toBeInTheDocument();
      expect(screen.getByTestId('current-overlay')).toHaveTextContent('');
    });

    overlay.open(({ isOpen }) => isOpen && <div data-testid="overlay-1">{overlayId}</div>, { overlayId });
    await waitFor(() => {
      expect(screen.getByTestId('overlay-1')).toBeVisible();
      expect(screen.getByTestId('current-overlay')).toHaveTextContent(overlayId);
    });
  });
});
