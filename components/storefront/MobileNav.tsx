"use client";

import { Fragment, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NAV_ITEMS, type NavItem } from "./nav-items";

interface CategoryOption {
  slug: string;
  nameAz: string;
  nameRu: string;
}

const ICONS: Record<NavItem["key"], string> = { home: "⌂", lookbook: "✦", calculator: "#", about: "☏" };
// "Haqqımızda" becomes the shorter "Əlaqə" on the mobile tab bar — see CLAUDE.md "Navigation".
const MOBILE_LABEL_KEY: Record<NavItem["key"], string> = { home: "home", lookbook: "lookbook", calculator: "calculator", about: "contact" };

export function MobileNav({ categories }: { categories: CategoryOption[] }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("nav");

  return (
    <>
      {sheetOpen && (
        <div className="fixed inset-0 z-30 md:hidden" role="dialog" aria-label={t("categories")}>
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-inverse-surface/40"
            onClick={() => setSheetOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest rounded-t-lg p-4 max-h-[70vh] overflow-y-auto">
            <p className="text-title-lg mb-3">{t("categories")}</p>
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/${category.slug}`}
                    onClick={() => setSheetOpen(false)}
                    className="block py-2 text-body-md text-on-surface"
                  >
                    {locale === "ru" ? category.nameRu : category.nameAz}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-surface-container-lowest border-t border-outline-variant flex md:hidden">
        {NAV_ITEMS.map((item) => (
          <Fragment key={item.key}>
            <Link href={item.href} className="flex-1 flex flex-col items-center py-2 text-label-sm text-on-surface-variant">
              <span>{ICONS[item.key]}</span>
              {t(MOBILE_LABEL_KEY[item.key])}
            </Link>
            {item.key === "home" && (
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="flex-1 flex flex-col items-center py-2 text-label-sm text-on-surface-variant"
              >
                <span>▤</span>
                {t("categories")}
              </button>
            )}
          </Fragment>
        ))}
      </nav>
    </>
  );
}
