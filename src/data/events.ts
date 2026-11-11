import type { ClubEvent } from "./types";
import { todayISO } from "@/lib/content";

/**
 * TODO(content): replace these sample events with real ones.
 * Upcoming vs past is computed from `date`, so just add events and keep them here.
 */
export const events: ClubEvent[] = [
    {
        slug: "sample-valorant-cup",
        title: "Inter-college Valorant Cup",
        date: "2027-02-14",
        endDate: "2027-02-15",
        type: "Tournament",
        location: "Campus esports lab",
        description: "5v5 double-elimination bracket open to all colleges. Sample entry: replace with a real event.",
        registerUrl: "https://example.com/register",
        sample: true,
    },
    {
        slug: "sample-48h-game-jam",
        title: "48-Hour Game Jam",
        date: "2027-03-07",
        endDate: "2027-03-09",
        type: "Game Jam",
        location: "Seminar hall",
        description: "Teams of up to four build a game around a theme revealed at kickoff. Sample entry.",
        registerUrl: "https://example.com/register",
        sample: true,
    },
    {
        slug: "sample-godot-workshop",
        title: "Intro to Godot Workshop",
        date: "2026-09-20",
        type: "Workshop",
        location: "Lab 3",
        description: "Beginner-friendly session: build a tiny platformer from scratch in two hours. Sample entry.",
        recapUrl: "https://example.com/recap",
        sample: true,
    },
    {
        slug: "sample-lan-night",
        title: "LAN Night",
        date: "2026-08-02",
        type: "Social",
        location: "Campus esports lab",
        description: "Casual games, snacks and a mini bracket for newcomers. Sample entry.",
        sample: true,
    },
];

export function upcomingEvents() {
    const t = todayISO();
    return events
        .filter((e) => (e.endDate ?? e.date) >= t)
        .sort((a, b) => a.date.localeCompare(b.date));
}

export function pastEvents() {
    const t = todayISO();
    return events
        .filter((e) => (e.endDate ?? e.date) < t)
        .sort((a, b) => b.date.localeCompare(a.date));
}
