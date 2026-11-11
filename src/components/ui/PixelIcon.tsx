/**
 * Original pixel-art icons drawn from character grids.
 * Each character maps to a colour role: "#" = main colour, "o" = dark outline,
 * "w" = white highlight, "." = transparent.
 */

const GRIDS = {
    gamepad: [
        "................",
        "................",
        "................",
        "..oooooooooooo..",
        ".o############o.",
        "o##w#######w###o",
        "o#www#####w#w##o",
        "o##w#######w###o",
        "o##############o",
        "o#####oooo#####o",
        ".o###o....o###o.",
        "..ooo......ooo..",
    ],
    trophy: [
        "..oooooooooooo..",
        "oo#ww#######w#oo",
        "o#ow########o#o.",
        "o#o#########o#o.",
        ".oo#########oo..",
        "...o#######o....",
        "....o#####o.....",
        ".....oo#oo......",
        "......o#o.......",
        ".....o###o......",
        "....o#####o.....",
        "....ooooooo.....",
    ],
    globe: [
        "....oooooo......",
        "..oo##w###oo....",
        ".o##ww######o...",
        ".o#w##o#o###o...",
        "o#####o#o####o..",
        "oooooooooooooo..",
        "o#####o#o####o..",
        ".o####o#o###o...",
        ".o##########o...",
        "..oo######oo....",
        "....oooooo......",
        "................",
    ],
    book: [
        "..ooooooooooo...",
        ".o#w########o...",
        ".o#wwwww####o...",
        ".o#w########o...",
        ".o#wwww#####o...",
        ".o#w########o...",
        ".o#wwwwww###o...",
        ".o#w########o...",
        ".o#oooooooooo...",
        ".o#wwwwwwwwwo...",
        "..oooooooooo....",
        "................",
    ],
    target: [
        "....oooooo......",
        "..oo######oo....",
        ".o##wwwwww##o...",
        ".o#ww####ww#o...",
        "o##w##oo##w##o..",
        "o##w#oooo#w##o..",
        "o##w##oo##w##o..",
        ".o#ww####ww#o...",
        ".o##wwwwww##o...",
        "..oo######oo....",
        "....oooooo......",
        "................",
    ],
    people: [
        "...ooo....ooo...",
        "..o###o..o###o..",
        "..o#w#o..o#w#o..",
        "..o###o..o###o..",
        "...ooo....ooo...",
        "..ooooo..ooooo..",
        ".o#####oo#####o.",
        "o##w####o#w####o",
        "o#######o######o",
        "o#######o######o",
        "oooooooooooooooo",
        "................",
    ],
    joystick: [
        "......ooo.......",
        ".....o#w#o......",
        ".....o###o......",
        "......ooo.......",
        ".......o........",
        ".......o........",
        "...oooooooooo...",
        "..o##w#######o..",
        ".o############o.",
        ".o##oo####oo##o.",
        ".oooooooooooooo.",
        "................",
    ],
    bolt: [
        "........oooo....",
        ".......o##o.....",
        "......o#w#o.....",
        ".....o#w#o......",
        "....o#w#oooo....",
        "...o#######o....",
        "...oooo#w#o.....",
        "......o#w#o.....",
        ".....o#w#o......",
        "....o##oo.......",
        "....ooo.........",
        "................",
    ],
} as const;

export type PixelIconName = keyof typeof GRIDS;

export default function PixelIcon({
    name,
    color,
    outline = "#2F5D8C",
    size = 40,
    className,
}: {
    name: PixelIconName;
    color: string;
    outline?: string;
    size?: number;
    className?: string;
}) {
    const grid = GRIDS[name];
    const w = grid[0].length;
    const h = grid.length;
    const rects: React.ReactNode[] = [];
    grid.forEach((row, y) => {
        for (let x = 0; x < row.length; x++) {
            const c = row[x];
            if (c === ".") continue;
            const fill = c === "o" ? outline : c === "w" ? "#FFFFFF" : color;
            rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />);
        }
    });
    return (
        <svg
            width={size}
            height={(size * h) / w}
            viewBox={`0 0 ${w} ${h}`}
            shapeRendering="crispEdges"
            aria-hidden="true"
            className={className}
        >
            {rects}
        </svg>
    );
}
