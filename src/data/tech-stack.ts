export interface TechCategory {
  name: string;
  short?: string;
  items: string[];
}

export const TECH_STACK_DATA: TechCategory[] = [
  {
    name: "Frontend",
    short: "Frontend",
    items: ["Tailwind CSS", "React", "Gatsby", "Svelte", "Astro", "Next.js", "ShadcnUI"],
  },
  {
    name: "Backend",
    short: "Backend",
    items: ["Golang", "NestJS", "Laravel", ".NET"],
  },
  {
    name: "Infrastructure & DevOps",
    short: "Infra & DevOps",
    items: ["Docker", "Kubernetes", "AWS", "Google Cloud", "Jenkins", "On Premise Server", "Proxmox", "MikroTik"],
  },
  {
    name: "Database & Tools",
    short: "Database & Tools",
    items: ["PostgreSQL", "MongoDB", "Redis", "MinIO"],
  },
];
