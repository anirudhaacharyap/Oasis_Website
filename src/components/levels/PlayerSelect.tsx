"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import type { Member } from "@/data/types";
import { isPlaceholderUrl } from "@/lib/content";
import Monogram from "./Monogram";
import styles from "./Members.module.css";

const GROUPS: { tier: Member["tier"]; label: string }[] = [
    { tier: "Core", label: "Core" },
    { tier: "Lead", label: "Leads" },
    { tier: "Member", label: "Members" },
];

export default function PlayerSelect({ members }: { members: Member[] }) {
    const [locked, setLocked] = useState(0);
    const [cursor, setCursor] = useState(0);
    const [tab, setTab] = useState(0);
    const root = useRef<HTMLDivElement>(null);
    const panel = useRef<HTMLElement>(null);
    const grid = useRef<HTMLDivElement>(null);
    const first = useRef(true);

    const shown = members[cursor] ?? members[0];
    const links = (shown.links ?? []).filter((l) => !isPlaceholderUrl(l.url));

    useGSAP(
        () => {
            if (first.current) {
                first.current = false;
                return;
            }
            const mm = gsap.matchMedia();
            mm.add(MQ.motionOk, () => {
                gsap.fromTo(
                    "[data-swap]",
                    { x: 12, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.35, ease: "power3.out", stagger: 0.03, clearProps: "transform,opacity" },
                );
                const frame = grid.current?.querySelector("[data-cursor]");
                if (frame) {
                    gsap.fromTo(
                        frame,
                        { scale: 1.06 },
                        { scale: 1, duration: 0.3, ease: "back.out(3)", clearProps: "transform,scale" },
                    );
                }
            });
            return () => mm.revert();
        },
        { scope: root, dependencies: [cursor] },
    );

    const tiles = () => Array.from(grid.current?.querySelectorAll<HTMLButtonElement>("[data-tile]") ?? []);

    const moveTo = (i: number) => {
        setTab(i);
        setCursor(i);
        tiles()[i]?.focus();
    };

    const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
        const n = members.length;
        const els = tiles();
        const cols = els.filter((el) => el.offsetTop === els[0].offsetTop).length || 4;
        let next = tab;
        switch (e.key) {
            case "ArrowRight":
                next = (tab + 1) % n;
                break;
            case "ArrowLeft":
                next = (tab - 1 + n) % n;
                break;
            case "ArrowDown":
                next = tab + cols < n ? tab + cols : tab % cols;
                break;
            case "ArrowUp": {
                if (tab - cols >= 0) next = tab - cols;
                else {
                    const lastRowStart = Math.floor((n - 1) / cols) * cols;
                    const c = tab % cols;
                    next = lastRowStart + c < n ? lastRowStart + c : lastRowStart - cols + c;
                }
                break;
            }
            case "Home":
                next = 0;
                break;
            case "End":
                next = n - 1;
                break;
            default:
                return;
        }
        e.preventDefault();
        moveTo(next);
    };

    const lock = (i: number) => {
        setLocked(i);
        setCursor(i);
        setTab(i);
        if (window.matchMedia("(max-width: 999px)").matches && panel.current) {
            const r = panel.current.getBoundingClientRect();
            if (r.top < 0 || r.bottom > window.innerHeight) {
                const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                panel.current.scrollIntoView({ block: "nearest", behavior: calm ? "auto" : "smooth" });
            }
        }
    };

    const hover = (i: number, e: PointerEvent) => {
        if (e.pointerType === "mouse") setCursor(i);
    };

    return (
        <div className={styles.select} ref={root}>
            <aside className={styles.panel} ref={panel} aria-label="Selected player">
                <div className={styles.panelInner}>
                    <div className={styles.panelMono} data-swap>
                        <Monogram member={shown} sizes="(min-width: 1000px) 26rem, 9rem" />
                    </div>
                    <div className={styles.panelText} aria-live="polite" aria-atomic="true">
                        <p className={`display ${styles.handle}`} data-swap>
                            @{shown.handle}
                        </p>
                        <p className={styles.name} data-swap>
                            {shown.name}
                        </p>
                        <p className="hud" data-swap>
                            {shown.role} / {shown.tier}
                        </p>
                        <dl className={styles.stats} data-swap>
                            <div className={styles.stat}>
                                <dt className="hud">Main</dt>
                                <dd>{shown.main}</dd>
                            </div>
                            <div className={styles.stat}>
                                <dt className="hud">Branch</dt>
                                <dd>{shown.detail}</dd>
                            </div>
                        </dl>
                        {links.length > 0 && (
                            <p className={styles.links} data-swap>
                                {links.map((l) => (
                                    <a key={l.url} className="snap-link" href={l.url} target="_blank" rel="noopener noreferrer">
                                        {l.label}
                                    </a>
                                ))}
                            </p>
                        )}
                    </div>
                </div>
            </aside>

            <div
                className={styles.roster}
                ref={grid}
                role="group"
                aria-label="Players"
                onKeyDown={onKey}
                onPointerLeave={(e) => {
                    if (e.pointerType === "mouse") setCursor(locked);
                }}
                onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) setCursor(locked);
                }}
            >
                {GROUPS.map((g) => (
                    <div className={styles.group} key={g.tier}>
                        <p className={`hud ${styles.groupLabel}`}>{g.label}</p>
                        <div className={styles.tiles}>
                            {members.map((m, i) =>
                                m.tier !== g.tier ? null : (
                                    <button
                                        key={m.handle}
                                        type="button"
                                        data-tile
                                        className={styles.tile}
                                        aria-pressed={locked === i}
                                        aria-label={`${m.name}, ${m.role}`}
                                        tabIndex={tab === i ? 0 : -1}
                                        onPointerEnter={(e) => hover(i, e)}
                                        onFocus={() => {
                                            setTab(i);
                                            setCursor(i);
                                        }}
                                        onClick={() => lock(i)}
                                    >
                                        <span className={styles.tileMono}>
                                            <Monogram member={m} sizes="(min-width: 1000px) 10rem, 30vw" />
                                            {cursor === i && (
                                                <span className={styles.frame} data-cursor aria-hidden="true">
                                                    <i />
                                                    <i />
                                                    <i />
                                                    <i />
                                                </span>
                                            )}
                                        </span>
                                        <span className={styles.tileHandle}>{m.handle}</span>
                                    </button>
                                ),
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
