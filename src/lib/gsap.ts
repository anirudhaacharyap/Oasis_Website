"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register plugins once. useGSAP scopes every animation to its component and
// reverts only that component's tweens/triggers on unmount.
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/** Media queries shared by every animated section. */
export const MQ = {
    motionOk: "(prefers-reduced-motion: no-preference)",
    desktopMotion: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
};

export { gsap, ScrollTrigger, useGSAP };
