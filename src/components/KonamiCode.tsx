"use client";
import { useEffect, useState, useCallback, useRef } from "react";

const KONAMI = [
    "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
    "b", "a",
];

interface Confetti {
    x: number;
    y: number;
    size: number;
    color: string;
    vx: number;
    vy: number;
    rot: number;
    rotSpeed: number;
}

const COLORS = ["#FF6B6B", "#FFA94D", "#FFD93D", "#69DB7C", "#74C0FC", "#9FA8FF", "#CC5DE8", "#F6B6C8"];

export default function KonamiCode() {
    const [activated, setActivated] = useState(false);
    const [show, setShow] = useState(false);
    const progress = useRef<number>(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleKey = useCallback((e: KeyboardEvent) => {
        if (activated) return;
        if (e.key === KONAMI[progress.current]) {
            progress.current++;
            if (progress.current === KONAMI.length) {
                setActivated(true);
                setShow(true);
                progress.current = 0;
            }
        } else {
            progress.current = 0;
        }
    }, [activated]);

    useEffect(() => {
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [handleKey]);

    // Confetti explosion + message
    useEffect(() => {
        if (!show) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const confetti: Confetti[] = [];
        for (let i = 0; i < 200; i++) {
            confetti.push({
                x: canvas.width / 2 + (Math.random() - 0.5) * 200,
                y: canvas.height / 2,
                size: Math.random() * 8 + 4,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.8) * 18 - 5,
                rot: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 15,
            });
        }

        let frame = 0;
        const maxFrames = 240; // ~4 seconds at 60fps

        const animate = () => {
            frame++;
            if (frame > maxFrames) {
                setShow(false);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Flash overlay on first few frames
            if (frame < 10) {
                ctx.fillStyle = `rgba(255, 255, 255, ${0.6 - frame * 0.06})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            confetti.forEach((c) => {
                c.x += c.vx;
                c.y += c.vy;
                c.vy += 0.35; // gravity
                c.vx *= 0.99; // air resistance
                c.rot += c.rotSpeed;

                const alpha = Math.max(0, 1 - frame / maxFrames);
                ctx.save();
                ctx.translate(c.x, c.y);
                ctx.rotate((c.rot * Math.PI) / 180);
                ctx.globalAlpha = alpha;
                ctx.fillStyle = c.color;
                ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
                ctx.restore();
            });

            // Center message
            if (frame < 180) {
                const msgAlpha = frame < 20 ? frame / 20 : frame > 150 ? (180 - frame) / 30 : 1;
                ctx.globalAlpha = msgAlpha;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                // Glow
                ctx.shadowColor = "#9FA8FF";
                ctx.shadowBlur = 30;

                ctx.font = "bold 48px monospace";
                ctx.fillStyle = "#FFD93D";
                ctx.fillText("🎮 ACHIEVEMENT UNLOCKED! 🎮", canvas.width / 2, canvas.height / 2 - 30);

                ctx.font = "24px monospace";
                ctx.fillStyle = "#FFFFFF";
                ctx.fillText("You found the secret Konami Code!", canvas.width / 2, canvas.height / 2 + 25);

                ctx.font = "16px monospace";
                ctx.fillStyle = "#9FA8FF";
                ctx.fillText("↑ ↑ ↓ ↓ ← → ← → B A", canvas.width / 2, canvas.height / 2 + 60);

                ctx.shadowBlur = 0;
            }

            ctx.globalAlpha = 1;
            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }, [show]);

    if (!show) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 99999 }}
        />
    );
}
