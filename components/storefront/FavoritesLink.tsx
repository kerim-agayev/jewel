"use client";

import { useFavorites } from "@/lib/favorites";
import { Link } from "@/i18n/navigation";

export function FavoritesLink({ label, className }: { label: string; className?: string }) {
  const { codes } = useFavorites();

  return (
    <Link href="/favoriler" aria-label={label} className={`relative ${className ?? ""}`}>
      ♥
      {codes.length > 0 && (
        <span className="absolute -top-1.5 -right-2 bg-secondary text-on-secondary text-[10px] leading-none rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5">
          {codes.length}
        </span>
      )}
    </Link>
  );
}
