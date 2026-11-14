/**
 * Shared language between the 3D controller, the static fallback and the DOM controls.
 * Every way of playing the hero (click a 3D button, a DOM button, the keyboard) emits a PadInput.
 */
export type FaceButton = "A" | "B" | "X" | "Y";
export type PadInput = "left" | "right" | "up" | "down" | FaceButton | "start";

/** A press to replay on the controller, so DOM and keyboard input also animate the 3D pad. */
export interface Pulse {
    key: PadInput;
    id: number;
}

/** Controller layout in scene units (front face, x right, y up). Used by the 3D model and the SVG. */
export const LAYOUT = {
    dpad: [-1.25, 0.22] as const,
    face: {
        Y: [1.25, 0.57] as const,
        A: [1.25, -0.13] as const,
        X: [0.9, 0.22] as const,
        B: [1.6, 0.22] as const,
    },
    sticks: [
        [-0.55, -0.4],
        [0.55, -0.4],
    ] as const,
    star: [0, 0.5] as const,
};

/** The controller body outline, shared by THREE.Shape and the SVG path (y up). */
export function traceBody(p: {
    moveTo(x: number, y: number): void;
    quadraticCurveTo(cx: number, cy: number, x: number, y: number): void;
    bezierCurveTo(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number): void;
}) {
    p.moveTo(0, 0.95);
    p.quadraticCurveTo(0.9, 1.05, 1.4, 0.98);
    p.bezierCurveTo(1.9, 0.92, 2.1, 0.5, 2.05, 0.05);
    p.bezierCurveTo(2.02, -0.5, 1.9, -1.05, 1.6, -1.22);
    p.bezierCurveTo(1.35, -1.36, 1.05, -1.22, 0.95, -0.98);
    p.bezierCurveTo(0.82, -0.66, 0.6, -0.5, 0, -0.5);
    p.bezierCurveTo(-0.6, -0.5, -0.82, -0.66, -0.95, -0.98);
    p.bezierCurveTo(-1.05, -1.22, -1.35, -1.36, -1.6, -1.22);
    p.bezierCurveTo(-1.9, -1.05, -2.02, -0.5, -2.05, 0.05);
    p.bezierCurveTo(-2.1, 0.5, -1.9, 0.92, -1.4, 0.98);
    p.quadraticCurveTo(-0.9, 1.05, 0, 0.95);
}

/** Five-point star, the logo's shooting star. Outer radius r, inner radius r * 0.45. */
export function starPoints(r: number) {
    const pts: [number, number][] = [];
    for (let i = 0; i < 10; i++) {
        const radius = i % 2 === 0 ? r : r * 0.45;
        const a = Math.PI / 2 + (i * Math.PI) / 5;
        pts.push([Math.cos(a) * radius, Math.sin(a) * radius]);
    }
    return pts;
}
