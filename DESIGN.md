---
name: Studio Envelope
description: Quiet, warm, photograph-led website for an architect-led residential interior studio in Bangalore.
colors:
  night: "#433a31"
  abyss: "#26211c"
  teal: "#756451"
  teal-deep: "#584a3c"
  bone: "#ebe1d2"
  paper-2: "#d9ccba"
  ink: "#332c26"
  muted: "#5f5448"
  mist: "#c9baa6"
  marigold: "#c7a97a"
  hairline: "rgb(51 44 38 / 18%)"
  hairline-light: "rgb(235 225 210 / 18%)"
  logo-teal: "#0E4B5E"
  logo-amber: "#FCB618"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(56px, 9vw, 160px)"
    fontWeight: 300
    lineHeight: 0.92
    letterSpacing: "-0.01em"
  h1:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(44px, 6vw, 110px)"
    fontWeight: 300
    lineHeight: 0.98
  h2:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(40px, 5vw, 88px)"
    fontWeight: 400
    lineHeight: 1.02
  body:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.18em"
rounded:
  none: "0px"
  pill: "9999px"
spacing:
  section: "clamp(56px, 6vw, 104px)"
  gutter: "clamp(16px, 3vw, 48px)"
components:
  band-dark:
    backgroundColor: "{colors.night}"
    textColor: "{colors.bone}"
  band-bone:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
  band-darkest:
    backgroundColor: "{colors.abyss}"
    textColor: "{colors.bone}"
  cta-round:
    backgroundColor: "{colors.marigold}"
    textColor: "{colors.abyss}"
    rounded: "{rounded.pill}"
  cta-round-hover:
    backgroundColor: "{colors.bone}"
  submit-button:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.bone}"
    rounded: "{rounded.none}"
    padding: "14px 32px"
  submit-button-hover:
    backgroundColor: "{colors.teal-deep}"
---

# Design System: Studio Envelope

## Overview

**Creative North Star: "The Sealed Letter."** The studio's name is a message sealed with care, so the site behaves like good stationery: warm paper, dark ink-brown, one amber seal, large quiet serif type, and the photographs doing the talking. Pages alternate between a dark brown band and a bone paper band. Nothing performs. There is no preloader, no cursor effect, no scroll-linked animation and no route curtain; the page scrolls natively and content is simply there.

This system rejects: motion-heavy "agency" sites, parallax and pinned scroll sequences, glassy dashboards, gold-on-black "premium" clichés, and anything that hides the projects behind effects.

## Colors

A single warm-brown family with one amber accent. Dark bands are brown, never black.

- **Night `#433a31`** and **Abyss `#26211c`**: dark bands, header, footer. Abyss is the deepest (footer, menu overlay).
- **Bone `#ebe1d2`** and **Paper-2 `#d9ccba`**: light bands, image placeholders, success panels.
- **Ink `#332c26`** and **Muted `#5f5448`**: text on bone. Muted is for labels and secondary copy.
- **Mist `#c9baa6`**: secondary text on dark bands.
- **Marigold `#c7a97a`**: the only accent. Underlines, active nav, room counters, the round Enquire CTA, selection colour. Used sparingly.
- **Teal `#756451` / Teal-deep `#584a3c`**: legacy token name for a mid brown. Link arrows, form focus, submit button, back-to-top. Not a blue-green.
- **Logo:** the official client logo (blue-teal `#186B8C` mark, amber `#FCB618` bars, grey or white wordmark) is used as supplied from `public/brand/` (`logo-on-dark.png` on dark bands, `logo-color.png` on bone). It is the one place blue-teal appears; do not recolour it to the site palette.

Rule: dark and bone bands alternate down a page; never two accents on one screen.

## Typography

- **Display and headings: Cormorant Garamond**, weights 300-500, with italics used for subtitles and room names. Large, light, tightly leaded (0.92-1.02).
- **Body and UI: Jost**, 300-500. Body copy 16-18px, line height about 1.75, max line length around 65ch.
- **Label:** Jost 500, 12px, uppercase, 0.18em tracking, for nav, captions and section markers.

Hierarchy comes from the serif/sans contrast and scale, not weight. Text is plain: headings are not split, masked or animated.

## Layout

- Full-width bands (`band-dark`, `band-bone`, `band-darkest`) containing a `container-x` (max 1600px, fluid gutter 16-48px).
- Section rhythm: `section-y` (56-104px) between content blocks; heroes use `min-h-[70svh]` with the headline anchored bottom-left.
- Project grids: two columns from `sm`, 4:3 covers. Project pages stack room chapters full width, laying images out by orientation (lone landscape full-bleed, portrait pairs, 2/3 + 1/3 mix).
- The header is fixed and overlays heroes; heroes supply their own top padding. It does not hide on scroll.
- Scrolling is always native. No scroll-pinning, no scroll hijack, no autoplay motion.

## Elevation & Depth

Flat. Depth comes from alternating band colours, hairline borders (`hairline`, `hairline-light`) and photography. No shadows. The header uses a solid translucent abyss with a blur only for legibility over photos.

## Shapes

Square corners everywhere on the public site (images, cards, buttons). The only round element is the circular Enquire CTA in the footer. Admin screens use a separate rounded dark UI and are out of scope for this system.

## Components

- **Header:** logo left; Projects, Studio, Services, Contact as uppercase labels; "Enquire" right. Active page marked with a marigold underline. Mobile: full-screen abyss menu with large serif links, focus trap and Esc to close.
- **Footer:** "Write to us." headline, round Enquire CTA, four contact columns (email, phone, WhatsApp, Instagram), logo and nav, copyright.
- **PageHero:** dark band with optional photo under a brown gradient, label, serif title, short intro.
- **Project card:** 4:3 cover, serif title, uppercase location, one line of `area · scope · year`. Renders carry a small "Visualisation" chip.
- **Datasheet:** label/value rows (Location, Area, Scope, Status, Credit) on project heroes.
- **Contact form:** underline-only inputs on bone, marigold focus line, inline error text, submit in teal-deep brown.
- **Featured projects:** a native scroll-snap row (swipe on touch, arrows on desktop); never pinned.
- **FAQ:** native `<details>` rows. **Process:** a plain numbered grid.

## Do's and Don'ts

**Do**
- Let project photographs lead; keep UI quiet around them.
- Label renders as "Visualisation"; only state facts from `site.ts` and project data.
- Keep contact one click away on every page (header Enquire, footer CTA).
- Respect `prefers-reduced-motion`; prefer no motion at all.

**Don't**
- Don't add preloaders, cursor followers, parallax, scroll-linked text, pinned galleries, marquees, or page-transition overlays.
- Don't use pure black, pure white, shadows, gradients as decoration, or more than one accent.
- Don't invent awards, client counts, testimonials or numbers.
- Don't round public-site corners.
