import { services } from "./site";

/** One-line description of each service, keyed by the names in `services` (site.ts). */
export const serviceDescriptions: Record<string, string> = {
  "Design Consultation": "An initial walkthrough of your space and brief to set the direction for the project.",
  "Space Planning": "Working out how each room is used and laid out, before any material or furniture decision.",
  "Colour Consultation": "A palette for walls, ceilings and trims chosen to suit light, material and mood.",
  "Lighting Consultation": "A lighting layout — ambient, task and accent — planned alongside the electrical drawings.",
  "Material Selection": "Flooring, wall finishes, countertops and hardware chosen to work together and wear well.",
  "Furniture Selection": "Sourcing and specifying furniture that fits the plan, the budget and the material palette.",
  "Soft Furnishing": "Curtains, upholstery, rugs and linens selected to complete the space.",
  "Décor Consultation": "Art, accessories and styling details that finish a room once the larger pieces are in place.",
  "Project Management": "Coordinating vendors, contractors and timelines so the design is executed as drawn.",
  "Photo & Video Shoot": "Professional documentation of the finished space once the project is complete.",
};

/**
 * One photo per service, in /public/images/services. These are generic stock
 * photographs (not Studio Envelope projects), all CC0 / public domain from
 * StockSnap.io, cropped to 4:3. Photographers, for the record:
 * design-consultation: Brodie Vissers; space-planning: energepic.com;
 * colour-consultation: Martin Vorel; lighting-consultation: Adrianna Calvo;
 * material-selection: Travel Photographer; furniture-selection: Nathan Fertig;
 * soft-furnishing: Kari Shea; decor-consultation: Chimene Gaspar;
 * project-management: Burst; photo-video-shoot: Alejandro Escamilla.
 */
export const serviceImages: Record<string, { src: string; alt: string }> = {
  "Design Consultation": {
    src: "/images/services/design-consultation.jpg",
    alt: "Several people sketching a layout in pencil and marker over large sheets of paper",
  },
  "Space Planning": {
    src: "/images/services/space-planning.jpg",
    alt: "Hands on a laptop keyboard beside a printed floor plan with blue-shaded rooms",
  },
  "Colour Consultation": {
    src: "/images/services/colour-consultation.jpg",
    alt: "A fan of paint colour swatches in warm oranges, pinks and blues",
  },
  "Lighting Consultation": {
    src: "/images/services/lighting-consultation.jpg",
    alt: "A black pendant lamp with a warm filament bulb hanging beside a timber post",
  },
  "Material Selection": {
    src: "/images/services/material-selection.jpg",
    alt: "Close-up of a hand-painted blue and white ceramic tile",
  },
  "Furniture Selection": {
    src: "/images/services/furniture-selection.jpg",
    alt: "A grey tufted sofa with teal and patterned cushions in front of a bright window",
  },
  "Soft Furnishing": {
    src: "/images/services/soft-furnishing.jpg",
    alt: "A cushioned armchair beside sheer white curtains",
  },
  "Décor Consultation": {
    src: "/images/services/decor-consultation.jpg",
    alt: "A blush ceramic vase holding dried pampas grass on a pale fleece rug",
  },
  "Project Management": {
    src: "/images/services/project-management.jpg",
    alt: "Two people in high-visibility vests pointing at construction plans",
  },
  "Photo & Video Shoot": {
    src: "/images/services/photo-video-shoot.jpg",
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
    a: "Whatever you already have — site details or drawings, photos, dimensions, references you're drawn to. It's just as useful to start with nothing more than a sense of what you want the space to feel like.",
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
