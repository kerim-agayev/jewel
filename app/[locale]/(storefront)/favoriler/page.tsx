"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useFavorites } from "@/lib/favorites";
import { getFavoriteProducts, type FavoriteProductSummary } from "@/lib/favorites-actions";
import { FavoriteButton } from "@/components/storefront/FavoriteButton";

export default function FavoritesPage() {
  const { codes } = useFavorites();
  const [products, setProducts] = useState<FavoriteProductSummary[]>([]);
  const locale = useLocale();
  const t = useTranslations("favorites");

  useEffect(() => {
    getFavoriteProducts(codes).then(setProducts);
  }, [codes]);

  return (
    <div className="max-w-(--spacing-container-max) mx-auto px-(--spacing-margin-mobile) md:px-(--spacing-margin-desktop) py-12 pb-24 md:pb-16">
      <h1 className="font-(family-name:--font-headline-sm) text-headline-sm text-on-surface mb-6">{t("heading")}</h1>

      {codes.length === 0 ? (
        <p className="text-body-md text-on-surface-variant">{t("empty")}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.code} href={`/${product.categorySlug}/${product.code}`} className="group block">
              <div className="relative aspect-square rounded-sm overflow-hidden bg-surface-container-low">
                {product.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element -- external Pexels/R2 URL
                  <img
                    src={product.imageUrl}
                    alt={locale === "ru" ? (product.imageAltRu ?? "") : (product.imageAltAz ?? "")}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                  />
                )}
                <FavoriteButton
                  code={product.code}
                  className="absolute top-2 right-2 text-title-lg text-on-surface bg-surface-container-lowest/80 rounded-full w-8 h-8 flex items-center justify-center"
                />
              </div>
              <p className="mt-2 text-body-md text-on-surface">{locale === "ru" ? product.titleRu : product.titleAz}</p>
              <p className="font-(family-name:--font-headline-sm) text-title-lg text-secondary mt-1">
                {product.priceFormatted}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
