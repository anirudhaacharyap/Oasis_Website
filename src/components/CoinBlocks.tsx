"use client";
import { useState, useCallback, useEffect } from "react";

interface CoinBlockProps {
    x: string;
    y: string;
    fact?: string;
}

function CoinBlock({ x, y, fact }: CoinBlockProps) {
    const [bumped, setBumped] = useState(false);
    const [coins, setCoins] = useState<number[]>([]);
    const [revealed, setRevealed] = useState(false);

    const handleClick = useCallback(() => {
        if (bumped) return;
        setBumped(true);
        setCoins((prev) => [...prev, Date.now()]);

        // Dispatch custom event to update global score
        window.dispatchEvent(new CustomEvent("coin-collected"));

        // Reveal fact
        if (fact) {
            setRevealed(true);
            setTimeout(() => setRevealed(false), 3000);
        }

        setTimeout(() => setBumped(false), 400);
    }, [bumped, fact]);

    return (
        <div className="absolute" style={{ left: x, top: y, zIndex: 60 }}>
            {/* Flying coin */}
            {coins.map((id) => (
                <div
                    key={id}
                    className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                    style={{
                        animation: "coin-fly 0.6s ease-out forwards",
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
                        <rect x="4" y="0" width="8" height="16" rx="1" fill="#FFD93D" />
                        <rect x="6" y="2" width="4" height="12" fill="#FFEC70" />
                        <rect x="7" y="4" width="2" height="8" fill="#FFD93D" />
                    </svg>
                </div>
            ))}

            {/* ? Block */}
            <div
                onClick={handleClick}
                className="w-10 h-10 flex items-center justify-center cursor-pointer select-none transition-transform"
                style={{
                    background: bumped ? "#B8860B" : "#FFD93D",
                    border: "3px solid #B8860B",
                    borderRadius: "3px",
                    boxShadow: bumped
                        ? "inset 2px 2px 0 #8B6914"
                        : "inset -2px -2px 0 #B8860B, inset 2px 2px 0 #FFEC70",
                    transform: bumped ? "translateY(-8px)" : "translateY(0)",
                    transition: "transform 0.15s ease-out, background 0.15s",
                    imageRendering: "pixelated",
                }}
            >
                <span
                    className="font-pixel text-sm font-bold"
                    style={{ color: bumped ? "#8B6914" : "#B8860B", textShadow: bumped ? "none" : "1px 1px 0 #FFEC70" }}
                >
                    ?
                </span>
            </div>

            {/* Fun fact tooltip */}
            {revealed && fact && (
                <div
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 rounded-lg whitespace-nowrap text-xs font-pixel"
                    style={{
                        background: "rgba(47, 93, 140, 0.9)",
                        color: "#fff",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(159, 168, 255, 0.4)",
                        animation: "fade-in-up 0.3s ease-out",
                        zIndex: 20,
                    }}
                >
                    {fact}
                </div>
            )}
        </div>
    );
}

/* ── Score HUD ── shows total coins collected */
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
            className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full font-pixel text-sm z-50"
            style={{
                background: "rgba(47, 93, 140, 0.85)",
                color: "#FFD93D",
                border: "2px solid #FFD93D40",
                backdropFilter: "blur(8px)",
                boxShadow: "0 0 20px rgba(255, 217, 61, 0.15)",
            }}
        >
            <svg width="14" height="14" viewBox="0 0 16 16" style={{ imageRendering: "pixelated" }}>
                <rect x="4" y="0" width="8" height="16" rx="1" fill="#FFD93D" />
                <rect x="6" y="2" width="4" height="12" fill="#FFEC70" />
            </svg>
            × {score}
        </div>
    );
}

export default function CoinBlocks() {
    const blocks = [
        { x: "12%", y: "25%", fact: "OASIS was founded in 2019!" },
        { x: "85%", y: "20%", fact: "We host 10+ events yearly!" },
        { x: "25%", y: "75%", fact: "50+ active members!" },
        { x: "75%", y: "60%", fact: "Game jams every semester!" },
    ];

    return (
        <>
            <ScoreHUD />
            {blocks.map((b, i) => (
                <CoinBlock key={i} x={b.x} y={b.y} fact={b.fact} />
            ))}
        </>
    );
}
