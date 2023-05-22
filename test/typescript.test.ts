import reactModal from '../src';
import { createElement, Fragment } from 'react';

(async () => {
  const result: true | undefined = await reactModal(({ onSubmit, onDismiss, show }) => {
    if (Math.random() > 0.5) {
      onSubmit();
    } else {
      onDismiss();
    }

    return createElement(Fragment, {}, [show]);
  });
})();

(async () => {
  const result: boolean | undefined = await reactModal<boolean>(({ onSubmit, onDismiss, show }) => {
    if (Math.random() > 0.5) {
      onSubmit(true);
    } else {
      onDismiss();
    }

    return createElement(Fragment, {}, [show]);
  });
})();