import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

type Doc = "privacy" | "terms" | "cookies";
type Section = { heading: string; body: string };

export async function LegalDocument({ doc }: { doc: Doc }) {
  const t = await getTranslations("Legal");
  const sections = t.raw(`${doc}.sections`) as Section[];

  return (
    <Container className="pb-16 pt-32 md:pt-44">
      <article className="max-w-3xl">
        <h1 className="text-5xl font-light md:text-6xl">{t(`${doc}.title`)}</h1>
        <p className="mt-4 text-sm text-muted">{t("updated")}</p>
        <p data-draft-notice className="mt-6 border-l-2 border-maroon bg-paper-deep p-4 text-[0.95rem]">
          {t("draftNotice")}
        </p>
        {sections.map((s) => (
          <section key={s.heading} className="mt-10">
            <h2 className="text-3xl">{s.heading}</h2>
            <p className="mt-3 text-lg text-muted">{s.body}</p>
          </section>
        ))}
      </article>
    </Container>
  );
}
