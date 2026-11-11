import type { ClubEvent } from "@/data/types";

/** Placeholder links in the sample data point at example.com. */
export function isPlaceholderUrl(url: string) {
    return url.includes("example.com");
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

export function formatEventDate(date: string, endDate?: string) {
    const fmt = new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata",
    });
    const start = fmt.format(new Date(`${date}T00:00:00+05:30`));
    if (!endDate || endDate === date) return start;
    return `${start} – ${fmt.format(new Date(`${endDate}T00:00:00+05:30`))}`;
}

export const eventAccent: Record<ClubEvent["type"], string> = {
    Tournament: "#F6B6C8",
    "Game Jam": "#9FA8FF",
    Workshop: "#9EE6CF",
    Social: "#FFF1A8",
    Talk: "#C9C3F5",
};
