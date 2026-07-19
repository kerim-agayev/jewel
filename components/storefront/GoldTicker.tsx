import type { Prisma } from "@/app/generated/prisma/client";
import { getTranslations } from "next-intl/server";
import { formatAZN } from "@/lib/format";

interface GoldTickerProps {
  goldPricePerGramAZN: Prisma.Decimal;
}

export async function GoldTicker({ goldPricePerGramAZN }: GoldTickerProps) {
  const t = await getTranslations("ticker");
  const price585 = goldPricePerGramAZN.times(585).div(1000);
  const price750 = goldPricePerGramAZN.times(750).div(1000);

  return (
    <div className="bg-inverse-surface text-inverse-on-surface text-label-sm py-2 px-4 text-center">
      {t("label")}: 1qr 585 {t("karatSuffix")} = {formatAZN(price585)} · 1qr 750 {t("karatSuffix")} = {formatAZN(price750)}
    </div>
  );
}
