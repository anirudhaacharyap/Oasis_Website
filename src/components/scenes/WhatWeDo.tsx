"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const powerUps = [
    {
        title: "GAME DEV",
        description: "Build games using Unity, Unreal & Godot. Learn mechanics, physics and storytelling.",
        icon: "🎮",
        accent: "#9FA8FF",
    },
    {
        title: "ESPORTS",
        description: "Compete in Valorant, BGMI & Rocket League tournaments. Train. Dominate. Repeat.",
        icon: "🏆",
        accent: "#F6B6C8",
    },
    {
        title: "COMMUNITY",
        description: "Game jams, watch parties, LAN events & a Discord that never sleeps.",
        icon: "🌐",
        accent: "#9EE6CF",
    },
    {
        title: "WORKSHOPS",
        description: "Hands-on sessions covering game engines, level design & streaming setups.",
        icon: "📚",
        accent: "#FFF1A8",
    },
];

/* ── Small Pixel Cloud ── */
function PixelCloud({ top, speed, delay, scale = 1 }: { top: string; speed: number; delay: number; scale?: number }) {
    return (
        <div
            className="absolute pointer-events-none"
            style={{
                top,
                left: "-8%",
                animation: `fly-right ${speed}s linear ${delay}s infinite`,
                transform: `scale(${scale})`,
                opacity: 0.08,
            }}
        >
            <svg width="64" height="28" viewBox="0 0 64 28" fill="#5F86B5">
                <rect x="16" y="0" width="8" height="4" />
                <rect x="24" y="0" width="8" height="4" />
                <rect x="8" y="4" width="8" height="4" />
                <rect x="16" y="4" width="8" height="4" />
                <rect x="24" y="4" width="8" height="4" />
                <rect x="32" y="4" width="8" height="4" />
                <rect x="40" y="4" width="8" height="4" />
                <rect x="0" y="8" width="8" height="4" />
                <rect x="8" y="8" width="8" height="4" />
                <rect x="16" y="8" width="8" height="4" />
                <rect x="24" y="8" width="8" height="4" />
                <rect x="32" y="8" width="8" height="4" />
                <rect x="40" y="8" width="8" height="4" />
                <rect x="48" y="8" width="8" height="4" />
                <rect x="4" y="12" width="56" height="4" />
            </svg>
        </div>
    );
}

export default function WhatWeDo() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const bgFarRef = useRef<HTMLDivElement>(null);
    const bgMidRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        // Initial hidden states
        gsap.set(titleRef.current, { y: 40, autoAlpha: 0 });
        gsap.set(subtitleRef.current, { y: 20, autoAlpha: 0 });
        cardsRef.current.forEach((card) => {
            if (card) gsap.set(card, { autoAlpha: 0, y: 50, scale: 0.92 });
        });

        // ── PINNED SCROLL TIMELINE ──
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "+=200%",
                scrub: 0.5,
                pin: true,
                anticipatePin: 1,
            },
        });

        // Parallax background layers at different speeds
        if (bgFarRef.current) {
            tl.to(bgFarRef.current, { y: -50, duration: 1, ease: "none" }, 0);
        }
        if (bgMidRef.current) {
            tl.to(bgMidRef.current, { y: -30, duration: 1, ease: "none" }, 0);
        }

        // Phase 1: Title
        tl.to(titleRef.current, {
            y: 0, autoAlpha: 1, duration: 0.12, ease: "power2.out",
        }, 0.03);

        // Phase 2: Subtitle
        tl.to(subtitleRef.current, {
            y: 0, autoAlpha: 1, duration: 0.1, ease: "power2.out",
        }, 0.1);

        // Phase 3: Cards unlock sequentially
        cardsRef.current.forEach((card, i) => {
            if (!card) return;
            tl.to(card, {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.14,
                ease: "back.out(1.4)",
            }, 0.2 + i * 0.08);
        });

        // Phase 4: Breathing room (holds at 65%-100%)

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden"
            style={{ background: "linear-gradient(180deg, #D9EEFB 0%, #EAF6FF 40%, #F9FCFF 100%)" }}
        >
            {/* ═══ Layer 0: Base grid pattern ═══ */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: "radial-gradient(#2F5D8C 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />
            </div>

            {/* ═══ Layer 1: Far parallax (slowest) — clouds, large glows ═══ */}
            <div ref={bgFarRef} className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
                {/* Pixel clouds drifting across */}
                <PixelCloud top="8%" speed={35} delay={0} scale={1.2} />
                <PixelCloud top="22%" speed={40} delay={8} scale={0.8} />
                <PixelCloud top="70%" speed={30} delay={4} scale={1} />
                <PixelCloud top="85%" speed={45} delay={12} scale={0.6} />

                {/* Large soft radial glows */}
                <div
                    className="absolute top-[15%] left-[10%] w-80 h-80 rounded-full opacity-[0.05] animate-pulse"
                    style={{ background: "radial-gradient(circle, #9FA8FF 0%, transparent 70%)", animationDuration: "6s" }}
                />
                <div
                    className="absolute bottom-[20%] right-[15%] w-64 h-64 rounded-full opacity-[0.04] animate-pulse"
                    style={{ background: "radial-gradient(circle, #F6B6C8 0%, transparent 70%)", animationDuration: "8s", animationDelay: "3s" }}
                />
                <div
                    className="absolute top-[55%] left-[50%] w-48 h-48 rounded-full opacity-[0.04] animate-pulse"
                    style={{ background: "radial-gradient(circle, #9EE6CF 0%, transparent 70%)", animationDuration: "7s", animationDelay: "1s" }}
                />
            </div>

            {/* ═══ Layer 2: Mid parallax — shapes, icons, code snippets ═══ */}
            <div ref={bgMidRef} className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
                {/* Floating geometric shapes */}
                <div className="absolute top-[12%] left-[6%] animate-float" style={{ animationDuration: "8s" }}>
                    <svg width="32" height="32" viewBox="0 0 32 32" className="opacity-[0.12]">
                        <rect x="6" y="6" width="20" height="20" rx="4" stroke="#9FA8FF" strokeWidth="2" fill="none" />
                    </svg>
                </div>
                <div className="absolute top-[8%] right-[15%] animate-float" style={{ animationDuration: "10s", animationDelay: "2s" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" className="opacity-[0.1]">
                        <circle cx="12" cy="12" r="10" stroke="#F6B6C8" strokeWidth="2" fill="none" />
                    </svg>
                </div>
                <div className="absolute top-[45%] left-[3%] animate-float" style={{ animationDuration: "12s", animationDelay: "4s" }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" className="opacity-[0.1]">
                        <polygon points="10,1 19,19 1,19" stroke="#9EE6CF" strokeWidth="1.5" fill="none" />
                    </svg>
                </div>
                <div className="absolute bottom-[30%] right-[6%] animate-float" style={{ animationDuration: "9s", animationDelay: "1s" }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" className="opacity-[0.1]">
                        <rect x="2" y="2" width="14" height="14" rx="2" transform="rotate(45 9 9)" stroke="#FFF1A8" strokeWidth="2" fill="none" />
                    </svg>
                </div>
                <div className="absolute bottom-[15%] left-[12%] animate-float opacity-[0.08]" style={{ animationDuration: "14s", animationDelay: "6s" }}>
                    <svg width="28" height="28" viewBox="0 0 28 28">
                        <path d="M14 2 L26 14 L14 26 L2 14 Z" stroke="#C9C3F5" strokeWidth="2" fill="none" />
                    </svg>
                </div>

                {/* Pixel dots scattered */}
                <div className="absolute top-[25%] left-[20%] w-2 h-2 bg-accent-mint rounded-sm opacity-[0.15] animate-float" style={{ animationDuration: "7s" }} />
                <div className="absolute top-[60%] right-[25%] w-2.5 h-2.5 bg-accent-lavender rounded-sm opacity-[0.12] animate-float" style={{ animationDuration: "9s", animationDelay: "3s" }} />
                <div className="absolute top-[40%] right-[8%] w-1.5 h-1.5 bg-accent-pink rounded-sm opacity-[0.15] animate-float" style={{ animationDuration: "6s", animationDelay: "2s" }} />
                <div className="absolute bottom-[40%] left-[7%] w-2 h-2 bg-accent-purple rounded-sm opacity-[0.12] animate-float" style={{ animationDuration: "11s", animationDelay: "5s" }} />
                <div className="absolute top-[18%] left-[45%] w-1.5 h-1.5 bg-accent-yellow rounded-sm opacity-[0.15] animate-float" style={{ animationDuration: "8s", animationDelay: "1s" }} />

                {/* Small gaming icons */}
                <div className="absolute top-[65%] left-[25%] animate-float opacity-[0.08]" style={{ animationDuration: "13s", animationDelay: "2s" }}>
                    <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                        <rect x="3" y="3" width="16" height="10" rx="5" stroke="#5F86B5" strokeWidth="1.5" />
                        <circle cx="8" cy="8" r="1.5" fill="#5F86B5" />
                        <circle cx="14" cy="8" r="1.5" fill="#5F86B5" />
                    </svg>
                </div>
                <div className="absolute top-[30%] right-[20%] animate-float opacity-[0.08]" style={{ animationDuration: "11s", animationDelay: "7s" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="#F6B6C8">
                        <polygon points="7,0 9,5 14,5 10,8 12,14 7,10 2,14 4,8 0,5 5,5" />
                    </svg>
                </div>

                {/* Floating code text */}
                <div className="absolute top-[35%] left-[4%] opacity-[0.06] animate-float" style={{ animationDuration: "15s", animationDelay: "3s" }}>
                    <span className="font-pixel text-[10px] text-text-secondary">function()</span>
                </div>
                <div className="absolute bottom-[25%] right-[4%] opacity-[0.06] animate-float" style={{ animationDuration: "12s", animationDelay: "5s" }}>
                    <span className="font-pixel text-[10px] text-text-secondary">&lt;/&gt;</span>
                </div>
                <div className="absolute top-[75%] right-[35%] opacity-[0.05] animate-float" style={{ animationDuration: "10s", animationDelay: "8s" }}>
                    <span className="font-pixel text-xs text-text-secondary">0x42</span>
                </div>

                {/* Twinkling pixel stars */}
                {[
                    { top: "10%", left: "30%" }, { top: "20%", left: "70%" }, { top: "50%", left: "90%" },
                    { top: "75%", left: "15%" }, { top: "88%", left: "55%" }, { top: "35%", left: "55%" },
                ].map((pos, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-text-secondary rounded-full"
                        style={{
                            top: pos.top,
                            left: pos.left,
                            animation: `twinkle ${2 + (i % 3)}s ease-in-out ${i * 0.8}s infinite`,
                            opacity: 0.2,
                        }}
                    />
                ))}
            </div>

            {/* ═══ Layer 3: Content ═══ */}
            <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 md:px-12 lg:px-20">

                {/* Title */}
                <h2
                    ref={titleRef}
                    className="font-pixel text-2xl sm:text-3xl lg:text-4xl text-center mb-4"
                    style={{ color: "#2F5D8C" }}
                >
                    WHAT WE DO
                </h2>

                {/* Subtitle */}
                <p
                    ref={subtitleRef}
                    className="text-center text-sm lg:text-base mb-16 max-w-lg mx-auto"
                    style={{ color: "#5F86B5" }}
                >
                    Four pillars that power the OASIS experience.
                </p>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
                    {powerUps.map((item, i) => (
                        <div
                            key={item.title}
                            ref={(el) => { cardsRef.current[i] = el; }}
                            className="group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-3 flex flex-col"
                            style={{
                                background: "#fff",
                                border: "1px solid rgba(191, 217, 242, 0.35)",
                                boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
                            }}
                            onMouseEnter={(e) => {
                                const el = e.currentTarget;
                                el.style.borderColor = `${item.accent}60`;
                                el.style.boxShadow = `0 20px 50px ${item.accent}25, 0 8px 16px rgba(0,0,0,0.06)`;
                            }}
                            onMouseLeave={(e) => {
                                const el = e.currentTarget;
                                el.style.borderColor = "rgba(191, 217, 242, 0.35)";
                                el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.04)";
                            }}
                        >
                            {/* ── Visual header area ── */}
                            <div
                                className="relative h-44 lg:h-48 flex items-center justify-center overflow-hidden"
                                style={{
                                    background: `linear-gradient(160deg, ${item.accent}18 0%, ${item.accent}08 100%)`,
                                }}
                            >
                                {/* Subtle grid pattern in header */}
                                <div
                                    className="absolute inset-0 opacity-[0.06]"
                                    style={{
                                        backgroundImage: `linear-gradient(${item.accent}40 1px, transparent 1px), linear-gradient(90deg, ${item.accent}40 1px, transparent 1px)`,
                                        backgroundSize: "20px 20px",
                                    }}
                                />

                                {/* Floating pixel dots in header */}
                                <div className="absolute top-4 left-4 w-2 h-2 rounded-sm opacity-20 animate-float" style={{ backgroundColor: item.accent, animationDuration: "5s" }} />
                                <div className="absolute top-6 right-6 w-1.5 h-1.5 rounded-sm opacity-15 animate-float" style={{ backgroundColor: item.accent, animationDuration: "7s", animationDelay: "1s" }} />
                                <div className="absolute bottom-6 left-8 w-1 h-1 rounded-sm opacity-20 animate-float" style={{ backgroundColor: item.accent, animationDuration: "6s", animationDelay: "2s" }} />
                                <div className="absolute bottom-4 right-4 w-2 h-2 rounded-sm opacity-15 animate-float" style={{ backgroundColor: item.accent, animationDuration: "8s", animationDelay: "3s" }} />

                                {/* Number badge top right */}
                                <span
                                    className="absolute top-4 right-4 font-pixel text-[10px] px-2 py-1 rounded-lg opacity-40 group-hover:opacity-80 transition-opacity duration-300"
                                    style={{ color: item.accent, background: `${item.accent}15`, border: `1px solid ${item.accent}20` }}
                                >
                                    0{i + 1}
                                </span>

                                {/* Large centered icon */}
                                <div
                                    className="relative w-20 h-20 rounded-2xl flex items-center justify-center text-4xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                                    style={{
                                        background: `linear-gradient(135deg, ${item.accent}35, ${item.accent}15)`,
                                        border: `2px solid ${item.accent}30`,
                                        boxShadow: `0 8px 24px ${item.accent}20`,
                                    }}
                                >
                                    {item.icon}
                                </div>

                                {/* Bottom gradient fade */}
                                <div className="absolute bottom-0 left-0 right-0 h-8" style={{ background: "linear-gradient(transparent, #fff)" }} />
                            </div>

                            {/* ── Text content ── */}
                            <div className="px-7 lg:px-8 pb-8 pt-4 flex flex-col flex-1">
                                {/* Title */}
                                <h3
                                    className="font-pixel text-sm lg:text-base mb-4 tracking-wide"
                                    style={{ color: "#2F5D8C" }}
                                >
                                    {item.title}
                                </h3>

                                {/* Description */}
                                <p
                                    className="text-sm lg:text-[15px] leading-loose flex-1"
                                    style={{ color: "#6B8DB5", fontFamily: "var(--font-body), system-ui, sans-serif" }}
                                >
                                    {item.description}
                                </p>

                                {/* Explore button */}
                                <div className="mt-5">
                                    <button
                                        className="font-pixel text-[9px] lg:text-[10px] tracking-wider px-3 py-1.5 rounded-md transition-all duration-300 group-hover:shadow-sm cursor-pointer"
                                        style={{
                                            color: item.accent,
                                            background: `${item.accent}12`,
                                            border: `1.5px solid ${item.accent}30`,
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = `${item.accent}25`;
                                            e.currentTarget.style.borderColor = `${item.accent}50`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = `${item.accent}12`;
                                            e.currentTarget.style.borderColor = `${item.accent}30`;
                                        }}
                                    >
                                        EXPLORE →
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
