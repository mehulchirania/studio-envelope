/** Studio-wide facts used across the site. Keep in sync with the brief —
 * do not invent claims, awards, clients or numbers not listed there. */
export const site = {
  name: "Studio Envelope",
  tagline: "Architecture & Interior Design, Bangalore",
  description:
    "Studio Envelope is an architecture and interior design studio based in Bangalore, led by Ar. Prachi Chirania Bhalotia.",
  principal: {
    name: "Ar. Prachi Chirania Bhalotia",
    role: "Principal Architect",
    instagram: "https://www.instagram.com/prachichirania/",
    instagramHandle: "@prachichirania",
  },
  contact: {
    phone: "+91 96632 74949",
    phoneHref: "tel:+919663274949",
    whatsapp: "https://wa.me/919663274949",
    email: "studioenvelope.info@gmail.com",
    location: "Bangalore, India",
  },
  socials: {
    instagram: "https://www.instagram.com/studio__envelope/",
    instagramHandle: "@studio__envelope",
  },
  conceptualNote:
    'The name "Studio Envelope" evokes warmth, authenticity, and intentionality. Our studio delivers spaces that are thoughtful and personal, much like the cherished messages enclosed in an envelope. At our studio, we embrace this symbolism by creating cohesive spaces with innovative design solutions that seamlessly blend creativity, precision, and purpose — wrapped with love and passion, reflecting your unique personality and needs. We focus on innovative thinking and meticulous planning to ensure harmony between functionality and aesthetics. Through our work, we create spaces that feel like heartfelt messages — crafted with care to bring joy.',
} as const;

/** The 10 service inclusions, grouped as in the brief. */
export const services = {
  design: ["Design Consultation", "Space Planning", "Colour Consultation", "Lighting Consultation", "Material Selection"],
  furnishAndStyle: ["Furniture Selection", "Soft Furnishing", "Décor Consultation"],
  deliver: ["Project Management", "Photo & Video Shoot"],
} as const;
