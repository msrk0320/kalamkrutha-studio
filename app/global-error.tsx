"use client";

// Last-resort boundary: replaces the root layout, so it cannot rely on fonts, Tailwind or translations.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#F5F2ED",
          color: "#232323",
          fontFamily: "Georgia, serif",
          padding: 16,
        }}
      >
        <main style={{ maxWidth: 520 }}>
          <h1 style={{ fontWeight: 400, fontSize: 40, margin: 0 }}>Something went wrong</h1>
          <p style={{ fontFamily: "system-ui, sans-serif", color: "#5E554C", lineHeight: 1.6 }}>
            Please try again. If the problem continues, call or WhatsApp Kalamkrutha Digital Studio on +91 88858 58111.
          </p>
          <p style={{ display: "flex", gap: 12, flexWrap: "wrap", fontFamily: "system-ui, sans-serif" }}>
            <button
              type="button"
              onClick={reset}
              style={{ background: "#7B1E2B", color: "#F5F2ED", border: 0, borderRadius: 999, padding: "12px 22px", cursor: "pointer" }}
            >
              Try again
            </button>
            <a href="https://wa.me/918885858111" style={{ color: "#7B1E2B", padding: "12px 0" }}>
              WhatsApp us
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
