"use client";

import { useEffect, useRef, useState } from "react";
import { levels } from "@/lib/content";
import { scrollToLevel, startScroll, stopScroll } from "@/lib/scroll";
import Logo from "@/components/brand/Logo";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import styles from "./Navbar.module.css";

/**
 * Four-corner frame: wordmark top left, level links + Join top right.
 * On phones a "Menu" button opens a full-screen Sheet (Base UI dialog: focus trap, Escape and
 * scroll lock come with it). The sheet portals to the body, outside the header's translate.
 */
export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [away, setAway] = useState(false);
    const [solid, setSolid] = useState(false);
    const [current, setCurrent] = useState<string>("play");
    const pending = useRef<string | null>(null);

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

    // Growing past the phone layout while the sheet is open would strand its scroll lock.
    useEffect(() => {
        const mq = window.matchMedia("(min-width: 861px)");
        const on = () => {
            if (mq.matches) setOpen(false);
        };
        mq.addEventListener("change", on);
        return () => mq.removeEventListener("change", on);
    }, []);

    // Base UI locks native scroll while the sheet is open; Lenis has to stop too.
    useEffect(() => {
        if (!open) return;
        stopScroll();
        return () => startScroll();
    }, [open]);

    // Scroll to the chosen level once the sheet has closed and released its scroll lock.
    const onOpenChangeComplete = (isOpen: boolean) => {
        if (isOpen || !pending.current) return;
        const id = pending.current;
        pending.current = null;
        scrollToLevel(id);
    };

    const links = levels.filter((level) => level.id !== "play" && level.id !== "join");

    return (
        <Sheet open={open} onOpenChange={setOpen} onOpenChangeComplete={onOpenChangeComplete}>
            <header className={styles.bar} data-away={away && !open ? "" : undefined} data-solid={solid ? "" : undefined}>
                <a href="#play" className={styles.word} aria-label="OASIS, back to the title screen">
                    <Logo decorative className={styles.mark} />
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
                <a href="#join" className={`btn btn--red ${styles.join}`} style={{ ["--glyph-ink" as string]: "var(--c-red)" }}>
                    <span className="glyph" aria-hidden="true">
                        <span>A</span>
                    </span>
                    Join
                </a>
                <SheetTrigger className={styles.menuBtn}>Menu</SheetTrigger>
            </header>

            <SheetContent side="right" showCloseButton={false} className={styles.sheet}>
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <nav aria-label="Levels" className={styles.panelLinks}>
                    {levels.map((level) => (
                        <SheetClose
                            key={level.id}
                            nativeButton={false}
                            className={styles.panelLink}
                            render={
                                <a
                                    href={`#${level.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        pending.current = level.id;
                                    }}
                                />
                            }
                        >
                            <span className="label">{level.hud}</span>
                            <span>{level.label}</span>
                        </SheetClose>
                    ))}
                </nav>
                <SheetClose className={`btn ${styles.panelClose}`}>Close menu</SheetClose>
            </SheetContent>
        </Sheet>
    );
}
