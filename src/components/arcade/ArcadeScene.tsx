"use client";

/**
 * The OASIS arcade in 3D: five machines in a row, each facing you square on, their CRTs spelling
 * OASIS. One clock: the Canvas uses frameloop="never" and GSAP's ticker calls advance() (seconds).
 *
 * Kept light for ordinary PCs: pixel ratio capped at 1.5 and stepped down when the page's own
 * frame interval says the machine is struggling, every shader compiled before the first frame (compileAsync), static parts merged
 * per material, no allocation in the frame loop, half-rate rendering while nothing moves, and no
 * rendering at all offscreen or in a hidden tab.
 */
import { Canvas, advance, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { reel } from "@/lib/reel";
import { CAB_CORNERS, buildKit, type Machine } from "./cabinet";
import { CABINETS, JACKPOT_MS, aim, arcade, screens, step } from "./game";
import { H, W, clamp01, drawTube } from "./tube";
import { mark as reached } from "./loading";
import styles from "./Arcade3D.module.css";

const SPACING = 0.98;
const FOV = 26;
const ROW_W = (CABINETS.length - 1) * SPACING + 0.86;
/** Something is moving: render every frame. Otherwise every other frame is enough. */
const busy = { until: 0 };

function Row({ onReady }: { onReady: () => void }) {
    const kit = useMemo(() => buildKit(), []);
    // One 26 x 20 picture per tube, drawn by the shared retro tube code, uploaded as a texture.
    const pics = useMemo(
        () =>
            CABINETS.map(() => {
                const canvas = document.createElement("canvas");
                canvas.width = W;
                canvas.height = H;
                const tex = new THREE.CanvasTexture(canvas);
                tex.colorSpace = THREE.NoColorSpace; // drawn in display colours, written out as-is
                tex.magFilter = THREE.NearestFilter;
                tex.minFilter = THREE.NearestFilter;
                tex.generateMipmaps = false;
                return { canvas, ctx: canvas.getContext("2d"), tex };
            }),
        [],
    );
    const machines = useMemo<Machine[]>(() => pics.map((p) => kit.make(p.tex)), [kit, pics]);
    const rowRef = useRef<THREE.Group>(null);
    const { camera, size, gl, scene } = useThree();

    useEffect(
        () => () => {
            kit.dispose();
            pics.forEach((p) => p.tex.dispose());
        },
        [kit, pics],
    );

    const stateRef = useRef({
        frames: 0,
        compiled: false,
        ready: false,
        tiltX: 0,
        tiltY: 0,
        lean: CABINETS.map(() => 0),
        drawn: CABINETS.map(() => ""),
        jitterAt: 0,
        jitterCab: -1,
        jitterUntil: 0,
        time: 0,
    });
    const v = useMemo(() => new THREE.Vector3(), []);

    // Compile every program before the first visible frame, so nothing stutters on boot.
    useEffect(() => {
        let alive = true;
        gl.compileAsync(scene, camera).finally(() => {
            if (alive) stateRef.current.compiled = true;
        });
        return () => {
            alive = false;
        };
    }, [gl, scene, camera]);

    useFrame((_, delta) => {
        const s = stateRef.current;
        const row = rowRef.current;
        if (!row) return;
        const dt = Math.min(delta, 0.05);
        s.time += dt;
        const k = 1 - Math.pow(0.0015, dt); // frame-rate independent ease toward targets
        const now = performance.now();
        const hb = reel.heroBreak;
        const jack = arcade.jackStart >= 0 ? now - arcade.jackStart : -1;
        step(now);

        // Camera: fit the row to the frame from a little above the screens; ease back on the way out.
        const cam = camera as THREE.PerspectiveCamera;
        const aspect = size.width / Math.max(1, size.height);
        const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
        const visH = Math.max(2.18, (ROW_W * 1.1) / aspect);
        const dist = visH / (2 * tan) + 0.4;
        cam.position.set(0, 1.18, dist * (1 + hb * 0.14));
        cam.lookAt(0, 0.99, 0);

        // A barely-there lean toward the pointer, the same for every machine.
        s.tiltY += (aim.mx * 0.03 - s.tiltY) * k * 0.5;
        s.tiltX += (aim.my * 0.012 - s.tiltX) * k * 0.5;
        row.rotation.set(s.tiltX, s.tiltY, 0);

        // Idle life: now and then one tube jumps a pixel, like a loose signal.
        if (arcade.booted && now > s.jitterAt) {
            s.jitterAt = now + 3500 + Math.random() * 3500;
            s.jitterCab = Math.floor(Math.random() * CABINETS.length);
            s.jitterUntil = now + 90;
        }

        machines.forEach((m, i) => {
            const sc = screens[i];
            const off = i - (CABINETS.length - 1) / 2;
            const x = off * SPACING;
            s.lean[i] += ((aim.aimed === i ? 1 : 0) - s.lean[i]) * k;
            m.group.position.set(x, s.lean[i] * 0.01, s.lean[i] * 0.06 - sc.recoil * 0.08);
            // Each machine turns to face the camera, so every letter reads the same.
            m.group.rotation.y = -Math.atan2(x, dist);

            // Power-down on the way out: tubes collapse left to right, marquees die right to left.
            const down = clamp01((hb - 0.08 - i * 0.035) / 0.3);
            const power = sc.power * (1 - down);
            const cut = hb > 0.3 + (CABINETS.length - 1 - i) * 0.07 ? 0 : 1;
            const strobe = jack >= 0 && jack < JACKPOT_MS && Math.floor(jack / 90) % 2 === 1 ? 0.25 : 1;
            const lit = sc.lamp * cut * strobe;
            m.marquee.color.setScalar(0.12 + 1.0 * lit + s.lean[i] * 0.12 * lit);
            m.spill.opacity = 0.16 * power + s.lean[i] * 0.06 * power;

            const jitter = i === s.jitterCab && now < s.jitterUntil ? 1 : 0;
            const key = `${sc.ch}|${sc.to}|${sc.flip.toFixed(3)}|${power.toFixed(3)}|${jack >= 0 ? Math.floor(jack / 33) : -1}|${jitter}`;
            const pic = pics[i];
            if (pic.ctx && key !== s.drawn[i]) {
                s.drawn[i] = key;
                drawTube(pic.ctx, i, now, power, jitter);
                pic.tex.needsUpdate = true;
                busy.until = now + 250;
            }
            m.tube.uniforms.uTime.value = s.time + i * 0.7;
            m.tube.uniforms.uAim.value = s.lean[i];
            if (Math.abs((aim.aimed === i ? 1 : 0) - s.lean[i]) > 0.002 || sc.recoil > 0.001) busy.until = now + 100;
        });
        if (Math.abs(aim.mx * 0.03 - s.tiltY) > 0.0005 || hb > 0) busy.until = now + 100;

        // Project each machine's box to the canvas, for the DOM hit targets over it.
        row.updateMatrixWorld();
        cam.updateMatrixWorld();
        machines.forEach((m, i) => {
            let l = Infinity;
            let t = Infinity;
            let r = -Infinity;
            let b = -Infinity;
            for (const c of CAB_CORNERS) {
                v.copy(c).applyMatrix4(m.group.matrixWorld).project(cam);
                const px = ((v.x + 1) / 2) * size.width;
                const py = ((1 - v.y) / 2) * size.height;
                if (px < l) l = px;
                if (px > r) r = px;
                if (py < t) t = py;
                if (py > b) b = py;
            }
            const out = aim.rects[i];
            out.l = l;
            out.t = t;
            out.r = r;
            out.b = b;
        });

        s.frames++;
        if (!s.ready && s.compiled && s.frames > 2) {
            s.ready = true;
            onReady();
        }
    });

    return (
        <group ref={rowRef}>
            {machines.map((m, i) => (
                <primitive key={i} object={m.group} />
            ))}
            <Floor />
        </group>
    );
}

/** A red glow pooled on the floor under the row, so the machines stand on something. */
function Floor() {
    const tex = useMemo(() => {
        const c = document.createElement("canvas");
        c.width = c.height = 64;
        const ctx = c.getContext("2d");
        if (ctx) {
            const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
            g.addColorStop(0, "rgba(173,0,19,0.6)");
            g.addColorStop(0.55, "rgba(173,0,19,0.16)");
            g.addColorStop(1, "rgba(173,0,19,0)");
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, 64, 64);
        }
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
    }, []);
    useEffect(() => () => tex.dispose(), [tex]);
    return (
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.002, 0.3]} scale={[ROW_W * 1.45, 2.4, 1]}>
            <planeGeometry />
            <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
        </mesh>
    );
}

export default function ArcadeScene({ onReady }: { onReady: () => void }) {
    const wrapRef = useRef<HTMLDivElement>(null);
    // Resolution steps down on a struggling PC, to 75% then 60% of where it started, judged on the
    // page's real frame interval (GSAP's clock), not on rendered frames, halved on purpose when idle.
    const [dpr, setDpr] = useState<number | [number, number]>([1, 1.5]);
    const levelRef = useRef(0);

    useEffect(() => {
        reached("scene"); // the 3D code is here and the scene is mounting
        let visible = true;
        const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { rootMargin: "80px" });
        if (wrapRef.current) io.observe(wrapRef.current);
        let odd = false;
        let sum = 0;
        let n = 0;
        const tick = (time: number, deltaTime: number) => {
            if (!visible || document.hidden) return;
            // Judge only once booted: loading and compiling frames say nothing about the PC.
            if (arcade.booted) sum += Math.min(deltaTime, 100);
            if (arcade.booted && ++n === 45) {
                const avg = sum / n;
                sum = 0;
                n = 0;
                if (avg > 24 && levelRef.current < 2) {
                    levelRef.current++;
                    const base = Math.min(window.devicePixelRatio || 1, 1.5);
                    setDpr(base * (levelRef.current === 1 ? 0.75 : 0.6));
                    // Scaled up, a retro arcade can show its pixels rather than blur.
                    wrapRef.current?.setAttribute("data-lowres", "");
                }
            }
            // Idle: every other frame is plenty for a scanline roll. Anything moving gets every frame.
            odd = !odd;
            if (performance.now() > busy.until && odd) return;
            advance(time);
        };
        gsap.ticker.add(tick);
        return () => {
            gsap.ticker.remove(tick);
            io.disconnect();
        };
    }, []);

    return (
        <div ref={wrapRef} className={styles.scene}>
            <Canvas
                frameloop="never"
                flat
                dpr={dpr}
                camera={{ fov: FOV, near: 0.1, far: 40, position: [0, 1.2, 8] }}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                aria-hidden="true"
            >
                <ambientLight intensity={0.85} />
                <directionalLight position={[-3, 4, 6]} intensity={2.3} color="#FFF1E4" />
                <directionalLight position={[5, 3, -4]} intensity={2.0} color="#E5323A" />
                <directionalLight position={[0, -2, 4]} intensity={0.45} color="#AD0013" />
                <Row onReady={onReady} />
            </Canvas>
        </div>
    );
}
