import "server-only";
import { business } from "@/lib/content/business";
import { enquiryLines, type Enquiry } from "./enquiry";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

function layout(title: string, body: string): string {
  return `<!doctype html><html><body style="margin:0;background:#F5F2ED;font-family:Arial,Helvetica,sans-serif;color:#232323">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F2ED;padding:32px 16px"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #D9D1C5">
<tr><td style="padding:28px 32px;border-bottom:1px solid #D9D1C5">
<div style="font-family:Georgia,serif;font-size:24px">Kalamkrutha</div>
<div style="font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#5E554C">Digital Studio</div></td></tr>
<tr><td style="padding:28px 32px"><h1 style="margin:0 0 16px;font-family:Georgia,serif;font-weight:normal;font-size:22px;color:#7B1E2B">${escape(title)}</h1>${body}</td></tr>
<tr><td style="padding:20px 32px;border-top:1px solid #D9D1C5;font-size:12px;color:#5E554C">${escape(business.name)} · ${escape(business.phoneDisplay)} · ${escape(business.email)}</td></tr>
</table></td></tr></table></body></html>`;
}

export function adminEmailHtml(e: Enquiry): string {
  const rows = enquiryLines(e)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px 8px 0;vertical-align:top;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#5E554C;white-space:nowrap">${escape(k)}</td><td style="padding:8px 0;font-size:15px;white-space:pre-wrap">${escape(v)}</td></tr>`,
    )
    .join("");
  return layout("New website enquiry", `<table role="presentation" cellpadding="0" cellspacing="0" width="100%">${rows}</table>`);
}

export function customerEmailHtml(e: Enquiry): string {
  return layout(
    "Thank you, your message has been received.",
    `<p style="font-size:15px;line-height:1.6;margin:0 0 12px">Dear ${escape(e.name)},</p>
<p style="font-size:15px;line-height:1.6;margin:0 0 12px">Thank you for contacting ${escape(business.name)} about <strong>${escape(e.serviceLabel)}</strong>. We will reply on WhatsApp or by phone soon.</p>
<p style="font-size:15px;line-height:1.6;margin:0">For anything urgent, call or WhatsApp us on ${escape(business.phoneDisplay)}.</p>`,
  );
}
