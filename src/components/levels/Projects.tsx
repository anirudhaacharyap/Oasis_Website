import { projects } from "@/data/projects";
import ProjectIndex from "./ProjectIndex";
import s from "./Projects.module.css";

/** Level 3: cartridges. An index of what members built, with a cursor-following cover preview. */
export default function Projects() {
    const count = projects.length;
    return (
        <section id="projects" className={`level tone-ground ${s.section}`} aria-labelledby="projects-title">
            <div className="wrap">
                <header className={s.header} data-reveal>
                    <div>
                        <p className="hud">Level 3</p>
                        <h2 id="projects-title" className={`display t-xl ${s.title}`}>
                            Cartridges
                        </h2>
                    </div>
                    <div className={s.aside}>
                        <p className="lede">Games, mods and tools members built and shipped.</p>
                        <p className="hud">
                            {count} {count === 1 ? "project" : "projects"}
                        </p>
                    </div>
                </header>
                <ProjectIndex projects={projects} />
            </div>
        </section>
    );
}
