"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type AdminTheme = "light" | "dark";

const STORAGE_KEY = "admin-theme";

interface ThemeContextValue {
  theme: AdminTheme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: "light", toggle: () => {} });

export const useAdminTheme = () => useContext(ThemeContext);

/**
 * Wraps every admin screen. Light is the default; the choice to use the dark theme is remembered in
 * this browser only. Styling lives in admin.css under `.admin-root[data-theme]`.
 */
export default function AdminThemeRoot({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AdminTheme>("light");

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "dark") {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- read the saved choice once after mount
        setTheme("dark");
      }
    } catch {
      /* storage blocked: stay on light */
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: AdminTheme = current === "dark" ? "light" : "dark";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* not remembered, still applied */
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);

  return (
    <ThemeContext.Provider value={value}>
      <div className="admin-root" data-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
