import * as React from 'react';

import { createDeferred, Deferred } from './deferred';
import { generateId, isEvent, isSyntheticEvent } from './lib';
import { ModalTransitions, type Milliseconds } from './ModalTransitions';
import { useIsMounted } from './useIsMounted';
import { useLatest } from './useLatest';

const DEFAULT_CONCURRENCY_MODE: ConcurrencyMode = 'replace';
const DEFAULT_TRANSITION_DURATION: Milliseconds = 300;

interface Options {
    concurrencyMode?: ConcurrencyMode;
    transitionDuration?: Milliseconds;
}

type ConcurrencyMode = 'stack' | 'replace' | 'ignore';
type RenderFunction<P> = (props: P) => React.ReactElement | null | undefined;

interface RenderProps<T> {
    show: boolean;
    stage: 'open' | 'opening' | 'closing';
    onDismiss: () => void;
    onSubmit: (value: Exclude<T, undefined>) => void;
}

type Invocation<T, Args> = {
    id: string;
    args: Args;
    deferred: Deferred<T | undefined>;
};

export function usePromiseModal<T>(
    render: RenderFunction<RenderProps<T>>,
    options?: Options,
): {
    modal: React.ReactElement;
    invoke: () => Promise<T | undefined>;
    isDisplayed: boolean;
};

export function usePromiseModal<T, Args>(
    render: RenderFunction<RenderProps<T> & Omit<Args, keyof RenderProps<T>>>,
    options?: Options,
): {
    modal: React.ReactElement;
    invoke: (args: Args) => Promise<T | undefined>;
    isDisplayed: boolean;
};

export function usePromiseModal<T, Args extends object>(
    render: RenderFunction<RenderProps<T> & Omit<Args, keyof RenderProps<T>>>,
    {
        concurrencyMode = DEFAULT_CONCURRENCY_MODE,
        transitionDuration = DEFAULT_TRANSITION_DURATION,
    }: Options = {},
) {
    const isMounted = useIsMounted();
    const [invoked, setInvoked] = React.useState<Invocation<T, Args>[]>([]);
    const refs = useLatest({ invoked });
    const isDisplayed = invoked.length > 0;

    const modal = (
        <>
            {invoked.map((invocation, index) => {
                const { id, args, deferred } = invocation;
                return (
                    <ModalTransitions
                        key={`react-promise-modal-${id}`}
                        /* only show the latest invoked modal */
                        isOpen={index === invoked.length - 1}
                        onClosed={() => {
                            if (isMounted()) {
                                // Remove the invocation when the modal is closed
                                setInvoked(
                                    (prev) => prev.filter((x) => x.id !== invocation.id),
                                );
                            }
                        }}
                        transitionDuration={transitionDuration}
                        render={({ isOpen, stage, onClose }) =>
                            render({
                                ...args,
                                stage,
                                show: isOpen,
                                onDismiss: () => {
                                    deferred.resolve(undefined);
                                    onClose();
                                },
                                onSubmit: (value) => {
                                    deferred.resolve(value);
                                    onClose();
                                },
                            }) ?? null
                        }
                    />
                );
            })}
        </>
    );

    const invoke = React.useCallback(
        async (incomingArgs: Args) => {
            const id = generateId();
            const deferred = createDeferred<T | undefined>();
            const args =
                // Note: Do not spread the incoming args object, if it's a DOM Event or a React SyntheticEvent,
                //       which is a super common scenario. Modal `invoke()` functions are passed to onClick handlers all the time.
                //       Also, an event should never be used as a props object to spread anyway.
                //       @see https://github.com/prezly/prezly/pull/12020#discussion_r1101325932
                isEvent(incomingArgs) || isSyntheticEvent(incomingArgs)
                    ? ({} as Args)
                    : incomingArgs;

            const invocation = { id, args, deferred };

            switch (concurrencyMode) {
                case 'ignore':
                    setInvoked((prev) => {
                        if (prev.length > 0) {
                            // auto-dismiss the current call
                            deferred.resolve(undefined);
                            return prev;
                        }
                        return [invocation];
                    });
                    break;
                case 'stack':
                    setInvoked((prev) => [...prev, invocation]);
                    break;
                case 'replace':
                default:
                    setInvoked((prev) => {
                        // auto-dismiss all previous calls
                        prev.forEach(({ deferred }) => deferred.resolve(undefined));
                        return [invocation];
                    });
                    break;
            }

            return deferred.promise;
        },
        [concurrencyMode],
    );

    React.useEffect(() => {
        // Auto-dismiss all open modals on unmount
        return () => {
            refs.current.invoked.forEach(({ deferred }) => {
                if (!deferred.isSettled()) {
                    deferred.resolve(undefined);
                }
            });
        };
    }, []);

    return { modal, invoke, isDisplayed };
}