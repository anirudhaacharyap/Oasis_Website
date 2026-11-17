"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { reel } from "@/lib/reel";

/**
 * The title is the first shot. On a large screen it holds for a short beat while the
 * wordmark breaks apart, then the page scrolls on. A phone does not pin: the same
 * break plays as the title leaves. Reduced motion does not run it.
 */
export default function Reel() {
    useEffect(() => {
        const mm = gsap.matchMedia();

        const bind = (pin: boolean, end: string) => {
            const hero = document.getElementById("play");
            if (!hero) return () => {};
            const st = ScrollTrigger.create({
                trigger: hero,
                start: "top top",
                end,
                pin,
                pinSpacing: pin,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    reel.heroBreak = self.progress;
                },
            });
            return () => {
                st.kill();
                reel.heroBreak = 0;
            };
        };

        mm.add("(min-width: 861px) and (prefers-reduced-motion: no-preference)", () => bind(true, "+=60%"));
        mm.add("(max-width: 860px) and (prefers-reduced-motion: no-preference)", () => bind(false, "bottom top"));

        // The bookend: the footer's wordmark starts as the fallen red ink and has reassembled just
        // before the end of the page, where it is the last frame. No pin; it plays as you arrive.
        mm.add("(prefers-reduced-motion: no-preference)", () => {
            const mark = document.querySelector<HTMLElement>("[data-foot-mark]");
            if (!mark) return () => {};
            reel.footBreak = 1;
            const st = ScrollTrigger.create({
                trigger: mark,
                start: "top bottom",
                endTrigger: document.documentElement,
                end: "bottom-=40 bottom",
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    reel.footBreak = 1 - self.progress;
                },
                onRefresh: (self) => {
                    reel.footBreak = 1 - self.progress;
                },
            });
            return () => {
                st.kill();
                reel.footBreak = 0;
            };
        });

        return () => mm.revert();
    }, []);

    return null;
}
