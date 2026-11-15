/**
 * Shared state between the dot logo and the hero's reticle cursor.
 * Plain mutable module state, read on the GSAP ticker (no React re-renders per frame).
 */
export interface HeroState {
    /** True while the pointer is over the logo's bounds (the reticle opens up). */
    overLogo: boolean;
    /** Current scatter radius in CSS px (the reticle matches it over the logo). */
    radius: number;
    /** 0..1 heat under the pointer right now (the reticle's ticks warm with it). */
    heat: number;
}

export const heroState: HeroState = { overLogo: false, radius: 70, heat: 0 };

type PressListener = (clientX: number, clientY: number) => void;
const pressListeners = new Set<PressListener>();

/** A press in the hero: the logo answers with a heat burst, the cursor with a pulse ring. */
export function emitPress(clientX: number, clientY: number) {
    pressListeners.forEach((fn) => fn(clientX, clientY));
}

export function onPress(fn: PressListener) {
    pressListeners.add(fn);
    return () => {
        pressListeners.delete(fn);
    };
}
