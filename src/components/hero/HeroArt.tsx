"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import Logo from "@/components/brand/Logo";
import { emitPress } from "./hero-store";
import { useDotsLive } from "./dots-live";
import styles from "./Hero.module.css";

// The dot engine loads after first paint; until it draws, the printed logo holds the frame.
const DotLogo = dynamic(() => import("./DotLogo"), { ssr: false, loading: () => null });

export default function HeroArt() {
    const live = useDotsLive();
    const [ready, setReady] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const onReady = useCallback(() => {
        setReady(true);
    }, []);


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
        <div
            ref={ref}
            className={styles.art}
            data-ready={ready ? "" : undefined}
            data-static={live ? undefined : ""}
            data-hero-art=""
            aria-hidden="true"
        >
            {/* The flat print shows only when the dots can't run (no WebGL, reduced motion, no JS). */}
            <noscript>
                <style>{"[data-hero-art] svg{opacity:1!important}"}</style>
            </noscript>
            <Logo decorative className={styles.print} />
            {live && <DotLogo onReady={onReady} />}
        </div>
    );
}
