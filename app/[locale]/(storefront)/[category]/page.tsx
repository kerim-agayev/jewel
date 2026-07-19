import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MetalType, ProductStatus } from "@/app/generated/prisma/client";
import { getProductsByCategory, type ProductSort } from "@/lib/queries/products";
import { parseCategorySearchParams } from "@/lib/category-filters";
import { ProductCard } from "@/components/storefront/ProductCard";
import { CategoryFilterPanel } from "@/components/storefront/CategoryFilterPanel";
import { SortSelect } from "@/components/storefront/SortSelect";
import { Pagination } from "@/components/storefront/Pagination";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const rawSearchParams = await searchParams;
  const filters = parseCategorySearchParams(rawSearchParams);
  const locale = await getLocale();
  const t = await getTranslations();

  const validMetalTypes = new Set<string>(Object.values(MetalType));
  const validStatuses = new Set<string>(Object.values(ProductStatus));
  const validSorts = new Set<ProductSort>(["price_asc", "price_desc", "newest", "popularity"]);

  const result = await getProductsByCategory(categorySlug, {
    metalTypes: filters.metalTypes.filter((m): m is MetalType => validMetalTypes.has(m)),
    karats: filters.karats,
    stoneTypes: filters.stoneTypes,
    status: filters.status && validStatuses.has(filters.status) ? (filters.status as ProductStatus) : undefined,
    sort: validSorts.has(filters.sort as ProductSort) ? (filters.sort as ProductSort) : undefined,
    page: filters.page,
  });

  if (!result) notFound();

  const { category, products, goldPrice, facets, total, page, pageSize } = result;
  const categoryName = locale === "ru" ? category.nameRu : category.nameAz;

  const sortOptions = [
    { value: "newest", label: t("category.sortNewest") },
    { value: "price_asc", label: t("category.sortPriceAsc") },
    { value: "price_desc", label: t("category.sortPriceDesc") },
    { value: "popularity", label: t("category.sortPopularity") },
  ];

  return (
    <div className="max-w-(--spacing-container-max) mx-auto px-(--spacing-margin-mobile) md:px-(--spacing-margin-desktop) py-8 pb-24 md:pb-16">
      <nav className="text-label-sm text-on-surface-variant mb-4">
        <Link href="/">{t("nav.home")}</Link> &gt; {categoryName}
      </nav>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-(family-name:--font-headline-sm) text-headline-sm text-on-surface">{categoryName}</h1>
        <SortSelect
          value={filters.sort}
          label={t("category.sortLabel")}
          options={sortOptions}
          rawSearchParams={rawSearchParams}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <CategoryFilterPanel facets={facets} filters={filters} rawSearchParams={rawSearchParams} />

        <div className="flex-1">
          <p className="text-label-sm text-on-surface-variant mb-4">{t("category.resultsCount", { count: total })}</p>

          {products.length === 0 ? (
            <p className="text-body-md text-on-surface-variant py-12 text-center">{t("category.noResults")}</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.code} product={product} goldPricePerGramAZN={goldPrice} />
              ))}
            </div>
          )}

          <Pagination page={page} pageSize={pageSize} total={total} rawSearchParams={rawSearchParams} />
        </div>
      </div>
    </div>
  );
}
