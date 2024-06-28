import { act, render, renderHook, screen } from '@testing-library/react';
import { useEffect, type PropsWithChildren } from 'react';
import { describe, expect, it } from 'vitest';
import { useOverlayContext, useOverlayList } from './context';
import { OverlayProvider } from './provider';

describe('useOverlayContext는', () => {
  it('OverlayProvider의 context 값을 반환해야 한다.', () => {
    const wrapper = ({ children }: PropsWithChildren) => <OverlayProvider>{children}</OverlayProvider>;
    const useOverlayCOntextRenderHook = renderHook(useOverlayContext, { wrapper });
    const { current } = useOverlayCOntextRenderHook.result;

    expect(current.overlayList).toBeDefined();
    expect(current.open).toBeDefined();
    expect(current.close).toBeDefined();
  });

  it('overlay.open을 통해 overlay를 그릴 수 있어야 한다.', () => {
    const wrapper = ({ children }: PropsWithChildren) => <OverlayProvider>{children}</OverlayProvider>;

    const testContent = 'context-modal-test-content';
    const Component = () => {
      const overlay = useOverlayContext();

      useEffect(() => {
        overlay.open({
          overlayId: '1',
          controller: () => {
            return <p>{testContent}</p>;
          },
        });
      }, []);

      return <div>Empty</div>;
    };

    render(<Component />, { wrapper });
    expect(screen.queryByText(testContent)).toBeInTheDocument();
  });

  it('overlay.unmount를 통해 열려있는 overlay를 닫을 수 있어야 한다.', async () => {
    const wrapper = ({ children }: PropsWithChildren) => <OverlayProvider>{children}</OverlayProvider>;

    const testContent = 'context-modal-test-content';
    const Component = () => {
      const overlay = useOverlayContext();

      useEffect(() => {
        overlay.open({
          overlayId: '1',
          controller: ({ overlayId }) => {
            return (
              <p
                onClick={() => {
                  overlay.unmount(overlayId);
                }}
              >
                {testContent}
              </p>
            );
          },
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
      const overlay = useOverlayContext();

      useEffect(() => {
        overlay.open({
          overlayId: '1',
          controller: () => {
            return <p>{testContent1}</p>;
          },
        });
        overlay.open({
          overlayId: '2',
          controller: () => {
            return <p>{testContent2}</p>;
          },
        });
        overlay.open({
          overlayId: '3',
          controller: () => {
            return <p>{testContent3}</p>;
          },
        });
        overlay.open({
          overlayId: '4',
          controller: () => {
            return <p>{testContent4}</p>;
          },
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

  it('overlay.unmountAll 통해 여러 개의 overlay를 닫을 수 있어야 한다', async () => {
    const wrapper = ({ children }: PropsWithChildren) => <OverlayProvider>{children}</OverlayProvider>;

    const testContent1 = 'context-modal-test-content-1';
    const testContent2 = 'context-modal-test-content-2';
    const testContent3 = 'context-modal-test-content-3';
    const testContent4 = 'context-modal-test-content-4';

    const Component = () => {
      const overlay = useOverlayContext();

      useEffect(() => {
        overlay.open({
          overlayId: '1',
          controller: () => {
            return (
              <p
                onClick={() => {
                  overlay.unmountAll();
                }}
              >
                {testContent1}
              </p>
            );
          },
        });
        overlay.open({
          overlayId: '2',
          controller: () => {
            return <p>{testContent2}</p>;
          },
        });
        overlay.open({
          overlayId: '3',
          controller: () => {
            return <p>{testContent3}</p>;
          },
        });
        overlay.open({
          overlayId: '4',
          controller: () => {
            return <p>{testContent4}</p>;
          },
        });
      }, []);

      return <div>Empty</div>;
    };

    const renderComponent = render(<Component />, { wrapper });

    const testContentElement = await renderComponent.findByText(testContent1);
    act(() => {
      testContentElement.click();
    });

    expect(screen.queryByText(testContent1)).not.toBeInTheDocument();
    expect(screen.queryByText(testContent2)).not.toBeInTheDocument();
    expect(screen.queryByText(testContent3)).not.toBeInTheDocument();
    expect(screen.queryByText(testContent4)).not.toBeInTheDocument();
  });

  it('useOverlayList를 통해 overlayList를 확인할 수 있어야 한다', async () => {
    const wrapper = ({ children }: PropsWithChildren) => <OverlayProvider>{children}</OverlayProvider>;
    const testId1 = 'context-modal-test-id-1';
    const testId2 = 'context-modal-test-id-2';
    const testId3 = 'context-modal-test-id-3';
    const testId4 = 'context-modal-test-id-4';

    const Component = () => {
      const overlay = useOverlayContext();
      const overlayList = useOverlayList();

      useEffect(() => {
        overlay.open({
          overlayId: testId1,
          controller: () => {
            return <p>test1</p>;
          },
        });
        overlay.open({
          overlayId: testId2,
          controller: () => {
            return <p>test2</p>;
          },
        });
        overlay.open({
          overlayId: testId3,
          controller: () => {
            return <p>test3</p>;
          },
        });
        overlay.open({
          overlayId: testId4,
          controller: () => {
            return <p>test4</p>;
          },
        });
      }, []);

      return <div data-testid="overlay-list">{JSON.stringify(overlayList)}</div>;
    };

    const renderComponent = render(<Component />, { wrapper });

    const overlayListElement = await renderComponent.findByTestId('overlay-list');
    const overlayList = JSON.parse(overlayListElement.textContent ?? "");
    expect(overlayList).toEqual([testId1, testId2, testId3, testId4]);
  });
});
