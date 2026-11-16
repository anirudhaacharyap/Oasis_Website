"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import ControllerSVG from "@/components/hero/ControllerSVG";
import type { PadInput, Pulse } from "@/components/hero/pad";
import styles from "./SpawnPad.module.css";

// three.js only loads once Join is near the viewport (the dynamic import fires on first mount).
const ControllerScene = dynamic(() => import("@/components/hero/ControllerScene"), { ssr: false });

function webglAvailable() {
    try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
        return false;
    }
}

interface SpawnPadProps {
    selected: number;
    /** Name of the selected domain, shown under the "Player 1" label. */
    name: string;
    onInput: (key: PadInput) => void;
    /** Replays a press on the 3D buttons, so keyboard and DOM input also animate the pad. */
    pulse?: Pulse | null;
}

/** Decorative controller. The static drawing shows until the 3D pad is near and ready. */
export default function SpawnPad({ selected, name, onInput, pulse = null }: SpawnPadProps) {
    const box = useRef<HTMLDivElement>(null);
    const [mount, setMount] = useState(false);
    const [ready, setReady] = useState(false);
    const [isStatic, setIsStatic] = useState(false);
    const [prev, setPrev] = useState(selected);
    const [nudge, setNudge] = useState({ dir: 0, id: 0 });

    // Derive the nudge while rendering: the pad leans toward the direction the selection moved.
    if (prev !== selected) {
        setPrev(selected);
        setNudge((n) => ({ dir: Math.sign(selected - prev) || 1, id: n.id + 1 }));
    }

    useEffect(() => {
        // three.js only loads once Join is near the viewport; the static drawing holds until then.
        const el = document.getElementById("join") ?? box.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                io.disconnect();
                const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                if (!reduced && webglAvailable()) setMount(true);
                else setIsStatic(true);
            },
            { rootMargin: "100% 0px" }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div className={styles.wrap}>
            <p className={`label ${styles.player}`}>Player 1</p>
            <p className={styles.name}>
                {name}
            </p>
            <div ref={box} className={styles.padBox} data-static={isStatic ? "" : undefined} data-pad-box="" aria-hidden="true">
                {/* The flat drawing is only the fallback (reduced motion, no WebGL, no JS). */}
                <noscript>
                    <style>{"[data-pad-box] svg{opacity:1!important}"}</style>
                </noscript>
                <ControllerSVG active="A" className={styles.svg} />
                {mount && (
                    <div className={`${styles.stage} ${ready ? styles.ready : ""}`}>
                        <ControllerScene
                            pulse={pulse}
                            active="A"
                            nudge={nudge}
                            paused={false}
                            onInput={onInput}
                            onReady={() => setReady(true)}
                        />
                    </div>
                )}
            </div>
            <div className={styles.floor} aria-hidden="true" />
        </div>
    );
}
