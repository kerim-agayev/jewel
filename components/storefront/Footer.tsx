import type { Store } from "@/app/generated/prisma/client";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { waLink } from "@/lib/format";
import { NAV_ITEMS } from "./nav-items";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ContactCta } from "./ContactCta";

export async function Footer({ store }: { store: Store }) {
  const t = await getTranslations();

  return (
    <footer className="mt-16 mb-16 md:mb-0 border-t border-outline-variant bg-surface-container-low">
      <div className="max-w-(--spacing-container-max) mx-auto px-(--spacing-margin-mobile) md:px-(--spacing-margin-desktop) py-10 grid gap-8 md:grid-cols-3">
        <div>
          <p className="font-(family-name:--font-headline-sm) text-title-lg text-on-surface mb-2">Anar Jewellery</p>
          <p className="text-body-md text-on-surface-variant">{t("footer.tagline")}</p>
        </div>

        <div>
          <p className="text-label-md text-on-surface mb-3">{t("footer.linksHeading")}</p>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-body-md text-on-surface-variant">
                {t("nav.home")}
              </Link>
            </li>
            {NAV_ITEMS.filter((item) => item.key !== "home").map((item) => (
              <li key={item.key}>
                <Link href={item.href} className="text-body-md text-on-surface-variant">
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-label-md text-on-surface mb-3">{t("footer.contactHeading")}</p>
          <p className="text-body-md text-on-surface-variant mb-1">{store.address}</p>
          <p className="text-body-md text-on-surface-variant mb-1">
            {t("footer.workingHours")}: {t("footer.workingHoursValue")}
          </p>
          {store.whatsapp && (
            <ContactCta href={waLink(store.whatsapp)} channel="WHATSAPP" newTab className="block text-body-md text-secondary mt-2">
              {t("common.whatsappCta")}
            </ContactCta>
          )}
          {store.phone && (
            <ContactCta href={`tel:${store.phone}`} channel="PHONE" className="block text-body-md text-secondary mt-1">
              {store.phone}
            </ContactCta>
          )}
          {store.instagram && (
            <ContactCta href={`https://${store.instagram}`} channel="INSTAGRAM" newTab className="block text-body-md text-secondary mt-1">
              {t("common.instagram")}
            </ContactCta>
          )}
        </div>
      </div>

      <div className="border-t border-outline-variant px-(--spacing-margin-mobile) md:px-(--spacing-margin-desktop) py-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-label-sm text-on-surface-variant">{t("footer.copyright")}</p>
        <LanguageSwitcher />
      </div>
    </footer>
  );
}
