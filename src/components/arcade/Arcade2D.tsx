"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, PointerEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { reel } from "@/lib/reel";
import { CABINETS, JACKPOT_MS, arcade, boot, hit, holdNearest, onArcade, screens, step } from "./game";
import { CABINET, CAB_W, GLYPHS, PAL, SCREEN } from "./pixels";
import { GLYPH_AT, H, W, clamp01, drawTube } from "./tube";
import { afterLoader, mark as reached } from "./loading";
import styles from "./Arcade2D.module.css";

const SVG_NS = "http://www.w3.org/2000/svg";
/** The letter as SVG rects: what no-JS visitors and the very first paint see on the tube. */
function GlyphSvg({ letter }: { letter: string }) {
    const rows = GLYPHS[letter] ?? [];
    const x0 = SCREEN.x + GLYPH_AT[0];
    const y0 = SCREEN.y + GLYPH_AT[1];
    const rects: [number, number][] = [];
    rows.forEach((row, j) => {
        for (let i = 0; i < row.length; i++) if (row[i] === "#") rects.push([i, j]);
    });
    return (
        <g>
            {rects.map(([x, y]) => (
                <rect key={`s${x}-${y}`} x={x0 + x + 1} y={y0 + y + 1} width="1" height="1" fill={PAL.red} />
            ))}
            {rects.map(([x, y]) => (
                <rect key={`g${x}-${y}`} x={x0 + x} y={y0 + y} width="1" height="1" fill={PAL.cream} />
            ))}
        </g>
    );
}

/**
 * The flat arcade (phones for now, reduced motion, no WebGL): five retro arcade machines whose CRTs spell OASIS. Hit one (click, or Enter on a
 * focused machine) and it changes channel to a pixel game symbol, then flips back to its letter
 * three seconds later. All five on the same symbol is a jackpot.
 *
 * Pixel art at a whole-number scale, five tiny canvases at true retro resolution, no WebGL: the
 * tubes only redraw while something on them changes, so it stays light on low-end PCs.
 */
export default function Arcade2D() {
    const [said, setSaid] = useState("");
    const boxRef = useRef<HTMLDivElement>(null);
    const rowRef = useRef<HTMLDivElement>(null);
    const floorRef = useRef<HTMLDivElement>(null);
    const fxRef = useRef<HTMLDivElement>(null);
    const tubesRef = useRef<(HTMLCanvasElement | null)[]>([]);
    const lampsRef = useRef<(HTMLSpanElement | null)[]>([]);
    const bodiesRef = useRef<(HTMLSpanElement | null)[]>([]);

    useGSAP(() => {
        const box = boxRef.current;
        if (!box) return;
        const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const ctxs = tubesRef.current.map((c) => c?.getContext("2d") ?? null);
        // Cover the SVG letters until the tubes power on (the boot draws them in).
        ctxs.forEach((ctx) => {
            if (!ctx) return;
            ctx.fillStyle = PAL.tube;
            ctx.fillRect(0, 0, W, H);
        });

        let visible = true;
        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "60px" });
        io.observe(box);

        const drawn = CABINETS.map(() => "");
        const lit = CABINETS.map(() => -1);
        let jitterAt = 0;
        let jitterCab = -1;
        let jitterUntil = 0;

        const tick = () => {
            const now = performance.now();
            step(now);
            if (!visible || document.hidden) return;
            const hb = reel.heroBreak;
            const jack = arcade.jackStart >= 0 ? now - arcade.jackStart : -1;

            // Idle life: now and then one tube jumps a pixel, like a loose signal.
            if (!calm && arcade.booted && now > jitterAt) {
                jitterAt = now + 3500 + Math.random() * 3500;
                jitterCab = Math.floor(Math.random() * CABINETS.length);
                jitterUntil = now + 90;
            }

            screens.forEach((s, i) => {
                const down = clamp01((hb - 0.08 - i * 0.04) / 0.3);
                const power = s.power * (1 - down);
                const jitter = i === jitterCab && now < jitterUntil ? 1 : 0;
                const ctx = ctxs[i];
                if (ctx) {
                    const key = `${s.ch}|${s.to}|${s.flip.toFixed(3)}|${power.toFixed(3)}|${jack >= 0 ? Math.floor(jack / 33) : -1}|${jitter}`;
                    if (key !== drawn[i]) {
                        drawn[i] = key;
                        drawTube(ctx, i, now, power, jitter);
                    }
                }
                // Marquee lamps: the boot, the jackpot strobe, dark right to left on the way out.
                const cut = hb > 0.3 + (CABINETS.length - 1 - i) * 0.07 ? 0 : 1;
                const strobe = jack >= 0 && jack < JACKPOT_MS && Math.floor(jack / 90) % 2 === 1 ? 0.25 : 1;
                const op = Math.round(s.lamp * cut * strobe * 100) / 100;
                const lamp = lampsRef.current[i];
                if (lamp && op !== lit[i]) {
                    lit[i] = op;
                    lamp.style.opacity = String(op);
                }
            });
        };
        gsap.ticker.add(tick);
        reached("scene");
        reached("ready");
        afterLoader(boot);

        // Parallax: the row and the floor glow drift at different depths under the pointer.
        const row = rowRef.current;
        const floor = floorRef.current;
        const hero = box.closest("section") ?? box;
        // The scroll lock follows the crosshair to the nearest machine (the middle one to start).
        const machines = Array.from(row?.querySelectorAll<HTMLButtonElement>("button") ?? []);
        machines[2]?.setAttribute("data-lock-auto", "");
        const near = (e: globalThis.PointerEvent) => holdNearest(machines, e.clientX);
        hero.addEventListener("pointermove", near as EventListener, { passive: true });
        let move: ((e: globalThis.PointerEvent) => void) | null = null;
        let leave: (() => void) | null = null;
        if (!calm && row && floor && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            const rx = gsap.quickTo(row, "x", { duration: 0.6, ease: "power3.out" });
            const ry = gsap.quickTo(row, "y", { duration: 0.6, ease: "power3.out" });
            const fx = gsap.quickTo(floor, "x", { duration: 0.8, ease: "power3.out" });
            move = (e) => {
                const r = hero.getBoundingClientRect();
                const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
                const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
                rx(nx * -8);
                ry(ny * -4);
                fx(nx * -18);
            };
            leave = () => {
                rx(0);
                ry(0);
                fx(0);
            };
            hero.addEventListener("pointermove", move as EventListener, { passive: true });
            hero.addEventListener("pointerleave", leave);
        }

        const off = onArcade((e) => {
            if (e.type === "jackpot") setSaid(e.label);
        });

        return () => {
            gsap.ticker.remove(tick);
            io.disconnect();
            off();
            hero.removeEventListener("pointermove", near as EventListener);
            if (move) hero.removeEventListener("pointermove", move as EventListener);
            if (leave) hero.removeEventListener("pointerleave", leave);
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

    /** The machine takes the hit: knocked down two art pixels, then it springs back. */
    const bump = (i: number) => {
        const body = bodiesRef.current[i];
        if (!body || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const px = body.offsetWidth / CAB_W;
        gsap.fromTo(body, { y: px * 2 }, { y: 0, duration: 0.4, ease: "back.out(3)", overwrite: true });
    };

    const fire = (i: number, clientX: number, clientY: number) => {
        mark(clientX, clientY);
        bump(i);
        hit(i);
    };

    const onDown = (e: PointerEvent<HTMLButtonElement>, i: number) => {
        if (e.button !== 0) return;
        fire(i, e.clientX, e.clientY);
    };

    // Pointer presses already fired on pointerdown; a click with detail 0 is the keyboard.
    const onClick = (e: MouseEvent<HTMLButtonElement>, i: number) => {
        if (e.detail !== 0) return;
        const r = e.currentTarget.getBoundingClientRect();
        fire(i, r.left + r.width / 2, r.top + r.height * 0.3);
    };

    const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
        const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        const all = Array.from(rowRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
        const at = all.indexOf(e.currentTarget);
        all[(at + dir + all.length) % all.length]?.focus();
    };

    return (
        <div ref={boxRef} className={styles.art} data-arcade="">
            <noscript>
                <style>{"[data-lamp]{opacity:1!important}"}</style>
            </noscript>
            <div ref={floorRef} className={styles.floor} aria-hidden="true" />
            <div ref={rowRef} className={styles.row} role="group" aria-label="Arcade: hit a machine to change its channel">
                {CABINETS.map((letter, i) => (
                    <button
                        key={i}
                        type="button"
                        className={styles.machine}
                        aria-label={`Machine ${letter}: change the channel`}
                        data-lock={`Machine ${letter}`}
                        onPointerDown={(e) => onDown(e, i)}
                        onClick={(e) => onClick(e, i)}
                        onKeyDown={onKey}
                    >
                        <span
                            ref={(el) => {
                                bodiesRef.current[i] = el;
                            }}
                            className={styles.body}
                        >
                            <svg className={styles.cab} viewBox="0 0 36 80" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
                                {CABINET.map(([x, y, w, h, fill], k) => (
                                    <rect key={k} x={x} y={y} width={w} height={h} fill={fill} />
                                ))}
                                <GlyphSvg letter={letter} />
                            </svg>
                            <span
                                ref={(el) => {
                                    lampsRef.current[i] = el;
                                }}
                                className={styles.lamp}
                                data-lamp=""
                                aria-hidden="true"
                            />
                            <canvas
                                ref={(el) => {
                                    tubesRef.current[i] = el;
                                }}
                                className={styles.tube}
                                width={W}
                                height={H}
                                aria-hidden="true"
                            />
                            <span className={styles.glass} aria-hidden="true" />
                        </span>
                    </button>
                ))}
            </div>
            <div ref={fxRef} className={styles.fx} aria-hidden="true" />
            <p className="sr-only" aria-live="polite">
                {said}
            </p>
        </div>
    );
}
