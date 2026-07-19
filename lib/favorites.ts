"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "anar-favorites";
const CHANGE_EVENT = "favorites-changed";

// useSyncExternalStore requires a stable (referentially unchanged) snapshot
// when the underlying value hasn't actually changed — re-parsing JSON on
// every call would return a new array each time and trigger an infinite loop.
const EMPTY_CODES: string[] = [];
let cachedRaw: string | null = null;
let cachedCodes: string[] = EMPTY_CODES;

function readCodes(): string[] {
  if (typeof window === "undefined") return EMPTY_CODES;

  const raw = localStorage.getItem(STORAGE_KEY) ?? "[]";
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedCodes = JSON.parse(raw);
    } catch {
      cachedCodes = EMPTY_CODES;
    }
  }
  return cachedCodes;
}

function writeCodes(codes: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getServerSnapshot(): string[] {
  return EMPTY_CODES;
}

/**
 * Favorites are a plain `Product.code` list in localStorage — no DB model,
 * no account system. See CLAUDE.md "Clarifying the four icons".
 */
export function useFavorites() {
  const codes = useSyncExternalStore(subscribe, readCodes, getServerSnapshot);

  const toggle = useCallback((code: string) => {
    const current = readCodes();
    const next = current.includes(code) ? current.filter((c) => c !== code) : [...current, code];
    writeCodes(next);
  }, []);

  return { codes, toggle, isFavorite: (code: string) => codes.includes(code) };
}
