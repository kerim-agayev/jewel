import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getEffectiveGoldPrice } from "@/lib/queries/gold-price";
import { getStore } from "@/lib/queries/store";
import { waLink } from "@/lib/format";
import { GoldCalculator } from "@/components/storefront/GoldCalculator";
import { ContactCta } from "@/components/storefront/ContactCta";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("calculator");
  return { title: `${t("heading")} — Anar Jewellery` };
}

export default async function CalculatorPage() {
  const t = await getTranslations("calculator");
  const [goldPrice, store] = await Promise.all([getEffectiveGoldPrice(), getStore()]);

  return (
    <div className="max-w-(--spacing-container-max) mx-auto px-(--spacing-margin-mobile) md:px-(--spacing-margin-desktop) py-12 pb-24 md:pb-16">
      <h1 className="font-(family-name:--font-headline-sm) text-headline-sm text-on-surface text-center mb-2">
        {t("heading")}
      </h1>
      <p className="text-body-md text-on-surface-variant text-center mb-10">{t("intro")}</p>

      <GoldCalculator goldPricePerGramAZN={goldPrice.toString()} />

      {store.whatsapp && (
        <div className="max-w-xl mx-auto mt-6">
          <ContactCta
            href={waLink(store.whatsapp)}
            channel="WHATSAPP"
            newTab
            className="block w-full text-center py-3 rounded-sm bg-secondary text-on-secondary text-label-md"
          >
            {t("contactCta")}
          </ContactCta>
        </div>
      )}
    </div>
  );
}
