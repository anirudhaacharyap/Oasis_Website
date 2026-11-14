"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/scroll";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
 * Disabled for users who prefer reduced motion.
 */
export default function SmoothScroll() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const lenis = new Lenis({
            duration: 1.1,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            anchors: true,
        });

        lenis.on("scroll", ScrollTrigger.update);
        setLenis(lenis);

        // Keep a reference to the exact function added so it can be removed.
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(tick);
            gsap.ticker.lagSmoothing(500, 33);
            setLenis(null);
            lenis.destroy();
        };
    }, []);

    return null;
}
