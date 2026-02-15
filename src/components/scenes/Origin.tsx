"use client";

import { useEffect, useRef, useMemo } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/* ── CyberBird (Parallax Layer 1 — far background, slow) ── */
function CyberBird({ y, speed, delay, scale = 1 }: { y: string; speed: number; delay: number; scale?: number }) {
    return (
        <div
            className="absolute pointer-events-none opacity-60 z-0"
            style={{
                top: y,
                left: "-10%",
                animation: `fly-right ${speed}s linear ${delay}s infinite`,
                transform: `scale(${scale})`,
            }}
        >
            <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                <path d="M2 12 L14 18 L26 12 L38 4" stroke="#9EE6CF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse" />
                <circle cx="14" cy="18" r="2" fill="#9EE6CF" />
                <circle cx="26" cy="12" r="1.5" fill="#BFD9F2" />
                <rect x="0" y="12" width="2" height="2" fill="#5F86B5" opacity="0.6" />
                <rect x="-4" y="10" width="2" height="2" fill="#5F86B5" opacity="0.4" />
            </svg>
        </div>
    );
}

/* ── Floating Particle (scroll-linked via CSS) ── */
function Particle({ left, size, color, duration, delay }: { left: string; size: number; color: string; duration: number; delay: number }) {
    return (
        <div
            className="absolute bottom-0 rounded-full pointer-events-none"
            style={{
                left,
                width: size,
                height: size,
                backgroundColor: color,
                animation: `particle-drift ${duration}s linear ${delay}s infinite`,
            }}
        />
    );
}

export default function Origin() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const line1Ref = useRef<HTMLParagraphElement>(null);
    const line2Ref = useRef<HTMLParagraphElement>(null);
    const line3Ref = useRef<HTMLParagraphElement>(null);
    const mascotRef = useRef<HTMLDivElement>(null);
    const windowRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const borderDrawRef = useRef<HTMLDivElement>(null);
    const dividerRef = useRef<HTMLDivElement>(null);
    const parallaxBgRef = useRef<HTMLDivElement>(null);
    const parallaxMidRef = useRef<HTMLDivElement>(null);
    const noiseRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement>(null);

    // Pre-generate particle positions (stable between renders)
    const particles = useMemo(() =>
        Array.from({ length: 30 }, (_, i) => ({
            left: `${(i * 3.3 + Math.sin(i) * 5) % 100}%`,
            size: 1.5 + (i % 3),
            color: i % 3 === 0 ? "#9EE6CF" : i % 3 === 1 ? "#C9C3F5" : "#9FA8FF",
            duration: 12 + (i % 8) * 2,
            delay: (i % 10) * 1.5,
        })), []
    );

    useEffect(() => {
        const section = sectionRef.current;
        const bg = bgRef.current;
        if (!section || !bg) return;

        // ── Set initial hidden states ──
        gsap.set(titleRef.current, { autoAlpha: 0, clipPath: "inset(0 100% 0 0)" });
        gsap.set(dividerRef.current, { scaleX: 0, autoAlpha: 0, transformOrigin: "left center" });
        gsap.set(windowRef.current, { autoAlpha: 0, clipPath: "inset(0 0 100% 0)" });
        gsap.set([line1Ref.current, line2Ref.current, line3Ref.current], { y: 15, autoAlpha: 0 });
        gsap.set(mascotRef.current, { x: 80, autoAlpha: 0, scale: 0.85 });
        gsap.set(noiseRef.current, { autoAlpha: 0 });
        gsap.set(particlesRef.current, { autoAlpha: 0 });

        // ── PINNED SCROLL TIMELINE ──
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "+=280%",       // Extended for cinematic exit transition
                scrub: 0.6,
                pin: true,
                anticipatePin: 1,
            },
        });

        // ── Phase 1 (0%→15%): Background color transition ──
        tl.fromTo(bg,
            { backgroundColor: "#F9FCFF" },
            { backgroundColor: "#0F172A", duration: 0.15, ease: "none" },
            0
        );

        // Noise texture fades in as bg darkens
        tl.to(noiseRef.current, { autoAlpha: 1, duration: 0.1 }, 0.08);

        // Particles fade in
        tl.to(particlesRef.current, { autoAlpha: 1, duration: 0.1 }, 0.1);

        // ── Phase 2 (12%→30%): Parallax layers shift at different speeds ──
        tl.to(parallaxBgRef.current, { y: -40, duration: 0.7, ease: "none" }, 0);
        tl.to(parallaxMidRef.current, { y: -25, duration: 0.7, ease: "none" }, 0);

        // ── Phase 3 (15%→35%): Title clip-reveal (wipe from left to right) ──
        tl.to(titleRef.current, {
            autoAlpha: 1,
            clipPath: "inset(0 0% 0 0)",
            duration: 0.15,
            ease: "power2.out",
        }, 0.15);

        // ── Phase 4 (30%→45%): Horizontal divider draws itself ──
        tl.to(dividerRef.current, {
            autoAlpha: 1,
            scaleX: 1,
            duration: 0.12,
            ease: "power2.inOut",
        }, 0.30);

        // ── Phase 5 (35%→55%): Mascot slides in with scale ──
        tl.to(mascotRef.current, {
            x: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.18,
            ease: "back.out(1.3)",
        }, 0.32);

        // ── Phase 6 (38%→60%): Text card boot-up (clip from bottom) ──
        tl.to(windowRef.current, {
            autoAlpha: 1,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.15,
            ease: "power3.out",
        }, 0.38);

        // Border draw effect (animate border-color from transparent)
        if (borderDrawRef.current) {
            gsap.set(borderDrawRef.current, { borderColor: "rgba(148, 163, 184, 0)" });
            tl.to(borderDrawRef.current, {
                borderColor: "rgba(148, 163, 184, 0.25)",
                duration: 0.1,
                ease: "none",
            }, 0.42);
        }

        // ── Phase 7 (45%→65%): Text lines stagger in ──
        tl.to(line1Ref.current, { y: 0, autoAlpha: 1, duration: 0.1, ease: "power2.out" }, 0.45);
        tl.to(line2Ref.current, { y: 0, autoAlpha: 1, duration: 0.1, ease: "power2.out" }, 0.52);
        tl.to(line3Ref.current, { y: 0, autoAlpha: 1, duration: 0.1, ease: "power2.out" }, 0.59);

        // ── Phase 8 (65%→70%): Hold / breathing room ──

        // ── Phase 9 (70%→95%): Cinematic EXIT — dark-to-light transition ──
        // Text lines fade out with upward drift
        tl.to(line3Ref.current, { y: -20, autoAlpha: 0, duration: 0.06, ease: "power2.in" }, 0.70);
        tl.to(line2Ref.current, { y: -20, autoAlpha: 0, duration: 0.06, ease: "power2.in" }, 0.73);
        tl.to(line1Ref.current, { y: -20, autoAlpha: 0, duration: 0.06, ease: "power2.in" }, 0.76);

        // Mascot scales down and fades
        tl.to(mascotRef.current, {
            scale: 0.7, autoAlpha: 0, y: 30, duration: 0.1, ease: "power2.in",
        }, 0.75);

        // Text window clips shut (reverse boot-up)
        tl.to(windowRef.current, {
            clipPath: "inset(100% 0 0 0)", autoAlpha: 0, duration: 0.1, ease: "power3.in",
        }, 0.78);

        // Title wipes away
        tl.to(titleRef.current, {
            clipPath: "inset(0 0 0 100%)", autoAlpha: 0, duration: 0.08, ease: "power2.in",
        }, 0.80);

        // Divider shrinks
        tl.to(dividerRef.current, {
            scaleX: 0, autoAlpha: 0, duration: 0.06, ease: "power2.in",
        }, 0.80);

        // Noise & particles fade out
        tl.to(noiseRef.current, { autoAlpha: 0, duration: 0.1 }, 0.82);
        tl.to(particlesRef.current, { autoAlpha: 0, duration: 0.1 }, 0.82);

        // ── Phase 10 (85%→100%): Background dark → light transition ──
        tl.to(bg, {
            backgroundColor: "#D9EEFB", duration: 0.15, ease: "power2.inOut",
        }, 0.85);

        // Parallax layers drift further
        tl.to(parallaxBgRef.current, { y: -80, duration: 0.3, ease: "none" }, 0.7);
        tl.to(parallaxMidRef.current, { y: -50, duration: 0.3, ease: "none" }, 0.7);

        // Mascot idle bob (plays independently, not scroll-linked)
        const bobTween = gsap.to(mascotRef.current, {
            y: -10,
            duration: 2.5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: 0.5,
        });

        return () => {
            bobTween.kill();
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-screen overflow-hidden"
        >
            {/* ═══ Layer 0: Animated Background ═══ */}
            <div
                ref={bgRef}
                className="absolute inset-0 z-0"
                style={{ backgroundColor: "#F9FCFF" }}
            />

            {/* ═══ Layer 1: Noise/Grain Texture Overlay ═══ */}
            <div
                ref={noiseRef}
                className="absolute inset-0 z-[1] pointer-events-none"
                style={{
                    /* SVG-based noise pattern — tiny, tiled, animated */
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "repeat",
                    backgroundSize: "256px 256px",
                    animation: "noise-shift 0.5s steps(3) infinite",
                    opacity: 0,
                    mixBlendMode: "overlay",
                }}
            />

            {/* ═══ Layer 2: Scroll-linked Particles ═══ */}
            <div
                ref={particlesRef}
                className="absolute inset-0 z-[2] pointer-events-none overflow-hidden"
                style={{ opacity: 0 }}
            >
                {particles.map((p, i) => (
                    <Particle key={i} {...p} />
                ))}
            </div>

            {/* ═══ Layer 3: Parallax Background (moves slowest) ═══ */}
            <div ref={parallaxBgRef} className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                        maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
                    }}
                />

                {/* Cyber Birds (far layer) */}
                <CyberBird y="12%" speed={18} delay={0} scale={0.8} />
                <CyberBird y="28%" speed={22} delay={5} scale={0.6} />
                <CyberBird y="65%" speed={20} delay={2} scale={0.7} />
                <CyberBird y="82%" speed={25} delay={8} scale={0.5} />

                {/* Soft Pulsing Orbs */}
                <div
                    className="absolute top-[30%] right-[30%] w-40 h-40 rounded-full opacity-[0.06] animate-pulse"
                    style={{ background: "radial-gradient(circle, #9EE6CF 0%, transparent 70%)", animationDuration: "4s" }}
                />
                <div
                    className="absolute bottom-[30%] left-[28%] w-28 h-28 rounded-full opacity-[0.05] animate-pulse"
                    style={{ background: "radial-gradient(circle, #C9C3F5 0%, transparent 70%)", animationDuration: "5s", animationDelay: "2s" }}
                />

                {/* Vertical connection lines */}
                <div className="absolute top-0 left-[50%] w-[1px] h-[20%] bg-gradient-to-b from-[#BFD9F2] to-transparent opacity-20" />
                <div className="absolute bottom-0 left-[25%] w-[1px] h-[15%] bg-gradient-to-t from-[#9EE6CF] to-transparent opacity-15" />
                <div className="absolute bottom-0 right-[35%] w-[1px] h-[10%] bg-gradient-to-t from-[#C9C3F5] to-transparent opacity-10" />
            </div>

            {/* ═══ Layer 4: Parallax Mid-ground (moves medium speed) ═══ */}
            <div ref={parallaxMidRef} className="absolute inset-0 z-[4] pointer-events-none overflow-hidden">
                {/* Floating Pixel Shapes */}
                <div className="absolute top-[18%] right-[12%] animate-float" style={{ animationDuration: "7s" }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-20">
                        <rect x="8" y="0" width="8" height="8" transform="rotate(45 8 0)" fill="#9EE6CF" />
                    </svg>
                </div>
                <div className="absolute top-[72%] left-[8%] animate-float" style={{ animationDuration: "9s", animationDelay: "3s" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-15">
                        <rect x="5" y="0" width="4" height="14" rx="1" fill="#C9C3F5" />
                        <rect x="0" y="5" width="14" height="4" rx="1" fill="#C9C3F5" />
                    </svg>
                </div>
                <div className="absolute top-[35%] left-[5%] animate-float opacity-10" style={{ animationDuration: "11s", animationDelay: "1s" }}>
                    <div className="w-3 h-3 bg-accent-mint rounded-sm" />
                </div>
                <div className="absolute top-[55%] right-[8%] animate-float opacity-10" style={{ animationDuration: "8s", animationDelay: "4s" }}>
                    <div className="w-2 h-2 bg-accent-lavender rounded-sm" />
                </div>
                <div className="absolute bottom-[35%] right-[22%] animate-float opacity-[0.08]" style={{ animationDuration: "10s", animationDelay: "2s" }}>
                    <div className="w-4 h-4 bg-accent-pink rounded-sm" />
                </div>

                {/* Gaming Icons */}
                <div className="absolute top-[22%] left-[25%] animate-float opacity-[0.12]" style={{ animationDuration: "14s", animationDelay: "1s" }}>
                    <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                        <rect x="4" y="4" width="20" height="12" rx="6" stroke="#9EE6CF" strokeWidth="1.5" />
                        <circle cx="10" cy="10" r="2" fill="#9EE6CF" />
                        <circle cx="18" cy="10" r="2" fill="#9EE6CF" />
                    </svg>
                </div>
                <div className="absolute bottom-[25%] right-[18%] animate-float opacity-[0.12]" style={{ animationDuration: "9s", animationDelay: "5s" }}>
                    <svg width="18" height="16" viewBox="0 0 14 12" fill="#F6B6C8">
                        <path d="M7 12 L0 5 C-1 2 2 -1 5 1 L7 3 L9 1 C12 -1 15 2 14 5 Z" />
                    </svg>
                </div>
                <div className="absolute top-[50%] left-[15%] animate-float opacity-[0.1]" style={{ animationDuration: "12s", animationDelay: "3s" }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="#FFF1A8">
                        <polygon points="8,0 10,6 16,6 11,10 13,16 8,12 3,16 5,10 0,6 6,6" />
                    </svg>
                </div>

                {/* Code snippets */}
                <div className="absolute top-[15%] left-[10%] opacity-[0.08] animate-float" style={{ animationDuration: "8s" }}>
                    <span className="font-pixel text-4xl text-accent-mint">01</span>
                </div>
                <div className="absolute top-[40%] right-[15%] opacity-[0.08] animate-float" style={{ animationDuration: "12s", animationDelay: "2s" }}>
                    <span className="font-pixel text-2xl text-accent-purple">import OASIS</span>
                </div>
                <div className="absolute bottom-[20%] left-[20%] opacity-[0.06] animate-float" style={{ animationDuration: "10s", animationDelay: "1s" }}>
                    <span className="font-pixel text-5xl text-white">&#123; &#125;</span>
                </div>
                <div className="absolute bottom-[12%] right-[10%] opacity-[0.06] animate-float" style={{ animationDuration: "15s", animationDelay: "4s" }}>
                    <span className="font-pixel text-xs text-accent-mint">// level up</span>
                </div>
            </div>

            {/* ═══ Layer 5: Main Content (foreground, moves with pin) ═══ */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-center">

                        {/* Left: Text (3 of 5 columns) */}
                        <div className="lg:col-span-3 order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">

                            {/* ── Title with clip-reveal animation ── */}
                            <h2
                                ref={titleRef}
                                className="font-pixel text-3xl sm:text-4xl lg:text-5xl mb-4 leading-tight tracking-wide"
                                style={{
                                    color: "#E2E8F0",
                                    textShadow: "0 3px 0 #0f172a",
                                    clipPath: "inset(0 100% 0 0)",
                                }}
                            >
                                WHO WE ARE
                            </h2>

                            {/* ── Horizontal Divider (draws itself) ── */}
                            <div
                                ref={dividerRef}
                                className="w-full max-w-xs lg:max-w-sm h-[2px] mb-8 rounded-full"
                                style={{
                                    background: "linear-gradient(90deg, #9EE6CF, #9FA8FF, #C9C3F5)",
                                    boxShadow: "0 0 12px rgba(158,230,207,0.4), 0 0 24px rgba(159,168,255,0.2)",
                                    transform: "scaleX(0)",
                                    transformOrigin: "left center",
                                }}
                            />

                            {/* ── Text Card with boot-up clip effect ── */}
                            <div
                                ref={windowRef}
                                className="relative w-full"
                                style={{
                                    clipPath: "inset(0 0 100% 0)",
                                }}
                            >
                                {/* Border container (animated separately for draw effect) */}
                                <div
                                    ref={borderDrawRef}
                                    className="relative w-full rounded-[20px]"
                                    style={{
                                        background: "rgba(30, 41, 59, 0.45)",
                                        border: "2px solid rgba(148, 163, 184, 0)",
                                        padding: "clamp(1.75rem, 4vw, 3.5rem)",
                                        boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.5)",
                                    }}
                                >
                                    {/* Corner accents */}
                                    <div className="absolute -top-px -left-px w-5 h-5 border-t-2 border-l-2 border-accent-mint rounded-tl-lg" />
                                    <div className="absolute -top-px -right-px w-5 h-5 border-t-2 border-r-2 border-accent-purple rounded-tr-lg" />
                                    <div className="absolute -bottom-px -left-px w-5 h-5 border-b-2 border-l-2 border-accent-mint rounded-bl-lg" />
                                    <div className="absolute -bottom-px -right-px w-5 h-5 border-b-2 border-r-2 border-accent-purple rounded-br-lg" />

                                    <div className="space-y-5 lg:space-y-6">
                                        {/* Line 1 — with color bleed glow on accent words */}
                                        <p
                                            ref={line1Ref}
                                            className="text-lg sm:text-xl lg:text-2xl font-light leading-relaxed text-slate-100"
                                        >
                                            We are{" "}
                                            <span
                                                className="font-bold font-pixel text-base sm:text-lg align-middle mx-0.5"
                                                style={{
                                                    color: "#9EE6CF",
                                                    animation: "glow-pulse 3s ease-in-out infinite",
                                                    textShadow: "0 0 6px #9EE6CF, 0 0 12px #9EE6CF",
                                                }}
                                            >
                                                OASIS
                                            </span>
                                            , NMIT&apos;s home for{" "}
                                            <strong className="text-white font-medium" style={{ textShadow: "0 0 8px rgba(255,255,255,0.3)" }}>
                                                esports athletes
                                            </strong>,{" "}
                                            <strong className="text-white font-medium" style={{ textShadow: "0 0 8px rgba(255,255,255,0.3)" }}>
                                                game developers
                                            </strong>, and{" "}
                                            <strong className="text-white font-medium" style={{ textShadow: "0 0 8px rgba(255,255,255,0.3)" }}>
                                                digital creators
                                            </strong>.
                                        </p>

                                        {/* Line 2 */}
                                        <p
                                            ref={line2Ref}
                                            className="text-base sm:text-lg lg:text-xl leading-relaxed text-slate-300"
                                        >
                                            What starts as a game ends in skills, teamwork, and real-world impact.
                                        </p>

                                        {/* Line 3 — bold with subtle glow */}
                                        <p
                                            ref={line3Ref}
                                            className="text-base sm:text-lg lg:text-xl leading-relaxed text-slate-300"
                                        >
                                            Whether you&apos;re grinding ranked ladders or compiling your first build,{" "}
                                            <strong
                                                className="text-white"
                                                style={{ textShadow: "0 0 10px rgba(159,168,255,0.4)" }}
                                            >
                                                this is where your journey levels up.
                                            </strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Mascot (2 of 5 columns) */}
                        <div
                            ref={mascotRef}
                            className="lg:col-span-2 flex justify-center items-center order-1 lg:order-2"
                        >
                            <img
                                src="/assets/prat-mascot.png"
                                alt="OASIS Mascot"
                                className="w-48 sm:w-56 lg:w-64 h-auto drop-shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
