import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const h = vi.hoisted(() => ({ ip: "10.0.0.1", send: vi.fn() }));

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": `${h.ip}, 172.16.0.1` }),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: h.send };
  },
}));

const { submitContact } = await import("@/app/actions/contact");

let ipCounter = 0;
const fetchMock = vi.fn();

function form(overrides: Record<string, string> = {}) {
  const fd = new FormData();
  const values = {
    name: "Ravi Kumar",
    phone: "88858 58111",
    email: "",
    service: "wedding-photography",
    eventDate: "",
    message: "Wedding on 12 February in Guntur, two days.",
    website: "",
    locale: "en",
    ...overrides,
  };
  for (const [k, v] of Object.entries(values)) fd.set(k, v);
  return fd;
}

describe("submitContact", () => {
  beforeEach(() => {
    h.ip = `10.0.0.${++ipCounter}`;
    h.send.mockReset();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    for (const k of [
      "RESEND_API_KEY",
      "ADMIN_EMAIL",
      "RESEND_FROM_EMAIL",
      "WHATSAPP_API_TOKEN",
      "WHATSAPP_PHONE_NUMBER_ID",
      "ADMIN_WHATSAPP_NUMBER",
      "TURNSTILE_SECRET_KEY",
    ])
      vi.stubEnv(k, "");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("does not claim success when no delivery channel is configured", async () => {
    const r = await submitContact(null, form());
    expect(r.status).toBe("no-channel");
    if (r.status === "no-channel") expect(r.whatsappUrl).toMatch(/^https:\/\/wa\.me\/918885858111\?text=.*Ravi/);
  });

  it("succeeds when the Resend admin email is sent", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("ADMIN_EMAIL", "kalamkrutha@gmail.com");
    h.send.mockResolvedValue({ data: { id: "1" }, error: null });
    const r = await submitContact(null, form());
    expect(r).toEqual({ status: "ok" });
    expect(h.send).toHaveBeenCalledTimes(1);
    expect(h.send.mock.calls[0]![0]).toMatchObject({ to: "kalamkrutha@gmail.com" });
  });

  it("sends a customer confirmation only with a verified sender and an email", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("ADMIN_EMAIL", "kalamkrutha@gmail.com");
    vi.stubEnv("RESEND_FROM_EMAIL", "Kalamkrutha <hello@kalamkrutha.in>");
    h.send.mockResolvedValue({ data: { id: "1" }, error: null });
    await submitContact(null, form({ email: "ravi@example.com" }));
    expect(h.send).toHaveBeenCalledTimes(2);
    expect(h.send.mock.calls[1]![0]).toMatchObject({ to: "ravi@example.com" });
  });

  it("reports an error with a WhatsApp fallback when every channel fails", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("ADMIN_EMAIL", "kalamkrutha@gmail.com");
    h.send.mockResolvedValue({ data: null, error: { message: "boom" } });
    const r = await submitContact(null, form());
    expect(r.status).toBe("error");
  });

  it("sends a WhatsApp alert when the Cloud API is configured", async () => {
    vi.stubEnv("WHATSAPP_API_TOKEN", "tok");
    vi.stubEnv("WHATSAPP_PHONE_NUMBER_ID", "123");
    vi.stubEnv("ADMIN_WHATSAPP_NUMBER", "918885858111");
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
    const r = await submitContact(null, form());
    expect(r).toEqual({ status: "ok" });
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://graph.facebook.com/v21.0/123/messages");
    expect(JSON.parse((init as RequestInit).body as string).text.body).toMatch(/^New Inquiry\n\nName: Ravi Kumar/);
  });

  it("silently accepts and drops a filled honeypot", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("ADMIN_EMAIL", "kalamkrutha@gmail.com");
    const r = await submitContact(null, form({ website: "http://spam" }));
    expect(r).toEqual({ status: "ok" });
    expect(h.send).not.toHaveBeenCalled();
  });

  it("returns field errors for invalid input", async () => {
    const r = await submitContact(null, form({ name: "A", phone: "12345" }));
    expect(r.status).toBe("invalid");
    if (r.status === "invalid") expect(r.fieldErrors).toMatchObject({ name: "name", phone: "phone" });
  });

  it("fails the captcha when Turnstile rejects the token", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    fetchMock.mockResolvedValue(Response.json({ success: false }));
    const r = await submitContact(null, form({ "cf-turnstile-response": "tok" }));
    expect(r.status).toBe("captcha-failed");
  });

  it("rate-limits the sixth submission from one address", async () => {
    for (let i = 0; i < 5; i++) await submitContact(null, form());
    const r = await submitContact(null, form());
    expect(r.status).toBe("rate-limited");
  });
});
