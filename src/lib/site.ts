export const site = {
  name: "Studio Envelope",
  tagline: "Here to design experiences",
  disciplines: ["Art", "Architecture", "Interior Design"],
  description:
    "Studio Envelope is an architecture and interior design practice crafting spaces that are felt as much as they are seen.",
  principal: { name: "Ar. Prachi Chirania", role: "Creative Head & Principal Architect", instagram: "https://www.instagram.com/prachichirania/" },
  contact: {
    phone: "+91 96632 74949",
    phoneHref: "tel:+919663274949",
    whatsapp: "https://wa.me/919663274949",
    email: "hello@studioenvelope.in", // TODO: confirm real email
    location: "India", // TODO: confirm city
  },
  // Home hero background. Replace with a real studio photo (e.g. a Vercel Blob URL).
  heroImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2400&q=80",
  socials: {
    instagram: "https://www.instagram.com/studio__envelope/",
  },
} as const;
