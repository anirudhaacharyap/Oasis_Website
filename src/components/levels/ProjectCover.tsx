import { useId } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import type { Project } from "@/data/types";

/** Print palette: ink, cream and red, foreground always the contrasting ink of the three. */
const INK = "#1E181E";
const CREAM = "#F2EADB";
const CREAM_2 = "#E3D6C3";
const RED = "#AD0013";
const TONES = {
    gold: { bg: INK, fg: RED },
    bone: { bg: CREAM, fg: INK },
    deep: { bg: RED, fg: CREAM },
} as const;

/** Area the pattern fills, inside the cartridge shell. */
const AX = 24;
const AY = 44;
const AW = 352;
const AH = 348;

const CART_PATH = "M0 0H140L154 20H246L260 0H400V500H0Z";

function hash(text: string) {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) {
        h ^= text.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function rng(seed: number) {
    let a = seed;
    return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const n1 = (v: number) => Number(v.toFixed(1));

function Pattern({ kind, fg, rand }: { kind: Project["cover"]["pattern"]; fg: string; rand: () => number }) {
    switch (kind) {
        case "stripes": {
            const step = 46 + rand() * 18;
            const tilt = rand() < 0.5 ? -28 : 28;
            const count = Math.ceil(700 / step);
            return (
                <g transform={`rotate(${tilt} 200 218)`} fill={fg}>
                    {Array.from({ length: count }, (_, i) => (
                        <rect key={i} x={n1(-120 + i * step)} y={-120} width={n1(step * (0.32 + rand() * 0.28))} height={700} />
                    ))}
                </g>
            );
        }
        case "grid": {
            const cols = 7;
            const rows = 7;
            const cw = AW / cols;
            const ch = AH / rows;
            const filled = new Set<number>();
            while (filled.size < 9) filled.add(Math.floor(rand() * cols * rows));
            return (
                <g stroke={fg} strokeWidth={3}>
                    {Array.from({ length: cols * rows }, (_, i) => {
                        const x = AX + (i % cols) * cw;
                        const y = AY + Math.floor(i / cols) * ch;
                        return (
                            <rect
                                key={i}
                                x={n1(x + 1.5)}
                                y={n1(y + 1.5)}
                                width={n1(cw - 3)}
                                height={n1(ch - 3)}
                                fill={filled.has(i) ? fg : "none"}
                            />
                        );
                    })}
                </g>
            );
        }
        case "rings": {
            const cx = 200 + (rand() - 0.5) * 90;
            const cy = 218 + (rand() - 0.5) * 70;
            const step = 22 + rand() * 6;
            return (
                <g fill="none" stroke={fg}>
                    {Array.from({ length: 11 }, (_, i) => (
                        <circle key={i} cx={n1(cx)} cy={n1(cy)} r={n1(16 + i * step)} strokeWidth={i % 2 ? 4 : 11} />
                    ))}
                </g>
            );
        }
        case "steps": {
            const n = 6;
            const gap = 6;
            const b = (AW - gap * (n - 1)) / n;
            const flip = rand() < 0.5;
            const blocks: ReactNode[] = [];
            for (let row = 0; row < n; row++) {
                for (let j = 0; j <= row; j++) {
                    const col = flip ? n - 1 - j : j;
                    const x = AX + col * (b + gap);
                    const y = AY + AH - (row + 1) * b - row * gap;
                    const hollow = rand() < 0.22;
                    const inset = hollow ? 2 : 0;
                    blocks.push(
                        <rect
                            key={`${row}-${j}`}
                            x={n1(x + inset)}
                            y={n1(y + inset)}
                            width={n1(b - inset * 2)}
                            height={n1(b - inset * 2)}
                            fill={hollow ? "none" : fg}
                            stroke={fg}
                            strokeWidth={4}
                        />,
                    );
                }
            }
            return <g>{blocks}</g>;
        }
        case "dots": {
            const cols = 10;
            const rows = 10;
            const angle = rand() * Math.PI * 2;
            const dx = Math.cos(angle);
            const dy = Math.sin(angle);
            const sx = AW / cols;
            const sy = AH / rows;
            return (
                <g fill={fg}>
                    {Array.from({ length: cols * rows }, (_, i) => {
                        const c = i % cols;
                        const r = Math.floor(i / cols);
                        const t = ((c / (cols - 1) - 0.5) * dx + (r / (rows - 1) - 0.5) * dy) * 0.9 + 0.5;
                        const rad = 2 + Math.max(0, Math.min(1, t)) * 15;
                        return <circle key={i} cx={n1(AX + sx * (c + 0.5))} cy={n1(AY + sy * (r + 0.5))} r={n1(rad)} />;
                    })}
                </g>
            );
        }
        case "wave": {
            const phase = rand() * Math.PI * 2;
            const freq = 1.6 + rand() * 1.4;
            return (
                <g fill="none" stroke={fg} strokeWidth={7} strokeLinecap="round">
                    {Array.from({ length: 10 }, (_, i) => {
                        const base = AY + 22 + i * 34;
                        const amp = 8 + i * 1.6;
                        let d = "";
                        for (let x = AX - 8; x <= AX + AW + 8; x += 8) {
                            const y = base + Math.sin(((x - AX) / AW) * Math.PI * 2 * freq + phase + i * 0.55) * amp;
                            d += `${d ? "L" : "M"}${x} ${n1(y)}`;
                        }
                        return <path key={i} d={d} />;
                    })}
                </g>
            );
        }
    }
}

/** Generative cartridge label. Deterministic per slug. Decorative: always aria-hidden. */
export default function ProjectCover({
    project,
    sizes = "22vw",
    priority = false,
}: {
    project: Project;
    sizes?: string;
    priority?: boolean;
}) {
    const uid = `cv${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

    if (project.image) {
        return (
            <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 5", overflow: "hidden" }}>
                <Image src={project.image} alt="" fill sizes={sizes} priority={priority} style={{ objectFit: "cover" }} />
            </div>
        );
    }

    const { bg, fg } = TONES[project.cover.tone];
    const size = Math.max(15, Math.min(26, 304 / (project.title.length * 0.82)));

    return (
        <svg viewBox="0 0 400 500" width="100%" aria-hidden="true" focusable="false" style={{ display: "block", height: "auto" }}>
            <defs>
                <clipPath id={uid}>
                    <rect x={AX} y={AY} width={AW} height={AH} />
                </clipPath>
                {/* Halftone screen: a 45 degree dot grid used as a mask over the pattern shapes. */}
                <pattern id={`${uid}d`} width={6} height={6} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <circle cx={3} cy={3} r={2.3} fill="#fff" />
                </pattern>
                <mask id={`${uid}m`} maskUnits="userSpaceOnUse" x={AX} y={AY} width={AW} height={AH}>
                    <rect x={AX} y={AY} width={AW} height={AH} fill={`url(#${uid}d)`} />
                </mask>
                {/* Solid ink builds up along one corner and breaks into dots across the rest. */}
                <linearGradient id={`${uid}g`} x1="0" y1="1" x2="0.75" y2="0.1">
                    <stop offset="0" stopColor="#fff" />
                    <stop offset="0.55" stopColor="#fff" stopOpacity={0} />
                </linearGradient>
                <mask id={`${uid}s`} maskUnits="userSpaceOnUse" x={AX} y={AY} width={AW} height={AH}>
                    <rect x={AX} y={AY} width={AW} height={AH} fill={`url(#${uid}g)`} />
                </mask>
            </defs>
            <path d={CART_PATH} fill={bg} />
            <rect x={14} y={34} width={372} height={460} fill="none" stroke={fg} strokeOpacity={0.35} strokeWidth={2} />
            <g clipPath={`url(#${uid})`}>
                <g mask={`url(#${uid}m)`}>
                    <Pattern kind={project.cover.pattern} fg={fg} rand={rng(hash(project.slug))} />
                </g>
                <g mask={`url(#${uid}s)`}>
                    <Pattern kind={project.cover.pattern} fg={fg} rand={rng(hash(project.slug))} />
                </g>
            </g>
            <rect x={AX} y={408} width={AW} height={68} fill={INK} stroke={CREAM} strokeOpacity={0.45} strokeWidth={1.5} />
            <text
                x={40}
                y={439}
                fill={CREAM}
                fontSize={n1(size)}
                style={{ fontFamily: "var(--font-archivo), sans-serif", fontWeight: 900, fontVariationSettings: '"wdth" 112', letterSpacing: "-0.03em" }}
            >
                {project.title}
            </text>
            <text
                x={40}
                y={462}
                fill={CREAM_2}
                fontSize={13}
                style={{ fontFamily: "var(--font-archivo), sans-serif", fontWeight: 700, fontVariationSettings: '"wdth" 72', letterSpacing: "0.06em" }}
            >
                {`${project.kind.toUpperCase()}  ${project.year}`}
            </text>
        </svg>
    );
}
