/**
 * Content contract for the OASIS landing page.
 *
 * Everything the page shows comes from files in src/data. Entries marked `mock: true` are
 * placeholder content written for layout and review. Replace them with real data and delete
 * the flag; the footer's "preview content" note disappears once no mock entries remain.
 */

export interface Mockable {
    mock?: boolean;
}

/** One slide of the hero carousel ("what we do"), driven by the 3D controller. */
export interface Mode extends Mockable {
    id: string;
    /** Giant word on the slide. Keep it to one word, 10 characters max. */
    word: string;
    /** One sentence, under 110 characters. */
    line: string;
    /** 2 to 4 concrete things that happen under this mode. */
    items: string[];
    /** Which controller face button lights up for this mode. */
    button: "A" | "B" | "X" | "Y";
}

export interface ClubEvent extends Mockable {
    slug: string;
    title: string;
    /** ISO date "YYYY-MM-DD". Upcoming vs past is derived from this. */
    date: string;
    endDate?: string;
    kind: "Tournament" | "Game jam" | "Workshop" | "LAN night" | "Talk" | "Showcase";
    venue: string;
    /** One or two sentences. */
    summary: string;
    /** Optional outcome line, e.g. "64 players, 16 teams". Only true numbers once real. */
    outcome?: string;
    /** Path under /public. */
    image?: string;
    url?: string;
}

export interface Project extends Mockable {
    slug: string;
    title: string;
    kind: "Game" | "Tool" | "Mod" | "Jam entry" | "Esports";
    engine: string;
    year: number;
    /** Handles of members who made it. */
    team: string[];
    /** One sentence, under 140 characters. */
    pitch: string;
    /** Path under /public. Without one, a generated cover is drawn from `cover`. */
    image?: string;
    /** Seed for the generated cover: a pattern and a hue pair from the palette. */
    cover: { pattern: "stripes" | "grid" | "rings" | "steps" | "dots" | "wave"; tone: "gold" | "bone" | "deep" };
    url?: string;
}

export interface Member extends Mockable {
    handle: string;
    name: string;
    role: string;
    /** Core committee, lead, or member. */
    tier: "Core" | "Lead" | "Member";
    /** What they play or build, e.g. "Valorant IGL" or "Godot, shaders". */
    main: string;
    /** e.g. "CSE, 3rd year". */
    detail: string;
    /** Path under /public. Without one, a monogram tile is drawn. */
    photo?: string;
    links?: { label: string; url: string }[];
}
