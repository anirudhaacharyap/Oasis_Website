// Mock content: replace with real club data. See src/data/types.ts.
export const site = {
    name: "OASIS",
    tagline: "Esports and game dev club",
    college: "NMIT",
    city: "Bengaluru",
    description:
        "OASIS is the esports and game development club at NMIT, Bengaluru. Join for tournaments, game jams, workshops and LAN nights.",
    manifesto:
        "We are the people who play too much and build a little more. Some of us grind ranked, some of us ship tiny games at 3 a.m., and most of us do both. Come as you are, leave with a team.",
    facts: [
        { label: "Founded", value: "2019", mock: true as const },
        { label: "Disciplines", value: "Esports, game dev", mock: true as const },
        { label: "Meets", value: "Fridays, 5 pm", mock: true as const },
    ],
    links: {
        join: "https://example.com/oasis-join",
        discord: "https://example.com/oasis-discord",
        email: "oasis@example.com",
    },
    socials: [
        { label: "Instagram", url: "https://example.com/instagram" },
        { label: "Discord", url: "https://example.com/oasis-discord" },
        { label: "YouTube", url: "https://example.com/youtube" },
    ],
};
