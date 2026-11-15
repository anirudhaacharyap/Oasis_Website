import { useId } from "react";
import Image from "next/image";
import type { Member } from "@/data/types";
import styles from "./Members.module.css";

const TONE: Record<Member["tier"], { bg: string; fg: string }> = {
    Core: { bg: "var(--c-red)", fg: "var(--c-cream)" },
    Lead: { bg: "var(--c-cream)", fg: "var(--c-ink)" },
    Member: { bg: "var(--c-ink-2)", fg: "var(--c-signal)" },
};

function initials(name: string) {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : (parts[0]?.[1] ?? "");
    return (first + last).toUpperCase();
}

/** Square player tile: tier colour with halftone and initials, or a photo, with a pixel-step notch bottom right. */
export default function Monogram({ member, sizes }: { member: Member; sizes: string }) {
    const tone = TONE[member.tier];
    const dots = `dots-${useId().replace(/:/g, "")}`;
    return (
        <span className={styles.mono} style={{ background: tone.bg }} aria-hidden="true">
            {member.photo ? (
                <Image src={member.photo} alt="" fill sizes={sizes} className={styles.monoPhoto} />
            ) : null}
            <svg viewBox="0 0 100 100" className={styles.monoSvg} focusable="false">
                {!member.photo && (
                    <>
                        <defs>
                            <pattern id={dots} width="5" height="5" patternUnits="userSpaceOnUse">
                                <circle cx="2.5" cy="2.5" r="0.85" style={{ fill: "var(--c-ink)" }} />
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill={`url(#${dots})`} opacity="0.2" />
                        <text
                            x="50"
                            y="53"
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontWeight="900"
                            fontSize="32"
                            letterSpacing="-1"
                            style={{ fill: tone.fg, fontFamily: "inherit", fontVariationSettings: '"wdth" 112' }}
                        >
                            {initials(member.name)}
                        </text>
                    </>
                )}
                <g style={{ fill: "var(--c-ink)" }} shapeRendering="crispEdges">
                    <rect x="92" y="84" width="8" height="16" />
                    <rect x="84" y="92" width="8" height="8" />
                    <rect x="92" y="76" width="8" height="8" />
                </g>
            </svg>
        </span>
    );
}
