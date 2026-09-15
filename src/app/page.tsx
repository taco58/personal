import { personal, projects, experiences, links } from "@/data/portfolio";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#111111] px-6 py-20 sm:py-28 md:py-36">
      <div className="max-w-[460px] mx-auto space-y-12 sm:space-y-14">
        <header className="space-y-1">
          <h1 className="text-xl sm:text-[22px] font-medium tracking-tight text-neutral-900">
            {personal.name}
          </h1>
          <p className="text-sm text-neutral-500">
            {personal.headline}
          </p>
        </header>

        <section>
          <p className="text-sm sm:text-[15px] leading-relaxed text-neutral-700">
            {personal.intro}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-neutral-900">Projects</h2>
          <ul className="space-y-2 text-sm sm:text-[15px]">
            {projects.map((project) => (
              <li key={project.name}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center text-neutral-800 hover:text-neutral-950 transition-colors"
                >
                  <span className="underline decoration-neutral-300 underline-offset-4 group-hover:decoration-neutral-900 transition-colors">
                    {project.name}
                  </span>
                  <span className="ml-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 text-neutral-400 group-hover:text-neutral-900 select-none">
                    &rarr;
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-neutral-900">Experience</h2>
          <ul className="space-y-2 text-sm sm:text-[15px] text-neutral-800">
            {experiences.map((exp) => (
              <li key={exp.name} className="flex items-baseline justify-between gap-4">
                <span>{exp.name}</span>
                {exp.timeline && (
                  <span className="text-xs sm:text-sm text-neutral-400 shrink-0 font-normal">
                    {exp.timeline}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3 pt-2">
          <h2 className="text-sm font-medium text-neutral-900">Links</h2>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm sm:text-[15px] text-neutral-800">
            {links.map((link, idx) => (
              <span key={link.name} className="inline-flex items-center gap-3">
                <a
                  href={link.url}
                  target={link.url.startsWith("http") || link.url.endsWith(".pdf") ? "_blank" : undefined}
                  rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900 hover:text-neutral-950 transition-colors"
                >
                  {link.name}
                </a>
                {idx < links.length - 1 && (
                  <span className="text-neutral-300 select-none">·</span>
                )}
              </span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
