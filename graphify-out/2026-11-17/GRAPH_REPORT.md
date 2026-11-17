# Graph Report - .  (2026-10-10)

## Corpus Check
- Source files, project docs and client assets (rebuilt 2026-10-10 after restructure; semantic nodes from brief, portfolio and logos retained)
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 393 nodes · 663 edges · 19 communities (15 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.83)
- Token cost: 0 (code-only rebuild; docs extracted earlier)

## Community Hubs (Navigation)
- [[_COMMUNITY_ESLint|ESLint]]
- [[_COMMUNITY_Next Config|Next Config]]
- [[_COMMUNITY_Dependencies|Dependencies]]
- [[_COMMUNITY_PostCSS|PostCSS]]
- [[_COMMUNITY_Pages, Services & SEO|Pages, Services & SEO]]
- [[_COMMUNITY_Firebase Client & Admin Auth|Firebase Client & Admin Auth]]
- [[_COMMUNITY_Admin Projects & Uploads|Admin: Projects & Uploads]]
- [[_COMMUNITY_API Routes & Server Auth|API Routes & Server Auth]]
- [[_COMMUNITY_Site Shell & Footer|Site Shell & Footer]]
- [[_COMMUNITY_Project Model & Room Layout|Project Model & Room Layout]]
- [[_COMMUNITY_Contact Form & Button|Contact Form & Button]]
- [[_COMMUNITY_TS Config|TS Config]]
- [[_COMMUNITY_AGENTS|AGENTS.md]]
- [[_COMMUNITY_CLAUDE|CLAUDE.md]]
- [[_COMMUNITY_DESIGN|DESIGN.md]]
- [[_COMMUNITY_PRODUCT|PRODUCT.md]]
- [[_COMMUNITY_README|README]]
- [[_COMMUNITY_Brand, Portfolio & Client Brief|Brand, Portfolio & Client Brief]]

## God Nodes (most connected - your core abstractions)
1. `getProjects()` - 20 edges
2. `compilerOptions` - 16 edges
3. `Project` - 14 edges
4. `requireDb()` - 12 edges
5. `getBreadcrumbSchema()` - 11 edges
6. `Product` - 11 edges
7. `Studio Envelope (interior design studio, Bangalore)` - 11 edges
8. `site` - 10 edges
9. `findImage()` - 9 edges
10. `RoomImage` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Projects page (name large, location, area, scope, year)` --shares_data_with--> `Shyamkutir (architecture and interior, Ballari, 6200 SFT, ongoing)`  [INFERRED]
  graphify-out/assets_docs.md → assets/Studio-Envelope-Portfolio.pdf
- `Studio Envelope Letterhead A4` --conceptually_related_to--> `Studio Envelope brand identity`  [INFERRED]
  graphify-out/assets_docs.md → assets/StudioEnvelope Logo-28.png
- `Studio Envelope (interior design studio, Bangalore)` --references--> `Descriptor: Art. Interiors. Architecture`  [EXTRACTED]
  assets/Studio-Envelope-Portfolio.pdf → graphify-out/assets_docs.md
- `Client website brief (Mehul_Studio Envelope website.docx)` --rationale_for--> `Studio Envelope (interior design studio, Bangalore)`  [INFERRED]
  graphify-out/assets_docs.md → assets/Studio-Envelope-Portfolio.pdf
- `Instagram @studio__envelope` --references--> `Prachi Chirania Bhalotia (Principal Architect)`  [INFERRED]
  scripts/instagram-sources.md → assets/Studio-Envelope-Portfolio.pdf

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Studio portfolio projects** — studio_project_james_residence, studio_project_polas_residence, studio_project_shyamkutir, studio_project_doshi_residence [INFERRED 0.85]
- **Logo variants and favicon** — assets_studioenvelope_logo_28, assets_studioenvelope_logo_29, assets_studioenvelope_logo_30, assets_studioenvelope_logo_30_37, icon_svg_favicon [INFERRED 0.85]
- **Website pages per client brief** — studio_page_home, studio_page_about, studio_page_projects, studio_page_services, studio_page_contact, studio_page_instagram [INFERRED 0.85]

## Communities (19 total, 4 thin omitted)

### Community 5 - "Dependencies"
Cohesion: 0.08
Nodes (25): name, version, private, scripts, dev, build, start, lint (+17 more)

### Community 4 - "Pages, Services & SEO"
Cohesion: 0.07
Nodes (37): metadata, NOTE_PARAGRAPHS, AboutPage(), metadata, DETAILS, ContactPage(), metadata, Home() (+29 more)

### Community 6 - "Firebase Client & Admin Auth"
Cohesion: 0.11
Nodes (18): metadata, links, Status, AuthGuard(), fetchPublishedProjectsFromFirestore(), watchAuthState(), signInWithGoogle(), signOutAdmin() (+10 more)

### Community 0 - "Admin: Projects & Uploads"
Cohesion: 0.08
Nodes (28): FormSection(), ImageUploaderProps, PendingUpload, SCOPES, STATUSES, WIZARD_STEPS, ToggleProps, Toggle() (+20 more)

### Community 11 - "API Routes & Server Auth"
Cohesion: 0.32
Nodes (7): POST(), POST(), ALLOWED_CONTENT_TYPES, LookupUser, getAdminEmails(), verifyAdminToken(), bearerTokenFromHeader()

### Community 1 - "Site Shell & Footer"
Cohesion: 0.09
Nodes (16): cormorant, jost, metadata, RootLayout(), NotFound(), size, BackToTop(), navLinks (+8 more)

### Community 7 - "Project Model & Room Layout"
Cohesion: 0.06
Nodes (43): generateStaticParams(), generateMetadata(), ProjectDetailPage(), LightboxImageProps, LightboxImage(), NextProjectBand(), ProjectCardProps, ProjectCard() (+35 more)

### Community 2 - "Contact Form & Button"
Cohesion: 0.13
Nodes (10): PROJECT_TYPES, BUDGETS, TIMELINES, SOURCES, Status, Errors, Variant, ButtonProps (+2 more)

### Community 8 - "TS Config"
Cohesion: 0.10
Nodes (19): compilerOptions, target, lib, allowJs, skipLibCheck, strict, noEmit, esModuleInterop (+11 more)

### Community 13 - "CLAUDE.md"
Cohesion: 0.22
Nodes (8): Studio Envelope: working notes, Direction, Commands, Data and backend, Code layout, Conventions, Codebase map, Brand assets

### Community 12 - "DESIGN.md"
Cohesion: 0.20
Nodes (9): Design System: Studio Envelope, Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components (+1 more)

### Community 9 - "PRODUCT.md"
Cohesion: 0.17
Nodes (11): Product, Platform, Users, Product Purpose, Positioning, Operating Context, Capabilities and Constraints, Brand Commitments (+3 more)

### Community 10 - "README"
Cohesion: 0.18
Nodes (10): Studio Envelope, Stack, Local development, Project structure, Setting up the backend, 1. Firebase (Firestore + Auth), 2. Vercel Blob (image uploads), Data model (+2 more)

### Community 3 - "Brand, Portfolio & Client Brief"
Cohesion: 0.07
Nodes (40): Admin panel, Studio Envelope (interior design studio, Bangalore), Prachi Chirania Bhalotia (Principal Architect), Tagline: Spaces, sealed with care, Descriptor: Art. Interiors. Architecture, Conceptual note: why an envelope, Studio services offering, Design consultation and space planning (+32 more)

## Knowledge Gaps
- **149 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+144 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Project` connect `Project Model & Room Layout` to `Admin: Projects & Uploads`, `Site Shell & Footer`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Why does `site` connect `Site Shell & Footer` to `Pages, Services & SEO`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `getProjects()` connect `Pages, Services & SEO` to `Firebase Client & Admin Auth`, `Project Model & Room Layout`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _150 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `Pages, Services & SEO` be split into smaller, more focused modules?**
  _Cohesion score 0.07111756168359942 - nodes in this community are weakly interconnected._
- **Should `Firebase Client & Admin Auth` be split into smaller, more focused modules?**
  _Cohesion score 0.11396011396011396 - nodes in this community are weakly interconnected._