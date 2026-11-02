/** Studio-wide facts used across the site. Keep in sync with the brief —
 * do not invent claims, awards, clients or numbers not listed there. */
export const site = {
  name: "Studio Envelope",
  tagline: "Architecture & Interior Design, Bangalore",
  description:
    "Studio Envelope is an architecture and interior design studio based in Bangalore, led by Ar. Prachi Chirania.",
  principal: {
    name: "Ar. Prachi Chirania",
    role: "Founder and Creative Director",
    bio: [
      "Founder and Creative Director, Prachi Chirania graduated from RV College of Architecture and went on to pursue her Masters at her esteemed alma mater CEPT University, Ahmedabad. She founded the studio as a result of her passion for creative spaces and travel with the resolution to create timeless, meaningful spaces.",
      "For Prachi, every project is an opportunity to explore a new perspective, discover unexpected possibilities and create spaces that feel deeply connected to the people who would experience it.",
    ],
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
  whyEnvelope: {
    heading: "Why an Envelope?",
    paragraphs: [
      "At Studio Envelope, we believe good design begins with understanding the people it is created for. Much like an envelope holds something personal, we see every space as an expression of the people who inhabit it; their personalities, preferences, routines and aspirations.",
      "Our approach is personal and collaborative. We don't subscribe to a fixed design style; instead, we explore a design language that responds to each client's vision, the context and the possibilities of the space. Through thoughtful planning, considered material choices and attention to detail, we bring functionality and aesthetics together to create spaces that feel natural, individual and meaningful.",
      "From demolition and construction to the finer details of carpentry, furniture, lighting and styling, we take a hands on approach to the entire process, ensuring continuity from the initial concept to the final execution.",
      "Based in Bangalore, we undertake projects across India. By consciously limiting the number of projects we take on each year, we remain closely involved in every detail, giving each space the time, thought and attention it deserves.",
    ],
  },
  socials: {
    instagram: "https://www.instagram.com/studio__envelope/",
    instagramHandle: "@studio__envelope",
  },
} as const;

/** The 10 service inclusions, grouped as in the brief. */
export const services = {
  design: ["Design Consultation", "Space Planning", "Colour Consultation", "Lighting Consultation", "Material Selection"],
  furnishAndStyle: ["Furniture Selection", "Soft Furnishing", "Décor Consultation"],
  deliver: ["Project Management", "Photo & Video Shoot"],
} as const;
