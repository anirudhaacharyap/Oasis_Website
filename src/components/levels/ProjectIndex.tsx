"use client";

import { useId, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { isPlaceholderUrl } from "@/lib/content";
import type { Project } from "@/data/types";
import ProjectCover from "./ProjectCover";
import s from "./Projects.module.css";

/** Must match the preview-mode media query in Projects.module.css. */
const PREVIEW_MQ = "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export default function ProjectIndex({ projects }: { projects: Project[] }) {
    const base = useId();
    const scope = useRef<HTMLDivElement>(null);
    const list = useRef<HTMLOListElement>(null);
    const preview = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState<string | null>(null);
    const [active, setActive] = useState<string | null>(null);

    useGSAP(
        () => {
            const box = preview.current;
            const ol = list.current;
            if (!box || !ol) return;
            const mm = gsap.matchMedia();

            mm.add(PREVIEW_MQ, () => {
                const qx = gsap.quickTo(box, "x", { duration: 0.6, ease: "power3.out" });
                const qy = gsap.quickTo(box, "y", { duration: 0.6, ease: "power3.out" });
                const qr = gsap.quickTo(box, "rotate", { duration: 0.6, ease: "power3.out" });
                let shown = false;
                let px = 0;
                let py = 0;
                let lastX = 0;
                let current: string | null = null;
                const settle = gsap.delayedCall(0.09, () => qr(0));
                settle.pause();

                const place = (x: number, y: number, jump: boolean) => {
                    const w = box.offsetWidth;
                    const tx = x > window.innerWidth * 0.6 ? x - w * 0.65 - 24 : x + w * 0.65 + 24;
                    if (jump) gsap.set(box, { x: tx, y });
                    else {
                        qx(tx);
                        qy(y);
                    }
                };

                const show = (slug: string) => {
                    if (slug !== current) {
                        current = slug;
                        setActive(slug);
                    }
                    if (shown) return;
                    shown = true;
                    place(px, py, true);
                    gsap.fromTo(box, { scale: 0.85 }, { scale: 1, autoAlpha: 1, duration: 0.35, ease: "power3.out", overwrite: "auto" });
                };

                const hide = () => {
                    if (!shown) return;
                    shown = false;
                    current = null;
                    gsap.to(box, { autoAlpha: 0, scale: 0.85, duration: 0.25, ease: "power2.in", overwrite: "auto" });
                };

                const slugAt = (x: number, y: number) =>
                    (document.elementFromPoint(x, y) as HTMLElement | null)?.closest<HTMLElement>("[data-slug]")?.dataset.slug ?? null;

                const onMove = (e: PointerEvent) => {
                    if (e.pointerType !== "mouse") return;
                    const dx = e.clientX - lastX;
                    lastX = e.clientX;
                    px = e.clientX;
                    py = e.clientY;
                    const slug = slugAt(px, py);
                    if (!slug) return hide();
                    show(slug);
                    place(px, py, false);
                    qr(gsap.utils.clamp(-10, 10, dx * 0.5));
                    settle.restart(true);
                };
                const onScroll = () => {
                    if (!shown) return;
                    const slug = slugAt(px, py);
                    if (slug) show(slug);
                    else hide();
                };
                const onFocusIn = (e: FocusEvent) => {
                    const t = e.target as HTMLElement;
                    const li = t.closest<HTMLElement>("[data-slug]");
                    if (!li || !t.matches(":focus-visible")) return;
                    const r = li.getBoundingClientRect();
                    px = window.innerWidth * 0.78;
                    py = r.top + r.height / 2;
                    show(li.dataset.slug!);
                    place(px, py, false);
                };
                const onFocusOut = () => {
                    if (!ol.matches(":hover")) hide();
                };

                ol.addEventListener("pointermove", onMove);
                ol.addEventListener("pointerleave", hide);
                ol.addEventListener("focusin", onFocusIn);
                ol.addEventListener("focusout", onFocusOut);
                window.addEventListener("scroll", onScroll, { passive: true });
                return () => {
                    ol.removeEventListener("pointermove", onMove);
                    ol.removeEventListener("pointerleave", hide);
                    ol.removeEventListener("focusin", onFocusIn);
                    ol.removeEventListener("focusout", onFocusOut);
                    window.removeEventListener("scroll", onScroll);
                    settle.kill();
                    gsap.set(box, { clearProps: "all" });
                };
            });
        },
        { scope },
    );

    return (
        <div ref={scope}>
            <ol ref={list} className={s.list}>
                {projects.map((p, i) => {
                    const isOpen = open === p.slug;
                    const panelId = `${base}-panel-${p.slug}`;
                    const btnId = `${base}-btn-${p.slug}`;
                    const real = !isPlaceholderUrl(p.url);
                    return (
                        <li key={p.slug} className={s.item} data-slug={p.slug} data-open={isOpen || undefined} data-reveal>
                            <h3 className={s.head}>
                                <button
                                    id={btnId}
                                    type="button"
                                    className={s.row}
                                    aria-expanded={isOpen}
                                    aria-controls={panelId}
                                    onClick={() => setOpen(isOpen ? null : p.slug)}
                                >
                                    <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
                                    <span className={s.thumb} aria-hidden="true">
                                        <ProjectCover project={p} sizes="72px" />
                                    </span>
                                    <span className={s.name}>{p.title}</span>
                                    <span className={s.meta}>
                                        <span>{p.kind}</span>
                                        <span>{p.engine}</span>
                                    </span>
                                    <span className={s.year}>{p.year}</span>
                                </button>
                            </h3>
                            <div id={panelId} role="region" aria-labelledby={btnId} className={s.panel} inert={!isOpen}>
                                <div className={s.panelClip}>
                                    <div className={s.panelInner}>
                                        <div className={s.panelCover} aria-hidden="true">
                                            <ProjectCover project={p} sizes="240px" />
                                        </div>
                                        <p className={s.pitch}>{p.pitch}</p>
                                        <div className={s.side}>
                                            <ul className={s.team} aria-label="Team">
                                                {p.team.map((h) => (
                                                    <li key={h} className={s.chip}>
                                                        @{h}
                                                    </li>
                                                ))}
                                            </ul>
                                            {real ? (
                                                <a className={`snap-link ${s.link}`} href={p.url} target="_blank" rel="noopener noreferrer">
                                                    View project
                                                </a>
                                            ) : (
                                                <p className={s.soon}>Link coming soon</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ol>

            <div ref={preview} className={s.preview} aria-hidden="true">
                {projects.map((p) => (
                    <div key={p.slug} className={s.previewCover} data-on={active === p.slug || undefined}>
                        <ProjectCover project={p} sizes="22vw" />
                    </div>
                ))}
            </div>
        </div>
    );
}
