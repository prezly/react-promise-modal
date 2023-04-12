import {createRoot} from 'react-dom';

const DEFAULT_DESTRUCTION_DELAY = 300;
const DEFAULT_OPTIONS = {
    destructionDelay: DEFAULT_DESTRUCTION_DELAY,
};

const noop = () => {};

export default function reactModal(renderModal, options = {}) {
    const { destructionDelay } = { ...DEFAULT_OPTIONS, ...options };
    const container = document.createElement('div');
    document.body.appendChild(container);

    const root = createRoot(container)

    function displayModal({ onSubmit, onDismiss }) {
        root.render(renderModal({ onSubmit, onDismiss, show: true }));
    }

    function hideModal({ onSubmit, onDismiss }, callback) {
        root.render(renderModal({ onSubmit, onDismiss, show: false }), callback);
    }

    function destroyModal() {
        root.unmount();
        document.body.removeChild(container);
    }

    const confirmation = new Promise((resolve) => {
        const onSubmit = (value = true) => resolve(value);
        const onDismiss = () => resolve(undefined);
        displayModal({ onSubmit, onDismiss });
    });

    return confirmation.finally(() => {
        const onSubmit = noop;
        const onDismiss = noop;
        hideModal({ onSubmit, onDismiss }, () => {
            setTimeout(destroyModal, destructionDelay);
        });
    });
}
