"use client";

import type { LeadChannel } from "@/app/generated/prisma/client";
import { recordContactLead } from "@/lib/leads";

interface ContactCtaProps {
  href: string;
  channel: LeadChannel;
  productId?: string;
  className?: string;
  children: React.ReactNode;
  newTab?: boolean;
}

/** A WhatsApp/phone/Instagram link that also logs a ContactLead — see lib/leads.ts. */
export function ContactCta({ href, channel, productId, className, children, newTab }: ContactCtaProps) {
  return (
    <a
      href={href}
      className={className}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      onClick={() => {
        recordContactLead(channel, productId).catch(() => {});
      }}
    >
      {children}
    </a>
  );
}
