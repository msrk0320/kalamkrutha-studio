import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/validations/contact";

const valid = {
  name: "Ravi Kumar",
  phone: "88858 58111",
  email: "",
  service: "wedding-photography",
  eventDate: "",
  message: "Wedding on 12 February in Guntur, two days.",
  website: "",
};

const errorFor = (input: Record<string, string>, field: string) => {
  const r = contactSchema.safeParse({ ...valid, ...input });
  if (r.success) return undefined;
  return r.error.issues.find((i) => i.path[0] === field)?.message;
};

describe("contactSchema phone", () => {
  it.each(["88858 58111", "+91 8885858111", "08885858111", "+91-88858-58111", "918885858111", "(888) 585-8111"])(
    "normalises %s to E.164",
    (phone) => {
      const r = contactSchema.parse({ ...valid, phone });
      expect(r.phone).toBe("+918885858111");
    },
  );

  it.each(["12345", "58858 58111", "+44 7700 900123", ""])("rejects %s", (phone) => {
    expect(errorFor({ phone }, "phone")).toBe("phone");
  });
});

describe("contactSchema fields", () => {
  it("rejects a one-letter name", () => expect(errorFor({ name: "A" }, "name")).toBe("name"));
  it("rejects a 9-character message", () => expect(errorFor({ message: "123456789" }, "message")).toBe("message"));
  it("treats an empty email as not given", () => {
    expect(contactSchema.parse(valid).email).toBeUndefined();
  });
  it("rejects a malformed email", () => expect(errorFor({ email: "bad@" }, "email")).toBe("email"));
  it("accepts a well-formed email", () => {
    expect(contactSchema.parse({ ...valid, email: "ravi@example.com" }).email).toBe("ravi@example.com");
  });
  it("rejects an unknown service", () => expect(errorFor({ service: "drone-show" }, "service")).toBe("service"));
  it("accepts walk-in services and other", () => {
    expect(contactSchema.parse({ ...valid, service: "passport" }).service).toBe("passport");
    expect(contactSchema.parse({ ...valid, service: "other" }).service).toBe("other");
  });
  it("rejects a malformed event date", () => expect(errorFor({ eventDate: "12/02/2027" }, "eventDate")).toBe("eventDate"));
  it("rejects a filled honeypot", () => expect(errorFor({ website: "x" }, "website")).toBe("website"));
});
