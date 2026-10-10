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

/** The three stages the ten services are grouped into. */
export const serviceGroups = [
  { name: "Design", items: services.design },
  { name: "Furnish & Style", items: services.furnishAndStyle },
  { name: "Deliver", items: services.deliver },
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
