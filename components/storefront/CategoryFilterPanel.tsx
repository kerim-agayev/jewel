import type { MetalType, ProductStatus } from "@/app/generated/prisma/client";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { CategoryFacets } from "@/lib/queries/products";
import type { ParsedCategoryFilters } from "@/lib/category-filters";
import { buildFilterToggleHref } from "@/lib/category-filters";

interface CategoryFilterPanelProps {
  facets: CategoryFacets;
  filters: ParsedCategoryFilters;
  rawSearchParams: Record<string, string | string[] | undefined>;
}

function FilterGroup({
  title,
  options,
  isChecked,
  hrefFor,
}: {
  title: string;
  options: { value: string; label: string }[];
  isChecked: (value: string) => boolean;
  hrefFor: (value: string) => string;
}) {
  if (options.length === 0) return null;

  return (
    <fieldset className="mb-5">
      <legend className="text-label-md text-on-surface mb-2">{title}</legend>
      <ul className="space-y-1.5">
        {options.map((option) => (
          <li key={option.value}>
            <Link
              href={hrefFor(option.value)}
              className="flex items-center gap-2 text-body-md text-on-surface-variant"
            >
              <span
                aria-hidden
                className={`inline-block w-4 h-4 rounded-[3px] border border-outline ${isChecked(option.value) ? "bg-secondary border-secondary" : "bg-surface-container-lowest"}`}
              />
              {option.label}
            </Link>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

export async function CategoryFilterPanel({ facets, filters, rawSearchParams }: CategoryFilterPanelProps) {
  const t = await getTranslations();

  const body = (
    <>
      <FilterGroup
        title={t("category.metalType")}
        options={facets.metalTypes.map((m: MetalType) => ({ value: m, label: t(`metalType.${m}`) }))}
        isChecked={(v) => filters.metalTypes.includes(v)}
        hrefFor={(v) => buildFilterToggleHref(rawSearchParams, "metal", v)}
      />
      <FilterGroup
        title={t("category.purity")}
        options={facets.karats.map((k) => ({ value: k, label: k }))}
        isChecked={(v) => filters.karats.includes(v)}
        hrefFor={(v) => buildFilterToggleHref(rawSearchParams, "karat", v)}
      />
      <FilterGroup
        title={t("category.stoneType")}
        options={facets.stoneTypes.map((s) => ({ value: s ?? "none", label: s ?? t("category.stoneless") }))}
        isChecked={(v) => filters.stoneTypes.includes(v === "none" ? null : v)}
        hrefFor={(v) => buildFilterToggleHref(rawSearchParams, "stone", v)}
      />
      <FilterGroup
        title={t("category.status")}
        options={facets.statuses.map((s: ProductStatus) => ({ value: s, label: t(`productStatus.${s}`) }))}
        isChecked={(v) => filters.status === v}
        hrefFor={(v) => buildFilterToggleHref(rawSearchParams, "status", v)}
      />
    </>
  );

  return (
    <>
      <aside className="hidden md:block w-56 shrink-0 bg-surface-container-lowest rounded-sm p-4 h-fit">
        <p className="text-title-lg text-on-surface mb-4">{t("category.filters")}</p>
        {body}
      </aside>
      <details className="md:hidden mb-4 bg-surface-container-lowest rounded-sm p-4">
        <summary className="text-title-lg text-on-surface cursor-pointer">{t("category.filters")}</summary>
        <div className="mt-4">{body}</div>
      </details>
    </>
  );
}
