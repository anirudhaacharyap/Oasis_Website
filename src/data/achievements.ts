import type { Achievement } from "./types";

/**
 * TODO(content): replace with real results, newest first.
 * Add a `proofUrl` (bracket, certificate, post) wherever possible.
 */
export const achievements: Achievement[] = [
    {
        title: "Valorant team podium finish",
        placement: "Placement",
        event: "Tournament name",
        year: 2026,
        description: "Sample entry: describe the result, the roster and what it took.",
        sample: true,
    },
    {
        title: "Game jam award",
        placement: "Award",
        event: "Game jam name",
        year: 2026,
        description: "Sample entry: name the game, the team and the award category.",
        sample: true,
    },
    {
        title: "Published student game",
        placement: "Release",
        event: "itch.io / Play Store",
        year: 2025,
        description: "Sample entry: link the game page as the proof URL.",
        sample: true,
    },
];

export function achievementsByYear() {
    const groups = new Map<number, Achievement[]>();
    for (const a of achievements) {
        groups.set(a.year, [...(groups.get(a.year) ?? []), a]);
    }
    return [...groups.entries()].sort((a, b) => b[0] - a[0]);
}
