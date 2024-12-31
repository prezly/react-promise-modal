# React Promise Modal

`usePromiseModal()` is a React hook that allows you to define a modal
by providing a custom rendering function.

After defining your modal you can invoke it as a normal function,
and await for the returned promise to get the modal resolution result.

## Usage

1. Define your modal with `usePromiseModal()`
2. Invoke it from your event handler using `invoke()`
3. Wait for the modal to resolve with `await`

```js
// 1) Define your modal
const confirmation = usePromiseModal((props) => <MyModal {...props} />);

// 2) Call it in your event handler
async function handleClick() {
    // 3) Wait for the modal to resolve
    if (await confirmation.invoke()) {
        // TODO: Perform the operation.
    }
}
```

**Demo: https://codesandbox.io/p/sandbox/zen-jennings-4pmm3k**

## API

**The `usePromiseModal()` hook` returns the following values**:

```tsx
const { invoke, modal, isDisplayed } = usePromiseModal(/* ... */);
```

- `invoke` — imperatively invoke the modal, optionally passing additional call-time arguments.
  Returns a promise you can _await_ to get the modal resolution value, when it's available. 
  Or _undefined_ if the modal has been dismissed or cancelled.

- `modal` — the rendered modal markup (`ReactElement | null`). You should always render this
  value into your component subtree.

- `isDisplayed` — a boolean flag indicating if there is currently a pending modal
  for this definition.

**The modal render function receives these properties**:

```tsx
usePromiseModal(({ show, onDismiss, onSubmit }) => (
    <MyModal show={show} onDismiss={onDismiss} onSubmit={onSubmit} />
));
```


- `show` — boolean to tell if the window is visible or not. 
   Used for in/out transitions. 
   Primarily intended to be used as *react-bootstrap* Modal `show` property.

- `onDismiss` — should be invoked when the modal is dismissed.
  Always resolves the promise to `undefined`.

- `onSubmit` — should be invoked when the modal is submitted/confirmed. 
   Resolves to the value provided as an argument to it.
   The resolve value cannot be `undefined`, because it is already reserved for dismissal.


## Examples

### Confirmation

You can easily implement a confirmation modal using `usePromiseModal()`:

```jsx
import { usePromiseModal } from '@prezly/react-promise-modal';

function MyApp() {
    const confirmation = usePromiseModal(({ show, onSubmit, onDismiss }) => {
        // Use any modal implementation you want
        <MyConfirmationModal title="⚠️ Are you sure?" show={show} onConfirm={() => onSubmit(true)} onDismiss={onDismiss} />
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
        <MyAlertModal title="✔ Account deleted!" show={show} onDismiss={onDismiss} />
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
        (props) => <MyFilenamePromptModal {...props} />,
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

function MyFilenamePromptModal({ title, show, onSubmit, onDismiss }: Props) {
    const [filename, setFilename] = useState("Untitled.txt");

    return (
        // Use any modal implementation you want
        <Modal show={show} onHide={onDismiss}>
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

## Additional Invoke-Time Arguments

In addition to the three standard properties your render callback will always receive when rendered,
you can also pass extra call-time properties. Declare them with the second generic type parameter of `usePromiseModal()`,
and then pass to the `invoke()` method:

```tsx
import { usePromiseModal } from "@prezly/react-promise-modal";

const failureFeedback = usePromiseModal<undefined, { status: Status, failures: OperationFailure[] }>(
    ({ status, failures, show, onSubmit, onDismiss }) => (
        <FailureModal status={status} failures={failures} show={show} onSubmit={onSubmit} onDismiss={onDismiss} />
    ),
);

// Invocation of the modal now requires these additional properties:
async function handleFlakyOperation() {
    const { status, failures } = await api.flakyOperation();
    if (status !== 'success') {
        await failureFeedback.invoke({ status, failures }); // Note: here we pass additional parameters call-time
    }
}
```

------------------

# Credits

Brought to you with :metal: by [Prezly](https://www.prezly.com/?utm_source=github&utm_campaign=react-promise-modal).
