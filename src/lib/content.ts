import { events } from "@/data/events";
import { members } from "@/data/members";
import { modes } from "@/data/modes";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

/** Placeholder links in the mock data point at example.com; the UI never renders them. */
export function isPlaceholderUrl(url?: string) {
    return !url || url.includes("example.com");
}

/** True while any mock entry remains. Drives the footer's "preview content" note. */
export function hasMockContent() {
    return [...events, ...members, ...modes, ...projects, ...site.facts].some((entry) => entry.mock);
}

/** Calendar date in Asia/Kolkata, as YYYY-MM-DD. */
export function todayISO() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date());
}

function dateParts(iso: string) {
    const bits = new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata",
    }).formatToParts(new Date(`${iso}T00:00:00+05:30`));
    const pick = (type: Intl.DateTimeFormatPartTypes) => bits.find((part) => part.type === type)?.value ?? "";
    return { day: pick("day"), month: pick("month"), year: pick("year") };
}

/** "14 Feb 2027", "14 to 15 Feb 2027", "30 Jan to 2 Feb 2027". */
export function formatEventDate(date: string, endDate?: string) {
    const start = dateParts(date);
    if (!endDate || endDate === date) return `${start.day} ${start.month} ${start.year}`;
    const end = dateParts(endDate);
    if (start.month === end.month && start.year === end.year) return `${start.day} to ${end.day} ${end.month} ${end.year}`;
    if (start.year === end.year) return `${start.day} ${start.month} to ${end.day} ${end.month} ${end.year}`;
    return `${start.day} ${start.month} ${start.year} to ${end.day} ${end.month} ${end.year}`;
}

/** The levels of the story, in page order. Nav, HUD and the controller's level jump read this. */
export const levels = [
    { id: "play", label: "Play", hud: "Title" },
    { id: "about", label: "About", hud: "Level 1" },
    { id: "history", label: "History", hud: "Level 2" },
    { id: "projects", label: "Projects", hud: "Level 3" },
    { id: "members", label: "Members", hud: "Level 4" },
    { id: "join", label: "Join", hud: "Finale" },
] as const;
