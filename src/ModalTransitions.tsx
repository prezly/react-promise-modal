import * as React from "react";

import { delay, noop } from "./lib";
import { useIsMounted } from "./useIsMounted";
import { useLatest } from "./useLatest";

export type Milliseconds = number;

type Props = {
    isOpen: boolean;
    onClosed?: () => void;
    transitionDuration: Milliseconds;
    render: (props: RenderProps) => React.ReactElement | null;
};

type RenderProps = {
    isOpen: boolean;
    stage: `${Stage.OPEN | Stage.OPENING | Stage.CLOSING}`; // Note: not rendering "closed" stage
    onClose: () => void;
};

export enum Stage {
    OPEN = "open",
    OPENING = "opening",
    CLOSING = "closing",
    CLOSED = "closed",
}

export function ModalTransitions({ isOpen: shouldOpen, onClosed, transitionDuration, render }: Props) {
    const isMounted = useIsMounted();
    const [stage, setStage] = React.useState<Stage>(Stage.CLOSED);
    const refs = useLatest({
        stage,
        onClosed,
        transitionDuration,
    });

    const onOpen = React.useCallback(() => {
        if (!isMounted()) {
            return noop;
        }

        if (refs.current.stage === Stage.OPENING || refs.current.stage === Stage.OPEN) {
            return noop; // Nothing to do
        }

        let cancel = false;

        setStage(Stage.OPENING);
        delay(refs.current.transitionDuration).then(() => {
            if (cancel || !isMounted()) {
                return;
            }
            setStage(Stage.OPEN);
        });

        return () => {
            cancel = true;
        };
    }, []);

    const onClose = React.useCallback(() => {
        if (!isMounted()) {
            return noop;
        }

        if (refs.current.stage === Stage.CLOSING || refs.current.stage === Stage.CLOSED) {
            return noop; // Nothing to do
        }

        let cancel = false;

        setStage(Stage.CLOSING);
        delay(refs.current.transitionDuration).then(() => {
            if (cancel || !isMounted()) {
                return;
            }
            setStage(Stage.CLOSED);
            refs.current.onClosed?.();
        });

        return () => {
            cancel = true;
        };
    }, []);

    React.useEffect(() => {
        if (shouldOpen) {
            return onOpen();
        } else {
            return onClose();
        }
    }, [open]);

    if (stage === Stage.CLOSED) {
        // Do not render anything in "closed" stage
        return null;
    }

    return render({
        stage,
        isOpen: stage === Stage.OPEN || stage === Stage.OPENING,
        onClose,
    });
}
