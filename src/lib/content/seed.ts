import type { Project, Room, Drawing } from "@/lib/content/types";

/** Flattens a project's rooms into the derived `gallery` list, in room order. */
function galleryOf(rooms: Room[]): string[] {
  return rooms.flatMap((room) => room.images.map((image) => image.src));
}

const jamesRooms: Room[] = [
  {
    name: "",
    images: [
      { src: "/images/projects/james-residence/photos/kitchen-dining-1.jpg", kind: "photo", alt: "Open kitchen with blue grey cabinets seen past a dining table with cream upholstered chairs and a rust coloured unit on the left", width: 2000, height: 1334 },
      { src: "/images/projects/james-residence/photos/kitchen-dining-2.jpg", kind: "photo", alt: "Corner of the kitchen with pale blue upper cabinets, dark fluted breakfast counter and brown wood bar stools", width: 2000, height: 1334 },
      { src: "/images/projects/james-residence/photos/kitchen-dining-3.jpg", kind: "photo", alt: "L shaped kitchen in two tones of blue grey with a cream stone counter, black hood and two bar stools at a curved peninsula", width: 2000, height: 1334 },
    ],
  },
  {
    name: "",
    images: [
      { src: "/images/projects/james-residence/photos/living-1.jpg", kind: "photo", alt: "Living room with two dark grey sofas, a round layered coffee table and a green plant against a panelled warm grey wall", width: 1333, height: 2000 },
      { src: "/images/projects/james-residence/photos/living-2.jpg", kind: "photo", alt: "Wider view of the living area with grey sofas, a patterned rug, a ceiling fan and a glass partition to the study", width: 1428, height: 2000 },
      { src: "/images/projects/james-residence/photos/living-3.jpg", kind: "photo", alt: "Wood slatted TV wall with a floating console beside a rust coloured crockery unit, seen from the living area", width: 1333, height: 2000 },
    ],
  },
  {
    name: "",
    images: [
      { src: "/images/projects/james-residence/photos/in-house-office-1.jpg", kind: "photo", alt: "Study desk in walnut with a tall open shelving unit behind it, a black framed glass partition and sheer curtains", width: 2000, height: 1333 },
      { src: "/images/projects/james-residence/photos/in-house-office-2.jpg", kind: "photo", alt: "Home office seen through a black framed reeded glass partition, with a walnut desk, shelving and a dark office chair", width: 1428, height: 2000 },
      { src: "/images/projects/james-residence/photos/in-house-office-3.jpg", kind: "photo", alt: "Small seating corner beside the office with a green leather sofa, a blue accent wall and a colourful framed artwork", width: 1333, height: 2000 },
    ],
  },
  {
    name: "",
    images: [
      { src: "/images/projects/james-residence/photos/crockery-unit-vanity-1.jpg", kind: "photo", alt: "Crockery unit with rust coloured fluted base cabinets, an open shelf and black glass overhead cabinets beside the dining area", width: 1333, height: 2000 },
      { src: "/images/projects/james-residence/photos/crockery-unit-vanity-2.jpg", kind: "photo", alt: "Common vanity with a floating wood counter, a stone basin, a round mirror and rose and charcoal tiles", width: 1334, height: 2000 },
    ],
  },
  {
    name: "",
    images: [
      { src: "/images/projects/james-residence/photos/parents-bedroom-1.jpg", kind: "photo", alt: "Parents' bedroom with a herringbone wood headboard wall, sliding wardrobe above a lit niche and grey bedding", width: 1333, height: 2000 },
    ],
  },
  {
    name: "",
    images: [
      { src: "/images/projects/james-residence/photos/master-bedroom-1.jpg", kind: "photo", alt: "Bedroom with a grey upholstered headboard, blue bedding, wall lamps and roman blinds on the windows", width: 2000, height: 1334 },
      { src: "/images/projects/james-residence/photos/master-bedroom-2.jpg", kind: "photo", alt: "Close view of the bed with a grey headboard, quilted blue and grey bedding and a patterned cushion", width: 1336, height: 2000 },
      { src: "/images/projects/james-residence/photos/master-bedroom-3.jpg", kind: "photo", alt: "Corner dressing table in wood with a round brass framed mirror, a tan chair and a trailing plant", width: 1333, height: 2000 },
      { src: "/images/projects/james-residence/photos/master-bedroom-4.jpg", kind: "photo", alt: "Bedroom with full height grey wardrobes, a dressing table with a round mirror and wood flooring", width: 1600, height: 2000 },
    ],
  },
  {
    name: "",
    images: [
      { src: "/images/projects/james-residence/photos/kids-room-1.jpg", kind: "photo", alt: "Kids' room with blue and sea green wardrobes with open shelves, a built in bed and a patterned headboard panel", width: 1429, height: 2000 },
      { src: "/images/projects/james-residence/photos/kids-room-2.jpg", kind: "photo", alt: "Wide view of the kids' room with two beds on either side of a central blue and green storage unit", width: 2000, height: 1332 },
    ],
  },
];

const jamesDrawings: Drawing[] = [
  { src: "/images/projects/james-residence/plan.png", alt: "Floor plan of the James Residence apartment", width: 1536, height: 876 },
];

const ashiyanaRooms: Room[] = [
  {
    name: "",
    images: [
      { src: "/images/projects/ashiyana/living-1.jpg", kind: "photo", alt: "Long living room with a pink plaster wall on the right, a cream sofa and two blush armchairs, a wall mounted TV and a low wooden console on the left", width: 2000, height: 1335 },
      { src: "/images/projects/ashiyana/living-2.jpg", kind: "photo", alt: "Seating area with blush armchairs and a striped cream sofa beside a pink plaster wall, a grey rug and a dark coffee table in front of a sheer curtained window", width: 2000, height: 1333 },
      { src: "/images/projects/ashiyana/living-3.jpg", kind: "photo", alt: "Corner of the living room with a pink textured wall, a striped cream sofa with a knitted throw, a black framed coffee table and sunflowers in a vase", width: 1333, height: 2000 },
      { src: "/images/projects/ashiyana/living-4.jpg", kind: "photo", alt: "Pink plaster wall with a faint floral pattern behind a cream sofa and a blush armchair with printed cushions, a brass pendant light hanging beside it", width: 1334, height: 2000 },
      { src: "/images/projects/ashiyana/living-5.jpg", kind: "photo", alt: "TV wall with a wall mounted television, an arched mirror niche, a wooden slatted rack and open shelves, with a low console and curtains at the side", width: 1334, height: 2000 },
      { src: "/images/projects/ashiyana/living-6.jpg", kind: "photo", alt: "Cream marble patterned TV wall with a vertical timber panel, a wall mounted TV, a floating white and wood console and a red gladiolus in a vase", width: 1334, height: 2000 },
    ],
  },
  {
    name: "",
    images: [
      { src: "/images/projects/ashiyana/dining-1.jpg", kind: "photo", alt: "Dining area with a stone top table and grey upholstered chairs under a crystal chandelier, an arched timber opening and a painted pink counter on the right", width: 2000, height: 1334 },
      { src: "/images/projects/ashiyana/dining-2.jpg", kind: "photo", alt: "Dining table set with fruit and grey chairs, beside a large carved white mural with a fan shaped pattern on the wall", width: 2000, height: 1334 },
      { src: "/images/projects/ashiyana/dining-3.jpg", kind: "photo", alt: "Carved white relief mural above a console with a brass Buddha figure, dried flowers and white vases", width: 2000, height: 1334 },
    ],
  },
  {
    name: "",
    images: [
      { src: "/images/projects/ashiyana/kitchen-1.jpg", kind: "photo", alt: "Kitchen seen through a timber arch, with cream upper cabinets with glass fronts, a black chimney hood and a pink painted counter in the foreground", width: 2000, height: 1333 },
      { src: "/images/projects/ashiyana/kitchen-2.jpg", kind: "photo", alt: "Kitchen with cream overhead cabinets, a black hood, a white backsplash and mauve lower cabinets with a cream counter", width: 2000, height: 1333 },
      { src: "/images/projects/ashiyana/kitchen-3.jpg", kind: "photo", alt: "Corner of the kitchen with glass fronted cream cabinets, a gas hob, mauve lower cabinets and a pink patterned counter front with a bowl of grapes", width: 2000, height: 1333 },
      { src: "/images/projects/ashiyana/kitchen-4.jpg", kind: "photo", alt: "Pink counter painted with a folk style mural of trees and animals, with the kitchen cabinets and a dining chair behind it", width: 1333, height: 2000 },
      { src: "/images/projects/ashiyana/kitchen-5.jpg", kind: "photo", alt: "Kitchen detail with a black hood, ribbed glass fronted cabinets, a white tiled backsplash, a gas hob and mauve drawers", width: 1334, height: 2000 },
    ],
  },
  {
    name: "",
    images: [
      { src: "/images/projects/ashiyana/kids-room-1.jpg", kind: "photo", alt: "Narrow children's room with two cream daybeds with storage drawers facing each other, a wooden shelf and a window at the far end", width: 2000, height: 1334 },
      { src: "/images/projects/ashiyana/kids-room-2.jpg", kind: "photo", alt: "Daybed with soft toys, a sunflower and a roman blind at the window, with a toy storage shelf under the bed platform", width: 1333, height: 2000 },
      { src: "/images/projects/ashiyana/kids-room-3.jpg", kind: "photo", alt: "Study corner with cream wardrobe doors, a zigzag patterned lower panel in red and orange, a pegboard wall and an orange framed desk", width: 2000, height: 1334 },
      { src: "/images/projects/ashiyana/kids-room-4.jpg", kind: "photo", alt: "Pegboard desk with an orange chair, open orange shelf cubbies above, and a red and cream zigzag patterned panel", width: 1332, height: 2000 },
    ],
  },
  {
    name: "",
    images: [
      { src: "/images/projects/ashiyana/bedroom-1.jpg", kind: "photo", alt: "Bedroom with a grey upholstered bed, a floral wallpaper headboard wall, a long wooden console under the window and a grey and wood wardrobe", width: 2000, height: 1333 },
      { src: "/images/projects/ashiyana/bedroom-2.jpg", kind: "photo", alt: "Bed with a grey padded headboard, a plaid blanket, blue and pink cushions, floral wallpaper, an oval mirror and blue grey wardrobe doors", width: 2000, height: 1333 },
      { src: "/images/projects/ashiyana/bedroom-3.jpg", kind: "photo", alt: "Close view of the bed with blue and pink cushions and yellow flowers, next to a blue grey wardrobe with cane panelled doors", width: 2000, height: 1334 },
      { src: "/images/projects/ashiyana/bedroom-4.jpg", kind: "photo", alt: "Wood panelled wall with a blue grey storage unit, a floating desk and grey chair by a corner window, with a bed edge in the foreground", width: 2000, height: 1334 },
    ],
  },
  {
    name: "",
    images: [
      { src: "/images/projects/ashiyana/bedroom-two-1.jpg", kind: "photo", alt: "Room with a mustard yellow sofa and a dark throw, a wall of cream wardrobe doors with patterned drawers, and a corner desk with wooden overhead cabinets", width: 2000, height: 1334 },
      { src: "/images/projects/ashiyana/bedroom-two-2.jpg", kind: "photo", alt: "Wooden corner desk with overhead cabinets and open shelves, a pinboard, patterned drawer fronts and a yellow sofa with geometric cushions", width: 1334, height: 2000 },
      { src: "/images/projects/ashiyana/bedroom-two-3.jpg", kind: "photo", alt: "Wall mounted desk with a grey chair beside a window with a roman blind, a grey cabinet above with an arched open niche and a green side table", width: 1334, height: 2000 },
      { src: "/images/projects/ashiyana/bedroom-two-4.jpg", kind: "photo", alt: "Tall wardrobe with cream doors and a wooden desk niche, a pinboard, patterned lower drawers and a yellow sofa with cushions", width: 1334, height: 2000 },
    ],
  },
];

const urbanNestRooms: Room[] = [
  {
    name: "",
    images: [
      { src: "/images/projects/urban-nest/entrance-1.jpg", kind: "photo", alt: "Entrance with a dark wood shoe cabinet and an open bench for shoes, a printed cushion, a plant and a framed artwork above", width: 1334, height: 2000 },
    ],
  },
  {
    name: "",
    images: [
      { src: "/images/projects/urban-nest/living-1.jpg", kind: "photo", alt: "TV wall finished in grey textured plaster with a wall mounted TV, a floating wood console, tall open shelves on the right and a framed abstract print", width: 2000, height: 1360 },
      { src: "/images/projects/urban-nest/living-2.jpg", kind: "photo", alt: "Corner beside the TV with a colourful striped framed print, yellow lilies in a brass vase, a potted plant and a wood panelled column", width: 1333, height: 2000 },
      { src: "/images/projects/urban-nest/living-3.jpg", kind: "photo", alt: "Tall dark wood open shelving beside a grey plaster wall, holding books, a small camera, a plant and yellow lilies", width: 1333, height: 2000 },
    ],
  },
  {
    name: "",
    images: [
      { src: "/images/projects/urban-nest/dining-1.jpg", kind: "photo", alt: "Wooden dining table with a woven table runner, a teal vase with white flowers, a bowl of fruit and two framed striped prints on a cream wall", width: 1334, height: 2000 },
    ],
  },
  {
    name: "",
    images: [
      { src: "/images/projects/urban-nest/kitchen-1.jpg", kind: "photo", alt: "Kitchen with white upper cabinets, sage green lower drawers, a black stone counter, a marble look backsplash and an open shelf with plants", width: 2000, height: 1334 },
      { src: "/images/projects/urban-nest/kitchen-2.jpg", kind: "photo", alt: "Kitchen counter with a black top and stone look front, white cabinets and a glass partition with a lit yellow niche beyond", width: 2000, height: 1334 },
    ],
  },
  {
    name: "",
    images: [
      { src: "/images/projects/urban-nest/pooja-1.jpg", kind: "photo", alt: "Pooja niche with an arched backlit marble wall, a brass figure on a wood drawer unit and a brass framed glass door etched with Om symbols, the kitchen beside it", width: 2000, height: 1334 },
      { src: "/images/projects/urban-nest/pooja-2.jpg", kind: "photo", alt: "Brass figure in a pooja niche with a yellow arched wall and a white knot pattern, seen through an etched glass door", width: 1333, height: 2000 },
    ],
  },
  {
    name: "",
    images: [
      { src: "/images/projects/urban-nest/balcony-1.jpg", kind: "photo", alt: "Sunlit balcony with a wooden chair draped in a green cloth, potted plants and leaf shadows falling on a warm plaster wall", width: 1334, height: 2000 },
    ],
  },
  {
    name: "",
    images: [
      { src: "/images/projects/urban-nest/bedroom-1.jpg", kind: "photo", alt: "Sitting corner with a grey armchair on a round jute rug, a green quilted stool, a small black bookshelf and a wall of grey wardrobe doors with black handles", width: 2000, height: 1332 },
    ],
  },
  {
    name: "",
    images: [
      { src: "/images/projects/urban-nest/study-1.jpg", kind: "photo", alt: "Study nook with a floating grey desk and a wooden chair, a tall grey wardrobe with a full length mirror and a dark wood door at the side", width: 2000, height: 1332 },
      { src: "/images/projects/urban-nest/study-2.jpg", kind: "photo", alt: "Wall mounted desk with a teal vase and shelf above, a wooden chair, and a tall grey and wood wardrobe with a mirrored door", width: 1332, height: 2000 },
    ],
  },
];

const shyamkutirRooms: Room[] = [
  {
    name: "",
    images: [
      { src: "/images/projects/shyamkutir/photos/kitchen-dining-1.jpg", kind: "photo", alt: "Dining table with a dark glass top and orange runner, upholstered chairs and a bench, with the white kitchen beyond", width: 2000, height: 1334 },
      { src: "/images/projects/shyamkutir/photos/kitchen-dining-2.jpg", kind: "photo", alt: "White kitchen seen across the dining table with pendant lamps, a vase of orange flowers and sheer curtains", width: 2000, height: 1334 },
      { src: "/images/projects/shyamkutir/photos/kitchen-dining-3.jpg", kind: "photo", alt: "Corner of the kitchen with white cabinets, black glass overhead units, a black counter and a pale green accent band", width: 1600, height: 2000 },
      { src: "/images/projects/shyamkutir/photos/kitchen-dining-4.jpg", kind: "photo", alt: "Kitchen wall with white tall cabinets, a black glass overhead unit and a counter with appliances", width: 1333, height: 2000 },
      { src: "/images/projects/shyamkutir/photos/kitchen-dining-5.jpg", kind: "photo", alt: "Kitchen counter detail with a woven basket of fruit on a colourful embroidered runner", width: 1333, height: 2000 },
    ],
  },
  {
    name: "",
    images: [
      { src: "/images/projects/shyamkutir/photos/reading-corner-1.jpg", kind: "photo", alt: "Informal sitting room with two cane chairs, a red throw, a study desk, built in storage and a large green plant", width: 2000, height: 1333 },
    ],
  },
  {
    name: "",
    images: [
      { src: "/images/projects/shyamkutir/photos/bedroom-one-1.jpg", kind: "photo", alt: "Bed with a taupe headboard backed by an open bookshelf, red and white cushions and a bedside table", width: 1600, height: 2000 },
      { src: "/images/projects/shyamkutir/photos/bedroom-one-2.jpg", kind: "photo", alt: "Bedroom with a shelf unit rising behind the headboard, red and white bedding and a cane armchair", width: 1334, height: 2000 },
      { src: "/images/projects/shyamkutir/photos/bedroom-one-3.jpg", kind: "photo", alt: "Dressing corner with a tall mirror, a small stool and a guitar beside the bed, on a herringbone floor", width: 1333, height: 2000 },
      { src: "/images/projects/shyamkutir/photos/bedroom-one-4.jpg", kind: "photo", alt: "Walk in wardrobe with open glass fronted shelving for shoes and a gilded mirror beside a potted plant", width: 1333, height: 2000 },
      { src: "/images/projects/shyamkutir/photos/bedroom-one-5.jpg", kind: "photo", alt: "Corner with a striped armchair, a round black side table, a plant and a patterned rug against a white wall", width: 1600, height: 2000 },
      { src: "/images/projects/shyamkutir/photos/bedroom-one-6.jpg", kind: "photo", alt: "Open wood shelving filled with books and ornaments, with a carved face figurine on a shelf", width: 1333, height: 2000 },
      { src: "/images/projects/shyamkutir/photos/bedroom-one-7.jpg", kind: "photo", alt: "Wood panelled wall with a gilded framed mirror beside a bookshelf and a potted plant", width: 1333, height: 2000 },
    ],
  },
  {
    name: "",
    images: [
      { src: "/images/projects/shyamkutir/photos/bedroom-two-1.jpg", kind: "photo", alt: "Bedroom with a pale blue upholstered headboard, block print bedding and round mirrors on the wall", width: 2000, height: 1333 },
      { src: "/images/projects/shyamkutir/photos/bedroom-two-2.jpg", kind: "photo", alt: "Bed with a pale blue headboard, a built in white drawer unit, a round woven rug and a fabric stool", width: 2000, height: 2000 },
      { src: "/images/projects/shyamkutir/photos/bedroom-two-3.jpg", kind: "photo", alt: "Bedroom with block print bedding and a white study desk, looking toward a pale blue wall and an open door", width: 2000, height: 1332 },
      { src: "/images/projects/shyamkutir/photos/bedroom-two-4.jpg", kind: "photo", alt: "Window seat with a pale blue bench, grey curtains and a colourful framed painting", width: 1449, height: 2000 },
      { src: "/images/projects/shyamkutir/photos/bedroom-two-5.jpg", kind: "photo", alt: "Passage with pale grey blue wardrobes, a door and a wooden coat stand beside a plant", width: 2000, height: 2000 },
    ],
  },
  {
    name: "",
    images: [
      { src: "/images/projects/shyamkutir/photos/balcony-1.jpg", kind: "photo", alt: "Balcony with a deep blue wall, cane chairs, woven stools, many potted plants and a patterned tile floor", width: 2000, height: 1866 },
      { src: "/images/projects/shyamkutir/photos/balcony-2.jpg", kind: "photo", alt: "Cane armchair with a teal cushion against a blue wall, among plants on a patterned tile floor", width: 1333, height: 2000 },
      { src: "/images/projects/shyamkutir/photos/balcony-3.jpg", kind: "photo", alt: "Round wicker chair beside a lattice screen hung with an embroidered textile, with large leafy plants", width: 1333, height: 2000 },
      { src: "/images/projects/shyamkutir/photos/balcony-4.jpg", kind: "photo", alt: "Pale blue wall with arched niches holding small lamps, with potted plants and a dark wood door", width: 1314, height: 2000 },
    ],
  },
  {
    name: "",
    images: [
      { src: "/images/projects/shyamkutir/photos/garden-pavilion-1.jpg", kind: "photo", alt: "Timber garden pavilion with a lit wood ceiling, surrounded by tropical plants and a shaded seating area", width: 2000, height: 1270 },
      { src: "/images/projects/shyamkutir/photos/garden-pavilion-2.jpg", kind: "photo", alt: "Wider view of the timber pavilion set in a lawn with mature trees and potted plants", width: 2000, height: 1125 },
    ],
  },
];

const shyamkutirDrawings: Drawing[] = [
  { src: "/images/projects/shyamkutir/plan.jpg", alt: "Floor plan of the Shyamkutir bungalow renovation", width: 1750, height: 1398 },
];

const polasRooms: Room[] = [
  {
    name: "",
    images: [
      { src: "/images/projects/polas-residence/photos/bedroom-1.jpg", kind: "photo", alt: "Bedroom with a low bed in white linen with a rust coloured throw, a white sliding wardrobe and cream curtains", width: 2000, height: 1333 },
      { src: "/images/projects/polas-residence/photos/bedroom-2.jpg", kind: "photo", alt: "Bedroom wall with floating wood display boxes, a wood sideboard, a tall window with curtains and a dark wood floor", width: 2000, height: 1333 },
      { src: "/images/projects/polas-residence/photos/bedroom-3.jpg", kind: "photo", alt: "Lit wood display boxes above a walnut sideboard, with a bed edge and a small wooden figure on a rug in the foreground", width: 1600, height: 2000 },
    ],
  },
];

const polasDrawings: Drawing[] = [
  { src: "/images/projects/polas-residence/plans.png", alt: "Ground and first floor plans of Pola's Residence", width: 612, height: 593 },
];

export const seedProjects: Project[] = [
  {
    id: "james-residence",
    slug: "james-residence",
    title: "James Residence",
    subtitle: "A three bedroom home for three generations",
    location: "Hennur, Bangalore",
    year: 2023,
    area: "1,250 sq ft",
    status: "Completed",
    scope: "Interior",
    summary: "A modern, minimalist three bedroom apartment for a family of three generations in Hennur, Bangalore.",
    description:
      "Located in Hennur, Bangalore, this three bedroom apartment was designed with a modern, minimalist approach for a family of three generations living under one roof. The aim was to keep it simple, elegant and impactful.",
    coverImage: "/images/projects/james-residence/photos/kitchen-dining-1.jpg",
    rooms: jamesRooms,
    drawings: jamesDrawings,
    gallery: galleryOf(jamesRooms),
    featured: true,
    order: 0,
    published: true,
  },
  {
    id: "ashiyana",
    slug: "ashiyana",
    title: "Ashiyana",
    location: "Karle Vario homes, Bangalore",
    year: 2026,
    area: "1,200 sq ft",
    status: "Completed",
    scope: "Interior",
    summary: "A residential interior with a pink plaster living room, a carved white mural and a kitchen framed by a timber arch.",
    description:
      "A residential interior with a living room finished in pink plaster, a dining area with a carved white mural, a kitchen with a timber arch and a painted pink counter, a children's room with two daybeds and a pegboard desk, and two bedrooms.",
    coverImage: "/images/projects/ashiyana/living-1.jpg",
    rooms: ashiyanaRooms,
    drawings: [],
    gallery: galleryOf(ashiyanaRooms),
    featured: true,
    order: 1,
    published: true,
  },
  {
    id: "urban-nest",
    slug: "urban-nest",
    title: "Urban Nest",
    location: "Kumar Kino Platinum apartments, Bangalore",
    year: 2025,
    area: "1,500 sq ft",
    status: "Completed",
    scope: "Interior",
    summary: "A residential interior with a grey plaster TV wall, a backlit arched pooja niche and a sunlit balcony.",
    description:
      "A residential interior with a grey plaster TV wall, a wooden dining table, a kitchen with white and sage green cabinets, a backlit arched pooja niche, a sunlit balcony, a bedroom with grey wardrobes and a study nook.",
    coverImage: "/images/projects/urban-nest/living-1.jpg",
    rooms: urbanNestRooms,
    drawings: [],
    gallery: galleryOf(urbanNestRooms),
    featured: true,
    order: 2,
    published: true,
  },
  {
    id: "shyamkutir",
    slug: "shyamkutir",
    title: "Shyamkutir",
    subtitle: "A renovation for two sisters, two sensibilities",
    location: "Bungalow, Ballari",
    year: 2025,
    area: "6,200 sq ft",
    status: "Completed",
    scope: "Architecture & Interior",
    summary: "An architectural renovation and interior project in Ballari, adding two bedrooms and a gym to an existing bungalow.",
    description:
      "An architectural renovation and interior project in Ballari. The brief was to add two bedrooms and a gym to an existing bungalow and refurbish its formal and informal living spaces. The design holds the contrasting tastes of two sisters, one drawn to earthy tones with a traditional touch, the other to contemporary, minimal aesthetics.",
    coverImage: "/images/projects/shyamkutir/photos/kitchen-dining-1.jpg",
    rooms: shyamkutirRooms,
    drawings: shyamkutirDrawings,
    gallery: galleryOf(shyamkutirRooms),
    featured: true,
    order: 3,
    published: true,
  },
  {
    id: "polas-residence",
    slug: "polas-residence",
    title: "Pola's Bungalow",
    location: "Bungalow, Ballari",
    year: 2024,
    area: "2,500 sq ft",
    status: "Completed",
    scope: "Interior",
    summary: "A residential interior for a bungalow in Ballari, Karnataka.",
    description: "A residential interior for a bungalow in Ballari, Karnataka.",
    coverImage: "/images/projects/polas-residence/photos/bedroom-1.jpg",
    rooms: polasRooms,
    drawings: polasDrawings,
    gallery: galleryOf(polasRooms),
    featured: true,
    order: 4,
    published: true,
  },
];
