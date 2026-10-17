"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { startTransition, useActionState, useEffect, useRef, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { submitContact, type ContactResult } from "@/app/actions/contact";
import { buttonClasses } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { contactSchema, serviceOptions, type ContactData, type ContactInput } from "@/lib/validations/contact";
import { Turnstile } from "./Turnstile";

const inputClass =
  "mt-2 block w-full rounded-none border-0 border-b border-ink/40 bg-transparent px-0 py-3 text-lg text-ink placeholder:text-muted/70 focus:border-maroon focus:outline-none focus:ring-0 aria-[invalid=true]:border-maroon";
const labelClass = "block text-xs font-medium uppercase tracking-[0.22em] text-muted";

export function ContactForm({ serviceLabels }: { serviceLabels: Record<(typeof serviceOptions)[number], string> }) {
  const t = useTranslations("Form");
  const locale = useLocale();
  const statusRef = useRef<HTMLDivElement>(null);
  const [result, formAction, pending] = useActionState<ContactResult | null, FormData>(submitContact, null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput, unknown, ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", phone: "", email: "", service: undefined, eventDate: "", message: "", website: "" },
  });

  useEffect(() => {
    if (!result) return;
    if (result.status === "ok") reset();
    if (result.status !== "invalid") statusRef.current?.focus();
  }, [result, reset]);

  const serverErrors = result?.status === "invalid" ? result.fieldErrors : {};
  const errorKey = (field: keyof ContactInput) => errors[field]?.message ?? serverErrors[field];
  const fieldProps = (field: keyof ContactInput) => {
    const key = errorKey(field);
    return {
      "aria-invalid": key ? true : undefined,
      "aria-describedby": key ? `${field}-error` : undefined,
    } as const;
  };
  const errorText = (field: keyof ContactInput) => {
    const key = errorKey(field);
    return key ? (
      <p id={`${field}-error`} className="mt-2 text-sm text-maroon">
        {t(`errors.${key}` as "errors.name")}
      </p>
    ) : null;
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    void handleSubmit(() => {
      if (pending) return;
      const data = new FormData(form);
      startTransition(() => formAction(data));
    })(event);
  };

  const done = result?.status === "ok";

  return (
    <div>
      <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
        {done && (
          <div className="mb-8 border-l-2 border-maroon bg-paper-deep p-5">
            <p className="font-display text-2xl">{t("success")}</p>
            <p className="mt-1 text-muted">{t("successBody")}</p>
          </div>
        )}
        {(result?.status === "no-channel" || result?.status === "error") && (
          <div className="mb-8 border-l-2 border-maroon bg-paper-deep p-5">
            <p>{t(result.status === "error" ? "error" : "noChannel")}</p>
            <a
              href={result.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses("whatsapp", "md", "mt-4")}
            >
              <WhatsAppIcon /> {t("sendOnWhatsapp")}
            </a>
          </div>
        )}
        {result?.status === "rate-limited" && <p className="mb-8 border-l-2 border-maroon p-5">{t("rateLimited")}</p>}
        {result?.status === "captcha-failed" && <p className="mb-8 border-l-2 border-maroon p-5">{t("captchaFailed")}</p>}
      </div>

      <form onSubmit={onSubmit} noValidate className="grid gap-8 sm:grid-cols-2">
        <input type="hidden" name="locale" value={locale} />

        <div>
          <label htmlFor="name" className={labelClass}>
            {t("name")} <span aria-hidden="true">*</span>
          </label>
          <input id="name" autoComplete="name" required className={inputClass} {...register("name")} {...fieldProps("name")} />
          {errorText("name")}
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            {t("phone")} <span aria-hidden="true">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            className={inputClass}
            {...register("phone")}
            {...fieldProps("phone")}
          />
          {errorText("phone")}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            {t("email")}
          </label>
          <input id="email" type="email" autoComplete="email" className={inputClass} {...register("email")} {...fieldProps("email")} />
          {errorText("email")}
        </div>

        <div>
          <label htmlFor="eventDate" className={labelClass}>
            {t("eventDate")}
          </label>
          <input id="eventDate" type="date" className={inputClass} {...register("eventDate")} {...fieldProps("eventDate")} />
          {errorText("eventDate")}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="service" className={labelClass}>
            {t("service")} <span aria-hidden="true">*</span>
          </label>
          <select id="service" required className={inputClass} defaultValue="" {...register("service")} {...fieldProps("service")}>
            <option value="" disabled>
              {t("servicePlaceholder")}
            </option>
            {serviceOptions.map((s) => (
              <option key={s} value={s}>
                {serviceLabels[s]}
              </option>
            ))}
          </select>
          {errorText("service")}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClass}>
            {t("message")} <span aria-hidden="true">*</span>
          </label>
          <p id="message-hint" className="mt-1 text-sm text-muted">
            {t("messageHint")}
          </p>
          <textarea
            id="message"
            rows={5}
            required
            className={`${inputClass} resize-y`}
            {...register("message")}
            {...fieldProps("message")}
            aria-describedby={errorKey("message") ? "message-hint message-error" : "message-hint"}
          />
          {errorText("message")}
        </div>

        {/* Honeypot: hidden from people and assistive tech, filled by naive bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="website">{t("honeypot")}</label>
          <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>

        <div className="sm:col-span-2">
          <Turnstile locale={locale} />
        </div>

        <div className="sm:col-span-2">
          <button type="submit" disabled={pending} aria-disabled={pending} className={buttonClasses("primary", "lg")}>
            {pending && (
              <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper" />
            )}
            {pending ? t("sending") : t("submit")}
          </button>
        </div>
      </form>
    </div>
  );
}
