"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

interface DraggableCharacterProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    /** Distance from the left/right edge, in px. */
    inset: number;
    /** Vertical position as a percentage of the section height. */
    topPercent: number;
    side: "left" | "right";
    className?: string;
}

/**
 * A decorative sprite the visitor can drag around.
 * Starts CSS-positioned (works with SSR, no layout effect) and switches to
 * pixel coordinates only once a drag begins.
 */
export default function DraggableCharacter({
    src,
    alt,
    width,
    height,
    inset,
    topPercent,
    side,
    className = "",
}: DraggableCharacterProps) {
    const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
    const [dragging, setDragging] = useState(false);
    const offset = useRef({ x: 0, y: 0 });
    const elRef = useRef<HTMLDivElement>(null);

    const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault();
        const el = elRef.current;
        const parent = el?.offsetParent as HTMLElement | null;
        if (!el || !parent) return;
        const rect = el.getBoundingClientRect();
        const parentRect = parent.getBoundingClientRect();
        offset.current = { x: e.clientX - rect.left + parentRect.left, y: e.clientY - rect.top + parentRect.top };
        setPos({ x: rect.left - parentRect.left, y: rect.top - parentRect.top });
        setDragging(true);
        el.setPointerCapture(e.pointerId);
    }, []);

    const onPointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (!dragging) return;
            setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
        },
        [dragging]
    );

    const onPointerUp = useCallback(() => setDragging(false), []);

    const position: React.CSSProperties = pos
        ? { left: pos.x, top: pos.y }
        : { [side]: inset, top: `${topPercent}%` };

    return (
        <div
            ref={elRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            aria-hidden="true"
            className={`absolute z-30 select-none touch-none ${className}`}
            style={{
                ...position,
                cursor: dragging ? "grabbing" : "grab",
                filter: dragging
                    ? "drop-shadow(0 10px 14px rgba(47,93,140,0.3))"
                    : "drop-shadow(0 3px 4px rgba(47,93,140,0.2))",
                transition: dragging ? "none" : "filter 0.2s",
            }}
        >
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="pointer-events-none pixelated"
                draggable={false}
                unoptimized
            />
        </div>
    );
}
