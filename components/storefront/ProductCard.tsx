import type { Prisma } from "@/app/generated/prisma/client";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { resolveProductPrice, type PricingInput } from "@/lib/pricing";
import { formatAZN } from "@/lib/format";
import { karatLabel } from "@/lib/purity";
import { FavoriteButton } from "./FavoriteButton";

interface ProductCardProduct extends PricingInput {
  code: string;
  titleAz: string;
  titleRu: string;
  status: "NEW" | "USED";
  weightGrams: Prisma.Decimal | null;
  purity: number | null;
  images: { url: string; altAz: string; altRu: string }[];
  category: { slug: string; nameAz: string; nameRu: string };
}

interface ProductCardProps {
  product: ProductCardProduct;
  goldPricePerGramAZN: Prisma.Decimal;
}

export function ProductCard({ product, goldPricePerGramAZN }: ProductCardProps) {
  const locale = useLocale();
  const title = locale === "ru" ? product.titleRu : product.titleAz;
  const image = product.images[0];
  const price = resolveProductPrice(product, goldPricePerGramAZN);

  return (
    <Link href={`/${product.category.slug}/${product.code}`} className="group block">
      <div className="relative aspect-square rounded-sm overflow-hidden bg-surface-container-low">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element -- seed images are external Pexels/R2 URLs, not part of the build-time asset set
          <img src={image.url} alt={locale === "ru" ? image.altRu : image.altAz} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
        )}
        <FavoriteButton code={product.code} className="absolute top-2 right-2 text-title-lg text-on-surface bg-surface-container-lowest/80 rounded-full w-8 h-8 flex items-center justify-center" />
        {product.status === "USED" && (
          <span className="absolute top-2 left-2 bg-surface-container-lowest/90 text-label-sm px-2 py-0.5 rounded-sm">
            {locale === "ru" ? "Б/у" : "İşlənmiş"}
          </span>
        )}
      </div>
      <p className="mt-2 text-body-md text-on-surface">{title}</p>
      {product.purity != null && product.weightGrams != null && (
        <p className="text-label-sm text-on-surface-variant">
          {karatLabel(product.purity)} · {product.weightGrams.toString()} qr
        </p>
      )}
      <p className="font-(family-name:--font-headline-sm) text-title-lg text-secondary mt-1">{formatAZN(price)}</p>
    </Link>
  );
}
