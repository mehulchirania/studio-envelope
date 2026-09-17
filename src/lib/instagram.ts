/** Public profile and post previews retrieved from @studio__envelope on 2026-09-17.
 * Labels describe visible imagery, not unverified client/project names.
 * Full post captions were login-gated. Dates are publication dates, not completion dates.
 */
export const instagramPosts = [
  { slug: "arched-pooja", title: "An arch for everyday rituals", image: "/images/instagram/arched-pooja.jpg", date: "2026-09-14", code: "DdTDETLgbRr", description: "An arched pooja corner sits beside a low media console, framed by warm wood tones and a patterned screen." },
  { slug: "living-wall", title: "A wall with quiet character", image: "/images/instagram/living-wall.jpg", date: "2026-09-13", code: "DdPKb2ugedq", description: "A pale textured wall meets a warm decorative panel, with a floating console keeping the composition light." },
  { slug: "jaali-dining", title: "Pattern, light & gathering", image: "/images/instagram/jaali-dining.jpg", date: "2026-09-11", code: "DdKaKQzExzx", description: "An intricate white screen frames a glimpse of the dining area, bringing pattern and depth to the threshold." },
  { slug: "artful-kitchen", title: "Art at the heart of the home", image: "/images/instagram/artful-kitchen.jpg", date: "2026-09-10", code: "DdGqVilAYhL", description: "A pink illustrated counter brings a playful focal point to a cream kitchen, framed by a gently curved opening." },
  { slug: "warm-living", title: "A softer place to pause", image: "/images/instagram/warm-living.jpg", date: "2026-09-08", code: "DdDjRH9ASAR", description: "A softly textured wall, curved seating and floral cushions create a warm, layered sitting corner." },
  { slug: "layered-bedroom", title: "Layers of rest", image: "/images/instagram/layered-bedroom.jpg", date: "2026-09-07", code: "Dc_oQS7Ad2B", description: "Patterned wardrobe panels, a warm headboard and textured bedding bring a rich yet restful rhythm to the bedroom." },
  { slug: "sunlit-bedroom", title: "Morning, gently framed", image: "/images/instagram/sunlit-bedroom.jpg", date: "2026-08-27", code: "DcjXILBAYT1", description: "Sunlight grazes a bedside mirror and floral artwork, revealing the quiet details around the bed." },
  { slug: "study-corner", title: "Space for a little focus", image: "/images/instagram/study-corner.jpg", date: "2026-08-24", code: "Dcc-abrges4", description: "A compact floating desk and open shelves sit beside full-height storage, making room for work within the bedroom." },
].map(post => ({ ...post, url: `https://www.instagram.com/studio__envelope/p/${post.code}/` }));
