"use server";

import type { LeadChannel } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Fire-and-forget: called from WhatsApp/phone/Instagram links so the
 * Customers tab's ContactLead table is already collecting data in the
 * background, per CLAUDE.md "Customers (admin/customers)".
 */
export async function recordContactLead(channel: LeadChannel, productId?: string) {
  await prisma.contactLead.create({ data: { channel, productId: productId ?? null } });
}
