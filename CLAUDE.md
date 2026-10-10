@AGENTS.md

# Studio Envelope: working notes

Website for Studio Envelope, an architect-led residential interior studio in Bangalore (principal: Ar. Prachi Chirania Bhalotia). Product truth is in `PRODUCT.md`, the visual system in `DESIGN.md`. Read both before UI work.

## Direction
Simple, quiet, photograph-led. **No interactive flourishes**: no preloader, cursor follower, parallax, scroll-linked text, pinned/hijacked scrolling, marquees, page-transition overlays or animation libraries (framer-motion and lenis were removed). Scroll stays native. Owner-requested exceptions, both fades only: (1) content blocks fade in/out as they scroll into and out of view (`src/components/layout/ScrollFade.tsx` + `[data-fade]` rules in `globals.css`; IntersectionObserver, no library, off for reduced motion and on /admin); (2) pages crossfade on navigation (`PageTransition` wraps each public page.tsx, using React `<ViewTransition>`/the View Transitions API, `.page-in`/`.page-out` rules in `globals.css`; header held still; browsers without support just navigate). New public pages should wrap their output in `PageTransition`. Keep it that restrained: no slides, curtains or overlays. Do not describe the studio as "luxury" in copy or SEO.

## Commands
- `npm run dev` (port 3000), `npm run build`, `npm run lint`, `npx tsc --noEmit`
- Next.js is v16 with breaking changes: check `node_modules/next/dist/docs/` before using APIs.

## Data and backend
- Public data only through `src/lib/data.ts` (`getProjects`, `getProject`): Firestore published projects, falling back to `src/lib/content/seed.ts` when unconfigured, empty or erroring. The site works with no env vars.
- Studio facts (name, contact, principal, services) live in `src/lib/content/site.ts`; service copy, process and FAQs in `src/lib/content/services.ts`. Never invent claims, awards, clients, testimonials or numbers. Renders are labelled "Visualisation".
- Admin (`/admin`): username/password sign-in (two full-admin logins, `admin` and `prachi`, defaults in `src/lib/admin/users.ts`, documented in README, override with `ADMIN_USERS`). No Google/Firebase login: `/api/admin/*` routes check a signed session cookie (`src/lib/admin/session.ts`, needs `ADMIN_SESSION_SECRET`) and then read/write Firestore through ONE private Firebase email/password account (`FIREBASE_ADMIN_EMAIL`/`FIREBASE_ADMIN_PASSWORD`, `src/lib/firebase/admin-server.ts`); `firestore.rules` trusts only that email. The browser never talks to Firestore for admin work. Every write calls `revalidateSite()`. Images upload to Vercel Blob via `/api/upload` (session-gated). Admin UI has its own dark rounded styling and is separate from the public design system.
- Contact form writes to Firestore `messages`; `firestore.rules` validates the shape.

## Code layout
`src/components/{layout,ui,home,projects,services,contact,seo,admin}` by feature; `src/lib/content` (copy and data), `src/lib/firebase` (backend access). Import with the `@/` alias. Page metadata goes through `pageMetadata()` in `src/lib/seo.ts`; structured data only states confirmed facts (no hours, prices or coordinates). Reuse `ui/Button`, `ui/PageHero`, `ui/SectionHeader`, `projects/ProjectCard` before adding new pieces. After moving or deleting files, run `npx tsc --noEmit`, `npx eslint src` and `npx next build`.

## Conventions
- Tailwind v4 tokens are in `src/app/globals.css` (`@theme`). Token name `teal` is a brown, kept for compatibility.
- Public pages: alternate `band-dark` / `band-bone`, content in `container-x`, square corners, no shadows.
- Fonts: Cormorant Garamond (display) and Jost (body) via `next/font`.

## Codebase map
A knowledge graph is in `graphify-out/` (`GRAPH_REPORT.md`, `graph.json`, `graph.html`). Prefer `graphify query "..."` for architecture questions. Project assets (client brief, logos, letterhead) are in `assets/`.

## Brand assets
Official logos are in `assets/` (originals + `Studio Envelope_Logo Docket.zip`) and trimmed web copies in `public/brand/` (`logo-on-dark`, `logo-color`, `logo-white`, `logo-29`); the portfolio PDF is `assets/Studio-Envelope-Portfolio.pdf`. `src/components/Logo.tsx` renders them. Also in `assets/`: the client website brief and letterhead (`.docx`). The principal photo and personal note are still outstanding.
