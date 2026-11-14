"use client";

/**
 * The OASIS controller: an original game pad modelled procedurally in three.js.
 * It is the hero's remote: the D-pad and face buttons emit PadInput events that drive the
 * "what we do" carousel. It floats, leans toward the pointer, and can be dragged around.
 *
 * One clock: the Canvas uses frameloop="never" and GSAP's ticker calls advance(), so the
 * scene shares the same clock as every other animation and stops while off screen.
 */

import { Canvas, advance, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { LAYOUT, starPoints, traceBody, type FaceButton, type PadInput, type Pulse } from "./pad";

const COLORS = {
    body: "#8E1219",
    trim: "#5A0A0F",
    bone: "#F1E4CF",
    gold: "#C8A15A",
    goldHi: "#F0CC85",
    stick: "#2A0608",
};

const DEPTH = 0.42;
const FRONT = DEPTH / 2 + 0.15; // front face z (extrude depth / 2 + bevel thickness)
const BASE_ROT = { x: -0.32, y: -0.22 }; // resting three-quarter view

export interface ControllerSceneProps {
    pulse: Pulse | null;
    active: FaceButton;
    /** -1 or 1 each time the carousel moves, so the pad snaps toward that direction. */
    nudge: { dir: number; id: number };
    paused: boolean;
    onInput: (key: PadInput) => void;
    onReady: () => void;
}

/* ── Geometry helpers ── */

function useBodyGeometry() {
    return useMemo(() => {
        const shape = new THREE.Shape();
        traceBody(shape);
        const geo = new THREE.ExtrudeGeometry(shape, {
            depth: DEPTH,
            bevelEnabled: true,
            bevelThickness: 0.15,
            bevelSize: 0.13,
            bevelSegments: 8,
            curveSegments: 48,
        });
        geo.translate(0, 0, -DEPTH / 2);
        geo.computeVertexNormals();
        return geo;
    }, []);
}

function useStarGeometry(r: number) {
    return useMemo(() => {
        const pts = starPoints(r);
        const shape = new THREE.Shape();
        pts.forEach(([x, y], i) => (i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)));
        shape.closePath();
        const geo = new THREE.ExtrudeGeometry(shape, {
            depth: 0.04,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelSegments: 3,
        });
        geo.center();
        return geo;
    }, [r]);
}

/** A face-button letter drawn into a canvas texture (no font files fetched at runtime). */
function useLetterTexture(letter: string) {
    return useMemo(() => {
        const size = 128;
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        const family = getComputedStyle(document.documentElement).getPropertyValue("--font-unbounded").trim() || "sans-serif";
        ctx.fillStyle = "#4A070B";
        ctx.font = `800 76px ${family}, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(letter, size / 2, size / 2 + 4);
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        return tex;
    }, [letter]);
}

/* ── Pressable parts ── */

type Register = (key: PadInput, obj: THREE.Object3D | null) => void;

interface PartProps {
    onInput: (key: PadInput) => void;
    register: Register;
}

const cursorFor = (value: string) => () => {
    document.body.style.cursor = value;
};

/** Click only when the pointer did not travel (a drag rotates the pad instead). */
const clickIfStill = (key: PadInput, onInput: (k: PadInput) => void) => (e: ThreeEvent<MouseEvent>) => {
    if (e.delta > 6) return;
    e.stopPropagation();
    onInput(key);
};

function FaceButtonMesh({ letter, active, onInput, register }: PartProps & { letter: FaceButton; active: boolean }) {
    const [x, y] = LAYOUT.face[letter];
    const tex = useLetterTexture(letter);
    const mat = useRef<THREE.MeshPhysicalMaterial>(null);

    useFrame((_, delta) => {
        if (!mat.current) return;
        const target = active ? 0.55 : 0;
        mat.current.emissiveIntensity += (target - mat.current.emissiveIntensity) * Math.min(1, delta * 8);
    });

    return (
        <group
            ref={(g) => register(letter, g)}
            position={[x, y, FRONT + 0.02]}
            onClick={clickIfStill(letter, onInput)}
            onPointerOver={cursorFor("pointer")}
            onPointerOut={cursorFor("grab")}
        >
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.2, 0.21, 0.14, 40]} />
                <meshPhysicalMaterial
                    ref={mat}
                    color={COLORS.gold}
                    metalness={0.55}
                    roughness={0.32}
                    clearcoat={0.6}
                    emissive={COLORS.goldHi}
                    emissiveIntensity={0}
                />
            </mesh>
            <mesh position={[0, 0, 0.072]}>
                <planeGeometry args={[0.3, 0.3]} />
                <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
            </mesh>
        </group>
    );
}

function DPad({ onInput, register }: PartProps) {
    const [x, y] = LAYOUT.dpad;
    const arms: { key: PadInput; pos: [number, number] }[] = [
        { key: "left", pos: [-0.33, 0] },
        { key: "right", pos: [0.33, 0] },
        { key: "up", pos: [0, 0.33] },
        { key: "down", pos: [0, -0.33] },
    ];
    return (
        <group position={[x, y, FRONT + 0.02]} ref={(g) => register("left", g)}>
            {/* register() stores the cross under every arm key; the press tilts it toward the arm. */}
            <group ref={(g) => (["right", "up", "down"] as PadInput[]).forEach((k) => register(k, g))}>
                <RoundedBox args={[0.96, 0.32, 0.14]} radius={0.05} smoothness={4}>
                    <meshPhysicalMaterial color={COLORS.bone} roughness={0.5} clearcoat={0.3} />
                </RoundedBox>
                <RoundedBox args={[0.32, 0.96, 0.14]} radius={0.05} smoothness={4}>
                    <meshPhysicalMaterial color={COLORS.bone} roughness={0.5} clearcoat={0.3} />
                </RoundedBox>
                <mesh position={[0, 0, 0.072]}>
                    <circleGeometry args={[0.07, 24]} />
                    <meshStandardMaterial color="#D9C8AC" roughness={0.6} />
                </mesh>
            </group>
            {/* Invisible hit areas, one per arm. */}
            {arms.map((arm) => (
                <mesh
                    key={arm.key}
                    position={[arm.pos[0], arm.pos[1], 0.05]}
                    onClick={clickIfStill(arm.key, onInput)}
                    onPointerOver={cursorFor("pointer")}
                    onPointerOut={cursorFor("grab")}
                >
                    <boxGeometry args={[0.34, 0.34, 0.2]} />
                    <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
                </mesh>
            ))}
        </group>
    );
}

function Stick({ position }: { position: readonly [number, number] }) {
    const cap = useRef<THREE.Group>(null);
    useFrame((state, delta) => {
        if (!cap.current) return;
        // Sticks lean toward the pointer, a small sign of life.
        const k = Math.min(1, delta * 6);
        cap.current.rotation.x += (-state.pointer.y * 0.35 - cap.current.rotation.x) * k;
        cap.current.rotation.y += (state.pointer.x * 0.35 - cap.current.rotation.y) * k;
    });
    return (
        <group position={[position[0], position[1], FRONT]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.37, 0.39, 0.06, 48]} />
                <meshStandardMaterial color={COLORS.stick} roughness={0.8} />
            </mesh>
            <group ref={cap}>
                <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.27, 0.3, 0.16, 48]} />
                    <meshPhysicalMaterial color={COLORS.bone} roughness={0.55} clearcoat={0.25} />
                </mesh>
                <mesh position={[0, 0, 0.181]}>
                    <ringGeometry args={[0.16, 0.2, 48]} />
                    <meshStandardMaterial color="#D9C8AC" roughness={0.7} />
                </mesh>
            </group>
        </group>
    );
}

function StarButton({ onInput, register }: PartProps) {
    const geo = useStarGeometry(0.17);
    const [x, y] = LAYOUT.star;
    return (
        <group
            ref={(g) => register("start", g)}
            position={[x, y, FRONT + 0.03]}
            onClick={clickIfStill("start", onInput)}
            onPointerOver={cursorFor("pointer")}
            onPointerOut={cursorFor("grab")}
        >
            <mesh geometry={geo}>
                <meshPhysicalMaterial color={COLORS.gold} metalness={0.7} roughness={0.28} clearcoat={0.8} />
            </mesh>
        </group>
    );
}

/* ── The pad ── */

function Pad({ pulse, active, nudge, paused, onInput, onReady }: ControllerSceneProps) {
    const body = useBodyGeometry();
    const viewport = useThree((s) => s.viewport);
    const floatRef = useRef<THREE.Group>(null);
    const spinRef = useRef<THREE.Group>(null);
    const parts = useRef(new Map<PadInput, THREE.Object3D>());
    const rig = useRef({ dragging: false, px: 0, py: 0, rx: 0, ry: 0, vx: 0, vy: 0, kick: 0, idle: 1, leanX: 0, leanY: 0 });
    const pausedRef = useRef(paused);
    const readyOnce = useRef(false);

    useEffect(() => {
        pausedRef.current = paused;
    }, [paused]);

    const register: Register = (key, obj) => {
        if (obj) parts.current.set(key, obj);
    };

    // Replay presses that came from the DOM or the keyboard (and from 3D clicks, for one code path).
    useEffect(() => {
        if (!pulse) return;
        const obj = parts.current.get(pulse.key);
        if (!obj) return;
        if (["left", "right", "up", "down"].includes(pulse.key)) {
            const tilt = 0.22;
            const to =
                pulse.key === "left" ? { y: -tilt } : pulse.key === "right" ? { y: tilt } : pulse.key === "up" ? { x: -tilt } : { x: tilt };
            gsap.fromTo(obj.rotation, { x: 0, y: 0 }, { ...to, duration: 0.09, ease: "power2.in", yoyo: true, repeat: 1 });
        } else {
            const z = obj.position.z;
            gsap.fromTo(obj.position, { z }, { z: z - 0.06, duration: 0.09, ease: "power2.in", yoyo: true, repeat: 1 });
        }
    }, [pulse]);

    // Snap toward the carousel's direction of travel.
    useEffect(() => {
        if (nudge.id === 0) return;
        rig.current.kick = nudge.dir * 0.32;
    }, [nudge]);

    // Drag to rotate, with inertia and a spring back to the resting pose.
    const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
        const r = rig.current;
        r.dragging = true;
        r.px = e.nativeEvent.clientX;
        r.py = e.nativeEvent.clientY;
        document.body.style.cursor = "grabbing";
        const move = (ev: PointerEvent) => {
            const dx = ev.clientX - r.px;
            const dy = ev.clientY - r.py;
            r.px = ev.clientX;
            r.py = ev.clientY;
            r.vy = dx * 0.006;
            r.vx = dy * 0.005;
            r.ry += r.vy;
            r.rx = THREE.MathUtils.clamp(r.rx + r.vx, -0.9, 0.9);
        };
        const up = () => {
            r.dragging = false;
            document.body.style.cursor = "";
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
            window.removeEventListener("pointercancel", up);
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
        window.addEventListener("pointercancel", up);
    };

    useFrame((state, delta) => {
        const r = rig.current;
        const f = Math.min(delta * 60, 3); // frame factor, 1 at 60 fps
        const t = state.clock.elapsedTime;

        if (!readyOnce.current) {
            readyOnce.current = true;
            onReady();
        }

        // Idle amplitude eases to 0 when paused.
        r.idle += ((pausedRef.current ? 0 : 1) - r.idle) * Math.min(1, delta * 3);

        if (!r.dragging) {
            r.ry += r.vy * f;
            r.rx += r.vx * f;
            r.vy *= Math.pow(0.9, f);
            r.vx *= Math.pow(0.9, f);
            // Spring home, wrapping full turns so it takes the short way back.
            r.ry = Math.atan2(Math.sin(r.ry), Math.cos(r.ry));
            r.ry *= Math.pow(0.95, f);
            r.rx *= Math.pow(0.93, f);
        }
        r.kick *= Math.pow(0.9, f);

        const k = Math.min(1, delta * 2.5);
        r.leanX += (-state.pointer.y * 0.14 * r.idle - r.leanX) * k;
        r.leanY += (state.pointer.x * 0.26 * r.idle - r.leanY) * k;

        if (spinRef.current) {
            spinRef.current.rotation.set(
                BASE_ROT.x + r.rx + r.leanX,
                BASE_ROT.y + r.ry + r.leanY + r.kick,
                Math.sin(t * 0.7) * 0.035 * r.idle
            );
        }
        if (floatRef.current) floatRef.current.position.y = (viewport.aspect > 1 ? -0.18 : 0.1) + Math.sin(t * 1.1) * 0.09 * r.idle;
    });

    // Fit the pad to the viewport: big on desktop, scaled down on phones.
    const scale = viewport.aspect > 1 ? THREE.MathUtils.clamp(viewport.width / 10.5, 0.55, 0.74) : THREE.MathUtils.clamp(viewport.width / 6.2, 0.5, 0.9);

    return (
        <group ref={floatRef} scale={scale} position-x={viewport.aspect > 1 ? -viewport.width * 0.06 : 0}>
            <group ref={spinRef} onPointerDown={onPointerDown} onPointerOver={cursorFor("grab")} onPointerOut={cursorFor("")}>
                <mesh geometry={body}>
                    <meshPhysicalMaterial
                        color={COLORS.body}
                        roughness={0.52}
                        clearcoat={0.45}
                        clearcoatRoughness={0.38}
                        sheen={0.3}
                        sheenColor="#ff8a7a"
                    />
                </mesh>
                {/* Bumpers on the top edge */}
                {[-1, 1].map((side) => (
                    <RoundedBox
                        key={side}
                        args={[0.95, 0.24, 0.34]}
                        radius={0.08}
                        smoothness={4}
                        position={[side * 1.32, 0.97, -0.04]}
                        rotation={[0, 0, side * -0.09]}
                    >
                        <meshPhysicalMaterial color={COLORS.trim} roughness={0.6} clearcoat={0.2} />
                    </RoundedBox>
                ))}
                <DPad onInput={onInput} register={register} />
                {(["A", "B", "X", "Y"] as FaceButton[]).map((letter) => (
                    <FaceButtonMesh key={letter} letter={letter} active={active === letter} onInput={onInput} register={register} />
                ))}
                {LAYOUT.sticks.map((pos, i) => (
                    <Stick key={i} position={pos} />
                ))}
                <StarButton onInput={onInput} register={register} />
                {/* A thin gold seam around the face, like foil on the logo */}
                <mesh position={[0, 0.06, FRONT - 0.005]}>
                    <ringGeometry args={[0.47, 0.49, 64]} />
                    <meshStandardMaterial color={COLORS.gold} metalness={0.6} roughness={0.35} />
                </mesh>
            </group>
        </group>
    );
}

/* ── Canvas, driven by GSAP's ticker ── */

/** Phones and tablets: lower pixel ratio, no MSAA, 30 fps. The pad looks the same at a glance. */
const isLite = () => window.matchMedia("(max-width: 860px), (pointer: coarse)").matches;

export default function ControllerScene(props: ControllerSceneProps) {
    const wrap = useRef<HTMLDivElement>(null);
    const lite = useMemo(isLite, []);

    useEffect(() => {
        let visible = true;
        const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { rootMargin: "100px" });
        if (wrap.current) io.observe(wrap.current);
        // While the page scrolls, give the frames to the scroll: phones pause the pad,
        // desktops render it at half rate. It resumes 160 ms after scrolling stops.
        let lastScroll = 0;
        const onScroll = () => (lastScroll = performance.now());
        window.addEventListener("scroll", onScroll, { passive: true });
        let frame = 0;
        const tick = (time: number) => {
            if (!visible || document.hidden) return;
            const scrolling = performance.now() - lastScroll < 160;
            if (scrolling && lite) return;
            frame++;
            // Lite devices render every other tick (30 fps); desktops do the same mid-scroll.
            if ((lite || scrolling) && frame % 2 === 1) return;
            advance(time);
        };
        gsap.ticker.add(tick);
        return () => {
            gsap.ticker.remove(tick);
            window.removeEventListener("scroll", onScroll);
            io.disconnect();
            document.body.style.cursor = "";
        };
    }, [lite]);

    return (
        <div ref={wrap} style={{ position: "absolute", inset: 0 }}>
            <Canvas
                frameloop="never"
                dpr={lite ? [1, 1.25] : [1, 1.75]}
                camera={{ position: [0, 0, 9], fov: 30 }}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                onCreated={({ gl }) => {
                    gl.toneMapping = THREE.NeutralToneMapping;
                    gl.toneMappingExposure = 1.05;
                }}
                aria-hidden="true"
            >
                <ambientLight intensity={0.35} />
                <directionalLight position={[3, 5, 6]} intensity={2.4} color="#FFE9D6" />
                <directionalLight position={[-5, -2, -3]} intensity={1.4} color={COLORS.gold} />
                <Environment resolution={lite ? 64 : 128}>
                    <Lightformer form="rect" intensity={2.2} position={[0, 5, 4]} scale={[10, 2, 1]} color="#FFF3E6" />
                    <Lightformer form="rect" intensity={1.2} position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} color="#FFD7B0" />
                    <Lightformer form="ring" intensity={0.8} position={[5, 1, -3]} scale={3} color={COLORS.gold} />
                </Environment>
                <Pad {...props} />
            </Canvas>
        </div>
    );
}
