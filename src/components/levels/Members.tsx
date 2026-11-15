import { members } from "@/data/members";
import PlayerSelect from "./PlayerSelect";
import styles from "./Members.module.css";

/** Character select. */
export default function Members() {
    return (
        <section id="members" className={`level tone-ink ${styles.section}`} aria-labelledby="members-title">
            <div className="wrap">
                <header className={styles.head}>
                    <h2 id="members-title" className="display t-xl" style={{ color: "var(--c-cream)" }}>
                        Player select
                    </h2>
                    <p className="lede">
                        The people who run the room.
                        {members.some((m) => m.mock) && <span className={`label ${styles.sample}`}>Sample data</span>}
                    </p>
                    <p className={`label ${styles.hint}`}>
                        <span className={styles.hintFine}>Arrow keys or click to pick a player</span>
                        <span className={styles.hintTouch}>Tap a player</span>
                    </p>
                </header>
                <PlayerSelect members={members} />
            </div>
        </section>
    );
}
