import type { MetalType, Prisma, ProductStatus } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { resolveProductPrice } from "@/lib/pricing";
import { karatLabel, puritiesForKarat } from "@/lib/purity";
import { getEffectiveGoldPrice } from "./gold-price";
import { getCategoryBySlug } from "./categories";

const PAGE_SIZE = 12;

export type ProductSort = "price_asc" | "price_desc" | "newest" | "popularity";

interface ProductFilters {
  metalTypes?: MetalType[];
  karats?: string[];
  stoneTypes?: (string | null)[];
  status?: ProductStatus;
  page?: number;
  sort?: ProductSort;
}

export interface CategoryFacets {
  metalTypes: MetalType[];
  karats: string[];
  stoneTypes: (string | null)[];
  statuses: ProductStatus[];
}

type CategoryProduct = Prisma.ProductGetPayload<{ include: { images: true } }>;

function computeFacets(products: CategoryProduct[]): CategoryFacets {
  return {
    metalTypes: [...new Set(products.map((p) => p.metalType))],
    karats: [...new Set(products.filter((p) => p.purity != null).map((p) => karatLabel(p.purity!)))],
    stoneTypes: [...new Set(products.map((p) => p.stoneType))],
    statuses: [...new Set(products.map((p) => p.status))],
  };
}

function matchesFilters(product: CategoryProduct, filters: ProductFilters): boolean {
  if (filters.metalTypes?.length && !filters.metalTypes.includes(product.metalType)) return false;
  if (filters.status && product.status !== filters.status) return false;
  if (filters.stoneTypes?.length && !filters.stoneTypes.includes(product.stoneType)) return false;

  if (filters.karats?.length) {
    const purities = filters.karats.flatMap(puritiesForKarat);
    if (product.purity == null || !purities.includes(product.purity)) return false;
  }

  return true;
}

/**
 * Price is never a stored column (it's computed live — see resolveProductPrice()),
 * so filtering/price-sorting happens in memory after fetching the category's full
 * product list. Fine at MVP scale (largest category is ~80 items).
 */
export async function getProductsByCategory(categorySlug: string, filters: ProductFilters = {}) {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return null;

  const [allProducts, goldPrice] = await Promise.all([
    prisma.product.findMany({ where: { categoryId: category.id }, include: { images: { orderBy: { order: "asc" } } } }),
    getEffectiveGoldPrice(),
  ]);

  const facets = computeFacets(allProducts);
  const filtered = allProducts.filter((p) => matchesFilters(p, filters));

  let sorted: CategoryProduct[];
  switch (filters.sort) {
    case "price_asc":
      sorted = [...filtered].sort((a, b) => resolveProductPrice(a, goldPrice).comparedTo(resolveProductPrice(b, goldPrice)));
      break;
    case "price_desc":
      sorted = [...filtered].sort((a, b) => resolveProductPrice(b, goldPrice).comparedTo(resolveProductPrice(a, goldPrice)));
      break;
    case "newest":
    case "popularity": // no sales signal to rank by yet — falls back to newest, see docs/phase_1/decisions.md
    default:
      sorted = [...filtered].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  const page = Math.max(filters.page ?? 1, 1);
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = sorted.slice(start, start + PAGE_SIZE);

  return {
    category,
    products: pageItems.map((p) => ({ ...p, category })),
    goldPrice,
    facets,
    total: sorted.length,
    page,
    pageSize: PAGE_SIZE,
  };
}

export async function getNewArrivals(limit = 8) {
  const [products, goldPrice] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { images: { orderBy: { order: "asc" }, take: 1 }, category: true },
    }),
    getEffectiveGoldPrice(),
  ]);
  return { products, goldPrice };
}

export async function getProductByCode(code: string) {
  return prisma.product.findUnique({
    where: { code },
    include: { images: { orderBy: { order: "asc" } }, category: true },
  });
}

export async function getSimilarProducts(categoryId: string, excludeId: string, limit = 4) {
  const [products, goldPrice] = await Promise.all([
    prisma.product.findMany({
      where: { categoryId, id: { not: excludeId } },
      include: { images: { orderBy: { order: "asc" }, take: 1 }, category: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    }),
    getEffectiveGoldPrice(),
  ]);
  return { products, goldPrice };
}
