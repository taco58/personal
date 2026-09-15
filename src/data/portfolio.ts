export interface ProjectItem {
  name: string;
  url: string;
}

export interface ExperienceItem {
  name: string;
  role?: string;
  timeline?: string;
  url?: string;
}

export interface LinkItem {
  name: string;
  url: string;
}

export const personal = {
  name: "Kelvin Wu",
  headline: "Computer Science + Statistics @ UBC",
  intro:
    "I'm a student at the University of British Columbia interested in software engineering, backend systems, and building useful things.",
  email: "kelvinwu0002@gmail.com",
};

export const projects: ProjectItem[] = [
  {
    name: "Beam — Peer-to-Peer Network File Transfer CLI",
    url: "https://github.com/taco58/beam",
  },
  {
    name: "Distributed Uptime Monitoring Platform",
    url: "https://github.com/taco58/uptime",
  },
  {
    name: "Adaptive TDEE & Health Analytics Platform",
    url: "https://github.com/taco58/tdee",
  },
];

export const experiences: ExperienceItem[] = [
  {
    name: "Competitive Programming Instructor",
    role: "Private Tutor",
    timeline: "Sep 2024 – Apr 2025",
  },
];

export const links: LinkItem[] = [
  {
    name: "GitHub",
    url: "https://github.com/taco58",
  },
  // {
  //   name: "LinkedIn",
  //   url: "https://linkedin.com/in/kelvinwu",
  // },
  {
    name: "Resume",
    url: "/Kelvin_Wu_Resume.pdf",
  },
  {
    name: "Email",
    url: "mailto:kelvinwu0002@gmail.com",
  },
];
