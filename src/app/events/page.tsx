import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import EventCard from "@/components/content/EventCard";
import { pastEvents, upcomingEvents } from "@/data/events";

export const revalidate = 86400;

export const metadata: Metadata = {
    title: "Events",
    description: "Upcoming and past tournaments, game jams, workshops and LAN nights from OASIS at NMIT.",
};

export default function EventsPage() {
    const upcoming = upcomingEvents();
    const past = pastEvents();

    return (
        <main id="main" tabIndex={-1}>
            <PageHeader
                eyebrow="Events"
                title="This semester"
                intro="Tournaments, game jams, workshops and LAN nights. Sample entries stay marked until the club replaces them."
            />
            <div className="mx-auto max-w-6xl px-6 py-16">
                <section aria-labelledby="upcoming-heading">
                    <h2 id="upcoming-heading" className="font-pixel text-sm text-ink">
                        Upcoming
                    </h2>
                    {upcoming.length === 0 ? (
                        <p className="mt-6 text-ink-soft">Nothing is scheduled yet.</p>
                    ) : (
                        <ul className="mt-6 grid gap-5 md:grid-cols-2">
                            {upcoming.map((event) => (
                                <li key={event.slug}>
                                    <EventCard event={event} />
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="mt-16" aria-labelledby="past-heading">
                    <h2 id="past-heading" className="font-pixel text-sm text-ink">
                        Past
                    </h2>
                    {past.length === 0 ? (
                        <p className="mt-6 text-ink-soft">No past events have been added yet.</p>
                    ) : (
                        <ul className="mt-6 grid gap-5 md:grid-cols-2">
                            {past.map((event) => (
                                <li key={event.slug}>
                                    <EventCard event={event} />
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
}
