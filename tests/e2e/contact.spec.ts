import { expect, test } from "@playwright/test";

test("empty submit shows inline errors and focuses the name field", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByText("Please enter your name (at least 2 characters).")).toBeVisible();
  await expect(page.getByText("Please enter a valid 10-digit Indian mobile number.")).toBeVisible();
  await expect(page.getByLabel("Your name")).toBeFocused();
  await expect(page.getByLabel("Your name")).toHaveAttribute("aria-invalid", "true");
});

test("valid submit without a delivery channel offers WhatsApp instead of claiming success", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Your name").fill("Ravi Kumar");
  await page.getByLabel("Phone number").fill("88858 58111");
  await page.getByLabel("What do you need?").selectOption("wedding-photography");
  await page.getByLabel("Tell us about your function").fill("Wedding on 12 February in Guntur, two days.");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  const status = page.getByRole("status");
  await expect(status.getByRole("link", { name: "Send on WhatsApp" })).toHaveAttribute("href", /wa\.me\/918885858111/);
  await expect(page.getByText("Thank you, your message has been received.")).toHaveCount(0);
  await expect(status).toBeFocused();
});
