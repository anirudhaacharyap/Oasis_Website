import type Lenis from "lenis";

/** The page's Lenis instance, set by SmoothScroll (absent under reduced motion). */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
    lenis = instance;
}

/** Scroll to a level by id, through Lenis when it is running. */
export function scrollToLevel(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { duration: 1.4 });
    else el.scrollIntoView({ behavior: "auto", block: "start" });
    // Move focus for keyboard and screen-reader users without a second scroll.
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
}
