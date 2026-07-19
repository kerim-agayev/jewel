"use server";

import { prisma } from "@/lib/prisma";
import { resolveProductPrice } from "@/lib/pricing";
import { formatAZN } from "@/lib/format";
import { getEffectiveGoldPrice } from "./queries/gold-price";

export interface FavoriteProductSummary {
  code: string;
  categorySlug: string;
  titleAz: string;
  titleRu: string;
  status: "NEW" | "USED";
  imageUrl: string | null;
  imageAltAz: string | null;
  imageAltRu: string | null;
  priceFormatted: string;
}

/**
 * Favorites are localStorage-only (see lib/favorites.ts) — this looks up the
 * actual product rows for display. Returns plain, already-formatted data
 * (not raw Prisma/Decimal objects) since Server Action return values cross
 * the server/client boundary and Decimal instances don't survive that intact.
 */
export async function getFavoriteProducts(codes: string[]): Promise<FavoriteProductSummary[]> {
  if (codes.length === 0) return [];

  const [products, goldPrice] = await Promise.all([
    prisma.product.findMany({
      where: { code: { in: codes } },
      include: { images: { orderBy: { order: "asc" }, take: 1 }, category: true },
    }),
    getEffectiveGoldPrice(),
  ]);

  return products.map((product) => ({
    code: product.code,
    categorySlug: product.category.slug,
    titleAz: product.titleAz,
    titleRu: product.titleRu,
    status: product.status,
    imageUrl: product.images[0]?.url ?? null,
    imageAltAz: product.images[0]?.altAz ?? null,
    imageAltRu: product.images[0]?.altRu ?? null,
    priceFormatted: formatAZN(resolveProductPrice(product, goldPrice)),
  }));
}
