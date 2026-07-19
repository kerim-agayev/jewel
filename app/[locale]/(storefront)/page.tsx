import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCategories } from "@/lib/queries/categories";
import { getNewArrivals } from "@/lib/queries/products";
import { getStore } from "@/lib/queries/store";
import { ProductCard } from "@/components/storefront/ProductCard";
import { WhatsAppFab } from "@/components/storefront/WhatsAppFab";

export default async function HomePage() {
  const t = await getTranslations("home");
  const locale = await getLocale();
  const [categories, { products, goldPrice }, store] = await Promise.all([
    getCategories(),
    getNewArrivals(8),
    getStore(),
  ]);

  return (
    <>
      <section className="max-w-(--spacing-container-max) mx-auto px-(--spacing-margin-mobile) md:px-(--spacing-margin-desktop) py-16 md:py-24 text-center">
        <h1 className="font-(family-name:--font-display-lg-mobile) md:font-(family-name:--font-display-lg) text-display-lg-mobile md:text-display-lg text-on-surface">
          {t("heroTitle")} <span className="text-secondary">{t("heroTitleAccent")}</span>
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-body-lg text-on-surface-variant">{t("heroSubtitle")}</p>
        <Link
          href="/uzukler"
          className="inline-block mt-8 px-8 py-3 rounded-sm bg-secondary text-on-secondary text-label-md"
        >
          {t("heroCta")}
        </Link>
      </section>

      <section className="max-w-(--spacing-container-max) mx-auto px-(--spacing-margin-mobile) md:px-(--spacing-margin-desktop) py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-title-lg text-on-surface">{t("trust1Title")}</p>
          <p className="text-label-md text-on-surface-variant">{t("trust1Sub")}</p>
        </div>
        <div>
          <p className="text-title-lg text-on-surface">{t("trust2Title")}</p>
          <p className="text-label-md text-on-surface-variant">{t("trust2Sub")}</p>
        </div>
        <div>
          <p className="text-title-lg text-on-surface">{t("trust3Title")}</p>
          <p className="text-label-md text-on-surface-variant">{t("trust3Sub")}</p>
        </div>
      </section>

      <section className="max-w-(--spacing-container-max) mx-auto px-(--spacing-margin-mobile) md:px-(--spacing-margin-desktop) py-8">
        <h2 className="font-(family-name:--font-headline-sm) text-headline-sm text-on-surface mb-6">
          {t("categoriesHeading")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className="rounded-sm bg-surface-container-low p-6 text-center hover:bg-surface-container"
            >
              <p className="text-body-md text-on-surface">{locale === "ru" ? category.nameRu : category.nameAz}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-(--spacing-container-max) mx-auto px-(--spacing-margin-mobile) md:px-(--spacing-margin-desktop) py-8 pb-24 md:pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-(family-name:--font-headline-sm) text-headline-sm text-on-surface">
            {t("newArrivalsHeading")}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.code} product={product} goldPricePerGramAZN={goldPrice} />
          ))}
        </div>
      </section>

      <WhatsAppFab store={store} />
    </>
  );
}
