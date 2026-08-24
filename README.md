# Amanda N. Robinson — Portfolio Website

Personal portfolio site built with Next.js, showcasing my background, education, work experience, and projects.

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/) + TypeScript
- CSS Modules for styling
- [Font Awesome](https://fontawesome.com/) for icons
- Self-hosted fonts via `@fontsource` (Afacad Flux, Idiqlat, New Amsterdam)

## Getting Started

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site. Pages hot-reload as you edit files under `src/app/`.

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # run ESLint
```

No environment variables are required to run the project.

## Project Structure

```
src/app/
├── layout.tsx           # root layout: fonts, metadata, AppShell wrapper
├── app_shell.tsx         # persistent shell (nav sliders, footer, intro animation)
├── footer.tsx             # site-wide footer with nav and contact links
├── sliders.tsx            # animated orb components used on the home page/shell
├── mask_functions.tsx     # TintedVector: renders public/masks/*.svg as decorative backgrounds
├── page.tsx / home_page.tsx        # Home
├── about/ / about.tsx               # About: bio, activities & leadership, hobbies
├── education/ / education.tsx       # Education: WPI coursework, expandable course details
├── experience/ / experience.tsx     # Experience: work history
├── projects/ / projects.tsx         # Projects: Intervle, ShopComp, Heatmap (live previews)
├── resume/ / resume.tsx             # Resume: embedded PDF viewer with a download link
└── styles/                # CSS Modules, one per page/component
```

Each route is a thin `page.tsx` wrapper importing a same-named component one level up. The `@/*` path alias resolves to `src/*`.

## Pages

- **Home** — introduction and tech stack overview
- **About** — bio, activities & leadership, hobbies & interests
- **Education** — WPI coursework with interactive, expandable descriptions
- **Experience** — work history at the South Florida Proton Therapy Institute
- **Projects** — Intervle (word game), ShopComp (grocery price comparison), and Heatmap (hospital outreach heatmap), each with a live embedded preview
- **Resume** — embedded PDF viewer with a download link

## Deployment

No CI/CD or platform config is committed; the project builds with a standard `next build` and is compatible with zero-config deployment on [Vercel](https://vercel.com/).
