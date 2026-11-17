"use client";

import { useEffect, useRef, useState } from "react";
import { levels } from "@/lib/content";
import { gsap } from "@/lib/gsap";
import { scrollToLevel, startScroll, stopScroll } from "@/lib/scroll";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import styles from "./Navbar.module.css";

/**
 * The HUD: a bottom dock that is also the map of the run.
 * It stays down over the title screen and rises once you scroll. Each level's slot
 * is as wide as that level is long. The red line along the foot is the whole page.
 * The slot of the level you are in fills with cream as you read through that level,
 * and its label turns ink exactly where the fill has reached.
 */

type Segment = { id: string; start: number; end: number };
type Bound = { id: string; top: number; bottom: number };
type Wash = { wash: HTMLSpanElement | null; ink: HTMLSpanElement | null };

/** Layout numbers measured on resize only, so the per-frame tick never forces a layout. */
const metrics = { max: 1, heroH: 800, bounds: [] as Bound[] };

/** How far the reading line (the middle of the screen) is through a level: 0 not reached, 1 read. */
const progressOf = (b: Bound, mid: number) =>
    Math.min(1, Math.max(0, (mid - b.top) / Math.max(1, b.bottom - b.top)));

const paint = (w: Wash | undefined, v: number) => {
    if (w?.wash) w.wash.style.transform = `scaleX(${v})`;
    if (w?.ink) w.ink.style.clipPath = `inset(0 ${((1 - v) * 100).toFixed(3)}% 0 0)`;
};

const EPS = 0.0005;

const STAR = "M8 0.8 9.9 5.9 15.3 6.1 11 9.4 12.5 14.6 8 11.6 3.5 14.6 5 9.4 0.7 6.1 6.1 5.9Z";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState<string>("play");
    const [shown, setShown] = useState(false);
    const [segments, setSegments] = useState<Segment[]>([]);
    const pending = useRef<string | null>(null);
    const fillRef = useRef<HTMLSpanElement>(null);
    const phoneFillRef = useRef<HTMLSpanElement>(null);
    const washRefs = useRef(new Map<string, Wash>());
    const phoneWashRef = useRef<Wash>({ wash: null, ink: null });

    // Measure every level once laid out (and whenever the page reflows): its share of the run.
    useEffect(() => {
        const measure = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            metrics.max = Math.max(1, max);
            metrics.heroH = document.getElementById("play")?.offsetHeight ?? window.innerHeight;
            const bounds = levels
                .map((level) => {
                    const el = document.getElementById(level.id);
                    if (!el) return null;
                    const top = el.getBoundingClientRect().top + window.scrollY;
                    return { id: level.id as string, top, bottom: top + el.offsetHeight };
                })
                .filter((b): b is Bound => b !== null);
            metrics.bounds = bounds;
            if (max <= 0) return;
            const next = bounds.map((b) => ({
                id: b.id,
                start: Math.min(1, Math.max(0, b.top / max)),
                end: 0,
            }));
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

    // One tick on the one clock (GSAP): the journey line, the level you are in, and its fill.
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
        // The fills ease toward the reading line, settling in about a quarter second.
        const drawn = new Map<string, number>();
        const target = new Map<string, number>();
        let phoneDrawn = -1;
        let phoneTarget = 0;
        let here = "";
        let lastY = -1;
        let lastH = -1;
        const tick = () => {
            const y = window.scrollY;
            const h = window.innerHeight;
            if (y !== lastY || h !== lastH) {
                lastY = y;
                lastH = h;
                const p = Math.min(1, Math.max(0, y / metrics.max));
                setters.forEach((set) => set(p));
                // Over the title screen the dock stays down; it rises once you are on your way.
                const next = y > metrics.heroH * 0.55;
                setShown((s) => (s === next ? s : next));
                // The level you are in is the one under the middle of the screen. At the very end
                // the footer owns the screen: the run is at its finale.
                const mid = y + h * 0.5;
                let id = "play";
                for (const b of metrics.bounds) {
                    if (b.top <= mid) id = b.id;
                    target.set(b.id, progressOf(b, mid));
                }
                if (p > 0.985) id = "join";
                const b = metrics.bounds.find((x) => x.id === id);
                phoneTarget = b && id !== "play" && id !== "join" ? progressOf(b, mid) : 0;
                if (id !== here) {
                    // A new level starts its own fill where it stands, never from the last one's.
                    phoneDrawn = phoneTarget;
                    paint(phoneWashRef.current, phoneDrawn);
                    here = id;
                    setCurrent((c) => (c === id ? c : id));
                }
            }
            const k = reduce ? 1 : 1 - Math.pow(0.8, gsap.ticker.deltaRatio(60));
            washRefs.current.forEach((w, key) => {
                const t = target.get(key) ?? 0;
                const v = drawn.get(key);
                if (v !== undefined && Math.abs(t - v) < EPS) return;
                const nv = v === undefined || Math.abs(t - v) < EPS * 4 ? t : v + (t - v) * k;
                drawn.set(key, nv);
                paint(w, nv);
            });
            if (Math.abs(phoneTarget - phoneDrawn) >= EPS) {
                phoneDrawn =
                    Math.abs(phoneTarget - phoneDrawn) < EPS * 4
                        ? phoneTarget
                        : phoneDrawn + (phoneTarget - phoneDrawn) * k;
                paint(phoneWashRef.current, phoneDrawn);
            }
        };
        tick();
        gsap.ticker.add(tick);
        return () => gsap.ticker.remove(tick);
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

    const washRef = (id: string, part: keyof Wash) => (node: HTMLSpanElement | null) => {
        const w = washRefs.current.get(id) ?? { wash: null, ink: null };
        w[part] = node;
        if (w.wash || w.ink) washRefs.current.set(id, w);
        else washRefs.current.delete(id);
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
    const filling = current !== "play" && current !== "join";

    return (
        <Sheet open={open} onOpenChange={setOpen} onOpenChangeComplete={onOpenChangeComplete}>
            <header className={styles.dock} data-shown={shown || open ? "" : undefined}>
                {/* Over the title screen only the bare star shows, with one soft chevron under it saying "scroll". */}
                <span className={styles.peek} aria-hidden="true">
                    <svg viewBox="0 0 16 10">
                        <path d="M2 2l6 6 6-6" />
                    </svg>
                </span>
                {/* Desktop: the map of the run. While peeking, the star starts the run. */}
                <nav id="level-map" aria-label="Levels" className={styles.map}>
                    <a
                        href={shown ? "#play" : `#${levels[1].id}`}
                        className={styles.star}
                        onClick={go(shown ? "play" : levels[1].id)}
                        aria-label={shown ? "Title screen, back to the top" : `Start: scroll to ${levels[1].label}`}
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
                                    <span ref={washRef(level.id, "wash")} className={styles.wash} aria-hidden="true" />
                                    <span className={styles.tick} aria-hidden="true" />
                                    <span className={styles.hud} aria-hidden="true">
                                        {hudOf(i)}
                                    </span>
                                    <span className={styles.name}>{level.label}</span>
                                    {/* The same label in ink, clipped to the fill, so the type turns exactly at its edge. */}
                                    <span ref={washRef(level.id, "ink")} className={styles.ink} aria-hidden="true">
                                        <span className={styles.hud}>{hudOf(i)}</span>
                                        <span className={styles.name}>{level.label}</span>
                                    </span>
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

                {/* Phone: star, where you are (filling the same way), menu, same journey line. */}
                <div className={styles.phone}>
                    <a href="#play" className={styles.star} onClick={go("play")} aria-label="Title screen, back to the top">
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                            <path d={STAR} />
                        </svg>
                    </a>
                    <p className={styles.where} data-filling={filling ? "" : undefined}>
                        <span
                            ref={(node) => {
                                phoneWashRef.current.wash = node;
                            }}
                            className={styles.wash}
                            aria-hidden="true"
                        />
                        <span className={styles.hud}>{hudOf(currentIndex)}</span>
                        <span className={styles.name}>{currentLevel.label}</span>
                        <span
                            ref={(node) => {
                                phoneWashRef.current.ink = node;
                            }}
                            className={styles.ink}
                            aria-hidden="true"
                        >
                            <span className={styles.hud}>{hudOf(currentIndex)}</span>
                            <span className={styles.name}>{currentLevel.label}</span>
                        </span>
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
