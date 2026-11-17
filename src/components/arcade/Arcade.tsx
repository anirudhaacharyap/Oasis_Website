"use client";

import { useSyncExternalStore } from "react";
import Arcade2D from "./Arcade2D";
import Arcade3D from "./Arcade3D";

/**
 * The title screen's arcade. PC-sized screens with motion allowed and WebGL get the 3D machines;
 * phones (until their own pass), reduced motion and no WebGL get the flat pixel-art machines, which
 * play the same game. True on the server, so a desktop's first paint already shows the boot line.
 */
const QUERY = "(prefers-reduced-motion: no-preference) and (min-width: 861px)";

function can3D() {
    if (!window.matchMedia(QUERY).matches) return false;
    try {
        const c = document.createElement("canvas");
        return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
        return false;
    }
}

let cached: boolean | null = null;
const subscribe = (cb: () => void) => {
    const mq = window.matchMedia(QUERY);
    const on = () => {
        cached = null;
        cb();
    };
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
};
const get3D = () => (cached ??= can3D());

export default function Arcade() {
    const live = useSyncExternalStore(subscribe, get3D, () => true);
    return live ? <Arcade3D /> : <Arcade2D />;
}
