"use client";

import type { CSSProperties } from "react";
import DraggableCharacter from "@/components/DraggableCharacter";
import CoinBlocks from "@/components/CoinBlocks";
import { site } from "@/data/site";

const LETTERS = ["O", "A", "S", "I", "S"] as const;
const LETTER_COLORS = ["#9FA8FF", "#F6B6C8", "#9EE6CF", "#C9C3F5", "#FFF1A8"];

export default function StartScreen() {
    return (
        <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-sky">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <svg className="absolute top-20 left-[4%] w-40 opacity-80 md:w-52" viewBox="0 0 200 80">
                    <ellipse cx="70" cy="50" rx="70" ry="28" fill="white" />
                    <ellipse cx="120" cy="42" rx="48" ry="22" fill="white" />
                </svg>
                <svg className="absolute top-28 right-[6%] w-48 opacity-70 md:w-64" viewBox="0 0 200 80">
                    <ellipse cx="80" cy="50" rx="78" ry="28" fill="white" />
                    <ellipse cx="140" cy="40" rx="46" ry="20" fill="white" />
                </svg>
            </div>

            <CoinBlocks />

            <div className="hidden md:contents">
                <DraggableCharacter src="/assets/slime.svg" alt="" width={112} height={91} inset={28} topPercent={68} side="left" />
                <DraggableCharacter
                    src="/assets/gamepad-buddy.svg"
                    alt=""
                    width={128}
                    height={80}
                    inset={36}
                    topPercent={72}
                    side="right"
                />
                <DraggableCharacter src="/assets/robot.svg" alt="" width={84} height={84} inset={48} topPercent={18} side="left" />
                <DraggableCharacter src="/assets/wizard.svg" alt="" width={84} height={84} inset={56} topPercent={20} side="right" />
            </div>

            <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4">
                <h1 className="flex items-center justify-center gap-1 sm:gap-2 lg:gap-4">
                    {LETTERS.map((letter, i) => (
                        <span
                            key={`${letter}-${i}`}
                            tabIndex={0}
                            className="logo-letter inline-block cursor-pointer font-pixel text-5xl select-none sm:text-7xl md:text-8xl lg:text-9xl"
                            style={{ "--letter": LETTER_COLORS[i] } as CSSProperties}
                        >
                            {letter}
                        </span>
                    ))}
                </h1>
                <p className="mt-6 text-center font-pixel text-[10px] tracking-wider text-ink-soft lg:text-xs">
                    {site.tagline.toUpperCase()} — {site.college}
                </p>
            </div>

            <a href="#about" className="relative z-10 mb-8 text-center font-pixel text-[9px] tracking-[0.25em] text-ink">
                SCROLL TO BEGIN
            </a>
            <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-2"
                style={{ background: "linear-gradient(90deg, #F6B6C8, #C9C3F5, #9FA8FF, #9EE6CF, #FFF1A8)" }}
            />
        </section>
    );
}
