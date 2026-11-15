"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { scrollToLevel } from "@/lib/scroll";
import type { PadInput, Pulse } from "@/components/hero/pad";
import SpawnPad from "./SpawnPad";
import styles from "./SpawnSelect.module.css";

const domains = site.domains;

function isTextField(el: EventTarget | null) {
    if (!(el instanceof HTMLElement)) return false;
    return el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
}

export default function SpawnSelect() {
    const [selected, setSelected] = useState(0);
    const [pulse, setPulse] = useState<Pulse | null>(null);
    const pulseId = useRef(0);
    const rows = useRef<(HTMLButtonElement | null)[]>([]);
    const inView = useRef(false);

    const step = useCallback((delta: number) => {
        setSelected((i) => (i + delta + domains.length) % domains.length);
    }, []);

    const press = useCallback((key: PadInput) => setPulse({ key, id: ++pulseId.current }), []);

    const onPadInput = useCallback(
        (key: PadInput) => {
            press(key);
            if (key === "up" || key === "left") step(-1);
            else if (key === "down" || key === "right") step(1);
            else if (key === "start") scrollToLevel("play");
            else window.open(site.links.join, "_blank", "noopener");
        },
        [press, step]
    );

    // Join counts as "in view" at half the section, or half the screen on tall phone layouts.
    useEffect(() => {
        const el = document.getElementById("join");
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                inView.current =
                    entry.intersectionRatio >= 0.5 || entry.intersectionRect.height >= window.innerHeight * 0.5;
            },
            { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
            if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
            if (!inView.current || isTextField(e.target)) return;
            // A focused domain button handles its own arrows.
            if (e.target instanceof HTMLElement && e.target.closest("[data-spawn-group]")) return;
            e.preventDefault();
            const up = e.key === "ArrowUp";
            press(up ? "up" : "down");
            step(up ? -1 : 1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [press, step]);

    const onGroupKey = (e: React.KeyboardEvent) => {
        let next: number | null = null;
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (selected - 1 + domains.length) % domains.length;
        else if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (selected + 1) % domains.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = domains.length - 1;
        if (next === null) return;
        e.preventDefault();
        setSelected(next);
        rows.current[next]?.focus();
    };

    return (
        <div className={styles.select}>
            <div className={styles.left}>
                <div
                    className={styles.domains}
                    role="group"
                    aria-label="Pick your spawn point"
                    data-spawn-group
                    onKeyDown={onGroupKey}
                >
                    {domains.map((domain, i) => {
                        const on = i === selected;
                        return (
                            <button
                                key={domain}
                                ref={(el) => {
                                    rows.current[i] = el;
                                }}
                                type="button"
                                className={`${styles.domain} ${on ? styles.on : ""}`}
                                aria-pressed={on}
                                tabIndex={on ? 0 : -1}
                                onClick={() => setSelected(i)}
                            >
                                <svg className={styles.chevron} viewBox="0 0 10 16" aria-hidden="true" focusable="false">
                                    <path d="M2 2l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
                                </svg>
                                <span className={styles.text}>{domain}</span>
                            </button>
                        );
                    })}
                </div>

                <div className={styles.ctaBlock}>
                    <a className={`btn btn--ink ${styles.cta}`} href={site.links.join} target="_blank" rel="noopener noreferrer">
                        Apply for {domains[selected]}
                        <svg className="arrow" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                            <path d="M4 10 10 4M5 4h5v5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                        </svg>
                        <span className="sr-only">(opens in a new tab)</span>
                    </a>
                    <p className={`label ${styles.hint}`}>
                        <span className={styles.hintFine}>D-pad to pick, A to apply</span>
                        <span className={styles.hintTouch}>Tap a domain, then apply</span>
                    </p>
                </div>
            </div>

            <div className={styles.pad}>
                <SpawnPad selected={selected} name={domains[selected]} onInput={onPadInput} pulse={pulse} />
            </div>
        </div>
    );
}
