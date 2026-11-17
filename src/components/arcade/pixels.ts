/**
 * The arcade's pixel art. Everything is measured in art pixels; the page scales one art pixel to a
 * whole number of screen pixels (--px), so edges stay hard at every size.
 */

export const PAL = {
    void: "#0e0d0d",
    body: "#1b191a",
    /** A one-pixel lit edge on the body's left, against the dark right edge: the only shading. */
    edgeLit: "#2a2627",
    bezel: "#2e2a2c",
    top: "#46403f",
    red: "#AD0013",
    signal: "#E5323A",
    deep: "#7C000E",
    cream: "#F2EADB",
    steel: "#8d8782",
    tube: "#0b0909",
    dimCream: "#4a3a34",
    dimRed: "#4a1418",
} as const;

/** One machine, front-on: 36 x 80 art pixels. */
export const CAB_W = 36;
export const CAB_H = 80;
/** Gap between machines, in art pixels. */
export const CAB_GAP = 6;
/** The CRT's hole in the bezel; the screen canvas sits exactly here. */
export const SCREEN = { x: 5, y: 15, w: 26, h: 20 } as const;
/** The marquee's stripe field; the lit lamp layer sits exactly here. */
export const MARQUEE = { x: 2, y: 2, w: 32, h: 7 } as const;

type Rect = [x: number, y: number, w: number, h: number, fill: string];

/** The cabinet as flat rectangles, back to front. The marquee is drawn unlit; its lamp is a layer. */
export const CABINET: Rect[] = [
    // Marquee hood: red frame, dark box, dull stripes (lit by the lamp layer).
    [0, 0, 36, 11, PAL.red],
    [1, 1, 34, 9, PAL.void],
    [2, 2, 32, 2, PAL.dimCream],
    [2, 4, 32, 3, PAL.dimRed],
    [2, 7, 32, 2, PAL.dimCream],
    [0, 11, 36, 1, PAL.void],
    // Upper body with red T-molding.
    [1, 12, 34, 28, PAL.body],
    [2, 12, 1, 28, PAL.edgeLit],
    [33, 12, 1, 28, PAL.void],
    [1, 12, 1, 28, PAL.red],
    [34, 12, 1, 28, PAL.red],
    // CRT bezel and tube.
    [3, 13, 30, 24, PAL.bezel],
    [3, 13, 30, 1, PAL.top],
    [5, 15, 26, 20, PAL.tube],
    // Speaker slot under the bezel.
    [10, 38, 16, 1, PAL.void],
    // Control panel: lit top, dark front, red trim.
    [0, 40, 36, 3, PAL.top],
    [0, 43, 36, 5, PAL.body],
    [0, 40, 1, 8, PAL.red],
    [35, 40, 1, 8, PAL.red],
    [0, 47, 36, 1, PAL.red],
    // Joystick: base, shaft, ball with a glint.
    [6, 40, 5, 1, PAL.void],
    [8, 38, 1, 2, PAL.steel],
    [7, 35, 3, 3, PAL.signal],
    [7, 35, 1, 1, PAL.cream],
    // Fire buttons.
    [20, 40, 2, 2, PAL.signal],
    [20, 42, 2, 1, PAL.deep],
    [24, 40, 2, 2, PAL.cream],
    [24, 42, 2, 1, PAL.steel],
    [28, 40, 2, 2, PAL.signal],
    [28, 42, 2, 1, PAL.deep],
    // 1P / 2P start lights.
    [14, 44, 3, 1, PAL.signal],
    [19, 44, 3, 1, PAL.signal],
    // Lower body with T-molding.
    [2, 48, 32, 25, PAL.body],
    [3, 48, 1, 25, PAL.edgeLit],
    [32, 48, 1, 25, PAL.void],
    [2, 48, 1, 25, PAL.red],
    [33, 48, 1, 25, PAL.red],
    // Coin door: two lit slots and a lock.
    [12, 53, 12, 14, PAL.bezel],
    [13, 54, 10, 12, PAL.void],
    [14, 56, 3, 5, PAL.deep],
    [15, 57, 1, 3, PAL.signal],
    [19, 56, 3, 5, PAL.deep],
    [20, 57, 1, 3, PAL.signal],
    [17, 63, 2, 2, PAL.steel],
    // Kick plate and base.
    [2, 73, 32, 5, PAL.deep],
    [2, 73, 32, 1, PAL.red],
    [1, 78, 34, 2, PAL.void],
];

/** The five letters, drawn for these screens only (10 x 13 pixels, three-pixel strokes). */
export const GLYPHS: Record<string, string[]> = {
    O: [
        "..######..",
        ".########.",
        "###....###",
        "###....###",
        "###....###",
        "###....###",
        "###....###",
        "###....###",
        "###....###",
        "###....###",
        "###....###",
        ".########.",
        "..######..",
    ],
    A: [
        "...####...",
        "..######..",
        ".###..###.",
        "###....###",
        "###....###",
        "##########",
        "##########",
        "###....###",
        "###....###",
        "###....###",
        "###....###",
        "###....###",
        "###....###",
    ],
    S: [
        ".#########",
        "##########",
        "###.......",
        "###.......",
        "###.......",
        "#########.",
        ".#########",
        ".......###",
        ".......###",
        ".......###",
        ".......###",
        "##########",
        "#########.",
    ],
    I: [
        "##########",
        "##########",
        "...####...",
        "...####...",
        "...####...",
        "...####...",
        "...####...",
        "...####...",
        "...####...",
        "...####...",
        "...####...",
        "##########",
        "##########",
    ],
};

/** Draw a letter with a one-pixel red drop, its top-left at (x, y). */
export function drawGlyph(ctx: CanvasRenderingContext2D, letter: string, x: number, y: number, ink: string = PAL.cream) {
    const rows = GLYPHS[letter];
    if (!rows) return;
    for (const [dx, dy, color] of [
        [1, 1, PAL.red],
        [0, 0, ink],
    ] as const) {
        ctx.fillStyle = color;
        rows.forEach((row, j) => {
            for (let i = 0; i < row.length; i++) if (row[i] === "#") ctx.fillRect(x + i + dx, y + j + dy, 1, 1);
        });
    }
}
