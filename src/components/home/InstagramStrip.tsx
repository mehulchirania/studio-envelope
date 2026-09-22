import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { instagramPosts } from "@/lib/instagram";
import { site } from "@/lib/site";

/** Bone band, edge-to-edge: the header row sits in the container, but the
 * 6-tile grid runs full-bleed with hairline-thin gaps and a hover zoom. */
export default function InstagramStrip() {
  const posts = instagramPosts.slice(0, 6);

  return (
    <section className="band-bone">
      <div className="container-x pt-[clamp(56px,6vw,104px)]">
        <div className="flex flex-wrap items-end justify-between gap-6 pb-8 sm:pb-10">
          <p className="label">On Instagram</p>
          <Link
            href={site.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="link-arrow"
            data-cursor="view"
          >
            {site.socials.instagramHandle} <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 sm:grid-cols-6">
        {posts.map((post) => (
          <a
            key={post.slug}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-square overflow-hidden bg-paper-2"
            data-cursor="view"
          >
            <Image
              src={post.image}
              alt={post.description}
              width={512}
              height={512}
              sizes="(max-width: 640px) 33vw, 17vw"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          </a>
        ))}
      </div>

      <div className="h-[clamp(56px,6vw,104px)]" />
    </section>
  );
}
