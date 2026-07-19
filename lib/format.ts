import type { Prisma } from "@/app/generated/prisma/client";

/**
 * az-AZ-style grouping (dot for thousands, comma for decimals), formatted via
 * the universally-supported "en-US" locale and swapped afterward — every
 * ECMA-402 engine guarantees "en-US", but "az-AZ" is not guaranteed to be
 * present everywhere (a real browser's Chromium build formatted it
 * differently from Node, causing a client/server hydration mismatch in the
 * gold calculator — see docs/phase_1/bugs.md).
 */
function formatNumberAZ(value: number, maximumFractionDigits = 2): string {
  const enFormatted = new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
  return enFormatted.replace(/,/g, "§").replace(/\./g, ",").replace(/§/g, ".");
}

export function formatAZN(amount: Prisma.Decimal | number): string {
  const value = typeof amount === "number" ? amount : amount.toNumber();
  return `${formatNumberAZ(value)} AZN`;
}

export function waLink(phone: string): string {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}
