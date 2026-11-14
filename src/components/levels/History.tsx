import { pastEvents, upcomingEvents } from "@/data/events";
import { formatEventDate, isPlaceholderUrl } from "@/lib/content";
import type { ClubEvent } from "@/data/types";
import HistoryScroll from "./HistoryScroll";
import styles from "./History.module.css";

const yearOf = (event: ClubEvent) => event.date.slice(0, 4);

export default function History() {
    const past = pastEvents();
    const upcoming = upcomingEvents();
    const earliestYear = past.length ? yearOf(past[past.length - 1]) : null;
    const years = past.map(yearOf);

    return (
        <section id="history" className={`level tone-deep ${styles.section}`} aria-labelledby="history-title">
            <div className="wrap">
                <header className={styles.head} data-reveal>
                    <p className="hud">Level 2</p>
                    <h2 id="history-title" className="display t-xl">
                        Save files
                    </h2>
                    <p className="lede">Every event the club has run, newest first.</p>
                    {past.length > 0 && earliestYear && (
                        <p className={`hud ${styles.fact}`}>
                            {past.length} {past.length === 1 ? "event" : "events"} since {earliestYear}
                        </p>
                    )}
                </header>

                {upcoming.length > 0 && (
                    <div className={styles.next}>
                        <h3 className={`display ${styles.nextTitle}`}>Next up</h3>
                        <ul className={styles.cards}>
                            {upcoming.map((event) => {
                                const real = !isPlaceholderUrl(event.url);
                                return (
                                    <li key={event.slug} className={styles.card} data-reveal>
                                        <span className={`hud ${styles.pill}`}>Upcoming</span>
                                        <p className={`hud ${styles.cardDate}`}>
                                            <time dateTime={event.date}>{formatEventDate(event.date, event.endDate)}</time>
                                        </p>
                                        <h4 className={`display ${styles.cardTitle}`}>
                                            {real ? (
                                                <a href={event.url} className={styles.cardLink}>
                                                    {event.title}
                                                </a>
                                            ) : (
                                                event.title
                                            )}
                                        </h4>
                                        <p className={`hud ${styles.cardMeta}`}>
                                            {event.kind} / {event.venue}
                                        </p>
                                        <p className={styles.summary}>{event.summary}</p>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                {past.length > 0 && (
                    <HistoryScroll years={years}>
                        <div className={styles.timeline}>
                            <div className={styles.rail} aria-hidden="true">
                                <div className={styles.railInner}>
                                    <div className={styles.yearMask}>
                                        <span className={`display ${styles.year}`} data-year>
                                            {years[0]}
                                        </span>
                                    </div>
                                    <p className={`hud ${styles.slot}`}>
                                        Slot <span data-slot>1</span> of {past.length}
                                    </p>
                                </div>
                            </div>

                            <div className={styles.listWrap} data-list>
                                <svg
                                    className={styles.arc}
                                    viewBox="0 0 40 1000"
                                    preserveAspectRatio="none"
                                    aria-hidden="true"
                                    focusable="false"
                                >
                                    <path className={styles.track} d="M20 0 C 34 160 34 320 20 500 S 6 840 20 1000" />
                                    <path className={styles.drawn} d="M20 0 C 34 160 34 320 20 500 S 6 840 20 1000" data-arc />
                                </svg>
                                <svg className={styles.star} viewBox="0 0 24 24" aria-hidden="true" focusable="false" data-star>
                                    <path d="M12 1.5l3.1 6.9 7.4.8-5.5 5 1.6 7.4L12 17.8 5.4 21.6 7 14.2 1.5 9.2l7.4-.8z" />
                                </svg>

                                <ol className={styles.list}>
                                    {past.map((event, index) => {
                                        const real = !isPlaceholderUrl(event.url);
                                        return (
                                            <li key={event.slug} className={styles.item} data-reveal data-item data-index={index}>
                                                <span className={styles.dot} aria-hidden="true" />
                                                <p className={`hud ${styles.itemYear}`}>{yearOf(event)}</p>
                                                <p className={`hud ${styles.itemMeta}`}>
                                                    <time dateTime={event.date}>{formatEventDate(event.date, event.endDate)}</time>
                                                    <span className={styles.kind}>{event.kind}</span>
                                                </p>
                                                <h3 className={`display ${styles.itemTitle}`}>
                                                    {real ? (
                                                        <a href={event.url} className="snap-link">
                                                            {event.title}
                                                        </a>
                                                    ) : (
                                                        event.title
                                                    )}
                                                </h3>
                                                <p className={styles.venue}>{event.venue}</p>
                                                <p className={styles.summary}>{event.summary}</p>
                                                {event.outcome && <p className={styles.outcome}>{event.outcome}</p>}
                                            </li>
                                        );
                                    })}
                                </ol>
                            </div>
                        </div>
                    </HistoryScroll>
                )}
            </div>
        </section>
    );
}
