"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const stats = [
    { value: 50, suffix: "+", label: "Events Hosted", icon: "🎯", color: "#9FA8FF" },
    { value: 2000, suffix: "+", label: "Participants", icon: "👥", color: "#F6B6C8" },
    { value: 15, suffix: "+", label: "Game Jams", icon: "🕹️", color: "#9EE6CF" },
    { value: 300, suffix: "+", label: "Active Members", icon: "⚡", color: "#C9C3F5" },
    { value: 5, suffix: "", label: "Championships Won", icon: "🏆", color: "#FFF1A8" },
    { value: 20, suffix: "+", label: "Workshops", icon: "📚", color: "#9FA8FF" },
];

const achievements = [
    "🥇 Regional Esports Champions 2024",
    "🎮 Best Game Dev Club — NMIT",
    "🌟 500+ Discord Members",
    "🚀 Published 10+ Indie Games",
];

export default function Events() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const statsRef = useRef<(HTMLDivElement | null)[]>([]);
    const countersRef = useRef<(HTMLSpanElement | null)[]>([]);
    const barsRef = useRef<(HTMLDivElement | null)[]>([]);
    const achievementsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

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

        // Title
        tl.fromTo(
            titleRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.15 },
            0
        );

        // Stat cards stagger in
        statsRef.current.forEach((stat, i) => {
            if (!stat) return;
            tl.fromTo(
                stat,
                { y: 60, opacity: 0, scale: 0.9 },
                { y: 0, opacity: 1, scale: 1, duration: 0.12 },
                0.1 + i * 0.06
            );
        });

        // Counter animations
        countersRef.current.forEach((counter, i) => {
            if (!counter) return;
            const target = stats[i].value;
            const obj = { val: 0 };
            tl.to(
                obj,
                {
                    val: target,
                    duration: 0.2,
                    ease: "power2.out",
                    onUpdate: () => {
                        if (counter) counter.textContent = Math.round(obj.val).toString();
                    },
                },
                0.15 + i * 0.06
            );
        });

        // Progress bars fill
        barsRef.current.forEach((bar, i) => {
            if (!bar) return;
            tl.fromTo(
                bar,
                { width: "0%" },
                { width: `${Math.min(100, (stats[i].value / 2000) * 100 + 30)}%`, duration: 0.2 },
                0.2 + i * 0.06
            );
        });

        // Achievement badges unlock
        achievementsRef.current.forEach((badge, i) => {
            if (!badge) return;
            tl.fromTo(
                badge,
                { x: -40, opacity: 0, scale: 0.8 },
                {
                    x: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.1,
                    ease: "back.out(2)",
                },
                0.55 + i * 0.08
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex flex-col justify-center overflow-hidden py-20"
            style={{ background: "linear-gradient(180deg, #D9EEFB 0%, #F9FCFF 50%, #EAF6FF 100%)" }}
        >
            {/* Pixel grid overlay */}
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(#2F5D8C 1px, transparent 1px), linear-gradient(90deg, #2F5D8C 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                }}
            />

            <div className="container mx-auto px-8 lg:px-16 relative z-10">
                <h2
                    ref={titleRef}
                    className="font-pixel text-3xl lg:text-4xl text-center mb-16 opacity-0"
                    style={{ color: "#2F5D8C" }}
                >
                    NUMBERS.
                </h2>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {stats.map((stat, i) => (
                        <div
                            key={stat.label}
                            ref={(el) => { statsRef.current[i] = el; }}
                            className="rounded-xl p-6 text-center opacity-0 shadow-md"
                            style={{
                                background: "#F9FCFF",
                                border: `2px solid ${stat.color}60`,
                            }}
                        >
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <div className="flex items-baseline justify-center gap-1">
                                <span
                                    ref={(el) => { countersRef.current[i] = el; }}
                                    className="font-pixel text-2xl lg:text-3xl"
                                    style={{ color: "#2F5D8C" }}
                                >
                                    0
                                </span>
                                <span className="font-pixel text-lg" style={{ color: stat.color }}>
                                    {stat.suffix}
                                </span>
                            </div>
                            <p className="text-sm mt-2 font-medium" style={{ color: "#5F86B5" }}>
                                {stat.label}
                            </p>
                            {/* Progress bar */}
                            <div
                                className="mt-3 h-1.5 rounded-full overflow-hidden"
                                style={{ background: `${stat.color}20` }}
                            >
                                <div
                                    ref={(el) => { barsRef.current[i] = el; }}
                                    className="h-full rounded-full"
                                    style={{
                                        background: `linear-gradient(90deg, ${stat.color}, ${stat.color}90)`,
                                        width: "0%",
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Achievements */}
                <div className="max-w-2xl mx-auto">
                    <h3
                        className="font-pixel text-lg text-center mb-6"
                        style={{ color: "#2F5D8C" }}
                    >
                        ACHIEVEMENTS UNLOCKED
                    </h3>
                    <div className="space-y-3">
                        {achievements.map((ach, i) => (
                            <div
                                key={i}
                                ref={(el) => { achievementsRef.current[i] = el; }}
                                className="flex items-center gap-3 px-5 py-3 rounded-lg opacity-0 shadow-sm"
                                style={{
                                    background: "#F9FCFF",
                                    border: "2px solid #BFD9F2",
                                }}
                            >
                                <span className="font-pixel text-xs" style={{ color: "#2F5D8C" }}>
                                    {ach}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
