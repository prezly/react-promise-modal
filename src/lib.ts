import type * as React from "react";

export function noop() {
    // Nothing
}

export function generateId() {
    return `${new Date().getTime()}-${Math.random()}`;
}

export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function isEvent(value: unknown): value is Event {
    return value instanceof Event;
}

export function isSyntheticEvent(value: unknown | Partial<React.SyntheticEvent>): value is React.SyntheticEvent {
    return (
        typeof value === "object" &&
        value !== null &&
        "nativeEvent" in value &&
        "persist" in value &&
        "stopPropagation" in value &&
        "preventDefault" in value
    );
}
