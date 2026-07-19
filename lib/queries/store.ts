import { prisma } from "@/lib/prisma";

/** The Store model is a single record — see CLAUDE.md "Extensibility notes". */
export async function getStore() {
  const store = await prisma.store.findFirst({ include: { appliedGoldPriceSnapshot: true } });
  if (!store) {
    throw new Error("No Store record found — run `npx prisma db seed` first");
  }
  return store;
}
