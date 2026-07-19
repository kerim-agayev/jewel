import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { permanentRedirect } from "@/i18n/navigation";
import { getProductByCode, getSimilarProducts } from "@/lib/queries/products";
import { getEffectiveGoldPrice } from "@/lib/queries/gold-price";
import { resolveProductPrice, getWeightBasedPriceBreakdown } from "@/lib/pricing";
import { formatAZN, waLink } from "@/lib/format";
import { karatLabel } from "@/lib/purity";
import { ProductGallery } from "@/components/storefront/ProductGallery";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ContactCta } from "@/components/storefront/ContactCta";
import { getStore } from "@/lib/queries/store";

interface ProductPageProps {
  params: Promise<{ locale: string; category: string; code: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { code, locale } = await params;
  const product = await getProductByCode(code);
  if (!product) return {};

  const goldPrice = await getEffectiveGoldPrice();
  const price = resolveProductPrice(product, goldPrice);
  const title = locale === "ru" ? product.titleRu : product.titleAz;
  const image = product.images[0];

  return {
    title: `${title} — Anar Jewellery`,
    description: `${formatAZN(price)} — Anar Jewellery`,
    openGraph: {
      title,
      description: formatAZN(price),
      images: image ? [{ url: image.url }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category: categorySlug, code } = await params;
  const t = await getTranslations();
  const locale = await getLocale();
  const store = await getStore();

  const product = await getProductByCode(code);
  if (!product) notFound();

  if (product.category.slug !== categorySlug) {
    permanentRedirect({ href: `/${product.category.slug}/${code}`, locale });
  }

  const goldPrice = await getEffectiveGoldPrice();
  const price = resolveProductPrice(product, goldPrice);
  const showBreakdown = product.pricingMode === "WEIGHT_BASED" && product.priceOverride == null;
  const breakdown = showBreakdown ? getWeightBasedPriceBreakdown(product, goldPrice) : null;

  const { products: similar, goldPrice: similarGoldPrice } = await getSimilarProducts(product.categoryId, product.id, 4);

  const title = locale === "ru" ? product.titleRu : product.titleAz;
  const description = locale === "ru" ? product.descriptionRu : product.descriptionAz;
  const categoryName = locale === "ru" ? product.category.nameRu : product.category.nameAz;

  return (
    <div className="max-w-(--spacing-container-max) mx-auto px-(--spacing-margin-mobile) md:px-(--spacing-margin-desktop) py-8 pb-16">
      <div className="grid md:grid-cols-2 gap-8">
        <ProductGallery
          images={product.images.map((img) => ({ url: img.url, alt: locale === "ru" ? img.altRu : img.altAz }))}
        />

        <div>
          <h1 className="font-(family-name:--font-headline-sm) text-headline-sm text-on-surface">
            {title}
            {product.purity != null && <span className="text-on-surface-variant"> ({karatLabel(product.purity)})</span>}
          </h1>
          {description && <p className="mt-3 text-body-md text-on-surface-variant">{description}</p>}

          {breakdown ? (
            <div className="mt-6 rounded-sm bg-gradient-to-br from-gold-light/40 to-secondary-container p-5">
              <p className="font-(family-name:--font-headline-sm) text-headline-sm text-secondary">{formatAZN(breakdown.finalPrice)}</p>
              <dl className="mt-4 space-y-1 text-body-md text-on-surface-variant">
                <div className="flex justify-between">
                  <dt>{t("product.goldValue")} ({product.weightGrams?.toString()} qr)</dt>
                  <dd>{formatAZN(breakdown.goldValue)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>{t("product.laborCost")}</dt>
                  <dd>{formatAZN(breakdown.laborCost)}</dd>
                </div>
                {breakdown.stoneCost.greaterThan(0) && (
                  <div className="flex justify-between">
                    <dt>
                      {t("product.stoneCost")} {product.stoneType ? `(${product.stoneType})` : ""}
                    </dt>
                    <dd>{formatAZN(breakdown.stoneCost)}</dd>
                  </div>
                )}
              </dl>
            </div>
          ) : (
            <p className="mt-6 font-(family-name:--font-headline-sm) text-headline-sm text-secondary">{formatAZN(price)}</p>
          )}

          {store.whatsapp && (
            <ContactCta
              href={waLink(store.whatsapp)}
              channel="WHATSAPP"
              productId={product.id}
              newTab
              className="mt-6 block w-full text-center py-3 rounded-sm bg-[#25D366] text-white text-label-md"
            >
              {t("common.whatsappCta")}
            </ContactCta>
          )}

          <table className="mt-8 w-full text-body-md">
            <tbody>
              <tr className="odd:bg-surface-container-low">
                <td className="py-2 px-3 text-on-surface-variant">{t("product.category")}</td>
                <td className="py-2 px-3 text-on-surface">{categoryName}</td>
              </tr>
              {product.purity != null && (
                <tr className="odd:bg-surface-container-low">
                  <td className="py-2 px-3 text-on-surface-variant">{t("category.purity")}</td>
                  <td className="py-2 px-3 text-on-surface">
                    {product.purity} ({karatLabel(product.purity)})
                  </td>
                </tr>
              )}
              {product.weightGrams != null && (
                <tr className="odd:bg-surface-container-low">
                  <td className="py-2 px-3 text-on-surface-variant">{t("product.weight")}</td>
                  <td className="py-2 px-3 text-on-surface">{product.weightGrams.toString()} qr</td>
                </tr>
              )}
              {product.stoneType && (
                <tr className="odd:bg-surface-container-low">
                  <td className="py-2 px-3 text-on-surface-variant">{t("category.stoneType")}</td>
                  <td className="py-2 px-3 text-on-surface">{product.stoneType}</td>
                </tr>
              )}
              <tr className="odd:bg-surface-container-low">
                <td className="py-2 px-3 text-on-surface-variant">{t("category.status")}</td>
                <td className="py-2 px-3 text-on-surface">{t(`productStatus.${product.status}`)}</td>
              </tr>
              <tr className="odd:bg-surface-container-low">
                <td className="py-2 px-3 text-on-surface-variant">{t("product.code")}</td>
                <td className="py-2 px-3 text-on-surface">{product.code}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="font-(family-name:--font-headline-sm) text-headline-sm text-on-surface mb-6">
            {t("product.similarHeading")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {similar.map((item) => (
              <ProductCard key={item.code} product={item} goldPricePerGramAZN={similarGoldPrice} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
