"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import DraggableCharacter from "@/components/DraggableCharacter";
import CoinBlocks from "@/components/CoinBlocks";

/* ── Pixel Bird Component ── */
function PixelBird({ delay, y, speed, direction }: { delay: number; y: string; speed: number; direction: 1 | -1 }) {
    return (
        <div
            className="absolute pointer-events-none"
            style={{
                top: y,
                left: direction === 1 ? "-60px" : "auto",
                right: direction === -1 ? "-60px" : "auto",
                animation: `fly-${direction === 1 ? "right" : "left"} ${speed}s linear ${delay}s infinite`,
            }}
        >
            <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                {/* Body */}
                <rect x="12" y="8" width="8" height="6" fill="#2F5D8C" />
                {/* Head */}
                <rect x="20" y="6" width="6" height="6" fill="#2F5D8C" />
                {/* Eye */}
                <rect x="23" y="7" width="2" height="2" fill="white" />
                {/* Beak */}
                <rect x="26" y="9" width="4" height="2" fill="#FFF1A8" />
                {/* Tail */}
                <rect x="8" y="8" width="4" height="2" fill="#5F86B5" />
                <rect x="6" y="6" width="4" height="2" fill="#5F86B5" />
                {/* Wing (animated via CSS) */}
                <rect className="wing" x="14" y="4" width="6" height="4" fill="#5F86B5" style={{ animation: `flap 0.3s ease-in-out infinite alternate` }} />
            </svg>
        </div>
    );
}

/* ── Pixel Game Character ── */
function PixelCharacter({ type, startX, y, speed, delay }: { type: "mario" | "ghost" | "coin"; startX: string; y: string; speed: number; delay: number }) {
    const characters = {
        mario: (
            <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
                {/* Hat */}
                <rect x="6" y="0" width="16" height="4" fill="#F6B6C8" />
                <rect x="4" y="4" width="20" height="4" fill="#F6B6C8" />
                {/* Face */}
                <rect x="4" y="8" width="20" height="8" fill="#FFF1A8" />
                {/* Eyes */}
                <rect x="8" y="10" width="3" height="3" fill="#2F5D8C" />
                <rect x="17" y="10" width="3" height="3" fill="#2F5D8C" />
                {/* Body */}
                <rect x="6" y="16" width="16" height="10" fill="#9FA8FF" />
                {/* Belt */}
                <rect x="6" y="22" width="16" height="2" fill="#C9C3F5" />
                {/* Legs */}
                <rect x="6" y="26" width="6" height="8" fill="#2F5D8C" />
                <rect x="16" y="26" width="6" height="8" fill="#2F5D8C" />
                {/* Shoes */}
                <rect x="4" y="32" width="8" height="4" fill="#9EE6CF" />
                <rect x="16" y="32" width="8" height="4" fill="#9EE6CF" />
            </svg>
        ),
        ghost: (
            <svg width="32" height="36" viewBox="0 0 32 36" fill="none">
                {/* Body */}
                <rect x="4" y="4" width="24" height="24" rx="12" fill="white" opacity="0.85" />
                {/* Eyes */}
                <rect x="9" y="12" width="5" height="6" fill="#2F5D8C" />
                <rect x="18" y="12" width="5" height="6" fill="#2F5D8C" />
                {/* Pupils */}
                <rect x="11" y="14" width="2" height="2" fill="#9FA8FF" />
                <rect x="20" y="14" width="2" height="2" fill="#9FA8FF" />
                {/* Mouth */}
                <rect x="12" y="22" width="8" height="3" rx="1" fill="#C9C3F5" />
                {/* Wavy bottom */}
                <rect x="4" y="28" width="6" height="4" fill="white" opacity="0.85" />
                <rect x="13" y="28" width="6" height="4" fill="white" opacity="0.85" />
                <rect x="22" y="28" width="6" height="4" fill="white" opacity="0.85" />
                <rect x="8" y="32" width="6" height="4" fill="white" opacity="0.85" />
                <rect x="18" y="32" width="6" height="4" fill="white" opacity="0.85" />
            </svg>
        ),
        coin: (
            <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
                <rect x="4" y="0" width="12" height="24" rx="6" fill="#FFF1A8" stroke="#C9C3F5" strokeWidth="2" />
                <text x="10" y="16" textAnchor="middle" fill="#2F5D8C" fontSize="10" fontWeight="bold" fontFamily="monospace">$</text>
            </svg>
        ),
    };
    return (
        <div
            className="absolute pointer-events-none"
            style={{
                bottom: y,
                left: startX,
                animation: `walk-right ${speed}s linear ${delay}s infinite`,
            }}
        >
            <div style={{ animation: type === "ghost" ? "float 1.5s ease-in-out infinite" : type === "coin" ? "coin-spin 0.8s ease-in-out infinite" : "bob 0.4s ease-in-out infinite alternate" }}>
                {characters[type]}
            </div>
        </div>
    );
}

/* ── Floating Stars ── */
function FloatingStar({ x, y, size, delay }: { x: string; y: string; size: number; delay: number }) {
    return (
        <div
            className="absolute pointer-events-none"
            style={{ left: x, top: y, animation: `twinkle 2s ease-in-out ${delay}s infinite` }}
        >
            <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
                <path d="M8 0 L10 6 L16 8 L10 10 L8 16 L6 10 L0 8 L6 6 Z" fill="#FFF1A8" opacity="0.7" />
            </svg>
        </div>
    );
}

export default function StartScreen() {
    const sectionRef = useRef<HTMLElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const promptRef = useRef<HTMLDivElement>(null);
    const cloudsRef = useRef<HTMLDivElement>(null);
    const cityscapeRef = useRef<HTMLDivElement>(null);
    const groundRef = useRef<HTMLDivElement>(null);
    const [hoveredLetter, setHoveredLetter] = useState<number | null>(null);

    const letters = ["O", "A", "S", "I", "S"];
    const letterColors = ["#9FA8FF", "#F6B6C8", "#9EE6CF", "#C9C3F5", "#FFF1A8"];

    useEffect(() => {
        const section = sectionRef.current;
        const logo = logoRef.current;
        const prompt = promptRef.current;
        const clouds = cloudsRef.current;
        const cityscape = cityscapeRef.current;
        const ground = groundRef.current;
        if (!section || !logo || !prompt || !clouds || !cityscape || !ground) return;

        // Logo letters start hidden, entrance animates them in
        const logoLetters = logo.querySelectorAll(".logo-letter");
        gsap.set(logoLetters, { y: -80, opacity: 0, scale: 0.3, rotationX: 90 });

        // Quick entrance animation
        const entranceTl = gsap.timeline();
        entranceTl.to(logoLetters, {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationX: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "back.out(2)",
            delay: 0.3,
        });

        // Prompt fade in
        gsap.fromTo(prompt, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, delay: 1 });

        // Bounce prompt
        gsap.to(prompt, {
            y: -6,
            duration: 0.5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: 1.5,
        });

        // Scroll timeline — uses fromTo so reverse always restores the logo
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "+=200%",
                scrub: 0.3,
                pin: true,
                anticipatePin: 1,
            },
        });

        tl.fromTo(
            logoLetters,
            {
                scale: 1,
                y: 0,
                opacity: 1,
            },
            {
                scale: 0.12,
                y: -350,
                opacity: 0,
                stagger: 0.02,
                duration: 0.5,
                ease: "power3.in",
            },
            0
        )
            .fromTo(prompt, { opacity: 1, y: 0 }, { opacity: 0, y: 20, duration: 0.15 }, 0)
            .to(clouds, { y: -120, duration: 0.5 }, 0)
            .to(cityscape, { y: -60, scale: 1.08, duration: 0.5 }, 0)
            .to(ground, { y: 40, duration: 0.5 }, 0);

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-screen overflow-hidden"
            style={{ background: "linear-gradient(180deg, #D9EEFB 0%, #EAF6FF 50%, #F9FCFF 100%)" }}
        >
            {/* ── Draggable Characters ── */}
            <DraggableCharacter src="/assets/mario.svg" alt="Draggable Mario" width={80} height={120} initialX={60} initialYPercent={35} side="left" />
            <DraggableCharacter src="/assets/pikachu.svg" alt="Draggable Pikachu" width={90} height={90} initialX={60} initialYPercent={35} side="right" />
            <DraggableCharacter src="/assets/pacman.svg" alt="Draggable Pac-Man" width={70} height={70} initialX={80} initialYPercent={65} side="left" />
            <DraggableCharacter src="/assets/space-invader.svg" alt="Draggable Space Invader" width={75} height={55} initialX={80} initialYPercent={60} side="right" />
            {/* ── Coin Blocks ── */}
            <CoinBlocks />
            {/* ── CSS Animations ── */}



            {/* ── Floating Stars ── */}
            <FloatingStar x="8%" y="15%" size={14} delay={0} />
            <FloatingStar x="22%" y="8%" size={10} delay={0.8} />
            <FloatingStar x="75%" y="12%" size={16} delay={1.5} />
            <FloatingStar x="88%" y="20%" size={12} delay={0.3} />
            <FloatingStar x="45%" y="5%" size={11} delay={2} />
            <FloatingStar x="60%" y="18%" size={13} delay={1.2} />
            <FloatingStar x="35%" y="22%" size={9} delay={0.6} />

            {/* ── Flying Birds ── */}
            <PixelBird delay={0} y="12%" speed={8} direction={1} />
            <PixelBird delay={3} y="18%" speed={10} direction={-1} />
            <PixelBird delay={6} y="8%" speed={12} direction={1} />
            <PixelBird delay={1.5} y="25%" speed={9} direction={1} />

            {/* ── Game Characters Walking ── */}
            <PixelCharacter type="mario" startX="-40px" y="60px" speed={14} delay={0} />
            <PixelCharacter type="ghost" startX="-40px" y="80px" speed={18} delay={4} />
            <PixelCharacter type="coin" startX="-40px" y="50px" speed={10} delay={7} />
            <PixelCharacter type="mario" startX="-40px" y="55px" speed={16} delay={10} />

            {/* ── Parallax Clouds ── */}
            <div ref={cloudsRef} className="absolute inset-0 pointer-events-none">
                <svg className="absolute top-[8%] left-[5%] w-48 opacity-70" viewBox="0 0 200 80" fill="none"
                    style={{ animation: "cloud-drift 20s ease-in-out infinite alternate", filter: "drop-shadow(0 4px 12px rgba(191,217,242,0.4))" }}>
                    <ellipse cx="70" cy="50" rx="70" ry="30" fill="white" />
                    <ellipse cx="120" cy="40" rx="50" ry="25" fill="white" />
                    <ellipse cx="50" cy="40" rx="40" ry="20" fill="white" />
                </svg>
                <svg className="absolute top-[14%] right-[8%] w-64 opacity-60" viewBox="0 0 200 80" fill="none"
                    style={{ animation: "cloud-drift 25s ease-in-out 2s infinite alternate-reverse", filter: "drop-shadow(0 4px 12px rgba(191,217,242,0.3))" }}>
                    <ellipse cx="80" cy="50" rx="80" ry="30" fill="white" />
                    <ellipse cx="140" cy="42" rx="50" ry="22" fill="white" />
                </svg>
                <svg className="absolute top-[22%] left-[35%] w-44 opacity-55" viewBox="0 0 200 80" fill="none"
                    style={{ animation: "cloud-drift 18s ease-in-out 4s infinite alternate", filter: "drop-shadow(0 4px 12px rgba(191,217,242,0.3))" }}>
                    <ellipse cx="100" cy="50" rx="90" ry="28" fill="white" />
                    <ellipse cx="60" cy="42" rx="40" ry="18" fill="white" />
                </svg>
                <svg className="absolute top-[6%] left-[60%] w-36 opacity-50" viewBox="0 0 200 80" fill="none"
                    style={{ animation: "cloud-drift 22s ease-in-out 1s infinite alternate-reverse", filter: "drop-shadow(0 4px 12px rgba(191,217,242,0.25))" }}>
                    <ellipse cx="100" cy="50" rx="80" ry="26" fill="white" />
                </svg>
                {/* Extra cloud for depth */}
                <svg className="absolute top-[30%] right-[25%] w-40 opacity-45" viewBox="0 0 200 80" fill="none"
                    style={{ animation: "cloud-drift 28s ease-in-out 3s infinite alternate", filter: "drop-shadow(0 4px 12px rgba(191,217,242,0.2))" }}>
                    <ellipse cx="90" cy="50" rx="75" ry="25" fill="white" />
                    <ellipse cx="140" cy="45" rx="45" ry="20" fill="white" />
                </svg>
            </div>

            {/* ── Rainbow Arc ── behind buildings, endpoints hidden below */}
            <div className="absolute inset-0 pointer-events-none z-[1]" style={{ overflow: "hidden" }}>
                <svg
                    className="absolute bottom-0 left-1/2 -translate-x-1/2"
                    width="140%"
                    height="100%"
                    viewBox="0 0 1000 700"
                    fill="none"
                    preserveAspectRatio="xMidYMax meet"
                    style={{ minWidth: "900px" }}
                >
                    {/* 7-band smooth rainbow — large arc, endpoints below viewport */}
                    <path d="M 50 700 A 450 450 0 0 1 950 700" stroke="#FF6B6B" strokeWidth="14" fill="none" opacity="0.3" />
                    <path d="M 68 700 A 432 432 0 0 1 932 700" stroke="#FFA94D" strokeWidth="14" fill="none" opacity="0.3" />
                    <path d="M 86 700 A 414 414 0 0 1 914 700" stroke="#FFD93D" strokeWidth="14" fill="none" opacity="0.3" />
                    <path d="M 104 700 A 396 396 0 0 1 896 700" stroke="#69DB7C" strokeWidth="14" fill="none" opacity="0.28" />
                    <path d="M 122 700 A 378 378 0 0 1 878 700" stroke="#74C0FC" strokeWidth="14" fill="none" opacity="0.28" />
                    <path d="M 140 700 A 360 360 0 0 1 860 700" stroke="#9FA8FF" strokeWidth="14" fill="none" opacity="0.25" />
                    <path d="M 158 700 A 342 342 0 0 1 842 700" stroke="#CC5DE8" strokeWidth="14" fill="none" opacity="0.25" />
                </svg>
            </div>

            {/* ── Cityscape Silhouette ── */}
            <div ref={cityscapeRef} className="absolute bottom-0 left-0 right-0 pointer-events-none z-[3]">
                <svg className="w-full" viewBox="0 0 1440 300" fill="none" preserveAspectRatio="xMidYMax slice">
                    <rect x="50" y="120" width="60" height="180" rx="2" fill="#C9C3F5" opacity="0.4" />
                    <rect x="55" y="130" width="12" height="12" rx="1" fill="#EAF6FF" /><rect x="75" y="130" width="12" height="12" rx="1" fill="#EAF6FF" />
                    <rect x="55" y="155" width="12" height="12" rx="1" fill="#EAF6FF" /><rect x="75" y="155" width="12" height="12" rx="1" fill="#EAF6FF" />
                    <rect x="140" y="80" width="50" height="220" rx="2" fill="#9FA8FF" opacity="0.35" />
                    <rect x="148" y="90" width="10" height="10" rx="1" fill="#EAF6FF" /><rect x="165" y="90" width="10" height="10" rx="1" fill="#EAF6FF" />
                    <rect x="148" y="110" width="10" height="10" rx="1" fill="#EAF6FF" /><rect x="165" y="110" width="10" height="10" rx="1" fill="#EAF6FF" />
                    <rect x="220" y="150" width="70" height="150" rx="2" fill="#F6B6C8" opacity="0.3" />
                    <rect x="350" y="100" width="55" height="200" rx="2" fill="#C9C3F5" opacity="0.35" />
                    <rect x="450" y="130" width="80" height="170" rx="2" fill="#9FA8FF" opacity="0.3" />
                    <rect x="580" y="90" width="45" height="210" rx="2" fill="#9EE6CF" opacity="0.35" />
                    <rect x="660" y="140" width="65" height="160" rx="2" fill="#F6B6C8" opacity="0.3" />
                    <rect x="770" y="70" width="55" height="230" rx="2" fill="#C9C3F5" opacity="0.4" />
                    <rect x="870" y="120" width="70" height="180" rx="2" fill="#9FA8FF" opacity="0.3" />
                    <rect x="980" y="100" width="50" height="200" rx="2" fill="#9EE6CF" opacity="0.3" />
                    <rect x="1070" y="150" width="80" height="150" rx="2" fill="#F6B6C8" opacity="0.25" />
                    <rect x="1190" y="80" width="60" height="220" rx="2" fill="#C9C3F5" opacity="0.35" />
                    <rect x="1290" y="130" width="70" height="170" rx="2" fill="#9FA8FF" opacity="0.3" />
                    <rect x="1380" y="110" width="60" height="190" rx="2" fill="#9EE6CF" opacity="0.3" />
                    {/* Window lights twinkling */}
                    <rect x="360" y="115" width="8" height="8" fill="#FFF1A8" opacity="0.6"><animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" /></rect>
                    <rect x="460" y="145" width="8" height="8" fill="#FFF1A8" opacity="0.5"><animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" /></rect>
                    <rect x="780" y="90" width="8" height="8" fill="#FFF1A8" opacity="0.7"><animate attributeName="opacity" values="0.7;1;0.7" dur="1.8s" repeatCount="indefinite" /></rect>
                    <rect x="990" y="120" width="8" height="8" fill="#FFF1A8" opacity="0.4"><animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" /></rect>
                    {/* Ground */}
                    <rect x="0" y="280" width="1440" height="20" fill="#BFD9F2" opacity="0.5" />
                </svg>
            </div>

            {/* ── Ground + Pixel Grass ── */}
            <div ref={groundRef} className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-[5]">
                <div className="absolute bottom-0 left-0 right-0 h-5" style={{ background: "linear-gradient(90deg, #F6B6C8, #C9C3F5, #9FA8FF, #9EE6CF, #FFF1A8, #F6B6C8)", backgroundSize: "200% 100%", animation: "rainbow-scroll 8s linear infinite" }} />
                {/* Pixel blocks */}
                <div className="absolute bottom-5 left-[8%] w-4 h-4 bg-accent-mint opacity-60" />
                <div className="absolute bottom-5 left-[15%] w-3 h-6 bg-accent-mint opacity-50" />
                <div className="absolute bottom-5 left-[30%] w-5 h-3 bg-accent-mint opacity-55" />
                <div className="absolute bottom-5 left-[50%] w-3 h-5 bg-accent-mint opacity-50" />
                <div className="absolute bottom-5 left-[70%] w-4 h-4 bg-accent-mint opacity-45" />
                <div className="absolute bottom-5 left-[85%] w-3 h-6 bg-accent-mint opacity-55" />
                {/* Question blocks */}
                <div className="absolute bottom-12 left-[20%] w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: "#FFF1A8", border: "2px solid #C9C3F5" }}>
                    <span className="font-pixel text-[8px]" style={{ color: "#2F5D8C" }}>?</span>
                </div>
                <div className="absolute bottom-12 left-[65%] w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: "#FFF1A8", border: "2px solid #C9C3F5" }}>
                    <span className="font-pixel text-[8px]" style={{ color: "#2F5D8C" }}>?</span>
                </div>
            </div>




            {/* ── Interactive OASIS Logo ── */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <div ref={logoRef} className="flex flex-col items-center text-center">
                    <div className="flex items-center justify-center gap-2 lg:gap-4 w-full">
                        {letters.map((letter, i) => (
                            <span
                                key={i}
                                className="logo-letter font-pixel text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-widest select-none cursor-pointer inline-block transition-all duration-150"
                                style={{
                                    color: hoveredLetter === i ? letterColors[i] : "#2F5D8C",
                                    textShadow: hoveredLetter === i
                                        ? `0 0 20px ${letterColors[i]}, 0 0 40px ${letterColors[i]}60, 4px 4px 0px ${letterColors[i]}40`
                                        : "4px 4px 0px #9FA8FF, 8px 8px 0px rgba(159,168,255,0.2)",
                                    transform: hoveredLetter === i ? "translateY(-12px) scale(1.15)" : "translateY(0) scale(1)",
                                }}
                                onMouseEnter={() => setHoveredLetter(i)}
                                onMouseLeave={() => setHoveredLetter(null)}
                            >
                                {letter}
                            </span>
                        ))}
                    </div>

                    {/* Subtitle */}
                    <p className="font-pixel text-[10px] lg:text-xs mt-6 tracking-wider text-center" style={{ color: "#5F86B5" }}>
                        ESPORTS &amp; GAME DEV CLUB — NMIT
                    </p>

                    {/* Decorative pixel hearts/elements */}
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <span className="inline-block w-2 h-2 bg-accent-pink" style={{ animation: "twinkle 1.5s ease-in-out 0s infinite" }} />
                        <span className="inline-block w-1.5 h-1.5 bg-accent-lavender" />
                        <svg width="14" height="12" viewBox="0 0 14 12" fill="#F6B6C8">
                            <path d="M7 12 L0 5 C-1 2 2 -1 5 1 L7 3 L9 1 C12 -1 15 2 14 5 Z" />
                        </svg>
                        <span className="inline-block w-1.5 h-1.5 bg-accent-lavender" />
                        <span className="inline-block w-2 h-2 bg-accent-pink" style={{ animation: "twinkle 1.5s ease-in-out 0.7s infinite" }} />
                    </div>
                </div>
            </div>

            {/* ── SCROLL TO BEGIN ── separate container, no overlap */}
            <div ref={promptRef} className="absolute bottom-[18%] left-1/2 -translate-x-1/2 opacity-0 z-10">
                <div className="flex flex-col items-center gap-2">
                    <div
                        className="flex items-center justify-center px-12 py-3 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        style={{
                            background: "rgba(159, 168, 255, 0.15)",
                            border: "2px solid rgba(159, 168, 255, 0.4)",
                            backdropFilter: "blur(8px)",
                            boxShadow: "0 0 20px rgba(159, 168, 255, 0.15)",
                        }}
                    >
                        <span className="font-pixel text-[9px] tracking-[0.25em] whitespace-nowrap" style={{ color: "#2F5D8C" }}>
                            SCROLL TO BEGIN
                        </span>
                    </div>
                    {/* Bouncing arrow */}
                    <span
                        className="font-pixel text-base"
                        style={{ color: "#9FA8FF", animation: "bob 0.8s ease-in-out infinite alternate" }}
                    >
                        ▼
                    </span>
                </div>
            </div>

            {/* ── Corner Decorations ── */}
            <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
                <span className="w-3 h-3 bg-accent-pink rounded-sm" />
                <span className="w-2 h-2 bg-accent-lavender rounded-sm" />
                <span className="w-1.5 h-1.5 bg-accent-purple rounded-sm" />
            </div>
            <div className="absolute top-6 right-6 flex items-center gap-1.5 z-10">
                {/* Pixel hearts like a game HUD */}
                {[0, 1, 2].map((i) => (
                    <svg key={i} width="16" height="14" viewBox="0 0 14 12" fill="#F6B6C8">
                        <path d="M7 12 L0 5 C-1 2 2 -1 5 1 L7 3 L9 1 C12 -1 15 2 14 5 Z" />
                    </svg>
                ))}
            </div>

            {/* Bottom HUD bar */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10 opacity-60">
                <div className="flex items-center gap-1.5">
                    <span className="font-pixel text-[7px]" style={{ color: "#5F86B5" }}>SCORE</span>
                    <span className="font-pixel text-[8px]" style={{ color: "#2F5D8C" }}>000000</span>
                </div>
                <div className="w-px h-3 bg-border-card" />
                <div className="flex items-center gap-1.5">
                    <span className="font-pixel text-[7px]" style={{ color: "#5F86B5" }}>WORLD</span>
                    <span className="font-pixel text-[8px]" style={{ color: "#2F5D8C" }}>1-1</span>
                </div>
                <div className="w-px h-3 bg-border-card" />
                <div className="flex items-center gap-1.5">
                    <span className="font-pixel text-[7px]" style={{ color: "#5F86B5" }}>TIME</span>
                    <span className="font-pixel text-[8px]" style={{ color: "#2F5D8C" }}>∞</span>
                </div>
            </div>
        </section>
    );
}
