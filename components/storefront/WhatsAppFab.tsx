import type { Store } from "@/app/generated/prisma/client";
import { waLink } from "@/lib/format";
import { ContactCta } from "./ContactCta";

export function WhatsAppFab({ store }: { store: Store }) {
  if (!store.whatsapp) return null;

  return (
    <ContactCta
      href={waLink(store.whatsapp)}
      channel="WHATSAPP"
      newTab
      className="fixed bottom-20 md:bottom-6 right-4 z-20 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center text-2xl shadow-lg"
    >
      💬
    </ContactCta>
  );
}
