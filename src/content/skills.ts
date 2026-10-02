export type SkillGroup = { title: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  {
    title: "Backend",
    items: ["Laravel (v5–13)", "Node.js", "Express.js", "NestJS", "REST API design", "OAuth2", "JWT"],
  },
  {
    title: "Frontend",
    items: ["React.js", "Vue.js", "Inertia.js", "Livewire", "Alpine.js", "TypeScript", "JavaScript", "Tailwind CSS"],
  },
  {
    title: "Mobile",
    items: ["Flutter", "Dart"],
  },
  {
    title: "AI engineering",
    items: [
      "AI agents",
      "Agentic workflows",
      "LLM integration (Claude, GPT)",
      "Prompt engineering",
      "AI-assisted development (Claude Code, Cursor, Copilot)",
    ],
  },
  {
    title: "Databases & real-time",
    items: ["MySQL (query optimisation)", "MongoDB", "Redis", "WebSockets", "Socket.IO"],
  },
  {
    title: "DevOps",
    items: ["AWS (EC2, S3, RDS)", "Docker", "Git", "CI/CD pipelines"],
  },
];
