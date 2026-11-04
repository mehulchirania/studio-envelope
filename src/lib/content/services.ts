import { services } from "./site";

/** One-line description of each service, keyed by the names in `services` (site.ts). */
export const serviceDescriptions: Record<string, string> = {
  "Design Consultation": "We start with your space, your brief and how you want to live in it, and set the direction for the whole project.",
  "Space Planning": "Layouts that work for how each room is used, settled before any finish or furniture is chosen.",
  "Colour Palette Selection": "A considered palette for walls, ceilings and trims, chosen to suit the light, the materials and the mood you want.",
  "Lighting Consultation": "Ambient, task and accent lighting planned with the electrical drawings, so fittings and layout work together.",
  "Material Selection": "Flooring, tiles, wall finishes and hardware chosen to sit well together and to last.",
  "Furniture Selection": "Furniture that suits the plan, the budget and the palette, sourced and specified for you.",
  "Soft Furnishing": "Curtains, upholstery, rugs and fabrics selected to add warmth, texture and pattern.",
  "Décor Consultation": "Art, accessories and finishing touches, chosen once the larger pieces are in place.",
  "Project Management": "Coordinating vendors, contractors and timelines so the design is executed as drawn.",
  "Photo & Video Shoot": "Professional documentation of the finished space once the project is complete.",
};

/**
 * One photo per service, in /public/images/services, shown uncropped. These are
 * not Studio Envelope projects. Eight (design consultation, space planning,
 * colour palette selection, lighting, material, furniture, soft furnishing,
 * decor) are Pinterest references chosen by Prachi Chirania on 4 Nov 2026.
 * Project management (Burst) and photo & video shoot (Alejandro Escamilla)
 * are CC0 photos from StockSnap.io.
 */
export const serviceImages: Record<string, { src: string; width: number; height: number; alt: string }> = {
  "Design Consultation": {
    src: "/images/services/design-consultation-3.jpg",
    width: 736,
    height: 736,
    alt: "Hands arranging interior photographs, fabric swatches and a floor plan on a wooden table",
  },
  "Space Planning": {
    src: "/images/services/space-planning-3.jpg",
    width: 736,
    height: 1104,
    alt: "An architectural floor plan on a desk with a pen and ruler",
  },
  "Colour Palette Selection": {
    src: "/images/services/colour-palette-selection-3.jpg",
    width: 736,
    height: 736,
    alt: "A palette of green, sand, terracotta and timber material samples",
  },
  "Lighting Consultation": {
    src: "/images/services/lighting-consultation-3.jpg",
    width: 736,
    height: 981,
    alt: "Ceramic pendant lamps with fringed teal beads hanging on twisted cords",
  },
  "Material Selection": {
    src: "/images/services/material-selection-3.jpg",
    width: 736,
    height: 1038,
    alt: "Material samples: terrazzo, blue and white tile, glazed navy tile and walnut timber",
  },
  "Furniture Selection": {
    src: "/images/services/furniture-selection-3.jpg",
    width: 736,
    height: 981,
    alt: "A sculptural cream boucle armchair beside a red side table with a bud vase",
  },
  "Soft Furnishing": {
    src: "/images/services/soft-furnishing-3.jpg",
    width: 736,
    height: 920,
    alt: "Block-printed fabric swatches in blue and mustard with a teal velvet sample and ceramic dishes",
  },
  "Décor Consultation": {
    src: "/images/services/decor-consultation-3.jpg",
    width: 736,
    height: 1102,
    alt: "Black sculpted candle holders in front of a textured white artwork",
  },
  "Project Management": {
    src: "/images/services/project-management.jpg",
    width: 1200,
    height: 900,
    alt: "Two people in high visibility vests pointing at construction plans",
  },
  "Photo & Video Shoot": {
    src: "/images/services/photo-video-shoot.jpg",
    width: 1200,
    height: 900,
    alt: "A vintage film camera and lens on a wooden desk beside a pot of pencils",
  },
};

/** The three stages the ten services are grouped into. */
export const serviceGroups = [
  {
    id: "design",
    name: "Design",
    blurb: "Setting the direction: how the space works, how it looks and how it is lit.",
    items: services.design,
  },
  {
    id: "furnish-and-style",
    name: "Furnish & Style",
    blurb: "Choosing the pieces and details that make the plan feel like a home.",
    items: services.furnishAndStyle,
  },
  {
    id: "deliver",
    name: "Deliver",
    blurb: "Seeing the design through on site, and documenting the finished space.",
    items: services.deliver,
  },
];

export const processSteps = [
  { title: "Discover", text: "We start by understanding the site, the brief and how you actually want to live or work in the space." },
  { title: "Concept", text: "That understanding becomes an initial spatial and material direction for you to react to." },
  { title: "Design development", text: "The concept is refined into drawings, material palettes and details that are ready to build." },
  { title: "Execution", text: "We coordinate the trades, craftspeople and vendors who bring the design onto the site." },
  { title: "Handover", text: "We walk the finished space with you and settle the last details before you move in." },
];

export const faqs = [
  {
    q: "How does a project usually start?",
    a: "With a conversation about the site, the brief and how you want the space to feel. From there we can talk through which of our services fit, and what a next step could look like.",
  },
  {
    q: "What should I bring to a first conversation?",
    a: "Whatever you already have: site details or drawings, photos, dimensions, references you're drawn to. It's just as useful to start with nothing more than a sense of what you want the space to feel like.",
  },
  {
    q: "Can we work together if I'm not based near the studio?",
    a: "We're set up to work at a distance for design development, with site visits arranged around the stages of a project where being there in person matters most.",
  },
  {
    q: "Can I engage you for design only, without execution?",
    a: "Yes. Some projects stop at drawings and specifications for your own contractor to build from; others carry through to turnkey execution. We scope this together based on what you need.",
  },
  {
    q: "Who manages the work on site once construction starts?",
    a: "We coordinate directly with contractors, craftspeople and vendors, and stay involved on site to keep the finished work aligned with what was designed.",
  },
];
