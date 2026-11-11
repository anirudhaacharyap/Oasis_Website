import type { CSSProperties } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import PixelIcon from "@/components/ui/PixelIcon";
import { accentColors, pillars } from "@/data/site";

export default function WhatWeDo() {
    return (
        <section className="bg-sky-light py-20 md:py-28" aria-labelledby="what-heading">
            <div className="mx-auto max-w-6xl px-6">
                <p className="eyebrow">What we do</p>
                <h2 id="what-heading" className="section-title mt-4 max-w-3xl text-balance text-3xl md:text-4xl">
                    Four ways to spend the semester
                </h2>
                <Reveal className="mt-12 grid gap-5 md:grid-cols-2">
                    {pillars.map((pillar) => {
                        const colors = accentColors[pillar.accent];
                        return (
                            <article
                                key={pillar.title}
                                data-reveal
                                className="pixel-card pixel-card-hover flex flex-col p-6"
                                style={{ "--card-accent": colors.fill } as CSSProperties}
                            >
                                <PixelIcon name={pillar.icon} color={colors.fill} size={44} />
                                <h3 className="mt-5 font-pixel text-sm text-ink">{pillar.title}</h3>
                                <p className="mt-3 text-ink-soft">{pillar.description}</p>
                                <Link href={pillar.href} className="pixel-btn mt-6 self-start !px-3 !py-2.5 !text-[10px]">
                                    {pillar.cta}
                                </Link>
                            </article>
                        );
                    })}
                </Reveal>
            </div>
        </section>
    );
}
