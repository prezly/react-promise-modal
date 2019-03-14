import { ReactNode } from 'react';

type OnDismissCallback = () => void;

type OnSubmitCallback<R> = {
    (): void;
    (value: R): void;
}

interface RenderFunctionProps<R> {
    show: boolean;
    onSubmit: OnSubmitCallback<R>;
    onDismiss: OnDismissCallback;
}

type RenderFunction<R> = (props: RenderFunctionProps<R>) => ReactNode;

interface Options {
    destructionDelay?: number;
}

declare function reactModal<R = any>(
    renderModal: RenderFunction<R>,
    options?: Options,
): Promise<R | undefined>;

export = reactModal;
