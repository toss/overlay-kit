import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useEffect, type PropsWithChildren } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { OverlayProvider, overlay } from './utils/create-overlay-context';

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
        overlay.open(({ overlayId }) => {
          return (
            <button
              onClick={() => {
                overlay.unmount(overlayId);
              }}
            >
              {overlayDialogContent}
            </button>
          );
        });
      }, []);

      return <div>Empty</div>;
    }

    const { user } = renderWithUser(<Component />);

    await user.click(await screen.findByRole('button', { name: overlayDialogContent }));

    expect(screen.queryByRole('button', { name: overlayDialogContent })).not.toBeInTheDocument();
  });

  it('should be able to open multiple overlays via overlay.open', async () => {
    const testContent1 = 'context-modal-test-content-1';
    const testContent2 = 'context-modal-test-content-2';
    const testContent3 = 'context-modal-test-content-3';
    const testContent4 = 'context-modal-test-content-4';

    function Component() {
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
    }

    render(<Component />, { wrapper });
    expect(screen.queryByText(testContent1)).toBeInTheDocument();
    expect(screen.queryByText(testContent2)).toBeInTheDocument();
    expect(screen.queryByText(testContent3)).toBeInTheDocument();
    expect(screen.queryByText(testContent4)).toBeInTheDocument();
  });

  it('The value passed as an argument to close is passed to resolve. overlay.openAsync', async () => {
    const overlayDialogContent = 'context-modal-dialog-content';
    const overlayTriggerContent = 'context-modal-overlay-trigger-content';
    const mockFn = vi.fn();

    function Component() {
      return (
        <button
          onClick={async () => {
            const result = await overlay.openAsync<boolean>(({ close }) => (
              <button onClick={() => close(true)}>{overlayDialogContent}</button>
            ));

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
            overlay.openAsync<boolean>(({ isOpen, close }) =>
              isOpen ? <button onClick={() => close(true)}>{overlayDialogContent}</button> : null
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
});
