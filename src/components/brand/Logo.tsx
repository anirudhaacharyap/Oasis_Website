import { LOGO_FILL_RULE, LOGO_PATH, LOGO_VIEWBOX } from "./logo-path";

/**
 * The OASIS wordmark. Colour follows `currentColor`, so each field can recolour it
 * (cream on ink, ink or cream on red). Pass `title` when the mark is the only label.
 */
export default function Logo({
    className,
    title = "OASIS",
    decorative = false,
}: {
    className?: string;
    title?: string;
    decorative?: boolean;
}) {
    return (
        <svg
            viewBox={LOGO_VIEWBOX}
            className={className}
            fill="currentColor"
            {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": title })}
            focusable="false"
        >
            <path d={LOGO_PATH} fillRule={LOGO_FILL_RULE} />
        </svg>
    );
}
