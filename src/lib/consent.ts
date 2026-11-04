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

export function setConsent(value: Exclude<Consent, null>): void {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // Storage blocked: the choice just won't persist.
  }
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
