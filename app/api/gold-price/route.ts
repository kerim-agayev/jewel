import { NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";
import { refreshGoldPriceSnapshot, type GoldPriceSnapshotStore } from "@/lib/gold-api";
import { prisma } from "@/lib/prisma";

const store: GoldPriceSnapshotStore = {
  create: (data) => prisma.goldPriceSnapshot.create({ data }),
  findLatest: () => prisma.goldPriceSnapshot.findFirst({ orderBy: { fetchedAt: "desc" } }),
};

/**
 * Called by Vercel Cron (see vercel.json) a few times a day, or manually with
 * `Authorization: Bearer $CRON_SECRET`. Vercel automatically attaches that
 * same header to its own cron-triggered requests, so this one check covers
 * both callers — see CLAUDE.md "API security".
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snapshot = await refreshGoldPriceSnapshot(store, {
    apiUrl: process.env.GOLD_API_URL!,
    usdToAznRate: new Prisma.Decimal(process.env.USD_TO_AZN_RATE ?? "1.7"),
  });

  return NextResponse.json({
    pricePerGramAZN: snapshot.pricePerGramAZN.toString(),
    pricePerOunceUSD: snapshot.pricePerOunceUSD.toString(),
    fetchedAt: snapshot.fetchedAt,
  });
}
