"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { modes } from "@/data/modes";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollToLevel } from "@/lib/scroll";
import ControllerSVG from "./ControllerSVG";
import type { FaceButton, PadInput, Pulse } from "./pad";
import styles from "./Hero.module.css";

// three.js only loads in the browser, after the hero has painted.
const ControllerScene = dynamic(() => import("./ControllerScene"), { ssr: false, loading: () => null });

/** 3D runs only with motion allowed and WebGL available. Server and reduced motion get the SVG. */
function canRun3D() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    try {
        const c = document.createElement("canvas");
        return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
        return false;
    }
}
let cached3D: boolean | null = null;
const subscribe3D = (cb: () => void) => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => {
        cached3D = null;
        cb();
    };
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
};
const get3D = () => (cached3D ??= canRun3D());

const FACE: FaceButton[] = ["A", "B", "X", "Y"];

export default function HeroStage({ heading }: { heading: React.ReactNode }) {
    const use3D = useSyncExternalStore(subscribe3D, get3D, () => false);
    const [index, setIndex] = useState(0);
    const [pulse, setPulse] = useState<Pulse | null>(null);
    const [nudge, setNudge] = useState({ dir: 0, id: 0 });
    const [paused, setPaused] = useState(false);
    const [ready, setReady] = useState(false);
    const root = useRef<HTMLDivElement>(null);
    const track = useRef<HTMLDivElement>(null);
    const counter = useRef(0);
    const mode = modes[index];

    const go = useCallback((next: number, dir: number) => {
        const i = (next + modes.length) % modes.length;
        setIndex(i);
        setNudge({ dir, id: ++counter.current });
    }, []);

    /** Every input path (3D pad, DOM buttons, keyboard, swipe) lands here. */
    const press = useCallback(
        (key: PadInput) => {
            setPulse({ key, id: ++counter.current });
            if (key === "left") go(index - 1, -1);
            else if (key === "right") go(index + 1, 1);
            else if (key === "down" || key === "start") scrollToLevel("about");
            else if (key === "up") return;
            else {
                const target = modes.findIndex((m) => m.button === key);
                if (target !== -1 && target !== index) go(target, target > index ? 1 : -1);
            }
        },
        [go, index]
    );

    // Slide the giant word strip so the current word sits in the middle.
    useGSAP(
        () => {
            const el = track.current;
            const word = el?.children[index] as HTMLElement | undefined;
            if (!el || !word) return;
            const place = (animate: boolean) => {
                const offset = word.offsetLeft + word.offsetWidth / 2 - el.parentElement!.clientWidth / 2;
                const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                if (!animate || reduce) gsap.set(el, { x: -offset });
                else gsap.to(el, { x: -offset, duration: 0.75, ease: "power4.out", overwrite: true });
            };
            place(true);
            const onResize = () => place(false);
            window.addEventListener("resize", onResize);
            return () => window.removeEventListener("resize", onResize);
        },
        { dependencies: [index], scope: root }
    );

    // Keyboard play while the title screen is in view.
    useEffect(() => {
        let inView = true;
        const io = new IntersectionObserver(([e]) => (inView = e.intersectionRatio > 0.5), { threshold: [0, 0.5, 1] });
        if (root.current) io.observe(root.current);
        const onKey = (e: KeyboardEvent) => {
            if (!inView || e.metaKey || e.ctrlKey || e.altKey) return;
            const tag = (e.target as HTMLElement).tagName;
            if (tag === "INPUT" || tag === "TEXTAREA") return;
            const map: Record<string, PadInput> = { ArrowLeft: "left", ArrowRight: "right", a: "A", b: "B", x: "X", y: "Y" };
            const key = map[e.key] ?? map[e.key.toLowerCase()];
            if (!key) return;
            // Arrow keys on a focused DOM button would double-fire; let buttons handle Enter/Space only.
            if (e.key.startsWith("Arrow")) e.preventDefault();
            press(key);
        };
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("keydown", onKey);
            io.disconnect();
        };
    }, [press]);

    // Horizontal swipe on touch screens.
    const swipe = useRef<{ x: number; y: number } | null>(null);
    const onPointerDown = (e: React.PointerEvent) => {
        if (e.pointerType === "touch") swipe.current = { x: e.clientX, y: e.clientY };
    };
    const onPointerUp = (e: React.PointerEvent) => {
        const s = swipe.current;
        swipe.current = null;
        if (!s) return;
        const dx = e.clientX - s.x;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.5) press(dx < 0 ? "right" : "left");
    };

    return (
        <div ref={root} className={styles.stage} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
            <div className={styles.play}>
                {/* Giant mode words behind the pad (decorative: the panel below carries the text). */}
                <div className={styles.words} aria-hidden="true">
                    <div ref={track} className={styles.track}>
                        {modes.map((m, i) => (
                            <span key={m.id} className={styles.word} data-on={i === index ? "" : undefined}>
                                {m.word}
                            </span>
                        ))}
                    </div>
                </div>

                <div className={styles.shadow} aria-hidden="true" data-paused={paused ? "" : undefined} />
                <ControllerSVG active={mode.button} className={styles.fallback} />
                {use3D && (
                    <div className={styles.canvas} data-ready={ready ? "" : undefined}>
                        <ControllerScene
                            pulse={pulse}
                            active={mode.button}
                            nudge={nudge}
                            paused={paused}
                            onInput={press}
                            onReady={() => setReady(true)}
                        />
                    </div>
                )}
            </div>

            <div className={`wrap ${styles.ui}`}>
                <div className={styles.intro} data-intro style={{ ["--i" as string]: 1 }}>
                    <p className="hud">Press start</p>
                    {heading}
                </div>

                <div className={styles.panel} data-intro style={{ ["--i" as string]: 2 }}>
                    <div className={styles.panelHead}>
                        <h2 className="hud">What we do</h2>
                        <p className="hud" aria-hidden="true">
                            {String(index + 1).padStart(2, "0")} / {String(modes.length).padStart(2, "0")}
                        </p>
                    </div>
                    <div className={styles.mode} aria-live="polite" key={mode.id}>
                        <p className={styles.modeName}>
                            <span className="sr-only">Now showing: </span>
                            {mode.word.charAt(0) + mode.word.slice(1).toLowerCase()}
                        </p>
                        <p className={styles.modeLine}>{mode.line}</p>
                        <ul className={styles.items}>
                            {mode.items.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.controls}>
                        <div className={styles.dpad} role="group" aria-label="Browse what we do">
                            <button type="button" className={styles.arrow} onClick={() => press("left")} aria-label="Previous">
                                <svg viewBox="0 0 16 16" aria-hidden="true">
                                    <path d="M10 3 5 8l5 5" />
                                </svg>
                            </button>
                            <button type="button" className={styles.arrow} onClick={() => press("right")} aria-label="Next">
                                <svg viewBox="0 0 16 16" aria-hidden="true">
                                    <path d="m6 3 5 5-5 5" />
                                </svg>
                            </button>
                        </div>
                        <div className={styles.faces} role="group" aria-label="Jump to">
                            {FACE.map((b) => {
                                const m = modes.find((x) => x.button === b);
                                if (!m) return null;
                                return (
                                    <button
                                        key={b}
                                        type="button"
                                        className={styles.face}
                                        aria-pressed={mode.button === b}
                                        aria-label={`${m.word.charAt(0) + m.word.slice(1).toLowerCase()} (${b})`}
                                        onClick={() => press(b)}
                                    >
                                        {b}
                                    </button>
                                );
                            })}
                        </div>
                        {use3D && (
                            <button type="button" className={styles.pause} onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
                                {paused ? "Play" : "Pause"}
                            </button>
                        )}
                    </div>
                    <p className={`hud ${styles.hint}`}>
                        <span className={styles.hintFine}>Drag the pad, press its buttons, or use the arrow keys.</span>
                        <span className={styles.hintTouch}>Tap the buttons, or swipe the words.</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
