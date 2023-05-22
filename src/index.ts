import { render, unmountComponentAtNode } from 'react-dom';
import { ReactElement } from 'react';

type Callback<R> = void extends R ? () => void : (value: R) => void;

interface RenderFunctionProps<R> {
    show: boolean;
    onSubmit: Callback<R>;
    onDismiss: Callback<void>;
}

type ModalCallbacks<T> = Pick<RenderFunctionProps<T>, 'onSubmit' | 'onDismiss'>;

type RenderFunction<T> = (props: RenderFunctionProps<T>) => ReactElement<any>;

interface Options {
    destructionDelay?: number;
}

const DEFAULT_DESTRUCTION_DELAY = 300;

const noop = () => {};

export default function reactModal(
  renderModal: RenderFunction<void>,
  options?: Options,
): Promise<true | undefined>;

export default function reactModal<R>(
  renderModal: RenderFunction<R>,
  options?: Options,
): Promise<R | undefined>

export default function reactModal(
  renderModal: RenderFunction<void> | RenderFunction<unknown>,
  options: Options = {},
): Promise<unknown> {
    const { destructionDelay = DEFAULT_DESTRUCTION_DELAY } = options;
    const container = document.createElement('div');
    document.body.appendChild(container);

    function displayModal({ onSubmit, onDismiss }: ModalCallbacks<unknown>) {
        render(renderModal({ onSubmit, onDismiss, show: true }), container);
    }

    function hideModal({ onSubmit, onDismiss }: ModalCallbacks<unknown>, callback: () => void) {
        render(renderModal({ onSubmit, onDismiss, show: false }), container, callback);
    }

    function destroyModal() {
        unmountComponentAtNode(container);
        document.body.removeChild(container);
    }

    const confirmation = new Promise((resolve) => {
        function onSubmit(value?: any) {
            if (arguments.length === 0) {
                resolve(true);
            } else {
                resolve(value);
            }
        }
        function onDismiss() {
            resolve(undefined);
        }
        displayModal({ onSubmit, onDismiss });
    });

    return confirmation.finally(() => {
        hideModal({ onSubmit: noop, onDismiss: noop }, () => {
            setTimeout(destroyModal, destructionDelay);
        });
    });
}
