import type { Accent } from "./types";

/**
 * Site-wide settings and copy.
 * TODO(content): replace every value marked TODO with the club's real details.
 */
export const site = {
    name: "OASIS",
    tagline: "Esports & Game Dev Club",
    college: "NMIT",
    description:
        "OASIS is the esports and game development club of NMIT: tournaments, game jams, workshops and a community of players and makers.",

    /** TODO(content): real URLs. Placeholders point at example.com so they are obviously fake. */
    links: {
        join: "https://example.com/oasis-join-form", // TODO: Google Form / registration link
        discord: "https://example.com/oasis-discord", // TODO: Discord invite
        email: "oasis@example.com", // TODO: club email
    },

    /** TODO(content): real handles. Remove any the club doesn't use. */
    socials: [
        { label: "Instagram", url: "https://example.com/instagram" },
        { label: "Discord", url: "https://example.com/oasis-discord" },
        { label: "LinkedIn", url: "https://example.com/linkedin" },
        { label: "YouTube", url: "https://example.com/youtube" },
    ],
};

/** The four pillars shown in the "What we do" section. */
export const pillars: {
    title: string;
    description: string;
    accent: Accent;
    icon: "gamepad" | "trophy" | "globe" | "book";
    href: string;
    cta: string;
}[] = [
    {
        title: "GAME DEV",
        description: "Build games in Unity, Unreal and Godot. Learn mechanics, physics and storytelling by shipping small projects.",
        accent: "purple",
        icon: "gamepad",
        href: "/events",
        cta: "GAME JAMS",
    },
    {
        title: "ESPORTS",
        description: "Compete in Valorant, BGMI and more. Scrims, coaching and inter-college tournaments.",
        accent: "pink",
        icon: "trophy",
        href: "/achievements",
        cta: "OUR WINS",
    },
    {
        title: "COMMUNITY",
        description: "LAN nights, watch parties and a Discord where players and makers hang out.",
        accent: "mint",
        icon: "globe",
        href: "/gallery",
        cta: "GALLERY",
    },
    {
        title: "WORKSHOPS",
        description: "Hands-on sessions on game engines, level design, pixel art and streaming setups.",
        accent: "yellow",
        icon: "book",
        href: "/events",
        cta: "SCHEDULE",
    },
];

/** Tooltips revealed by the clickable blocks in the hero. Keep them true. */
export const blockFacts = [
    "Drag the characters around!",
    "Beginners welcome. No rank required.",
    "Psst... try the Konami code.",
    "Check /events for what's next.",
];

/** Accent name → CSS colours. */
export const accentColors: Record<Accent, { fill: string; ink: string }> = {
    purple: { fill: "#9FA8FF", ink: "#4F5AD0" },
    pink: { fill: "#F6B6C8", ink: "#B8476F" },
    mint: { fill: "#9EE6CF", ink: "#1F7A60" },
    yellow: { fill: "#FFF1A8", ink: "#8A6800" },
    lavender: { fill: "#C9C3F5", ink: "#6556C4" },
};
