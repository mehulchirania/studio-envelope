import type { Project, Room, Drawing } from "./types";

/** Flattens a project's rooms into the derived `gallery` list, in room order. */
function galleryOf(rooms: Room[]): string[] {
  return rooms.flatMap((room) => room.images.map((image) => image.src));
}

const jamesRooms: Room[] = [
  {
    name: "Kitchen & Dining",
    images: [
      { src: "/images/projects/james-residence/kitchen-dining.jpg", kind: "photo", alt: "Kitchen with blue-grey cabinetry, pendant lights and walnut bar stools opening onto the dining area", width: 1483, height: 988 },
      { src: "/images/projects/james-residence/kitchen-island.jpg", kind: "photo", alt: "Kitchen island in blue-grey laminate with a marble-effect countertop and pendant lighting", width: 1071, height: 1499 },
    ],
  },
  {
    name: "In-house Office",
    images: [
      { src: "/images/projects/james-residence/office-desk.jpg", kind: "photo", alt: "Built-in study desk in warm wood tones with open shelving and a task chair", width: 1456, height: 970 },
      { src: "/images/projects/james-residence/office-lounge.jpg", kind: "photo", alt: "Small home-office lounge corner with an armchair beside a wood-panelled wall", width: 999, height: 1499 },
    ],
  },
  {
    name: "Living",
    images: [
      { src: "/images/projects/james-residence/living.jpg", kind: "photo", alt: "Living room with a neutral sectional sofa, textured rug and warm wood accent wall", width: 1650, height: 1795 },
      { src: "/images/projects/james-residence/living-detail.jpg", kind: "photo", alt: "Detail of the living room seating with layered cushions and a low wooden side table", width: 985, height: 1019 },
    ],
  },
  {
    name: "TV Unit & Dining",
    images: [
      { src: "/images/projects/james-residence/tv-dining.jpg", kind: "photo", alt: "TV unit in fluted wood panelling facing the dining table across an open living space", width: 1112, height: 768 },
    ],
  },
  {
    name: "Crockery Unit & Common Vanity",
    images: [
      { src: "/images/projects/james-residence/crockery-unit.jpg", kind: "photo", alt: "Tall crockery unit with glass-front shelving and integrated display lighting", width: 1117, height: 1499 },
      { src: "/images/projects/james-residence/common-vanity.jpg", kind: "photo", alt: "Common washroom vanity with a wood-toned counter and a round backlit mirror", width: 1000, height: 1499 },
    ],
  },
  {
    name: "Parents' Bedroom",
    images: [
      { src: "/images/projects/james-residence/parents-bedroom.jpg", kind: "photo", alt: "Parents' bedroom with an upholstered headboard and warm bedside lighting", width: 999, height: 1499 },
      { src: "/images/projects/james-residence/parents-dresser.jpg", kind: "photo", alt: "Dresser unit in the parents' bedroom with a mirror and soft accent lighting", width: 836, height: 1280 },
    ],
  },
  {
    name: "Master Bedroom",
    images: [
      { src: "/images/projects/james-residence/master-bedroom-1.jpg", kind: "photo", alt: "Master bedroom with a panelled headboard wall and layered neutral bedding", width: 1071, height: 1499 },
      { src: "/images/projects/james-residence/master-bedroom-2.jpg", kind: "photo", alt: "Master bedroom seating nook beside a large window with sheer curtains", width: 1001, height: 1499 },
      { src: "/images/projects/james-residence/master-dresser.jpg", kind: "photo", alt: "Master bedroom dresser with a backlit mirror and wood-veneer drawers", width: 1000, height: 1499 },
      { src: "/images/projects/james-residence/master-wardrobe.jpg", kind: "photo", alt: "Floor-to-ceiling wardrobe in the master bedroom with matte-finish shutters", width: 1200, height: 1499 },
    ],
  },
  {
    name: "Master Washroom",
    images: [
      { src: "/images/projects/james-residence/master-bath-vanity.jpg", kind: "photo", alt: "Master washroom vanity in dark stone with dual basins and a wide mirror", width: 768, height: 1320 },
      { src: "/images/projects/james-residence/master-bath-shower.jpg", kind: "photo", alt: "Master washroom shower enclosure finished in textured tile with glass panelling", width: 768, height: 784 },
    ],
  },
  {
    name: "Kids' Room",
    images: [
      { src: "/images/projects/james-residence/kids-room.jpg", kind: "photo", alt: "Kids' bedroom with a study desk, bunk-style bed and playful accent colours", width: 2014, height: 1342 },
    ],
  },
  {
    name: "Kids' Washroom",
    images: [
      { src: "/images/projects/james-residence/kids-bath-1.jpg", kind: "photo", alt: "Kids' washroom with colourful tiling and a compact vanity counter", width: 1071, height: 1499 },
      { src: "/images/projects/james-residence/kids-bath-2.jpg", kind: "photo", alt: "Kids' washroom shower area with patterned tile and glass partition", width: 1071, height: 1499 },
    ],
  },
];

const jamesDrawings: Drawing[] = [
  { src: "/images/projects/james-residence/plan.png", alt: "Floor plan of the James Residence apartment", width: 1536, height: 876 },
];

const shyamkutirRooms: Room[] = [
  {
    name: "TV Unit & Pooja",
    images: [
      { src: "/images/projects/shyamkutir/tv-unit.jpg", kind: "photo", alt: "Living room TV unit in warm wood tones with an earthy textured backdrop", width: 1280, height: 937 },
      { src: "/images/projects/shyamkutir/pooja.jpg", kind: "photo", alt: "Pooja corner with a carved wooden backdrop and warm ambient lighting", width: 641, height: 960 },
    ],
  },
  {
    name: "Master Bedroom",
    images: [
      { src: "/images/projects/shyamkutir/master-bedroom.jpg", kind: "render", alt: "Visualisation of the master bedroom with a contemporary minimal palette and soft lighting", width: 1248, height: 768 },
    ],
  },
  {
    name: "Daughter's Bedroom",
    images: [
      { src: "/images/projects/shyamkutir/daughter-bedroom.jpg", kind: "render", alt: "Visualisation of the daughter's bedroom with a light, contemporary furniture layout", width: 1448, height: 768 },
    ],
  },
  {
    name: "Gym",
    images: [
      { src: "/images/projects/shyamkutir/gym-1.jpg", kind: "render", alt: "Visualisation of the new gym with mirrored walls and rubber flooring", width: 1617, height: 664 },
      { src: "/images/projects/shyamkutir/gym-2.jpg", kind: "render", alt: "Visualisation of the gym showing the equipment layout and natural light", width: 1231, height: 654 },
    ],
  },
];

const shyamkutirDrawings: Drawing[] = [
  { src: "/images/projects/shyamkutir/plan.jpg", alt: "Floor plan of the Shyamkutir bungalow renovation", width: 1750, height: 1398 },
];

const polasRooms: Room[] = [
  {
    name: "Kitchen & Dining",
    images: [
      { src: "/images/projects/polas-residence/kitchen-dining.jpg", kind: "render", alt: "Visualisation of the kitchen and dining area with a contemporary open layout", width: 2427, height: 1528 },
    ],
  },
  {
    name: "Master Bedroom",
    images: [
      { src: "/images/projects/polas-residence/master-bedroom-1.jpg", kind: "render", alt: "Visualisation of the master bedroom with a panelled headboard and warm lighting", width: 1369, height: 933 },
      { src: "/images/projects/polas-residence/master-bedroom-2.jpg", kind: "render", alt: "Visualisation of the master bedroom seating area beside the window", width: 1125, height: 756 },
    ],
  },
  {
    name: "Daughter's Bedroom",
    images: [
      { src: "/images/projects/polas-residence/daughter-bedroom-1.jpg", kind: "render", alt: "Visualisation of the daughter's bedroom with a study desk and soft furnishings", width: 1384, height: 844 },
      { src: "/images/projects/polas-residence/daughter-bedroom-2.jpg", kind: "render", alt: "Visualisation of the daughter's bedroom wardrobe wall and bed layout", width: 1143, height: 775 },
    ],
  },
];

const polasDrawings: Drawing[] = [
  { src: "/images/projects/polas-residence/plans.png", alt: "Ground and first floor plans of Pola's Residence", width: 612, height: 593 },
];

const doshiRooms: Room[] = [
  {
    name: "Staircase & Puja",
    images: [
      { src: "/images/projects/doshi-residence/stair-puja.jpg", kind: "render", alt: "Visualisation of the staircase with an integrated puja room and planters", width: 865, height: 1080 },
    ],
  },
  {
    name: "Living & Dining",
    images: [
      { src: "/images/projects/doshi-residence/living-dining-1.jpg", kind: "render", alt: "Visualisation of the living and dining space with a minimal, luxurious material palette", width: 2017, height: 1121 },
      { src: "/images/projects/doshi-residence/living-dining-2.jpg", kind: "render", alt: "Visualisation of the dining area seen from the adjoining living space", width: 1399, height: 798 },
    ],
  },
  {
    name: "Master Bedroom",
    images: [
      { src: "/images/projects/doshi-residence/master-bedroom.jpg", kind: "render", alt: "Visualisation of the master bedroom with a simple, elegant furniture layout", width: 1607, height: 893 },
    ],
  },
  {
    name: "Kids' Bedroom",
    images: [
      { src: "/images/projects/doshi-residence/kids-bedroom.jpg", kind: "render", alt: "Visualisation of the kids' bedroom with a minimal approach and playful accents", width: 1473, height: 893 },
    ],
  },
];

export const seedProjects: Project[] = [
  {
    id: "james-residence",
    slug: "james-residence",
    title: "James Residence",
    subtitle: "A three-bedroom home for three generations",
    location: "Hennur, Bangalore",
    year: 2023,
    area: "1,600 sq ft",
    status: "Completed",
    scope: "Interior",
    summary: "A modern, minimalist three-bedroom apartment for a family of three generations in Hennur, Bangalore.",
    description:
      "Located in Hennur, Bangalore, this three-bedroom apartment was designed with a modern, minimalist approach — simple, elegant and impactful — for a family of three generations living under one roof.",
    coverImage: "/images/projects/james-residence/kitchen-dining.jpg",
    rooms: jamesRooms,
    drawings: jamesDrawings,
    gallery: galleryOf(jamesRooms),
    featured: true,
    order: 0,
    published: true,
  },
  {
    id: "shyamkutir",
    slug: "shyamkutir",
    title: "Shyamkutir",
    subtitle: "A renovation for two sisters, two sensibilities",
    location: "Ballari, Karnataka",
    year: null,
    area: "6,200 sq ft",
    status: "Ongoing",
    scope: "Architecture & Interior",
    summary: "An architectural renovation and interior project in Ballari, adding two bedrooms and a gym to an existing bungalow.",
    description:
      "An architectural renovation and interior project in Ballari. The brief was to add two bedrooms and a gym to an existing bungalow and refurbish its formal and informal living spaces. The design holds the contrasting tastes of two sisters — one drawn to earthy tones with a traditional touch, the other to contemporary, minimal aesthetics.",
    coverImage: "/images/projects/shyamkutir/tv-unit.jpg",
    rooms: shyamkutirRooms,
    drawings: shyamkutirDrawings,
    gallery: galleryOf(shyamkutirRooms),
    featured: false,
    order: 1,
    published: true,
  },
  {
    id: "polas-residence",
    slug: "polas-residence",
    title: "Pola's Residence",
    subtitle: "A row-house interior in Ashok Vatika Society",
    location: "Ashok Vatika Society, Ballari, Karnataka",
    year: 2024,
    area: "2,100 sq ft",
    status: "Completed",
    scope: "Interior",
    summary: "A residential interior for a row house in Ashok Vatika Society, Ballari, Karnataka.",
    description: "A residential interior for a row house in Ashok Vatika Society, Ballari, Karnataka.",
    coverImage: "/images/projects/polas-residence/kitchen-dining.jpg",
    rooms: polasRooms,
    drawings: polasDrawings,
    gallery: galleryOf(polasRooms),
    featured: false,
    order: 2,
    published: true,
  },
  {
    id: "doshi-residence",
    slug: "doshi-residence",
    title: "Doshi Residence",
    subtitle: "A simple, elegant home on a tight urban site",
    location: "Pune, Maharashtra",
    year: 2019,
    area: "2,500 sq ft",
    status: "Completed",
    scope: "Interior",
    summary: "A simple, elegant and luxurious three-bedroom residence on a tight urban site in Pune.",
    description:
      "Set on a tight urban site in Pune, this residence was designed to be simple and elegant while carrying an overall luxurious look. Three bedrooms follow a minimal approach, and the puja room integrates seamlessly with the planters and staircase to form a cohesive whole.",
    credit: "In association with Cadence Architects",
    coverImage: "/images/projects/doshi-residence/stair-puja.jpg",
    rooms: doshiRooms,
    drawings: [],
    gallery: galleryOf(doshiRooms),
    featured: false,
    order: 3,
    published: true,
  },
];
