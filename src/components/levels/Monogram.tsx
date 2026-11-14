import Image from "next/image";
import type { Member } from "@/data/types";
import styles from "./Members.module.css";

const TONE: Record<Member["tier"], { bg: string; fg: string }> = {
    Core: { bg: "var(--gold)", fg: "var(--deep)" },
    Lead: { bg: "var(--ground)", fg: "var(--ink)" },
    Member: { bg: "var(--deep)", fg: "var(--gold)" },
};

function initials(name: string) {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : (parts[0]?.[1] ?? "");
    return (first + last).toUpperCase();
}

/** Square player tile: tier colour with initials, or a photo, with a pixel-step notch bottom right. */
export default function Monogram({ member, sizes }: { member: Member; sizes: string }) {
    const tone = TONE[member.tier];
    return (
        <span className={styles.mono} style={{ background: tone.bg }} aria-hidden="true">
            {member.photo ? (
                <Image src={member.photo} alt="" fill sizes={sizes} className={styles.monoPhoto} />
            ) : null}
            <svg viewBox="0 0 100 100" className={styles.monoSvg} focusable="false">
                {!member.photo && (
                    <text
                        x="50"
                        y="53"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontFamily="var(--font-display)"
                        fontWeight="800"
                        fontSize="34"
                        letterSpacing="-1.5"
                        style={{ fill: tone.fg }}
                    >
                        {initials(member.name)}
                    </text>
                )}
                <g style={{ fill: "var(--void)" }} shapeRendering="crispEdges">
                    <rect x="92" y="84" width="8" height="16" />
                    <rect x="84" y="92" width="8" height="8" />
                    <rect x="92" y="76" width="8" height="8" />
                </g>
            </svg>
        </span>
    );
}
