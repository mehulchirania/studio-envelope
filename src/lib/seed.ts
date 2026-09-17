import type { Project } from "./types";

// PLACEHOLDER DATA
// These projects and Unsplash images are stand-ins for Studio Envelope's real
// portfolio. Every image URL below was verified to return HTTP 200 at the time
// of writing. Replace all of it with the studio's own photography and copy via
// the admin panel once Firebase is wired up.

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

export const seedProjects: Project[] = [
  {
    id: "1",
    slug: "the-arch-house",
    title: "The Arch House",
    category: "Residential",
    location: "Hyderabad, India",
    year: 2024,
    area: "3,200 sq.ft",
    status: "Completed",
    summary:
      "A family home built around a sequence of arched openings, warm stone and a hand-carved jaali that filters the courtyard light.",
    description:
      "The Arch House began with a single idea: let the passage between rooms feel like a series of thresholds, not doorways. Every opening in the plan is drawn as an arch — some shallow and wide over the living room, others tall and narrow leading to the private wing.\n\nA limewashed stone facade wraps the courtyard, where a jaali screen in a traditional mandala motif casts moving light across the floor through the day. Inside, the material palette stays deliberately quiet — travertine, warm oak, unlacquered brass — so the architecture and the light do the talking.\n\nThe pooja niche, tucked into a deep arched recess off the main hall, became the emotional centre of the home: brass inlay, a fluted backdrop, and a shaft of top light that the family asked us to protect at all costs.",
    coverImage: img("photo-1600585154340-be6161a56a0c"),
    gallery: [
      img("photo-1600210492486-724fe5c67fb0"),
      img("photo-1600607687939-ce8a6c25118c"),
      img("photo-1600566753086-00f18fb6b3ea"),
      img("photo-1600121848594-d8644e57abab"),
      img("photo-1600585152220-90363fe7e115"),
    ],
    materials: ["Limestone", "Teakwood", "Brass", "Jaali screen", "Travertine"],
    featured: true,
    order: 1,
    published: true,
  },
  {
    id: "2",
    slug: "mandala-residence",
    title: "Mandala Residence",
    category: "Residential",
    location: "Jaipur, India",
    year: 2023,
    area: "4,100 sq.ft",
    status: "Completed",
    summary:
      "A radial cut-work screen anchors the entrance foyer of this Rajasthan home, setting the rhythm for every room that follows.",
    description:
      "For the Mandala Residence, the brief was simple and specific: the client wanted the sense of pattern and craft found in their grandmother's haveli, translated into a home that felt contemporary rather than nostalgic.\n\nWe designed a large mandala cut-work screen in MDF and brass leaf as the first thing you see on entering — backlit at night, it throws a lattice of shadow across the foyer. The motif recurs at a smaller scale throughout the home: in the pooja unit's jali doors, in a perforated metal stair balustrade, in the fretwork above the dining pass-through.\n\nWarm plaster walls, a restrained material palette of stone and cane, and layered, dimmable lighting keep the pattern from feeling loud. The result is a home that reads as calm from a distance and richly detailed up close.",
    coverImage: img("photo-1616046229478-9901c5536a45"),
    gallery: [
      img("photo-1618221195710-dd6b41faaea6"),
      img("photo-1615873968403-89e068629265"),
      img("photo-1615874959474-d609969a20ed"),
      img("photo-1615529328331-f8917597711f"),
      img("photo-1616486338812-3dadae4b4ace"),
    ],
    materials: ["Brass leaf", "Cane", "Lime plaster", "Cut-work screen", "Marble"],
    featured: true,
    order: 2,
    published: true,
  },
  {
    id: "3",
    slug: "fluted-oak-apartment",
    title: "Fluted Oak Apartment",
    category: "Residential",
    location: "Bengaluru, India",
    year: 2024,
    area: "1,850 sq.ft",
    status: "Completed",
    summary:
      "Floor-to-ceiling fluted oak panelling turns a compact city apartment's TV wall and wardrobes into a single continuous gesture.",
    description:
      "This apartment for a young couple had generous proportions but very little architectural character. Rather than add walls or detail piecemeal, we chose one move and repeated it everywhere: vertical fluting in warm oak veneer, running from the entryway console to the living room's TV wall to the bedroom wardrobes.\n\nThe fluting does double duty — it hides seams and service shutters, and it catches the low, warm lighting we specified throughout, giving every surface a soft rhythm of light and shadow. Furniture stays low and pared back, so the panelling reads as the room's real texture.\n\nA small pooja shelf, framed in the same fluted language with a brass niche light, sits discreetly beside the entry — present without dominating the space.",
    coverImage: img("photo-1616137466211-f939a420be84"),
    gallery: [
      img("photo-1617104551722-3b2d51366400"),
      img("photo-1617103996702-96ff29b1c467"),
      img("photo-1618219908412-a29a1bb7b86e"),
      img("photo-1618220179428-22790b461013"),
      img("photo-1616594039964-ae9021a400a0"),
    ],
    materials: ["Fluted oak veneer", "Brass", "Terrazzo", "Boucle upholstery"],
    featured: true,
    order: 3,
    published: true,
  },
  {
    id: "4",
    slug: "brass-and-basalt-cafe",
    title: "Brass & Basalt Café",
    category: "Hospitality",
    location: "Pune, India",
    year: 2023,
    area: "1,400 sq.ft",
    status: "Completed",
    summary:
      "A neighbourhood café clad in dark basalt and warm brass, designed to feel intimate by day and glow like a lantern after dark.",
    description:
      "Our client wanted a café that didn't look like every other third-wave coffee shop — something with more weight and warmth. We leaned into a dark, textured basalt-tiled counter and back bar, offset by brass shelf edging, cane-backed seating and a low, amber-toned lighting scheme.\n\nA street-facing arched window frames the espresso bar like a piece of theatre, while banquette seating along the rear wall sits beneath a run of the studio's signature fluted panelling. Acoustic felt panels, hidden behind woven cane screens, keep the compact room comfortable even at full capacity.\n\nAt night, the café's lighting is tuned low and warm enough that it reads from the street as a single glowing brass-edged box — exactly the lantern effect the owners wanted.",
    coverImage: img("photo-1560448204-e02f11c3d0e2"),
    gallery: [
      img("photo-1631679706909-1844bbd07221"),
      img("photo-1524758631624-e2822e304c36"),
      img("photo-1519710164239-da123dc03ef4"),
      img("photo-1554995207-c18c203602cb"),
      img("photo-1586023492125-27b2c045efd7"),
    ],
    materials: ["Basalt tile", "Brass", "Cane", "Acoustic felt", "Fluted panelling"],
    featured: true,
    order: 4,
    published: true,
  },
  {
    id: "5",
    slug: "envelope-studio-office",
    title: "Envelope Studio Office",
    category: "Commercial",
    location: "Hyderabad, India",
    year: 2022,
    area: "2,000 sq.ft",
    status: "Completed",
    summary:
      "Our own studio: a working design office where every material sample on the shelf is also part of the room.",
    description:
      "We designed our studio as a working showroom as much as a place to sit and draw. The material library — stone, wood, brass, textile swatches — lines one long wall as an open shelving system, so a conversation with a client can turn into pulling a sample off the wall.\n\nDesk clusters sit under a run of exposed, painted services, intentionally left visible against a warm plaster ceiling to keep the budget honest and the mood industrial-meets-craft. A single meeting room, wrapped in a cut-work timber screen, doubles as a quiet room when the floor gets busy.\n\nIt's a small office, but it was designed to demonstrate restraint: three materials, used consistently, rather than many materials used once each.",
    coverImage: img("photo-1493809842364-78817add7ffb"),
    gallery: [
      img("photo-1493663284031-b7e3aefcae8e"),
      img("photo-1505873242700-f289a29e1e0f"),
      img("photo-1449247709967-d4461a6a6103"),
      img("photo-1545324418-cc1a3fa10c00"),
      img("photo-1512918728675-ed5a9ecdebfd"),
    ],
    materials: ["Plywood", "Brass", "Exposed plaster", "Cut-work timber screen"],
    featured: false,
    order: 5,
    published: true,
  },
  {
    id: "6",
    slug: "the-marble-veil",
    title: "The Marble Veil",
    category: "Residential",
    location: "Ahmedabad, India",
    year: 2025,
    area: "5,600 sq.ft",
    status: "Ongoing",
    summary:
      "A large family home currently under construction, organised around a book-matched marble stair that acts as its central spine.",
    description:
      "Still on site, The Marble Veil is built around a single architectural gesture: a book-matched marble-clad stair, lit from above by a skylight, that every major room on both floors opens onto.\n\nThe ground floor is planned as a sequence of semi-open spaces — living, dining and a formal sitting room — divided by stone screens rather than full walls, so the marble stair remains visible from almost anywhere. Bedrooms upstairs are treated more simply, in warm wood and linen, to let the stair stay the home's one loud material moment.\n\nWe're currently detailing the brass stair handrail and the pooja room, which sits at the top of the stair behind a carved stone jali.",
    coverImage: img("photo-1600566752355-35792bedcfea"),
    gallery: [
      img("photo-1616627547584-bf28cee262db"),
      img("photo-1617806118233-18e1de247200"),
      img("photo-1615529182904-14819c35db37"),
      img("photo-1616137422495-1e9e46e2aa77"),
      img("photo-1600210491369-e753d80a41f3"),
    ],
    materials: ["Book-matched marble", "Brass", "Stone jali", "Linen", "Walnut"],
    featured: false,
    order: 6,
    published: true,
  },
  {
    id: "7",
    slug: "jaali-pavilion",
    title: "Jaali Pavilion",
    category: "Art & Installations",
    location: "Goa, India",
    year: 2025,
    status: "Concept",
    summary:
      "A freestanding pavilion concept exploring how a single cut-metal jaali motif can define an entire structure, not just a screen.",
    description:
      "Jaali Pavilion is a research piece for the studio, not a client commission: a proposal for a small outdoor pavilion — for a garden, a gallery courtyard, or a festival site — built entirely from a repeated perforated-metal jaali module.\n\nWhere jaali work usually appears as an infill screen within a conventional structure, here the pattern is the structure. Modules bolt together to form walls, a partial roof and built-in seating, throwing a constantly shifting field of shadow across the ground beneath.\n\nWe're developing this as a scalable kit of parts — the same module could wrap a small pavilion or a full building facade — and hope to prototype it at full scale in the coming year.",
    coverImage: img("photo-1499916078039-922301b0eb9b"),
    gallery: [
      img("photo-1502005229762-cf1b2da7c5d6"),
      img("photo-1522708323590-d24dbb6b0267"),
      img("photo-1502672260266-1c1ef2d93688"),
      img("photo-1507089947368-19c1da9775ae"),
    ],
    materials: ["Perforated metal", "Powder-coated steel", "Reclaimed teak seating"],
    featured: false,
    order: 7,
    published: true,
  },
  {
    id: "8",
    slug: "sandstone-loft",
    title: "Sandstone Loft",
    category: "Residential",
    location: "Udaipur, India",
    year: 2023,
    area: "2,600 sq.ft",
    status: "Completed",
    summary:
      "A double-height loft wrapped in local sandstone, with a suspended mezzanine study reached by an open timber stair.",
    description:
      "Set within a converted haveli outbuilding, the Sandstone Loft keeps its existing thick masonry walls exposed and honest, finishing them only with a soft lime wash. A new steel-and-timber mezzanine floats within the double-height volume, holding a study and a reading nook above the living room.\n\nLocal sandstone — quarried within a few hours of the site — reappears as flooring, a fireplace surround and window reveals, tying the new insertions back to the building's original material logic. Brass fixtures and warm linen upholstery keep the palette from feeling cold.\n\nAn open timber stair, deliberately slim and unadorned, was designed as the loft's single sculptural object against an otherwise quiet material backdrop.",
    coverImage: img("photo-1524230507669-5ff97982bb5e"),
    gallery: [
      img("photo-1560185127-6ed189bf02f4"),
      img("photo-1560184897-ae75f418493e"),
      img("photo-1494203484021-3c454daf695d"),
      img("photo-1583847268964-b28dc8f51f92"),
      img("photo-1556228453-efd6c1ff04f6"),
    ],
    materials: ["Local sandstone", "Lime wash", "Brass", "Timber", "Linen"],
    featured: false,
    order: 8,
    published: true,
  },
];
