import { projects } from "@/data/projects";
import ProjectIndex from "./ProjectIndex";
import s from "./Projects.module.css";

/** Cartridges: an index of what members built, with a cursor-following cover preview. */
export default function Projects() {
    const count = projects.length;
    const sample = projects.some((p) => p.mock);
    return (
        <section id="projects" className={`level tone-red ${s.section}`} aria-labelledby="projects-title">
            <div className="wrap">
                <header className={s.header}>
                    <h2 id="projects-title" className={`display t-xl ${s.title}`}>
                        Cartridges
                    </h2>
                    <div className={s.aside}>
                        <p className="lede">Games, mods and tools members built and shipped.</p>
                        <p className={`label ${s.count}`}>
                            {count} {count === 1 ? "project" : "projects"}
                            {sample && <span className={`label ${s.sample}`}>Sample data</span>}
                        </p>
                    </div>
                </header>
                <ProjectIndex projects={projects} />
            </div>
        </section>
    );
}
