import * as React from "react";

/**
 * @see https://streamich.github.io/react-use/?path=/story/lifecycle-usemountedstate--docs
 *
 * Lifecycle hook providing ability to check component's mount status.
 * Returns a function that will return true if component mounted and false otherwise.
 */
export function useIsMounted(): () => boolean {
    const isMounted = React.useRef(false);

    React.useEffect(() => {
        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, []);

    return React.useCallback(() => isMounted.current, []);
}
