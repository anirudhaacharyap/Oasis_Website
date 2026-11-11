"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";

/**
 * Fades/slides in every descendant marked `data-reveal` as it scrolls into view.
 * Content is fully visible without JS and for reduced-motion users.
 */
export default function Reveal({
    children,
    className,
    as: Tag = "div",
}: {
    children: React.ReactNode;
    className?: string;
    as?: "div" | "section";
}) {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add(MQ.motionOk, () => {
                const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", ref.current);
                if (!items.length) return;
                gsap.set(items, { autoAlpha: 0, y: 28 });
                ScrollTrigger.batch(items, {
                    start: "top 90%",
                    once: true,
                    onEnter: (batch) =>
                        gsap.to(batch, {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.6,
                            stagger: 0.08,
                            ease: "power3.out",
                            overwrite: true,
                        }),
                });
            });
        },
        { scope: ref }
    );

    return (
        <Tag ref={ref} className={className}>
            {children}
        </Tag>
    );
}
