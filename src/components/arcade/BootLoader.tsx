"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { startScroll, stopScroll } from "@/lib/scroll";
import { finishLoader, loading, mark } from "./loading";
import styles from "./BootLoader.module.css";

/** Only where the 3D arcade loads: PC-sized screens with motion allowed. */
const SHOWN = "(min-width: 861px) and (prefers-reduced-motion: no-preference)";
/** The counter never finishes faster than this, so it reads as a sequence, not a flash. */
const MIN_MS = 1200;
/** If the 3D is still loading by now, leave anyway; the arcade says INSERT COIN until it lands. */
const FAILSAFE_MS = 6000;
const BLOCKS = 24;

/** Real progress, weighted by how long each stage usually takes. */
function realProgress() {
    let p = 15; // the page itself is here
    if (loading.fonts) p += 20;
    if (loading.scene) p += 30;
    if (loading.ready) p += 35;
    return p;
}

function stageLabel(p: number) {
    if (p >= 100) return "Ready";
    if (loading.scene) return "Warming the tubes";
    if (loading.fonts) return "Loading cabinets";
    return "Loading type";
}

/**
 * The boot loader: a CRT that counts the arcade in. A giant glitching counter (a constant red
 * split, random slice tears), a pixel progress bar and a stage line, all driven by real loading.
 * At 100 it glitches hard and switches off like an old TV, a bright line then a dot, and the
 * arcade behind it powers on.
 */
export default function BootLoader() {
    const rootRef = useRef<HTMLDivElement>(null);
    const flashRef = useRef<HTMLDivElement>(null);
    const digitsRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLParagraphElement>(null);
    const barRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const root = rootRef.current;
        const digits = digitsRef.current;
        if (!root || !digits) return;

        // Phones, reduced motion, or a reload that lands further down the page: no loader.
        if (!window.matchMedia(SHOWN).matches || window.scrollY > window.innerHeight * 0.5) {
            root.setAttribute("data-done", "");
            finishLoader();
            return;
        }

        stopScroll();
        document.fonts?.ready.then(() => mark("fonts"));
        const layers = Array.from(digits.children) as HTMLElement[];
        const blocks = Array.from(barRef.current?.children ?? []) as HTMLElement[];
        const t0 = performance.now();
        let shown = 0;
        let lastInt = -1;
        let lastLit = -1;
        let lastStage = "";
        let exiting = false;
        let nextGlitch = t0 + 300;
        let glitchEnd = 0;

        const setText = (text: string) => layers.forEach((l) => (l.textContent = text));

        /** A tear: the red and cream layers jump sideways inside a random horizontal slice. */
        const glitch = (strength: number) => {
            const top = Math.random() * 70;
            const height = 8 + Math.random() * 30 * strength;
            root.style.setProperty("--g-top", `${top}%`);
            root.style.setProperty("--g-bot", `${Math.max(0, 100 - top - height)}%`);
            root.style.setProperty("--g-x", `${(Math.random() - 0.5) * 36 * strength}px`);
            root.style.setProperty("--g-x2", `${(Math.random() - 0.5) * 22 * strength}px`);
            root.setAttribute("data-glitch", "");
        };
        const settle = () => {
            root.removeAttribute("data-glitch");
            root.style.setProperty("--g-x", "0px");
            root.style.setProperty("--g-x2", "0px");
        };

        const exit = () => {
            exiting = true;
            glitch(1.6);
            const tl = gsap.timeline({
                onComplete: () => {
                    root.setAttribute("data-done", "");
                    startScroll();
                    finishLoader();
                    gsap.ticker.remove(tick);
                },
            });
            // A hard tear, then the tube switches off: down to a bright line, the line to a dot.
            tl.call(() => glitch(1.2), [], 0.08)
                .call(settle, [], 0.18)
                .to(flashRef.current, { opacity: 1, duration: 0.22, ease: "power2.in" }, 0.2)
                .to(root, { scaleY: 0.006, duration: 0.3, ease: "power3.in" }, 0.2)
                .to(root, { scaleX: 0, duration: 0.2, ease: "power3.in" }, 0.52)
                .to(root, { opacity: 0, duration: 0.12, ease: "none" }, 0.64);
        };

        const tick = () => {
            const now = performance.now();
            const elapsed = now - t0;
            const real = elapsed > FAILSAFE_MS ? 100 : realProgress();
            const target = Math.min(real, (elapsed / MIN_MS) * 100);
            // Ease toward the target, but no crawl at the end: the last digits snap home.
            shown += (target - shown) * 0.2;
            if (target >= 100 && shown > 97) shown = 100;

            const n = Math.floor(shown);
            if (n !== lastInt) {
                lastInt = n;
                setText(String(n).padStart(3, "0"));
            }
            const lit = Math.round((shown / 100) * BLOCKS);
            if (lit !== lastLit) {
                lastLit = lit;
                blocks.forEach((b, i) => b.toggleAttribute("data-on", i < lit));
            }
            const label = stageLabel(n);
            if (label !== lastStage && stageRef.current) {
                lastStage = label;
                stageRef.current.textContent = label;
            }

            // Random tears while it counts.
            if (!exiting) {
                if (now > nextGlitch) {
                    glitch(0.5 + Math.random() * 0.6);
                    glitchEnd = now + 60 + Math.random() * 70;
                    nextGlitch = now + 260 + Math.random() * 640;
                } else if (glitchEnd && now > glitchEnd) {
                    glitchEnd = 0;
                    settle();
                }
                if (n >= 100) exit();
            }
        };
        gsap.ticker.add(tick);

        return () => {
            gsap.ticker.remove(tick);
            startScroll();
        };
    }, []);

    return (
        <div ref={rootRef} className={styles.loader} data-loader="" role="status">
            <noscript>
                <style>{"[data-loader]{display:none!important}"}</style>
            </noscript>
            <span className="sr-only">Loading the OASIS arcade</span>
            <p className={`${styles.corner} ${styles.tl}`} aria-hidden="true">
                OASIS <span className={styles.dim}>{"//"}</span> Boot
            </p>
            <p className={`${styles.corner} ${styles.tr}`} aria-hidden="true">
                NMIT esports &amp; game dev
            </p>

            <div className={styles.center} aria-hidden="true">
                <div ref={digitsRef} className={styles.digits}>
                    <span className={styles.base}>000</span>
                    <span className={styles.red}>000</span>
                    <span className={styles.tear}>000</span>
                </div>
                <div ref={barRef} className={styles.bar}>
                    {Array.from({ length: BLOCKS }, (_, i) => (
                        <i key={i} />
                    ))}
                </div>
            </div>

            <p ref={stageRef} className={`${styles.corner} ${styles.bl}`} aria-hidden="true">
                Loading type
            </p>
            <p className={`${styles.corner} ${styles.br}`} aria-hidden="true">
                Insert coin
            </p>
            <div ref={flashRef} className={styles.flash} aria-hidden="true" />
        </div>
    );
}
