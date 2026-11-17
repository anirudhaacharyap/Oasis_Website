/**
 * The channel symbols: six 16x16 pixel-art sprites in the club palette, drawn onto the arcade
 * machines' CRT canvases.
 *   . empty   c cream   r red   s signal red
 */
export const SYMBOLS = ["star", "heart", "controller", "cartridge", "coin", "bolt"] as const;
export type SymbolName = (typeof SYMBOLS)[number];
export const SYMBOL_COUNT = SYMBOLS.length;

/** Plural labels for the readout and the live region ("Three stars"). */
export const SYMBOL_PLURAL: Record<SymbolName, string> = {
    star: "stars",
    heart: "hearts",
    controller: "controllers",
    cartridge: "cartridges",
    coin: "coins",
    bolt: "bolts",
};

/** Mirror an 8-wide half into a symmetric 16-wide row. */
const m = (half: string) => half + half.split("").reverse().join("");
const E = "................";

const SPRITES: Record<SymbolName, string[]> = {
    star: [
        E,
        ".......rr.......",
        "......rccr......",
        "......rccr......",
        ".....rccccr.....",
        "rrrrrccccccrrrrr",
        "rccccccccccccccr",
        ".rccccccccccccr.",
        "..rccccccccccr..",
        "...rccccccccr...",
        "...rccccccccr...",
        "..rccccrrccccr..",
        "..rcccr..rcccr..",
        ".rccr......rccr.",
        ".rrr........rrr.",
        E,
    ],
    heart: [
        E,
        m("..rrr..."),
        m(".rsssr.."),
        // The shine sits on the left lobe only.
        "rsccssr..rsssssr",
        "rscssssrrssssssr",
        m("rsssssss"),
        m("rsssssss"),
        m(".rssssss"),
        m("..rsssss"),
        m("...rssss"),
        m("....rsss"),
        m(".....rss"),
        m("......rs"),
        m(".......r"),
        E,
        E,
    ],
    controller: [
        E,
        E,
        E,
        "..rrrrrrrrrrrr..",
        ".rccccccccccccr.",
        "rcccrcccccccsccr",
        "rcrrrrrccccscscr",
        "rcccrcccccccsccr",
        ".rccccccccccccr.",
        "rcccr......rcccr",
        "rccr........rccr",
        ".rr..........rr.",
        E,
        E,
        E,
        E,
    ],
    cartridge: [
        E,
        "..cccccccccccc..",
        "..crrrrrrrrrrc..",
        "..crccccccccrc..",
        "..crcrrrrrrcrc..",
        "..crccccccccrc..",
        "..crcrrrrcccrc..",
        "..crccccccccrc..",
        "..crrrrrrrrrrc..",
        "..crrrrrrrrrrc..",
        "..crrrrrrrrrrc..",
        "..cccccccccccc..",
        "...c.c.c.c.c.c..",
        E,
        E,
        E,
    ],
    coin: [
        E,
        m(".....rrr"),
        m("...rrccc"),
        m("..rccccc"),
        m(".rcccccr"),
        m(".rcccccr"),
        m("rccccccr"),
        m("rccccccr"),
        m("rccccccr"),
        m("rccccccr"),
        m(".rcccccr"),
        m(".rcccccr"),
        m("..rccccc"),
        m("...rrccc"),
        m(".....rrr"),
        E,
    ],
    bolt: [
        E,
        ".........ssss...",
        "........ssss....",
        ".......ssss.....",
        "......ssss......",
        ".....ssss.......",
        "....sssssssss...",
        ".......ssss.....",
        "......ssss......",
        ".....ssss.......",
        "....ssss........",
        "...sss..........",
        "..ss............",
        E,
        E,
        E,
    ],
};

const INK: Record<string, string> = { c: "#F2EADB", r: "#AD0013", s: "#E5323A" };

/** Draw one sprite into a pixel canvas with its top-left at (x, y), one sprite pixel per canvas pixel. */
export function drawSprite(ctx: CanvasRenderingContext2D, k: number, x: number, y: number) {
    const rows = SPRITES[SYMBOLS[k]];
    for (let j = 0; j < 16; j++) {
        const row = (rows[j] ?? E).padEnd(16, ".");
        for (let i = 0; i < 16; i++) {
            const color = INK[row[i]];
            if (!color) continue;
            ctx.fillStyle = color;
            ctx.fillRect(x + i, y + j, 1, 1);
        }
    }
}
