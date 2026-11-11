/**
 * Shared content types.
 *
 * Every list item can carry `sample: true`. Sample entries render with a visible
 * "SAMPLE" badge so placeholder content can never be mistaken for real club data.
 * Delete the sample entries (or flip the flag) once real data is in.
 */

export type Accent = "purple" | "pink" | "mint" | "yellow" | "lavender";

export interface Sampleable {
    sample?: boolean;
}

export interface ClubEvent extends Sampleable {
    slug: string;
    title: string;
    /** ISO date, e.g. "2026-02-14". Upcoming vs past is derived from this. */
    date: string;
    /** Optional end date for multi-day events. */
    endDate?: string;
    type: "Tournament" | "Game Jam" | "Workshop" | "Social" | "Talk";
    location: string;
    description: string;
    /** Registration link (shown for upcoming events). */
    registerUrl?: string;
    /** Results / recap / photos link (shown for past events). */
    recapUrl?: string;
    /** Path under /public, e.g. "/events/valorant-cup.jpg". */
    image?: string;
}

export interface Achievement extends Sampleable {
    title: string;
    /** e.g. "1st place", "Finalist", "Best Art" */
    placement: string;
    event: string;
    year: number;
    description: string;
    /** Link to proof: bracket, certificate, post, article. */
    proofUrl?: string;
    image?: string;
}

export interface TeamMember extends Sampleable {
    name: string;
    role: string;
    /** Path under /public, e.g. "/team/jane.jpg". Falls back to pixel initials. */
    photo?: string;
    accent?: Accent;
    links?: { label: string; url: string }[];
}

export interface Partner extends Sampleable {
    name: string;
    tier: string;
    /** Path under /public, e.g. "/partners/acme.svg". Falls back to initials. */
    logo?: string;
    url?: string;
}

export interface GalleryPhoto extends Sampleable {
    /** Path under /public, e.g. "/gallery/lan-2025-01.jpg". */
    src?: string;
    alt: string;
    caption: string;
    album: string;
    /** Intrinsic size of the photo, used for layout. */
    width?: number;
    height?: number;
}

export interface Stat extends Sampleable {
    value: number;
    suffix?: string;
    label: string;
    icon: "target" | "people" | "joystick" | "bolt" | "trophy" | "book";
    accent: Accent;
}
