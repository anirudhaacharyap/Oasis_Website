"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";

interface DraggableCharacterProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    initialX: number;
    initialYPercent: number; // percentage of viewport height
    side: "left" | "right";
}

export default function DraggableCharacter({
    src,
    alt,
    width = 80,
    height = 100,
    initialX,
    initialYPercent,
    side,
}: DraggableCharacterProps) {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [mounted, setMounted] = useState(false);
    const offset = useRef({ x: 0, y: 0 });
    const elRef = useRef<HTMLDivElement>(null);

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        e.preventDefault();
        setDragging(true);
        const rect = elRef.current?.getBoundingClientRect();
        if (rect) {
            offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        }
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }, []);

    const onPointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (!dragging) return;
            setPos({
                x: e.clientX - offset.current.x,
                y: e.clientY - offset.current.y,
            });
        },
        [dragging]
    );

    const onPointerUp = useCallback(() => {
        setDragging(false);
    }, []);

    useEffect(() => {
        const x = side === "right" ? window.innerWidth - initialX - width : initialX;
        setPos({ x, y: window.innerHeight * (initialYPercent / 100) });
        setMounted(true);
    }, [initialX, initialYPercent, side, width]);

    if (!mounted) return null;

    return (
        <div
            ref={elRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            className="select-none touch-none"
            style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                zIndex: 30,
                cursor: dragging ? "grabbing" : "grab",
                transition: dragging ? "none" : "filter 0.2s",
                filter: dragging
                    ? "drop-shadow(0 8px 16px rgba(0,0,0,0.25))"
                    : "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
                willChange: "left, top",
            }}
        >
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="pointer-events-none"
                style={{ imageRendering: "pixelated" }}
                draggable={false}
                priority
            />
        </div>
    );
}
