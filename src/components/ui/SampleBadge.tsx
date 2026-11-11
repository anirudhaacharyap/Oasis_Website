/** Marks placeholder content so it is never mistaken for real club data. */
export default function SampleBadge({ show = true, className = "" }: { show?: boolean; className?: string }) {
    if (!show) return null;
    return (
        <span
            className={`inline-block font-pixel text-[8px] tracking-widest px-1.5 py-1 rounded border border-dashed border-ink-pink text-ink-pink bg-white ${className}`}
            title="Placeholder content: replace in src/data"
        >
            SAMPLE
        </span>
    );
}
