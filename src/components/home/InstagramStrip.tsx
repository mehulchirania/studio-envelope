import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { instagramPosts } from "@/lib/instagram";
import { site } from "@/lib/site";

/** Small grid of recent Instagram tiles linking out to the studio's profile.
 * Source images are 512px squares, so tiles stay small on the page. */
export default function InstagramStrip() {
  const posts = instagramPosts.slice(0, 6);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <p className="label">On Instagram</p>
        <Link
          href={site.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="link-arrow"
        >
          {site.socials.instagramHandle} <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
        {posts.map((post) => (
          <a
            key={post.slug}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-square overflow-hidden bg-paper-2"
          >
            <Image
              src={post.image}
              alt={post.description}
              width={512}
              height={512}
              sizes="(max-width: 640px) 33vw, 200px"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
