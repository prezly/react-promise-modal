# React Promise Modal

The easies way of using modals in React. With Promises.

## Usage

`reactModal()` function accepts a render callback that renders a modal from given three arguments:

- `show` — boolean to tell if the window is visible or not. 
   Used for in/out transitions. 
   Primarily intended to be used as *react-bootstrap* Modal `show` property.

- `onDismiss` — should be invoked when a modal is dismissed. 
   Always resolves the promise to `undefined`.
   
- `onSubmit` — should be invoked when a modal is submitted/confirmed. 
   Resolves to `true` if no arguments given.
   But you can pass any value as argument to defined resolve value.
   For obvious reason this value cannot be `undefined`.   

The function returns a *Promise* that is resolved with an `undefined` if the modal was dismissed 
or `true` (or any value you provide) when it's submitted.

```jsx
import reactModal from '@prezly/react-promise-modal';

const result = await reactModal<string>(({ show, onSubmit, onDismiss }) => (
    // Use any modal implementation
    <Modal show={show} onHide={onDismiss}>
       OK?
       <button onClick={onDismiss}>Cancel</Button>
       <button onClick={() => onSubmit('OK Clicked')}>OK</Button>
    </Modal>
));

if (result === undefined) {    
    console.log('The modal was dismissed or cancelled');
} else {
    console.log(result); // outputs "OK Clicked"
}

```

### Confirmation

You can easily implement a confirmation modal using `reactModal()`:

```jsx
import reactModal from '@prezly/react-promise-modal';
import { Modal } from 'react-bootstrap'; 

const isConfirmed = await reactModal(({ show, onSubmit, onDismiss }) => (
    // Use any modal window implementation you need.
    // We're using React Bootstrap Modal for demo purposes here
     
    <Modal.Dialog show={show} onHide={onDismiss}>
      <Modal.Body>
        Confirm you really want to star this repository.
      </Modal.Body>
    
      <Modal.Footer>
        <Button variant="secondary" onClick={onDismiss}>Cancel</Button>
        <Button variant="primary" onClick={onSubmit}>Confirm</Button>
      </Modal.Footer>
    </Modal.Dialog>
));
```

### Alert

```jsx
import reactModal from '@prezly/react-promise-modal';
import { Modal } from 'react-bootstrap'; 

await reactModal(({ show, onDismiss }) => (
    // Use any modal window implementation you need.
    // We're using React Bootstrap Modal for demo purposes here
     
    <Modal.Dialog show={show} onHide={onDismiss}>
        <Modal.Header>
            Error
        </Modal.Header>
      
        <Modal.Body>
            An error occured. Can&lsquo;t fix it.
        </Modal.Body>
    
        <Modal.Footer>
           <Button variant="primary" onClick={onDismiss}>OK</Button>
        </Modal.Footer>
    </Modal.Dialog>
));
```

### Prompt user input

```jsx
import reactModal from '@prezly/react-promise-modal';
import { Modal } from 'react-bootstrap';

type Props = {
   show: boolean;
   onSubmit: (filename: string) => void;
   onDismiss: () => void;
}

function FilenamePromptModal({ show, onSubmit, onDismiss }: Props) {
   const [filename, setFilename] = useState('Untitled.txt');
        
   return (
      <Modal.Dialog show={show} onHide={onDismiss}>
          <form onSubmit={() => onSubmit(filename)}>
              <Modal.Body>
                  <p>Please enter filename:</p>
                  <input autoFocus value={filename} onChange={(event) => setFilename(event.target.value)} />
              </Modal.Body>
            
              <Modal.Footer>
                  <Button variant="secondary" onClick={onDismiss}>Cancel</Button>
                  <Button variant="primary" type="submit">Confirm</Button>
              </Modal.Footer>
          </form>
      </Modal.Dialog>        
   );
}

const filename = await reactModal<string>(({ show, onSubmit, onDismiss }) => (
    // Use any modal window implementation you need.
    // We're using React Bootstrap Modal for demo purposes here
    <FilenamePromptModal show={show} onSubmit={onSubmit} onDismiss={onDismiss} />
));
```

------------------

Brought to you with :metal: by [Prezly](https://www.prezly.com/?utm_source=github&utm_campaign=react-promise-modal).
