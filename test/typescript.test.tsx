import { usePromiseModal } from "../dist";
import * as React from "react";

export function WithoutArguments() {
    const { modal, invoke } = usePromiseModal(({ onSubmit, onDismiss, show }) => (
        <button
            className={show ? "visible" : "hidden"}
            onClick={() => {
                if (Math.random() > 0.5) {
                    onSubmit(true);
                } else {
                    onDismiss();
                }
            }}
        >
            Close
        </button>
    ));

    return (
        <>
            <button onClick={invoke}>Open</button>
        </>
    );
}

export function WithArguments() {
    const { modal, invoke } = usePromiseModal<true, { name: string }>(({ onSubmit, onDismiss, show, name }) => (
        <button
            className={show ? "visible" : "hidden"}
            onClick={() => {
                if (Math.random() > 0.5) {
                    onSubmit(true);
                } else {
                    onDismiss();
                }
            }}
        >
            Close {name}
        </button>
    ));

    return (
        <>
            <button onClick={() => invoke({ name: "Elvis" })}>Open</button>
        </>
    );
}
