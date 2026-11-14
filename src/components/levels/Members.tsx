import { members } from "@/data/members";
import PlayerSelect from "./PlayerSelect";
import styles from "./Members.module.css";

/** Level 4: character select. */
export default function Members() {
    return (
        <section id="members" className={`level tone-void ${styles.section}`} aria-labelledby="members-title">
            <div className="wrap">
                <header className={styles.head} data-reveal>
                    <p className="hud">Level 4</p>
                    <h2 id="members-title" className="display t-xl" style={{ color: "var(--ink)" }}>
                        Player select
                    </h2>
                    <p className="lede">The people who run the room.</p>
                    <p className={`hud ${styles.hint}`}>
                        <span className={styles.hintFine}>Arrow keys or click to pick a player</span>
                        <span className={styles.hintTouch}>Tap a player</span>
                    </p>
                </header>
                <PlayerSelect members={members} />
            </div>
        </section>
    );
}
