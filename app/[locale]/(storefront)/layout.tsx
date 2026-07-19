import { getStore } from "@/lib/queries/store";
import { getCategories } from "@/lib/queries/categories";
import { getEffectiveGoldPrice } from "@/lib/queries/gold-price";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const [store, categories, goldPricePerGramAZN] = await Promise.all([
    getStore(),
    getCategories(),
    getEffectiveGoldPrice(),
  ]);

  return (
    <>
      <Header categories={categories} goldPricePerGramAZN={goldPricePerGramAZN} />
      <main>{children}</main>
      <Footer store={store} />
    </>
  );
}
