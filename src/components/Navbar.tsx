"use client";

import { useEffect, useRef, useState } from "react";
import { levels } from "@/lib/content";
import styles from "./Navbar.module.css";

/**
 * Four-corner frame: wordmark top left, level links + Join top right.
 * On phones a "Menu" button opens a full-screen overlay. The overlay is a sibling of the
 * header (never inside it), so the header's translate can't become its containing block.
 */
export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [away, setAway] = useState(false);
    const [solid, setSolid] = useState(false);
    const [current, setCurrent] = useState<string>("play");
    const buttonRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    // Step aside while scrolling down, come back on scroll up (patterns.md #6).
    useEffect(() => {
        let last = window.scrollY;
        const onScroll = () => {
            const y = window.scrollY;
            setSolid(y > 40);
            if (Math.abs(y - last) < 6) return;
            setAway(y > 240 && y > last);
            last = y;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Which level is in the middle of the viewport.
    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id)),
            { rootMargin: "-45% 0px -50% 0px" }
        );
        levels.forEach((level) => {
            const el = document.getElementById(level.id);
            if (el) io.observe(el);
        });
        return () => io.disconnect();
    }, []);

    // Menu overlay: lock scroll, focus the first link, Escape closes, focus returns to the button.
    useEffect(() => {
        if (!open) return;
        const root = document.documentElement;
        root.classList.add("menu-open");
        panelRef.current?.querySelector<HTMLElement>("a")?.focus();
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
            if (e.key !== "Tab" || !panelRef.current) return;
            const focusables = panelRef.current.querySelectorAll<HTMLElement>("a, button");
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        window.addEventListener("keydown", onKey);
        const button = buttonRef.current;
        return () => {
            root.classList.remove("menu-open");
            window.removeEventListener("keydown", onKey);
            button?.focus();
        };
    }, [open]);

    const links = levels.filter((level) => level.id !== "play" && level.id !== "join");

    return (
        <>
            <header className={styles.bar} data-away={away && !open ? "" : undefined} data-solid={solid ? "" : undefined}>
                <a href="#play" className={styles.word} aria-label="OASIS, back to the title screen">
                    OASIS
                </a>
                <nav aria-label="Levels" className={styles.links}>
                    {links.map((level) => (
                        <a
                            key={level.id}
                            href={`#${level.id}`}
                            className={`${styles.link} snap-link`}
                            aria-current={current === level.id ? "location" : undefined}
                        >
                            {level.label}
                        </a>
                    ))}
                </nav>
                <a href="#join" className={`btn btn--gold ${styles.join}`} style={{ ["--glyph-ink" as string]: "var(--gold)" }}>
                    <span className="glyph" aria-hidden="true">
                        <span>A</span>
                    </span>
                    Join
                </a>
                <button
                    ref={buttonRef}
                    type="button"
                    className={styles.menuBtn}
                    aria-expanded={open}
                    aria-controls="menu-panel"
                    onClick={() => setOpen((o) => !o)}
                >
                    {open ? "Close" : "Menu"}
                </button>
            </header>

            <div
                id="menu-panel"
                ref={panelRef}
                className={styles.panel}
                data-open={open ? "" : undefined}
                hidden={!open}
                role="dialog"
                aria-modal="true"
                aria-label="Menu"
            >
                <nav aria-label="Levels" className={styles.panelLinks}>
                    {levels.map((level) => (
                        <a key={level.id} href={`#${level.id}`} onClick={() => setOpen(false)} className={styles.panelLink}>
                            <span className="hud">{level.hud}</span>
                            <span>{level.label}</span>
                        </a>
                    ))}
                </nav>
                <button type="button" className={`btn ${styles.panelClose}`} onClick={() => setOpen(false)}>
                    Close menu
                </button>
            </div>
        </>
    );
}
