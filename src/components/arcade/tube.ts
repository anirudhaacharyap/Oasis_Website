import { CABINETS, LETTER, arcade, screens } from "./game";
import { PAL, SCREEN, drawGlyph } from "./pixels";
import { drawSprite } from "./symbols";

/**
 * The CRT picture, at true retro resolution (26 x 20): a machine's letter, a channel change
 * (roll, static, pop), the jackpot, and the power band. Shared by the 3D machines (as a texture
 * under the CRT shader) and the flat 2D fallback (scaled up as pixels).
 */
export const W = SCREEN.w;
export const H = SCREEN.h;
/** Where the 10x13 letter and the 16x16 symbol sit on the 26x20 tube. */
export const GLYPH_AT = [8, 3] as const;
const SPRITE_AT = [5, 2] as const;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** What a channel looks like on machine i's tube, shifted by (ox, oy). */
function paint(ctx: CanvasRenderingContext2D, ch: number, i: number, ox = 0, oy = 0) {
    if (ch === LETTER) drawGlyph(ctx, CABINETS[i], GLYPH_AT[0] + ox, GLYPH_AT[1] + oy);
    else drawSprite(ctx, ch, SPRITE_AT[0] + ox, SPRITE_AT[1] + oy);
}

/** Static between channels: random grey snow with the odd red fleck, written as one pixel buffer. */
const SNOW: [number, number, number][] = [
    [11, 9, 9],
    [58, 53, 55],
    [141, 135, 130],
    [229, 50, 58],
];
let snowBuf: ImageData | null = null;
function snow(ctx: CanvasRenderingContext2D) {
    snowBuf ??= ctx.createImageData(W, H);
    const d = snowBuf.data;
    for (let p = 0; p < W * H; p++) {
        const r = Math.random();
        const [cr, cg, cb] = SNOW[r < 0.45 ? 0 : r < 0.8 ? 1 : r < 0.96 ? 2 : 3];
        d[p * 4] = cr;
        d[p * 4 + 1] = cg;
        d[p * 4 + 2] = cb;
        d[p * 4 + 3] = 255;
    }
    ctx.putImageData(snowBuf, 0, 0);
}

/** The jackpot on one tube: a flash, pixel coins raining, the winning symbol blinking. */
function jackpotFrame(ctx: CanvasRenderingContext2D, i: number, t: number) {
    if (t < 110) {
        ctx.fillStyle = PAL.cream;
        ctx.fillRect(0, 0, W, H);
        return;
    }
    for (let c = 0; c < 9; c++) {
        const x = (c * 5 + i * 7) % (W - 2);
        const y = Math.floor(((t / 1000) * (16 + (c % 3) * 7) + c * 4) % (H + 3)) - 2;
        ctx.fillStyle = PAL.deep;
        ctx.fillRect(x, y, 2, 2);
        ctx.fillStyle = PAL.signal;
        ctx.fillRect(x, y, 1, 1);
    }
    if (Math.floor(t / 140) % 3 !== 2) drawSprite(ctx, arcade.jackSymbol, SPRITE_AT[0], SPRITE_AT[1]);
    if (Math.floor(t / 140) % 2 === 0) {
        ctx.fillStyle = PAL.signal;
        ctx.fillRect(0, 0, W, 1);
        ctx.fillRect(0, H - 1, W, 1);
        ctx.fillRect(0, 0, 1, H);
        ctx.fillRect(W - 1, 0, 1, H);
    }
}

/** One tube frame: the channel (or a channel change, or the jackpot), then the CRT power band. */
export function drawTube(ctx: CanvasRenderingContext2D, i: number, now: number, power: number, jitter: number) {
    const s = screens[i];
    ctx.fillStyle = PAL.tube;
    ctx.fillRect(0, 0, W, H);
    if (power <= 0.002) return;

    if (arcade.jackStart >= 0 && s.flip >= 1) {
        jackpotFrame(ctx, i, now - arcade.jackStart);
    } else if (s.flip < 1) {
        const f = s.flip;
        if (f < 0.38) {
            // The picture rolls away.
            const dy = Math.round((f / 0.38) * H);
            paint(ctx, s.ch, i, 0, dy);
            paint(ctx, s.ch, i, 0, dy - H);
            ctx.fillStyle = "rgba(242,234,219,0.25)";
            ctx.fillRect(0, (dy + 7) % H, W, 1);
        } else if (f < 0.7) {
            snow(ctx);
        } else {
            paint(ctx, s.to, i);
            ctx.fillStyle = `rgba(242,234,219,${(1 - (f - 0.7) / 0.3) * 0.4})`;
            ctx.fillRect(0, 0, W, H);
        }
    } else {
        paint(ctx, s.ch, i, jitter, 0);
    }

    if (power < 1) {
        // CRT on/off: a dot widens into a line, the line opens into the picture.
        if (power < 0.5) {
            ctx.fillStyle = PAL.tube;
            ctx.fillRect(0, 0, W, H);
            const w = Math.max(1, Math.round(W * power * 2));
            ctx.fillStyle = PAL.cream;
            ctx.fillRect(Math.round((W - w) / 2), Math.floor(H / 2), w, 1);
        } else {
            const band = Math.max(1, Math.round(H * (power - 0.5) * 2));
            const top = Math.round((H - band) / 2);
            ctx.fillStyle = PAL.tube;
            ctx.fillRect(0, 0, W, top);
            ctx.fillRect(0, top + band, W, H - top - band);
            ctx.fillStyle = PAL.cream;
            ctx.fillRect(0, top, W, 1);
            ctx.fillRect(0, top + band - 1, W, 1);
        }
    }
}

