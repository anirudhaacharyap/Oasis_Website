import type { CSSProperties } from "react";
import type { ClubEvent } from "@/data/types";
import SampleBadge from "@/components/ui/SampleBadge";
import { eventAccent, formatEventDate, isPlaceholderUrl } from "@/lib/content";

export default function EventCard({ event }: { event: ClubEvent }) {
    const register = event.registerUrl && !isPlaceholderUrl(event.registerUrl) ? event.registerUrl : null;
    const recap = event.recapUrl && !isPlaceholderUrl(event.recapUrl) ? event.recapUrl : null;

    return (
        <article
            className="pixel-card pixel-card-hover cv-auto flex h-full flex-col p-6"
            style={{ "--card-accent": eventAccent[event.type] } as CSSProperties}
        >
            <div className="flex items-start justify-between gap-3">
                <p className="eyebrow">{event.type}</p>
                <SampleBadge show={event.sample} />
            </div>
            <h3 className="mt-3 text-balance font-pixel text-sm leading-relaxed text-ink">{event.title}</h3>
            <p className="mt-3 text-ink-soft">{event.description}</p>
            <p className="mt-4 text-sm text-ink">
                <time dateTime={event.date}>{formatEventDate(event.date, event.endDate)}</time>
                <span aria-hidden="true"> · </span>
                <span className="sr-only"> at </span>
                {event.location}
            </p>
            {register && (
                <a href={register} target="_blank" rel="noopener noreferrer" className="pixel-btn mt-5 self-start">
                    REGISTER
                </a>
            )}
            {!register && recap && (
                <a href={recap} target="_blank" rel="noopener noreferrer" className="pixel-btn pixel-btn-ghost mt-5 self-start">
                    RECAP
                </a>
            )}
        </article>
    );
}
