"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { CABINETS, aim, boot, hit, holdNearest, onArcade, setAimed } from "./game";
import { afterLoader, mark as reached } from "./loading";
import styles from "./Arcade3D.module.css";

// three.js loads after first paint; until the row has drawn, the stage says INSERT COIN.
const ArcadeScene = dynamic(() => import("./ArcadeScene"), { ssr: false, loading: () => null });

const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * The 3D arcade: five machines whose CRTs spell OASIS. Hit one (click, or Enter on a focused
 * machine) and it changes channel to a game symbol, then back to its letter three seconds later.
 * The machines are real buttons laid over the 3D row, so the crosshair's lock frame, keyboard focus
 * and screen readers all work on them.
 */
export default function Arcade3D() {
    const [ready, setReady] = useState(false);
    const [said, setSaid] = useState("");
    const boxRef = useRef<HTMLDivElement>(null);
    const fxRef = useRef<HTMLDivElement>(null);
    const hitsRef = useRef<(HTMLButtonElement | null)[]>([]);

    const onReady = useCallback(() => {
        setReady(true);
        reached("ready");
        // Power on once the loader has switched off, so the boot plays on screen.
        afterLoader(boot);
    }, []);

    useGSAP(() => {
        const box = boxRef.current;
        if (!box) return;

        // Hit targets follow the machines' projected boxes.
        const shown = CABINETS.map(() => "");
        const place = () => {
            hitsRef.current.forEach((btn, i) => {
                const r = aim.rects[i];
                if (!btn || r.r <= r.l) return;
                const key = `${r.l | 0},${r.t | 0},${(r.r - r.l) | 0},${(r.b - r.t) | 0}`;
                if (key === shown[i]) return;
                shown[i] = key;
                btn.style.transform = `translate(${r.l}px, ${r.t}px)`;
                btn.style.width = `${r.r - r.l}px`;
                btn.style.height = `${r.b - r.t}px`;
            });
        };
        gsap.ticker.add(place);

        // The middle machine holds the lock until the crosshair says otherwise.
        hitsRef.current[2]?.setAttribute("data-lock-auto", "");
        const hero = box.closest("section") ?? box;
        const move = (e: globalThis.PointerEvent) => {
            const r = hero.getBoundingClientRect();
            aim.mx = gsap.utils.clamp(-1, 1, ((e.clientX - r.left) / r.width) * 2 - 1);
            aim.my = gsap.utils.clamp(-1, 1, ((e.clientY - r.top) / r.height) * 2 - 1);
            holdNearest(hitsRef.current, e.clientX);
        };
        const leave = () => {
            aim.mx = 0;
            aim.my = 0;
        };
        hero.addEventListener("pointermove", move as EventListener, { passive: true });
        hero.addEventListener("pointerleave", leave);

        const off = onArcade((e) => {
            if (e.type === "jackpot") setSaid(e.label);
        });

        return () => {
            gsap.ticker.remove(place);
            hero.removeEventListener("pointermove", move as EventListener);
            hero.removeEventListener("pointerleave", leave);
            off();
        };
    }, []);

    /** The hitmarker: four short ticks around the shot, gone in a quarter second. */
    const mark = (clientX: number, clientY: number) => {
        const layer = fxRef.current;
        const box = boxRef.current;
        if (!layer || !box || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const r = box.getBoundingClientRect();
        const svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("viewBox", "-16 -16 32 32");
        svg.setAttribute("class", styles.hitmark);
        svg.style.left = `${clientX - r.left}px`;
        svg.style.top = `${clientY - r.top}px`;
        for (const [a, b] of [
            [-1, -1],
            [1, -1],
            [-1, 1],
            [1, 1],
        ]) {
            const line = document.createElementNS(SVG_NS, "path");
            line.setAttribute("d", `M${a * 4} ${b * 4}L${a * 11} ${b * 11}`);
            svg.appendChild(line);
        }
        layer.appendChild(svg);
        gsap.fromTo(
            svg,
            { scale: 0.7, opacity: 1 },
            { scale: 1.15, opacity: 0, duration: 0.24, ease: "power2.out", onComplete: () => svg.remove() },
        );
    };

    const onDown = (e: PointerEvent<HTMLButtonElement>, i: number) => {
        if (e.button !== 0) return;
        mark(e.clientX, e.clientY);
        hit(i);
    };

    // Pointer presses already fired on pointerdown; a click with detail 0 is the keyboard.
    const onClick = (e: MouseEvent<HTMLButtonElement>, i: number) => {
        if (e.detail !== 0) return;
        const r = e.currentTarget.getBoundingClientRect();
        mark(r.left + r.width / 2, r.top + r.height * 0.3);
        hit(i);
    };

    const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
        const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        hitsRef.current[(i + dir + CABINETS.length) % CABINETS.length]?.focus();
    };

    const aimAt = (i: number) => setAimed(i, true);
    const aimOff = (i: number) => setAimed(i, false);

    return (
        <div ref={boxRef} className={styles.art} data-ready={ready ? "" : undefined}>
            <ArcadeScene onReady={onReady} />
            <p className={styles.coin} aria-hidden="true">
                Insert coin
            </p>
            <div className={styles.hits} role="group" aria-label="Arcade: hit a machine to change its channel">
                {CABINETS.map((letter, i) => (
                    <button
                        key={i}
                        ref={(el) => {
                            hitsRef.current[i] = el;
                        }}
                        type="button"
                        className={styles.hit}
                        aria-label={`Machine ${letter}: change the channel`}
                        data-lock={`Machine ${letter}`}
                        tabIndex={ready ? 0 : -1}
                        onPointerDown={(e) => onDown(e, i)}
                        onClick={(e) => onClick(e, i)}
                        onKeyDown={(e) => onKey(e, i)}
                        onPointerEnter={() => aimAt(i)}
                        onPointerLeave={() => aimOff(i)}
                        onFocus={() => aimAt(i)}
                        onBlur={() => aimOff(i)}
                    />
                ))}
            </div>
            <div ref={fxRef} className={styles.fx} aria-hidden="true" />
            <p className="sr-only" aria-live="polite">
                {said}
            </p>
        </div>
    );
}
