import type { Prisma } from "@/app/generated/prisma/client";
import { getTranslations } from "next-intl/server";
import NextLink from "next/link";
import { Link } from "@/i18n/navigation";
import { NAV_ITEMS } from "./nav-items";
import { GoldTicker } from "./GoldTicker";
import { CategoriesDropdown } from "./CategoriesDropdown";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { FavoritesLink } from "./FavoritesLink";
import { MobileNav } from "./MobileNav";

interface CategoryOption {
  slug: string;
  nameAz: string;
  nameRu: string;
}

interface HeaderProps {
  categories: CategoryOption[];
  goldPricePerGramAZN: Prisma.Decimal;
}

export async function Header({ categories, goldPricePerGramAZN }: HeaderProps) {
  const t = await getTranslations("nav");

  return (
    <>
      <header className="sticky top-0 z-10 bg-surface">
        <GoldTicker goldPricePerGramAZN={goldPricePerGramAZN} />
        <div className="max-w-(--spacing-container-max) mx-auto flex items-center justify-between px-(--spacing-margin-mobile) md:px-(--spacing-margin-desktop) py-4">
          <Link href="/" className="font-(family-name:--font-headline-sm) text-headline-sm text-on-surface">
            Anar Jewellery
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-label-md text-on-surface hover:text-secondary">
              {t("home")}
            </Link>
            <CategoriesDropdown categories={categories} label={t("categories")} />
            {NAV_ITEMS.filter((item) => item.key !== "home").map((item) => (
              <Link key={item.key} href={item.href} className="text-label-md text-on-surface hover:text-secondary">
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher className="hidden md:flex" />
            <FavoritesLink label={t("favorites")} className="text-title-lg text-on-surface" />
            {/* Plain (non-locale-prefixed) link — /admin lives outside [locale], see docs/phase_1/decisions.md */}
            <NextLink href="/admin/login" aria-label={t("adminLogin")} className="text-body-md text-on-surface-variant">
              ◎
            </NextLink>
          </div>
        </div>
      </header>
      <MobileNav categories={categories} />
    </>
  );
}
