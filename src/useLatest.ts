import * as React from 'react';

/**
 * @see https://streamich.github.io/react-use/?path=/story/state-uselatest--docs
 *
 * React state hook that returns the latest state as described in the React hooks FAQ.
 * @see https://reactjs.org/docs/hooks-faq.html#why-am-i-seeing-stale-props-or-state-inside-my-function
 *
 * This is mostly useful to get access to the latest value of some props
 * or state inside an asynchronous callback, instead of that value
 * at the time the callback was created from.
 */
export function useLatest<T>(value: T): { readonly current: T } {
    const ref = React.useRef<T>(value);
    ref.current = value;
    return ref;
}