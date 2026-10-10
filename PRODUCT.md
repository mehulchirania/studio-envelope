# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Homeowners (families) in Bangalore, Ballari and Pune who are considering hiring Studio Envelope for a residential interior or architecture project. Many arrive through referrals or Instagram (@studio__envelope) and already half-trust the studio; the site confirms their impression and moves them to enquire. Secondary: the studio principal and one other admin who manage projects and read enquiries.

## Product Purpose
The public website of Studio Envelope, an architecture and interior design studio in Bangalore led by Ar. Prachi Chirania Bhalotia. It shows a small, honest portfolio and explains the studio and its services, with the contact form (plus phone and WhatsApp) as the primary conversion. A private admin panel lets the studio publish projects and read enquiries without a developer.

## Positioning
Architect-led, residential and personal. Spaces are shaped around each family's personality and needs, expressed in the "envelope" idea: a space as a heartfelt message, crafted with care. Client tagline: "Spaces, sealed with care."; descriptor: "Art. Interiors. Architecture."

## Operating Context
- Pages (client brief): Home, About ("Studio"), Projects, Services, Contact, plus an Instagram link. Each project shows name (large), location, area, scope, year.
- Admin at /admin (Google sign-in, allowlisted emails) manages projects, images (Vercel Blob) and the messages inbox.
- Public site works with no backend by falling back to local seed data (`src/lib/seed.ts`).
- Client design references: studiogoya.in, maiadesign.in, studioruh.in.

## Capabilities and Constraints
- Stack: Next.js 16 (App Router, breaking changes: read `node_modules/next/dist/docs/` first), React 19, Tailwind v4, framer-motion, Firebase Firestore + Auth (Spark plan), Vercel Blob, deployed on Vercel.
- Admin panel and Firestore rules/allowlist must keep working; contact form writes to Firestore `messages`.
- Project model: rooms of images (photo or render, with real dimensions) plus drawings; renders must be labelled as visualisations.
- Studio facts live in `src/lib/site.ts`; do not invent claims, awards, clients or numbers.
- Undecided: final scope of the current simplification redesign (in progress with ChatGPT).

## Brand Commitments
Name: Studio Envelope. Logo: envelope-flap triangle with dot between two amber bars (colour, amber-only, colour-on-dark and all-white variants in `assets/`). Logo palette: teal #0E4B5E, amber #FCB618, cream #F6F3EE. Principal named as Ar. Prachi Chirania Bhalotia.

## Evidence on Hand
Four real projects with photos/renders and plans (James Residence, Shyamkutir, Pola's Residence, Doshi Residence) in `public/images/projects/`; eight Instagram previews in `public/images/instagram/`; portfolio PDF (`Studio Evnelope_Portfolio.pdf`); client brief and letterhead docx and logo files in `assets/`. No testimonials, awards, press or client counts exist; do not fabricate them. Principal photo and personal note were promised by the client but are not yet supplied.

## Product Principles
1. Honest and specific: only real projects, facts and imagery; label renders.
2. Enquiry first: every page makes it easy to contact the studio.
3. The work leads; the interface stays quiet and simple.
4. Personal, not corporate: warmth and care are the studio's voice.
5. Studio staff can run it themselves via the admin panel.

## Accessibility & Inclusion
No product-specific standard confirmed. Existing code honours prefers-reduced-motion; keep keyboard focus and alt text on project imagery.
