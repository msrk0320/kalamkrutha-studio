import type { Locale } from "@/i18n/routing";
import { business } from "@/lib/content/business";
import { pricing, type Service } from "@/lib/content/services";
import { localizedUrl } from "./metadata";
import { siteUrl } from "./site";

// Only facts the studio has published. No ratings, reviews or coordinates until supplied.
export function localBusinessJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${siteUrl()}/#business`,
    name: business.name,
    url: localizedUrl(locale, "/"),
    image: `${siteUrl()}/images/hero-1.webp`,
    telephone: business.phoneE164,
    email: business.email,
    foundingDate: String(business.foundingYear),
    priceRange: "₹₹",
    paymentAccepted: business.payments.join(", "),
    currenciesAccepted: "INR",
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: business.hours.days,
      opens: business.hours.opens,
      closes: business.hours.closes,
    },
    areaServed: { "@type": "City", name: "Guntur" },
    ...(() => {
      const sameAs = Object.values(business.social).filter(Boolean);
      return sameAs.length ? { sameAs } : {};
    })(),
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl()}/#website`,
    name: business.name,
    url: localizedUrl(locale, "/"),
    inLanguage: locale,
    publisher: { "@id": `${siteUrl()}/#business` },
  };
}

export function serviceJsonLd(service: Service, name: string, locale: Locale) {
  const showPrice = pricing.showPrices && service.priceFrom !== undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: name,
    url: `${localizedUrl(locale, "/services")}#${service.id}`,
    provider: { "@id": `${siteUrl()}/#business` },
    areaServed: { "@type": "City", name: "Guntur" },
    offers: showPrice
      ? {
          "@type": "Offer",
          price: service.priceFrom,
          priceCurrency: "INR",
          priceSpecification: { "@type": "PriceSpecification", minPrice: service.priceFrom, priceCurrency: "INR" },
        }
      : undefined,
  };
}

export function breadcrumbJsonLd(locale: Locale, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: localizedUrl(locale, item.path),
    })),
  };
}
