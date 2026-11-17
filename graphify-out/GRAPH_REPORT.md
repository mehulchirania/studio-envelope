# Graph Report - studio-envelope  (2026-11-17)

## Corpus Check
- 129 files · ~73,599,380 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 628 nodes · 1318 edges · 36 communities (31 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2482360e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

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
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_ESLint|ESLint]]
- [[_COMMUNITY_Next Config|Next Config]]
- [[_COMMUNITY_PostCSS|PostCSS]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]

## God Nodes (most connected - your core abstractions)
1. `handle()` - 36 edges
2. `getDb()` - 23 edges
3. `getProjects` - 21 edges
4. `json()` - 17 edges
5. `getBreadcrumbSchema()` - 17 edges
6. `Project` - 16 edges
7. `compilerOptions` - 16 edges
8. `site` - 15 edges
9. `requireAdmin()` - 14 edges
10. `request()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `Studio Envelope Letterhead A4` --conceptually_related_to--> `Studio Envelope brand identity`  [INFERRED]
  graphify-out/assets_docs.md → assets/StudioEnvelope Logo-28.png
- `Client website brief (Mehul_Studio Envelope website.docx)` --rationale_for--> `Studio Envelope (interior design studio, Bangalore)`  [INFERRED]
  graphify-out/assets_docs.md → assets/Studio-Envelope-Portfolio.pdf
- `Services page` --shares_data_with--> `Studio services offering`  [EXTRACTED]
  graphify-out/assets_docs.md → assets/Studio-Envelope-Portfolio.pdf
- `Projects page (name large, location, area, scope, year)` --shares_data_with--> `James Residence (interior, Hennur Bangalore, 1600 SFT, 2023)`  [INFERRED]
  graphify-out/assets_docs.md → assets/Studio-Envelope-Portfolio.pdf
- `Projects page (name large, location, area, scope, year)` --shares_data_with--> `Shyamkutir (architecture and interior, Ballari, 6200 SFT, ongoing)`  [INFERRED]
  graphify-out/assets_docs.md → assets/Studio-Envelope-Portfolio.pdf

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Studio portfolio projects** — studio_project_james_residence, studio_project_polas_residence, studio_project_shyamkutir, studio_project_doshi_residence [INFERRED 0.85]
- **Logo variants and favicon** — assets_studioenvelope_logo_28, assets_studioenvelope_logo_29, assets_studioenvelope_logo_30, assets_studioenvelope_logo_30_37, icon_svg_favicon [INFERRED 0.85]
- **Website pages per client brief** — studio_page_home, studio_page_about, studio_page_projects, studio_page_services, studio_page_contact, studio_page_instagram [INFERRED 0.85]

## Communities (36 total, 5 thin omitted)

### Community 0 - "Admin Project Form"
Cohesion: 0.05
Nodes (48): AdminNav(), links, AuthGuard(), AdminSession, changePassword(), createProject(), createVideo(), deleteMessage() (+40 more)

### Community 1 - "Root Layout & Shell"
Cohesion: 0.06
Nodes (35): cormorant, jost, metadata, RootLayout(), metadata, NotFound(), BackToTop(), ConsentBanner() (+27 more)

### Community 2 - "Page Heroes & Headers"
Cohesion: 0.11
Nodes (40): AdminUser, configuredUsers(), DEFAULT_USERS, digest(), hashMatches(), hashPassword(), issueTempPassword(), RESETTABLE (+32 more)

### Community 3 - "Brand, Docs & Studio Facts"
Cohesion: 0.20
Nodes (12): Cadence Architects, Studio Envelope (interior design studio, Bangalore), Instagram @studio__envelope, Instagram content provenance policy, Studio Envelope Letterhead A4, Instagram link page, Studio Envelope Portfolio PDF, Prachi Chirania Bhalotia (Principal Architect) (+4 more)

### Community 4 - "About Page & Sitemap"
Cohesion: 0.15
Nodes (13): faqs, processSteps, serviceDescriptions, serviceGroups, serviceImages, getFaqSchema(), metadata, ServicesPage() (+5 more)

### Community 5 - "Dependencies"
Cohesion: 0.07
Nodes (29): dependencies, clsx, firebase, lucide-react, next, react, react-dom, server-only (+21 more)

### Community 6 - "Admin Auth & Nav"
Cohesion: 0.08
Nodes (33): Answers, Choice, CITIES, DETAIL, Errors, Intent, INTENTS, PATHS (+25 more)

### Community 7 - "Parallax & Datasheet"
Cohesion: 0.07
Nodes (30): UploadedImage, CoverUploader(), Pending, PhotoGrid(), PhotoItem, useDropzone(), useImageUploads(), ashiyanaRooms (+22 more)

### Community 8 - "TS Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 9 - "Lightbox & Reveal Images"
Cohesion: 0.17
Nodes (11): Accessibility & Inclusion, Brand Commitments, Capabilities and Constraints, Evidence on Hand, Operating Context, Platform, Positioning, Product (+3 more)

### Community 10 - "Contact Form"
Cohesion: 0.15
Nodes (12): 1. Firebase (Firestore + Auth), 2. Vercel Blob (image uploads), Data model, Deploying to Vercel, Local development, Notes, Project structure, Search engine pings (+4 more)

### Community 11 - "Server Auth & API Routes"
Cohesion: 0.07
Nodes (53): HttpError, handle(), isSameOrigin(), readJson(), requireAdmin(), revalidateSite(), createSessionToken(), getSession() (+45 more)

### Community 12 - "Projects Index Hover"
Cohesion: 0.20
Nodes (9): Colors, Components, Design System: Studio Envelope, Do's and Don'ts, Elevation & Depth, Layout, Overview, Shapes (+1 more)

### Community 13 - "Types & Categories"
Cohesion: 0.22
Nodes (8): Brand assets, Code layout, Codebase map, Commands, Conventions, Data and backend, Direction, Studio Envelope: working notes

### Community 15 - "Community 15"
Cohesion: 0.18
Nodes (14): DETAILS, metadata, site, PageTransition(), pageMetadata(), metadata, metadata, ProjectsPage() (+6 more)

### Community 16 - "Community 16"
Cohesion: 0.19
Nodes (14): Project, getProject(), getProjectSchema(), NextProjectBand(), buildSlides(), ProjectRow(), findImageMeta(), layoutRoom() (+6 more)

### Community 17 - "Community 17"
Cohesion: 0.19
Nodes (6): privacy, services, purgeMessagesBefore(), links, authorised(), GET()

### Community 18 - "Community 18"
Cohesion: 0.24
Nodes (11): AboutPage(), sitemap(), ContactPage(), fallbackProjects(), getProjects, getVideos, getBreadcrumbSchema(), PrivacyPolicyPage() (+3 more)

### Community 19 - "Community 19"
Cohesion: 0.22
Nodes (5): Home, metadata, Hero(), InteractiveLogo(), GlimpseImage

### Community 20 - "Community 20"
Cohesion: 0.27
Nodes (6): metadata, WhyEnvelope(), WhyEnvelopeProps, Seal(), SectionHeader(), SectionHeaderProps

### Community 21 - "Community 21"
Cohesion: 0.25
Nodes (9): Conceptual note: why an envelope, Design references: studiogoya.in, maiadesign.in, studioruh.in, About page (Why an envelope, About me, photo), Contact page, Home page (one selected image + tagline), Services page, Site pages: Home, About, Projects, Services, Contact, Instagram, Tagline: Spaces, sealed with care (+1 more)

### Community 22 - "Community 22"
Cohesion: 0.33
Nodes (7): AGENTS.md: Next.js has breaking changes, read node_modules docs, CLAUDE.md imports AGENTS.md, Admin panel, Seed project data (src/lib/seed.ts) fallback, Website: Next.js 16 + Tailwind v4 + Firebase + Vercel Blob, Projects page (name large, location, area, scope, year), Shyamkutir (architecture and interior, Ballari, 6200 SFT, ongoing)

### Community 23 - "Community 23"
Cohesion: 0.38
Nodes (7): Logo-28: full colour logo (mark + grey wordmark on white), Logo-29: amber bars only (rest white, for dark backgrounds), Logo-30: colour mark with white wordmark (dark-bg variant), Logo-30-37: all-white logo (monochrome reversed), src/app/icon.svg favicon, Brand colors: teal #0E4B5E, amber #FCB618, cream #F6F3EE, grey wordmark, Studio Envelope brand identity

### Community 25 - "Next Config"
Cohesion: 0.50
Nodes (3): csp, nextConfig, securityHeaders

### Community 28 - "Community 28"
Cohesion: 0.47
Nodes (3): VideoFact, videos, VideoFeatureProps

### Community 29 - "Community 29"
Cohesion: 0.33
Nodes (3): ProjectHero(), ProjectHeroProps, DatasheetItem

### Community 30 - "Community 30"
Cohesion: 0.50
Nodes (4): CarouselSlide, pad(), ProjectCarousel(), ProjectCarouselProps

### Community 31 - "Community 31"
Cohesion: 0.40
Nodes (4): dry, key, keyFile, urlList

### Community 32 - "Community 32"
Cohesion: 0.40
Nodes (5): Design consultation and space planning, Photo and video shoot service, Project management and technical services, Colour, material, lighting, furniture, soft furnishing, decor consultation/selection, Studio services offering

## Knowledge Gaps
- **185 isolated node(s):** `eslintConfig`, `securityHeaders`, `csp`, `nextConfig`, `name` (+180 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Project` connect `Community 16` to `Admin Project Form`, `Page Heroes & Headers`, `Admin Auth & Nav`, `Parallax & Datasheet`, `Community 15`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `site` connect `Community 15` to `Root Layout & Shell`, `Admin Auth & Nav`, `Server Auth & API Routes`, `Community 17`, `Community 19`, `Community 20`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `handle()` (e.g. with `PATCH()` and `DELETE()`) actually correct?**
  _`handle()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `securityHeaders`, `csp` to the rest of the system?**
  _186 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin Project Form` be split into smaller, more focused modules?**
  _Cohesion score 0.052393857271906055 - nodes in this community are weakly interconnected._
- **Should `Root Layout & Shell` be split into smaller, more focused modules?**
  _Cohesion score 0.05731523378582202 - nodes in this community are weakly interconnected._
- **Should `Page Heroes & Headers` be split into smaller, more focused modules?**
  _Cohesion score 0.10570824524312897 - nodes in this community are weakly interconnected._