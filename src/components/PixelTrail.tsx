"use client";
import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    size: number;
    life: number;
    maxLife: number;
    color: string;
    vx: number;
    vy: number;
}

const COLORS = ["#FF6B6B", "#FFA94D", "#FFD93D", "#69DB7C", "#74C0FC", "#9FA8FF", "#CC5DE8", "#F6B6C8"];

export default function PixelTrail() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const mouse = useRef({ x: -100, y: -100 });
    const prevMouse = useRef({ x: -100, y: -100 });
    const raf = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const onMove = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("mousemove", onMove);

        const spawnParticles = () => {
            const dx = mouse.current.x - prevMouse.current.x;
            const dy = mouse.current.y - prevMouse.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 3) {
                const count = Math.min(Math.floor(dist / 8), 4);
                for (let i = 0; i < count; i++) {
                    particles.current.push({
                        x: mouse.current.x + (Math.random() - 0.5) * 10,
                        y: mouse.current.y + (Math.random() - 0.5) * 10,
                        size: Math.floor(Math.random() * 3 + 2) * 2, // pixel sizes: 4, 6, 8
                        life: 1,
                        maxLife: 1,
                        color: COLORS[Math.floor(Math.random() * COLORS.length)],
                        vx: (Math.random() - 0.5) * 1.5,
                        vy: (Math.random() - 0.5) * 1.5 - 0.5, // slight upward drift
                    });
                }
            }
            prevMouse.current = { ...mouse.current };
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            spawnParticles();

            // Update and draw particles as pixel squares
            particles.current = particles.current.filter((p) => {
                p.life -= 0.02;
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.02; // gentle gravity

                if (p.life <= 0) return false;

                ctx.globalAlpha = p.life * 0.7;
                ctx.fillStyle = p.color;
                // Snap to pixel grid for retro feel
                const sx = Math.round(p.x / 2) * 2;
                const sy = Math.round(p.y / 2) * 2;
                ctx.fillRect(sx - p.size / 2, sy - p.size / 2, p.size, p.size);

                return true;
            });

            ctx.globalAlpha = 1;
            raf.current = requestAnimationFrame(animate);
        };

        raf.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(raf.current);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 9999 }}
        />
    );
}
