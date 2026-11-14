"use client";

import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";

/**
 * Page-level motion, registered once:
 * 1. Level tones: the page colour scrubs from one level's field to the next instead of
 *    hard-cutting (sections go transparent and <html> carries the colour).
 * 2. Reveals: every [data-reveal] block snaps in as it enters the viewport.
 * Both are skipped under reduced motion, where the static fields and content stay as they are.
 */
const TONES: Record<string, string> = {
    ground: "#A3161D",
    deep: "#6E0D12",
    void: "#1C0507",
    gold: "#C8A15A",
};

const toneOf = (el: HTMLElement) => TONES[/tone-(\w+)/.exec(el.className)?.[1] ?? "ground"] ?? TONES.ground;

export default function Motion() {
    useGSAP(() => {
        const mm = gsap.matchMedia();
        mm.add(MQ.motionOk, () => {
            const root = document.documentElement;
            const levels = gsap.utils.toArray<HTMLElement>("main > .level");
            if (levels.length) {
                root.style.setProperty("--page", toneOf(levels[0]));
                root.classList.add("tone-live");
                levels.forEach((el, i) => {
                    if (i === 0) return;
                    const from = toneOf(levels[i - 1]);
                    const to = toneOf(el);
                    if (from === to) return;
                    gsap.fromTo(
                        root,
                        { "--page": from },
                        {
                            "--page": to,
                            ease: "none",
                            immediateRender: false,
                            scrollTrigger: { trigger: el, start: "top 80%", end: "top 35%", scrub: true },
                        }
                    );
                });
            }

            const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
            gsap.set(items, { autoAlpha: 0, y: 40 });
            ScrollTrigger.batch(items, {
                start: "top 88%",
                once: true,
                onEnter: (batch) =>
                    gsap.to(batch, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.9,
                        stagger: 0.06,
                        ease: "power4.out",
                        overwrite: true,
                        clearProps: "opacity,visibility,transform",
                    }),
            });

            // Fonts and the 3D canvas can shift layout after first paint.
            document.fonts?.ready.then(() => ScrollTrigger.refresh());

            return () => {
                root.classList.remove("tone-live");
                root.style.removeProperty("--page");
            };
        });
    });

    return null;
}
