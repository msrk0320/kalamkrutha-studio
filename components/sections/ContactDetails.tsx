import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { business, fullAddress } from "@/lib/content/business";
import { whatsappUrl } from "@/lib/whatsapp";

function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 border-b border-line py-4 last:border-b-0">
      <span className="mt-1 text-maroon">{icon}</span>
      <div>
        <dt className="text-xs font-medium uppercase tracking-[0.22em] text-muted">{label}</dt>
        <dd className="mt-1 text-lg">{children}</dd>
      </div>
    </div>
  );
}

export async function ContactDetails() {
  const t = await getTranslations("Contact");
  const tc = await getTranslations("Common");
  const ta = await getTranslations("About");
  const link = "underline-offset-4 hover:text-maroon hover:underline";

  return (
    <dl>
      <Row icon={<PhoneIcon />} label={t("phone")}>
        <a href={`tel:${business.phoneE164}`} className={link}>
          {business.phoneDisplay}
        </a>
      </Row>
      <Row icon={<WhatsAppIcon />} label="WhatsApp">
        <a href={whatsappUrl(tc("whatsappMessage"))} target="_blank" rel="noopener noreferrer" className={link}>
          {tc("whatsappUs")}
        </a>
      </Row>
      <Row icon={<MailIcon />} label={t("email")}>
        <a href={`mailto:${business.email}`} className={`${link} break-all`}>
          {business.email}
        </a>
      </Row>
      <Row icon={<MapPinIcon />} label={t("address")}>
        <address className="not-italic">{fullAddress}</address>
      </Row>
      <Row icon={<ClockIcon />} label={t("hours")}>
        {ta("hours")}
      </Row>
    </dl>
  );
}
