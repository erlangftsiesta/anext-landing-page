## Tech Stack & Architecture

- **Framework**: [Astro 5](https://astro.build/) (Static Site Generation / Jamstack)
- **UI & Islands**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations & Physics**: Native HTML5 Canvas 2D, requestAnimationFrame throttled loops, [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **SEO & Metadata**: JSON-LD Structured Data (`Corporation`), Open Graph, Twitter Cards, Semantic HTML5
- **Islands Architecture**: Fully static HTML/CSS delivery with client-side React hydration only where needed (`client:visible`, `client:load`).
- **Energy-Efficient Render Loop**: Animation canvas and scroll lerp loops sleep automatically when idle or outside the viewport via `IntersectionObserver`.
- **Zero-Dependency Media**: Modern WebP assets with responsive dimensions and lossless compression.

---

---

## Project Structure

```text
anext-landing-page/
├── public/                 # Static assets (favicons, logos, optimized webp)
├── src/
│   ├── components/         # Reusable Astro & React island components
│   │   ├── Header.astro    # Navigation header
│   │   ├── TechStack.astro # Interactive tech stack section
│   │   └── ...
│   ├── data/               # Centralized data stores (menu.ts, projects.ts, tech-stack.ts)
│   ├── layouts/            # Global HTML shell & SEO metadata (MainLayout.astro)
│   ├── pages/              # Static page routes
│   │   ├── index.astro     # Main landing page
│   │   ├── teams.astro     # Leadership & engineering team showcase
│   │   └── projects.astro  # Interactive 3D WorksWheel projects showcase
│   └── styles/             # Global CSS and Tailwind directives
├── astro.config.mjs        # Astro configuration & integrations
└── tsconfig.json           # TypeScript configuration
```

---

## Getting Started

### Prerequisites
- **Node.js**: v20+ (tested on Node v24 LTS)
- **Package Manager**: npm

### Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/arhylsion/anext-landing-page.git
cd anext-landing-page
npm install
```

### Development
Start the local development server with hot-module replacement (HMR):
```bash
npm run dev
```
Navigate to `http://localhost:4321`.

### Production Build & Preview
Generate the production-ready static output into `./dist/`:
```bash
npm run build
```

Preview the static production build locally:
```bash
npm run preview
```

### Type Checking & Diagnostics
Run full Astro and TypeScript diagnostic validation:
```bash
npm run check
```
Or TypeScript check only:
```bash
npm run typecheck
```




