"use client";

import { useEffect, useRef, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

function createConfettiPiece(container: HTMLDivElement) {
    const colors = ["#F6B6C8", "#C9C3F5", "#9FA8FF", "#9EE6CF", "#FFF1A8", "#D9EEFB"];
    const el = document.createElement("div");
    const size = Math.random() * 8 + 4;
    el.style.position = "absolute";
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    el.style.left = `${Math.random() * 100}%`;
    el.style.top = `${Math.random() * 100}%`;
    el.style.opacity = "0";
    container.appendChild(el);
    return el;
}

export default function Victory() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLAnchorElement>(null);
    const confettiRef = useRef<HTMLDivElement>(null);
    const confettiCreated = useRef(false);

    const initConfetti = useCallback(() => {
        if (!confettiRef.current || confettiCreated.current) return;
        confettiCreated.current = true;
        const pieces: HTMLDivElement[] = [];
        for (let i = 0; i < 60; i++) {
            pieces.push(createConfettiPiece(confettiRef.current) as unknown as HTMLDivElement);
        }

        // Animate confetti
        pieces.forEach((piece) => {
            gsap.to(piece, {
                opacity: 1,
                y: -200 - Math.random() * 300,
                x: (Math.random() - 0.5) * 400,
                rotation: Math.random() * 720,
                scale: Math.random() * 1.5 + 0.5,
                duration: 2 + Math.random() * 2,
                ease: "power2.out",
                delay: Math.random() * 0.5,
            });
            gsap.to(piece, {
                opacity: 0,
                duration: 1,
                delay: 2 + Math.random(),
            });
        });
    }, []);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        // CTA pulse
        if (ctaRef.current) {
            gsap.to(ctaRef.current, {
                boxShadow: "0 0 30px rgba(246,182,200,0.6), 0 0 60px rgba(246,182,200,0.3)",
                duration: 1.2,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut",
            });
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 60%",
                end: "bottom bottom",
                scrub: 1,
                onEnter: () => initConfetti(),
            },
        });

        tl.fromTo(
            titleRef.current,
            { y: 80, opacity: 0, scale: 0.8 },
            { y: 0, opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.5)" },
            0
        );

        tl.fromTo(
            subtitleRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.2 },
            0.15
        );

        tl.fromTo(
            ctaRef.current,
            { y: 30, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 0.2, ease: "back.out(1.7)" },
            0.25
        );

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, [initConfetti]);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-20"
            style={{
                background: "linear-gradient(180deg, #F9FCFF 0%, #FFFFFF 40%, #FFFFFF 100%)",
            }}
        >
            {/* Confetti container */}
            <div
                ref={confettiRef}
                className="absolute inset-0 pointer-events-none overflow-hidden z-0"
            />

            <div className="relative z-10 text-center max-w-3xl mx-auto px-8">
                {/* Victory label */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                    style={{ background: "#FFF1A830", border: "2px solid #FFF1A8" }}
                >
                    <span className="font-pixel text-[10px]" style={{ color: "#2F5D8C" }}>
                        🎉 LEVEL COMPLETE
                    </span>
                </div>

                <h2
                    ref={titleRef}
                    className="font-pixel text-4xl lg:text-6xl mb-6 opacity-0"
                    style={{
                        color: "#2F5D8C",
                        textShadow: "3px 3px 0px #9FA8FF40",
                    }}
                >
                    JOIN OASIS
                </h2>

                <p
                    ref={subtitleRef}
                    className="text-xl lg:text-2xl mb-12 leading-relaxed opacity-0"
                    style={{ color: "#5F86B5" }}
                >
                    Ready to level up? Join the most exciting gaming community at NMIT. Your adventure starts now.
                </p>

                <a
                    ref={ctaRef}
                    href="#"
                    className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-pixel text-sm transition-all duration-300 hover:scale-105 opacity-0"
                    style={{
                        background: "linear-gradient(135deg, #F6B6C8, #C9C3F5)",
                        color: "#2F5D8C",
                        border: "3px solid #BFD9F2",
                        boxShadow: "0 0 20px rgba(246,182,200,0.4)",
                    }}
                >
                    <span>🎮</span>
                    <span>START PLAYING</span>
                </a>

                {/* Bottom pixel decoration */}
                <div className="flex justify-center items-center gap-2 mt-16">
                    <span className="w-2 h-2 bg-accent-pink" />
                    <span className="w-1.5 h-1.5 bg-accent-lavender" />
                    <span className="w-3 h-3 bg-accent-purple" />
                    <span className="w-1.5 h-1.5 bg-accent-lavender" />
                    <span className="w-2 h-2 bg-accent-pink" />
                </div>

                <p className="font-pixel text-[8px] mt-6" style={{ color: "#BFD9F2" }}>
                    © OASIS — NMIT ESPORTS &amp; GAME DEV CLUB
                </p>
            </div>
        </section>
    );
}
