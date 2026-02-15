"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const navItems = [
    { label: "HOME", href: "#start" },
    { label: "ABOUT", href: "#origin" },
    { label: "SKILLS", href: "#whatwedo" },
    { label: "STATS", href: "#events" },
    { label: "TEAM", href: "#collabs" },
    { label: "JOIN", href: "#victory" },
];

export default function NavIsland() {
    const navRef = useRef<HTMLElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const nav = navRef.current;
        if (!nav) return;

        // Show navbar only after scrolling past the first scene (~100vh)
        ScrollTrigger.create({
            trigger: document.body,
            start: "100vh top",
            end: "max",
            onEnter: () => setVisible(true),
            onLeaveBack: () => setVisible(false),
        });

        // Highlight active section
        const sectionIds = ["start", "origin", "whatwedo", "events", "collabs", "victory"];
        sectionIds.forEach((id, i) => {
            const el = document.getElementById(id);
            if (!el) return;
            ScrollTrigger.create({
                trigger: el,
                start: "top center",
                end: "bottom center",
                onEnter: () => setActiveIndex(i),
                onEnterBack: () => setActiveIndex(i),
            });
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    // Animate visibility
    useEffect(() => {
        const nav = navRef.current;
        if (!nav) return;
        gsap.to(nav, {
            y: visible ? 0 : -80,
            opacity: visible ? 1 : 0,
            duration: 0.35,
            ease: visible ? "back.out(1.5)" : "power2.in",
        });
    }, [visible]);

    const handleClick = (href: string) => {
        const el = document.querySelector(href);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <nav
            ref={navRef}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 opacity-0"
            style={{ transform: "translateX(-50%) translateY(-80px)" }}
        >
            <div
                className="flex items-center gap-1 px-2 py-2 rounded-2xl shadow-xl backdrop-blur-xl"
                style={{
                    background: "rgba(249, 252, 255, 0.85)",
                    border: "2px solid #BFD9F2",
                    boxShadow: "0 8px 32px rgba(47, 93, 140, 0.12), 0 2px 8px rgba(159, 168, 255, 0.15)",
                }}
            >
                {/* OASIS pixel logo mini */}
                <div
                    className="flex items-center gap-0.5 px-3 py-1.5 mr-1 rounded-xl"
                    style={{ background: "linear-gradient(135deg, #9FA8FF20, #F6B6C820)" }}
                >
                    {"OASIS".split("").map((ch, i) => (
                        <span
                            key={i}
                            className="font-pixel text-[9px] transition-colors duration-200"
                            style={{
                                color: ["#9FA8FF", "#F6B6C8", "#9EE6CF", "#C9C3F5", "#FFF1A8"][i],
                            }}
                        >
                            {ch}
                        </span>
                    ))}
                </div>

                {/* Divider */}
                <div className="w-px h-5 mx-1" style={{ background: "#BFD9F2" }} />

                {/* Nav items */}
                {navItems.map((item, i) => (
                    <button
                        key={item.label}
                        onClick={() => handleClick(item.href)}
                        className="relative px-3 py-1.5 rounded-xl font-pixel text-[8px] tracking-wider transition-all duration-200 hover:scale-105 cursor-pointer"
                        style={{
                            color: activeIndex === i ? "#F9FCFF" : "#5F86B5",
                            background: activeIndex === i
                                ? "linear-gradient(135deg, #9FA8FF, #C9C3F5)"
                                : "transparent",
                            boxShadow: activeIndex === i
                                ? "0 2px 8px rgba(159, 168, 255, 0.4)"
                                : "none",
                        }}
                    >
                        {item.label}
                    </button>
                ))}

                {/* Decorative pixel dot */}
                <div className="w-px h-5 mx-1" style={{ background: "#BFD9F2" }} />
                <div className="flex items-center gap-1 px-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-pink" />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-mint" />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-yellow" />
                </div>
            </div>
        </nav>
    );
}
