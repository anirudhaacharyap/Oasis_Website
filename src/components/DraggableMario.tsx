"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";

export default function DraggableMario() {
    const [pos, setPos] = useState({ x: 60, y: 300 });
    const [dragging, setDragging] = useState(false);
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

    // Set initial position relative to viewport on mount
    useEffect(() => {
        setPos({ x: 60, y: window.innerHeight * 0.35 });
    }, []);

    return (
        <div
            ref={elRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            className="select-none touch-none"
            style={{
                position: "fixed",
                left: pos.x,
                top: pos.y,
                zIndex: 50,
                cursor: dragging ? "grabbing" : "grab",
                transition: dragging ? "none" : "filter 0.2s",
                filter: dragging ? "drop-shadow(0 8px 16px rgba(0,0,0,0.25))" : "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
                willChange: "left, top",
            }}
        >
            <Image
                src="/assets/mario.svg"
                alt="Draggable Mario"
                width={80}
                height={120}
                className="pointer-events-none"
                style={{ imageRendering: "pixelated" }}
                draggable={false}
                priority
            />
        </div>
    );
}
