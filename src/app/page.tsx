import Hero from "@/components/hero/Hero";
import About from "@/components/levels/About";
import History from "@/components/levels/History";
import Projects from "@/components/levels/Projects";
import Members from "@/components/levels/Members";
import Finale, { SiteFooter } from "@/components/levels/Finale";

// Upcoming vs past events are computed from today's date: rebuild daily.
export const revalidate = 86400;

export default function Home() {
    return (
        <>
            <main id="main" tabIndex={-1}>
                <Hero />
                <About />
                <History />
                <Projects />
                <Members />
                <Finale />
            </main>
            <SiteFooter />
        </>
    );
}
