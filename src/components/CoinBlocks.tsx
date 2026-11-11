"use client";

import { useCallback, useEffect, useState } from "react";
import { blockFacts } from "@/data/site";

/** A clickable power-up block that pops a coin and reveals a short tip. */
function PowerBlock({ x, y, fact, className = "" }: { x: string; y: string; fact: string; className?: string }) {
    const [bumped, setBumped] = useState(false);
    const [coins, setCoins] = useState<number[]>([]);
    const [revealed, setRevealed] = useState(false);

    const handleClick = useCallback(() => {
        if (bumped) return;
        setBumped(true);
        setCoins((prev) => [...prev.slice(-4), Date.now()]);
        window.dispatchEvent(new CustomEvent("coin-collected"));
        setRevealed(true);
        setTimeout(() => setRevealed(false), 3000);
        setTimeout(() => setBumped(false), 400);
    }, [bumped]);

    return (
        <div className={`absolute z-40 ${className}`} style={{ left: x, top: y }}>
            {coins.map((id) => (
                <div
                    key={id}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2"
                    style={{ animation: "coin-fly 0.6s ease-out forwards" }}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" shapeRendering="crispEdges">
                        <rect x="4" y="0" width="8" height="16" fill="#FFF1A8" stroke="#8A6800" strokeWidth="1" />
                        <rect x="7" y="4" width="2" height="8" fill="#8A6800" />
                    </svg>
                </div>
            ))}

            <button
                type="button"
                onClick={handleClick}
                aria-label={`Power-up block: ${fact}`}
                className="flex h-10 w-10 select-none items-center justify-center rounded-[4px] font-pixel text-sm"
                style={{
                    background: bumped ? "#C9C3F5" : "#9FA8FF",
                    border: "3px solid #2F5D8C",
                    color: "#fff",
                    boxShadow: bumped ? "inset 2px 2px 0 #4F5AD0" : "inset -3px -3px 0 #4F5AD0, inset 3px 3px 0 #C9C3F5",
                    transform: bumped ? "translateY(-8px)" : "translateY(0)",
                    transition: "transform 0.15s ease-out, background 0.15s",
                    textShadow: "2px 2px 0 #2F5D8C",
                }}
            >
                +
            </button>

            <div role="status" aria-live="polite">
                {revealed && (
                    <div
                        className="absolute left-1/2 top-full z-20 mt-2 w-max max-w-[min(70vw,16rem)] -translate-x-1/2 whitespace-normal rounded-lg border-2 border-ink bg-white px-3 py-2 text-center font-pixel text-[10px] leading-relaxed text-ink shadow-[3px_3px_0_#2F5D8C]"
                    >
                        {fact}
                    </div>
                )}
            </div>
        </div>
    );
}

/** Coin counter that appears once the first block is hit. */
function ScoreHUD() {
    const [score, setScore] = useState(0);

    useEffect(() => {
        const handler = () => setScore((s) => s + 1);
        window.addEventListener("coin-collected", handler);
        return () => window.removeEventListener("coin-collected", handler);
    }, []);

    if (score === 0) return null;

    return (
        <div
            aria-hidden="true"
            className="absolute left-1/2 top-6 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-2 font-pixel text-xs text-ink"
        >
            <svg width="12" height="12" viewBox="0 0 16 16" shapeRendering="crispEdges">
                <rect x="4" y="0" width="8" height="16" fill="#FFF1A8" stroke="#8A6800" />
            </svg>
            × {score}
        </div>
    );
}

const BLOCKS = [
    { x: "8%", y: "76%", className: "" },
    { x: "84%", y: "70%", className: "" },
    { x: "18%", y: "20%", className: "hidden md:block" },
    { x: "78%", y: "16%", className: "hidden md:block" },
];

export default function CoinBlocks() {
    return (
        <>
            <ScoreHUD />
            {BLOCKS.map((b, i) => (
                <PowerBlock key={i} x={b.x} y={b.y} className={b.className} fact={blockFacts[i % blockFacts.length]} />
            ))}
        </>
    );
}
