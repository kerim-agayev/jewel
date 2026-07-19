"use client";

import { useFavorites } from "@/lib/favorites";

export function FavoriteButton({ code, className }: { code: string; className?: string }) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(code);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Sevimlilərdən çıxar" : "Sevimlilərə əlavə et"}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(code);
      }}
      className={className}
    >
      {active ? "♥" : "♡"}
    </button>
  );
}
