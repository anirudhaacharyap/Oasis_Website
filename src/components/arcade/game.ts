import { gsap } from "@/lib/gsap";
import { SYMBOLS, SYMBOL_COUNT, SYMBOL_PLURAL } from "./symbols";

/**
 * The arcade's game state. Plain mutable module state, read on the GSAP ticker by the machines'
 * CRT canvases and the Aim readout (no React re-render per frame).
 *
 * Each machine shows its letter. A hit changes its channel to a random game symbol; three seconds
 * later it flips back to the letter. Five machines on the same symbol at once is a JACKPOT
 * (honestly random, so rare). The Konami code rigs one.
 */
export const CABINETS = ["O", "A", "S", "I", "S"] as const;

/** -1 is the machine's letter; 0..5 a symbol. */
export type Channel = number;
export const LETTER = -1;

export interface Screen {
    /** The channel on screen. */
    ch: Channel;
    /** The channel being switched to while `flip` runs. */
    to: Channel;
    /** Channel change progress, 0..1; 1 means settled. */
    flip: number;
    /** CRT power from the boot, 0..1. */
    power: number;
    /** Marquee lamp from the boot, 0..1. */
    lamp: number;
    /** When a symbol flips back to the letter (performance.now() ms). */
    until: number;
    /** Knock-back from a hit, 1 then springing to 0 (the 3D machines lean back on it). */
    recoil: number;
    tween: gsap.core.Tween | null;
}

export const screens: Screen[] = CABINETS.map(() => ({
    ch: LETTER,
    to: LETTER,
    flip: 1,
    power: 0,
    lamp: 0,
    until: 0,
    recoil: 0,
    tween: null,
}));

/**
 * The pointer and the machines\' on-screen boxes, shared by the 3D scene and the DOM hit targets
 * laid over it. mx/my run -1..1 across the hero; rects are in the scene\'s CSS pixels.
 */
export const aim = {
    aimed: -1,
    mx: 0,
    my: 0,
    rects: CABINETS.map(() => ({ l: 0, t: 0, r: 0, b: 0 })),
};

export const arcade = {
    hits: 0,
    /** Jackpot: its symbol, and when it started (ms); -1 when none is playing. */
    jackSymbol: -1,
    jackStart: -1,
    booted: false,
};

/** How long a jackpot plays on the screens, ms. */
export const JACKPOT_MS = 2800;
/** A symbol holds this long before the machine returns to its letter, ms. */
const HOLD_MS = 3000;

/** The machine under the crosshair or keyboard focus (-1 for none). */
export function setAimed(i: number, on: boolean) {
    if (on) aim.aimed = i;
    else if (aim.aimed === i) aim.aimed = -1;
}

/**
 * The scroll lock in the hero follows the crosshair: of the machines, the one horizontally nearest
 * the pointer is the auto-target, so aiming past the far right holds the right machine instead of
 * snapping back to the middle one. Leaving the hero keeps the last one.
 */
export function holdNearest(machines: (HTMLElement | null)[], clientX: number) {
    let best = -1;
    let bestD = Infinity;
    machines.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.width <= 0) return;
        const d = Math.abs(clientX - (r.left + r.width / 2));
        if (d < bestD) {
            bestD = d;
            best = i;
        }
    });
    if (best < 0) return;
    machines.forEach((el, i) => el?.toggleAttribute("data-lock-auto", i === best));
}

export type ArcadeEvent = { type: "hit"; cabinet: number; hits: number } | { type: "jackpot"; symbol: string; label: string };

const listeners = new Set<(e: ArcadeEvent) => void>();
export function onArcade(fn: (e: ArcadeEvent) => void) {
    listeners.add(fn);
    return () => {
        listeners.delete(fn);
    };
}
const emit = (e: ArcadeEvent) => listeners.forEach((fn) => fn(e));

const calm = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Switch machine i to a channel: picture roll, static, then the new picture (about 200 ms). */
function tune(i: number, to: Channel, delay = 0, onDone?: () => void) {
    const s = screens[i];
    s.tween?.kill();
    if (s.flip < 1) s.ch = s.to; // a channel change cut short lands where it was heading
    s.to = to;
    s.flip = 0;
    s.tween = gsap.to(s, {
        flip: 1,
        duration: calm() ? 0 : 0.22,
        delay,
        ease: "none",
        onComplete: () => {
            s.ch = to;
            s.tween = null;
            onDone?.();
        },
    });
}

/** A hit on machine i: a new random symbol, different from the one showing. */
export function hit(i: number) {
    const s = screens[i];
    arcade.hits++;
    emit({ type: "hit", cabinet: i, hits: arcade.hits });
    if (!calm()) gsap.fromTo(s, { recoil: 1 }, { recoil: 0, duration: 0.7, ease: "elastic.out(1, 0.45)", overwrite: "auto" });
    if (arcade.jackStart >= 0) return; // the jackpot finishes first
    const showing = s.flip < 1 ? s.to : s.ch;
    let k = Math.floor(Math.random() * SYMBOL_COUNT);
    if (k === showing) k = (k + 1 + Math.floor(Math.random() * (SYMBOL_COUNT - 1))) % SYMBOL_COUNT;
    s.until = performance.now() + HOLD_MS;
    tune(i, k, 0, judge);
}

/** After a channel settles: are all five on the same symbol? */
function judge() {
    if (arcade.jackStart >= 0) return;
    if (screens.some((s) => s.flip < 1)) return;
    const k = screens[0].ch;
    if (k === LETTER || !screens.every((s) => s.ch === k)) return;
    jackpot(k);
}

function jackpot(k: number) {
    arcade.jackSymbol = k;
    arcade.jackStart = performance.now();
    const name = SYMBOLS[k];
    emit({ type: "jackpot", symbol: name, label: `Jackpot, five ${SYMBOL_PLURAL[name]}` });
    screens.forEach((s) => (s.until = arcade.jackStart + JACKPOT_MS));
}

/** The cheat (Konami code): every machine tunes to the same symbol, left to right. */
export function forceJackpot() {
    if (arcade.jackStart >= 0) return;
    const k = Math.floor(Math.random() * SYMBOL_COUNT);
    const now = performance.now();
    screens.forEach((s, i) => {
        s.until = now + HOLD_MS;
        tune(i, k, calm() ? 0 : i * 0.12, judge);
    });
}

/**
 * The clock, called every frame by the arcade: symbols whose time is up flip back to their
 * letters (left to right after a jackpot).
 */
export function step(now: number) {
    if (arcade.jackStart >= 0 && now - arcade.jackStart > JACKPOT_MS) {
        arcade.jackStart = -1;
        arcade.jackSymbol = -1;
        screens.forEach((_, i) => tune(i, LETTER, calm() ? 0 : i * 0.08));
        return;
    }
    if (arcade.jackStart >= 0) return;
    screens.forEach((s, i) => {
        if (s.ch !== LETTER && s.flip >= 1 && now > s.until) tune(i, LETTER);
    });
}

/**
 * Power on, left to right: each marquee stutters like a tube catching, then its CRT opens from a
 * bright line into the letter.
 */
export function boot() {
    if (arcade.booted) return;
    arcade.booted = true;
    if (calm()) {
        screens.forEach((s) => {
            s.power = 1;
            s.lamp = 1;
        });
        return;
    }
    const tl = gsap.timeline({ delay: 0.15 });
    screens.forEach((s, i) => {
        tl.to(
            s,
            {
                keyframes: [
                    { lamp: 0.8, duration: 0.04 },
                    { lamp: 0.1, duration: 0.07 },
                    { lamp: 0.9, duration: 0.04 },
                    { lamp: 0.3, duration: 0.05 },
                    { lamp: 1, duration: 0.08 },
                ],
            },
            i * 0.09,
        );
        tl.to(s, { power: 1, duration: 0.5, ease: "power2.out" }, 0.2 + i * 0.09);
    });
}
