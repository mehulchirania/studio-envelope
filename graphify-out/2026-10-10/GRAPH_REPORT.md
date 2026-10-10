# Graph Report - .  (2026-10-10)

## Corpus Check
- Corpus is ~41,244 words - fits in a single context window. You may not need a graph.

## Summary
- 420 nodes · 690 edges · 28 communities (22 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.83)
- Token cost: 99,033 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Admin Project Form|Admin Project Form]]
- [[_COMMUNITY_Root Layout & Shell|Root Layout & Shell]]
- [[_COMMUNITY_Page Heroes & Headers|Page Heroes & Headers]]
- [[_COMMUNITY_Brand, Docs & Studio Facts|Brand, Docs & Studio Facts]]
- [[_COMMUNITY_About Page & Sitemap|About Page & Sitemap]]
- [[_COMMUNITY_Dependencies|Dependencies]]
- [[_COMMUNITY_Admin Auth & Nav|Admin Auth & Nav]]
- [[_COMMUNITY_Parallax & Datasheet|Parallax & Datasheet]]
- [[_COMMUNITY_TS Config|TS Config]]
- [[_COMMUNITY_Lightbox & Reveal Images|Lightbox & Reveal Images]]
- [[_COMMUNITY_Contact Form|Contact Form]]
- [[_COMMUNITY_Server Auth & API Routes|Server Auth & API Routes]]
- [[_COMMUNITY_Projects Index Hover|Projects Index Hover]]
- [[_COMMUNITY_Types & Categories|Types & Categories]]
- [[_COMMUNITY_Seed Projects|Seed Projects]]
- [[_COMMUNITY_Lightbox & Hero Slideshow|Lightbox & Hero Slideshow]]
- [[_COMMUNITY_Project Images & Carousel|Project Images & Carousel]]
- [[_COMMUNITY_Home Page & Hero|Home Page & Hero]]
- [[_COMMUNITY_Galleries|Galleries]]
- [[_COMMUNITY_Stats & Counters|Stats & Counters]]
- [[_COMMUNITY_ESLint|ESLint]]
- [[_COMMUNITY_Next Config|Next Config]]
- [[_COMMUNITY_PostCSS|PostCSS]]

## God Nodes (most connected - your core abstractions)
1. `getProjects()` - 20 edges
2. `Project` - 19 edges
3. `compilerOptions` - 16 edges
4. `RoomImage` - 13 edges
5. `requireDb()` - 12 edges
6. `Studio Envelope (interior design studio, Bangalore)` - 11 edges
7. `Seal()` - 9 edges
8. `getDb()` - 9 edges
9. `getFirebaseAuth()` - 9 edges
10. `site` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Projects page (name large, location, area, scope, year)` --shares_data_with--> `Shyamkutir (architecture and interior, Ballari, 6200 SFT, ongoing)`  [INFERRED]
  graphify-out/assets_docs.md → Studio Evnelope_Portfolio.pdf
- `Studio Envelope Letterhead A4` --conceptually_related_to--> `Studio Envelope brand identity`  [INFERRED]
  graphify-out/assets_docs.md → assets/StudioEnvelope Logo-28.png
- `Studio Envelope (interior design studio, Bangalore)` --references--> `Descriptor: Art. Interiors. Architecture`  [EXTRACTED]
  Studio Evnelope_Portfolio.pdf → graphify-out/assets_docs.md
- `Client website brief (Mehul_Studio Envelope website.docx)` --rationale_for--> `Studio Envelope (interior design studio, Bangalore)`  [INFERRED]
  graphify-out/assets_docs.md → Studio Evnelope_Portfolio.pdf
- `Instagram @studio__envelope` --references--> `Prachi Chirania Bhalotia (Principal Architect)`  [INFERRED]
  scripts/instagram-sources.md → Studio Evnelope_Portfolio.pdf

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Studio portfolio projects** — studio_project_james_residence, studio_project_polas_residence, studio_project_shyamkutir, studio_project_doshi_residence [INFERRED 0.85]
- **Logo variants and favicon** — assets_studioenvelope_logo_28, assets_studioenvelope_logo_29, assets_studioenvelope_logo_30, assets_studioenvelope_logo_30_37, icon_svg_favicon [INFERRED 0.85]
- **Website pages per client brief** — studio_page_home, studio_page_about, studio_page_projects, studio_page_services, studio_page_contact, studio_page_instagram [INFERRED 0.85]

## Communities (28 total, 6 thin omitted)

### Community 0 - "Admin Project Form"
Cohesion: 0.08
Nodes (28): FormSection(), ImageUploaderProps, PendingUpload, SCOPES, STATUSES, WIZARD_STEPS, Toggle(), ToggleProps (+20 more)

### Community 1 - "Root Layout & Shell"
Cohesion: 0.07
Nodes (22): cormorant, jost, metadata, NotFound(), Header(), links, HideOnAdmin(), Logo() (+14 more)

### Community 2 - "Page Heroes & Headers"
Cohesion: 0.06
Nodes (21): PageHeroProps, Seal(), SectionHeaderProps, EASE, RevealTextProps, ScrollWordsProps, NextProjectBand(), ALL_SERVICES (+13 more)

### Community 3 - "Brand, Docs & Studio Facts"
Cohesion: 0.07
Nodes (40): AGENTS.md: Next.js has breaking changes, read node_modules docs, Logo-28: full colour logo (mark + grey wordmark on white), Logo-29: amber bars only (rest white, for dark backgrounds), Logo-30: colour mark with white wordmark (dark-bg variant), Logo-30-37: all-white logo (monochrome reversed), CLAUDE.md imports AGENTS.md, src/app/icon.svg favicon, Admin panel (/admin): projects CRUD, messages inbox (+32 more)

### Community 4 - "About Page & Sitemap"
Cohesion: 0.12
Nodes (21): AboutPage(), findImage(), metadata, NOTE_PARAGRAPHS, sitemap(), ContactPage(), DETAILS, metadata (+13 more)

### Community 5 - "Dependencies"
Cohesion: 0.07
Nodes (27): dependencies, clsx, firebase, framer-motion, lenis, lucide-react, next, react (+19 more)

### Community 6 - "Admin Auth & Nav"
Cohesion: 0.12
Nodes (17): links, AuthGuard(), Status, metadata, checkIsAdmin(), signInWithGoogle(), signOutAdmin(), watchAuthState() (+9 more)

### Community 7 - "Parallax & Datasheet"
Cohesion: 0.14
Nodes (11): DatasheetItem, ParallaxImageProps, ProjectCoverSection(), ProjectHeroProps, RoomChapter(), RoomChapterProps, layoutRoom(), orientation() (+3 more)

### Community 8 - "TS Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 9 - "Lightbox & Reveal Images"
Cohesion: 0.20
Nodes (10): RevealImage(), RevealImageProps, LightboxImage(), LightboxImageProps, LightboxContext, LightboxContextValue, ProjectLightboxProvider(), useProjectLightbox() (+2 more)

### Community 10 - "Contact Form"
Cohesion: 0.18
Nodes (8): BUDGETS, Errors, PROJECT_TYPES, SOURCES, Status, TIMELINES, MagneticButton(), MagneticButtonProps

### Community 11 - "Server Auth & API Routes"
Cohesion: 0.32
Nodes (7): POST(), bearerTokenFromHeader(), getAdminEmails(), LookupUser, verifyAdminToken(), POST(), ALLOWED_CONTENT_TYPES

### Community 12 - "Projects Index Hover"
Cohesion: 0.20
Nodes (8): ProjectRow(), Row, HoverPreviewContext, HoverPreviewContextValue, HoverPreviewProps, Item, PreviewImage, useHoverPreview()

### Community 13 - "Types & Categories"
Cohesion: 0.26
Nodes (7): categories, ProjectImageKind, ProjectScope, ProjectBlocks(), chipClass(), ProjectsFilter(), scopeBySlug

### Community 14 - "Seed Projects"
Cohesion: 0.17
Nodes (10): doshiRooms, jamesDrawings, jamesRooms, polasDrawings, polasRooms, seedProjects, shyamkutirDrawings, shyamkutirRooms (+2 more)

### Community 15 - "Lightbox & Hero Slideshow"
Cohesion: 0.25
Nodes (3): LightboxProps, Slide, RoomImage

### Community 17 - "Home Page & Hero"
Cohesion: 0.38
Nodes (5): findImage(), Home(), metadata, Hero(), Slide

## Knowledge Gaps
- **142 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+137 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Project` connect `Admin Project Form` to `Page Heroes & Headers`, `About Page & Sitemap`, `Parallax & Datasheet`, `Projects Index Hover`, `Types & Categories`, `Seed Projects`, `Project Images & Carousel`, `Home Page & Hero`, `Galleries`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `site` connect `Root Layout & Shell` to `Home Page & Hero`, `Page Heroes & Headers`, `About Page & Sitemap`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `getProjects()` connect `About Page & Sitemap` to `Home Page & Hero`, `Page Heroes & Headers`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _143 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin Project Form` be split into smaller, more focused modules?**
  _Cohesion score 0.08282828282828283 - nodes in this community are weakly interconnected._
- **Should `Root Layout & Shell` be split into smaller, more focused modules?**
  _Cohesion score 0.06976744186046512 - nodes in this community are weakly interconnected._
- **Should `Page Heroes & Headers` be split into smaller, more focused modules?**
  _Cohesion score 0.059800664451827246 - nodes in this community are weakly interconnected._