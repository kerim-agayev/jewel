import { prisma } from "@/lib/prisma";
import { getEffectiveGoldPricePerGramAZN } from "@/lib/pricing";
import { getStore } from "./store";

/** The price every screen must use — see CLAUDE.md "Price calculation logic". */
export async function getEffectiveGoldPrice() {
  const store = await getStore();
  const latestSnapshot = await prisma.goldPriceSnapshot.findFirst({ orderBy: { fetchedAt: "desc" } });

  return getEffectiveGoldPricePerGramAZN(store, latestSnapshot, store.appliedGoldPriceSnapshot);
}
