# React Promise Modal

The easiest way of using modals in React. With Promises.

## Usage

`usePromiseModal()` is a Reac thook that accepts a callback that renders a modal from these three arguments:

- `show` — boolean to tell if the window is visible or not. 
   Used for in/out transitions. 
   Primarily intended to be used as *react-bootstrap* Modal `show` property.

- `onDismiss` — should be invoked when the modal is dismissed.
  Always resolves the promise to `undefined`.

- `onSubmit` — should be invoked when the modal is submitted/confirmed. 
   Resolves to the value provided as an argument to it.
   The resolve value cannot be `undefined`, because it is already reserved for dismissal.

The function returns a *Promise* that is resolved with the submitted value, 
or `undefined` if it has been dismissed.

## Examples

### Confirmation

You can easily implement a confirmation modal using `usePromiseModal()`:

```jsx
import { usePromiseModal } from '@prezly/react-promise-modal';

function MyApp() {
    const confirmation = usePromiseModal(({ show, onSubmit, onDismiss }) => {
        // Use any modal implementation you want
        <ConfirmationModal title="⚠️ Are you sure?" show={show} onConfirm={() => onSubmit(true)} onDismiss={onDismiss} />
    });
    
    async function handleDeleteAccount() {
        if (await confirmation.invoke()) {
            console.log('Conirmed');
        } else {
            console.log('Cancelled');
        }
    }
    
    return (
        <div>
           <button onClick={handleDeleteAccount}>Delete account</button>
           {confirmation.modal}
        </div>
    )
}
```

### Alert

Alert is basically the same as confirmation, except there is no difference whether
it is submitted or dismissed -- the modal has single action anyway. 
So we only need `onDismiss`:

```jsx
import { usePromiseModal } from '@prezly/react-promise-modal';

function MyApp() {
    const alert = usePromiseModal(({ show, onDismiss }) => {
        // Use any modal implementation you want
        <AlertModal title="✔ Account deleted!" show={show} onDismiss={onDismiss} />
    });

    async function handleDeleteAccount() {
        await api.deleteAccount();
        await alert.invoke();
    }

    return (
        <div>
            <button onClick={handleDeleteAccount}>Delete account</button>
            {alert.modal}
        </div>
    )
}

```

### Prompt User Input

For data prompts all you need is to resolve the promise by submitting the value to `onSubmit`:
either a scalar, or more complex shapes wrapped into an object:

```tsx
import { usePromiseModal } from '@prezly/react-promise-modal';

function MyApp() {
    const prompt = usePromiseModal<string, { title: string }>(
        (props) => <FilenamePromptModal {...props} />,
    );

    async function handleCreateFile() {
        const filename = await prompt.invoke({ title: 'Please enter filename:' });
        if (!filename) {
            console.error('Filename is required');
            return;
        }
        await api.createFile(filename);
    }

    return (
        <div>
            <button onClick={handleCreateFile}>Create new file</button>
            {prompt.modal}
        </div>
    )
}

interface Props {
    title: string;
    show: boolean;
    onSubmit: (filename: string) => void;
    onDismiss: () => void;
}

function FilenamePromptModal({ title, show, onSubmit, onDismiss }: Props) {
    const [filename, setFilename] = useState("Untitled.txt");

    return (
        // Use any modal implementation you want
        <Modal>
            <form onSubmit={() => onSubmit(filename)}>
                <p>{title}</p>
                <input autoFocus value={filename} onChange={(event) => setFilename(event.target.value)} />

                <button variant="secondary" onClick={onDismiss}>Cancel</button>
                <button variant="primary" type="submit">Confirm</button>
            </form>
        </Modal>
    );
}
```

## Additional Invoke-time Arguments

In addition to the three standard properties your modal render callback will always receive when rendered,
you can pass your one call-time properties. Declare them with the second generic type parameter of `usePromiseModal()`:

```tsx
import { usePromiseModal } from "@prezly/react-promise-modal";

const failureFeedback = usePromiseModal<undefined, { status: Status, failures: OperationFailure[] }>(
    ({ status, failures, show, onSubmit, onDismiss }) => (
        <FailureModal status={status} failures={failures} show={show} onSubmit={onSubmit} onDismiss={onDismiss} />
    ),
);

// Invocation of the modal now requrires these additional properties:
async function handleFlakyOperation() {
    const { status, failures } = await api.flakyOperation();
    if (status !== 'success') {
        await failureFeedback.invoke({ status, failures }); // Note: here we pass additional parameters call-time
    }
}
```

------------------

Brought to you with :metal: by [Prezly](https://www.prezly.com/?utm_source=github&utm_campaign=react-promise-modal).
