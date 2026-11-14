import { LAYOUT, starPoints, traceBody, type FaceButton } from "./pad";

/**
 * Static drawing of the same controller. Shown before the 3D scene loads, under reduced
 * motion, and when WebGL is unavailable. Decorative: the DOM controls carry the function.
 */

// Scene units → SVG units: x' = 210 + x * 100, y' = 125 - y * 100.
const X = (x: number) => 210 + x * 100;
const Y = (y: number) => 125 - y * 100;

function bodyPath() {
    let d = "";
    traceBody({
        moveTo: (x, y) => (d += `M${X(x)} ${Y(y)}`),
        quadraticCurveTo: (cx, cy, x, y) => (d += `Q${X(cx)} ${Y(cy)} ${X(x)} ${Y(y)}`),
        bezierCurveTo: (a, b, c, e, x, y) => (d += `C${X(a)} ${Y(b)} ${X(c)} ${Y(e)} ${X(x)} ${Y(y)}`),
    });
    return `${d}Z`;
}

const BODY = bodyPath();
const STAR = starPoints(17)
    .map(([x, y]) => `${X(LAYOUT.star[0]) + x},${Y(LAYOUT.star[1]) - y}`)
    .join(" ");

export default function ControllerSVG({ active, className }: { active: FaceButton; className?: string }) {
    const [dx, dy] = [X(LAYOUT.dpad[0]), Y(LAYOUT.dpad[1])];
    return (
        <svg viewBox="-10 -10 440 290" className={className} aria-hidden="true" focusable="false">
            <defs>
                <linearGradient id="pad-body" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#A6202A" />
                    <stop offset="1" stopColor="#6E0D12" />
                </linearGradient>
            </defs>
            <rect x="72" y="0" width="96" height="30" rx="14" fill="#5A0A0F" transform="rotate(-5 120 15)" />
            <rect x="252" y="0" width="96" height="30" rx="14" fill="#5A0A0F" transform="rotate(5 300 15)" />
            <path d={BODY} fill="url(#pad-body)" stroke="#5A0A0F" strokeWidth="3" />
            <circle cx={X(0)} cy={Y(0.06)} r="48" fill="none" stroke="#C8A15A" strokeWidth="2" />
            {/* D-pad */}
            <rect x={dx - 48} y={dy - 16} width="96" height="32" rx="6" fill="#F1E4CF" />
            <rect x={dx - 16} y={dy - 48} width="32" height="96" rx="6" fill="#F1E4CF" />
            {/* Face buttons */}
            {(Object.keys(LAYOUT.face) as FaceButton[]).map((k) => {
                const [x, y] = LAYOUT.face[k];
                return (
                    <g key={k}>
                        <circle cx={X(x)} cy={Y(y)} r="20" fill={k === active ? "#F0CC85" : "#C8A15A"} />
                        <text
                            x={X(x)}
                            y={Y(y) + 7}
                            textAnchor="middle"
                            fontSize="20"
                            fontWeight="800"
                            fill="#4A070B"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            {k}
                        </text>
                    </g>
                );
            })}
            {/* Sticks */}
            {LAYOUT.sticks.map(([x, y], i) => (
                <g key={i}>
                    <circle cx={X(x)} cy={Y(y)} r="38" fill="#2A0608" />
                    <circle cx={X(x)} cy={Y(y)} r="28" fill="#F1E4CF" />
                    <circle cx={X(x)} cy={Y(y)} r="18" fill="none" stroke="#D9C8AC" strokeWidth="4" />
                </g>
            ))}
            <polygon points={STAR} fill="#C8A15A" />
        </svg>
    );
}
