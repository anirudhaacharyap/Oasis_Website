import Link from "next/link";
import Reveal from "@/components/Reveal";
import EventCard from "@/components/content/EventCard";
import { upcomingEvents } from "@/data/events";

export default function Events() {
    const upcoming = upcomingEvents().slice(0, 3);

    return (
        <section className="bg-cloud py-20 md:py-28" aria-labelledby="events-heading">
            <div className="mx-auto max-w-6xl px-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="eyebrow">On the calendar</p>
                        <h2 id="events-heading" className="section-title mt-4 text-3xl md:text-4xl">
                            What&apos;s next
                        </h2>
                    </div>
                    <Link href="/events" className="text-sm text-ink underline underline-offset-4">
                        All events
                    </Link>
                </div>

                {upcoming.length === 0 ? (
                    <p className="mt-10 max-w-xl text-lg text-ink-soft">
                        Nothing is scheduled yet. Past meetups live on the events page.
                    </p>
                ) : (
                    <Reveal className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {upcoming.map((event) => (
                            <div key={event.slug} data-reveal>
                                <EventCard event={event} />
                            </div>
                        ))}
                    </Reveal>
                )}
            </div>
        </section>
    );
}
