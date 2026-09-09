import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { StrictMode, useState } from 'react';
import { describe, expect, it } from 'vitest';
import {
  type OverlayAsyncControllerProps,
  type OverlayControllerProps,
} from './context/provider/content-overlay-controller';
import { experimental_createOverlayContext } from './utils/create-overlay-context';

describe('reopening an overlay', () => {
  it('preserves the synchronous controller props when choosing which controls to render', async () => {
    const { overlay, OverlayProvider } = experimental_createOverlayContext();
    const user = userEvent.setup();

    function Controller(props: OverlayControllerProps) {
      return (
        props.isOpen && (
          <button onClick={() => props.close()}>{'reject' in props ? 'Async controls' : 'Sync controls'}</button>
        )
      );
    }

    render(<OverlayProvider />);
    act(() => overlay.open(Controller));
    await user.click(await screen.findByRole('button', { name: 'Sync controls' }));
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it.each(['close', 'reject'] as const)(
    'settles each openAsync call through %s while preserving state',
    async (method) => {
      const { overlay, OverlayProvider } = experimental_createOverlayContext();
      const user = userEvent.setup();
      const results: unknown[] = [];

      function Controller({ isOpen, close, reject }: OverlayAsyncControllerProps<string>) {
        const [value, setValue] = useState('first');

        return (
          isOpen && (
            <>
              <input aria-label="value" value={value} onChange={(event) => setValue(event.target.value)} />
              <button onClick={() => ({ close, reject })[method](value)}>Finish</button>
            </>
          )
        );
      }

      render(
        <StrictMode>
          <OverlayProvider />
        </StrictMode>
      );

      const open = () => {
        act(() => {
          overlay.openAsync(Controller, { overlayId: 'reused' }).then(
            (value) => results.push({ status: 'resolved', value }),
            (reason) => results.push({ status: 'rejected', reason })
          );
        });
      };

      open();
      await user.click(await screen.findByRole('button', { name: 'Finish' }));
      expect(results).toEqual([
        method === 'close' ? { status: 'resolved', value: 'first' } : { status: 'rejected', reason: 'first' },
      ]);

      open();
      const input = await screen.findByRole('textbox', { name: 'value' });
      await user.clear(input);
      await user.type(input, 'second');
      await user.click(screen.getByRole('button', { name: 'Finish' }));

      await waitFor(() => {
        expect(results).toEqual(
          method === 'close'
            ? [
                { status: 'resolved', value: 'first' },
                { status: 'resolved', value: 'second' },
              ]
            : [
                { status: 'rejected', reason: 'first' },
                { status: 'rejected', reason: 'second' },
              ]
        );
      });

      open();
      expect(await screen.findByRole('textbox', { name: 'value' })).toHaveValue('second');
      await user.click(screen.getByRole('button', { name: 'Finish' }));
      expect(results).toHaveLength(3);
    }
  );

  it.each(['close', 'reject'] as const)(
    'does not let a previous %s callback close the next invocation',
    async (method) => {
      const { overlay, OverlayProvider } = experimental_createOverlayContext();
      const user = userEvent.setup();
      const results: string[] = [];
      let previousFinish: (value: string) => void;

      function Controller({ isOpen, close, reject }: OverlayAsyncControllerProps<string>) {
        return (
          isOpen && (
            <button
              onClick={() => {
                previousFinish = { close, reject }[method];
                close('finished');
              }}
            >
              Finish
            </button>
          )
        );
      }

      render(<OverlayProvider />);
      act(() => {
        overlay.openAsync(Controller, { overlayId: 'reused' }).then((value) => results.push(value));
      });
      await user.click(await screen.findByRole('button', { name: 'Finish' }));
      act(() => {
        overlay.openAsync(Controller, { overlayId: 'reused' }).then((value) => results.push(value));
      });
      await screen.findByRole('button', { name: 'Finish' });

      act(() => previousFinish('stale'));

      expect(screen.getByRole('button', { name: 'Finish' })).toBeVisible();
      expect(results).toEqual(['finished']);
      await user.click(screen.getByRole('button', { name: 'Finish' }));
      await waitFor(() => expect(results).toEqual(['finished', 'finished']));
    }
  );

  it('retains the original controller when a different controller reopens the same ID', async () => {
    const { overlay, OverlayProvider } = experimental_createOverlayContext();
    const user = userEvent.setup();
    const results: string[] = [];

    render(<OverlayProvider />);
    act(() => {
      overlay
        .openAsync<string>(
          ({ isOpen, close }) => isOpen && <button onClick={() => close('original')}>Original</button>,
          {
            overlayId: 'reused',
          }
        )
        .then((value) => results.push(value));
    });
    await user.click(await screen.findByRole('button', { name: 'Original' }));
    act(() => {
      overlay
        .openAsync<string>(() => <button>Replacement</button>, { overlayId: 'reused' })
        .then((value) => results.push(value));
    });

    expect(screen.queryByRole('button', { name: 'Replacement' })).not.toBeInTheDocument();
    await user.click(await screen.findByRole('button', { name: 'Original' }));
    await waitFor(() => expect(results).toEqual(['original', 'original']));
  });

  it('settles openAsync after reopening an overlay first opened with open', async () => {
    const { overlay, OverlayProvider } = experimental_createOverlayContext();
    const user = userEvent.setup();
    const results: void[] = [];

    render(<OverlayProvider />);
    act(() => {
      overlay.open(
        (props) =>
          props.isOpen && (
            <button onClick={() => props.close()}>{'reject' in props ? 'Async controls' : 'Finish'}</button>
          ),
        { overlayId: 'reused' }
      );
    });
    await user.click(await screen.findByRole('button', { name: 'Finish' }));
    act(() => {
      overlay.openAsync<void>(() => null, { overlayId: 'reused' }).then((value) => results.push(value));
    });
    await user.click(await screen.findByRole('button', { name: 'Finish' }));
    await waitFor(() => expect(results).toEqual([undefined]));
  });

  it.each(['close', 'reject'] as const)(
    'keeps an open call using %s between openAsync calls independent of their results',
    async (method) => {
      const { overlay, OverlayProvider } = experimental_createOverlayContext();
      const user = userEvent.setup();
      const results: string[] = [];

      function Controller({ isOpen, close, reject }: OverlayAsyncControllerProps<string>) {
        return isOpen && <button onClick={() => ({ close, reject })[method]('finished')}>Finish</button>;
      }

      render(<OverlayProvider />);
      act(() => {
        overlay.openAsync(Controller, { overlayId: 'reused' }).then(
          (value) => results.push(`resolved:${value}`),
          (reason) => results.push(`rejected:${reason}`)
        );
      });
      await screen.findByRole('button', { name: 'Finish' });
      act(() => overlay.close('reused'));
      act(() => overlay.open(() => null, { overlayId: 'reused' }));
      await user.click(await screen.findByRole('button', { name: 'Finish' }));

      expect(results).toEqual([]);
      expect(screen.queryByRole('button', { name: 'Finish' })).not.toBeInTheDocument();

      act(() => {
        overlay.openAsync(Controller, { overlayId: 'reused' }).then(
          (value) => results.push(`resolved:${value}`),
          (reason) => results.push(`rejected:${reason}`)
        );
      });
      await user.click(await screen.findByRole('button', { name: 'Finish' }));
      await waitFor(() => expect(results).toEqual([method === 'close' ? 'resolved:finished' : 'rejected:finished']));
    }
  );

  it('resets state and settles a new invocation after unmount', async () => {
    const { overlay, OverlayProvider } = experimental_createOverlayContext();
    const user = userEvent.setup();
    const results: string[] = [];

    function Controller({ isOpen, close }: OverlayAsyncControllerProps<string>) {
      const [value, setValue] = useState('initial');

      return (
        isOpen && (
          <>
            <input aria-label="value" value={value} onChange={(event) => setValue(event.target.value)} />
            <button onClick={() => close(value)}>Finish</button>
          </>
        )
      );
    }

    const open = () => {
      act(() => {
        overlay.openAsync(Controller, { overlayId: 'reused' }).then((value) => results.push(value));
      });
    };

    render(<OverlayProvider />);
    open();
    const input = await screen.findByRole('textbox', { name: 'value' });
    await user.clear(input);
    await user.type(input, 'changed');
    await user.click(screen.getByRole('button', { name: 'Finish' }));
    act(() => overlay.unmount('reused'));

    open();
    expect(await screen.findByRole('textbox', { name: 'value' })).toHaveValue('initial');
    await user.click(screen.getByRole('button', { name: 'Finish' }));
    await waitFor(() => expect(results).toEqual(['changed', 'initial']));
  });

  it('keeps results separate for different IDs and contexts using the same controller', async () => {
    const first = experimental_createOverlayContext();
    const second = experimental_createOverlayContext();
    const user = userEvent.setup();
    const results: string[] = [];

    function Controller({ isOpen, overlayId, close }: OverlayAsyncControllerProps<string>) {
      return isOpen && <button onClick={() => close(overlayId)}>{overlayId}</button>;
    }

    const firstView = render(<first.OverlayProvider />);
    const secondView = render(<second.OverlayProvider />);
    const open = () => {
      act(() => {
        first.overlay.openAsync(Controller, { overlayId: 'shared' }).then((value) => results.push(`first:${value}`));
        first.overlay.openAsync(Controller, { overlayId: 'other' }).then((value) => results.push(`first:${value}`));
        second.overlay.openAsync(Controller, { overlayId: 'shared' }).then((value) => results.push(`second:${value}`));
      });
    };

    open();
    await user.click(await within(firstView.container).findByRole('button', { name: 'shared' }));
    await user.click(await within(secondView.container).findByRole('button', { name: 'shared' }));
    await user.click(await within(firstView.container).findByRole('button', { name: 'other' }));
    expect(results).toEqual(['first:shared', 'second:shared', 'first:other']);

    open();
    await user.click(await within(secondView.container).findByRole('button', { name: 'shared' }));
    await waitFor(() => expect(results).toEqual(['first:shared', 'second:shared', 'first:other', 'second:shared']));
    expect(within(firstView.container).getByRole('button', { name: 'shared' })).toBeVisible();
    expect(within(firstView.container).getByRole('button', { name: 'other' })).toBeVisible();
    await user.click(within(firstView.container).getByRole('button', { name: 'other' }));
    await user.click(within(firstView.container).getByRole('button', { name: 'shared' }));
    await waitFor(() =>
      expect(results).toEqual([
        'first:shared',
        'second:shared',
        'first:other',
        'second:shared',
        'first:other',
        'first:shared',
      ])
    );
  });
});
