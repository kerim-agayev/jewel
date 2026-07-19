"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

interface CategoryOption {
  slug: string;
  nameAz: string;
  nameRu: string;
}

export function CategoriesDropdown({ categories, label }: { categories: CategoryOption[]; label: string }) {
  const [open, setOpen] = useState(false);
  const locale = useLocale();

  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        aria-expanded={open}
        className="text-label-md text-on-surface hover:text-secondary"
      >
        {label}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-surface-container-lowest border border-outline-variant rounded-sm shadow-lg py-2 min-w-[180px] z-20">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-label-md text-on-surface hover:bg-surface-container"
            >
              {locale === "ru" ? category.nameRu : category.nameAz}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
