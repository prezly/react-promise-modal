import { render, unmountComponentAtNode } from 'react-dom';

const DEFAULT_DESTRUCTION_DELAY = 300;
const DEFAULT_OPTIONS = {
    destructionDelay: DEFAULT_DESTRUCTION_DELAY,
};

const noop = () => {};

export default async function reactModal(renderModal, options = {}) {
    const { destructionDelay } = { ...DEFAULT_OPTIONS, ...options };
    const container = document.createElement('div');
    document.body.appendChild(container);

    function displayModal({ onSubmit, onDismiss }) {
        render(renderModal({ onSubmit, onDismiss, show: true }), container);
    }

    function hideModal({ onSubmit, onDismiss }, callback) {
        render(renderModal({ onSubmit, onDismiss, show: false }), container, callback);
    }

    function destroyModal() {
        unmountComponentAtNode(container);
        document.body.removeChild(container);
    }

    const confirmation = new Promise((resolve) => {
        const onSubmit = (value = true) => resolve(value);
        const onDismiss = () => resolve(undefined);
        displayModal({ onSubmit, onDismiss });
    });

    try {
        return await confirmation;
    } finally {
        const onSubmit = noop;
        const onDismiss = noop;
        hideModal({ onSubmit, onDismiss }, () => {
            setTimeout(destroyModal, destructionDelay);
        });
    }
}
