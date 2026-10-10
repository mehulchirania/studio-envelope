"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Small back-to-top link that appears once the visitor has scrolled a while. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <a href="#page-top" aria-label="Back to top" className="back-to-top">
      <ArrowUp size={19} />
    </a>
  );
}
