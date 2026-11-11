/** Header band shared by every sub-page. */
export default function PageHeader({
    eyebrow,
    title,
    intro,
}: {
    eyebrow: string;
    title: string;
    intro: string;
}) {
    return (
        <header
            className="relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-20"
            style={{ background: "linear-gradient(180deg, #D9EEFB 0%, #EAF6FF 70%, #F9FCFF 100%)" }}
        >
            {/* Decorative clouds */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <svg className="absolute top-24 left-[6%] w-40 opacity-70" viewBox="0 0 200 80">
                    <ellipse cx="70" cy="50" rx="70" ry="30" fill="white" />
                    <ellipse cx="120" cy="40" rx="50" ry="25" fill="white" />
                </svg>
                <svg className="absolute top-32 right-[8%] w-56 opacity-60" viewBox="0 0 200 80">
                    <ellipse cx="80" cy="50" rx="80" ry="30" fill="white" />
                    <ellipse cx="140" cy="42" rx="50" ry="22" fill="white" />
                </svg>
                <div
                    className="absolute bottom-0 left-0 right-0 h-2"
                    style={{ background: "linear-gradient(90deg, #F6B6C8, #C9C3F5, #9FA8FF, #9EE6CF, #FFF1A8)" }}
                />
            </div>

            <div className="relative mx-auto max-w-6xl px-6 text-center">
                <p className="eyebrow mb-5">{eyebrow}</p>
                <h1 className="section-title mx-auto max-w-4xl text-balance text-3xl sm:text-4xl md:text-5xl">{title}</h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-soft">{intro}</p>
            </div>
        </header>
    );
}
