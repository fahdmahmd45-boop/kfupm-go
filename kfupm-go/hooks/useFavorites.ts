"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "kfupm-go:favorites";

function readStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Read localStorage only after mount to avoid SSR/client hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavoriteIds(readStorage());
     
    setHydrated(true);
  }, []);

  const persist = useCallback((ids: string[]) => {
    setFavoriteIds(ids);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // localStorage unavailable (private browsing, quota, etc.) — fail silently
    }
  }, []);

  const toggleFavorite = useCallback(
    (id: string) => {
      const next = favoriteIds.includes(id)
        ? favoriteIds.filter((f) => f !== id)
        : [...favoriteIds, id];
      persist(next);
    },
    [favoriteIds, persist]
  );

  const isFavorite = useCallback((id: string) => favoriteIds.includes(id), [favoriteIds]);

  return { favoriteIds, isFavorite, toggleFavorite, hydrated };
}
