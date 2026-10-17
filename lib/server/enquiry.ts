import "server-only";
import type { ContactData } from "@/lib/validations/contact";

/** The enquiry fields every notification channel needs, already validated. */
export type Enquiry = ContactData & { serviceLabel: string };

export function enquiryLines(e: Enquiry): [label: string, value: string][] {
  return [
    ["Name", e.name],
    ["Phone", e.phone],
    ["Email", e.email ?? "—"],
    ["Service", e.serviceLabel],
    ["Event date", e.eventDate ?? "—"],
    ["Message", e.message],
  ];
}
