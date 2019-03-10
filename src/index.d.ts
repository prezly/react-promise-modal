import { ReactNode } from 'react';

type OnCancelCallback = () => void;

type OnConfirmCallback<R> = {
    (): void;
    (value: R): void;
}

interface RenderFunctionProps<R> {
    show: boolean;
    onConfirm: OnConfirmCallback<R>;
    onCancel: OnCancelCallback;
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
