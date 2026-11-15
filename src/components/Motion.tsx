"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, SplitText, MQ } from "@/lib/gsap";

/**
 * Page-level motion. Section headings reveal once, line by line, rising out of a mask (the only
 * scroll-triggered text motion on the page; no generic fade-ins). Nothing is split under reduced
 * motion. Also refreshes ScrollTrigger once fonts settle the layout.
 */
export default function Motion() {
    useEffect(() => {
        let cancelled = false;
        const mm = gsap.matchMedia();

        mm.add(MQ.motionOk, () => {
            const splits: SplitText[] = [];
            const triggers: ScrollTrigger[] = [];

            // Measure lines with the real font, otherwise they re-wrap after the split.
            (document.fonts?.ready ?? Promise.resolve()).then(() => {
                if (cancelled) return;
                const heads = document.querySelectorAll<HTMLElement>("main .level:not(#play) h2.display");
                heads.forEach((head) => {
                    const split = SplitText.create(head, { type: "lines", mask: "lines", linesClass: "split-line" });
                    splits.push(split);
                    gsap.set(split.lines, { yPercent: 100 });
                    triggers.push(
                        ScrollTrigger.create({
                            trigger: head,
                            start: "top 85%",
                            once: true,
                            onEnter: () =>
                                gsap.to(split.lines, {
                                    yPercent: 0,
                                    duration: 0.9,
                                    ease: "expo.out",
                                    stagger: 0.08,
                                    overwrite: true,
                                }),
                        })
                    );
                });
                ScrollTrigger.refresh();
            });

            return () => {
                cancelled = true;
                triggers.forEach((t) => t.kill());
                splits.forEach((s) => s.revert());
            };
        });

        return () => {
            cancelled = true;
            mm.revert();
        };
    }, []);
    return null;
}
