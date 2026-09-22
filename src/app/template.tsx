import PageTransition from "@/components/motion/PageTransition";

/** Given a fresh key per route by Next.js, so PageTransition (a client
 * component) remounts on every navigation and its transition replays. See
 * src/components/motion/PageTransition.tsx. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
