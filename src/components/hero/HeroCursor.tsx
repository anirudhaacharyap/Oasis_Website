"use client";

import { useRef, useSyncExternalStore } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { heroState, onPress } from "./hero-store";
import styles from "./HeroCursor.module.css";

const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

function subscribe(cb: () => void) {
    const mq = window.matchMedia(QUERY);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
}
const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

const SVG_NS = "http://www.w3.org/2000/svg";
const BASE_D = 28;
const MAX_D = 360;
const TICK_GAP = 3;
const TICK_LEN = 5;
const PULL = 6;
const ANGLES = [0, 90, 180, 270];

/**
 * Hero-only thermal reticle. Mounts only on fine hover pointers without reduced motion, and flags
 * the section with data-cursor so the native cursor is hidden only while this is running.
 */
export default function HeroCursor() {
    const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    if (!enabled) return null;
    return <Reticle />;
}

function Reticle() {
    const layerRef = useRef<HTMLDivElement>(null);
    const stretchRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<SVGCircleElement>(null);
    const ticksRef = useRef<SVGGElement>(null);
    const dotRef = useRef<SVGCircleElement>(null);

    useGSAP(() => {
        const layer = layerRef.current;
        const stretch = stretchRef.current;
        const ring = ringRef.current;
        const ticks = ticksRef.current;
        const dot = dotRef.current;
        const section = document.getElementById("play");
        if (!layer || !stretch || !ring || !ticks || !dot || !section) return;

        section.setAttribute("data-cursor", "");

        const tickEls = Array.from(ticks.querySelectorAll("line"));
        // Proxy for everything the reticle shape animates: diameter, dot radius, ring/tick visibility.
        const shape = { d: BASE_D, dotR: 1.5, ring: 1, tickColor: 0, heat: 0 };
        const draw = () => {
            const r = shape.d / 2;
            ring.setAttribute("r", String(r));
            ring.style.opacity = String((0.6 + 0.4 * shape.heat) * shape.ring);
            ticks.style.opacity = String(shape.ring);
            dot.setAttribute("r", String(shape.dotR));
            tickEls.forEach((t) => {
                t.setAttribute("y1", String(-(r + TICK_GAP)));
                t.setAttribute("y2", String(-(r + TICK_GAP + TICK_LEN)));
            });
            ticks.style.stroke = shape.tickColor > 0.5 ? "var(--c-signal)" : "var(--c-cream)";
        };
        draw();

        const qx = gsap.quickTo(layer, "x", { duration: 0.35, ease: "power3.out" });
        const qy = gsap.quickTo(layer, "y", { duration: 0.35, ease: "power3.out" });
        const qRot = gsap.quickTo(stretch, "rotation", { duration: 0.3, ease: "power3.out" });
        const qSx = gsap.quickTo(stretch, "scaleX", { duration: 0.3, ease: "power3.out" });
        const qSy = gsap.quickTo(stretch, "scaleY", { duration: 0.3, ease: "power3.out" });

        let px = 0;
        let py = 0;
        let seen = false;
        let inside = false;
        let overWindow = true;
        let btn: HTMLElement | null = null;
        let btnQx: ((v: number) => void) | null = null;
        let btnQy: ((v: number) => void) | null = null;
        let lastX = 0;
        let lastY = 0;
        let angle = 0;
        let mode: "reticle" | "logo" | "button" = "reticle";
        let shapeTween: gsap.core.Tween | null = null;

        const toShape = (vars: gsap.TweenVars) => {
            shapeTween?.kill();
            shapeTween = gsap.to(shape, { duration: 0.25, ease: "power2.out", onUpdate: draw, ...vars });
        };

        const setMode = (next: typeof mode) => {
            if (next === mode) return;
            mode = next;
            if (next === "button") {
                toShape({ d: BASE_D, dotR: 4, ring: 0, tickColor: 0 });
            } else if (next === "logo") {
                toShape({ d: Math.min(MAX_D, heroState.radius * 2), dotR: 1.5, ring: 1, tickColor: 1 });
            } else {
                toShape({ d: BASE_D, dotR: 1.5, ring: 1, tickColor: 0 });
            }
        };

        const show = () => {
            const on = inside && overWindow && seen;
            gsap.to(layer, { opacity: on ? 1 : 0, duration: 0.15, ease: "power2.out", overwrite: "auto" });
        };

        const target = () => {
            if (btn) {
                const r = btn.getBoundingClientRect();
                qx(r.left + r.width / 2);
                qy(r.top + r.height / 2);
            } else {
                qx(px);
                qy(py);
            }
        };

        const pull = () => {
            if (!btn || !btnQx || !btnQy) return;
            const r = btn.getBoundingClientRect();
            const dx = px - (r.left + r.width / 2);
            const dy = py - (r.top + r.height / 2);
            btnQx(gsap.utils.clamp(-PULL, PULL, dx * 0.15));
            btnQy(gsap.utils.clamp(-PULL, PULL, dy * 0.15));
        };

        const releaseBtn = () => {
            if (!btn) return;
            const b = btn;
            btn = null;
            btnQx = null;
            btnQy = null;
            gsap.to(b, { x: 0, y: 0, duration: 0.4, ease: "power2.out", overwrite: "auto" });
            target();
        };

        const onMove = (e: PointerEvent) => {
            px = e.clientX;
            py = e.clientY;
            if (!seen) {
                seen = true;
                lastX = px;
                lastY = py;
                gsap.set(layer, { x: px, y: py });
            }
            if (e.target instanceof Node) {
                const now = section.contains(e.target);
                if (now !== inside) {
                    inside = now;
                    if (!now) releaseBtn();
                    show();
                } else if (now && gsap.getProperty(layer, "opacity") === 0) {
                    show();
                }
            }
            target();
            pull();
        };
        const onDocLeave = () => {
            overWindow = false;
            show();
        };
        const onDocEnter = () => {
            overWindow = true;
            show();
        };

        const buttons = Array.from(section.querySelectorAll<HTMLElement>("[data-magnetic]"));
        const cleanups: Array<() => void> = [];
        buttons.forEach((b) => {
            const enter = () => {
                btn = b;
                btnQx = gsap.quickTo(b, "x", { duration: 0.4, ease: "power2.out" });
                btnQy = gsap.quickTo(b, "y", { duration: 0.4, ease: "power2.out" });
                target();
            };
            const leave = () => {
                if (btn === b) releaseBtn();
            };
            b.addEventListener("pointerenter", enter);
            b.addEventListener("pointerleave", leave);
            cleanups.push(() => {
                b.removeEventListener("pointerenter", enter);
                b.removeEventListener("pointerleave", leave);
                gsap.set(b, { x: 0, y: 0 });
            });
        });

        const offPress = onPress((cx, cy) => {
            const wrap = document.createElementNS(SVG_NS, "svg");
            wrap.setAttribute("width", "1");
            wrap.setAttribute("height", "1");
            wrap.setAttribute("aria-hidden", "true");
            wrap.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;overflow:visible;pointer-events:none;z-index:50`;
            const c = document.createElementNS(SVG_NS, "circle");
            c.setAttribute("r", "14");
            c.setAttribute("class", styles.pulse);
            wrap.appendChild(c);
            document.body.appendChild(wrap);
            gsap.fromTo(
                c,
                { scale: 0.6, opacity: 1, transformOrigin: "0px 0px" },
                { scale: 2.2, opacity: 0, duration: 0.18, ease: "power2.out", onComplete: () => wrap.remove() },
            );
        });

        const tick = (_t: number, dtMs: number) => {
            if (!seen) return;
            // Scrolling moves the hero without a pointermove: re-test against its rect each frame.
            const rect = section.getBoundingClientRect();
            const nowInside = px >= rect.left && px <= rect.right && py >= rect.top && py <= rect.bottom;
            if (nowInside !== inside) {
                inside = nowInside;
                if (!nowInside) releaseBtn();
                show();
            }
            // Mode from shared hero state (a button overrides the logo).
            if (btn) setMode("button");
            else if (heroState.overLogo) setMode("logo");
            else setMode("reticle");

            if (mode === "logo") {
                const d = Math.min(MAX_D, heroState.radius * 2);
                if (Math.abs(d - shape.d) > 0.5 && !shapeTween?.isActive()) toShape({ d });
                if (Math.abs(heroState.heat - shape.heat) > 0.01) {
                    shape.heat = heroState.heat;
                    draw();
                }
            } else if (shape.heat !== 0) {
                shape.heat = 0;
                draw();
            }

            const dx = px - lastX;
            const dy = py - lastY;
            lastX = px;
            lastY = py;
            const dt = Math.max(1, dtMs) / 1000;
            const speed = Math.hypot(dx, dy) / dt;
            const k = mode === "button" ? 0 : Math.min(1, speed / 2400);
            if (speed > 120 && mode !== "button") {
                let a = (Math.atan2(dy, dx) * 180) / Math.PI;
                // Keep the angle continuous so quickTo never spins the long way round.
                a += Math.round((angle - a) / 360) * 360;
                angle = a;
                qRot(angle);
            }
            qSx(1 + 0.25 * k);
            qSy(1 - 0.1 * k);
        };

        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onDocLeave);
        document.documentElement.addEventListener("pointerenter", onDocEnter);
        gsap.ticker.add(tick);

        return () => {
            gsap.ticker.remove(tick);
            window.removeEventListener("pointermove", onMove);
            document.documentElement.removeEventListener("pointerleave", onDocLeave);
            document.documentElement.removeEventListener("pointerenter", onDocEnter);
            cleanups.forEach((fn) => fn());
            offPress();
            shapeTween?.kill();
            section.removeAttribute("data-cursor");
        };
    }, []);

    return (
        <div ref={layerRef} className={styles.layer} aria-hidden="true">
            <div ref={stretchRef} className={styles.stretch}>
                <svg className={styles.svg} viewBox="-200 -200 400 400">
                    <circle ref={ringRef} className={styles.ring} r="14" />
                    <g ref={ticksRef}>
                        {ANGLES.map((a) => (
                            <line key={a} className={styles.tick} x1="0" x2="0" y1="-17" y2="-22" transform={`rotate(${a})`} />
                        ))}
                    </g>
                    <circle ref={dotRef} className={styles.dot} r="1.5" />
                </svg>
            </div>
        </div>
    );
}
