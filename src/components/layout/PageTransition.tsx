import { ViewTransition, type ReactNode } from "react";

/**
 * Wraps a page's content so navigating to or from it crossfades (old page fades
 * out, new one fades in; see the `.page-in` / `.page-out` rules in globals.css).
 * Built on the browser's View Transitions API: browsers without it simply
 * navigate normally. Put it in each page.tsx, not a layout, because layouts
 * persist across navigations and never fire enter/exit.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      {children}
    </ViewTransition>
  );
}
