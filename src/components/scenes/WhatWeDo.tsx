"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/* ── Pixel Art SVG Icons ── */
const PixelGamepad = ({ color }: { color: string }) => (
    <svg width="36" height="36" viewBox="0 0 16 16" fill={color} className="[image-rendering:pixelated]">
        <rect x="2" y="4" width="12" height="8" />
        <rect x="1" y="5" width="1" height="6" />
        <rect x="14" y="5" width="1" height="6" />
        <rect x="4" y="6" width="1" height="4" fill="white" fillOpacity="0.7" />
        <rect x="3" y="7" width="3" height="2" fill="white" fillOpacity="0.7" />
        <rect x="10" y="6" width="2" height="2" fill="white" fillOpacity="0.7" />
        <rect x="12" y="8" width="2" height="2" fill="white" fillOpacity="0.7" />
    </svg>
);

const PixelTrophy = ({ color }: { color: string }) => (
    <svg width="36" height="36" viewBox="0 0 16 16" fill={color} className="[image-rendering:pixelated]">
        <rect x="4" y="2" width="8" height="2" />
        <rect x="3" y="4" width="10" height="4" />
        <rect x="1" y="4" width="2" height="3" />
        <rect x="13" y="4" width="2" height="3" />
        <rect x="5" y="8" width="6" height="2" />
        <rect x="6" y="10" width="4" height="2" />
        <rect x="4" y="12" width="8" height="2" />
        <rect x="6" y="5" width="4" height="2" fill="white" fillOpacity="0.5" />
    </svg>
);

const PixelGlobe = ({ color }: { color: string }) => (
    <svg width="36" height="36" viewBox="0 0 16 16" fill={color} className="[image-rendering:pixelated]">
        <rect x="4" y="1" width="8" height="2" />
        <rect x="2" y="3" width="12" height="2" />
        <rect x="1" y="5" width="14" height="6" />
        <rect x="2" y="11" width="12" height="2" />
        <rect x="4" y="13" width="8" height="2" />
        <rect x="7" y="1" width="2" height="14" fill="white" fillOpacity="0.3" />
        <rect x="1" y="7" width="14" height="2" fill="white" fillOpacity="0.3" />
    </svg>
);

const PixelBook = ({ color }: { color: string }) => (
    <svg width="36" height="36" viewBox="0 0 16 16" fill={color} className="[image-rendering:pixelated]">
        <rect x="3" y="2" width="10" height="12" />
        <rect x="2" y="3" width="1" height="10" />
        <rect x="5" y="4" width="6" height="2" fill="white" fillOpacity="0.6" />
        <rect x="5" y="7" width="6" height="1" fill="white" fillOpacity="0.4" />
        <rect x="5" y="9" width="4" height="1" fill="white" fillOpacity="0.4" />
        <rect x="2" y="13" width="11" height="1" opacity="0.6" />
    </svg>
);

const pixelIcons = [PixelGamepad, PixelTrophy, PixelGlobe, PixelBook];

const powerUps = [
    {
        title: "GAME DEV",
        description: "Build games using Unity, Unreal & Godot. Learn mechanics, physics and storytelling.",
        accent: "#9FA8FF",
    },
    {
        title: "ESPORTS",
        description: "Compete in Valorant, BGMI & Rocket League tournaments. Train. Dominate. Repeat.",
        accent: "#F6B6C8",
    },
    {
        title: "COMMUNITY",
        description: "Game jams, watch parties, LAN events & a Discord that never sleeps.",
        accent: "#9EE6CF",
    },
    {
        title: "WORKSHOPS",
        description: "Hands-on sessions covering game engines, level design & streaming setups.",
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
    const dividerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const bgFarRef = useRef<HTMLDivElement>(null);
    const bgMidRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        // Initial hidden states — more dramatic starting positions
        gsap.set(titleRef.current, { y: 80, autoAlpha: 0, scale: 0.8, rotateX: 15 });
        gsap.set(dividerRef.current, { autoAlpha: 0, scaleX: 0 });
        cardsRef.current.forEach((card) => {
            if (card) gsap.set(card, { autoAlpha: 0, y: 80, scale: 0.85, rotateY: 5 });
        });



        // ── PINNED SCROLL TIMELINE ──
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "+=350%",
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

        // Phase 1: Title swoops in first (0.05 → 0.20)
        tl.to(titleRef.current, {
            y: 0, autoAlpha: 1, scale: 1, rotateX: 0,
            duration: 0.15, ease: "power3.out",
            onComplete: () => {
                // Trigger glitch animation after title lands
                const layers = titleRef.current?.querySelectorAll("span");
                if (layers) {
                    gsap.to(layers[1], { opacity: 0.8, duration: 0.1, yoyo: true, repeat: 5 }); // Magenta layer
                    gsap.to(layers[2], { opacity: 0.8, duration: 0.1, delay: 0.05, yoyo: true, repeat: 5 }); // Cyan layer
                }
            }
        }, 0.05);

        // Phase 2: Divider appears after title (0.22 → 0.30)
        tl.to(dividerRef.current, {
            autoAlpha: 1, scaleX: 1,
            duration: 0.08, ease: "power2.out",
            transformOrigin: "center center",
        }, 0.22);

        // Phase 3: Asymmetric Card Reveals (0.35+)
        // Card 1: Slide from Left
        if (cardsRef.current[0]) {
            gsap.set(cardsRef.current[0], { x: -100, y: 50, autoAlpha: 0, rotateY: -15 });
            tl.to(cardsRef.current[0], {
                x: 0, y: 0, autoAlpha: 1, rotateY: 0, duration: 0.4, ease: "back.out(1.4)"
            }, 0.35);
        }
        // Card 2: Pop from Bottom
        if (cardsRef.current[1]) {
            gsap.set(cardsRef.current[1], { y: 120, autoAlpha: 0, scale: 0.8 });
            tl.to(cardsRef.current[1], {
                y: 0, autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(1.4)"
            }, 0.42);
        }
        // Card 3: Drop from Top
        if (cardsRef.current[2]) {
            gsap.set(cardsRef.current[2], { y: -120, autoAlpha: 0, scale: 1.1 });
            tl.to(cardsRef.current[2], {
                y: 0, autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(1.4)"
            }, 0.49);
        }
        // Card 4: Slide from Right
        if (cardsRef.current[3]) {
            gsap.set(cardsRef.current[3], { x: 100, y: 50, autoAlpha: 0, rotateY: 15 });
            tl.to(cardsRef.current[3], {
                x: 0, y: 0, autoAlpha: 1, rotateY: 0, duration: 0.4, ease: "back.out(1.4)"
            }, 0.56);
        }

        // Phase 4: Breathing room (holds at ~85%-100%)

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden"
            style={{ perspective: "1200px", background: "linear-gradient(180deg, #D9EEFB 0%, #EAF6FF 40%, #F9FCFF 100%)" }}
        >
            {/* ═══ Layer 0: Base grid + ground ═══ */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: "radial-gradient(#2F5D8C 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />
                {/* Ground pixel tiles */}
                <div className="absolute bottom-0 left-0 right-0 h-12 opacity-[0.04]"
                    style={{
                        backgroundImage: "linear-gradient(90deg, #5F86B5 2px, transparent 2px), linear-gradient(#5F86B5 2px, transparent 2px)",
                        backgroundSize: "12px 12px",
                    }}
                />
            </div>

            {/* ═══ Layer 1: Far parallax — clouds, castle, glows ═══ */}
            <div ref={bgFarRef} className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
                {/* Pixel clouds */}
                <PixelCloud top="6%" speed={35} delay={0} scale={1.4} />
                <PixelCloud top="18%" speed={42} delay={6} scale={0.9} />
                <PixelCloud top="14%" speed={50} delay={15} scale={0.6} />
                <PixelCloud top="65%" speed={30} delay={3} scale={1.1} />
                <PixelCloud top="80%" speed={38} delay={10} scale={0.7} />
                <PixelCloud top="45%" speed={55} delay={20} scale={0.5} />

                {/* Large pulsing orbs */}
                <div className="absolute top-[10%] left-[8%] w-96 h-96 rounded-full opacity-[0.06] animate-pulse"
                    style={{ background: "radial-gradient(circle, #9FA8FF 0%, transparent 65%)", animationDuration: "5s" }} />
                <div className="absolute top-[50%] right-[5%] w-80 h-80 rounded-full opacity-[0.05] animate-pulse"
                    style={{ background: "radial-gradient(circle, #F6B6C8 0%, transparent 65%)", animationDuration: "7s", animationDelay: "2s" }} />
                <div className="absolute bottom-[10%] left-[40%] w-72 h-72 rounded-full opacity-[0.05] animate-pulse"
                    style={{ background: "radial-gradient(circle, #9EE6CF 0%, transparent 65%)", animationDuration: "6s", animationDelay: "1s" }} />
                <div className="absolute top-[30%] left-[60%] w-64 h-64 rounded-full opacity-[0.04] animate-pulse"
                    style={{ background: "radial-gradient(circle, #FFF1A8 0%, transparent 65%)", animationDuration: "8s", animationDelay: "4s" }} />

                {/* Pixel castle silhouette — bottom right */}
                <svg className="absolute bottom-0 right-[8%] opacity-[0.04]" width="120" height="80" viewBox="0 0 30 20" fill="#2F5D8C" style={{ imageRendering: "pixelated" }}>
                    <rect x="0" y="12" width="30" height="8" />
                    <rect x="2" y="8" width="6" height="4" />
                    <rect x="12" y="6" width="8" height="6" />
                    <rect x="22" y="8" width="6" height="4" />
                    <rect x="3" y="5" width="2" height="3" />
                    <rect x="25" y="5" width="2" height="3" />
                    <rect x="14" y="2" width="4" height="4" />
                    <rect x="15" y="0" width="2" height="2" />
                    {/* windows */}
                    <rect x="4" y="14" width="2" height="3" fill="#EAF6FF" fillOpacity="0.5" />
                    <rect x="15" y="9" width="2" height="2" fill="#EAF6FF" fillOpacity="0.5" />
                    <rect x="24" y="14" width="2" height="3" fill="#EAF6FF" fillOpacity="0.5" />
                </svg>

                {/* Pixel trees/bushes along bottom left */}
                <svg className="absolute bottom-0 left-[5%] opacity-[0.05]" width="80" height="50" viewBox="0 0 20 14" fill="#9EE6CF" style={{ imageRendering: "pixelated" }}>
                    <rect x="4" y="2" width="4" height="4" />
                    <rect x="3" y="4" width="6" height="3" />
                    <rect x="2" y="6" width="8" height="2" />
                    <rect x="5" y="8" width="2" height="4" fill="#8B7355" />
                    <rect x="14" y="4" width="3" height="3" />
                    <rect x="13" y="6" width="5" height="2" />
                    <rect x="15" y="8" width="1" height="3" fill="#8B7355" />
                </svg>
                <svg className="absolute bottom-0 left-[22%] opacity-[0.04]" width="60" height="40" viewBox="0 0 16 10" fill="#9EE6CF" style={{ imageRendering: "pixelated" }}>
                    <rect x="3" y="1" width="4" height="3" />
                    <rect x="2" y="3" width="6" height="2" />
                    <rect x="4" y="5" width="2" height="3" fill="#8B7355" />
                </svg>
            </div>

            {/* ═══ Layer 2: Mid parallax — characters, items, rich elements ═══ */}
            <div ref={bgMidRef} className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">

                {/* ── PIXEL CHARACTERS ── */}

                {/* Walking pixel person — top left */}
                <div className="absolute top-[15%] left-[3%] opacity-[0.10]" style={{ animation: "fly-right 25s linear infinite", imageRendering: "pixelated" }}>
                    <svg width="32" height="40" viewBox="0 0 8 10" fill="#5F86B5">
                        <rect x="2" y="0" width="4" height="2" fill="#9FA8FF" /> {/* hat */}
                        <rect x="2" y="2" width="4" height="3" fill="#FFD9B3" /> {/* head */}
                        <rect x="3" y="3" width="1" height="1" fill="#333" /> {/* eye */}
                        <rect x="1" y="5" width="6" height="3" fill="#9FA8FF" /> {/* body */}
                        <rect x="2" y="8" width="2" height="2" fill="#5F86B5" /> {/* leg */}
                        <rect x="5" y="8" width="2" height="2" fill="#5F86B5" /> {/* leg */}
                    </svg>
                </div>

                {/* Bouncing slime — right side */}
                <div className="absolute top-[70%] right-[5%] opacity-[0.10] animate-bounce" style={{ animationDuration: "2s", imageRendering: "pixelated" }}>
                    <svg width="36" height="28" viewBox="0 0 9 7" fill="#9EE6CF">
                        <rect x="2" y="0" width="5" height="2" />
                        <rect x="1" y="2" width="7" height="3" />
                        <rect x="0" y="4" width="9" height="3" />
                        <rect x="3" y="2" width="1" height="1" fill="#333" /> {/* eye */}
                        <rect x="6" y="2" width="1" height="1" fill="#333" /> {/* eye */}
                        <rect x="4" y="4" width="2" height="1" fill="#5B9E8A" /> {/* mouth */}
                    </svg>
                </div>

                {/* Pixel cat — bottom left */}
                <div className="absolute bottom-[18%] left-[15%] opacity-[0.08] animate-float" style={{ animationDuration: "4s", imageRendering: "pixelated" }}>
                    <svg width="30" height="30" viewBox="0 0 10 10" fill="#F6B6C8">
                        <rect x="1" y="0" width="2" height="2" /> {/* ear */}
                        <rect x="7" y="0" width="2" height="2" /> {/* ear */}
                        <rect x="1" y="2" width="8" height="4" /> {/* head+body */}
                        <rect x="0" y="6" width="10" height="3" /> {/* body */}
                        <rect x="3" y="3" width="1" height="1" fill="#333" /> {/* eye */}
                        <rect x="6" y="3" width="1" height="1" fill="#333" /> {/* eye */}
                        <rect x="0" y="9" width="2" height="1" /> {/* paw */}
                        <rect x="8" y="9" width="2" height="1" /> {/* paw */}
                    </svg>
                </div>

                {/* ── FLOATING ITEMS ── */}

                {/* Floating pixel hearts */}
                <div className="absolute top-[25%] right-[12%] opacity-[0.12]" style={{ animation: "particle-drift 8s ease-in-out infinite", imageRendering: "pixelated" }}>
                    <svg width="20" height="18" viewBox="0 0 10 9" fill="#F6B6C8">
                        <rect x="1" y="0" width="2" height="2" />
                        <rect x="5" y="0" width="2" height="2" />
                        <rect x="0" y="1" width="4" height="2" />
                        <rect x="4" y="1" width="4" height="2" />
                        <rect x="1" y="3" width="6" height="2" />
                        <rect x="2" y="5" width="4" height="2" />
                        <rect x="3" y="7" width="2" height="1" />
                    </svg>
                </div>
                <div className="absolute top-[55%] left-[8%] opacity-[0.08]" style={{ animation: "particle-drift 10s ease-in-out 3s infinite", imageRendering: "pixelated" }}>
                    <svg width="14" height="12" viewBox="0 0 10 9" fill="#F6B6C8">
                        <rect x="1" y="0" width="2" height="2" />
                        <rect x="5" y="0" width="2" height="2" />
                        <rect x="0" y="1" width="4" height="2" />
                        <rect x="4" y="1" width="4" height="2" />
                        <rect x="1" y="3" width="6" height="2" />
                        <rect x="2" y="5" width="4" height="2" />
                        <rect x="3" y="7" width="2" height="1" />
                    </svg>
                </div>

                {/* Floating pixel coins */}
                <div className="absolute top-[35%] right-[25%] opacity-[0.12] animate-bounce" style={{ animationDuration: "3s", imageRendering: "pixelated" }}>
                    <svg width="20" height="20" viewBox="0 0 10 10" fill="#FFF1A8">
                        <rect x="3" y="0" width="4" height="1" />
                        <rect x="1" y="1" width="8" height="8" />
                        <rect x="3" y="9" width="4" height="1" />
                        <rect x="4" y="3" width="2" height="4" fill="#DAA520" />
                    </svg>
                </div>
                <div className="absolute bottom-[35%] left-[30%] opacity-[0.08] animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s", imageRendering: "pixelated" }}>
                    <svg width="14" height="14" viewBox="0 0 10 10" fill="#FFF1A8">
                        <rect x="3" y="0" width="4" height="1" />
                        <rect x="1" y="1" width="8" height="8" />
                        <rect x="3" y="9" width="4" height="1" />
                        <rect x="4" y="3" width="2" height="4" fill="#DAA520" />
                    </svg>
                </div>

                {/* Pixel potion bottle */}
                <div className="absolute top-[45%] left-[5%] opacity-[0.09] animate-float" style={{ animationDuration: "7s", imageRendering: "pixelated" }}>
                    <svg width="18" height="24" viewBox="0 0 6 8" fill="#C9C3F5">
                        <rect x="2" y="0" width="2" height="2" fill="#aaa" /> {/* cork */}
                        <rect x="1" y="2" width="4" height="1" />
                        <rect x="0" y="3" width="6" height="4" />
                        <rect x="1" y="7" width="4" height="1" />
                        <rect x="2" y="4" width="2" height="2" fill="white" fillOpacity="0.4" />
                    </svg>
                </div>

                {/* Pixel sword */}
                <div className="absolute top-[20%] right-[35%] opacity-[0.07] animate-float" style={{ animationDuration: "9s", animationDelay: "2s", imageRendering: "pixelated" }}>
                    <svg width="14" height="36" viewBox="0 0 4 10" fill="#9FA8FF">
                        <rect x="1" y="0" width="2" height="1" /> {/* tip */}
                        <rect x="1" y="1" width="2" height="5" /> {/* blade */}
                        <rect x="0" y="6" width="4" height="1" fill="#DAA520" /> {/* guard */}
                        <rect x="1" y="7" width="2" height="2" fill="#8B7355" /> {/* handle */}
                        <rect x="1" y="9" width="2" height="1" fill="#DAA520" /> {/* pommel */}
                    </svg>
                </div>

                {/* Pixel shield */}
                <div className="absolute bottom-[25%] right-[18%] opacity-[0.07] animate-float" style={{ animationDuration: "11s", animationDelay: "4s", imageRendering: "pixelated" }}>
                    <svg width="24" height="28" viewBox="0 0 8 9" fill="#9FA8FF">
                        <rect x="0" y="0" width="8" height="2" />
                        <rect x="0" y="2" width="8" height="4" />
                        <rect x="1" y="6" width="6" height="2" />
                        <rect x="2" y="8" width="4" height="1" />
                        <rect x="3" y="2" width="2" height="4" fill="white" fillOpacity="0.3" />
                        <rect x="1" y="3" width="6" height="1" fill="white" fillOpacity="0.3" />
                    </svg>
                </div>

                {/* ── Question block ── */}
                <div className="absolute top-[8%] left-[35%] opacity-[0.10] animate-bounce" style={{ animationDuration: "2.5s", imageRendering: "pixelated" }}>
                    <svg width="28" height="28" viewBox="0 0 10 10">
                        <rect x="0" y="0" width="10" height="10" fill="#FFF1A8" />
                        <rect x="0" y="0" width="10" height="1" fill="#DAA520" />
                        <rect x="0" y="9" width="10" height="1" fill="#DAA520" />
                        <rect x="0" y="0" width="1" height="10" fill="#DAA520" />
                        <rect x="9" y="0" width="1" height="10" fill="#DAA520" />
                        <rect x="3" y="2" width="4" height="1" fill="#DAA520" />
                        <rect x="6" y="3" width="1" height="2" fill="#DAA520" />
                        <rect x="4" y="5" width="2" height="1" fill="#DAA520" />
                        <rect x="4" y="7" width="2" height="1" fill="#DAA520" />
                    </svg>
                </div>

                {/* ── GEOMETRIC SHAPES ── */}
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
                <div className="absolute top-[45%] right-[3%] animate-float" style={{ animationDuration: "12s", animationDelay: "4s" }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" className="opacity-[0.1]">
                        <polygon points="10,1 19,19 1,19" stroke="#9EE6CF" strokeWidth="1.5" fill="none" />
                    </svg>
                </div>
                <div className="absolute bottom-[30%] right-[40%] animate-float" style={{ animationDuration: "9s", animationDelay: "1s" }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" className="opacity-[0.1]">
                        <rect x="2" y="2" width="14" height="14" rx="2" transform="rotate(45 9 9)" stroke="#FFF1A8" strokeWidth="2" fill="none" />
                    </svg>
                </div>
                <div className="absolute top-[60%] left-[45%] animate-float opacity-[0.08]" style={{ animationDuration: "14s", animationDelay: "6s" }}>
                    <svg width="28" height="28" viewBox="0 0 28 28">
                        <path d="M14 2 L26 14 L14 26 L2 14 Z" stroke="#C9C3F5" strokeWidth="2" fill="none" />
                    </svg>
                </div>
                <div className="absolute top-[80%] left-[60%] animate-float" style={{ animationDuration: "10s", animationDelay: "3s" }}>
                    <svg width="22" height="22" viewBox="0 0 22 22" className="opacity-[0.08]">
                        <polygon points="11,1 21,8 18,19 4,19 1,8" stroke="#9FA8FF" strokeWidth="1.5" fill="none" />
                    </svg>
                </div>

                {/* Pixel dots scattered */}
                <div className="absolute top-[25%] left-[20%] w-2 h-2 bg-accent-mint rounded-sm opacity-[0.18] animate-float" style={{ animationDuration: "7s" }} />
                <div className="absolute top-[60%] right-[25%] w-2.5 h-2.5 bg-accent-lavender rounded-sm opacity-[0.15] animate-float" style={{ animationDuration: "9s", animationDelay: "3s" }} />
                <div className="absolute top-[40%] right-[8%] w-1.5 h-1.5 bg-accent-pink rounded-sm opacity-[0.18] animate-float" style={{ animationDuration: "6s", animationDelay: "2s" }} />
                <div className="absolute bottom-[40%] left-[7%] w-2 h-2 bg-accent-purple rounded-sm opacity-[0.15] animate-float" style={{ animationDuration: "11s", animationDelay: "5s" }} />
                <div className="absolute top-[18%] left-[45%] w-1.5 h-1.5 bg-accent-yellow rounded-sm opacity-[0.18] animate-float" style={{ animationDuration: "8s", animationDelay: "1s" }} />
                <div className="absolute top-[75%] left-[35%] w-2 h-2 bg-accent-mint rounded-sm opacity-[0.12] animate-float" style={{ animationDuration: "13s", animationDelay: "7s" }} />
                <div className="absolute top-[5%] right-[40%] w-1.5 h-1.5 bg-accent-pink rounded-sm opacity-[0.15] animate-float" style={{ animationDuration: "10s", animationDelay: "4s" }} />
                <div className="absolute bottom-[10%] right-[30%] w-2 h-2 bg-accent-lavender rounded-sm opacity-[0.12] animate-float" style={{ animationDuration: "12s", animationDelay: "6s" }} />

                {/* Floating code text */}
                <div className="absolute top-[35%] left-[4%] opacity-[0.07] animate-float" style={{ animationDuration: "15s", animationDelay: "3s" }}>
                    <span className="font-pixel text-[10px] text-text-secondary">function()</span>
                </div>
                <div className="absolute bottom-[25%] right-[4%] opacity-[0.07] animate-float" style={{ animationDuration: "12s", animationDelay: "5s" }}>
                    <span className="font-pixel text-[10px] text-text-secondary">&lt;/&gt;</span>
                </div>
                <div className="absolute top-[75%] right-[35%] opacity-[0.06] animate-float" style={{ animationDuration: "10s", animationDelay: "8s" }}>
                    <span className="font-pixel text-xs text-text-secondary">0x42</span>
                </div>
                <div className="absolute top-[10%] left-[55%] opacity-[0.06] animate-float" style={{ animationDuration: "18s", animationDelay: "2s" }}>
                    <span className="font-pixel text-[10px] text-text-secondary">while(true)</span>
                </div>
                <div className="absolute bottom-[15%] left-[40%] opacity-[0.05] animate-float" style={{ animationDuration: "14s", animationDelay: "9s" }}>
                    <span className="font-pixel text-[10px] text-text-secondary">LEVEL UP!</span>
                </div>

                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
                    <line x1="10%" y1="20%" x2="30%" y2="40%" stroke="#5F86B5" strokeWidth="1" strokeDasharray="4 8" />
                    <line x1="70%" y1="15%" x2="85%" y2="45%" stroke="#9FA8FF" strokeWidth="1" strokeDasharray="4 8" />
                    <line x1="20%" y1="70%" x2="45%" y2="85%" stroke="#9EE6CF" strokeWidth="1" strokeDasharray="4 8" />
                    <line x1="60%" y1="60%" x2="90%" y2="75%" stroke="#F6B6C8" strokeWidth="1" strokeDasharray="4 8" />
                </svg>

                {/* Twinkling pixel stars */}
                {[
                    { top: "5%", left: "15%" }, { top: "10%", left: "30%" }, { top: "15%", left: "80%" },
                    { top: "20%", left: "70%" }, { top: "30%", left: "50%" }, { top: "35%", left: "55%" },
                    { top: "50%", left: "90%" }, { top: "55%", left: "20%" }, { top: "65%", left: "75%" },
                    { top: "70%", left: "10%" }, { top: "75%", left: "15%" }, { top: "80%", left: "65%" },
                    { top: "85%", left: "45%" }, { top: "88%", left: "55%" }, { top: "92%", left: "25%" },
                ].map((pos, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-text-secondary rounded-full"
                        style={{
                            top: pos.top,
                            left: pos.left,
                            animation: `twinkle ${1.5 + (i % 4)}s ease-in-out ${i * 0.5}s infinite`,
                            opacity: 0.25,
                        }}
                    />
                ))}
            </div>

            {/* ═══ Layer 3: Content ═══ */}
            <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 md:px-12 lg:px-20">

                {/* Title with Glitch Effect */}
                <h2
                    ref={titleRef}
                    className="font-pixel text-3xl sm:text-4xl lg:text-5xl text-center mb-4 relative inline-block"
                    style={{ color: "#2F5D8C", visibility: "hidden" }}
                >
                    <span className="relative z-10">WHAT WE DO</span>
                    {/* Glitch layers */}
                    <span className="absolute top-0 left-0 -z-10 text-[#FF00FF] opacity-0 animate-glitch-1">WHAT WE DO</span>
                    <span className="absolute top-0 left-0 -z-10 text-[#00FFFF] opacity-0 animate-glitch-2">WHAT WE DO</span>
                </h2>

                {/* Decorative pixel divider */}
                <div ref={dividerRef} className="flex items-center justify-center gap-2 mb-16" style={{ visibility: "hidden" }}>
                    <div className="w-8 h-[2px] rounded-full" style={{ background: "#BFD9F2" }} />
                    <div className="w-2 h-2 rounded-sm rotate-45" style={{ background: "#9FA8FF" }} />
                    <div className="w-16 h-[2px] rounded-full" style={{ background: "#BFD9F2" }} />
                    <div className="w-2 h-2 rounded-sm rotate-45" style={{ background: "#F6B6C8" }} />
                    <div className="w-8 h-[2px] rounded-full" style={{ background: "#BFD9F2" }} />
                </div>

                {/* Cards Container - PERSPECTIVE is key for 3D tilt */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7" style={{ perspective: "1000px" }}>
                    {powerUps.map((item, i) => (
                        <div
                            key={item.title}
                            ref={(el) => { cardsRef.current[i] = el; }}
                            className="group relative rounded-2xl flex flex-col min-h-[460px] cursor-none transition-all duration-200 ease-out"
                            style={{
                                visibility: "hidden" as const,
                                background: "#fff",
                                border: "1.5px solid rgba(191, 217, 242, 0.30)",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                                transformStyle: "preserve-3d", // Critical for 3D effect
                            }}
                            onMouseMove={(e) => {
                                const el = e.currentTarget;
                                const rect = el.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const y = e.clientY - rect.top;
                                const centerX = rect.width / 2;
                                const centerY = rect.height / 2;

                                // Rotate based on mouse position (max 10deg)
                                const rotateX = ((y - centerY) / centerY) * -8;
                                const rotateY = ((x - centerX) / centerX) * 8;

                                gsap.to(el, {
                                    rotateX: rotateX,
                                    rotateY: rotateY,
                                    scale: 1.05,
                                    boxShadow: `0 25px 50px ${item.accent}30, 0 10px 20px rgba(0,0,0,0.1)`,
                                    borderColor: `${item.accent}60`,
                                    duration: 0.1,
                                    ease: "power2.out"
                                });

                                // Move content slightly for parallax depth
                                const content = el.querySelector(".card-content") as HTMLElement;
                                if (content) {
                                    gsap.to(content, { x: (x - centerX) * 0.05, y: (y - centerY) * 0.05, duration: 0.1 });
                                }
                            }}
                            onMouseLeave={(e) => {
                                gsap.to(e.currentTarget, {
                                    rotateX: 0,
                                    rotateY: 0,
                                    scale: 1,
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                                    borderColor: "rgba(191, 217, 242, 0.30)",
                                    duration: 0.5,
                                    ease: "elastic.out(1, 0.5)"
                                });
                                const content = e.currentTarget.querySelector(".card-content") as HTMLElement;
                                if (content) gsap.to(content, { x: 0, y: 0, duration: 0.5 });
                            }}
                        >
                            {/* Accent bar at top */}
                            <div
                                data-accent-bar=""
                                className="absolute top-0 left-0 right-0 z-20 rounded-t-2xl"
                                style={{
                                    height: "3px",
                                    background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)`,
                                    opacity: 0.5,
                                }}
                            />

                            {/* ── Visual header area ── */}
                            <div
                                className="relative h-40 lg:h-44 flex items-center justify-center overflow-hidden rounded-t-2xl card-content"
                                style={{
                                    background: `linear-gradient(160deg, ${item.accent}15 0%, ${item.accent}06 100%)`,
                                    transform: "translateZ(20px)", // Pop out in 3D
                                }}
                            >
                                {/* Radial hover highlight */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{
                                        background: `radial-gradient(circle at 50% 60%, ${item.accent}12, transparent 70%)`,
                                    }}
                                />

                                {/* Grid pattern */}
                                <div
                                    className="absolute inset-0 opacity-[0.05]"
                                    style={{
                                        backgroundImage: `linear-gradient(${item.accent}40 1px, transparent 1px), linear-gradient(90deg, ${item.accent}40 1px, transparent 1px)`,
                                        backgroundSize: "20px 20px",
                                    }}
                                />

                                {/* Floating pixel dots */}
                                <div className="absolute top-4 left-4 w-2 h-2 rounded-sm opacity-20 animate-float" style={{ backgroundColor: item.accent, animationDuration: "5s" }} />
                                <div className="absolute top-6 right-6 w-1.5 h-1.5 rounded-sm opacity-15 animate-float" style={{ backgroundColor: item.accent, animationDuration: "7s", animationDelay: "1s" }} />
                                <div className="absolute bottom-6 left-8 w-1 h-1 rounded-sm opacity-20 animate-float" style={{ backgroundColor: item.accent, animationDuration: "6s", animationDelay: "2s" }} />

                                {/* Number badge */}
                                <span
                                    className="absolute top-4 right-4 font-pixel text-[10px] px-2 py-1 rounded-lg opacity-40 group-hover:opacity-90 group-hover:scale-110 transition-all duration-300"
                                    style={{
                                        color: item.accent,
                                        background: `${item.accent}15`,
                                        border: `1px solid ${item.accent}25`,
                                        boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
                                    }}
                                >
                                    0{i + 1}
                                </span>

                                {/* Central icon — enhanced hover */}
                                <div
                                    className="relative w-24 h-24 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-[1.1] group-hover:-rotate-3"
                                    style={{
                                        background: `linear-gradient(135deg, ${item.accent}25, ${item.accent}05)`,
                                        border: `2px solid ${item.accent}20`,
                                        boxShadow: `0 8px 30px ${item.accent}15`,
                                        backdropFilter: "blur(4px)"
                                    }}
                                >
                                    {/* Inner Glow ring */}
                                    <div
                                        className="absolute inset-[-2px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        style={{ border: `2px solid ${item.accent}40`, boxShadow: `0 0 15px ${item.accent}25` }}
                                    />
                                    {(() => { const Icon = pixelIcons[i]; return <Icon color={item.accent} />; })()}
                                </div>

                                {/* Bottom gradient */}
                                <div className="absolute bottom-0 left-0 right-0 h-10" style={{ background: "linear-gradient(transparent, #fff)" }} />
                            </div>

                            {/* ── Text content ── */}
                            <div className="px-10 pb-10 pt-5 flex flex-col flex-1 items-center text-center card-content break-words" style={{ transform: "translateZ(30px)" }}>
                                <h3
                                    className="font-pixel text-sm lg:text-base mb-3 tracking-wide transition-colors duration-300 group-hover:text-[#2F5D8C]"
                                    style={{ color: "#2F5D8C" }}
                                >
                                    {item.title}
                                </h3>

                                <p
                                    className="text-xs sm:text-[13px] lg:text-[14px] leading-loose flex-1 mb-8 max-w-[250px] mx-auto"
                                    style={{ color: "#6B8DB5", fontFamily: "var(--font-body), system-ui, sans-serif" }}
                                >
                                    {item.description}
                                </p>

                                {/* Pixel Button Link */}
                                <div className="mt-auto w-full flex justify-center">
                                    <button
                                        className="relative group/btn font-pixel text-xs tracking-wider px-5 py-2.5 overflow-hidden transition-all duration-200 hover:-translate-y-1 active:translate-y-0"
                                        style={{
                                            color: item.accent,
                                            background: `${item.accent}08`,
                                            border: `1px solid ${item.accent}30`,
                                            boxShadow: `0 4px 0 ${item.accent}20`,
                                            borderRadius: "4px"
                                        }}
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            EXPLORE
                                            <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                        </span>
                                        {/* Hover fill effect */}
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity" />
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
