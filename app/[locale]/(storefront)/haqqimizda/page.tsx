import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getStore } from "@/lib/queries/store";
import { waLink } from "@/lib/format";
import { ContactCta } from "@/components/storefront/ContactCta";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return { title: `${t("heading")} — Anar Jewellery` };
}

export default async function AboutPage() {
  const t = await getTranslations("about");
  const tFooter = await getTranslations("footer");
  const tCommon = await getTranslations("common");
  const store = await getStore();

  return (
    <div className="max-w-3xl mx-auto px-(--spacing-margin-mobile) md:px-(--spacing-margin-desktop) py-12 pb-16">
      <h1 className="font-(family-name:--font-headline-sm) text-headline-sm text-on-surface mb-4">{t("heading")}</h1>
      <p className="text-body-lg text-on-surface-variant">{t("story")}</p>

      <section id="unvan" className="mt-12 scroll-mt-24">
        <h2 className="font-(family-name:--font-headline-sm) text-title-lg text-on-surface mb-4">
          {t("addressHeading")}
        </h2>

        {store.address && (
          <iframe
            title={t("addressHeading")}
            className="w-full h-64 rounded-sm border border-outline-variant"
            src={`https://www.google.com/maps?q=${encodeURIComponent(store.address)}&output=embed`}
            loading="lazy"
          />
        )}

        <dl className="mt-6 space-y-3 text-body-md">
          {store.address && (
            <div>
              <dt className="text-on-surface-variant">{t("addressHeading")}</dt>
              <dd className="text-on-surface">{store.address}</dd>
            </div>
          )}
          {store.phone && (
            <div>
              <dt className="text-on-surface-variant">{t("phoneLabel")}</dt>
              <dd>
                <ContactCta href={`tel:${store.phone}`} channel="PHONE" className="text-secondary">
                  {store.phone}
                </ContactCta>
              </dd>
            </div>
          )}
          {store.whatsapp && (
            <div>
              <dt className="text-on-surface-variant">WhatsApp</dt>
              <dd>
                <ContactCta
                  href={waLink(store.whatsapp)}
                  channel="WHATSAPP"
                  newTab
                  className="text-secondary"
                >
                  {tCommon("whatsappCta")}
                </ContactCta>
              </dd>
            </div>
          )}
          {store.instagram && (
            <div>
              <dt className="text-on-surface-variant">{t("instagramLabel")}</dt>
              <dd>
                <ContactCta href={`https://${store.instagram}`} channel="INSTAGRAM" newTab className="text-secondary">
                  {store.instagram}
                </ContactCta>
              </dd>
            </div>
          )}
          <div>
            <dt className="text-on-surface-variant">{t("hoursHeading")}</dt>
            <dd className="text-on-surface">{tFooter("workingHoursValue")}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
