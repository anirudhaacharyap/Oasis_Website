"use client";

import { useSyncExternalStore } from "react";

/** Live dots only with motion allowed and WebGL available. Server and reduced motion get the print. */
function canRunDots() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    try {
        const c = document.createElement("canvas");
        return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
        return false;
    }
}

let cached: boolean | null = null;
const subscribe = (cb: () => void) => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => {
        cached = null;
        cb();
    };
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
};
const getLive = () => (cached ??= canRunDots());

/** Whether a dot wordmark should run here. True on the server so the first paint matches. */
export function useDotsLive() {
    return useSyncExternalStore(subscribe, getLive, () => true);
}
