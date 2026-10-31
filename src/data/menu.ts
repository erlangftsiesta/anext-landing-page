export type MenuChild = {
  id: string;
  label: string;
  href: string;
  description: string;
  thumbnail?: string;
};

export type MenuItem = {
  id: string;
  label: string;
  href: string;
  children?: MenuChild[];
};

export const MENU_ITEMS: Array<MenuItem> = [
  {
    id: "services",
    label: "Services",
    href: "/#services",
  },
  {
    id: "projects",
    label: "Projects",
    href: "/projects",
  },
  {
    id: "teams",
    label: "Teams",
    href: "/teams",
  },
  {
    id: "process",
    label: "Process",
    href: "/#process",
  },
  {
    id: "about",
    label: "About",
    href: "/#about",
  },
  {
    id: "contact",
    label: "Contact",
    href: "/#contact",
  },
];
