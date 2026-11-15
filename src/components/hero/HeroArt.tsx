"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Logo from "@/components/brand/Logo";
import { emitPress } from "./hero-store";
import styles from "./Hero.module.css";

// The dot engine loads after first paint; until it draws, the printed logo holds the frame.
const DotLogo = dynamic(() => import("./DotLogo"), { ssr: false, loading: () => null });

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

export default function HeroArt() {
    const live = useSyncExternalStore(subscribe, getLive, () => false);
    const [ready, setReady] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const onReady = useCallback(() => setReady(true), []);

    // Any press inside the hero is a heat burst (the reticle answers with a pulse ring).
    useEffect(() => {
        const section = ref.current?.closest("section");
        if (!section) return;
        const down = (e: PointerEvent) => {
            if ((e.target as HTMLElement).closest("a, button")) return;
            emitPress(e.clientX, e.clientY);
        };
        section.addEventListener("pointerdown", down);
        return () => section.removeEventListener("pointerdown", down);
    }, []);

    return (
        <div ref={ref} className={styles.art} data-ready={ready ? "" : undefined} aria-hidden="true">
            <Logo decorative className={styles.print} />
            {live && <DotLogo onReady={onReady} />}
        </div>
    );
}
