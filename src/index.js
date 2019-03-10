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

    function displayModal(props) {
        render(renderModal({ ...props, show: true }), container);
    }

    function hideModal(props, callback) {
        render(renderModal({ ...props, show: false }), container, callback);
    }

    function destroyModal() {
        unmountComponentAtNode(container);
        document.body.removeChild(container);
    }

    const confirmation = new Promise((resolve) => {
        const onConfirm = (value = true) => resolve(value);
        const onCancel = () => resolve(undefined);
        displayModal({ onConfirm, onCancel });
    });

    try {
        return await confirmation;
    } finally {
        const onConfirm = noop;
        const onCancel = noop;
        hideModal({ onConfirm, onCancel }, () => {
            setTimeout(destroyModal, destructionDelay);
        });
    }
}
