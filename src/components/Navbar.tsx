"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/data/site";

const NAV = [
    { label: "ABOUT", href: "/#about" },
    { label: "EVENTS", href: "/events" },
    { label: "WINS", href: "/achievements" },
    { label: "TEAM", href: "/team" },
    { label: "GALLERY", href: "/gallery" },
];

const LOGO_COLORS = ["#4F5AD0", "#B8476F", "#1F7A60", "#6556C4", "#8A6800"];

export default function Navbar() {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const [pastHero, setPastHero] = useState(false);
    const [open, setOpen] = useState(false);
    const [prevPath, setPrevPath] = useState(pathname);

    // Close the mobile menu on navigation (state reset during render, no effect needed).
    if (prevPath !== pathname) {
        setPrevPath(pathname);
        setOpen(false);
    }

    // On the home page the bar stays hidden over the hero and slides in after it.
    useEffect(() => {
        if (!isHome) return;
        const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [isHome]);

    const visible = !isHome || pastHero || open;

    return (
        <header
            className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 transition-all duration-300"
            style={{
                transform: visible ? "translateY(0)" : "translateY(-120%)",
                opacity: visible ? 1 : 0,
                pointerEvents: visible ? "auto" : "none",
            }}
        >
            <nav
                aria-label="Main"
                className="w-full max-w-5xl rounded-2xl border-2 border-ink bg-white/90 backdrop-blur-md shadow-[4px_4px_0_#2F5D8C]"
            >
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                    <Link href="/" className="flex items-center gap-0.5 font-pixel text-sm" aria-label={`${site.name} home`}>
                        {site.name.split("").map((ch, i) => (
                            <span key={i} style={{ color: LOGO_COLORS[i % LOGO_COLORS.length] }}>
                                {ch}
                            </span>
                        ))}
                    </Link>

                    {/* Desktop links */}
                    <ul className="hidden md:flex items-center gap-1">
                        {NAV.map((item) => {
                            const active = !item.href.startsWith("/#") && pathname.startsWith(item.href);
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        aria-current={active ? "page" : undefined}
                                        className={`block rounded-lg px-3 py-2 font-pixel text-[10px] tracking-wider transition-colors ${
                                            active ? "bg-accent-lavender text-ink" : "text-ink-soft hover:bg-sky-light hover:text-ink"
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="flex items-center gap-2">
                        <Link href="/#join" className="pixel-btn !px-4 !py-2.5 !text-[10px]" style={{ ["--btn-bg" as string]: "#F6B6C8" }}>
                            JOIN
                        </Link>
                        <button
                            type="button"
                            className="md:hidden rounded-lg border-2 border-ink px-2.5 py-2 font-pixel text-[10px] text-ink"
                            aria-expanded={open}
                            aria-controls="mobile-nav"
                            onClick={() => setOpen((o) => !o)}
                        >
                            {open ? "CLOSE" : "MENU"}
                        </button>
                    </div>
                </div>

                {/* Mobile links */}
                {open && (
                    <ul id="mobile-nav" className="md:hidden border-t-2 border-line px-4 py-3 grid grid-cols-2 gap-2">
                        {NAV.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="block rounded-lg bg-sky-light px-3 py-3 font-pixel text-[10px] text-ink"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </nav>
        </header>
    );
}
