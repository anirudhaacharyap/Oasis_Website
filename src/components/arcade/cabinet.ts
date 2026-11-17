import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { H as TUBE_H, W as TUBE_W } from "./tube";

/**
 * One upright arcade cabinet in 3D, built from code in the club palette: an extruded side profile
 * (base, control deck, raked CRT, marquee hood) with red T-molding on every edge, plain lit stripes
 * on the marquee, a CRT behind dark glass, joystick and buttons, a coin door and a kick plate.
 *
 * Rendered sharp, at full resolution. The retro lives in the picture: the CRT shows a 26 x 20
 * pixel image through a shader that adds the tube (scanlines, slot mask, glow, curve, vignette).
 *
 * Units are metres-ish; the cabinet stands on y = 0, centred on x, its front facing +z. Static parts
 * are merged per material, so a machine costs about ten draw calls.
 */
export const CAB = { W: 0.8, H: 1.92, DEPTH: 0.82 };

/** Side profile as [depth from the back, height], walked counter-clockwise. */
const P: [number, number][] = [
    [0, 0],
    [0.62, 0], // kick plate foot
    [0.62, 0.8], // top of the coin door face
    [0.82, 0.9], // underside of the control deck
    [0.82, 0.97], // deck front lip
    [0.58, 1.04], // deck top, back edge
    [0.47, 1.56], // CRT, raked back
    [0.68, 1.63], // hood underside
    [0.72, 1.92], // marquee face top
    [0, 1.92],
];
const Z0 = 0.41; // shift so the cabinet's depth is centred on z = 0

const C = {
    ink: "#1d1b1c",
    side: "#AD0013",
    deep: "#7C000E",
    signal: "#E5323A",
    cream: "#F2EADB",
    glass: "#070606",
    door: "#2a2628",
    steel: "#9a948f",
};

/* ── Retro shading: a few bands with an ordered dither between them, on a 2-pixel grid ── */

// The 4x4 Bayer matrix by arithmetic (no per-pixel lookup table, which is slow on weak GPUs).
const BAYER = /* glsl */ `
float bayer2(vec2 a) {
    a = floor(a);
    return fract(dot(a, vec2(0.5, a.y * 0.75)));
}
float bayer4(vec2 a) {
    return bayer2(0.5 * a) * 0.25 + bayer2(a);
}
`;

function dither<T extends THREE.Material>(mat: T, bands = 14): T {
    mat.onBeforeCompile = (shader) => {
        shader.fragmentShader = shader.fragmentShader.replace("void main() {", `${BAYER}\nvoid main() {`).replace(
            "#include <dithering_fragment>",
            `#include <dithering_fragment>
            gl_FragColor.rgb = floor(gl_FragColor.rgb * ${bands.toFixed(1)} + bayer4(gl_FragCoord.xy * 0.5)) / ${bands.toFixed(1)};`,
        );
    };
    return mat;
}
const lambert = (color: string, extra: THREE.MeshLambertMaterialParameters = {}) =>
    dither(new THREE.MeshLambertMaterial({ color, ...extra }));
const glow = (color: string) => new THREE.MeshBasicMaterial({ color, toneMapped: false });

/* ── Textures, painted as pixel art and sampled with hard edges ── */

function pixelTexture(canvas: HTMLCanvasElement, colorSpace: THREE.ColorSpace = THREE.SRGBColorSpace) {
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = colorSpace;
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    return tex;
}

/** Side art: red panel, cream racing stripes and a big star, in chunky pixels. */
function paintSideArt() {
    const w = 42;
    const h = 96;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;
    ctx.fillStyle = C.side;
    ctx.fillRect(0, 0, w, h);
    for (let y = 30; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const d = Math.floor(x + (h - y) * 0.55) % 30;
            if (d < 3) ctx.fillStyle = C.cream;
            else if (d < 5) ctx.fillStyle = C.signal;
            else continue;
            ctx.fillRect(x, y, 1, 1);
        }
    }
    const star = [
        "......#......",
        ".....###.....",
        ".....###.....",
        "#############",
        ".###########.",
        "..#########..",
        "...#######...",
        "..####.####..",
        "..###...###..",
        ".##.......##.",
    ];
    star.forEach((row, y) =>
        row.split("").forEach((ch, x) => {
            if (ch !== "#") return;
            ctx.fillStyle = C.cream;
            ctx.fillRect(12 + x, 10 + y, 1, 1);
        }),
    );
    ctx.fillStyle = C.deep;
    ctx.fillRect(0, h - 5, w, 5);
    return canvas;
}

/** The marquee: plain lit stripes, cream, signal red, cream, with a darker seam between bands. */
function paintStripes() {
    const canvas = document.createElement("canvas");
    canvas.width = 4;
    canvas.height = 18;
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;
    const bands: [number, number, string][] = [
        [0, 5, C.cream],
        [5, 1, "#c9b9a6"],
        [6, 6, C.signal],
        [12, 1, "#c9b9a6"],
        [13, 5, C.cream],
    ];
    for (const [y, hgt, color] of bands) {
        ctx.fillStyle = color;
        ctx.fillRect(0, y, 4, hgt);
    }
    return canvas;
}

/* ── The CRT ── */

const TUBE_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * The tube: the 26 x 20 picture seen through curved glass. Scanlines between pixel rows, an RGB
 * slot mask, phosphor bloom from the neighbouring pixels, a slow brightness roll, vignette and a
 * glare. Output is written as-is: the picture is already in display colours (Canvas is flat).
 */
const TUBE_FRAG = /* glsl */ `
uniform sampler2D uPic;
uniform float uTime;
uniform float uAim;
varying vec2 vUv;

const vec2 RES = vec2(${TUBE_W.toFixed(1)}, ${TUBE_H.toFixed(1)});

void main() {
    vec2 d = vUv - 0.5;
    vec2 uv = 0.5 + d * (1.0 + 0.14 * dot(d, d)); // curved glass
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        gl_FragColor = vec4(0.012, 0.01, 0.01, 1.0);
        return;
    }
    vec3 c = texture2D(uPic, uv).rgb;

    // Phosphor bloom: light bleeds from the neighbouring pixels.
    vec2 px = 1.0 / RES;
    vec3 bloom = texture2D(uPic, uv + vec2(px.x, 0.0)).rgb + texture2D(uPic, uv - vec2(px.x, 0.0)).rgb
               + texture2D(uPic, uv + vec2(0.0, px.y)).rgb + texture2D(uPic, uv - vec2(0.0, px.y)).rgb;
    c += bloom * 0.09;

    // Scanlines: each pixel row is a bright beam with a dark gap under it.
    float row = fract(uv.y * RES.y);
    c *= 0.55 + 0.45 * smoothstep(0.0, 0.25, row) * smoothstep(1.0, 0.7, row);

    // Slot mask: thin red, green, blue columns, three per pixel.
    float col = fract(uv.x * RES.x * 3.0);
    vec3 mask = vec3(step(col, 0.34), step(0.34, col) * step(col, 0.67), step(0.67, col));
    c *= 0.8 + 0.32 * mask;

    // A slow roll of brightness down the tube, and the aimed machine glowing a touch hotter.
    c *= 0.95 + 0.05 * sin(uv.y * 7.0 - uTime * 2.2);
    c *= 1.0 + uAim * 0.18;

    float vig = smoothstep(0.78, 0.28, length(d * vec2(1.0, 1.25)));
    c *= mix(0.4, 1.0, vig);
    c += vec3(0.05, 0.012, 0.014) * vig; // the red phosphor floor of a powered tube
    c += vec3(0.09) * smoothstep(0.32, 0.0, length(uv - vec2(0.28, 0.78))); // glare on the glass

    gl_FragColor = vec4(c, 1.0);
}
`;

/* ── Placing flat parts on the profile's faces ── */

/** A point `t` along the face from P[a] to P[b], lifted off it, plus the face's tilt. */
function onFace(a: number, b: number, t: number, lift: number) {
    const [z1, y1] = P[a];
    const [z2, y2] = P[b];
    const dz = z2 - z1;
    const dy = y2 - y1;
    const len = Math.hypot(dz, dy);
    const nz = dy / len;
    const ny = -dz / len;
    return {
        pos: new THREE.Vector3(0, y1 + dy * t + ny * lift, z1 + dz * t - Z0 + nz * lift),
        rotX: -Math.atan2(ny, nz),
        len,
    };
}

/** Bake a part's placement into a copy of its geometry. */
function placed(geo: THREE.BufferGeometry, pos: THREE.Vector3, rotX = 0, extra?: THREE.Matrix4) {
    const m = new THREE.Matrix4().makeRotationX(rotX).setPosition(pos);
    if (extra) m.multiply(extra);
    const g = geo.index ? geo.toNonIndexed() : geo.clone();
    g.applyMatrix4(m);
    // Keep only the attributes every part shares, so they merge.
    for (const name of Object.keys(g.attributes)) if (!["position", "normal", "uv"].includes(name)) g.deleteAttribute(name);
    return g;
}

/* ── The kit: built once, shared by all five machines ── */

export interface Machine {
    group: THREE.Group;
    tube: THREE.ShaderMaterial;
    marquee: THREE.MeshBasicMaterial;
    spill: THREE.MeshBasicMaterial;
}

export interface Kit {
    make(picture: THREE.Texture): Machine;
    dispose(): void;
}

export function buildKit(): Kit {
    const owned: { dispose(): void }[] = [];
    const keep = <T extends { dispose(): void }>(x: T) => {
        owned.push(x);
        return x;
    };

    // Body: the profile extruded across the width; the caps are the side panels.
    const shape = new THREE.Shape(P.map(([z, y]) => new THREE.Vector2(z, y)));
    const bevel = 0.014;
    const body = keep(
        new THREE.ExtrudeGeometry(shape, {
            depth: CAB.W - bevel * 2,
            bevelEnabled: true,
            bevelThickness: bevel,
            bevelSize: bevel,
            bevelSegments: 2,
            curveSegments: 1,
        }),
    );
    body.rotateY(-Math.PI / 2); // profile depth -> +z (front), extrusion -> -x
    body.translate(CAB.W / 2 - bevel, 0, -Z0);

    // T-molding: a red tube around the profile on both sides.
    const loop = new THREE.CurvePath<THREE.Vector3>();
    P.forEach(([z, y], i) => {
        const [z2, y2] = P[(i + 1) % P.length];
        loop.add(new THREE.LineCurve3(new THREE.Vector3(0, y, z - Z0), new THREE.Vector3(0, y2, z2 - Z0)));
    });
    const tubeGeo = new THREE.TubeGeometry(loop, 120, 0.018, 5, true);
    const trim = keep(
        mergeGeometries([tubeGeo.clone().translate(CAB.W / 2 + 0.003, 0, 0), tubeGeo.clone().translate(-CAB.W / 2 - 0.003, 0, 0)])!,
    );
    tubeGeo.dispose();

    const sideTex = keep(pixelTexture(paintSideArt()));
    sideTex.repeat.set(1 / 0.86, 1 / 1.95);
    sideTex.offset.set(0.01, 0.01);
    const stripeTex = keep(pixelTexture(paintStripes()));

    const M = {
        side: keep(lambert(C.cream, { map: sideTex })),
        body: keep(lambert(C.ink)),
        trim: keep(lambert(C.signal)),
        glass: keep(lambert(C.glass)),
        door: keep(lambert(C.door)),
        deep: keep(lambert(C.deep)),
        steel: keep(lambert(C.steel)),
        red: keep(lambert(C.signal)),
        cream: keep(lambert(C.cream)),
        lit: keep(glow(C.signal)),
        slit: keep(glow("#120d0d")),
    };

    // The body's bevel stands proud of the profile, so every face part sits just past it.
    const scr = onFace(5, 6, 0.5, 0.024);
    const bez = onFace(5, 6, 0.5, 0.02);
    const mq = onFace(7, 8, 0.5, 0.024);
    const deck = onFace(4, 5, 0.5, 0.016);
    const front = onFace(1, 2, 0.5, 0.02);
    const kick = onFace(1, 2, 0.065, 0.02);

    const tubeW = CAB.W * 0.72;
    const tubeH = tubeW * (TUBE_H / TUBE_W); // the picture keeps its pixels square
    const G = {
        tube: keep(new THREE.PlaneGeometry(tubeW, tubeH)),
        marquee: keep(new THREE.PlaneGeometry(CAB.W * 0.9, mq.len * 0.82)),
        spill: keep(new THREE.PlaneGeometry(CAB.W * 1.05, bez.len * 1.15)),
    };

    // Deck parts sit in the deck's own frame: +y is its normal, -z points toward the screen.
    const deckFrame = new THREE.Matrix4().makeRotationX(deck.rotX + Math.PI / 2).setPosition(deck.pos);
    const onDeck = (geo: THREE.BufferGeometry, x: number, y: number, z: number) => {
        const g = (geo.index ? geo.toNonIndexed() : geo.clone()).translate(x, y, z).applyMatrix4(deckFrame);
        for (const name of Object.keys(g.attributes)) if (!["position", "normal", "uv"].includes(name)) g.deleteAttribute(name);
        return g;
    };
    const shaft = new THREE.CylinderGeometry(0.011, 0.011, 0.1, 8);
    const ball = new THREE.SphereGeometry(0.036, 14, 10);
    const button = new THREE.CylinderGeometry(0.03, 0.03, 0.022, 16);
    const start = new THREE.BoxGeometry(0.05, 0.012, 0.03);
    const plane = (w: number, h: number) => new THREE.PlaneGeometry(w, h);

    // Static parts, merged per material: one draw per material per machine.
    const merged = (parts: THREE.BufferGeometry[]) => {
        const g = keep(mergeGeometries(parts)!);
        parts.forEach((p) => p.dispose());
        return g;
    };
    const STATIC: [THREE.BufferGeometry, THREE.Material][] = [
        [merged([placed(plane(CAB.W * 0.86, bez.len * 0.94), bez.pos, bez.rotX)]), M.glass],
        [
            merged([
                (() => {
                    const g = placed(plane(0.36, 0.34), front.pos, front.rotX);
                    g.translate(0, -0.04, 0);
                    return g;
                })(),
            ]),
            M.door,
        ],
        [
            merged([
                placed(plane(CAB.W * 0.96, 0.1), kick.pos, kick.rotX),
                ...[-0.07, 0.07].map((dx) => {
                    const g = placed(plane(0.07, 0.1), front.pos, front.rotX);
                    g.translate(dx, 0.02, 0.002);
                    return g;
                }),
            ]),
            M.deep,
        ],
        [onDeck(shaft, -0.2, 0.05, 0.02), M.steel],
        [merged([onDeck(ball, -0.2, 0.11, 0.02), onDeck(button, 0.08, 0.008, 0.03), onDeck(button, 0.26, 0.008, 0.03)]), M.red],
        [merged([onDeck(button, 0.17, 0.008, 0.0)]), M.cream],
        [
            merged([
                onDeck(start, -0.04, 0.004, -0.08),
                onDeck(start, 0.04, 0.004, -0.08),
                ...[-0.07, 0.07].map((dx) => {
                    const g = placed(plane(0.012, 0.06), front.pos, front.rotX);
                    g.translate(dx, 0.02, 0.006);
                    return g;
                }),
            ]),
            M.lit,
        ],
    ];
    [shaft, ball, button, start].forEach((g) => g.dispose());

    return {
        make(picture) {
            const group = new THREE.Group();
            group.add(new THREE.Mesh(body, [M.side, M.body]));
            group.add(new THREE.Mesh(trim, M.trim));
            for (const [geo, mat] of STATIC) group.add(new THREE.Mesh(geo, mat));

            // Light from the tube spilling onto the bezel, under the picture.
            const spill = keep(
                new THREE.MeshBasicMaterial({
                    color: C.signal,
                    transparent: true,
                    opacity: 0,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                    toneMapped: false,
                }),
            );
            const spillMesh = new THREE.Mesh(G.spill, spill);
            spillMesh.position.copy(onFace(5, 6, 0.5, 0.022).pos);
            spillMesh.rotation.x = scr.rotX;
            group.add(spillMesh);

            const tube = keep(
                new THREE.ShaderMaterial({
                    vertexShader: TUBE_VERT,
                    fragmentShader: TUBE_FRAG,
                    uniforms: { uPic: { value: picture }, uTime: { value: 0 }, uAim: { value: 0 } },
                    toneMapped: false,
                }),
            );
            const tubeMesh = new THREE.Mesh(G.tube, tube);
            tubeMesh.position.copy(scr.pos);
            tubeMesh.rotation.x = scr.rotX;
            group.add(tubeMesh);

            const marquee = keep(new THREE.MeshBasicMaterial({ map: stripeTex, toneMapped: false }));
            const marqueeMesh = new THREE.Mesh(G.marquee, marquee);
            marqueeMesh.position.copy(mq.pos);
            marqueeMesh.rotation.x = mq.rotX;
            group.add(marqueeMesh);

            // Nothing inside a machine moves on its own; only the group does.
            group.traverse((o) => {
                if (o === group) return;
                o.updateMatrix();
                o.matrixAutoUpdate = false;
            });
            return { group, tube, marquee, spill };
        },
        dispose() {
            owned.forEach((d) => d.dispose());
        },
    };
}

/** Local bounding box corners of a machine, for projecting its hit target to the screen. */
export const CAB_CORNERS = (() => {
    const out: THREE.Vector3[] = [];
    for (const x of [-CAB.W / 2 - 0.02, CAB.W / 2 + 0.02])
        for (const y of [0, CAB.H + 0.02])
            for (const z of [-Z0, CAB.DEPTH - Z0 + 0.02]) out.push(new THREE.Vector3(x, y, z));
    return out;
})();
