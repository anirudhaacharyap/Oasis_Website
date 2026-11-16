"use client";

import { useEffect, useRef, useState } from "react";
import { levels } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { scrollToLevel, startScroll, stopScroll } from "@/lib/scroll";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import styles from "./Navbar.module.css";

/**
 * The HUD: a bottom dock that is also the map of the run.
 * Each level's slot is as wide as that level is long, so the dock reads as the page itself.
 * One red line fills from the hero to the footer (the whole journey, never stopping early),
 * ticks mark each checkpoint and turn red once passed, and a cream marker sits on the
 * level you are in. It stays down over the title screen and rises once you start playing.
 * Phones get the star, the current level and a Menu sheet, over the same journey line.
 */

type Segment = { id: string; start: number; end: number };

/** Layout numbers measured on resize only, so the per-frame tick never forces a layout. */
const metrics = { max: 1, heroH: 800 };

const STAR = "M8 0.8 9.9 5.9 15.3 6.1 11 9.4 12.5 14.6 8 11.6 3.5 14.6 5 9.4 0.7 6.1 6.1 5.9Z";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState<string>("play");
    const [shown, setShown] = useState(false);
    const [segments, setSegments] = useState<Segment[]>([]);
    const pending = useRef<string | null>(null);
    const fillRef = useRef<HTMLSpanElement>(null);
    const phoneFillRef = useRef<HTMLSpanElement>(null);

    // Measure every level once laid out (and whenever the page reflows): its share of the run.
    useEffect(() => {
        const measure = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            metrics.max = Math.max(1, max);
            metrics.heroH = document.getElementById("play")?.offsetHeight ?? window.innerHeight;
            if (max <= 0) return;
            const next = levels
                .map((level) => {
                    const el = document.getElementById(level.id);
                    if (!el) return null;
                    const top = el.getBoundingClientRect().top + window.scrollY;
                    return { id: level.id as string, start: Math.min(1, Math.max(0, top / max)), end: 0 };
                })
                .filter((s): s is Segment => s !== null);
            next.forEach((s, i) => (s.end = i < next.length - 1 ? next[i + 1].start : 1));
            setSegments(next);
        };
        measure();
        const ro = new ResizeObserver(measure);
        const main = document.getElementById("main");
        if (main) ro.observe(main);
        window.addEventListener("resize", measure);
        document.fonts?.ready.then(measure);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, []);

    // The journey line, on the one clock (GSAP), eased toward the true scroll position.
    useEffect(() => {
        const fills = [fillRef.current, phoneFillRef.current].filter(Boolean) as HTMLElement[];
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const setters = fills.map((el) =>
            reduce
                ? (v: number) => {
                      gsap.set(el, { scaleX: v });
                  }
                : gsap.quickTo(el, "scaleX", { duration: 0.45, ease: "power3.out" })
        );
        // Only scrollY is read per frame (cheap); everything else comes from the resize measure.
        let lastY = -1;
        const tick = () => {
            const y = window.scrollY;
            if (y === lastY) return;
            lastY = y;
            const p = Math.min(1, Math.max(0, y / metrics.max));
            setters.forEach((set) => set(p));
            // Over the title screen the dock stays down; it rises once you are on your way.
            const next = y > metrics.heroH * 0.55;
            setShown((s) => (s === next ? s : next));
            // At the very end the footer owns the screen: the run is at its finale.
            if (p > 0.985) setCurrent((c) => (c === "join" ? c : "join"));
        };
        tick();
        gsap.ticker.add(tick);
        return () => gsap.ticker.remove(tick);
    }, []);

    // Which level owns the middle of the screen.
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

    const onOpenChangeComplete = (isOpen: boolean) => {
        if (isOpen || !pending.current) return;
        const id = pending.current;
        pending.current = null;
        scrollToLevel(id);
    };

    const go = (id: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        scrollToLevel(id);
    };

    const currentIndex = Math.max(0, levels.findIndex((l) => l.id === current));
    const currentLevel = levels[currentIndex];
    const middle = levels.filter((l) => l.id !== "play" && l.id !== "join");
    // Columns follow each level's length, normalised so the shares fill the bar (fr values that
    // sum below 1 would leave dead space), with a floor so every label fits.
    const shares = middle.map((l) => {
        const seg = segments.find((x) => x.id === l.id);
        return seg ? Math.max(0.06, seg.end - seg.start) : 1;
    });
    const total = shares.reduce((a, b) => a + b, 0) || 1;
    // Scaled so the flex factors stay >= 1 even after short levels hit their floor (grid would
    // otherwise leave part of the bar empty).
    const columns = shares.map((v) => `minmax(10rem, ${((v / total) * 10).toFixed(3)}fr)`).join(" ");
    const hudOf = (i: number) => (i === 0 ? "Title" : i === levels.length - 1 ? "Finale" : `L${i}`);

    return (
        <Sheet open={open} onOpenChange={setOpen} onOpenChangeComplete={onOpenChangeComplete}>
            <header className={styles.dock} data-shown={shown || open ? "" : undefined}>
                {/* Desktop: the map of the run. */}
                <nav aria-label="Levels" className={styles.map}>
                    <a
                        href="#play"
                        className={styles.star}
                        onClick={go("play")}
                        aria-label="Title screen, back to the top"
                        aria-current={current === "play" ? "location" : undefined}
                    >
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                            <path d={STAR} />
                        </svg>
                    </a>
                    <div className={styles.levels} style={{ gridTemplateColumns: columns }}>
                        {middle.map((level) => {
                            const i = levels.findIndex((l) => l.id === level.id);
                            return (
                                <a
                                    key={level.id}
                                    href={`#${level.id}`}
                                    onClick={go(level.id)}
                                    className={styles.level}
                                    aria-current={current === level.id ? "location" : undefined}
                                    data-passed={i <= currentIndex ? "" : undefined}
                                >
                                    <span className={styles.tick} aria-hidden="true" />
                                    <span className={styles.hud} aria-hidden="true">
                                        {hudOf(i)}
                                    </span>
                                    <span className={styles.name}>{level.label}</span>
                                    <span className={styles.preview} aria-hidden="true" />
                                </a>
                            );
                        })}
                    </div>
                    <a
                        href="#join"
                        onClick={go("join")}
                        className={`btn btn--red ${styles.join}`}
                        aria-current={current === "join" ? "location" : undefined}
                        style={{ ["--glyph-ink" as string]: "var(--c-red)" }}
                    >
                        <span className="glyph" aria-hidden="true">
                            <span>A</span>
                        </span>
                        Join
                    </a>
                    <span className={styles.track} aria-hidden="true">
                        <span ref={fillRef} className={styles.fill} />
                    </span>
                </nav>

                {/* Phone: star, where you are, menu, same journey line. */}
                <div className={styles.phone}>
                    <a href="#play" className={styles.star} onClick={go("play")} aria-label="Title screen, back to the top">
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                            <path d={STAR} />
                        </svg>
                    </a>
                    <p className={styles.where}>
                        <span className={styles.hud}>{hudOf(currentIndex)}</span>
                        <span className={styles.name}>{currentLevel.label}</span>
                    </p>
                    <SheetTrigger className={styles.menuBtn}>Menu</SheetTrigger>
                    <span className={styles.track} aria-hidden="true">
                        <span ref={phoneFillRef} className={styles.fill} />
                    </span>
                </div>
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
