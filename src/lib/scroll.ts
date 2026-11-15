import type Lenis from "lenis";

/** Height of the fixed nav (4.5rem), so anchored levels land just below it. */
export const NAV_OFFSET = -72;

/** The page's Lenis instance, set by SmoothScroll (absent under reduced motion). */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
    lenis = instance;
}

/** Pause Lenis (phone menu open, modals). Native scroll locking is the caller's job. */
export function stopScroll() {
    lenis?.stop();
}

/** Resume Lenis after stopScroll. */
export function startScroll() {
    lenis?.start();
}

/** Strong ease-out, matching --ease-out (expo-like). */
const easeOut = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

/** Scroll to a level by id, through Lenis when it is running. */
export function scrollToLevel(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: NAV_OFFSET, duration: 1.2, easing: easeOut });
    else el.scrollIntoView({ behavior: "auto", block: "start" });
    // Move focus for keyboard and screen-reader users without a second scroll.
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
}
