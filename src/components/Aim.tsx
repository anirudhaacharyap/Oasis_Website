"use client";

import { useRef, useSyncExternalStore } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./Aim.module.css";

/**
 * Aim: the page plays like a game on a PC. The cursor is a crosshair (pure CSS, so it has no lag),
 * and one lock frame, four corner brackets, catches whatever you are aiming at.
 *
 * What the frame locks onto, strongest first:
 *   1. the [data-lock] target under the crosshair
 *   2. the [data-lock] target holding keyboard focus (focus-visible)
 *   3. the [data-lock-auto] target nearest the middle of the screen, so scrolling alone selects
 *      the next action. This only highlights; it never moves focus or clicks anything.
 *
 * A target marked [data-lock-own] draws its own brackets (the player tiles), so the shared frame
 * steps aside and only the readout names it. The top-left readout prints the crosshair's page
 * coordinates and the current lock. Fine pointers only; phones get their own pass later.
 */
const FINE = "(hover: hover) and (pointer: fine)";

function subscribe(cb: () => void) {
    const mq = window.matchMedia(FINE);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
}
const getSnapshot = () => window.matchMedia(FINE).matches;
const getServerSnapshot = () => false;

export default function Aim() {
    const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    if (!enabled) return null;
    return <AimLayer />;
}

/** Bracket arm length in px; the corner spans draw this square. */
const ARM = 14;
/** Resting gap between the target's edge and the brackets. */
const REST = 6;
/** Where the brackets start when they catch a new target: wide, then they snap in. */
const WIDE = 18;

type Box = { l: number; t: number; r: number; b: number };

const pad4 = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, "0");

function nameOf(el: HTMLElement | null) {
    return el?.dataset.lock?.trim() || "";
}

function AimLayer() {
    const frameRef = useRef<HTMLDivElement>(null);
    const posRef = useRef<HTMLSpanElement>(null);
    const lockRef = useRef<HTMLSpanElement>(null);
    const modeRef = useRef<HTMLSpanElement>(null);

    useGSAP(() => {
        const frame = frameRef.current;
        const pos = posRef.current;
        const lockEl = lockRef.current;
        const modeEl = modeRef.current;
        if (!frame || !pos || !lockEl || !modeEl) return;
        const corners = Array.from(frame.children) as HTMLElement[];
        const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let px = -1;
        let py = -1;
        let hover: HTMLElement | null = null;
        let focus: HTMLElement | null = null;
        let auto: HTMLElement | null = null;
        let current: HTMLElement | null = null;

        const box: Box = { l: 0, t: 0, r: 0, b: 0 };
        let from: Box | null = null;
        const fly = { p: 1 };
        const snap = { pad: REST };
        const vis = { o: 0 };

        let lastScroll = -1;
        let sinceScan = 1e9;
        let shownPos = "";
        let shownLock = "";

        const visible = (el: HTMLElement) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0 ? r : null;
        };

        const lockTo = (next: HTMLElement | null) => {
            const wasShowing = !!current && !current.hasAttribute("data-lock-own") && vis.o > 0.5;
            current = next;
            const drawn = !!next && !next.hasAttribute("data-lock-own");
            if (!drawn) {
                gsap.to(vis, { o: 0, duration: calm ? 0 : 0.14, ease: "power2.out", overwrite: true });
                from = null;
                return;
            }
            // Fly from the old target to the new one; a fresh catch starts on the target itself.
            from = wasShowing && !calm ? { ...box } : null;
            fly.p = from ? 0 : 1;
            if (from) gsap.to(fly, { p: 1, duration: 0.32, ease: "power3.out", overwrite: true });
            gsap.to(vis, { o: 1, duration: calm ? 0 : 0.12, ease: "power2.out", overwrite: true });
            if (calm) snap.pad = REST;
            else gsap.fromTo(snap, { pad: WIDE }, { pad: REST, duration: 0.38, ease: "back.out(2.4)", overwrite: true });
        };

        // The target under a still crosshair changes when the page scrolls beneath it.
        const probe = () => {
            if (px < 0) return;
            const el = document.elementFromPoint(px, py);
            hover = (el?.closest?.("[data-lock]") as HTMLElement | null) ?? null;
        };

        // Scroll selection: the auto target whose centre sits nearest just-below-middle of the screen.
        const scan = () => {
            const h = window.innerHeight;
            const aim = h * 0.55;
            let best: HTMLElement | null = null;
            let bestD = Infinity;
            document.querySelectorAll<HTMLElement>("[data-lock-auto]").forEach((el) => {
                const r = visible(el);
                if (!r) return;
                const c = r.top + r.height / 2;
                if (c < h * 0.08 || c > h * 0.95) return;
                const d = Math.abs(c - aim);
                // Strictly nearer wins, so of two side-by-side buttons the first (primary) keeps it.
                if (d < bestD - 1) {
                    bestD = d;
                    best = el;
                }
            });
            auto = best;
        };

        const onMove = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            px = e.clientX;
            py = e.clientY;
            const t = e.target instanceof Element ? e.target : null;
            hover = (t?.closest("[data-lock]") as HTMLElement | null) ?? null;
        };
        const onLeave = () => {
            hover = null;
        };
        const onFocusIn = (e: FocusEvent) => {
            const t = e.target instanceof HTMLElement ? e.target : null;
            focus = t && t.matches(":focus-visible") ? ((t.closest("[data-lock]") as HTMLElement | null) ?? null) : null;
        };
        const onFocusOut = () => {
            focus = null;
        };
        // Pulling the trigger: the brackets clamp in on the target, then let go.
        const onDown = (e: PointerEvent) => {
            if (calm || e.button !== 0 || !current || current !== hover || current.hasAttribute("data-lock-own")) return;
            gsap.timeline({ overwrite: true })
                .to(snap, { pad: 1, duration: 0.07, ease: "power2.out" })
                .to(snap, { pad: REST, duration: 0.32, ease: "back.out(3)" });
        };

        const draw = () => {
            const p = snap.pad;
            const { l, t, r, b } = box;
            corners[0].style.transform = `translate3d(${l - p}px, ${t - p}px, 0)`;
            corners[1].style.transform = `translate3d(${r + p - ARM}px, ${t - p}px, 0)`;
            corners[2].style.transform = `translate3d(${l - p}px, ${b + p - ARM}px, 0)`;
            corners[3].style.transform = `translate3d(${r + p - ARM}px, ${b + p - ARM}px, 0)`;
            frame.style.opacity = String(vis.o);
        };

        const tick = (_t: number, dt: number) => {
            const sy = window.scrollY;
            sinceScan += dt;
            if (sy !== lastScroll || sinceScan > 250) {
                if (sy !== lastScroll) probe();
                lastScroll = sy;
                sinceScan = 0;
                scan();
            }

            // A target that left the layout (a collapsed row, a swapped label) lets go.
            if (hover && !hover.isConnected) hover = null;
            const next = hover ?? focus ?? auto;
            if (next !== current) lockTo(next);

            if (current && !current.hasAttribute("data-lock-own")) {
                const r = visible(current);
                if (!r) lockTo(null);
                else {
                    const k = fly.p;
                    const f = from;
                    box.l = f ? f.l + (r.left - f.l) * k : r.left;
                    box.t = f ? f.t + (r.top - f.t) * k : r.top;
                    box.r = f ? f.r + (r.right - f.r) * k : r.right;
                    box.b = f ? f.b + (r.bottom - f.b) * k : r.bottom;
                    if (k >= 1) from = null;
                }
            }
            draw();

            // The readout: page coordinates, so Y keeps counting as you scroll under a still hand.
            const posText = px < 0 ? `X 0000  Y ${pad4(sy)}` : `X ${pad4(px)}  Y ${pad4(py + sy)}`;
            if (posText !== shownPos) {
                pos.textContent = posText;
                shownPos = posText;
            }
            const name = nameOf(current);
            if (name !== shownLock) {
                lockEl.textContent = name || "No target";
                modeEl.textContent = name ? "Lock" : "Scan";
                modeEl.toggleAttribute("data-on", !!name);
                shownLock = name;
            }
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerdown", onDown, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);
        document.addEventListener("focusin", onFocusIn);
        document.addEventListener("focusout", onFocusOut);
        gsap.ticker.add(tick);

        return () => {
            gsap.ticker.remove(tick);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerdown", onDown);
            document.documentElement.removeEventListener("pointerleave", onLeave);
            document.removeEventListener("focusin", onFocusIn);
            document.removeEventListener("focusout", onFocusOut);
            gsap.killTweensOf([fly, snap, vis]);
        };
    }, []);

    return (
        <>
            <div ref={frameRef} className={styles.frame} data-aim-frame aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
            </div>
            <div className={styles.hud} data-aim-hud aria-hidden="true">
                <span ref={posRef} className={styles.pos}>
                    X 0000 Y 0000
                </span>
                <span className={styles.line}>
                    <span ref={modeRef} className={styles.mode}>
                        Scan
                    </span>
                    <span className={styles.sep}>&rsaquo;</span>
                    <span ref={lockRef} className={styles.target}>
                        No target
                    </span>
                </span>
            </div>
        </>
    );
}
