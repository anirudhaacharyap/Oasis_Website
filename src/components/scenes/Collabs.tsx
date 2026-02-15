"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const partners = [
    { name: "Unity", color: "#9FA8FF" },
    { name: "Unreal Engine", color: "#C9C3F5" },
    { name: "Steam", color: "#F6B6C8" },
    { name: "Riot Games", color: "#9EE6CF" },
    { name: "Discord", color: "#9FA8FF" },
    { name: "AMD", color: "#FFF1A8" },
    { name: "Intel", color: "#C9C3F5" },
    { name: "NVIDIA", color: "#9EE6CF" },
];

export default function Collabs() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const logosRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 70%",
                end: "bottom 30%",
                scrub: 0.3,
            },
        });

        tl.fromTo(
            titleRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.2 },
            0
        );

        logosRef.current.forEach((logo, i) => {
            if (!logo) return;
            tl.fromTo(
                logo,
                { y: 50, opacity: 0, scale: 0.9 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.15,
                    ease: "power2.out",
                },
                0.1 + i * 0.06
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
            style={{ background: "linear-gradient(180deg, #EAF6FF 0%, #F9FCFF 100%)" }}
        >
            <div className="container mx-auto px-8 lg:px-16 relative z-10">
                <h2
                    ref={titleRef}
                    className="font-pixel text-3xl lg:text-4xl text-center mb-4 opacity-0"
                    style={{ color: "#2F5D8C" }}
                >
                    COLLABORATIONS
                </h2>
                <p
                    className="text-center text-lg mb-16 max-w-xl mx-auto"
                    style={{ color: "#5F86B5" }}
                >
                    Partnered with industry leaders to bring you the best experiences.
                </p>

                {/* Logo Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                    {partners.map((partner, i) => (
                        <div
                            key={partner.name}
                            ref={(el) => { logosRef.current[i] = el; }}
                            className="group flex flex-col items-center justify-center p-8 rounded-xl opacity-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
                            style={{
                                background: "#F9FCFF",
                                border: `2px solid ${partner.color}50`,
                            }}
                        >
                            {/* Placeholder logo block */}
                            <div
                                className="w-16 h-16 rounded-lg flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110"
                                style={{ background: `${partner.color}30`, border: `2px solid ${partner.color}60` }}
                            >
                                <span className="font-pixel text-xs font-bold" style={{ color: "#2F5D8C" }}>
                                    {partner.name.slice(0, 2).toUpperCase()}
                                </span>
                            </div>
                            <span className="text-sm font-medium text-center" style={{ color: "#2F5D8C" }}>
                                {partner.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
