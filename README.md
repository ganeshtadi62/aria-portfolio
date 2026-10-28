# Aria Voss — Portfolio

A sample designer/developer portfolio built with **React 18 + Vite**, deployed on **Vercel**.

## Features
- Editorial dark theme with lime accent, Fraunces / Instrument Sans / JetBrains Mono typography
- Animated hero, infinite marquee, count-up stats, scroll-reveal sections
- Filterable project grid with generative SVG artwork and a detail modal (Esc to close)
- Experience timeline, auto-rotating testimonials, floating-label contact form
- Scroll progress bar, cursor-follow glow, film-grain overlay, active-section nav
- Fully responsive with a mobile menu; honours `prefers-reduced-motion`

## Run locally
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the build
```

## Make it yours
All copy lives in [`src/data/content.js`](src/data/content.js) — edit your name, projects,
experience, skills and testimonials there. Colours are CSS variables at the top of
[`src/styles.css`](src/styles.css).

## Deploy
Import the repo in Vercel (framework preset: Vite) — `vercel.json` is already configured.
