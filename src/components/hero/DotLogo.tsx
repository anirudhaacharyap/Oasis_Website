"use client";

/**
 * The OASIS wordmark printed as a sheet of halftone ink dots: the footer's last frame.
 *
 * Dots are sampled from the club's logo path. Each one sits on a spring at its home position.
 * The pointer pushes dots away and heats them (cream -> signal red -> brand red, faster pointer =
 * more heat); they cool and settle home with a slight overshoot. The star glints, and a heat
 * wave rides the arc every few seconds.
 *
 * The bookend: the word starts as fallen red ink and rises, cooling back into the cream word, as
 * you reach the end of the page (driven by reel.footBreak).
 *
 * OGL (one tiny WebGL context), CPU springs in typed arrays, one clock: GSAP's ticker.
 */

import { useEffect, useRef } from "react";
import { Geometry, Mesh, Program, Renderer } from "ogl";
import { gsap } from "@/lib/gsap";
import { reel } from "@/lib/reel";
import { LOGO_PATH } from "@/components/brand/logo-path";

const VB_W = 806;
const VB_H = 323;

const VERT = /* glsl */ `
attribute vec2 position;
attribute float radius;
attribute float heat;
uniform vec2 uRes;
uniform float uDpr;
varying float vHeat;
void main() {
  vHeat = heat;
  vec2 clip = (position / uRes) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = (radius * 2.0 + min(heat, 1.0) * 2.4) * uDpr;
}`;

const FRAG = /* glsl */ `
precision highp float;
varying float vHeat;
uniform float uAlpha;
// Cream ink at rest; heat jumps it to signal red, the hottest dots settle into brand red.
vec3 ramp(float t) {
  vec3 cream  = vec3(0.949, 0.918, 0.859);
  vec3 signal = vec3(0.898, 0.196, 0.227);
  vec3 red    = vec3(0.678, 0.000, 0.075);
  vec3 c = mix(cream, signal, smoothstep(0.06, 0.38, t));
  return mix(c, red, smoothstep(0.6, 1.0, t));
}
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = 1.0 - smoothstep(0.40, 0.5, d);
  if (a <= 0.0) discard;
  gl_FragColor = vec4(ramp(clamp(vHeat, 0.0, 1.2)), a * uAlpha);
}`;

interface Dots {
    n: number;
    hx: Float32Array;
    hy: Float32Array;
    x: Float32Array;
    y: Float32Array;
    vx: Float32Array;
    vy: Float32Array;
    heat: Float32Array;
    radius: Float32Array;
    fall: Float32Array; // how far each dot drops when the word breaks (0.5 to 1.5)
    pos: Float32Array; // interleaved x,y for the GPU
    star: Uint32Array;
    arc: Uint32Array; // arc dots ordered left to right
    logo: { x: number; y: number; w: number; h: number };
    cx: number;
    cy: number;
}

/** Sample the logo into a halftone grid sized to the canvas (CSS px). */
function sampleLogo(w: number, h: number, cell: number, pad: number): Dots {
    const lw = Math.min(w - pad * 2, ((h - pad * 2) * VB_W) / VB_H);
    const s = lw / VB_W;
    const lh = VB_H * s;
    const ox = (w - lw) / 2;
    const oy = (h - lh) / 2;

    const cv = document.createElement("canvas");
    cv.width = Math.ceil(w);
    cv.height = Math.ceil(h);
    const ctx = cv.getContext("2d", { willReadFrequently: true })!;
    ctx.translate(ox, oy);
    ctx.scale(s, s);
    ctx.fill(new Path2D(LOGO_PATH));
    const img = ctx.getImageData(0, 0, cv.width, cv.height).data;
    const alphaAt = (px: number, py: number) => {
        const xi = Math.min(cv.width - 1, Math.max(0, Math.round(px)));
        const yi = Math.min(cv.height - 1, Math.max(0, Math.round(py)));
        return img[(yi * cv.width + xi) * 4 + 3] / 255;
    };

    const hx: number[] = [];
    const hy: number[] = [];
    const rad: number[] = [];
    const sub = cell / 3;
    let row = 0;
    for (let cy = oy - cell; cy < oy + lh + cell; cy += cell * 0.866, row++) {
        // Offset every other row: a real halftone screen, not a square grid.
        const shift = row % 2 ? cell / 2 : 0;
        for (let cx = ox - cell + shift; cx < ox + lw + cell; cx += cell) {
            let cov = 0;
            for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) cov += alphaAt(cx + i * sub, cy + j * sub);
            cov /= 9;
            if (cov < 0.12) continue;
            hx.push(cx);
            hy.push(cy);
            rad.push(cell * 0.5 * Math.sqrt(cov) * 0.9);
        }
    }

    const n = hx.length;
    // The arc and star live in the top band of the logo (above the letters).
    const topLimit = oy + lh * 0.43;
    const top: number[] = [];
    for (let i = 0; i < n; i++) if (hy[i] < topLimit) top.push(i);
    let minX = Infinity;
    let maxX = -Infinity;
    top.forEach((i) => {
        minX = Math.min(minX, hx[i]);
        maxX = Math.max(maxX, hx[i]);
    });
    const starCut = maxX - (maxX - minX) * 0.2;
    const star = top.filter((i) => hx[i] >= starCut);
    const arc = top.filter((i) => hx[i] < starCut).sort((a, b) => hx[a] - hx[b]);

    const dots: Dots = {
        n,
        hx: Float32Array.from(hx),
        hy: Float32Array.from(hy),
        x: Float32Array.from(hx),
        y: Float32Array.from(hy),
        vx: new Float32Array(n),
        vy: new Float32Array(n),
        heat: new Float32Array(n),
        radius: Float32Array.from(rad),
        fall: Float32Array.from({ length: n }, () => 0.5 + Math.random()),
        pos: new Float32Array(n * 2),
        star: Uint32Array.from(star),
        arc: Uint32Array.from(arc),
        logo: { x: ox, y: oy, w: lw, h: lh },
        cx: w / 2,
        cy: h / 2,
    };
    return dots;
}

type Props = {
    onReady?: () => void;
};

export default function DotLogo({ onReady }: Props) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const readyRef = useRef(onReady);

    useEffect(() => {
        readyRef.current = onReady;
    }, [onReady]);

    useEffect(() => {
        const wrap = wrapRef.current;
        if (!wrap) return;
        const touch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

        let renderer: Renderer;
        try {
            renderer = new Renderer({ dpr, alpha: true, premultipliedAlpha: false, antialias: false });
        } catch {
            readyRef.current?.();
            readyRef.current = undefined;
            return; // No WebGL: the static print stays.
        }
        const gl = renderer.gl;
        gl.clearColor(0, 0, 0, 0);
        const canvas = gl.canvas as HTMLCanvasElement;
        canvas.style.position = "absolute";
        canvas.style.inset = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.pointerEvents = "none";
        canvas.setAttribute("aria-hidden", "true");
        wrap.appendChild(canvas);

        const program = new Program(gl, {
            vertex: VERT,
            fragment: FRAG,
            uniforms: { uRes: { value: [1, 1] }, uDpr: { value: dpr }, uAlpha: { value: 1 } },
            transparent: true,
            depthTest: false,
            depthWrite: false,
        });

        let dots: Dots | null = null;
        let mesh: Mesh | null = null;
        let geometry: Geometry | null = null;
        let w = 1;
        let h = 1;
        let t = 0;

        const build = () => {
            const r = wrap.getBoundingClientRect();
            w = Math.max(1, r.width);
            h = Math.max(1, r.height);
            renderer.setSize(w, h);
            program.uniforms.uRes.value = [w, h];
            const logoW = Math.min(w, (h * VB_W) / VB_H);
            const cell = Math.min(6.5, Math.max(3.6, logoW / 210));
            dots = sampleLogo(w, h, cell, 0);
            geometry?.remove();
            for (let i = 0; i < dots.n; i++) {
                dots.pos[i * 2] = dots.x[i];
                dots.pos[i * 2 + 1] = dots.y[i];
            }
            geometry = new Geometry(gl, {
                position: { size: 2, data: dots.pos, usage: gl.DYNAMIC_DRAW },
                radius: { size: 1, data: dots.radius },
                heat: { size: 1, data: dots.heat, usage: gl.DYNAMIC_DRAW },
            });
            mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });
        };

        // Pointer: lerped target in canvas space; speed drives the push and the heat.
        const ptr = { tx: -9999, ty: -9999, x: -9999, y: -9999, px: -9999, py: -9999, active: false, last: 0 };
        const onMove = (e: PointerEvent) => {
            const r = wrap.getBoundingClientRect();
            ptr.tx = e.clientX - r.left;
            ptr.ty = e.clientY - r.top;
            if (!ptr.active) {
                ptr.x = ptr.px = ptr.tx;
                ptr.y = ptr.py = ptr.ty;
            }
            ptr.active = ptr.tx > -40 && ptr.ty > -40 && ptr.tx < w + 40 && ptr.ty < h + 40;
            ptr.last = t;
        };
        const onLeave = () => {
            ptr.active = false;
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);

        let visible = true;
        let lastExit = -1;
        let calmFrames = 0; // frames since anything last moved
        const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { rootMargin: "80px" });
        io.observe(wrap);

        const K = 0.055; // spring stiffness
        const DAMP = 0.84; // velocity kept per 60fps frame (slight overshoot)

        const tick = (time: number, deltaTime: number) => {
            t = time;
            if (!visible || document.hidden || !dots || !mesh || !geometry) return;
            const f = Math.min(deltaTime / 16.667, 3);
            const d = dots;

            // Touch screens: with no finger for a while, a slow virtual pointer wanders the logo.
            if (touchIdle()) {
                const L = d.logo;
                ptr.tx = L.x + L.w * (0.5 + 0.42 * Math.sin(t * 0.35));
                ptr.ty = L.y + L.h * (0.55 + 0.3 * Math.sin(t * 0.61 + 1.2));
                ptr.active = true;
            }

            // Lerp the pointer and measure its speed (px per 60fps frame).
            ptr.px = ptr.x;
            ptr.py = ptr.y;
            ptr.x += (ptr.tx - ptr.x) * Math.min(1, 0.35 * f);
            ptr.y += (ptr.ty - ptr.y) * Math.min(1, 0.35 * f);
            const speed = Math.hypot(ptr.x - ptr.px, ptr.y - ptr.py) / f;
            const R = 62 + Math.min(speed * 5, 120);
            const R2 = R * R;

            const exit = reel.footBreak;
            // Broken, the word is wet red ink: a little spread, mostly falling, each dot at its own rate.
            const spread = exit * 0.12;
            const drop = exit * h * 0.42;
            const floor = exit * 1.05; // heat the break holds the dots at (1 and above reads brand red)
            const damp = Math.pow(DAMP, f);
            const cool = Math.pow(0.955, f);
            const push = 1.5 + speed * 0.2;
            const warm = 0.03 + speed * 0.012;

            // Calm: no pointer, scroll still, and the sheet already settled. Then only
            // the star and arc (the idle life) change, and positions are not re-uploaded.
            const scrolling = Math.abs(exit - lastExit) > 0.0005;
            lastExit = exit;
            const busy = ptr.active || scrolling;
            calmFrames = busy ? 0 : calmFrames + 1;
            const calm = calmFrames > 90; // ~1.5s for springs and heat to settle first

            if (!calm) for (let i = 0; i < d.n; i++) {
                // Home, pushed outward from the centre while the word is still broken.
                const tx = d.hx[i] + (d.hx[i] - d.cx) * spread;
                const ty = d.hy[i] + (d.hy[i] - d.cy) * spread + drop * d.fall[i];

                if (ptr.active) {
                    const dx = d.x[i] - ptr.x;
                    const dy = d.y[i] - ptr.y;
                    const dd = dx * dx + dy * dy;
                    if (dd < R2) {
                        const dist = Math.sqrt(dd) + 0.001;
                        const fall = 1 - dist / R;
                        const p = fall * fall * push * f;
                        d.vx[i] += (dx / dist) * p;
                        d.vy[i] += (dy / dist) * p;
                        d.heat[i] = Math.min(1.2, d.heat[i] + fall * warm * f);
                    }
                }
                d.vx[i] = (d.vx[i] + (tx - d.x[i]) * K * f) * damp;
                d.vy[i] = (d.vy[i] + (ty - d.y[i]) * K * f) * damp;
                d.x[i] += d.vx[i] * f;
                d.y[i] += d.vy[i] * f;
                d.heat[i] = Math.max(d.heat[i] * cool, floor);
                d.pos[i * 2] = d.x[i];
                d.pos[i * 2 + 1] = d.y[i];
            }

            // Idle life: the star glints; a heat wave rides the arc every 6 seconds.
            if (exit < 0.3) {
                const glint = 0.012 * (0.5 + 0.5 * Math.sin(t * 2.4));
                for (let j = 0; j < d.star.length; j++) {
                    const i = d.star[j];
                    d.heat[i] = Math.min(0.55, d.heat[i] + glint * f);
                }
                const phase = (t % 6) / 1.5; // the wave runs for 1.5s of every 6
                if (phase <= 1.15) {
                    const count = d.arc.length;
                    for (let j = 0; j < count; j++) {
                        const u = j / count - phase;
                        const g = Math.exp(-(u * u) / 0.004);
                        if (g > 0.02) {
                            const i = d.arc[j];
                            d.heat[i] = Math.min(0.9, d.heat[i] + 0.09 * g * f);
                        }
                    }
                }
            }

            if (calm) {
                // Only the glint and arc dots cool here; everything else is already at rest.
                for (let j = 0; j < d.star.length; j++) d.heat[d.star[j]] = Math.max(d.heat[d.star[j]] * cool, floor);
                for (let j = 0; j < d.arc.length; j++) d.heat[d.arc[j]] = Math.max(d.heat[d.arc[j]] * cool, floor);
            } else {
                geometry.attributes.position.needsUpdate = true;
            }
            geometry.attributes.heat.needsUpdate = true;
            // The ink holds its colour while it falls, then is gone by the end of the break (no smear
            // left hanging over the next section).
            const late = Math.min(1, Math.max(0, (exit - 0.6) / 0.4));
            program.uniforms.uAlpha.value = 1 - late * late * (3 - 2 * late);
            renderer.render({ scene: mesh });

            if (readyRef.current) {
                readyRef.current();
                readyRef.current = undefined;
            }
        };
        const touchIdle = () => touch && t - ptr.last > 3;

        build();
        let rt: number | undefined;
        const ro = new ResizeObserver(() => {
            window.clearTimeout(rt);
            rt = window.setTimeout(build, 150);
        });
        ro.observe(wrap);
        gsap.ticker.add(tick);

        return () => {
            gsap.ticker.remove(tick);
            ro.disconnect();
            io.disconnect();
            window.clearTimeout(rt);
            window.removeEventListener("pointermove", onMove);
            document.documentElement.removeEventListener("pointerleave", onLeave);
            geometry?.remove();
            program.remove();
            renderer.gl.getExtension("WEBGL_lose_context")?.loseContext();
            canvas.remove();
        };
    }, []);

    return <div ref={wrapRef} style={{ position: "absolute", inset: 0 }} />;
}
