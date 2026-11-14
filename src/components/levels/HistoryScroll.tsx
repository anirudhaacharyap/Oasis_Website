"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";

const SAMPLES = 160;

/**
 * Scroll behaviour for the History timeline: draws the gold arc, rides the star on its tip,
 * aligns the dots to the curve and swaps the sticky year. The static markup is complete without it.
 */
export default function HistoryScroll({ years, children }: { years: string[]; children: ReactNode }) {
    const root = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const el = root.current;
            if (!el) return;
            const list = el.querySelector<HTMLElement>("[data-list]");
            const path = el.querySelector<SVGPathElement>("[data-arc]");
            const star = el.querySelector<SVGElement>("[data-star]");
            const yearEl = el.querySelector<HTMLElement>("[data-year]");
            const slotEl = el.querySelector<HTMLElement>("[data-slot]");
            const items = gsap.utils.toArray<HTMLElement>("[data-item]", el);
            if (!list || !path || !star || !yearEl || !slotEl) return;

            const mm = gsap.matchMedia();

            mm.add({ desk: "(min-width: 900px)", motion: MQ.motionOk }, (ctx) => {
                const { motion } = ctx.conditions as { desk: boolean; motion: boolean };
                const section = el.closest<HTMLElement>("section");
                let xs: number[] = [];
                let ys: number[] = [];
                let cum: number[] = [];
                let total = 1;
                const state = { p: 1 };

                // Sample the path in screen space (the SVG is stretched vertically).
                const build = () => {
                    const H = list.offsetHeight;
                    const userLen = path.getTotalLength();
                    xs = [];
                    ys = [];
                    cum = [];
                    let acc = 0;
                    for (let i = 0; i <= SAMPLES; i++) {
                        const pt = path.getPointAtLength((userLen * i) / SAMPLES);
                        const y = (pt.y * H) / 1000;
                        if (i > 0) acc += Math.hypot(pt.x - xs[i - 1], y - ys[i - 1]);
                        xs.push(pt.x);
                        ys.push(y);
                        cum.push(acc);
                    }
                    total = acc || 1;
                    path.style.strokeDasharray = `${total}`;
                };

                const search = (arr: number[], target: number) => {
                    let lo = 0;
                    let hi = SAMPLES;
                    while (lo < hi) {
                        const mid = (lo + hi) >> 1;
                        if (arr[mid] < target) lo = mid + 1;
                        else hi = mid;
                    }
                    return lo;
                };

                const render = () => {
                    path.style.strokeDashoffset = `${total * (1 - state.p)}`;
                    const i = search(cum, state.p * total);
                    star.style.left = `${xs[i]}px`;
                    star.style.top = `${ys[i]}px`;
                };

                const placeDots = () => {
                    const base = list.getBoundingClientRect().top;
                    items.forEach((item) => {
                        const y = item.getBoundingClientRect().top - base + 14;
                        item.style.setProperty("--dot-x", `${xs[search(ys, y)]}px`);
                    });
                };

                const layout = () => {
                    build();
                    placeDots();
                    render();
                };

                layout();
                const ro = new ResizeObserver(layout);
                ro.observe(list);

                const cleanups: Array<() => void> = [
                    () => {
                        ro.disconnect();
                        path.style.strokeDasharray = "";
                        path.style.strokeDashoffset = "";
                        star.style.left = "";
                        star.style.top = "";
                        items.forEach((item) => item.style.removeProperty("--dot-x"));
                    },
                ];

                if (motion) {
                    section?.setAttribute("data-live", "");
                    cleanups.push(() => section?.removeAttribute("data-live"));

                    state.p = 0;
                    render();
                    gsap.to(state, {
                        p: 1,
                        ease: "none",
                        onUpdate: render,
                        scrollTrigger: { trigger: list, start: "top 70%", end: "bottom 60%", scrub: 0.6 },
                    });

                    let current = -1;
                    const setActive = (i: number) => {
                        if (i === current) return;
                        const prev = current;
                        current = i;
                        slotEl.textContent = String(i + 1);
                        if (prev >= 0 && years[prev] === years[i]) return;
                        gsap.killTweensOf(yearEl);
                        yearEl.textContent = years[i];
                        if (prev < 0) return;
                        const dir = i > prev ? 1 : -1;
                        gsap.fromTo(
                            yearEl,
                            { translate: `0 ${60 * dir}%`, opacity: 0 },
                            { translate: "0 0%", opacity: 1, duration: 0.35, ease: "power3.out" },
                        );
                    };
                    setActive(0);
                    items.forEach((item, i) => {
                        ScrollTrigger.create({
                            trigger: item,
                            start: "top 50%",
                            end: "bottom 50%",
                            onToggle: (self) => {
                                if (self.isActive) setActive(i);
                            },
                        });
                    });
                    cleanups.push(() => {
                        gsap.killTweensOf(yearEl);
                        yearEl.textContent = years[0];
                        slotEl.textContent = "1";
                        yearEl.style.translate = "";
                        yearEl.style.opacity = "";
                    });
                }

                return () => cleanups.forEach((fn) => fn());
            });

            return () => mm.revert();
        },
        { scope: root, dependencies: [years] },
    );

    return <div ref={root}>{children}</div>;
}
