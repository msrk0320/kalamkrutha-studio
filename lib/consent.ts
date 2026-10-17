"use client";

import { useSyncExternalStore } from "react";

export type Consent = "granted" | "denied" | null;

const KEY = "kds-analytics-consent";
const EVENT = "kds-consent-change";

function read(): Consent {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: Exclude<Consent, null>): void {
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    // Storage blocked: the choice applies to this page view only.
  }
  memory = value;
  window.dispatchEvent(new Event(EVENT));
}

let memory: Consent = null;

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Analytics consent; "unknown" during server render and hydration. */
export function useConsent(): Consent | "unknown" {
  return useSyncExternalStore(
    subscribe,
    () => read() ?? memory,
    () => "unknown" as const,
  );
}
