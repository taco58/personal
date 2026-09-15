import { personal, projects, experiences, links } from "@/data/portfolio";
import { FishingGame } from "@/components/FishingGame";
import { VancouverTime, ThemeToggle, CopyEmailButton } from "@/components/InteractiveWidgets";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a] text-[#111111] dark:text-[#ededed] px-6 py-20 sm:py-28 md:py-36 transition-colors duration-200">
      <div className="max-w-[460px] mx-auto space-y-12 sm:space-y-14">
        <header className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <h1 className="text-xl sm:text-[22px] font-medium tracking-tight text-neutral-900 dark:text-white">
              {personal.name}
            </h1>
            <ThemeToggle />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 text-sm text-neutral-500 dark:text-neutral-400">
            <p>{personal.headline}</p>
            <VancouverTime />
          </div>
        </header>

        <section>
          <p className="text-sm sm:text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
            {personal.intro}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-neutral-900 dark:text-white">Projects</h2>
          <ul className="space-y-3.5 text-sm sm:text-[15px]">
            {projects.map((project) => (
              <li key={project.name} className="space-y-0.5">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  <span className="underline decoration-neutral-300 dark:decoration-neutral-700 underline-offset-4 group-hover:decoration-neutral-900 dark:group-hover:decoration-white transition-colors">
                    {project.name}
                  </span>
                  <span className="ml-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white select-none">
                    &rarr;
                  </span>
                </a>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 font-normal">
                  {project.tech}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-neutral-900 dark:text-white">Experience</h2>
          <ul className="space-y-2 text-sm sm:text-[15px] text-neutral-800 dark:text-neutral-200">
            {experiences.map((exp) => (
              <li key={exp.name} className="flex items-baseline justify-between gap-4">
                <span>{exp.name}</span>
                {exp.timeline && (
                  <span className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500 shrink-0 font-normal">
                    {exp.timeline}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <FishingGame />
        </section>

        <section className="space-y-3 pt-2">
          <h2 className="text-sm font-medium text-neutral-900 dark:text-white">Links</h2>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm sm:text-[15px] text-neutral-800 dark:text-neutral-200">
            {links.filter((l) => l.name !== "Email").map((link) => (
              <span key={link.name} className="inline-flex items-center gap-3">
                <a
                  href={link.url}
                  target={link.url.startsWith("http") || link.url.endsWith(".pdf") ? "_blank" : undefined}
                  rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="underline decoration-neutral-300 dark:decoration-neutral-700 underline-offset-4 hover:decoration-neutral-900 dark:hover:decoration-white hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  {link.name}
                </a>
                <span className="text-neutral-300 dark:text-neutral-700 select-none">·</span>
              </span>
            ))}
            <CopyEmailButton email={personal.email} />
          </div>
        </section>
      </div>
    </main>
  );
}
