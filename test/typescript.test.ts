import reactModal from '../dist';
import { createElement } from 'react';

(async () => {
  const result: true | undefined = await reactModal(({ onSubmit, onDismiss, show }) => {
    if (Math.random() > 0.5) {
      onSubmit();
    } else {
      onDismiss();
    }

    return createElement('div', {}, [show]);
  });
})();

(async () => {
  const result: boolean | undefined = await reactModal<boolean>(({ onSubmit, onDismiss, show }) => {
    if (Math.random() > 0.5) {
      onSubmit(true);
    } else {
      onDismiss();
    }

    return createElement('div', {}, [show]);
  });
})();