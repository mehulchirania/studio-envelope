import { useSyncExternalStore } from "react";

export type Consent = "granted" | "denied" | null;

const KEY = "se-consent";
const EVENT = "se-consent-change";

function read(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/** Expire Google Analytics cookies (_ga, _gid, _ga_*) for this host and its parent domains. */
export function clearAnalyticsCookies(): void {
  if (typeof document === "undefined") return;
  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((n) => n === "_ga" || n === "_gid" || n.startsWith("_ga_"));
  const parts = location.hostname.split(".");
  const domains = [undefined, location.hostname];
  for (let i = 1; i < parts.length - 1; i++) domains.push("." + parts.slice(i).join("."));
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

export function setConsent(value: Exclude<Consent, null>): void {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // Storage blocked: the choice just won't persist.
  }
  if (value === "denied") clearAnalyticsCookies();
  window.dispatchEvent(new Event(EVENT));
}

/** Forget the stored choice so the banner asks again (the footer's "Cookie settings" link). */
export function resetConsent(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Storage blocked: nothing stored to forget.
  }
  clearAnalyticsCookies();
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** The visitor's analytics-cookie choice; `null` until they decide. Always `"denied"`-like
 * (null) on the server, so nothing tracks before the client has read the stored choice. */
export function useConsent(): Consent {
  return useSyncExternalStore(subscribe, read, () => null);
}
