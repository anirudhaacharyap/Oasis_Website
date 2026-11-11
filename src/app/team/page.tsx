import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import PixelAvatar from "@/components/ui/PixelAvatar";
import SampleBadge from "@/components/ui/SampleBadge";
import { coreTeam, facultyCoordinators } from "@/data/team";
import type { TeamMember } from "@/data/types";
import { isPlaceholderUrl } from "@/lib/content";

export const metadata: Metadata = {
    title: "Team",
    description: "The faculty coordinator and core committee of OASIS, the esports and game development club of NMIT.",
};

function MemberCard({ member }: { member: TeamMember }) {
    const links = (member.links ?? []).filter((link) => !isPlaceholderUrl(link.url));
    return (
        <li className="pixel-card flex items-center gap-4 p-5">
            <PixelAvatar name={member.name} photo={member.photo} accent={member.accent} size={76} />
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="font-pixel text-[11px] leading-relaxed text-ink">{member.name}</p>
                    <SampleBadge show={member.sample} />
                </div>
                <p className="mt-2 text-ink-soft">{member.role}</p>
                {links.length > 0 && (
                    <ul className="mt-2 flex flex-wrap gap-3">
                        {links.map((link) => (
                            <li key={link.url}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-ink underline underline-offset-4">
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </li>
    );
}

export default function TeamPage() {
    return (
        <main id="main" tabIndex={-1}>
            <PageHeader
                eyebrow="Team"
                title="Who keeps the club running"
                intro="The faculty coordinator and the core committee. Names and photos here are placeholders until the real roster is added."
            />
            <div className="mx-auto max-w-6xl px-6 py-16">
                <section aria-labelledby="faculty-heading">
                    <h2 id="faculty-heading" className="font-pixel text-sm text-ink">
                        Faculty
                    </h2>
                    <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                        {facultyCoordinators.map((member) => (
                            <MemberCard key={`${member.role}-${member.name}`} member={member} />
                        ))}
                    </ul>
                </section>
                <section className="mt-16" aria-labelledby="core-heading">
                    <h2 id="core-heading" className="font-pixel text-sm text-ink">
                        Core committee
                    </h2>
                    <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {coreTeam.map((member) => (
                            <MemberCard key={`${member.role}-${member.name}`} member={member} />
                        ))}
                    </ul>
                </section>
            </div>
        </main>
    );
}
