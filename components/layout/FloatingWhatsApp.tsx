import { getTranslations } from "next-intl/server";
import { WhatsAppIcon } from "@/components/ui/icons";
import { whatsappUrl } from "@/lib/whatsapp";

export async function FloatingWhatsApp() {
  const t = await getTranslations("Common");
  return (
    <a
      href={whatsappUrl(t("whatsappMessage"))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsappUs")}
      className="fixed bottom-4 right-4 z-30 inline-flex size-14 items-center justify-center rounded-full bg-whatsapp text-[#062b14] shadow-lg shadow-ink/20 transition-transform hover:scale-105 md:bottom-6 md:right-6"
    >
      <WhatsAppIcon width={28} height={28} />
    </a>
  );
}
