import { noop} from './lib';

/**
 * This kinda follows the Jquery.Deferred type idea.
 * @see https://api.jquery.com/jQuery.Deferred/
 *
 * Deferred is mostly a promise, but you can resolve or reject it from outside.
 * This 'Deferred' here is a much more limited version of the JQuery Deferred.
 */
export type Deferred<T> = {
    promise: Promise<T>;
    resolve: (value: T) => void;
    reject: (reason: unknown) => void;
    isSettled(): boolean;
}

export function createDeferred<T>(): Deferred<T> {
    let isSettled = false;
    let resolvePromise: (value: T) => void = noop;
    let rejectPromise: (reason: unknown) => void = noop;

    const promise = new Promise<T>((resolve, reject) => {
        resolvePromise = resolve;
        rejectPromise = reject;
    });

    return {
        promise,
        resolve(value) {
            isSettled = true;
            resolvePromise(value);
        },
        reject(reason) {
            isSettled = true;
            rejectPromise(reason);
        },
        isSettled() {
            return isSettled;
        },
    };
}

